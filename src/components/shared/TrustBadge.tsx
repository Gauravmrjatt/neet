import { Users, Clock, UserCheck, Award } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'

export async function TrustBadges() {
  const payload = await getPayloadClient()
  let settings: any = {}
  try {
    settings = await payload.findGlobal({ slug: 'site-settings' })
  } catch {}

  const stats = settings?.stats || {}
  const students = stats.students || '17,000+'
  const support = stats.support || '24x7'
  const personalized = stats.personalized || '100%'
  const counselors = stats.counselors || '50+'

  const STAT_ITEMS = [
    { icon: Users, value: students, label: 'Students Trusted' },
    { icon: Clock, value: support, label: 'Live Support' },
    { icon: UserCheck, value: personalized, label: 'Personalized' },
    { icon: Award, value: counselors, label: 'Expert Counselors' },
  ]

  return (
    <section
      aria-label="Trust statistics"
      className="py-10 sm:py-14 px-4 bg-navbar-bg"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {STAT_ITEMS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="trust-badge relative rounded-2xl bg-white p-5 sm:p-6 text-center border border-[#062963]/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out group"
              >
                <div
                  aria-hidden="true"
                  className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-button-gold/15 text-[#062963] flex items-center justify-center group-hover:bg-button-gold/25 transition-colors duration-200 ease-out"
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#062963] leading-none tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-foreground/60 mt-2 font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
