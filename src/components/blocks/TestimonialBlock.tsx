import React from 'react'
import { Media } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Quote } from 'lucide-react'

interface Testimonial {
  name: string
  quote: string
  image?: (string | null) | Media
  designation?: string | null
  id?: string | null
}

interface TestimonialBlockProps {
  heading?: string | null
  testimonials?: Testimonial[] | null
}

export function TestimonialBlock({ heading, testimonials }: TestimonialBlockProps) {
  if (!testimonials?.length) return null

  return (
    <Section>
      <Container>
        {heading && (
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const avatarUrl = typeof testimonial.image === 'object' ? testimonial.image?.url : null
            return (
              <div
                key={testimonial.id || index}
                className="group relative rounded-2xl border border-primary/10 bg-card p-7 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
              >
                <Quote className="absolute right-5 top-5 h-7 w-7 text-button-gold/40" />
                <blockquote className="text-foreground leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold tracking-tight">{testimonial.name}</p>
                    {testimonial.designation && (
                      <p className="text-xs text-muted-foreground">{testimonial.designation}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
