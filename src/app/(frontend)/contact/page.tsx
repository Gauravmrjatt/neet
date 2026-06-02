import React from 'react'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/queries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
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
    <Section>
      <Container>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">Get in touch with our team</p>
        </div>
        <ContactForm
          contactEmail={settings?.contactEmail}
          phone={settings?.phone}
          address={settings?.address}
        />
      </Container>
    </Section>
  )
}
