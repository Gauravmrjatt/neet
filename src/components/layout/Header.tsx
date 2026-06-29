import { getHeader, getSiteSettings } from '@/lib/queries/globals'
import { MediaImage } from '@/components/shared/MediaImage'
import { CallButton } from '@/components/shared/CallButton'
import { MobileMenu } from '@/components/layout/MobileMenu'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export async function Header() {
  const [settings, headerData] = await Promise.all([getSiteSettings(), getHeader()])

  const phone = (settings as any)?.phone || ''
  const hindiTitle = (settings as any)?.siteNameHindi || 'नीट काउंसलिंग'
  const englishTitle = (settings as any)?.siteName || 'NEET Counselling'
  const tagline =
    (settings as any)?.siteDescription ||
    headerData?.tagline ||
    'Expert NEET and JOSAA Counselling Services'
  const logo = headerData?.logo
  const emblem = headerData?.emblem
  const navigation = headerData?.navigation || []
  const ctaButton = headerData?.ctaButton

  return (
    <header
      className={cn(
        'top-0 z-40 w-full',
        'border-b border-border/70 bg-white backdrop-blur-md',
        'shadow-sm',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Mobile menu + Left logo */}
        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-3">
          <Link href={process.env.NEXT_PUBLIC_BASE_URL || '/'}>
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl sm:h-16 sm:w-16">
              {logo ? (
                <MediaImage
                  media={logo}
                  width={64}
                  height={64}
                  className="h-12 w-12 object-contain sm:h-16 sm:w-16"
                />
              ) : (
                <span className="font-display text-sm font-bold text-primary-foreground sm:text-base">
                  Neet
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Centered title block */}
        <Link href={process.env.NEXT_PUBLIC_BASE_URL || '/'}>
          <div className="flex min-w-0 flex-1 flex-col items-center px-2 text-center">
            <div className="font-display text-balance text-base font-bold leading-tight tracking-tight text-primary sm:text-xl md:text-2xl">
              <span className=" text-black font-light" lang="hi">
                {hindiTitle}
              </span>
              <br />
              <span className="text-primary">{englishTitle}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-[11px] font-medium text-foreground/70 sm:text-sm">
              {tagline}
            </p>
          </div>
        </Link>
        {/* Right emblem */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <Link href={process.env.NEXT_PUBLIC_BASE_URL || '/'}>
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl   sm:h-16 sm:w-16">
              {emblem ? (
                <MediaImage
                  media={emblem}
                  width={64}
                  height={64}
                  className="h-12 w-12 object-contain sm:h-16 sm:w-16"
                />
              ) : (
                <span className="font-display text-sm font-bold text-primary-foreground sm:text-base">
                  NTA
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Decorative gold accent bar — keeps the brand stripe without a hard border */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full bg-gradient-to-r from-button-gold via-button-gold-hover to-button-gold"
      />
    </header>
  )
}
