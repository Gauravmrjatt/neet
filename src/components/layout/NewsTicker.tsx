'use client'

import Link from 'next/link'

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
    <div style={{height : "60px"}} className="bg-[#062963] text-white py-3 flex overflow-hidden relative ">
      <div className="max-w-6xl mx-auto flex items-center">
        <div style={{paddingRight : "50px"}} className="py-1 text-2xl  uppercase">
          Latest News
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee">
            {duplicated.map((item, index) => (
              <span key={index} className="mx-8 text-sm whitespace-nowrap">
                {item.link ? (
                  <Link href={item.link} className="hover:underline">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
