import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { getDistrictSlug } from '../lib/data/city-to-district.js'

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting efficient district mapping...')

  // Load all districts into a map keyed by slug
  const allDistricts = await payload.find({ collection: 'districts', limit: 2000, depth: 0 })
  const districtBySlug = new Map<string, string>()
  for (const d of allDistricts.docs as any[]) {
    districtBySlug.set(d.slug, d.id)
  }
  payload.logger.info(`Loaded ${districtBySlug.size} districts`)

  // Get all unmapped colleges that have city
  const unmapped = await payload.find({
    collection: 'colleges',
    where: { and: [{ district: { exists: false } }, { city: { exists: true } }] },
    limit: 1000,
    depth: 0,
  })
  payload.logger.info(`Unmapped colleges with city: ${unmapped.docs.length}`)

  let mapped = 0
  let skipped = 0
  let errors = 0
  const missingCities = new Map<string, string[]>()

  for (const c of unmapped.docs as any[]) {
    const city = c.city?.trim()
    if (!city) { skipped++; continue }

    const slug = getDistrictSlug(city)
    if (!slug) {
      const stateName = c.state as string || '?'
      if (!missingCities.has(city)) missingCities.set(city, [])
      missingCities.get(city)!.push(`${c.name} (${stateName})`)
      skipped++
      continue
    }

    const districtId = districtBySlug.get(slug)
    if (!districtId) {
      if (!missingCities.has(city)) missingCities.set(city, [])
      missingCities.get(city)!.push(`${c.name} (${slug}→no district)`)
      skipped++
      continue
    }

    try {
      await payload.update({
        collection: 'colleges',
        id: c.id,
        data: { district: districtId } as any,
        depth: 0,
      })
      mapped++
    } catch (err: any) {
      errors++
      if (errors <= 3) payload.logger.error(`Error: ${err.message}`)
    }
  }

  payload.logger.info(`\nMapped: ${mapped}, Skipped: ${skipped}, Errors: ${errors}`)

  if (missingCities.size > 0) {
    payload.logger.info(`\nMissing city→district mappings (${missingCities.size}):`)
    for (const [city, colleges] of [...missingCities.entries()].sort()) {
      payload.logger.info(`  "${city}" — ${colleges.length} college(s)`)
    }
  }

  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
