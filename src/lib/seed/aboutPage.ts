import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'

interface RichTextParagraph {
  type: 'paragraph'
  version: 1
  children: { type: 'text'; text: string; version: 1 }[]
  direction: 'ltr'
  format: ''
  indent: 0
}

function paragraph(text: string): RichTextParagraph {
  return {
    type: 'paragraph',
    version: 1,
    children: [{ type: 'text', text, version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
  }
}

const defaultMissionBody = {
  root: {
    type: 'root',
    version: 1,
    children: [
      paragraph(
        'We are dedicated to providing expert guidance and support to NEET aspirants. Our team of experienced counsellors helps students navigate the complex counselling process and make informed decisions about their medical career.',
      ),
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
  },
}

const defaultTeamBody = {
  root: {
    type: 'root',
    version: 1,
    children: [
      paragraph(
        'Our team consists of medical professionals, education experts, and experienced counsellors who have guided thousands of students to successful admissions in top medical colleges across India.',
      ),
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
  },
}

const defaultWhyChooseUsItems = [
  { text: 'Experienced counsellors with proven track records' },
  { text: 'Personalized guidance tailored to your needs' },
  { text: 'Comprehensive support throughout the counselling process' },
  { text: 'Access to exclusive resources and video content' },
  { text: 'Live sessions for real-time interaction with experts' },
]

const defaultSeo = {
  metaTitle: 'About | NEET Counselling',
  metaDescription: 'Learn about our mission to help NEET aspirants achieve their dreams through expert guidance and personalized counselling.',
  keywords: [
    { keyword: 'NEET counselling' },
    { keyword: 'about us' },
    { keyword: 'NEET aspirants' },
  ],
}

export async function seedAboutPage(): Promise<void> {
  const payload = await getPayload({ config })

  const existing = await payload.findGlobal({ slug: 'about-page' })

  const data: Record<string, unknown> = {
    hero: {
      title: existing?.hero?.title || 'About Us',
      subtitle:
        existing?.hero?.subtitle ||
        'Our mission is to help NEET aspirants achieve their dreams through expert guidance and personalized counselling.',
      badge: existing?.hero?.badge ?? undefined,
    },
    mission: {
      heading: existing?.mission?.heading || 'Our Mission',
      body: existing?.mission?.body || defaultMissionBody,
    },
    whyChooseUs: {
      heading: existing?.whyChooseUs?.heading || 'Why Choose Us?',
      items:
        existing?.whyChooseUs?.items && existing.whyChooseUs.items.length > 0
          ? existing.whyChooseUs.items
          : defaultWhyChooseUsItems,
    },
    team: {
      heading: existing?.team?.heading || 'Our Team',
      body: existing?.team?.body || defaultTeamBody,
    },
    extraSections: existing?.extraSections ?? [],
    seo: {
      metaTitle: existing?.seo?.metaTitle || defaultSeo.metaTitle,
      metaDescription: existing?.seo?.metaDescription || defaultSeo.metaDescription,
      ogImage: existing?.seo?.ogImage ?? undefined,
      keywords:
        existing?.seo?.keywords && existing.seo.keywords.length > 0
          ? existing.seo.keywords
          : defaultSeo.keywords,
      noIndex: existing?.seo?.noIndex ?? false,
    },
  }

  await payload.updateGlobal({
    slug: 'about-page',
    data: data as any,
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedAboutPage()
    .then(() => {
      console.log('About page global seeded successfully')
      process.exit(0)
    })
    .catch((err) => {
      console.error('Failed to seed about page global:', err)
      process.exit(1)
    })
}
