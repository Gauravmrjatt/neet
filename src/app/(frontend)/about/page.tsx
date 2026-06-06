import React from 'react'
import type { Metadata } from 'next'
import { Sparkles, Target, Heart, Users, BookOpen, Award, Headphones } from 'lucide-react'
import { getPageBySlug } from '@/lib/queries'
import { generatePageMetadata } from '@/lib/seo'
import { BlockRenderer } from '@/components/blocks'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about')
  if (page) {
    return generatePageMetadata({
      seo: page.seo ? {
        metaTitle: page.seo.metaTitle || undefined,
        metaDescription: page.seo.metaDescription || undefined,
        ogImage: page.seo.ogImage ? { url: (page.seo.ogImage as any).url || undefined } : undefined,
        keywords: page.seo.keywords?.map((k: any) => k.keyword).filter(Boolean) as string[] | undefined,
        noIndex: page.seo.noIndex || undefined,
      } : undefined,
      title: page.title,
      slug: page.slug,
    })
  }
  return {
    title: 'About',
    description: 'Learn about our mission to help NEET aspirants',
  }
}

const whyChooseUs = [
  {
    icon: Award,
    title: 'Proven Track Record',
    description: 'Experienced counsellors with thousands of successful admissions to top medical colleges across India.',
  },
  {
    icon: Target,
    title: 'Personalized Guidance',
    description: 'One-on-one strategy sessions tailored to your rank, category, and college preferences.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Resources',
    description: 'Exclusive guides, video walkthroughs, and round-wise prediction tools at your fingertips.',
  },
  {
    icon: Headphones,
    title: 'Live Expert Support',
    description: 'Real-time interaction with mentors during choice filling and seat allotment windows.',
  },
  {
    icon: Heart,
    title: 'Student-First Approach',
    description: 'Honest, transparent advice — we recommend what is best for you, not what is easiest to sell.',
  },
  {
    icon: Users,
    title: 'Parent & Student Loop',
    description: 'Dedicated updates and clarifications for parents throughout the counselling journey.',
  },
]

function DefaultAboutPage() {
  return (
    <>
      <PageHero
        badge="Our Story"
        title="About Us"
        subtitle="Our mission is to help NEET aspirants achieve their dreams through expert guidance and personalized counselling."
      />

      {/* Mission band — soft cream with gold accent */}
      <Section tone="cream" density="normal">
        <Container className="max-w-5xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-button-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-navy">
                <Sparkles className="h-3.5 w-3.5 text-button-gold" aria-hidden="true" />
                Our Mission
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
                Guiding every NEET aspirant to the right medical college
              </h2>
              <p className="mt-5 text-base leading-relaxed text-foreground/75 sm:text-lg">
                We are dedicated to providing expert guidance and support to NEET aspirants.
                Our team of experienced counsellors helps students navigate the complex counselling
                process and make informed decisions about their medical career.
              </p>
              <p className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">
                From rank prediction to choice filling, we walk beside you at every step — with
                clarity, empathy, and a deep understanding of how admissions really work.
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="glass-card rounded-3xl p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:shadow-md">
                    <p className="font-display text-3xl font-bold text-primary-navy">10k+</p>
                    <p className="mt-1 text-sm text-foreground/70">Students guided</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:shadow-md">
                    <p className="font-display text-3xl font-bold text-primary-navy">500+</p>
                    <p className="mt-1 text-sm text-foreground/70">Partner colleges</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:shadow-md">
                    <p className="font-display text-3xl font-bold text-primary-navy">15+</p>
                    <p className="mt-1 text-sm text-foreground/70">Years experience</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:shadow-md">
                    <p className="font-display text-3xl font-bold text-button-gold">95%</p>
                    <p className="mt-1 text-sm text-foreground/70">Satisfaction rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Why choose us — feature grid */}
      <Section className="bg-background">
        <Container className="max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-navy">
              Why Choose Us
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
              A counselling experience built around you
            </h2>
            <p className="mt-3 text-base text-foreground/70 sm:text-lg">
              Six reasons students and parents across India trust us with their NEET journey.
            </p>
          </div>

          <ul
            role="list"
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {whyChooseUs.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-button-gold/15 text-primary-navy transition-colors duration-200 ease-out group-hover:bg-button-gold group-hover:text-primary-navy">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-primary-navy">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Team band */}
      <Section tone="muted" density="normal">
        <Container className="max-w-4xl">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-button-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-navy">
              Our Team
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
              Mentors who have been in your seat
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">
              Our team consists of medical professionals, education experts, and experienced
              counsellors who have guided thousands of students to successful admissions in
              top medical colleges across India. We bring a rare mix of clinical insight,
              admissions know-how, and the patience to listen.
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-navbar-bg p-5">
                <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  Medical experts
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-primary-navy">20+</dd>
              </div>
              <div className="rounded-2xl bg-navbar-bg p-5">
                <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  Senior counsellors
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-primary-navy">30+</dd>
              </div>
              <div className="rounded-2xl bg-navbar-bg p-5">
                <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                  Avg. years of guidance
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-button-gold">8+</dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default async function AboutPage() {
  const page = await getPageBySlug('about')

  if (page?.content) {
    return <BlockRenderer blocks={page.content} />
  }

  return <DefaultAboutPage />
}
