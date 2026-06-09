import React from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/shared/RichText'

interface AlertBlockProps {
  content: any
  type?: 'info' | 'warning' | 'success' | 'error' | null
}

const alertStyles = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    container: 'bg-amber-50 border-amber-200',
    icon: (
      <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: (
      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: (
      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
}

export function AlertBlock({ content, type = 'info' }: AlertBlockProps) {
  if (!content) return null

  const style = alertStyles[type || 'info']

  return (
    <Section>
      <Container className="max-w-4xl">
        <div className={`flex gap-3 rounded-lg border p-4 ${style.container}`}>
          <div className="mt-0.5 shrink-0">{style.icon}</div>
          <div className="prose prose-sm max-w-none">
            <RichText content={content} />
          </div>
        </div>
      </Container>
    </Section>
  )
}
