import React from 'react'
import { Media } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

interface Feature {
  title: string
  description?: string | null
  icon?: (string | null) | Media
  id?: string | null
}

interface FeatureBlockProps {
  title?: string | null
  subtitle?: string | null
  items?: Feature[] | null
}

export function FeatureBlock({ title, subtitle, items }: FeatureBlockProps) {
  if (!items?.length) return null

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
          {items.map((item, index) => {
            const iconUrl = typeof item.icon === 'object' ? item.icon?.url : null
            return (
              <div
                key={item.id || index}
                className="group rounded-2xl border border-primary/10 bg-card p-7 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
              >
                {iconUrl && (
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <img src={iconUrl} alt="" className="h-8 w-8" />
                  </div>
                )}
                <h3 className="font-display text-xl font-semibold tracking-tight">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
