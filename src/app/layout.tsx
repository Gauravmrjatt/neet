import { Quicksand } from 'next/font/google'
import Script from 'next/script'
import './(frontend)/globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand',
})

export const metadata = {
  description: 'Expert NEET counselling for MBBS, BDS, AYUSH & Veterinary admissions in India. College predictor, rank analysis, and personalised counselling guidance.',
  title: {
    default: 'NEET Counselling',
    template: '%s | NEET Counselling',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    siteName: 'NEET Counselling',
    type: 'website',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={quicksand.variable}>
      <body className="min-h-screen bg-background font-sans antialiased gov-dots">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q4SJYP45EQ"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q4SJYP45EQ');
          `}
        </Script>
      </body>
    </html>
  )
}
