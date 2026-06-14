import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'

// City-to-state mapping for known Indian cities
// Explicit name-to-state mappings for abbreviations
const NAME_STATE: Record<string, string> = {
  'dr.z.a.d.c.': 'Uttar Pradesh',
  'bvd univ. med. college': 'Maharashtra',
  's.c.b. medical coll (dental)': 'Odisha',
  'govt.med.coll.(dental wing)': 'Punjab',
  'indira gandhi dental college and sbv': 'Puducherry',
  'king george medical university': 'Uttar Pradesh',
  'narendra modi medical college': 'Uttar Pradesh',
  'chengalpatt u medical coll': 'Tamil Nadu',
  'c. u. shah medical college surendranagar': 'Gujarat',
}

const CITY_STATE: Record<string, string> = {
  'ahmedabad': 'Gujarat', 'vadodara': 'Gujarat', 'surat': 'Gujarat',
  'rajkot': 'Gujarat', 'bhavnagar': 'Gujarat', 'gandhinagar': 'Gujarat',
  'junagadh': 'Gujarat', 'patan': 'Gujarat', 'navsari': 'Gujarat',
  'godhra': 'Gujarat', 'nadiad': 'Gujarat', 'jamnagar': 'Gujarat',
  'mubarakpur': 'Uttar Pradesh', 'basna': 'Gujarat', 'visnagar': 'Gujarat',
  'surendranagar': 'Gujarat',
  'kuvadava': 'Gujarat', 'vahelal': 'Gujarat', 'anand': 'Gujarat',
  'vadnagar': 'Gujarat',
  'coochbehar': 'West Bengal', 'burdwan': 'West Bengal', 'malda': 'West Bengal',
  'mursidabad': 'West Bengal', 'kalyani': 'West Bengal', 'barasat': 'West Bengal',
  'silcher': 'Assam', 'tezpur': 'Assam', 'guwahati': 'Assam', 'dibrugarh': 'Assam',
  'nalbari': 'Assam', 'kokrajhar': 'Assam', 'tinsukia': 'Assam', 'dhubri': 'Assam',
  'shillong': 'Meghalaya', 'bemina': 'Jammu and Kashmir',
  'mandi': 'Himachal Pradesh', 'nahan': 'Himachal Pradesh',
  'srinagar': 'Jammu and Kashmir', 'jammu': 'Jammu and Kashmir',
  'ghaziabad': 'Uttar Pradesh', 'alaigarh': 'Uttar Pradesh',
  'meerut': 'Uttar Pradesh', 'saharanpur': 'Uttar Pradesh', 'agra': 'Uttar Pradesh',
  'jalaun': 'Uttar Pradesh', 'bareilly': 'Uttar Pradesh', 'badaun': 'Uttar Pradesh',
  'firozabad': 'Uttar Pradesh', 'shahjahanpur': 'Uttar Pradesh',
  'lucknow': 'Uttar Pradesh', 'varanasi': 'Uttar Pradesh',
  'pune': 'Maharashtra', 'mumbai': 'Maharashtra', 'nagpur': 'Maharashtra',
  'sangli': 'Maharashtra', 'nalgonda': 'Telangana',
  'wardha': 'Maharashtra', 'satara': 'Maharashtra', 'nanded': 'Maharashtra',
  'thane': 'Maharashtra', 'jalgaon': 'Maharashtra', 'nerul': 'Maharashtra',
  'vashi': 'Maharashtra', 'aurangabad': 'Maharashtra',
  'chennai': 'Tamil Nadu', 'thoothukudi': 'Tamil Nadu',
  'theni': 'Tamil Nadu', 'salem': 'Tamil Nadu', 'thanjavur': 'Tamil Nadu',
  'namakkal': 'Tamil Nadu', 'ramayanpatti': 'Tamil Nadu',
  'chengalpattu': 'Tamil Nadu', 'karur': 'Tamil Nadu',
  'guntur': 'Andhra Pradesh', 'vijayawada': 'Andhra Pradesh',
  'kurnool': 'Andhra Pradesh', 'eluru': 'Andhra Pradesh',
  'ongole': 'Andhra Pradesh', 'srikakulam': 'Andhra Pradesh',
  'nandyal': 'Andhra Pradesh', 'loni': 'Maharashtra',
  'belgaum': 'Karnataka', 'bidar': 'Karnataka', 'gadag': 'Karnataka',
  'shimoga': 'Karnataka', 'bellary': 'Karnataka', 'mandya': 'Karnataka',
  'bangalore': 'Karnataka', 'mangaluru': 'Karnataka', 'mysuru': 'Karnataka',
  'bengaluru': 'Karnataka',
  'bhubaneswar': 'Odisha', 'cuttack': 'Odisha', 'burla': 'Odisha',
  'puri': 'Odisha', 'balangir': 'Odisha', 'jajpur': 'Odisha',
  'phulbani': 'Odisha', 'baripada': 'Odisha', 'balasore': 'Odisha',
  'sundargarh': 'Odisha',
  'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan', 'alwar': 'Rajasthan',
  'kota': 'Rajasthan', 'bikaner': 'Rajasthan', 'shivpuri': 'Madhya Pradesh',
  'datia': 'Madhya Pradesh', 'sagar': 'Madhya Pradesh',
  'rewa': 'Madhya Pradesh', 'jabalpur': 'Madhya Pradesh',
  'mandsaur': 'Madhya Pradesh', 'neemuch': 'Madhya Pradesh',
  'shahdol': 'Madhya Pradesh', 'gwalior': 'Madhya Pradesh',
  'raipur': 'Chhattisgarh', 'jagdalpur': 'Chhattisgarh',
  'ranchi': 'Jharkhand', 'jamshedpur': 'Jharkhand',
  'patna': 'Bihar', 'muzaffarpur': 'Bihar', 'gaya': 'Bihar',
  'purnea': 'Bihar', 'darbhanga': 'Bihar', 'bhagalpur': 'Bihar',
  'deoghar': 'Jharkhand',
  'rohtak': 'Haryana', 'faridabad': 'Haryana', 'hisar': 'Haryana',
  'haldwani': 'Uttarakhand',
  'pondicherry': 'Puducherry',
  'delhi': 'Delhi',
  'hyderabad': 'Telangana', 'secunderabad': 'Telangana',
  'warangal': 'Telangana', 'adilabad': 'Telangana',
  'khammam': 'Telangana', 'sircilla': 'Telangana',
  'kolkata': 'West Bengal',
}

const COURSE_DURATION: Record<string, string> = {
  'MBBS': '4.5 Years', 'BDS': '4 Years', 'BAMS': '4.5 Years',
  'BUMS': '4.5 Years', 'BSMS': '4.5 Years', 'BVSc & AH': '4.5 Years',
  'B.Sc. Nursing': '4 Years', 'Nursing': '4 Years',
}

function formatSlug(val: string): string {
  return val.replace(/^\//, '').replace(/\/+/g, '-')
    .replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 100)
}

function findStateFromName(name: string): string | null {
  const lower = name.toLowerCase()
  // Try explicit name match first
  if (NAME_STATE[lower]) return NAME_STATE[lower]
  // Fallback: check if any known city appears in the name
  for (const [city, state] of Object.entries(CITY_STATE)) {
    if (lower.includes(city)) return state
  }
  return null
}

async function main() {
  const payload = await getPayload({ config })

  // Load existing colleges
  const collegeMap = new Map<string, string>()
  let page = 1
  while (true) {
    const result = await payload.find({ collection: 'colleges', limit: 1000, page, depth: 0 })
    for (const c of result.docs) {
      collegeMap.set(c.name.toLowerCase(), c.id)
    }
    if (page >= result.totalPages) break
    page++
  }
  payload.logger.info(`Loaded ${collegeMap.size} colleges`)

  // Load states
  const allStates = await payload.find({ collection: 'states', limit: 100, depth: 0 })
  const stateLookup = new Map<string, string>()
  for (const s of allStates.docs) {
    stateLookup.set(s.name.toLowerCase(), s.id)
  }

  let totalInserted = 0
  let totalSkipped = 0

  // Process NEET data for remaining unmatched records
  const neetRaw = (await import('../../data/neet-allotment-data.json')).default as any[]

  // Find records with unknown state that have a city hint
  const uniqueColleges = new Map<string, { name: string; courses: Set<string>; type: string; records: any[] }>()

  for (const r of neetRaw) {
    const state = (r.state || '').trim()
    if (state && state !== 'Unknown') continue

    const name = r.institute.trim()
    if (!name) continue

    // Only process names not already in DB
    if (collegeMap.has(name.toLowerCase())) continue

    // City+abbreviation based checks for known patterns
    const lower = name.toLowerCase()
    const stateName = findStateFromName(name)

    if (!stateName) continue

    if (!uniqueColleges.has(name)) {
      uniqueColleges.set(name, {
        name,
        courses: new Set([r.course.trim()]),
        type: 'government',
        records: [],
      })
    }
    const entry = uniqueColleges.get(name)!
    entry.courses.add(r.course.trim())
    entry.records.push(r)
  }

  payload.logger.info(`Found ${uniqueColleges.size} colleges to create from unmatched NEET records`)

  // Create colleges
  for (const [, college] of uniqueColleges) {
    const stateName = findStateFromName(college.name)!
    const stateId = stateLookup.get(stateName.toLowerCase())
    if (!stateId) {
      payload.logger.warn(`State not found for "${college.name}" -> ${stateName}`)
      totalSkipped += college.records.length
      continue
    }

    const coursesArr = [...college.courses].map(c => ({
      course: c,
      duration: COURSE_DURATION[c] || '4.5 Years',
    }))

    try {
      await payload.create({
        collection: 'colleges',
        data: {
          name: college.name,
          slug: formatSlug(college.name),
          type: 'government',
          state: stateId,
          courses: coursesArr,
          status: 'active',
          seo: {
            metaTitle: `Admission at ${college.name} - Cutoff, Fees 2026`,
            metaDescription: `Get details about ${[...college.courses].join(', ')} admission at ${college.name}, ${stateName}. Check cutoff and more.`,
            keywords: [...college.courses].map(c => ({ keyword: `${c} at ${college.name}` })),
          } as any,
        },
        depth: 0,
      })

      collegeMap.set(college.name.toLowerCase(), '') // will be refreshed on next run
      payload.logger.info(`Created: "${college.name}" -> ${stateName}`)
      totalInserted += college.records.length
    } catch (err: any) {
      payload.logger.warn(`Failed to create "${college.name}": ${err.message}`)
      totalSkipped += college.records.length
    }
  }

  payload.logger.info(`\nFixup summary:`)
  payload.logger.info(`Colleges created: ${uniqueColleges.size}`)
  payload.logger.info(`Records will be importable: ${totalInserted}`)
  payload.logger.info(`Still skipped: ${totalSkipped}`)
  payload.logger.info(`\nRun cutoff-records.ts next to import the new records.`)
  process.exit(0)
}

main().catch(console.error)
