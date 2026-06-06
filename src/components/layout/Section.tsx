import { cn } from '@/lib/utils'
import * as React from 'react'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  /** Background tone for the section. */
  tone?: 'default' | 'cream' | 'navy' | 'muted'
  /** Trim vertical padding when nesting inside other spaced layouts. */
  density?: 'normal' | 'tight' | 'roomy'
}

const TONE_CLASSES: Record<NonNullable<SectionProps['tone']>, string> = {
  default: 'bg-transparent',
  cream: 'bg-navbar-bg',
  navy: 'bg-primary text-primary-foreground',
  muted: 'bg-muted',
}

const DENSITY_CLASSES: Record<NonNullable<SectionProps['density']>, string> = {
  tight: 'py-10 md:py-12',
  normal: 'py-16 md:py-20 lg:py-24',
  roomy: 'py-20 md:py-24 lg:py-28',
}

export function Section({
  children,
  className,
  tone = 'default',
  density = 'normal',
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(TONE_CLASSES[tone], DENSITY_CLASSES[density], className)}
      {...props}
    >
      {children}
    </section>
  )
}
