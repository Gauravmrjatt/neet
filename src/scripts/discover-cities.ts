import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting city discovery...')

  const allColleges = await payload.find({
    collection: 'colleges',
    limit: 5000,
    depth: 0,
  })

  payload.logger.info(`Total colleges found: ${allColleges.docs.length}`)

  const cityByState = new Map<string, Set<string>>()
  const cityRecords: { city: string; college: string; state: string; stateSlug: string }[] = []

  for (const college of allColleges.docs) {
    const city = (college as any).city?.trim()
    const stateName = (college as any).stateName || ''
    let stateSlug = ''
    let stateDisplay = ''

    if ((college as any).state) {
      const stateRef = (college as any).state
      if (typeof stateRef === 'object' && stateRef?.slug) {
        stateSlug = stateRef.slug
        stateDisplay = stateRef.name || stateRef.slug
      } else {
        stateSlug = String(stateRef)
        stateDisplay = String(stateRef)
      }
    }

    if (city) {
      if (!cityByState.has(stateSlug)) {
        cityByState.set(stateSlug, new Set())
      }
      cityByState.get(stateSlug)!.add(city)

      cityRecords.push({ city, college: college.name || '', state: stateDisplay, stateSlug })
    }
  }

  const sortedStates = [...cityByState.entries()].sort((a, b) => a[0].localeCompare(b[0]))

  console.log('\n=== CITIES BY STATE ===\n')
  for (const [stateSlug, cities] of sortedStates) {
    const sortedCities = [...cities].sort()
    console.log(`\n--- ${stateSlug} (${sortedCities.length} unique cities) ---`)
    for (const city of sortedCities) {
      console.log(`  ${city}`)
    }
  }

  const allUniqueCities = new Set<string>()
  for (const [, cities] of cityByState) {
    for (const city of cities) {
      allUniqueCities.add(city)
    }
  }

  console.log(`\n\n=== SUMMARY ===`)
  console.log(`Total colleges in DB: ${allColleges.docs.length}`)
  console.log(`Colleges with city data: ${cityRecords.length}`)
  console.log(`Unique cities across all states: ${allUniqueCities.size}`)
  console.log(`States with city data: ${cityByState.size}`)

  if (allColleges.docs.length > 0 && cityRecords.length === 0) {
    console.log('\n⚠ WARNING: No cities found. Checking raw data sample:')
    console.log('  First college fields:', Object.keys(allColleges.docs[0] as any))
    console.log('  City value:', (allColleges.docs[0] as any).city)
  }

  const fs = await import('fs')
  const path = await import('path')
  const outputPath = path.resolve(process.cwd(), 'logs', 'city-discovery.json')
  const logDir = path.dirname(outputPath)
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }

  const output: Record<string, string[]> = {}
  for (const [stateSlug, cities] of sortedStates) {
    output[stateSlug] = [...cities].sort()
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
  payload.logger.info(`City data written to ${outputPath}`)
  payload.logger.info('City discovery completed.')
}

main().catch((err) => {
  console.error('Discovery failed:', err)
  process.exit(1)
})
