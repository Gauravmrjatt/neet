// @ts-nocheck
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const PAGE_KEYWORDS = {
  '/blog': ['neet mds result', 'neet re exam date', 'neet refund', 'nta neet refund', 're neet admit card'],
  '/contact': ['neet counselling', 'mds counselling', 'neet mds counselling 2026'],
  '/counsellors': ['neet counselling', 'neet mds counselling', 'neet pg counselling', 'neet mds 2026 counselling date'],
  '/helpdesk': ['neet refund', 'neet re exam date', 'neet mds counselling', 'neet admit card release date'],
  '/faq': ['neet refund portal', 'neet refund amount', 're neet city intimation slip', 'reneet 2026 admit card', 'neet nta nic in'],
  '/videos': ['neet mds counselling', 'counselling process', 'neet pg counselling', 'mds counselling 2026'],
  '/live-counselling': ['neet mds counselling', 'neet pg 2026 registration date', 'neet ss 2026 exam date', 'nbems'],
  '/live-counselling/[id]': ['neet counselling', 'neet mds counselling 2026', 'mds counselling', 'neet pg counselling'],
  '/josaa-counsellor': ['josaa counselling', 'csab counselling 2026', 'neet counselling', 'neet pg counselling'],
  '/counselling': ['neet mds counselling 2026', 'mds counselling', 'mcc neet mds', 'neet pg 2026 exam date', 'inicet counselling'],
  '/counselling/state': ['eamcet counselling dates 2026', 'kcet counselling', 'tnea counselling', 'csab counselling', 'cet counselling', 'ts eamcet counselling', 'tg eapcet counselling'],
  '/colleges': ['neet mds colleges', 'neet mds cut off', 'mds counselling 2026', 'neet mds college allotment', 'neet mds 2026'],
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting Page SEO keyword enrichment...')

  const pageSeo = await payload.findGlobal({ slug: 'page-seo' })
  const pages = pageSeo?.pages || []
  let updated = 0
  let skipped = 0

  const updatedPages = pages.map(entry => {
    const kw = PAGE_KEYWORDS[entry.page]
    if (!kw) {
      skipped++
      return entry
    }
    if (entry.keywords?.length > 0) {
      payload.logger.info('  "' + entry.page + '" already has ' + entry.keywords.length + ' keywords, skipping')
      skipped++
      return entry
    }
    payload.logger.info('  "' + entry.page + '" -> adding ' + kw.length + ' keywords')
    updated++
    return {
      ...entry,
      keywords: kw.map(k => ({ keyword: k })),
    }
  })

  if (updated > 0) {
    await payload.updateGlobal({
      slug: 'page-seo',
      data: { pages: updatedPages },
    })
    payload.logger.info('\nUpdated ' + updated + ' page SEO entries with keywords')
  }

  payload.logger.info('Skipped: ' + skipped)
  payload.logger.info('Done.')
  process.exit(0)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
