import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'

const MISSING_UTS = [
  {
    name: 'Delhi',
    code: 'DL',
    authority: 'Directorate of Medical Education, Delhi & MCC',
    website: 'https://mcc.nic.in',
  },
  {
    name: 'Puducherry',
    code: 'PY',
    authority: 'Centralised Admission Committee (CENTAC)',
    website: 'https://centac.puducherry.gov.in',
  },
  {
    name: 'Chandigarh',
    code: 'CH',
    authority: 'GMCH Chandigarh / PU',
    website: 'https://mcc.nic.in',
  },
  {
    name: 'Andaman and Nicobar Islands',
    code: 'AN',
    authority: 'Directorate of Health Services, A&N Islands',
    website: '',
  },
  {
    name: 'Jammu and Kashmir',
    code: 'JK',
    authority: 'Jammu and Kashmir BOPEE',
    website: 'https://jkbopee.gov.in',
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    code: 'DN',
    authority: 'Directorate of Medical Education, Gujarat',
    website: '',
  },
]

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Seeding missing states/UTs...')

  let inserted = 0
  let skipped = 0

  for (const ut of MISSING_UTS) {
    const existing = await payload.find({
      collection: 'states',
      where: {
        name: { equals: ut.name },
      },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      payload.logger.info(`  SKIPPED: ${ut.name} - already exists`)
      skipped++
      continue
    }

    await payload.create({
      collection: 'states',
      data: {
        name: ut.name,
        slug: ut.name.toLowerCase().replace(/\s+/g, '-'),
        code: ut.code,
        counsellingAuthority: ut.authority,
        counsellingWebsite: ut.website,
        counsellingProcess: `${ut.name} NEET counselling is conducted by ${ut.authority}.`,
        status: 'active',
        order: 35 + inserted,
        seo: {
          metaTitle: `${ut.name} NEET Counselling 2026 — State Quota, Cutoff, Fees`,
          metaDescription: `Get complete details about ${ut.name} NEET counselling 2026. Check state quota MBBS/BDS admission process, counselling dates, merit list, and cutoffs for government and private medical colleges in ${ut.name}.`,
          keywords: [
            { keyword: `${ut.name} NEET counselling 2026` },
            { keyword: `${ut.name} MBBS admission` },
            { keyword: `${ut.name} medical college cutoffs` },
            { keyword: `NEET state quota ${ut.code}` },
          ],
        } as any,
      },
      depth: 0,
    })
    payload.logger.info(`  INSERTED: ${ut.name}`)
    inserted++
  }

  payload.logger.info(`\nMissing states summary: Inserted=${inserted}, Skipped=${skipped}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
