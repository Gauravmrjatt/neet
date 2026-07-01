import { getSiteSettings } from '@/lib/queries/globals'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const siteName = (settings as any)?.siteName || 'NEET Counselling'
  const siteDescription = (settings as any)?.siteDescription || 'Expert guidance for your medical career aspirations'

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#062963] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FBAC1A] blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">{siteName}</h1>
          <p className="text-xl text-white/80">{siteDescription}</p>
        </div>
      </div>
      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray">
        {children}
      </div>
    </div>
  )
}
