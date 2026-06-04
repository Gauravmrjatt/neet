import Link from 'next/link'

const POLICY_LINKS = [
  { label: 'Copyright Policy', href: '/copyright' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Hyperlink Policy', href: '/hyperlinks' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Help', href: '/helpdesk' },
]

const FOOTER_COLUMNS = [
  {
    title: 'Services',
    links: [
      { label: 'NEET Counselling', href: '/services/neet' },
      { label: 'JOSAA Counselling', href: '/services/josaa' },
      { label: 'College Predictor', href: '/tools/predictor' },
      { label: 'Rank Analysis', href: '/tools/rank-analysis' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Videos', href: '/videos' },
      { label: 'FAQs', href: '/helpdesk' },
      { label: 'Helpdesk', href: '/helpdesk' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Counsellors', href: '/counsellors' },
      { label: 'Live Counselling', href: '/live-counselling' },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      {/* Policy links row */}
      <div className="bg-[#062963] text-white py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs sm:text-sm">
          {POLICY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#FBAC1A] opacity-90 hover:opacity-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="bg-[#F6F3EE] text-[#062963]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-bold text-[#062963] mb-3">NEET Counselling</h3>
              <p className="text-sm text-[#062963]/70 mb-4">
                Expert NEET and JOSAA counselling services to help you secure your dream medical seat.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-[#062963] text-white rounded-full flex items-center justify-center hover:bg-[#FBAC1A] hover:text-[#062963] transition-colors" aria-label="Facebook">
                  <span className="text-xs font-bold">F</span>
                </a>
                <a href="#" className="w-9 h-9 bg-[#062963] text-white rounded-full flex items-center justify-center hover:bg-[#FBAC1A] hover:text-[#062963] transition-colors" aria-label="Twitter">
                  <span className="text-xs font-bold">T</span>
                </a>
                <a href="#" className="w-9 h-9 bg-[#062963] text-white rounded-full flex items-center justify-center hover:bg-[#FBAC1A] hover:text-[#062963] transition-colors" aria-label="Instagram">
                  <span className="text-xs font-bold">I</span>
                </a>
                <a href="#" className="w-9 h-9 bg-[#062963] text-white rounded-full flex items-center justify-center hover:bg-[#FBAC1A] hover:text-[#062963] transition-colors" aria-label="YouTube">
                  <span className="text-xs font-bold">Y</span>
                </a>
              </div>
            </div>

            {/* Footer columns */}
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-bold text-[#062963] mb-3 uppercase tracking-wider">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#062963]/70 hover:text-[#062963] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Credits bar */}
        <div className="border-t border-[#062963]/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col items-center justify-between gap-2 md:flex-row">
            <p className="text-xs text-[#062963]/60">
              Content Owned and Maintained by <strong className="text-[#062963]">NEET Counselling</strong>
            </p>
            <p className="text-xs text-[#062963]/60">
              &copy; {currentYear} NEET Counselling. All rights reserved.
            </p>
            <p className="text-xs text-[#062963]/60">
              Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
