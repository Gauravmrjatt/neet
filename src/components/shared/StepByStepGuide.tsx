interface Step {
  number: number
  title: string
  description: string
  icon?: string
}

interface StepByStepGuideProps {
  title?: string
  subtitle?: string
  steps: Step[]
}

export function StepByStepGuide({ title, subtitle, steps }: StepByStepGuideProps) {
  if (!steps || steps.length === 0) return null

  return (
    <section className="py-12">
      {title && (
        <h2 className="text-2xl font-bold text-primary-navy mb-2">{title}</h2>
      )}
      {subtitle && (
        <p className="text-foreground/70 mb-8">{subtitle}</p>
      )}
      <div className="relative">
        <div className="absolute left-[23px] top-0 h-full w-0.5 bg-button-gold/30 hidden md:block" aria-hidden="true" />
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="relative flex items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-button-gold text-primary-navy font-bold text-lg z-10">
                {step.icon || step.number}
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-lg font-semibold text-primary-navy">{step.title}</h3>
                <p className="mt-1 text-foreground/70">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
