import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { getFooter } from '@/lib/queries/globals'
import { MediaImage } from '@/components/shared/MediaImage'
import { cn } from '@/lib/utils'

const PLATFORM_ICONS: Record<string, { letter: string; label: string }> = {
  facebook: { letter: 'F', label: 'Facebook' },
  twitter: { letter: 'X', label: 'Twitter' },
  instagram: { letter: 'I', label: 'Instagram' },
  youtube: { letter: 'Y', label: 'YouTube' },
  linkedin: { letter: 'L', label: 'LinkedIn' },
}

export async function Footer() {
  const footerData = await getFooter()
  const currentYear = new Date().getFullYear()
  const lastUpdated = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

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
                      alt="NEET Counselling Logo"
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
                NEET Counselling
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-primary/75">
                {footerData.description ||
                  'Expert NEET and JOSAA counselling services to help you secure your dream medical seat.'}
              </p>

              <div className="mt-5 flex items-center gap-2">
                {(footerData.socialLinks || []).map((social) => {
                  const icon: { letter: string; label: string } | undefined =
                    PLATFORM_ICONS[social.platform]
                  return (
                    <a
                      key={social.id ?? social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={icon?.label || social.platform}
                      className={cn(
                        'group inline-flex h-10 w-10 items-center justify-center rounded-full',
                        'bg-primary text-primary-foreground shadow-sm',
                        'transition-all duration-200 ease-out',
                        'hover:bg-button-gold hover:text-primary hover:-translate-y-0.5 hover:shadow-md',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-navbar-bg',
                      )}
                    >
                      <span className="font-display text-sm font-bold">
                        {icon?.letter || social.platform.charAt(0).toUpperCase()}
                      </span>
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
                'Content Owned and Maintained by NEET Counselling'}
            </p>
            <p className="text-xs font-medium text-primary/70">
              {footerData.copyright ||
                `© ${currentYear} NEET Counselling. All rights reserved.`}
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
