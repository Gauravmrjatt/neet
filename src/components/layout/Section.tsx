import { memo } from 'react'
import { cn } from '@/lib/utils'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  tone?: 'default' | 'cream' | 'navy' | 'muted'
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

export const Section = memo(function Section({
  children,
  className,
  tone = 'default',
  density = 'normal',
  ...props
}: SectionProps) {
  return (
    <section className={cn(TONE_CLASSES[tone], DENSITY_CLASSES[density], className)} {...props}>
      {children}
    </section>
  )
})
