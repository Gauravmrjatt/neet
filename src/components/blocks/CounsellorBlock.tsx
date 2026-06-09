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
  specializations?: { specialization?: { slug?: string | null; name?: string | null } | string | null; id?: string | null }[] | null
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
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resolvedCounsellors.map((counsellor) => {
            const imageUrl = typeof counsellor.image === 'object' ? counsellor.image?.url : null
            return (
              <div key={counsellor.id} className="rounded-lg border p-6 text-center transition hover:shadow-lg">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={counsellor.name || ''}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted text-2xl font-bold">
                    {counsellor.name?.charAt(0) || '?'}
                  </div>
                )}
                <h3 className="mt-4 text-lg font-semibold">{counsellor.name}</h3>
                {counsellor.designation && (
                  <p className="text-sm text-muted-foreground">{counsellor.designation}</p>
                )}
                {counsellor.specializations && counsellor.specializations.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {counsellor.specializations.map((s, i) => (
                      <span key={s.id || i} className="rounded-full bg-muted px-2 py-1 text-xs capitalize">
                        {typeof s.specialization === 'object' && s.specialization !== null
                          ? s.specialization.name
                          : s.specialization}
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
