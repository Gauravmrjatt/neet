import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'
import fs from 'fs'
import path from 'path'
import { AYUSH_STATE_MAP, VET_STATE_MAP } from '../data/state-mappings'

import ayushRaw from '../../data/ayush-cutoff-data.json'
import vetRaw from '../../data/vet-cutoff-data.json'

interface DataRecord {
  institute: string
  state: string
  course: string
  quota: string
  category: string
  openingRank: number
  closingRank: number
  round: number
  year: number
  collegeType: string
  fees: number
}

const ayushData = ayushRaw as DataRecord[]
const vetData = vetRaw as DataRecord[]

const COURSE_DURATION: Record<string, string> = {
  'BAMS': '4.5 Years',
  'BUMS': '4.5 Years',
  'BSMS': '4.5 Years',
  'BVSc & AH': '4.5 Years',
}

const STATE_ABBREVIATIONS: Record<string, string> = {
  'andhra-pradesh': 'AP', 'arunachal-pradesh': 'AR', 'assam': 'AS', 'bihar': 'BR',
  'chhattisgarh': 'CG', 'goa': 'GA', 'gujarat': 'GJ', 'haryana': 'HR',
  'himachal-pradesh': 'HP', 'jharkhand': 'JH', 'karnataka': 'KA', 'kerala': 'KL',
  'madhya-pradesh': 'MP', 'maharashtra': 'MH', 'manipur': 'MN', 'meghalaya': 'ML',
  'mizoram': 'MZ', 'nagaland': 'NL', 'odisha': 'OD', 'punjab': 'PB',
  'rajasthan': 'RJ', 'sikkim': 'SK', 'tamil-nadu': 'TN', 'telangana': 'TS',
  'tripura': 'TR', 'uttar-pradesh': 'UP', 'uttarakhand': 'UK', 'west-bengal': 'WB',
  'delhi': 'DL', 'puducherry': 'PY', 'chandigarh': 'CH',
  'andaman-and-nicobar-islands': 'AN', 'jammu-and-kashmir': 'JK',
  'dadra-and-nagar-haveli-and-daman-and-diu': 'DN',
}

function formatSlug(val: string, suffix?: string): string {
  let slug = val.replace(/^\//, '').replace(/\/+/g, '-')
    .replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase()
  if (!slug) slug = 'college'
  if (suffix) slug = slug + '-' + suffix
  return slug.slice(0, 100)
}

function typeMap(t: string): string {
  if (t === 'Government') return 'government'
  if (t === 'Private') return 'private'
  if (t === 'Deemed') return 'deemed'
  return 'government'
}

async function main() {
  const payload = await getPayload({ config })
  const logDir = path.resolve(process.cwd(), 'logs')
  fs.mkdirSync(logDir, { recursive: true })

  const csvRows: string[] = ['action,name,state,source,reason']
  const log = (action: string, name: string, state: string, source: string, reason: string) => {
    csvRows.push(`${action},"${name}",${state},${source},"${reason}"`)
  }

  // Build state lookup
  const allStates = await payload.find({ collection: 'states', limit: 100, depth: 0 })
  const stateLookup = new Map<string, string>()
  for (const s of allStates.docs) {
    stateLookup.set(s.name.toLowerCase(), s.id)
  }

  let inserted = 0
  let skipped = 0

  async function processSource(
    records: DataRecord[],
    stateMap: Record<string, string>,
    label: string,
  ) {
    const unique = new Map<string, { name: string; courses: Set<string>; type: string; fees: number }>()

    for (const r of records) {
      const key = r.institute.trim()
      if (!unique.has(key)) {
        unique.set(key, {
          name: key,
          courses: new Set([r.course.trim()]),
          type: typeMap(r.collegeType),
          fees: r.fees || 0,
        })
      } else {
        const e = unique.get(key)!
        e.courses.add(r.course.trim())
        if (r.fees > 0 && e.fees === 0) e.fees = r.fees
      }
    }

    for (const [, college] of unique) {
      const stateName = stateMap[college.name]
      if (!stateName) {
        log('SKIPPED', college.name, '', label, 'No state mapping found')
        skipped++
        continue
      }

      const stateId = stateLookup.get(stateName.toLowerCase())
      if (!stateId) {
        log('SKIPPED', college.name, stateName, label, `State "${stateName}" not in DB`)
        skipped++
        continue
      }

      // Check if college already exists
      const existing = await payload.find({
        collection: 'colleges',
        where: { name: { equals: college.name } },
        limit: 10, depth: 0,
      })
      let alreadyExists = false
      for (const doc of existing.docs) {
        const docStateId = typeof doc.state === 'string' ? doc.state : doc.state?.id
        if (docStateId === stateId) { alreadyExists = true; break }
      }
      if (alreadyExists) {
        log('SKIPPED', college.name, stateName, label, 'Already exists')
        skipped++
        continue
      }

      const coursesArr = [...college.courses].map(c => ({
        course: c,
        duration: COURSE_DURATION[c] || '4.5 Years',
      }))

      const slug = formatSlug(college.name)
      const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-')
      const courseNames = [...college.courses]
      const primaryCourse = courseNames[0] || 'Medical'
      const loc = stateName

      try {
        await payload.create({
          collection: 'colleges',
          data: {
            name: college.name,
            slug,
            type: college.type as 'government' | 'private' | 'deemed' | 'central',
            state: stateId,
            courses: coursesArr,
            status: 'active',
            seo: {
              metaTitle: `${primaryCourse} at ${college.name} - Fees, Cutoff, Ranking 2026`,
              metaDescription: `Get details about ${courseNames.join(', ')} admission at ${college.name}, ${loc}. Check cutoff, fee structure, ranking, and more.`,
              keywords: courseNames.flatMap(c => [
                { keyword: `${c} at ${college.name}` },
                { keyword: `${c} ${college.name} fees` },
                { keyword: `${c} ${college.name} cutoff` },
              ]),
            } as any,
          },
          depth: 0,
        })
        log('INSERTED', college.name, stateName, label, '')
        inserted++
      } catch (err: any) {
        log('SKIPPED', college.name, stateName, label, `Error: ${err.message}`)
        skipped++
      }
    }
  }

  payload.logger.info('Processing AYUSH colleges...')
  await processSource(ayushData, AYUSH_STATE_MAP, 'AYUSH')

  payload.logger.info('Processing VET colleges...')
  await processSource(vetData, VET_STATE_MAP, 'VET')

  const csvContent = csvRows.join('\n') + '\n'
  fs.writeFileSync(path.join(logDir, 'ayush-vet-import.csv'), csvContent)

  payload.logger.info(`\n=== AYUSH/VET College Import Summary ===`)
  payload.logger.info(`Inserted: ${inserted}`)
  payload.logger.info(`Skipped: ${skipped}`)
  payload.logger.info('CSV: logs/ayush-vet-import.csv')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
