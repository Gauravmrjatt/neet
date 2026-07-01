import React from 'react'
import { Award, Target, BookOpen, Headphones, Heart, Users } from 'lucide-react'
import { PageHero } from '@/components/shared/PageHero'
import { RichText } from '@/components/shared/RichText'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import type { AboutPage } from '@/payload-types'

type AboutPageData = AboutPage

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Target,
  BookOpen,
  Headphones,
  Heart,
  Users,
}

function accentTextClass(accent?: string | null) {
  return accent === 'gold' ? 'text-button-gold' : 'text-primary-navy'
}

export function AboutFromCms({ data }: { data: AboutPageData }) {
  const { hero, mission, whyChooseUs, team, extraSections } = data

  return (
    <>
      <PageHero
        badge={hero?.badge || undefined}
        title={hero?.title || 'About Us'}
        subtitle={hero?.subtitle || undefined}
      />

      {mission && (
        <Section tone="cream" density="normal">
          <Container className="max-w-6xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                {mission.heading && (
                  <h2 className="font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
                    {mission.heading}
                  </h2>
                )}
                {mission.body && (
                  <div className="prose prose-lg max-w-none mt-6 text-foreground/75">
                    <RichText content={mission.body} />
                  </div>
                )}
              </div>

              {mission.stats && mission.stats.length > 0 && (
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-button-gold/5" />
                  <div className="relative sticky top-[30dvh] rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <div className="grid grid-cols-2 gap-6">
                      {mission.stats.map((stat, i) => (
                        <div key={stat.id || i}>
                          <p
                            className={`font-display text-4xl font-bold tracking-tight ${accentTextClass(stat.accent)}`}
                          >
                            {stat.value}
                          </p>
                          <p className="mt-1.5 text-sm text-foreground/60">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}

      {whyChooseUs?.items && whyChooseUs.items.length > 0 && (
        <Section className="bg-background">
          <Container className="max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              {whyChooseUs.heading && (
                <h2 className="font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
                  {whyChooseUs.heading}
                </h2>
              )}
              {whyChooseUs.intro && (
                <p className="mt-4 text-base text-foreground/70 sm:text-lg">
                  {whyChooseUs.intro}
                </p>
              )}
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyChooseUs.items.map((item, i) => {
                const Icon = iconMap[item.icon || '']
                return (
                  <div
                    key={item.id || i}
                    className="group relative rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-button-gold/15 text-primary-navy transition-colors duration-200 group-hover:bg-button-gold group-hover:text-primary-navy">
                      {Icon && <Icon className="h-6 w-6" aria-hidden />}
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-primary-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </Section>
      )}

      {team && (
        <Section tone="cream" density="normal">
          <Container className="max-w-6xl">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-12">
              <div className="mx-auto max-w-3xl text-center">
                {team.heading && (
                  <h2 className="font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
                    {team.heading}
                  </h2>
                )}
                {team.body && (
                  <div className="prose prose-lg max-w-none mt-4 text-foreground/75">
                    <RichText content={team.body} />
                  </div>
                )}
              </div>

              {team.stats && team.stats.length > 0 && (
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {team.stats.map((stat, i) => (
                    <div key={stat.id || i} className="rounded-xl bg-navbar-bg p-6 text-center">
                      <p
                        className={`font-display text-3xl font-bold ${accentTextClass(stat.accent)}`}
                      >
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-foreground/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}

      {extraSections && extraSections.length > 0 && (
        <>
          {extraSections.map((section, i) => (
            <Section key={section.id || i} tone={i % 2 === 0 ? 'default' : 'muted'}>
              <Container className="max-w-4xl">
                {section.heading && (
                  <h2 className="font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
                    {section.heading}
                  </h2>
                )}
                {section.body && (
                  <div className="prose prose-lg max-w-none mt-6 text-foreground/75">
                    <RichText content={section.body} />
                  </div>
                )}
              </Container>
            </Section>
          ))}
        </>
      )}
    </>
  )
}
