import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getHeader, getSiteSettings } from '@/lib/queries/globals'
import { MediaImage } from '@/components/shared/MediaImage'
import { CallButton } from '@/components/shared/CallButton'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { MobileMenu } from './MobileMenu'
import { cn } from '@/lib/utils'

export async function Header() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const settings = await getSiteSettings()
  const headerData = await getHeader()

  const phone = (settings as any)?.phone || ''
  const hindiTitle = headerData?.hindiTitle || 'नीट काउंसलिंग'
  const englishTitle = headerData?.englishTitle || 'NEET Counselling'
  const tagline = headerData?.tagline || 'Expert NEET and JOSAA Counselling Services'
  const logo = headerData?.logo
  const emblem = headerData?.emblem
  const navigation = headerData?.navigation || []
  const ctaButton = headerData?.ctaButton

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full',
        'border-b border-border/70 bg-white/85 backdrop-blur-md',
        'shadow-sm',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Left logo / emblem */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-primary shadow-sm ring-1 ring-primary/10 sm:h-16 sm:w-16">
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
        </div>

        {/* Centered title block */}
        <div className="flex min-w-0 flex-1 flex-col items-center px-2 text-center">
          <h1 className="font-display text-balance text-base font-bold leading-tight tracking-tight text-primary sm:text-xl md:text-2xl">
            <span lang="hi">{hindiTitle}</span>
            <span className="mx-1.5 text-button-gold sm:mx-2" aria-hidden="true">
              |
            </span>
            <span className="text-primary">{englishTitle}</span>
          </h1>
          <p className="mt-1 line-clamp-2 text-[11px] font-medium text-foreground/70 sm:text-sm">
            {tagline}
          </p>
          {phone ? (
            <div className="mt-2">
              <CallButton phone={phone} />
            </div>
          ) : null}
        </div>

        {/* Right emblem */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="hidden h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-primary shadow-sm ring-1 ring-primary/10 sm:flex sm:h-16 sm:w-16">
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
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="md:hidden">
            <MobileMenu user={user} navigation={navigation} ctaButton={ctaButton} />
          </div>
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
