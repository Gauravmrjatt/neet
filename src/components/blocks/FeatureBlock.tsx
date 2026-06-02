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
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const iconUrl = typeof item.icon === 'object' ? item.icon?.url : null
            return (
              <div key={item.id || index} className="rounded-lg border p-6 transition hover:shadow-lg">
                {iconUrl && (
                  <img src={iconUrl} alt="" className="mb-4 h-12 w-12" />
                )}
                <h3 className="text-xl font-semibold">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-muted-foreground">{item.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
