import Link from 'next/link'
import { getFooter } from '@/lib/queries/globals'
import { MediaImage } from '@/components/shared/MediaImage'

const PLATFORM_ICONS: Record<string, { letter: string; label: string }> = {
  facebook: { letter: 'F', label: 'Facebook' },
  twitter: { letter: 'T', label: 'Twitter' },
  instagram: { letter: 'I', label: 'Instagram' },
  youtube: { letter: 'Y', label: 'YouTube' },
  linkedin: { letter: 'L', label: 'LinkedIn' },
}

export async function Footer() {
  const footerData = await getFooter()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      {/* Policy links row */}
      <div className="bg-[#062963] text-white py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs sm:text-sm">
          {(footerData.policyLinks || []).map((link) => (
            <Link
              key={link.id ?? link.url}
              href={link.url}
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
              {footerData.logo ? (
                <div className="mb-3">
                  <MediaImage
                    media={footerData.logo}
                    alt="NEET Counselling Logo"
                    width={120}
                    height={40}
                  />
                </div>
              ) : (
                <h3 className="text-lg font-bold text-[#062963] mb-3">NEET Counselling</h3>
              )}
              <p className="text-sm text-[#062963]/70 mb-4">
                {footerData.description || 'Expert NEET and JOSAA counselling services to help you secure your dream medical seat.'}
              </p>
              <div className="flex gap-3">
                {(footerData.socialLinks || []).map((social) => {
                  const icon = PLATFORM_ICONS[social.platform]
                  return (
                    <a
                      key={social.id ?? social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-[#062963] text-white rounded-full flex items-center justify-center hover:bg-[#FBAC1A] hover:text-[#062963] transition-colors"
                      aria-label={icon?.label || social.platform}
                    >
                      <span className="text-xs font-bold">{icon?.letter || social.platform.charAt(0).toUpperCase()}</span>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Footer columns */}
            {(footerData.columns || []).map((column) => (
              <div key={column.id ?? column.title}>
                <h3 className="text-sm font-bold text-[#062963] mb-3 uppercase tracking-wider">{column.title}</h3>
                <ul className="space-y-2">
                  {(column.links || []).map((link) => (
                    <li key={link.id ?? link.url}>
                      <Link
                        href={link.url}
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
              {footerData.creditsText || 'Content Owned and Maintained by NEET Counselling'}
            </p>
            <p className="text-xs text-[#062963]/60">
              {footerData.copyright || `© ${currentYear} NEET Counselling. All rights reserved.`}
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
