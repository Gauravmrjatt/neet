import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { MediaImage } from '@/components/shared/MediaImage'
import { CallButton } from '@/components/shared/CallButton'

export async function Header() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  let settings: any = {}
  try {
    settings = await payload.findGlobal({ slug: 'site-settings' })
  } catch {}

  let headerData: any = {}
  try {
    headerData = await payload.findGlobal({ slug: 'header' })
  } catch {}

  const phone = settings?.phone || ''
  const hindiTitle = headerData?.hindiTitle || 'नीट काउंसलिंग'
  const englishTitle = headerData?.englishTitle || 'NEET Counselling'
  const tagline = headerData?.tagline || 'Expert NEET and JOSAA Counselling Services'
  const logo = headerData?.logo
  const emblem = headerData?.emblem

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto overflow-hidden">
        <div className="w-12 sm:w-16 h-12 sm:h-16 flex-shrink-0 flex items-center justify-center">
          {logo ? (
            <MediaImage media={logo} width={64} height={64} className="w-12 sm:w-16 h-auto" />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#062963] rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-bold">MOE</span>
            </div>
          )}
        </div>
        <div className="text-center flex-1 px-1">
          <h1 className="text-sm sm:text-lg font-bold text-[#062963]">
            {hindiTitle} | {englishTitle}
          </h1>
          <p className="text-xs sm:text-base text-gray-600">
            {tagline}
          </p>
          {phone && <CallButton phone={phone} />}
        </div>
        <div className="w-12 sm:w-16 h-12 sm:h-16 flex-shrink-0 flex items-center justify-center">
          {emblem ? (
            <MediaImage media={emblem} width={64} height={64} className="w-12 sm:w-16 h-auto" />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#062963] rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-bold">NTA</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
