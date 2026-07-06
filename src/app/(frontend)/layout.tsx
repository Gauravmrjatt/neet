import React from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Header } from '@/components/layout/Header'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/shared/JsonLd'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/structured-data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neetcounselors.com'
const siteName = 'NEET Counselling'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <JsonLd data={generateOrganizationSchema(siteName, [])} />
      <JsonLd data={generateWebSiteSchema({
        name: siteName,
        url: siteUrl,
        description: 'Expert NEET counselling for MBBS, BDS, AYUSH & Veterinary admissions in India.',
        searchActionUrl: `${siteUrl}/predictor?rank={search_term_string}`,
      })} />
      <a href="#main" className="skip-to-content">
        Skip to content
      </a>
      <TopBar />
      <Header />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
