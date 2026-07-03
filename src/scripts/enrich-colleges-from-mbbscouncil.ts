import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import mbbscouncilColleges from '../data/mbbscouncil-colleges.json'
import cutoffData from '../data/neet-allotment-data.json'

interface CollegeRecord {
  st: string
  affl: string
  nfees: number
  seats: number
  vurl: string
  wurl: string
  gfees: number
  dt: string
  estd: string
  avgp: string
  ctype: string
  ourl: string
  mfees: number
  iurl: string
  name: string
  course: string
  addr: string
  cont: string
  beds: number
  cid: number
  misc: string
}

interface CutoffRecord {
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
  score: number
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function enrich() {
  const payload = await getPayload({ config: config as any })

  const colleges = mbbscouncilColleges as unknown as CollegeRecord[]
  const cutoff = cutoffData as CutoffRecord[]

  // Build a lookup: normalized institute name -> mbbscouncil college
  const collegeLookup: Record<string, CollegeRecord> = {}
  for (const c of colleges) {
    collegeLookup[normalize(c.name)] = c
  }

  // Also build by ourl (URL slug) as fallback
  const ourlLookup: Record<string, CollegeRecord> = {}
  for (const c of colleges) {
    if (c.ourl) ourlLookup[normalize(c.ourl)] = c
  }

  // Get unique institute names from cutoff data
  const uniqueInstitutes = [...new Set(cutoff.map((r) => r.institute))]
  console.log(`Total unique institutes from cutoff data: ${uniqueInstitutes.length}`)

  let matched = 0
  let updated = 0
  let skipped = 0
  let notFound: string[] = []

  for (const instName of uniqueInstitutes) {
    const key = normalize(instName)
    const mcCollege = collegeLookup[key] || ourlLookup[key]

    if (!mcCollege) {
      if (notFound.length < 20) notFound.push(instName)
      continue
    }

    // Find matching CMS Payload college
    const result = await payload.find({
      collection: 'colleges',
      where: {
        name: { equals: instName },
      },
      limit: 1,
    })

    let doc: any = result.docs[0]

    if (!doc) {
      // Fallback: try case-insensitive search
      const all = await payload.find({
        collection: 'colleges',
        where: {
          name: { like: instName.substring(0, 25) },
        },
        limit: 30,
      })
      doc = all.docs.find((d: any) => normalize(d.name) === key)
    }

    if (!doc) {
      if (notFound.length < 20 && !notFound.includes(instName)) {
        notFound.push(instName)
      }
      continue
    }

    matched++
    const updates: Record<string, unknown> = {}

    if (mcCollege.dt && !doc.city) {
      updates.city = mcCollege.dt
    }

    if (mcCollege.wurl && !doc.website) {
      updates.website = mcCollege.wurl
    }

    if (mcCollege.estd) {
      const year = parseInt(mcCollege.estd, 10)
      if (!isNaN(year) && year > 1800 && !doc.established) {
        updates.established = year
      }
    }

    const annualFee = mcCollege.nfees || mcCollege.gfees || mcCollege.mfees || 0
    if (annualFee > 0 && (!doc.feeStructure?.mbbsAnnual)) {
      updates.feeStructure = {
        ...((doc.feeStructure as any) || {}),
        mbbsAnnual: annualFee,
      }
    }

    if (mcCollege.beds && (!doc.hospitalInfo?.hospitalBeds)) {
      updates.hospitalInfo = {
        ...((doc.hospitalInfo as any) || {}),
        hospitalBeds: mcCollege.beds,
      }
    }

    if (mcCollege.seats && doc.courses && (doc.courses as any[]).length > 0) {
      const updatedCourses = (doc.courses as any[]).map((c: any) => {
        if ((!c.seats || c.seats === 0) && mcCollege.seats) {
          return { ...c, seats: mcCollege.seats }
        }
        return c
      })
      updates.courses = updatedCourses
    }

    if (Object.keys(updates).length > 0) {
      await payload.update({
        collection: 'colleges',
        id: doc.id,
        data: updates,
      })
      updated++
    } else {
      skipped++
    }
  }

  console.log(`\nSummary:`)
  console.log(`  Matched: ${matched}/${uniqueInstitutes.length}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Skipped (already complete): ${skipped}`)
  if (notFound.length > 0) {
    console.log(`  Not found in CMS (sample): ${notFound.slice(0, 15).join(', ')}`)
  }

  process.exit(0)
}

enrich().catch((err) => {
  console.error('Enrichment failed:', err)
  process.exit(1)
})
