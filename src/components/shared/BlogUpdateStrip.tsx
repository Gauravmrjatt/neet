import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function BlogUpdateStrip() {
  return (
    <div className="bg-white py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/blog"
          className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold border border-[#062963]/20 bg-[#F8F8F8] hover:bg-[#062963]/5 transition-colors text-[#062963]"
        >
          <span>
            📢 &nbsp;नवीनतम JOSAA अपडेट्स &amp; गाइड्स के लिए हमारा ब्लॉग देखें &nbsp;|&nbsp; Visit our Blog for Latest NEET &amp; JOSAA Updates
          </span>
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </Link>
      </div>
    </div>
  )
}
