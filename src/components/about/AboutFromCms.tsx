import React from 'react'
import { Sparkles, Award, Target, BookOpen, Headphones, Heart, Users } from 'lucide-react'
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
      {/* Hero */}
      <PageHero
        badge={hero?.badge || undefined}
        title={hero?.title || 'About Us'}
        subtitle={hero?.subtitle || undefined}
      />

      {/* Mission band */}
      <Section tone="cream" density="normal">
        <Container className="max-w-5xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              {mission?.heading && (
                <>
                  <span className="inline-flex items-center gap-2 rounded-full bg-button-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-navy">
                    <Sparkles className="h-3.5 w-3.5 text-button-gold" aria-hidden="true" />
                    {mission.heading}
                  </span>
                  <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
                    {mission.heading}
                  </h2>
                </>
              )}
              {mission?.body && (
                <div className="mt-5 text-base leading-relaxed text-foreground/75 sm:text-lg">
                  <RichText content={mission.body} />
                </div>
              )}
            </div>

            {mission?.stats && mission.stats.length > 0 && (
              <div className="md:col-span-5">
                <div className="glass-card rounded-3xl p-6 shadow-sm">
                  <div className="grid grid-cols-2 gap-4">
                    {mission.stats.map((stat, i) => (
                      <div
                        key={stat.id || i}
                        className="rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 ease-out hover:shadow-md"
                      >
                        <p className={`font-display text-3xl font-bold ${accentTextClass(stat.accent)}`}>
                          {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-foreground/70">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Why Choose Us */}
      {whyChooseUs?.items && whyChooseUs.items.length > 0 && (
        <Section className="bg-background">
          <Container className="max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              {whyChooseUs.heading && (
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-navy">
                  {whyChooseUs.heading}
                </span>
              )}
              {whyChooseUs.heading && (
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
                  {whyChooseUs.heading}
                </h2>
              )}
              {whyChooseUs.intro && (
                <p className="mt-3 text-base text-foreground/70 sm:text-lg">
                  {whyChooseUs.intro}
                </p>
              )}
            </div>

            <ul
              role="list"
              className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {whyChooseUs.items.map((item, i) => {
                const Icon = iconMap[item.icon || '']
                return (
                  <li
                    key={item.id || i}
                    className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-button-gold/15 text-primary-navy transition-colors duration-200 ease-out group-hover:bg-button-gold group-hover:text-primary-navy">
                      {Icon && <Icon className="h-5 w-5" aria-hidden />}
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-primary-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      {item.description}
                    </p>
                  </li>
                )
              })}
            </ul>
          </Container>
        </Section>
      )}

      {/* Team band */}
      <Section tone="muted" density="normal">
        <Container className="max-w-4xl">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
            {team?.heading && (
              <span className="inline-flex items-center gap-2 rounded-full bg-button-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-navy">
                {team.heading}
              </span>
            )}
            {team?.heading && (
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary-navy sm:text-4xl">
                {team.heading}
              </h2>
            )}
            {team?.body && (
              <div className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">
                <RichText content={team.body} />
              </div>
            )}

            {team?.stats && team.stats.length > 0 && (
              <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {team.stats.map((stat, i) => (
                  <div key={stat.id || i} className="rounded-2xl bg-navbar-bg p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                      {stat.label}
                    </dt>
                    <dd className={`mt-1 font-display text-2xl font-bold ${accentTextClass(stat.accent)}`}>
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </Container>
      </Section>

      {/* Extra sections */}
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
                  <div className="mt-6 text-base leading-relaxed text-foreground/75 sm:text-lg">
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
