import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'ladakh': ['Kargil', 'Leh'],
  'lakshadweep': ['Lakshadweep'],
}

const STATE_INFO: Record<string, { name: string; code: string; authority: string; website: string }> = {
  'ladakh': { name: 'Ladakh', code: 'LA', authority: 'UT Health & Medical Education Department, Ladakh', website: '' },
  'lakshadweep': { name: 'Lakshadweep', code: 'LD', authority: 'Directorate of Health Services, Lakshadweep', website: '' },
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting missing states seed...')

  const allStates = await payload.find({ collection: 'states', limit: 100, depth: 0 })
  const existingSlugs = new Set(allStates.docs.map((s: any) => s.slug))
  payload.logger.info(`Existing states: ${Array.from(existingSlugs).join(', ')}`)

  const stateSlugs = Object.keys(DISTRICTS_BY_STATE)
  const missingSlugs = stateSlugs.filter((s) => !existingSlugs.has(s))
  if (missingSlugs.length === 0) {
    payload.logger.info('No missing states to add.')
    process.exit(0)
  }
  payload.logger.info(`Missing states to add: ${missingSlugs.join(', ')}`)

  for (const slug of missingSlugs) {
    const info = STATE_INFO[slug]
    const districts = DISTRICTS_BY_STATE[slug]
    const { name, code, authority, website } = info

    const state = await payload.create({
      collection: 'states',
      data: {
        name,
        slug,
        code,
        counsellingAuthority: authority,
        counsellingWebsite: website,
        counsellingProcess: `${name} NEET counselling is conducted by ${authority}. Students must register on the official portal and participate in choice filling and seat allotment rounds.`,
        status: 'active',
        order: 0,
        seo: {
          metaTitle: `${name} NEET Counselling 2026 — State Quota, Cutoff, Fees`,
          metaDescription: `Get complete details about ${name} NEET counselling 2026. Check MBBS/BDS admission process, counselling dates, merit list, and cutoffs for medical colleges in ${name}.`,
          keywords: [
            { keyword: `${name} NEET counselling 2026` },
            { keyword: `${name} MBBS admission` },
            { keyword: `${name} medical colleges` },
          ],
        },
      },
    })
    payload.logger.info(`Created state: ${name} (${slug}) [${state.id}]`)

    for (const districtName of districts) {
      const districtSlug = districtName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const existingDistrict = await payload.find({
        collection: 'districts',
        where: { slug: { equals: districtSlug } },
        depth: 0,
        limit: 1,
      })
      if (existingDistrict.docs.length > 0) {
        payload.logger.info(`  District already exists: ${districtName}, skipping`)
        continue
      }
      await payload.create({
        collection: 'districts',
        data: {
          name: districtName,
          slug: districtSlug,
          state: state.id,
          status: 'active',
          description: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: `${districtName} is a district in the Union Territory of ${name}, India.` }] }],
              direction: 'ltr',
            },
          },
        },
      })
      payload.logger.info(`  Created district: ${districtName}`)
    }
  }

  payload.logger.info('Missing states and districts seeded successfully.')
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
