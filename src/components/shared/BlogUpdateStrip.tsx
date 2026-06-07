import Link from 'next/link'
import { ArrowRight, Newspaper } from 'lucide-react'

export function BlogUpdateStrip() {
  return (
    <div className="bg-background py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/blog"
          aria-label="Visit our blog for latest NEET and JOSAA updates"
          className="group flex items-center justify-between gap-3 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold border border-primary-navy/15 bg-card-bg hover:bg-card-bg hover:border-primary-navy/35 hover:shadow-md text-primary-navy transition-all duration-200 ease-out"
        >
          <span className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 w-9 h-9 rounded-xl bg-button-gold/15 text-primary-navy flex items-center justify-center group-hover:bg-button-gold/25 transition-colors duration-200 ease-out">
              <Newspaper className="w-4 h-4" aria-hidden="true" />
            </span>
            <span className="truncate">
              📢 &nbsp;नवीनतम JOSAA अपडेट्स &amp; गाइड्स के लिए हमारा ब्लॉग देखें &nbsp;|&nbsp; Visit our Blog for Latest NEET &amp; JOSAA Updates
            </span>
          </span>
          <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform duration-200 ease-out" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
