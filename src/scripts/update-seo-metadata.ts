import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const EXTRA_KEYWORDS: Record<string, string[]> = {
  'neet-counselling': ['NEET UG counselling', 'MBBS counselling process', 'medical seat allotment', 'NEET 2026 counselling registration', 'online NEET counselling'],
  'mbbs-admission': ['MBBS admission 2026', 'how to get MBBS seat', 'MBBS eligibility criteria', 'NEET UG admission process', 'medical college admission'],
  'cutoff': ['NEET cutoff ranks', 'MBBS closing rank', 'category wise cutoff', 'NEET previous year cutoff', 'medical college cutoff 2025'],
  'fees': ['MBBS fee structure', 'medical college fees India', 'government MBBS fees', 'private MBBS fees', 'hostel fees medical college'],
  'documents-required': ['NEET counselling documents', 'document verification NEET', 'MBBS admission documents list', 'NEET required documents 2026', 'original documents NEET counselling'],
  'choice-filling': ['NEET choice filling', 'choice locking NEET', 'college preference list', 'NEET choice filling strategy', 'how to fill NEET choices'],
  'seat-matrix': ['MBBS seat matrix', 'AIQ seats', 'state quota seats', 'medical college seat distribution', 'category wise MBBS seats'],
  'all-medical-colleges': ['list of MBBS colleges', 'NMC approved medical colleges', 'top medical colleges', 'MBBS college near me', 'medical colleges India'],
  'government-medical-colleges': ['government MBBS colleges', 'affordable MBBS colleges', 'government medical seat', 'low fee MBBS colleges', 'govt medical college admission'],
  'private-medical-colleges': ['private MBBS colleges', 'management quota MBBS', 'NRI quota MBBS', 'private medical college fees India', 'deemed university MBBS'],
  'mcc-counselling': ['MCC counselling 2026', 'AIQ counselling registration', 'mcc.nic.in counselling', 'All India Quota NEET', 'MCC seat allotment 2026'],
  'state-counselling': ['state NEET counselling', 'state quota MBBS', 'domicile based counselling', 'state counselling registration', 'state merit list NEET'],
  'expected-cutoff': ['expected NEET cutoff 2026', 'NEET rank predictor', 'predicted MBBS cutoff', 'NEET cutoff estimate', 'medical college expected cutoff'],
  'important-dates': ['NEET 2026 dates', 'counselling schedule NEET', 'MBBS admission dates 2026', 'NEET registration deadline', 'seat allotment result date'],
  'faq': ['NEET counselling FAQ', 'MBBS admission questions', 'NEET eligibility FAQ', 'medical college queries', 'NEET counselling doubts'],
  'news': ['NEET latest news', 'MBBS admission news', 'medical education news India', 'NMC latest updates', 'NEET counselling announcements'],
  'updates': ['NEET counselling updates 2026', 'latest NEET news today', 'MBBS admission alerts', 'NEET counselling round updates', 'seat allotment results'],
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting SEO metadata update...')

  // Load state data
  const statesResult = await payload.find({ collection: 'states', limit: 100, depth: 0 })
  const statesMap = new Map<string, any>()
  for (const s of statesResult.docs as any[]) {
    statesMap.set(s.id, s)
  }

  // Load districts
  const districtsResult = await payload.find({ collection: 'districts', limit: 2000, depth: 0 })
  const districtsMap = new Map<string, any>()
  for (const d of districtsResult.docs as any[]) {
    districtsMap.set(d.id, d)
  }

  // Load all district content
  const contentResult = await payload.find({
    collection: 'district-content',
    where: { status: { equals: 'published' } },
    limit: 20000,
    depth: 0,
  })
  const entries = contentResult.docs as any[]
  payload.logger.info(`Loaded ${entries.length} content entries`)

  let updated = 0
  let errors = 0

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const districtId = entry.district as string
    const district = districtsMap.get(districtId)
    if (!district) continue
    const stateId = district.state as string
    const state = statesMap.get(stateId)
    if (!state) continue

    const type = entry.type
    const extraKeywords = EXTRA_KEYWORDS[type] || []

    if (extraKeywords.length === 0) continue

    try {
      const existingKeywords = entry.seo?.keywords?.map((k: any) => k.keyword?.toLowerCase().trim()).filter(Boolean) || []
      const newKeywords = extraKeywords.filter((kw) => !existingKeywords.includes(kw.toLowerCase()))

      if (newKeywords.length === 0) continue

      const updatedKWs = [
        ...(entry.seo?.keywords || []),
        ...newKeywords.map((kw) => ({ keyword: kw })),
      ]

      await payload.update({
        collection: 'district-content',
        id: entry.id,
        data: {
          seo: {
            ...(entry.seo || {}),
            keywords: updatedKWs,
          },
        } as any,
        depth: 0,
      })
      updated++
    } catch (err: any) {
      errors++
      if (errors <= 5) payload.logger.error(`Error ${entry.id}: ${err.message}`)
    }

    if ((i + 1) % 1000 === 0) {
      payload.logger.info(`${i + 1}/${entries.length} — ${updated} updated, ${errors} errors`)
    }
  }

  payload.logger.info(`\nDone — Updated: ${updated}, Errors: ${errors}`)
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
