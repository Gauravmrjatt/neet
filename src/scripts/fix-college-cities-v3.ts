import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

// Manual mapping for colleges where city can't be extracted from name
const MANUAL: Record<string, string> = {
  'chengalpatt u medical coll': 'Chengalpattu',
  'king george medical university': 'Lucknow',
  'bvd univ. med. college': 'Pune',
  'narendra modi medical college': 'Lucknow',
  'dr.z.a.d.c.': 'Aligarh',
  'mahatma gandhi medical college and sri balaji vidyapeeth': 'Puducherry',
  'north bengal med.coll': 'Darjeeling',
  'dr rml hospital': 'Delhi',
  'shkm gmc': 'Nuh',
  'vmmc and safdarjung hospital': 'Delhi',
  'maulana azad inst.of dental sci': 'Delhi',
  'ims bhu': 'Varanasi',
  'ims bhu dental': 'Varanasi',
  'goa dental college & hospital': 'North Goa',
  'barasat government medical college & hospital': 'North 24 Parganas',
  'dy patil university school of medicine': 'Navi Mumbai',
  'dr. b.s.a. medical college': 'Delhi',
  'datta meghe medical college': 'Nagpur',
  'rajah muthiah medical college': 'Cuddalore',
  'nagaland institute of medical science and research': 'Kohima',
  'meenakshi medical college hospital and research institute': 'Kanchipuram',
  'ndmc medical college': 'Delhi',
  'namo medical education & research institute': 'Silvassa',
  'tomo riba institute health and medical sciences': 'Papum Pare',
  'svims - sri padmavathi medical college for women': 'Tirupati',
  'vels medical college & hospital': 'Chennai',
  'vardhman mahavir medical college and safdarjung hospital': 'Delhi',
  'shri atal bihari vajpayee medical college & research institute': 'Bengaluru',
  'sbks med. inst. and res. centre': 'Vadodara',
  'sri siddhartha academy t begur': 'Bengaluru',
  'sri lalithambigai medical college & hospital': 'Chennai',
  'sri lakshmi narayana inst. of med. scien.': 'Puducherry',
  'graphic era institute of medical science': 'Dehradun',
  'indira gandhi medical college & ri': 'Puducherry',
  'institute of medical sciences & sum hospital': 'Bhubaneswar',
  'j r medical college and hospital': 'Ranchi',
  'maharaja jitendra narayan medical college': 'Cooch Behar',
  'manipal tata medical college': 'East Singhbhum',
  'aarupadai veedu medical college and hospt.': 'Puducherry',
  'jannayak karpoori thakur medical college and hospital': 'Madhepura',
  'jagadguru gangadhar mahaswamigalu moorusavirmath medical college': 'Haveri',
  'rajmata shrimati devendra kumari singhdeo government medical college': 'Surguja',
  'dr.s.c. govt medica l colleg e': 'Bhilwara',
  'north bengal dent.coll': 'Darjeeling',
  'indira gandhi dental college and sbv': 'Puducherry',
  's. s. agrawal institute of ayurveda': 'Lucknow',
  's.s.agrawal homoeopathic medical college & general hospital': 'Lucknow',
  'shree rasiklal manikchandji dhariwal ayurved college & hospital': 'Jalgaon',
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Fixing remaining MBBS college cities...')

  // Get all districts for matching
  const districts = await payload.find({ collection: 'districts', limit: 2000, depth: 0 })
  const districtNames = districts.docs.map((d: any) => ({ name: d.name, id: d.id }))
  districtNames.sort((a: any, b: any) => b.name.length - a.name.length)

  // Load colleges without city, get state names too
  const allStates = await payload.find({ collection: 'states', limit: 100, depth: 0 })
  const stateMap = new Map(allStates.docs.map((s: any) => [s.id, s.name]))

  // Try matching college names against known "Government Medical College X" / "GMC X" patterns
  // These are standard naming patterns: "Government Medical College <City>"
  const CITY_IN_NAME_PATTERNS = [
    /Government\s+Medical\s+College\s+(.+)/i,
    /Gover\w*ment\s+Medical\s+College\s+(.+)/i,
    /Govt\s+Medical\s+College\s+(.+)/i,
    /Govt\s+Dental\s+College\s+(.+)/i,
    /GMC\s+(.+)/i,
    /Government\s+Dental\s+College\s+and\s+Hospital\s+(.+)/i,
    /Government\s+Medical\s+College\s+and\s+Hospital\s+(.+)/i,
    /Medical\s+College\s+(.+)/i,
    /AIIMS\s+(.+)/i,
    /ESIC\s+Medical\s+College\s+(.+)/i,
    /ESIC\s+Dental\s+College\s+and\s+Hospital\s+(.+)/i,
  ]

  let updated = 0
  let stillMissing = 0

  // Get colleges without city
  const noCity = await payload.find({ collection: 'colleges', where: { city: { exists: false } }, limit: 300, depth: 0 })

  for (const c of noCity.docs as any[]) {
    const name = c.name?.trim() || ''
    if (!name) { stillMissing++; continue }

    const lowerName = name.toLowerCase().trim()

    // 1. Check manual map first
    let city = MANUAL[lowerName]
    
    // 2. Try pattern matching for "Government Medical College City" etc.
    if (!city) {
      for (const pattern of CITY_IN_NAME_PATTERNS) {
        const match = name.match(pattern)
        if (match) {
          // The matched city part - clean it up
          let cityPart = match[1].trim()
          // Remove trailing junk like "and Hospital", "& Hospital", etc
          cityPart = cityPart.replace(/and\s+Hospital.*/i, '').replace(/&?\s*Hospital.*/i, '').trim()
          cityPart = cityPart.replace(/[,.()\-]+$/, '').trim()
          
          // Skip if it's just a generic word
          if (cityPart && !/^(and|the|of|for|in|at|by)$/i.test(cityPart)) {
            // Check if this matches a known district
            for (const d of districtNames) {
              if (d.name.toLowerCase() === cityPart.toLowerCase()) {
                city = d.name
                break
              }
            }
            if (!city) {
              // Also check partial match (first word only)
              const firstWord = cityPart.split(/\s+/)[0]
              for (const d of districtNames) {
                if (d.name.toLowerCase() === firstWord.toLowerCase()) {
                  city = d.name
                  break
                }
              }
            }
          }
        }
      }
    }

    // 3. Try matching last word or phrase against district names
    if (!city) {
      const words = name.split(/[\s,]+/)
      for (let len = 3; len >= 1; len--) {
        for (let i = words.length - len; i >= 0; i--) {
          const phrase = words.slice(i, i + len).join(' ')
          for (const d of districtNames) {
            if (d.name.toLowerCase() === phrase.toLowerCase()) {
              city = d.name
              break
            }
          }
          if (city) break
        }
        if (city) break
      }
    }

    if (city) {
      await payload.update({
        collection: 'colleges',
        id: c.id,
        data: { city } as any,
        depth: 0,
      })
      updated++
    } else {
      stillMissing++
    }
  }

  payload.logger.info(`Updated: ${updated}, Still missing: ${stillMissing}`)

  // Show remaining
  if (stillMissing > 0) {
    const remaining = await payload.find({ collection: 'colleges', where: { city: { exists: false } }, limit: 50, depth: 0 })
    payload.logger.info('Still missing:')
    for (const c of remaining.docs as any[]) {
      const s = stateMap.get(c.state as string) || '?'
      payload.logger.info(`  [${s}] ${c.name}`)
    }
  }

  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
