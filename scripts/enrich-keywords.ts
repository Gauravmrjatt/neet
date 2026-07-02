// @ts-nocheck
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const CSV_KEYWORDS = [
  'neet mds counselling 2026 date',
  'neet mds 2026 counselling date',
  'neet mds counselling 2025',
  're neet admit card 2026',
  'neet re exam date 2026',
  'nta neet refund',
  'mcc neet mds',
  're neet date',
  'eamcet counselling dates 2026',
  'neet mds result 2026',
  'neet mds 2026 result',
  'neet refund amount 2026 date',
  'nbems',
  'neet mds 2026 cut off',
  'nbems neet mds',
  'tnea counselling 2026 date',
  'neet pg 2026 exam date',
  'neet admit card 2026 release date',
  'csab counselling 2026',
  'neet pg 2026 registration date',
  'inicet counselling july 2026',
  'neet mds score card 2026',
  'inicet may 2026 counselling',
  'ts eamcet 2026 counselling date',
  'neet ss 2026 exam date',
  'neet mds 2026 college allotment',
  'neet nta nic in',
  'tg eapcet counselling date 2026',
  're neet city intimation slip 2026',
  'tnea counselling 2026 registration',
  'reneet 2026 admit card',
  'neet refund portal',
  'neet ss 2025 counselling delay',
  'neet mds counselling',
  'neet mds counselling 2026',
  'mds counselling 2026',
  'neet mds 2026',
  'neet mds',
  'neet 2026 refund',
  'tnea',
  'kcet counselling date 2026',
  'kcet',
  're neet 2026 exam date',
  'josaa counselling',
  'cet counselling 2026',
  'tnea counselling 2026',
  'kcet counselling',
]

const HOMEPAGE_KEYWORDS = [
  'neet mds counselling',
  'neet pg counselling',
  'mcc counselling',
  'neet re exam',
  'neet admit card',
  'neet refund',
  'eamcet counselling',
  'kcet counselling',
]

const PAGE_SEO = {
  '/blog': {
    breadcrumb: 'Blog',
    title: 'NEET 2026 Blog — MDS, PG, Re-exam, Refund & Admit Card Updates',
    description:
      'Latest NEET 2026 updates including MDS counselling dates, re-exam schedule, refund status, admit card release, and PG counselling. Expert articles from experienced counsellors.',
    keywords: [
      'neet mds result',
      'neet re exam date',
      'neet refund',
      'nta neet refund',
      're neet admit card',
    ],
  },
  '/contact': {
    breadcrumb: 'Contact',
    title: 'Contact NEET Counselling Experts — UG, PG & MDS Admission 2026',
    description:
      'Get in touch with our NEET counselling experts for personalised guidance on UG, PG and MDS admissions 2026. Call +91-9509698208 or email for immediate assistance.',
    keywords: ['neet counselling', 'mds counselling', 'neet mds counselling 2026'],
  },
  '/counsellors': {
    breadcrumb: 'Counsellors',
    title: 'Best NEET Counsellors 2026 — UG, PG & MDS Admission Guidance',
    description:
      "Connect with India's top NEET counsellors for UG, PG and MDS admission 2026. Get personalised college selection, choice filling strategy and counselling support.",
    keywords: [
      'neet counselling',
      'neet mds counselling',
      'neet pg counselling',
      'neet mds 2026 counselling date',
    ],
  },
  '/helpdesk': {
    breadcrumb: 'Helpdesk',
    title: 'NEET Counselling Helpdesk 2026 — MDS, PG, Re-exam & Refund Support',
    description:
      'Get answers to all your NEET counselling queries. Find help with MDS counselling, re-exam process, refund claim, admit card download, and state counselling schedules.',
    keywords: [
      'neet refund',
      'neet re exam date',
      'neet mds counselling',
      'neet admit card release date',
    ],
  },
  '/faq': {
    breadcrumb: 'FAQs',
    title: 'NEET & MDS Counselling FAQ 2026 — Re-exam, Refund, Admit Card',
    description:
      'Answers to frequently asked questions about NEET 2026 counselling, MDS counselling, re-examination process, refund portal, admit card download, and state counselling.',
    keywords: [
      'neet refund portal',
      'neet refund amount',
      're neet city intimation slip',
      'reneet 2026 admit card',
      'neet nta nic in',
    ],
  },
  '/videos': {
    breadcrumb: 'Videos',
    title: 'NEET Counselling Videos 2026 — UG, PG & MDS Tips & Guidance',
    description:
      'Watch expert NEET counselling videos for UG, PG and MDS 2026. Step-by-step guides on college selection, choice filling, document verification, and seat allotment process.',
    keywords: [
      'neet mds counselling',
      'counselling process',
      'neet pg counselling',
      'mds counselling 2026',
    ],
  },
  '/live-counselling': {
    breadcrumb: 'Live Counselling',
    title: 'Live NEET Counselling Sessions 2026 — MDS, PG & UG Expert Guidance',
    description:
      'Join live counselling sessions with NEET experts for UG, PG and MDS 2026. Get real-time answers to your admission questions and personalised guidance.',
    keywords: [
      'neet mds counselling',
      'neet pg 2026 registration date',
      'neet ss 2026 exam date',
      'nbems',
    ],
  },
  '/live-counselling/[id]': {
    breadcrumb: 'Session',
    title: 'NEET Live Counselling Session — MDS, PG & UG Admission Guidance',
    description:
      'Expert live counselling session for NEET UG, PG and MDS 2026 admissions. Get personalised guidance, college recommendations, and choice filling strategy.',
    keywords: [
      'neet counselling',
      'neet mds counselling 2026',
      'mds counselling',
      'neet pg counselling',
    ],
  },
  '/josaa-counsellor': {
    breadcrumb: 'JOSAA Counsellor',
    title: 'JOSAA & NEET Counselling 2026 — Expert Guidance for Engineering & Medical',
    description:
      'Get expert JOSAA and NEET counselling guidance for 2026. College selection, choice filling strategy, and admission support for IITs, NITs, and medical colleges.',
    keywords: [
      'josaa counselling',
      'csab counselling 2026',
      'neet counselling',
      'neet pg counselling',
    ],
  },
  '/counselling': {
    breadcrumb: 'Counselling',
    title: 'Complete NEET & MDS Counselling Guide 2026 — UG, PG, State Quota',
    description:
      'Expert NEET counselling guide for UG, PG, and MDS 2026. AIQ counselling process, state quota details, choice filling strategy, document checklist, and tips from experienced counsellors.',
    keywords: [
      'neet mds counselling 2026',
      'mds counselling',
      'mcc neet mds',
      'neet pg 2026 exam date',
      'inicet counselling',
    ],
  },
  '/counselling/state': {
    breadcrumb: 'State Counselling',
    title: 'State-Wise NEET Counselling 2026 — EAMCET, KCET, TNEA, JOSAA Dates',
    description:
      'Get state-wise NEET counselling information for all Indian states. EAMCET, KCET, TNEA, JOSAA, CSAB counselling dates, eligibility, reservation policy, and college lists.',
    keywords: [
      'eamcet counselling dates 2026',
      'kcet counselling',
      'tnea counselling',
      'csab counselling',
      'cet counselling',
      'ts eamcet counselling',
      'tg eapcet counselling',
    ],
  },
  '/colleges': {
    breadcrumb: 'Colleges',
    title: 'Medical & Dental Colleges in India 2026 — NEET MDS, UG Cutoff & Fees',
    description:
      'Browse all NMC/DCI approved medical and dental colleges in India. Compare NEET UG and NEET MDS 2026 cutoff, fees, seat matrix for government, private and deemed colleges.',
    keywords: [
      'neet mds colleges',
      'neet mds cut off',
      'mds counselling 2026',
      'neet mds college allotment',
      'neet mds 2026',
    ],
  },
}

const FAQ_KEYWORDS = {
  'What is NEET Counselling 2026?': ['neet counselling', 'mcc counselling', 'neet mds counselling'],
  'When will NEET Counselling 2026 start?': [
    'neet mds counselling 2026 date',
    'neet mds 2026 counselling date',
    'neet pg 2026 registration date',
  ],
  'What is the minimum NEET score required?': [
    'neet mds 2026 cut off',
    'neet re exam date',
    'neet mds 2026',
  ],
  'What documents are needed for NEET counselling?': [
    're neet admit card 2026',
    'neet admit card 2026 release date',
    'reneet 2026 admit card',
  ],
  'Should I register for both AIQ and State counselling?': [
    'mcc neet mds',
    'josaa counselling',
    'csab counselling 2026',
  ],
  'How many rounds are in NEET counselling?': [
    'neet mds counselling',
    'mds counselling 2026',
    'neet ss 2025 counselling delay',
  ],
  'Can I get MBBS with 400 marks?': [
    'neet mds 2026 cut off',
    'neet mds',
    'neet mds 2026 college allotment',
  ],
  'What is AIQ counselling?': ['mcc neet mds', 'neet mds counselling', 'neet mds counselling 2026'],
  'How does state quota counselling work?': [
    'eamcet counselling dates 2026',
    'kcet counselling',
    'tnea counselling 2026',
  ],
  'Is MBBS abroad a good option?': ['neet mds result 2026', 'neet mds score card 2026'],
  'What are MBBS fees in India?': [
    'neet 2026 refund',
    'neet refund amount 2026 date',
    'neet refund portal',
  ],
  'Can I change college preference after locking?': [
    'neet mds counselling',
    'mds counselling',
    'counselling process',
  ],
  'What is the mop-up round?': [
    'neet ss 2026 exam date',
    'neet ss 2025 counselling delay',
    'counselling process',
  ],
  'How to verify NMC approved colleges?': ['neet nta nic in', 'neet mds colleges', 'neet mds'],
  'What is the reservation policy?': [
    'neet pg 2026 exam date',
    'kcet counselling date 2026',
    'cet counselling 2026',
  ],
  'What if I miss the registration deadline?': [
    'neet mds 2026 counselling date',
    'neet mds counselling 2026 date',
    're neet date',
  ],
  'How can I get help with NEET counselling?': [
    'neet counselling',
    'neet mds counselling',
    'mds counselling 2026',
  ],
  'Can NRI students apply?': [
    'neet mds 2026',
    'neet pg 2026 registration date',
    'inicet counselling july 2026',
  ],
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting keyword enrichment...')

  let updated = 0
  let skipped = 0

  // 1. HOMEPAGE SEO
  payload.logger.info('\n--- Homepage SEO ---')
  const homeSeo = await payload.findGlobal({ slug: 'home-page-seo' })
  if (!homeSeo?.keywords?.length) {
    await payload.updateGlobal({
      slug: 'home-page-seo',
      data: {
        metaTitle: 'NEET MDS & NEET PG Counselling 2026 — Dates, Cutoff, Refund, Admit Card',
        metaDescription:
          'Complete NEET counselling guide for UG, PG, MDS 2026. Get MCC counselling dates, NEET re-exam updates, admit card release, refund status, and state counselling schedules including EAMCET, KCET, TNEA, and JOSAA.',
        keywords: HOMEPAGE_KEYWORDS.map((k) => ({ keyword: k })),
      },
    })
    payload.logger.info('  Updated homepage SEO')
    updated++
  } else {
    payload.logger.info('  Homepage already has keywords, skipping')
    skipped++
  }

  // 2. PAGE SEO global (12 routes)
  payload.logger.info('\n--- Page SEO global ---')
  const pageSeo = await payload.findGlobal({ slug: 'page-seo' })
  const existingPages = new Set((pageSeo?.pages || []).map((p) => p.page))
  const newPages = []

  for (const [route, data] of Object.entries(PAGE_SEO)) {
    if (existingPages.has(route)) {
      payload.logger.info('  "' + route + '" already has SEO entry, skipping')
      skipped++
      continue
    }
    newPages.push({
      page: route,
      breadcrumbLabel: data.breadcrumb,
      metaTitle: data.title,
      metaDescription: data.description,
      keywords: data.keywords.map((k) => ({ keyword: k })),
      noIndex: false,
    })
  }

  if (newPages.length > 0) {
    await payload.updateGlobal({
      slug: 'page-seo',
      data: {
        pages: [...(pageSeo?.pages || []), ...newPages],
      },
    })
    payload.logger.info('  Inserted ' + newPages.length + ' new page SEO entries')
    updated += newPages.length
  } else {
    payload.logger.info('  All pages already have SEO entries')
    skipped++
  }

  // 3. PREDICTOR PAGE SEO
  payload.logger.info('\n--- Predictor Page SEO ---')
  const predictor = await payload.findGlobal({ slug: 'predictor-page' })
  if (!predictor?.seo?.keywords?.length) {
    await payload.updateGlobal({
      slug: 'predictor-page',
      data: {
        seo: {
          metaTitle: 'NEET 2026 College Predictor — Predict MBBS, BDS & MDS College Chances',
          metaDescription:
            'Predict your chances of getting into MBBS, BDS and MDS colleges based on NEET rank, category, and state quota. Free AI-powered NEET college predictor for 2026 counselling.',
          keywords: [
            { keyword: 'neet college predictor' },
            { keyword: 'neet mds college allotment' },
            { keyword: 'neet mds 2026' },
            { keyword: 'neet pg counselling' },
            { keyword: 'neet mds 2026 cut off' },
          ],
        },
      },
    })
    payload.logger.info('  Updated predictor page SEO')
    updated++
  } else {
    payload.logger.info('  Predictor page already has keywords, skipping')
    skipped++
  }

  // 4. PRICING PAGE SEO
  payload.logger.info('\n--- Pricing Page SEO ---')
  const pricing = await payload.findGlobal({ slug: 'pricing-page' })
  if (!pricing?.seo?.keywords?.length) {
    await payload.updateGlobal({
      slug: 'pricing-page',
      data: {
        seo: {
          metaTitle: 'NEET Counselling Plans 2026 — MDS, PG & UG Guidance Packages',
          metaDescription:
            'Choose the right NEET counselling plan for UG, PG or MDS 2026. Get college prediction, expert guidance, choice filling strategy and complete admission support from experienced counsellors.',
          keywords: [
            { keyword: 'neet counselling' },
            { keyword: 'mds counselling' },
            { keyword: 'neet mds counselling' },
            { keyword: 'neet pg counselling' },
          ],
        },
      },
    })
    payload.logger.info('  Updated pricing page SEO')
    updated++
  } else {
    payload.logger.info('  Pricing page already has keywords, skipping')
    skipped++
  }

  // 5. HELPDESK FAQ ITEMS
  payload.logger.info('\n--- Helpdesk FAQ Items ---')
  const faqs = await payload.find({ collection: 'helpdesk', limit: 100, depth: 0 })
  let faqUpdated = 0
  let faqSkipped = 0

  for (const faq of faqs.docs) {
    if (faq?.seo?.keywords?.length > 0) {
      faqSkipped++
      continue
    }
    const keywords = FAQ_KEYWORDS[faq.question]
    if (!keywords) {
      payload.logger.info('  No keyword mapping for: "' + faq.question.slice(0, 50) + '..."')
      faqSkipped++
      continue
    }
    await payload.update({
      collection: 'helpdesk',
      id: faq.id,
      data: {
        seo: {
          metaTitle: faq.question,
          metaDescription: faq.question + ' — Get expert answers about NEET counselling 2026.',
          keywords: keywords.map((k) => ({ keyword: k })),
        },
      },
      depth: 0,
    })
    faqUpdated++
  }
  payload.logger.info('  Updated ' + faqUpdated + ' FAQ items (' + faqSkipped + ' skipped)')
  updated += faqUpdated

  // 6. VIDEOS
  payload.logger.info('\n--- Videos ---')
  const videos = await payload.find({ collection: 'videos', limit: 100, depth: 0 })
  let videoUpdated = 0
  for (const v of videos.docs) {
    if (v?.seo?.keywords?.length > 0) {
      videoUpdated++
      continue
    }
    await payload.update({
      collection: 'videos',
      id: v.id,
      data: {
        seo: {
          metaTitle: v.title || 'NEET Counselling Video',
          metaDescription:
            'Watch "' +
            v.title +
            '" — expert NEET counselling video for UG, PG and MDS 2026 admissions guidance.',
          keywords: [
            { keyword: 'neet mds counselling' },
            { keyword: 'neet counselling' },
            { keyword: 'mds counselling 2026' },
          ],
        },
      },
      depth: 0,
    })
    videoUpdated++
  }
  payload.logger.info('  Updated ' + videoUpdated + ' videos')
  updated += videoUpdated

  // 7. COUNSELORS
  payload.logger.info('\n--- Counselors ---')
  const counselors = await payload.find({ collection: 'counselors', limit: 100, depth: 0 })
  let counselorUpdated = 0
  for (const c of counselors.docs) {
    if (c?.seo?.keywords?.length > 0) {
      counselorUpdated++
      continue
    }
    await payload.update({
      collection: 'counselors',
      id: c.id,
      data: {
        seo: {
          metaTitle: c.name + ' — NEET Counsellor for UG, PG & MDS Guidance 2026',
          metaDescription:
            'Connect with ' +
            c.name +
            ', an experienced NEET counsellor for UG, PG and MDS 2026 admissions. Get personalised college selection and counselling guidance.',
          keywords: [
            { keyword: 'neet counselling' },
            { keyword: 'neet mds counselling' },
            { keyword: 'neet pg counselling' },
            { keyword: 'mds counselling 2026' },
          ],
        },
      },
      depth: 0,
    })
    counselorUpdated++
  }
  payload.logger.info('  Updated ' + counselorUpdated + ' counselors')
  updated += counselorUpdated

  payload.logger.info('\n=== Keyword Enrichment Summary ===')
  payload.logger.info('Updated: ' + updated)
  payload.logger.info('Skipped: ' + skipped)
  payload.logger.info('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
