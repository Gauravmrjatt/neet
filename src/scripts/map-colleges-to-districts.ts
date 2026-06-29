import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { getDistrictSlug, getDistrictName, normalizeCity } from '../lib/data/city-to-district'

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting college-to-district mapping...')

  const allColleges = await payload.find({
    collection: 'colleges',
    limit: 5000,
    depth: 1,
  })
  payload.logger.info(`Loaded ${allColleges.docs.length} colleges`)

  const unmappableCities = new Map<string, { city: string; name: string; state: string }[]>()
  let mapped = 0
  let skipped = 0
  let errors = 0

  for (const college of allColleges.docs) {
    const c: any = college
    const city = c.city?.trim()
    if (!city) { skipped++; continue }

    const normalizedCity = normalizeCity(city)
    const districtSlug = getDistrictSlug(city)

    if (!districtSlug) {
      const stateName = c.state?.name || c.state?.slug || 'unknown'
      if (!unmappableCities.has(normalizedCity.toLowerCase())) {
        unmappableCities.set(normalizedCity.toLowerCase(), [])
      }
      unmappableCities.get(normalizedCity.toLowerCase())!.push({ city, name: c.name, state: stateName })
      skipped++
      continue
    }

    const districtResult = await payload.find({
      collection: 'districts',
      where: { slug: { equals: districtSlug } },
      limit: 1,
      depth: 1,
    })

    if (districtResult.docs.length === 0) {
      const stateName = c.state?.name || c.state?.slug || 'unknown'
      if (!unmappableCities.has(normalizedCity.toLowerCase())) {
        unmappableCities.set(normalizedCity.toLowerCase(), [])
      }
      unmappableCities.get(normalizedCity.toLowerCase())!.push({ city, name: c.name, state: stateName })
      skipped++
      continue
    }

    try {
      await payload.update({
        collection: 'colleges',
        id: c.id,
        data: { district: districtResult.docs[0].id } as any,
        depth: 0,
      })
      mapped++
    } catch (err: any) {
      payload.logger.error(`Error updating ${c.name}: ${err.message}`)
      errors++
    }

    if (mapped % 50 === 0) {
      payload.logger.info(`Progress: ${mapped} mapped, ${skipped} skipped, ${errors} errors`)
    }
  }

  payload.logger.info(`\n=== Mapping Summary ===`)
  payload.logger.info(`Total colleges: ${allColleges.docs.length}`)
  payload.logger.info(`Mapped to district: ${mapped}`)
  payload.logger.info(`Skipped: ${skipped}`)
  payload.logger.info(`Errors: ${errors}`)

  if (unmappableCities.size > 0) {
    payload.logger.info(`\nUnmappable cities (${unmappableCities.size} unique):`)
    for (const [cityKey, records] of unmappableCities) {
      const stateNames = [...new Set(records.map(r => r.state))].join(', ')
      payload.logger.info(`  "${cityKey}" (${stateNames}) — ${records.length} college(s)`)
      for (const r of records.slice(0, 3)) {
        payload.logger.info(`    - ${r.name}`)
      }
    }
  }

  payload.logger.info('Mapping completed.')
}

main().catch((err) => {
  console.error('Mapping failed:', err)
  process.exit(1)
})
