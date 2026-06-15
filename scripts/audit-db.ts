// @ts-nocheck
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

async function auditCollection(payload: Awaited<ReturnType<typeof getPayload>>, slug: string) {
  const total = await payload.count({ collection: slug })
  return { slug, total: total.totalDocs }
}

async function auditStates(payload: Awaited<ReturnType<typeof getPayload>>) {
  const states = await payload.find({ collection: 'states', limit: 100, depth: 0 })
  const fields = ['description', 'counsellingAuthority', 'counsellingProcess', 'importantDates', 'eligibilityNotes', 'documentRequirements', 'reservationPolicy', 'feeStructureNotes', 'featuredImage']
  const gaps: Record<string, string[]> = {}
  for (const s of states.docs) {
    const missing: string[] = []
    for (const f of fields) {
      const val = (s as any)[f]
      if (!val || (Array.isArray(val) && val.length === 0)) missing.push(f)
    }
    if (missing.length > 0) gaps[s.name] = missing
  }
  return { total: states.totalDocs, gapCount: Object.keys(gaps).length, gaps }
}

async function auditColleges(payload: Awaited<ReturnType<typeof getPayload>>) {
  const colleges = await payload.find({ collection: 'colleges', limit: 1000, depth: 0 })
  const fields = ['description', 'established', 'website', 'features', 'feeStructure.hostelFee', 'feeStructure.totalCourseFee', 'feeStructure.otherFees', 'hospitalInfo.hospitalBeds', 'hospitalInfo.specialties', 'ranking']
  const gaps: Record<string, string[]> = {}
  for (const c of colleges.docs) {
    const missing: string[] = []
    if (!c.description) missing.push('description')
    if (!c.established) missing.push('established')
    if (!c.website) missing.push('website')
    if (!c.features || c.features.length === 0) missing.push('features')
    const fs = c.feeStructure as any
    if (!fs?.hostelFee) missing.push('feeStructure.hostelFee')
    if (!fs?.totalCourseFee) missing.push('feeStructure.totalCourseFee')
    if (!fs?.otherFees) missing.push('feeStructure.otherFees')
    const hi = c.hospitalInfo as any
    if (!hi?.hospitalBeds) missing.push('hospitalInfo.hospitalBeds')
    if (!hi?.specialties) missing.push('hospitalInfo.specialties')
    if (!c.ranking) missing.push('ranking')
    if (missing.length > 0) gaps[c.name] = missing
  }
  return { total: colleges.totalDocs, gapCount: Object.keys(gaps).length, gaps }
}

async function main() {
  console.log('Connecting to Payload...')
  const payload = await getPayload({ config })
  console.log('Connected.\n')

  const results = await Promise.all([
    auditCollection(payload, 'states'),
    auditCollection(payload, 'colleges'),
    auditCollection(payload, 'cutoff-records'),
    auditCollection(payload, 'seat-matrix'),
    auditCollection(payload, 'bonds'),
    auditCollection(payload, 'stipends'),
    auditCollection(payload, 'counselling'),
    auditCollection(payload, 'counselors'),
  ])

  console.log('=== COLLECTION COUNTS ===')
  for (const r of results) {
    console.log(`  ${r.slug}: ${r.total}`)
  }

  console.log('\n=== STATE DATA GAPS ===')
  const stateAudit = await auditStates(payload)
  console.log(`  Total states: ${stateAudit.total}`)
  console.log(`  States with gaps: ${stateAudit.gapCount}`)
  for (const [name, missing] of Object.entries(stateAudit.gaps)) {
    console.log(`  ${name}: missing ${missing.join(', ')}`)
  }

  console.log('\n=== COLLEGE DATA GAPS ===')
  const collegeAudit = await auditColleges(payload)
  console.log(`  Total colleges: ${collegeAudit.total}`)
  console.log(`  Colleges with at least one gap: ${collegeAudit.gapCount}`)
  const fieldGapCounts: Record<string, number> = {}
  for (const [, missing] of Object.entries(collegeAudit.gaps)) {
    for (const f of missing) {
      fieldGapCounts[f] = (fieldGapCounts[f] || 0) + 1
    }
  }
  console.log('\n  Field gap frequency:')
  for (const [field, count] of Object.entries(fieldGapCounts).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / collegeAudit.total) * 100).toFixed(0)
    console.log(`    ${field}: ${count}/${collegeAudit.total} (${pct}%)`)
  }

  if (Object.keys(collegeAudit.gaps).length <= 20) {
    for (const [name, missing] of Object.entries(collegeAudit.gaps)) {
      console.log(`  ${name.slice(0, 60)}...: missing ${missing.join(', ')}`)
    }
  }

  // Check for garbage
  console.log('\n=== GARBAGE CHECK ===')
  const garbage = await payload.find({
    collection: 'colleges',
    where: {
      or: [
        { name: { contains: 'th 4 january' } },
        { name: { contains: 'selling' } },
        { name: { contains: 'december' } },
      ]
    },
    limit: 10, depth: 0,
  })
  if (garbage.docs.length > 0) {
    for (const g of garbage.docs) {
      console.log(`  GARBAGE: "${g.name}" (${g.id}) — status: ${g.status}`)
    }
  } else {
    console.log('  No garbage records found (already cleaned).')
  }

  console.log('\nAudit complete.')
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
