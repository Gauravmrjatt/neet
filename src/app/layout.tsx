import { Quicksand } from 'next/font/google'
import './(frontend)/globals.css'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={quicksand.variable}>
      <body className="min-h-screen bg-background font-sans antialiased gov-dots">
        {children}
      </body>
    </html>
  )
}
