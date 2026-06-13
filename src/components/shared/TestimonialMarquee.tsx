'use client'

import { useRef, useEffect } from 'react'
import { Star, Quote, Sparkles } from 'lucide-react'
import { Media } from '@/payload-types'

interface Testimonial {
  name: string
  quote: string
  image?: (string | null) | Media
  designation?: string | null
  rating?: number | null
}

interface TestimonialMarqueeProps {
  testimonials?: Testimonial[] | null
  studentCount?: string
}

export function TestimonialMarquee({ testimonials = [], studentCount = '17,000+' }: TestimonialMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let isDown = false
    let startX: number
    let scrollLeft: number

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true
      startX = e.pageX - track.offsetLeft
      scrollLeft = track.scrollLeft
    }

    const handleMouseUp = () => { isDown = false }
    const handleMouseLeave = () => { isDown = false }
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - track.offsetLeft
      const walk = (x - startX) * 2
      track.scrollLeft = scrollLeft - walk
    }

    track.addEventListener('mousedown', handleMouseDown)
    track.addEventListener('mouseup', handleMouseUp)
    track.addEventListener('mouseleave', handleMouseLeave)
    track.addEventListener('mousemove', handleMouseMove)

    return () => {
      track.removeEventListener('mousedown', handleMouseDown)
      track.removeEventListener('mouseup', handleMouseUp)
      track.removeEventListener('mouseleave', handleMouseLeave)
      track.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!testimonials?.length) return null

  const duplicated = [...testimonials, ...testimonials]

  return (
    <section aria-label="Student testimonials" className="relative py-16 sm:py-20 px-4 bg-card-bg overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <p className="glass-pill inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3 h-3 text-button-gold" aria-hidden="true" />
            Testimonials
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-navy mb-2 tracking-tight">
            What Students Say
          </h2>
          <p className="text-sm sm:text-base text-foreground/70 max-w-xl mx-auto">
            Trusted by{' '}
            <span className="text-primary-navy font-bold">{studentCount}</span>
            {' '}students across India
          </p>
        </div>

        <div
          ref={trackRef}
          className="testimonial-wrapper relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 z-10 bg-linear-to-r from-card-bg to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 z-10 bg-linear-to-l from-card-bg to-transparent"
          />
          <div className="animate-marquee">
            {duplicated.map((testimonial, index) => {
              const avatarUrl = typeof testimonial.image === 'object' ? testimonial.image?.url : null
              return (
                <article
                  key={index}
                  className="shrink-0 w-80 sm:w-96 mx-3 p-6 rounded-2xl border border-primary-navy/10 bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      aria-hidden="true"
                      className="inline-flex w-10 h-10 rounded-xl bg-button-gold/15 text-primary-navy items-center justify-center"
                    >
                      <Quote className="w-5 h-5" />
                    </span>
                    {testimonial.rating && (
                      <div className="flex gap-0.5" role="img" aria-label={`${testimonial.rating} star rating`}>
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-button-gold text-button-gold"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-5">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-primary-navy/10 flex items-center gap-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-button-gold/15 text-primary-navy text-sm font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm text-primary-navy">{testimonial.name}</p>
                      {testimonial.designation && (
                        <p className="text-xs text-foreground/60 mt-0.5">{testimonial.designation}</p>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
