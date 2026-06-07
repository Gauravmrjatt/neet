'use client'

import Link from 'next/link'
import { Megaphone } from 'lucide-react'

interface TickerItem {
  title: string
  link?: string
  isActive?: boolean
}

interface NewsTickerProps {
  items?: TickerItem[]
}

const defaultItems: TickerItem[] = [
  { title: 'NEET 2026 Counselling Schedule Released', link: '/blog', isActive: true },
  { title: 'JOSAA Round 1 Choice Filling Started', link: '/blog', isActive: true },
  { title: 'New Counselors Added - Book Your Session', link: '/counsellors', isActive: true },
  { title: 'Download NEET Rank Predictor Tool', link: '/tools', isActive: true },
]

export function NewsTicker({ items }: NewsTickerProps) {
  const tickerItems = items?.length ? items.filter(i => i.isActive) : defaultItems

  if (tickerItems.length === 0) return null

  const duplicated = [...tickerItems, ...tickerItems]

  return (
    <div
      role="region"
      aria-label="Latest news"
      className="bg-primary-navy text-white border-y border-primary-navy-dark/60 shadow-sm"
    >
      <div className="max-w-6xl mx-auto flex items-stretch overflow-hidden">
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-button-gold text-primary-navy font-bold uppercase tracking-wide text-xs sm:text-sm whitespace-nowrap rounded-r-2xl">
          <Megaphone className="w-4 h-4" aria-hidden="true" />
          <span>Latest News</span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-primary-navy to-transparent z-10 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-primary-navy to-transparent z-10 pointer-events-none" aria-hidden="true" />
          <div className="animate-marquee flex items-center h-full">
            {duplicated.map((item, index) => (
              <span
                key={index}
                className="mx-6 sm:mx-8 text-sm whitespace-nowrap font-medium flex items-center gap-3"
              >
                <span
                  aria-hidden="true"
                  className="inline-block w-1.5 h-1.5 rounded-full bg-button-gold shrink-0"
                />
                {item.link ? (
                  <Link
                    href={item.link}
                    className="hover:text-button-gold transition-colors duration-200 ease-out"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span>{item.title}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
