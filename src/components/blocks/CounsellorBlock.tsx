import React from 'react'
import { Media } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

interface CounsellorData {
  id?: string
  name?: string
  slug?: string
  designation?: string
  image?: (string | null) | Media
  specializations?: { specialization?: string | null }[] | null
}

interface CounsellorBlockProps {
  title?: string | null
  subtitle?: string | null
  counsellors?: (string | CounsellorData)[] | null
}

export function CounsellorBlock({ title, subtitle, counsellors }: CounsellorBlockProps) {
  const resolvedCounsellors = (counsellors || []).filter(
    (c): c is CounsellorData => typeof c === 'object' && c !== null
  )

  if (!resolvedCounsellors.length) return null

  return (
    <Section>
      <Container>
        {title && (
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resolvedCounsellors.map((counsellor) => {
            const imageUrl = typeof counsellor.image === 'object' ? counsellor.image?.url : null
            return (
              <div
                key={counsellor.id}
                className="group rounded-2xl border border-primary/10 bg-card p-7 text-center shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={counsellor.name || ''}
                    className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-primary/10"
                  />
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {counsellor.name?.charAt(0) || '?'}
                  </div>
                )}
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{counsellor.name}</h3>
                {counsellor.designation && (
                  <p className="text-sm text-muted-foreground">{counsellor.designation}</p>
                )}
                {counsellor.specializations && counsellor.specializations.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {counsellor.specializations.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium capitalize text-primary"
                      >
                        {s.specialization}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
