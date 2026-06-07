'use client'

import { useRef, useEffect } from 'react'
import { Star, Quote, Sparkles } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "NEET Counselling helped me get into my dream medical college. Their rank prediction was spot on!",
    author: "Priya Sharma",
    role: "MBBS Student, AIIMS Delhi",
    rating: 5,
  },
  {
    quote: "The counselors were available 24x7 during JOSAA rounds. Their guidance was invaluable for my son's admission.",
    author: "Rajesh Kumar",
    role: "Parent",
    rating: 5,
  },
  {
    quote: "I was confused between colleges, but the college predictor tool and counselor advice made it crystal clear.",
    author: "Amit Patel",
    role: "B.Tech Student, IIT Bombay",
    rating: 5,
  },
  {
    quote: "Best investment we made for our daughter's future. The personalized counselling plan was worth every rupee.",
    author: "Sunita Devi",
    role: "Parent",
    rating: 5,
  },
  {
    quote: "From choice filling to seat acceptance, they guided me at every step. Highly recommend!",
    author: "Rohit Singh",
    role: "MBBS Student, JIPMER",
    rating: 5,
  },
  {
    quote: "The Hindi medium support was a lifesaver for my parents. They understood everything clearly.",
    author: "Anita Kumari",
    role: "BDS Student",
    rating: 5,
  },
]

export function TestimonialMarquee() {
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

  const duplicated = [...TESTIMONIALS, ...TESTIMONIALS]

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
            Trusted by 17,000+ students across India
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
            {duplicated.map((testimonial, index) => (
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
                  <div className="flex gap-0.5" aria-label={`${testimonial.rating} star rating`}>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-button-gold text-button-gold"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-5">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-primary-navy/10">
                  <p className="font-semibold text-sm text-primary-navy">{testimonial.author}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
