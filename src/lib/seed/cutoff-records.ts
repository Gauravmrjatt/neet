import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'
import fs from 'fs'
import path from 'path'

const LOG_FILE = path.resolve(process.cwd(), 'logs', 'cutoffs-import.csv')
const BATCH_SIZE = 500

interface RawRecord {
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

const NEET_CAT_MAP: Record<string, string> = {
  'Scheduled Caste': 'SC',
  'Scheduled Caste PwD': 'SC PwD',
  'Scheduled Tribe': 'ST',
  'Scheduled Tribe PwD': 'ST PwD',
}

const AYUSH_CAT_MAP: Record<string, string> = {
  'GEN': 'General',
  'OBC': 'OBC-NCL',
}

const QUOTA_MAP: Record<string, string> = {
  'AIQ': 'All India',
}

const VALID_COURSES = new Set([
  'MBBS', 'BDS', 'BAMS', 'BUMS', 'BSMS', 'BVSc & AH', 'B.Sc. Nursing', 'Nursing',
])

const VALID_QUOTAS = new Set([
  'All India', 'State Quota', 'Management', 'NRI', 'Deemed',
  'Deemed/Paid Seats', 'Central', 'Minority', 'ESI',
  'Delhi University', 'AMU Quota', 'IP University', 'Open Seat',
])

const VALID_CATEGORIES = new Set([
  'General', 'General PwD', 'OBC-NCL', 'OBC-NCL PwD', 'SC', 'SC PwD',
  'ST', 'ST PwD', 'EWS', 'EWS PwD', 'OP', 'GEN', 'OBC',
])

function escapeCsv(val: string): string {
  if (!val) return ''
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting optimized cutoff records seed...')

  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true })
  const csvRows: string[] = ['action,college,course,year,round,quota,category,reason']
  const csvStream = fs.createWriteStream(LOG_FILE)
  csvStream.write(csvRows.join('\n') + '\n')

  const csvLog = (action: string, college: string, course: string, year: number, round: number, quota: string, category: string, reason: string) => {
    csvStream.write(`${action},${escapeCsv(college)},${course},${year},${round},${escapeCsv(quota)},${escapeCsv(category)},${escapeCsv(reason)}\n`)
  }

  // Load NEET data
  const neetRawPath = path.resolve(process.cwd(), 'src/data/neet-allotment-data.json')
  const ayushRawPath = path.resolve(process.cwd(), 'src/data/ayush-cutoff-data.json')
  const vetRawPath = path.resolve(process.cwd(), 'src/data/vet-cutoff-data.json')

  const neetData: RawRecord[] = JSON.parse(fs.readFileSync(neetRawPath, 'utf-8'))
  const ayushData: RawRecord[] = JSON.parse(fs.readFileSync(ayushRawPath, 'utf-8'))
  const vetData: RawRecord[] = JSON.parse(fs.readFileSync(vetRawPath, 'utf-8'))

  payload.logger.info(`Loaded ${neetData.length} NEET, ${ayushData.length} AYUSH, ${vetData.length} VET records`)

  // Load all colleges into name→id map (case-insensitive keys)
  payload.logger.info('Loading colleges from DB...')
  const collegeMap = new Map<string, string>()
  let page = 1
  while (true) {
    const result = await payload.find({ collection: 'colleges', limit: 1000, page, depth: 0 })
    for (const c of result.docs) {
      collegeMap.set(c.name.toLowerCase().trim(), c.id)
    }
    if (page >= result.totalPages) break
    page++
  }
  payload.logger.info(`Cached ${collegeMap.size} colleges`)

  // Get MongoDB native collection for bulk operations
  const cutoffCollection = payload.db.collections['cutoff-records']

  // Load existing records into a Set for O(1) dedup using native MongoDB
  payload.logger.info('Loading existing cutoff records...')
  const existingKeys = new Set<string>()
  const existingDocs = await cutoffCollection.find(
    {},
    { college: 1, course: 1, year: 1, round: 1, quota: 1, category: 1 },
  ).lean()

  for (const doc of existingDocs) {
    const colId = typeof doc.college === 'object' ? doc.college.toString() : doc.college.toString()
    const key = `${colId}:${doc.course}:${doc.year}:${doc.round}:${doc.quota}:${doc.category}`
    existingKeys.add(key)
  }
  payload.logger.info(`Cached ${existingKeys.size} existing cutoff records`)

  let totalSkipped = 0
  let totalInserted = 0
  const skipReasons: Record<string, number> = {}

  function normalizeRecord(record: RawRecord, catMap: Record<string, string>, quotaMap: Record<string, string>, source: string): Record<string, unknown> | null {
    const instituteName = record.institute?.trim()
    const rawCategory = (record.category ?? '').trim()
    const rawQuota = (record.quota ?? '').trim()
    const course = (record.course ?? '').trim()

    if (!instituteName) return null

    const category = catMap[rawCategory] ?? rawCategory
    if (!VALID_CATEGORIES.has(category)) {
      const reason = `Invalid category "${rawCategory}"`
      csvLog('SKIPPED', instituteName, course, record.year, record.round, rawQuota, rawCategory, reason)
      skipReasons[reason] = (skipReasons[reason] || 0) + 1
      totalSkipped++
      return null
    }

    const quota = quotaMap[rawQuota] ?? rawQuota
    if (!VALID_QUOTAS.has(quota)) {
      const reason = `Invalid quota "${rawQuota}"`
      csvLog('SKIPPED', instituteName, course, record.year, record.round, rawQuota, rawCategory, reason)
      skipReasons[reason] = (skipReasons[reason] || 0) + 1
      totalSkipped++
      return null
    }

    if (!VALID_COURSES.has(course)) {
      const reason = `Invalid course "${course}"`
      csvLog('SKIPPED', instituteName, course, record.year, record.round, rawQuota, rawCategory, reason)
      skipReasons[reason] = (skipReasons[reason] || 0) + 1
      totalSkipped++
      return null
    }

    const lookupName = instituteName.toLowerCase()
    let collegeId = collegeMap.get(lookupName)
    if (!collegeId) {
      // Fallback: try contains match (unknown name within DB name, or vice versa)
      // Only if exactly 1 DB college matches (to avoid ambiguity)
      const matches: string[] = []
      for (const [dbName, dbId] of collegeMap) {
        if (dbName.includes(lookupName) || lookupName.includes(dbName)) {
          matches.push(dbName)
        }
      }
      if (matches.length === 1) {
        collegeId = collegeMap.get(matches[0])!
      }
    }
    if (!collegeId) {
      const reason = 'College not found in DB'
      csvLog('SKIPPED', instituteName, course, record.year, record.round, quota, category, reason)
      skipReasons[reason] = (skipReasons[reason] || 0) + 1
      totalSkipped++
      return null
    }

    const dupKey = `${collegeId}:${course}:${record.year}:${record.round}:${quota}:${category}`
    if (existingKeys.has(dupKey)) {
      const reason = 'Duplicate cutoff record'
      csvLog('SKIPPED', instituteName, course, record.year, record.round, quota, category, reason)
      skipReasons[reason] = (skipReasons[reason] || 0) + 1
      totalSkipped++
      return null
    }

    return {
      college: collegeId,
      course,
      year: record.year,
      round: record.round,
      quota,
      category,
      openingRank: record.openingRank,
      closingRank: record.closingRank,
      collegeType: record.collegeType || '',
      fees: record.fees ?? 0,
    }
  }

  // Process all three data sources
  const sources: Array<{ data: RawRecord[]; catMap: Record<string, string>; quotaMap: Record<string, string>; label: string }> = [
    { data: neetData, catMap: NEET_CAT_MAP, quotaMap: {}, label: 'NEET' },
    { data: ayushData, catMap: AYUSH_CAT_MAP, quotaMap: QUOTA_MAP, label: 'AYUSH' },
    { data: vetData, catMap: AYUSH_CAT_MAP, quotaMap: QUOTA_MAP, label: 'VET' },
  ]

  for (const source of sources) {
    payload.logger.info(`\nProcessing ${source.label} data...`)
    const batch: Record<string, unknown>[] = []
    let batchInserted = 0
    let batchSkipped = 0

    for (const record of source.data) {
      const normalized = normalizeRecord(record, source.catMap, source.quotaMap, source.label)
      if (normalized) {
        batch.push(normalized)
        if (batch.length >= BATCH_SIZE) {
          try {
            await cutoffCollection.insertMany(batch, { ordered: false })
            for (const doc of batch) {
              const key = `${doc.college}:${doc.course}:${doc.year}:${doc.round}:${doc.quota}:${doc.category}`
              existingKeys.add(key)
              console.log(`INSERTED: [${source.label}] ${collegeMap.get(doc.college as string) || doc.college} | ${doc.course} | ${doc.year} | R${doc.round} | ${doc.quota} | ${doc.category}`)
              csvLog('INSERTED', collegeMap.get(doc.college as string) || '', doc.course as string, doc.year as number, doc.round as number, doc.quota as string, doc.category as string, '')
              batchInserted++
            }
          } catch (err: any) {
            if (err.writeErrors) {
              for (const writeErr of err.writeErrors) {
                if (writeErr.code === 11000) {
                  console.log(`SKIPPED: Duplicate in batch`)
                  batchSkipped++
                }
              }
              const succeeded = err.insertedDocs || []
              for (const doc of succeeded) {
                const key = `${doc.college}:${doc.course}:${doc.year}:${doc.round}:${doc.quota}:${doc.category}`
                existingKeys.add(key)
                console.log(`INSERTED: [${source.label}] ${collegeMap.get(doc.college as string) || doc.college} | ${doc.course} | ${doc.year} | R${doc.round} | ${doc.quota} | ${doc.category}`)
                csvLog('INSERTED', collegeMap.get(doc.college as string) || '', doc.course, doc.year, doc.round, doc.quota, doc.category, '')
                batchInserted++
              }
            } else {
              throw err
            }
          }
          batch.length = 0
        }
      } else {
        batchSkipped++
      }
    }

    // Flush remaining batch
    if (batch.length > 0) {
      try {
        await cutoffCollection.insertMany(batch, { ordered: false })
        for (const doc of batch) {
          const key = `${doc.college}:${doc.course}:${doc.year}:${doc.round}:${doc.quota}:${doc.category}`
          existingKeys.add(key)
          console.log(`INSERTED: [${source.label}] ${collegeMap.get(doc.college as string) || doc.college} | ${doc.course} | ${doc.year} | R${doc.round} | ${doc.quota} | ${doc.category}`)
          csvLog('INSERTED', collegeMap.get(doc.college as string) || '', doc.course as string, doc.year as number, doc.round as number, doc.quota as string, doc.category as string, '')
          batchInserted++
        }
      } catch (err: any) {
        if (err.writeErrors) {
          for (const writeErr of err.writeErrors) {
            if (writeErr.code === 11000) {
              batchSkipped++
            }
          }
          const succeeded = err.insertedDocs || []
          for (const doc of succeeded) {
            const key = `${doc.college}:${doc.course}:${doc.year}:${doc.round}:${doc.quota}:${doc.category}`
            existingKeys.add(key)
            console.log(`INSERTED: [${source.label}] ...`)
          }
        } else {
          throw err
        }
      }
    }

    totalInserted += batchInserted
    payload.logger.info(`${source.label}: ${batchInserted} inserted in batch, ${batchSkipped} skipped`)
  }

  csvStream.end()

  payload.logger.info(`\n========== CUTOFF RECORDS IMPORT SUMMARY ==========`)
  payload.logger.info(`Total read: ${neetData.length + ayushData.length + vetData.length}`)
  payload.logger.info(`Total inserted: ${totalInserted}`)
  payload.logger.info(`Total skipped: ${totalSkipped}`)
  payload.logger.info(`\nSkipped reason breakdown:`)
  for (const [reason, count] of Object.entries(skipReasons).sort((a, b) => b[1] - a[1])) {
    payload.logger.info(`  ${reason}: ${count}`)
  }
  payload.logger.info(`\nCSV log written to ${LOG_FILE}`)
  payload.logger.info('Cutoff records seed completed.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
