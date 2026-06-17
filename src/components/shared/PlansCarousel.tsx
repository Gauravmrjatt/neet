'use client'

import { useState, useRef, useEffect, useCallback, useTransition } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface PlanData {
  id: string
  planName: string
  subtitle: string
  price: string
  originalPrice?: string
  discount?: string
  badge?: string
  colorScheme: string
  colleges?: string
  description?: string
  features: string[]
  ctaText: string
  ctaLink: string
  popular?: boolean
}

interface TierColors {
  text: string
  price: string
  check: string
  badge: string
  btn: string
  shadow: string
}

const COLOR_MAP: Record<string, TierColors> = {
  popular: {
    text: 'text-primary-navy',
    price: 'text-primary-navy',
    check: 'bg-button-gold',
    badge: 'bg-button-gold text-primary-navy',
    btn: 'bg-button-gold hover:bg-button-gold-hover text-primary-navy shadow-md shadow-button-gold/20',
    shadow: 'shadow-xl shadow-primary-navy/8',
  },
  premium: {
    text: 'text-primary-navy',
    price: 'text-primary-navy',
    check: 'bg-primary-navy',
    badge: 'bg-primary-navy text-white',
    btn: 'bg-primary-navy hover:bg-primary-navy-dark text-white shadow-md',
    shadow: 'shadow-lg',
  },
  standard: {
    text: 'text-foreground/90',
    price: 'text-primary-navy',
    check: 'bg-primary-navy/50',
    badge: 'bg-primary-navy/60 text-white',
    btn: 'bg-primary-navy/80 hover:bg-primary-navy text-white shadow-sm',
    shadow: 'shadow-md',
  },
  basic: {
    text: 'text-foreground/80',
    price: 'text-foreground/80',
    check: 'bg-foreground/15',
    badge: 'bg-foreground/10 text-foreground/60',
    btn: 'bg-foreground/10 hover:bg-foreground/20 text-foreground/70 shadow-sm',
    shadow: 'shadow-sm',
  },
}

function getColors(scheme: string): TierColors {
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
    return true
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
      className="plans-coverflow-shell relative max-w-6xl mx-auto mt-6 px-3 sm:px-10 md:px-12 rounded-2xl focus:outline-none"
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
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        className="plans-coverflow-nav plans-coverflow-next"
        onClick={() => go(active + 1)}
        aria-label="Next plan"
      >
        <ChevronRight className="w-6 h-6" />
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

            const c = getColors(plan.colorScheme)

            return (
              <article
                key={plan.id}
                className={`plan-coverflow-card relative bg-card border border-border/60 ${c.shadow} ${stateClass}`}
                role="listitem"
                data-plan-index={index}
              >
                {plan.popular && (
                  <span className="plan-coverflow-popular">
                    <span>★ Most Popular</span>
                  </span>
                )}

                {plan.discount && (
                  <span className={`absolute -top-2.5 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {plan.discount}
                  </span>
                )}
                {plan.badge && !plan.discount && (
                  <span className={`absolute -top-2.5 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {plan.badge}
                  </span>
                )}

                <h3 className={`text-base sm:text-lg font-bold leading-snug ${c.text}`}>
                  {plan.planName || plan.subtitle || plan.id}
                </h3>
                {plan.subtitle && (
                  <p className="text-xs text-muted-foreground mt-0.5">{plan.subtitle}</p>
                )}

                <div className="mt-3 flex items-baseline gap-2">
                  <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${c.price}`}>
                    {plan.price}
                  </span>
                  {plan.originalPrice && (
                    <span className="text-sm text-muted-foreground/60 line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                </div>

                {plan.colleges && (
                  <p className="text-xs text-muted-foreground mt-1.5">{plan.colleges}</p>
                )}

                {plan.description && (
                  <p className="text-xs text-foreground/60 mt-3 leading-relaxed">{plan.description}</p>
                )}

                <ul className="mt-4 space-y-2 text-sm text-foreground/70 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${c.check}`}>
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink || '#'}
                  className={`mt-5 block text-center font-semibold text-sm py-3 rounded-xl transition-all duration-200 ease-out ${c.btn}`}
                >
                  {plan.ctaText || 'Get Started'}
                </Link>
              </article>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 mt-6" role="tablist" aria-label="Select a plan">
        {plans.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            className="plans-coverflow-dot"
            aria-selected={index === active}
            aria-label={`Show plan ${index + 1}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => go(index)}
          />
        ))}
      </div>
    </div>
  )
}
