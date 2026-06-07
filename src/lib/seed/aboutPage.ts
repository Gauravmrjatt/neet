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

function richText(body: string) {
  return {
    root: {
      type: 'root',
      version: 1,
      children: [paragraph(body)],
      direction: 'ltr',
      format: '',
      indent: 0,
    },
  }
}

const defaults = {
  hero: {
    badge: 'Our Story',
    title: 'About Us',
    subtitle:
      'Our mission is to help NEET aspirants achieve their dreams through expert guidance and personalized counselling.',
  },
  mission: {
    heading: 'Our Mission',
    body: richText(
      'We are dedicated to providing expert guidance and support to NEET aspirants. Our team of experienced counsellors helps students navigate the complex counselling process and make informed decisions about their medical career. From rank prediction to choice filling, we walk beside you at every step — with clarity, empathy, and a deep understanding of how admissions really work.',
    ),
    stats: [
      { value: '10k+', label: 'Students guided', accent: 'navy' },
      { value: '500+', label: 'Partner colleges', accent: 'navy' },
      { value: '15+', label: 'Years experience', accent: 'navy' },
      { value: '95%', label: 'Satisfaction rate', accent: 'gold' },
    ],
  },
  whyChooseUs: {
    heading: 'Why Choose Us',
    intro: 'Six reasons students and parents across India trust us with their NEET journey.',
    items: [
      {
        title: 'Proven Track Record',
        description:
          'Experienced counsellors with thousands of successful admissions to top medical colleges across India.',
        icon: 'Award',
      },
      {
        title: 'Personalized Guidance',
        description:
          'One-on-one strategy sessions tailored to your rank, category, and college preferences.',
        icon: 'Target',
      },
      {
        title: 'Comprehensive Resources',
        description:
          'Exclusive guides, video walkthroughs, and round-wise prediction tools at your fingertips.',
        icon: 'BookOpen',
      },
      {
        title: 'Live Expert Support',
        description:
          'Real-time interaction with mentors during choice filling and seat allotment windows.',
        icon: 'Headphones',
      },
      {
        title: 'Student-First Approach',
        description:
          'Honest, transparent advice — we recommend what is best for you, not what is easiest to sell.',
        icon: 'Heart',
      },
      {
        title: 'Parent & Student Loop',
        description:
          'Dedicated updates and clarifications for parents throughout the counselling journey.',
        icon: 'Users',
      },
    ],
  },
  team: {
    heading: 'Our Team',
    body: richText(
      'Our team consists of medical professionals, education experts, and experienced counsellors who have guided thousands of students to successful admissions in top medical colleges across India. We bring a rare mix of clinical insight, admissions know-how, and the patience to listen.',
    ),
    stats: [
      { value: '20+', label: 'Medical experts', accent: 'navy' },
      { value: '30+', label: 'Senior counsellors', accent: 'navy' },
      { value: '8+', label: 'Avg. years of guidance', accent: 'gold' },
    ],
  },
  extraSections: [],
  seo: {
    metaTitle: 'About | NEET Counselling',
    metaDescription:
      'Learn about our mission to help NEET aspirants achieve their dreams through expert guidance and personalized counselling.',
    keywords: [
      { keyword: 'NEET counselling' },
      { keyword: 'about us' },
      { keyword: 'NEET aspirants' },
    ],
    noIndex: false,
  },
}

export async function seedAboutPage(): Promise<void> {
  const payload = await getPayload({ config })
  const existing = await payload.findGlobal({ slug: 'about-page' })

  const data: Record<string, unknown> = {
    hero: {
      badge: existing?.hero?.badge ?? defaults.hero.badge,
      title: existing?.hero?.title || defaults.hero.title,
      subtitle: existing?.hero?.subtitle || defaults.hero.subtitle,
    },
    mission: {
      heading: existing?.mission?.heading || defaults.mission.heading,
      body: existing?.mission?.body ?? defaults.mission.body,
      stats:
        existing?.mission?.stats && existing.mission.stats.length > 0
          ? existing.mission.stats
          : defaults.mission.stats,
    },
    whyChooseUs: {
      heading: existing?.whyChooseUs?.heading || defaults.whyChooseUs.heading,
      intro: existing?.whyChooseUs?.intro || defaults.whyChooseUs.intro,
      items:
        existing?.whyChooseUs?.items && existing.whyChooseUs.items.length > 0
          ? existing.whyChooseUs.items
          : defaults.whyChooseUs.items,
    },
    team: {
      heading: existing?.team?.heading || defaults.team.heading,
      body: existing?.team?.body ?? defaults.team.body,
      stats:
        existing?.team?.stats && existing.team.stats.length > 0
          ? existing.team.stats
          : defaults.team.stats,
    },
    extraSections: existing?.extraSections ?? defaults.extraSections,
    seo: {
      metaTitle: existing?.seo?.metaTitle || defaults.seo.metaTitle,
      metaDescription: existing?.seo?.metaDescription || defaults.seo.metaDescription,
      ogImage: existing?.seo?.ogImage ?? undefined,
      keywords:
        existing?.seo?.keywords && existing.seo.keywords.length > 0
          ? existing.seo.keywords
          : defaults.seo.keywords,
      noIndex: existing?.seo?.noIndex ?? defaults.seo.noIndex,
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
