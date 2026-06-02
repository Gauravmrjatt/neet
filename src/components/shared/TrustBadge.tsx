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
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_ITEMS.map((stat) => (
            <div
              key={stat.label}
              className="trust-badge rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-[#062963]" />
              <div className="text-2xl sm:text-3xl font-bold text-[#062963]">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
