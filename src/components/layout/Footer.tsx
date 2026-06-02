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
              className="hover:underline opacity-90 hover:opacity-100 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-bold text-white mb-3">NEET Counselling</h3>
              <p className="text-sm text-gray-400 mb-4">
                Expert NEET and JOSAA counselling services to help you secure your dream medical seat.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#FBAC1A] transition-colors" aria-label="Facebook">
                  <span className="text-xs">F</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#FBAC1A] transition-colors" aria-label="Twitter">
                  <span className="text-xs">T</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#FBAC1A] transition-colors" aria-label="Instagram">
                  <span className="text-xs">I</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#FBAC1A] transition-colors" aria-label="YouTube">
                  <span className="text-xs">Y</span>
                </a>
              </div>
            </div>

            {/* Footer columns */}
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-white mb-3">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
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
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col items-center justify-between gap-2 md:flex-row">
            <p className="text-xs text-gray-500">
              Content Owned and Maintained by <strong className="text-gray-400">NEET Counselling</strong>
            </p>
            <p className="text-xs text-gray-500">
              &copy; {currentYear} NEET Counselling. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
