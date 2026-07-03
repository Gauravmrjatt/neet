import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const LGD_API = 'https://ckandev.indiadataportal.com/api/3/action/datastore_search?resource_id=42cd589e-2dc4-4f9c-a245-f201cee357e7&limit=7077'

function formatSlug(val: string): string {
  return val
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

interface LgdRecord {
  sub_district_name: string
  sub_district_code: string
  district_name: string
  state_name: string
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Fetching tehsil data from LGD API...')

  const res = await fetch(LGD_API)
  if (!res.ok) throw new Error(`LGD API returned ${res.status}`)
  const data = await res.json()
  if (!data.success) throw new Error('LGD API failed')
  const rawRecords = data.result.records as LgdRecord[]
  payload.logger.info(`Fetched ${rawRecords.length} sub-district records`)

  const allStates = await payload.find({ collection: 'states', limit: 100, depth: 0 })
  const stateByName = new Map<string, string>()
  for (const s of allStates.docs) stateByName.set((s.name as string).toLowerCase().trim(), s.id)
  payload.logger.info(`Loaded ${stateByName.size} states`)

  const allDistricts = await payload.find({ collection: 'districts', limit: 2000, depth: 1 })
  const districtByStateAndName = new Map<string, string>()
  const districtInfo = new Map<string, { name: string; slug: string }>()
  for (const d of allDistricts.docs) {
    const stateId = typeof d.state === 'object' ? (d.state as any)?.id : d.state
    if (!stateId) continue
    districtByStateAndName.set(`${stateId}::${(d.name as string).toLowerCase().trim()}`, d.id)
    districtInfo.set(d.id, { name: d.name as string, slug: d.slug as string })
  }
  payload.logger.info(`Loaded ${allDistricts.docs.length} districts`)

  const stateNameOverrides: Record<string, string> = {
    'the dadra and nagar haveli and daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
  }

  let noState = 0
  let noDistrict = 0
  const toCreate: any[] = []
  const slugSet = new Set<string>()

  for (const record of rawRecords) {
    const stateKey = (stateNameOverrides[record.state_name.toLowerCase().trim()] || record.state_name).toLowerCase().trim()
    const stateId = stateByName.get(stateKey)
    if (!stateId) { noState++; continue }

    const districtKey = `${stateId}::${record.district_name.toLowerCase().trim()}`
    const districtId = districtByStateAndName.get(districtKey)
    if (!districtId) { noDistrict++; continue }

    const name = record.sub_district_name.trim()
    let slug = formatSlug(name)

    if (slugSet.has(slug)) {
      const di = districtInfo.get(districtId)
      const suffix = di ? formatSlug(di.name) : 'x'
      let newSlug = `${slug}-${suffix}`
      if (slugSet.has(newSlug)) {
        let i = 1
        while (slugSet.has(`${newSlug}-${i}`)) i++
        newSlug = `${newSlug}-${i}`
      }
      slug = newSlug
    }
    slugSet.add(slug)

    toCreate.push({
      name,
      slug,
      district: districtId,
      state: stateId,
      lgdCode: record.sub_district_code,
      status: 'active' as const,
      order: 0,
    })
  }

  payload.logger.info(`Prepared ${toCreate.length} tehsils (${noState} no state, ${noDistrict} no district)`)

  let created = 0
  const batchSize = 200
  for (let i = 0; i < toCreate.length; i += batchSize) {
    const batch = toCreate.slice(i, i + batchSize)
    const results = await Promise.allSettled(
      batch.map(item =>
        payload.create({ collection: 'tehsils', data: item, depth: 0 })
          .then(() => true)
          .catch((err: any) => { payload.logger.error(`  ${item.name}: ${err.message}`); return false })
      )
    )
    const ok = results.filter(r => r.status === 'fulfilled' && r.value === true).length
    created += ok
    payload.logger.info(`  Batch ${i / batchSize + 1}: ${ok}/${batch.length} (total: ${created})`)
  }

  payload.logger.info(`\n=== Tehsil Seed Summary ===`)
  payload.logger.info(`Total LGD records: ${rawRecords.length}`)
  payload.logger.info(`Inserted: ${created}`)
  payload.logger.info(`No state match: ${noState}`)
  payload.logger.info(`No district match: ${noDistrict}`)
  payload.logger.info('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
