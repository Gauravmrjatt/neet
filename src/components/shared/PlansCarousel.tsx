'use client'

import { useState, useRef, useEffect, useCallback, useTransition } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface PlanData {
  id: string
  subtitle: string
  price: string
  originalPrice?: string
  discount?: string
  badge?: string
  colorScheme: string
  colleges?: string
  features: string[]
  ctaText: string
  ctaLink: string
  popular?: boolean
}

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; btn: string; badge: string }> = {
  popular: {
    border: 'border-primary-navy',
    bg: 'bg-card-bg',
    text: 'text-primary-navy',
    btn: 'bg-button-gold hover:bg-button-gold-hover text-primary-navy',
    badge: 'bg-primary-navy',
  },
  premium: {
    border: 'border-primary-navy/80',
    bg: 'bg-card-bg',
    text: 'text-primary-navy',
    btn: 'bg-button-gold hover:bg-button-gold-hover text-primary-navy',
    badge: 'bg-primary-navy',
  },
  standard: {
    border: 'border-primary-navy/60',
    bg: 'bg-card-bg',
    text: 'text-primary-navy',
    btn: 'bg-button-gold hover:bg-button-gold-hover text-primary-navy',
    badge: 'bg-primary-navy',
  },
  basic: {
    border: 'border-primary-navy/40',
    bg: 'bg-card-bg',
    text: 'text-primary-navy',
    btn: 'bg-button-gold hover:bg-button-gold-hover text-primary-navy',
    badge: 'bg-primary-navy',
  },
}

function getColors(scheme: string) {
  return COLOR_MAP[scheme] || COLOR_MAP.standard
}

interface PlansCarouselProps {
  plans: PlanData[]
}

export function PlansCarousel({ plans }: PlansCarouselProps) {
  const [active, setActive] = useState(0)
  const [, startTransition] = useTransition()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const n = plans.length

  const isCarousel = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 1024
  }, [])

  const centerTrack = useCallback(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport || !isCarousel()) {
      if (track) track.style.transform = ''
      return
    }
    const cards = track.querySelectorAll('.plan-coverflow-card') as NodeListOf<HTMLElement>
    const card = cards[active]
    if (!card) return
    const halfV = viewport.clientWidth / 2
    const centerCard = card.offsetLeft + card.offsetWidth / 2
    const x = halfV - centerCard
    track.style.transform = `translateX(${x}px)`
  }, [active, isCarousel])

  const go = useCallback((index: number) => {
    startTransition(() => {
      setActive(((index % n) + n) % n)
    })
  }, [n, startTransition])

  useEffect(() => {
    centerTrack()
  }, [active, centerTrack])

  useEffect(() => {
    const handleResize = () => centerTrack()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [centerTrack])

  if (n === 0) return null

  return (
    <div
      className="plans-coverflow-shell max-w-5xl mx-auto mt-6 px-3 sm:px-10 md:px-12 rounded-2xl focus:outline-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="Counselling plans"
    >
      <button
        type="button"
        className="plans-coverflow-nav plans-coverflow-prev"
        onClick={() => go(active - 1)}
        aria-label="Previous plan"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="plans-coverflow-nav plans-coverflow-next"
        onClick={() => go(active + 1)}
        aria-label="Next plan"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div ref={viewportRef} className="plans-coverflow-viewport">
        <div
          ref={trackRef}
          className="plans-coverflow-track"
          role="list"
          onTouchStart={(e) => {
            if (e.touches.length === 1) touchStartX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null || !e.changedTouches.length) return
            const dx = e.changedTouches[0].clientX - touchStartX.current
            touchStartX.current = null
            if (dx < -48) go(active + 1)
            else if (dx > 48) go(active - 1)
          }}
        >
          {plans.map((plan, index) => {
            const dist = Math.abs(index - active)
            let stateClass = ''
            if (dist === 0) stateClass = 'plan-coverflow-card--focus'
            else if (dist === 1) stateClass = 'plan-coverflow-card--near'
            else stateClass = 'plan-coverflow-card--far'

            const colors = getColors(plan.colorScheme)

            return (
              <article
                key={plan.id}
                className={`plan-coverflow-card relative border-2 ${colors.border} ${colors.bg} ${stateClass}`}
                role="listitem"
                data-plan-index={index}
              >
                {plan.discount && (
                  <span className={`absolute top-3 right-3 text-white text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {plan.discount}
                  </span>
                )}
                {plan.badge && !plan.discount && (
                  <span className={`absolute top-3 right-3 text-white text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {plan.badge}
                  </span>
                )}
                {plan.popular && (
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${colors.text}`}>
                    Most Popular
                  </p>
                )}
                <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  {plan.subtitle || plan.id}
                </h3>
                <p className={`text-3xl font-extrabold mt-2 ${colors.text}`}>
                  {plan.price}
                </p>
                {plan.originalPrice && (
                  <p className="text-xs text-muted-foreground/70 line-through">{plan.originalPrice}</p>
                )}
                {plan.colleges && (
                  <p className="text-xs text-muted-foreground mb-0">{plan.colleges}</p>
                )}
                <ul className="mt-3 space-y-1.5 text-xs text-foreground/80 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 ${colors.text}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaLink || '#'}
                  className={`mt-4 block text-center font-semibold text-sm py-2.5 rounded-xl shadow-md transition-colors ${colors.btn}`}
                >
                  {plan.ctaText || 'Get Started'}
                </Link>
              </article>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 mt-5" role="tablist" aria-label="Select a plan">
        {plans.map((_, index) => (
          <button
            key={index}
            type="button"
            className="plans-coverflow-dot"
            aria-current={index === active ? 'true' : 'false'}
            onClick={() => go(index)}
            aria-label={`Show plan ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
