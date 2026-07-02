import React from 'react'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/shared/JsonLd'
import { getPageSeoByPath } from '@/lib/page-seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { ContactForm } from '@/components/contact/ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath('/contact')
  return generateSEOMetadata({
    title: pageSeo?.metaTitle || 'Contact Us — NEET Counselling Experts | MBBS Admission Guidance',
    description:
      pageSeo?.metaDescription ||
      'Contact NEET Counsellors for expert NEET counselling guidance. Call +91 9509698208 , +91 9261878208 or email neetcounselors@gmail.com. We help you secure your medical seat.',
    path: '/contact',
    ogImage: pageSeo?.ogImage || undefined,
    keywords: pageSeo?.keywords || undefined,
    noIndex: pageSeo?.noIndex || undefined,
  })
}

export default async function ContactPage() {
  const [settings, siteUrl, pageSeo] = await Promise.all([
    getSiteSettings(),
    Promise.resolve(process.env.NEXT_PUBLIC_SITE_URL || 'https://neetcounselors.com'),
    getPageSeoByPath('/contact'),
  ])

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: 'Home', url: siteUrl },
          { name: pageSeo?.breadcrumbLabel || 'Contact', url: `${siteUrl}/contact` },
        ])}
      />
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with our team — we're here to help you with your NEET counselling journey."
      />
      <Section className="bg-card">
        <Container>
          <ContactForm
            contactEmail={settings?.contactEmail}
            phone={settings?.phone}
            address={settings?.address}
            socialMedia={(settings as any)?.socialMedia}
          />
        </Container>
      </Section>
    </>
  )
}
