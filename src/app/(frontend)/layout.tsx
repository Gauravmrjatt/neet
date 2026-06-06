import React from 'react'
import { Quicksand } from 'next/font/google'
import { TopBar } from '@/components/layout/TopBar'
import { Header } from '@/components/layout/Header'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand',
})

export const metadata = {
  description: 'Expert NEET and JOSAA counselling services',
  title: {
    default: 'NEET Counselling',
    template: '%s | NEET Counselling',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning className={quicksand.variable}>
      <body className="min-h-screen bg-background font-sans antialiased gov-dots">
        <div className="relative flex min-h-screen flex-col">
          <TopBar />
          <Header />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
