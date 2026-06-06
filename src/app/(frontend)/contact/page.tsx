import React from 'react'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { ContactForm } from '@/components/contact/ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Contact',
    description: 'Get in touch with our team',
    path: '/contact',
  })
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with our team — we're here to help you with your NEET counselling journey."
      />
      <Section className="bg-navbar-bg/30">
        <Container>
          <ContactForm
            contactEmail={settings?.contactEmail}
            phone={settings?.phone}
            address={settings?.address}
          />
        </Container>
      </Section>
    </>
  )
}
