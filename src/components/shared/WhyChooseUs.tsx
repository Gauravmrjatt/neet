'use client'

import { useState, useMemo } from 'react'
import {
  ChevronDown,
  Target,
  Users,
  Clock,
  BookOpen,
  Shield,
  Headphones,
  Sparkles,
  Star,
  Heart,
  CheckCircle,
  ThumbsUp,
  Award,
  Zap,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Target,
  Users,
  Clock,
  BookOpen,
  Shield,
  Headphones,
  Sparkles,
  Star,
  Heart,
  CheckCircle,
  ThumbsUp,
  Award,
  Zap,
}

function resolveIcon(name: string): React.ComponentType<any> {
  return ICON_MAP[name] || Sparkles
}

export function WhyChooseUs({
  studentCount = '17,000+',
  data,
}: {
  studentCount?: string
  data?: any
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const cmsCards = data?.cards?.filter((c: any) => c.title && c.description) || []

  const REASONS = useMemo(() => {
    if (cmsCards.length > 0) {
      return cmsCards.map((card: any) => ({
        icon: resolveIcon(card.icon),
        title: card.title,
        description: card.description,
      }))
    }

    return [
      {
        icon: Target,
        title: 'Personalized Help',
        description: 'Every student gets a customized counselling plan based on their rank, category, and preferences. We don\'t believe in one-size-fits-all.',
      },
      {
        icon: Users,
        title: 'Expert Counselors',
        description: 'Our team consists of 50+ experienced counsellors who have guided thousands of students to their dream colleges.',
      },
      {
        icon: Clock,
        title: '24x7 Support',
        description: 'Round-the-clock support via WhatsApp, call, and video sessions. We\'re always available when you need us.',
      },
      {
        icon: BookOpen,
        title: 'Comprehensive Resources',
        description: 'Access to blog articles, video guides, college predictors, and rank analysis tools to make informed decisions.',
      },
      {
        icon: Shield,
        title: 'Proven Track Record',
        description: `${studentCount} students guided successfully. Our predictions have helped students get into top medical and engineering colleges.`,
      },
      {
        icon: Headphones,
        title: 'Hindi & English',
        description: 'Guidance available in both Hindi and English. We understand every student and parent, regardless of language preference.',
      },
    ]
  }, [cmsCards, studentCount])

  return (
    <section
      aria-label="Why choose us"
      className="bg-background py-16 sm:py-20 px-3 sm:px-4"
    >
      <div className="max-w-7xl mx-auto text-center">
        <p className="glass-pill inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3 h-3 text-button-gold" aria-hidden="true" />
          {data?.badge || 'Why Us'}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-navy mb-3 sm:mb-4 leading-tight tracking-tight">
          {data?.heading || `Why ${studentCount} Students Trust Us`}
        </h2>
        <p className="text-foreground/70 max-w-2xl mx-auto mb-10 sm:mb-14 text-sm sm:text-base leading-relaxed">
          {data?.subheading || 'NEET Counselling is your one-stop guide for college admissions — made for every student, in every corner of India.'}
        </p>

        {/* Mobile: Accordion */}
        <div className="space-y-3 sm:hidden text-left">
          {REASONS.map((reason: { icon: React.ComponentType<any>; title: string; description: string }, index: number) => {
            const Icon = reason.icon
            const isOpen = openIndex === index
            return (
              <div
                key={reason.title}
                className="glass-card rounded-2xl bg-card-bg border border-primary-navy/10 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex justify-between items-center gap-2 w-full font-semibold text-sm leading-snug text-primary-navy p-4 hover:bg-navbar-bg transition-colors duration-200 ease-out"
                >
                  <span className="flex items-center gap-3">
                    <span className="shrink-0 w-9 h-9 rounded-xl bg-button-gold/15 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary-navy" aria-hidden="true" />
                    </span>
                    {reason.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-primary-navy transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p className="px-4 pb-4 text-xs text-foreground/70 leading-relaxed">
                    {reason.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-5 lg:gap-6 text-left">
          {REASONS.map((reason: { icon: React.ComponentType<any>; title: string; description: string }) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.title}
                className="glass-card rounded-2xl p-6 shadow-sm bg-card-bg border border-primary-navy/10 hover:shadow-md hover:-translate-y-0.5 hover:border-primary-navy/20 transition-all duration-200 ease-out group"
              >
                <span className="inline-flex w-12 h-12 rounded-2xl bg-button-gold/15 text-primary-navy items-center justify-center mb-4 group-hover:bg-button-gold/25 transition-colors duration-200 ease-out">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </span>
                <h3 className="font-display font-bold text-primary-navy text-lg lg:text-xl mb-2 tracking-tight">
                  {reason.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
