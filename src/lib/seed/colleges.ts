import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'
import fs from 'fs'
import path from 'path'

import neetRaw from '../../data/neet-allotment-data.json'
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

const neetData = neetRaw as DataRecord[]
const ayushData = ayushRaw as DataRecord[]
const vetData = vetRaw as DataRecord[]

const STATE_NAME_MAP: Record<string, string> = {
  'Jammu And Kashmir': 'Jammu and Kashmir',
  'Andaman And Nicobar Islands': 'Andaman and Nicobar Islands',
  'Dadra And Nagar Haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi': 'Delhi',
  'Puducherry': 'Puducherry',
}

const COLLEGE_TYPE_MAP: Record<string, string> = {
  'Government': 'government',
  'Private': 'private',
  'Deemed': 'deemed',
  'Central': 'central',
}

const COURSE_DURATION_MAP: Record<string, string> = {
  'MBBS': '5.5 Years',
  'BDS': '5 Years',
  'BAMS': '4.5 Years',
  'BSMS': '4.5 Years',
  'BUMS': '4.5 Years',
  'BVSc & AH': '4.5 Years',
}

interface CollegeEntry {
  name: string
  stateName: string
  type: string
  courses: Set<string>
  fees: number
  city: string
  fromNeet: boolean
  fromAyush: boolean
  fromVet: boolean
}

function mapCollegeType(raw: string): string {
  if (!raw) return 'government'
  return COLLEGE_TYPE_MAP[raw] || 'government'
}

function extractCity(name: string): string {
  const commaMatch = name.match(/,\s*(.+)$/)
  if (commaMatch) return commaMatch[1].trim()
  return ''
}

function formatSlug(val: string): string {
  return val
    .replace(/^\//, '')
    .replace(/\/+/g, '-')
    .replace(/[^a-zA-Z0-9-_ ]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
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

function generateMetaTitle(name: string, city: string, stateName: string, courses: string[]): string {
  const primaryCourse = courses.includes('MBBS') ? 'MBBS' : courses[0] || 'Medical'
  return `${primaryCourse} at ${name}, ${city || stateName} - Fees, Cutoff, Ranking 2026`
}

function generateMetaDescription(name: string, city: string, stateName: string, courses: string[], collegeType: string): string {
  const courseList = courses.join(', ') || 'medical'
  const loc = city || stateName
  return `Get complete details about ${courseList} admission at ${name} in ${loc}, ${stateName}. Check 2026 cutoff marks, fee structure, ranking, infrastructure, seat matrix, and admission process. ${collegeType === 'government' ? 'Government' : collegeType === 'private' ? 'Private' : ''} NMC approved college.`
}

function generateKeywords(name: string, city: string, stateName: string, stateSlug: string, courses: string[], collegeType: string): string[] {
  const loc = city || stateName
  const stateAbbr = STATE_ABBREVIATIONS[stateSlug] || stateName
  const keywords: string[] = []
  for (const course of courses) {
    keywords.push(`${course} at ${name}`)
    keywords.push(`${name} ${course} fees`)
    keywords.push(`${name} ${course} cutoff`)
    keywords.push(`${name} NEET cutoff`)
  }
  keywords.push(`${name} ranking`)
  keywords.push(`NEET counselling ${loc}`)
  keywords.push(`medical college ${stateAbbr}`)
  keywords.push(`${collegeType} medical college ${loc}`)
  keywords.push(`MBBS admission ${stateName} 2026`)
  return [...new Set(keywords)]
}

function resolveStateName(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed || trimmed === 'Unknown') return null
  return STATE_NAME_MAP[trimmed] || trimmed
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting college seed...')

  payload.logger.info(`Loaded ${neetData.length} NEET records, ${ayushData.length} AYUSH records, ${vetData.length} VET records`)

  const collegeMap = new Map<string, CollegeEntry>()

  function processRecords(records: DataRecord[], source: 'neet' | 'ayush' | 'vet') {
    for (const record of records) {
      const key = record.institute.toLowerCase().trim()
      const existing = collegeMap.get(key)

      if (!existing) {
        const name = record.institute.trim()
        let stateName = ''

        if (source === 'neet') {
          stateName = record.state.trim()
        }

        collegeMap.set(key, {
          name,
          stateName,
          type: mapCollegeType(record.collegeType),
          courses: new Set([record.course.trim()]),
          fees: record.fees > 0 ? record.fees : 0,
          city: extractCity(name),
          fromNeet: source === 'neet',
          fromAyush: source === 'ayush',
          fromVet: source === 'vet',
        })
      } else {
        existing.courses.add(record.course.trim())

        if (record.fees > 0 && existing.fees === 0) {
          existing.fees = record.fees
        }

        if (source === 'neet') {
          const s = record.state.trim()
          if (s && s !== 'Unknown' && (!existing.stateName || existing.stateName === 'Unknown')) {
            existing.stateName = s
          }
        }

        if (source === 'neet') existing.fromNeet = true
        if (source === 'ayush') existing.fromAyush = true
        if (source === 'vet') existing.fromVet = true
      }
    }
  }

  processRecords(neetData, 'neet')
  processRecords(ayushData, 'ayush')
  processRecords(vetData, 'vet')

  const allStates = await payload.find({
    collection: 'states',
    limit: 100,
    depth: 0,
  })

  const stateLookup = new Map<string, string>()
  for (const state of allStates.docs) {
    stateLookup.set(state.name.toLowerCase(), state.id)
  }

  payload.logger.info(`Loaded ${stateLookup.size} states from Payload`)

  const logDir = path.resolve(process.cwd(), 'logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }

  const csvRows: string[] = []

  let inserted = 0
  let skipped = 0
  const skippedReasons: Record<string, number> = {}

  function logSkipped(name: string, stateDisplay: string, reason: string) {
    skippedReasons[reason] = (skippedReasons[reason] || 0) + 1
    csvRows.push(`SKIPPED,${name},${stateDisplay},${reason}`)
    payload.logger.info(`  SKIPPED: ${name} (${stateDisplay}) - ${reason}`)
    skipped++
  }

  for (const [, college] of collegeMap) {
    const stateName = resolveStateName(college.stateName)

    if (!stateName) {
      const reason = college.stateName === 'Unknown'
        ? 'Unknown state in NEET data'
        : 'Empty state (AYUSH/VET record)'
      logSkipped(college.name, college.stateName || 'N/A', reason)
      continue
    }

    const stateId = stateLookup.get(stateName.toLowerCase())
    if (!stateId) {
      logSkipped(college.name, stateName, `State "${stateName}" not found in Payload`)
      continue
    }

    const existing = await payload.find({
      collection: 'colleges',
      where: {
        name: { equals: college.name },
      },
      limit: 10,
      depth: 0,
    })

    let alreadyExists = false
    for (const doc of existing.docs) {
      const docStateId = typeof doc.state === 'string' ? doc.state : doc.state?.id
      if (docStateId === stateId) {
        alreadyExists = true
        break
      }
    }

    if (alreadyExists) {
      logSkipped(college.name, stateName, 'College already exists for this state')
      continue
    }

    const coursesArr = [...college.courses].map(c => ({
      course: c,
      duration: COURSE_DURATION_MAP[c] || '4.5 Years',
    }))

    const slug = formatSlug(college.name)

    const feeData: Record<string, unknown> = {}
    if (college.fees > 0) {
      feeData.mbbsAnnual = college.fees
    }

    const courseNames = [...college.courses]
    const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-')
    const seoMetaTitle = generateMetaTitle(college.name, college.city, stateName, courseNames)
    const seoMetaDescription = generateMetaDescription(college.name, college.city, stateName, courseNames, college.type)
    const seoKeywords = generateKeywords(college.name, college.city, stateName, stateSlug, courseNames, college.type)

    try {
      await payload.create({
        collection: 'colleges',
        data: {
          name: college.name,
          slug,
          type: college.type as 'government' | 'private' | 'deemed' | 'central',
          state: stateId,
          city: college.city || undefined,
          courses: coursesArr,
          feeStructure: feeData as any,
          status: 'active',
          order: 0,
          seo: {
            metaTitle: seoMetaTitle,
            metaDescription: seoMetaDescription,
            keywords: seoKeywords.map(k => ({ keyword: k })),
          } as any,
        },
        depth: 0,
      })

      csvRows.push(`INSERTED,${college.name},${stateName},`)
      payload.logger.info(`  INSERTED: ${college.name} (${stateName})`)
      inserted++
    } catch (err: any) {
      logSkipped(college.name, stateName, `Error: ${err.message}`)
    }
  }

  const csvContent = 'action,name,state,reason\n' + csvRows.join('\n') + '\n'
  fs.writeFileSync(path.join(logDir, 'colleges-import.csv'), csvContent)
  payload.logger.info(`CSV log written to logs/colleges-import.csv`)

  const totalNeet = [...collegeMap.values()].filter(c => c.fromNeet).length
  const totalAyush = [...collegeMap.values()].filter(c => c.fromAyush).length
  const totalVet = [...collegeMap.values()].filter(c => c.fromVet).length

  payload.logger.info(`\n=== College Seed Summary ===`)
  payload.logger.info(`Total unique colleges found: ${collegeMap.size}`)
  payload.logger.info(`  From NEET data: ${totalNeet}`)
  payload.logger.info(`  From AYUSH data: ${totalAyush}`)
  payload.logger.info(`  From VET data: ${totalVet}`)
  payload.logger.info(`Inserted: ${inserted}`)
  payload.logger.info(`Skipped: ${skipped}`)
  payload.logger.info(`\nSkipped breakdown:`)
  for (const [reason, count] of Object.entries(skippedReasons)) {
    payload.logger.info(`  ${reason}: ${count}`)
  }
  payload.logger.info('College seed completed.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
