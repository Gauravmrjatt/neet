'use client'

import { useRef, useEffect } from 'react'
import { Star } from 'lucide-react'

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
    <section className="py-10 px-4 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold text-center text-[#062963] mb-2">
          What Students Say
        </h2>
        <p className="text-center text-xs sm:text-sm text-gray-600 mb-6">
          Trusted by 17,000+ students across India
        </p>

        <div
          ref={trackRef}
          className="testimonial-wrapper overflow-hidden"
        >
          <div className="animate-marquee">
            {duplicated.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 sm:w-80 mx-3 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-sm text-[#062963]">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
