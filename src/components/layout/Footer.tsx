import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { getFooter, getSiteSettings } from '@/lib/queries/globals'
import { MediaImage } from '@/components/shared/MediaImage'
import { cn } from '@/lib/utils'

const SOCIAL_SVGS: Record<string, { viewBox: string; path: string; label: string }> = {
  facebook: {
    viewBox: '0 0 24 24',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    label: 'Facebook',
  },
  twitter: {
    viewBox: '0 0 24 24',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    label: 'Twitter',
  },
  instagram: {
    viewBox: '0 0 24 24',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    label: 'Instagram',
  },
  youtube: {
    viewBox: '0 0 24 24',
    path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    label: 'YouTube',
  },
  linkedin: {
    viewBox: '0 0 24 24',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    label: 'LinkedIn',
  },
}

export async function Footer() {
  const [footerData, settings] = await Promise.all([
    getFooter(),
    getSiteSettings(),
  ])
  const siteName = (settings as any)?.siteName || 'NEET Counselling'
  const currentYear = new Date().getFullYear()
  const lastUpdated = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Build social links from SiteSettings.socialMedia first, fallback to Footer.socialLinks
  const socialMedia = (settings as any)?.socialMedia
  const socialLinks: Array<{ platform: string; url: string }> = []

  if (socialMedia) {
    for (const platform of ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin']) {
      const url = socialMedia[platform]
      if (url && typeof url === 'string' && url.trim()) {
        socialLinks.push({ platform, url: url.trim() })
      }
    }
  }

  // Fallback to Footer global socialLinks if SiteSettings has none
  if (socialLinks.length === 0 && footerData.socialLinks) {
    for (const link of footerData.socialLinks) {
      if (link.platform && link.url) {
        socialLinks.push({ platform: link.platform, url: link.url })
      }
    }
  }

  return (
    <footer className="mt-16 border-t border-border bg-background text-foreground">
      {/* Policy links row — deep navy band */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-4 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-2 font-semibold tracking-wide text-button-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-button-gold" aria-hidden="true" />
            Quick Links
          </span>
          <span
            aria-hidden="true"
            className="hidden h-3 w-px bg-primary-foreground/20 sm:block"
          />
          {(footerData.policyLinks || []).map((link) => (
            <Link
              key={link.id ?? link.url}
              href={link.url}
              className={cn(
                'rounded-full px-2 py-1 font-medium',
                'text-primary-foreground/90 transition-all duration-200 ease-out',
                'hover:text-button-gold hover:underline underline-offset-4',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main footer content — cream band */}
      <div className="bg-navbar-bg text-primary">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand column */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="mb-4 flex items-center gap-3">
                {footerData.logo ? (
                  <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-sm ring-1 ring-border">
                    <MediaImage
                      media={footerData.logo}
                      alt={`${siteName} Logo`}
                      width={120}
                      height={40}
                      className="h-8 w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-display text-base font-bold text-primary-foreground shadow-sm">
                    NC
                  </div>
                )}
              </div>
              <h3 className="font-display text-lg font-bold tracking-tight text-primary">
                {siteName}
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-primary/75">
                {footerData.description ||
                  'Expert NEET and JOSAA counselling services to help you secure your dream medical seat.'}
              </p>

              <div className="mt-5 flex items-center gap-2">
                {socialLinks.map(({ platform, url }) => {
                  const icon = SOCIAL_SVGS[platform]
                  if (!icon) return null
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={icon.label}
                      className={cn(
                        'group inline-flex h-10 w-10 items-center justify-center rounded-full',
                        'bg-primary text-primary-foreground shadow-sm',
                        'transition-all duration-200 ease-out',
                        'hover:bg-button-gold hover:text-primary hover:-translate-y-0.5 hover:shadow-md',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-navbar-bg',
                      )}
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox={icon.viewBox}
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d={icon.path} />
                      </svg>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Footer link columns */}
            {(footerData.columns || []).map((column) => (
              <div key={column.id ?? column.title}>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                  <span
                    aria-hidden="true"
                    className="mr-2 inline-block h-2 w-2 -translate-y-px rounded-full bg-button-gold"
                  />
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {(column.links || []).map((link) => (
                    <li key={link.id ?? link.url}>
                      <Link
                        href={link.url}
                        className={cn(
                          'inline-flex items-center gap-1.5 text-sm font-medium',
                          'text-primary/75 transition-colors duration-200 ease-out',
                          'hover:text-primary',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-button-gold/80 transition-all duration-200 group-hover:w-2"
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact / get in touch column (always present, graceful when empty) */}
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                <span
                  aria-hidden="true"
                  className="mr-2 inline-block h-2 w-2 -translate-y-px rounded-full bg-button-gold"
                />
                Get In Touch
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-primary/80">
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-button-gold" aria-hidden="true" />
                  <span className="font-medium">Mon&ndash;Sat, 10:00&ndash;18:00 IST</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-button-gold" aria-hidden="true" />
                  <span className="break-all font-medium">
                    support@neetcounselling.example
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Credits bar */}
        <div className="border-t border-primary/10 bg-navbar-bg">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
            <p className="text-xs font-medium text-primary/70">
              {footerData.creditsText ||
                `Content Owned and Maintained by ${siteName}`}
            </p>
            <p className="text-xs font-medium text-primary/70">
              {footerData.copyright ||
                `© ${currentYear} ${siteName}. All rights reserved.`}
            </p>
            <p className="text-xs font-medium text-primary/70">
              <span className="text-button-gold" aria-hidden="true">
                ●
              </span>{' '}
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
