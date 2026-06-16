import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getUserSubscriptions, getTotalCredits } from '@/lib/queries'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import dynamic from 'next/dynamic'
import { CounselorCard } from '@/components/shared/CounselorCard'

const BlockRenderer = dynamic(() => import('@/components/blocks').then((m) => ({ default: m.BlockRenderer })), {
  ssr: true,
})
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Counselor, Page, PricingCard, Subscription } from '@/payload-types'

export const metadata: Metadata = {
  title: 'My Plan',
  description: 'Your personalised counselling plan dashboard',
  robots: { index: false, follow: false },
}

function getPlanName(plan: string | PricingCard | null | undefined): string {
  if (!plan || typeof plan === 'string') return 'Your Plan'
  return plan.planName || 'Your Plan'
}

function getPlanSubtitle(plan: string | PricingCard | null | undefined): string | null {
  if (!plan || typeof plan === 'string') return null
  return plan.subtitle || null
}

function isCounselor(value: unknown): value is Counselor {
  return typeof value === 'object' && value !== null && 'name' in value
}

function isPage(value: unknown): value is Page {
  return typeof value === 'object' && value !== null && 'content' in value
}

function SubscriptionCard({ subscription, walletRemaining }: { subscription: Subscription; walletRemaining: number }) {
  const plan = subscription.plan
  const planName = getPlanName(plan)
  const planSubtitle = getPlanSubtitle(plan)
  const status = subscription.status
  const purchasedAt = subscription.purchasedAt
  const isActive = status === 'active'
  const counselor = isCounselor(subscription.assignedCounselor) ? subscription.assignedCounselor : null
  const assignedPage = isPage(subscription.assignedPage) ? subscription.assignedPage : null

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader className="border-b border-border bg-primary-navy/[0.04]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-bold text-primary-navy">{planName}</CardTitle>
            {planSubtitle && <p className="mt-1 text-sm text-muted-foreground">{planSubtitle}</p>}
          </div>
          <Badge
            className={`shrink-0 border-0 px-3 py-1 text-xs font-semibold tracking-wider uppercase ${
              isActive
                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                : 'bg-button-gold/20 text-button-gold hover:bg-button-gold/20'
            }`}
          >
            {isActive ? 'Active' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {purchasedAt && (
          <p className="text-sm text-muted-foreground">
            Purchased on {formatDate(purchasedAt)}
          </p>
        )}

        {/* Counselor */}
        {counselor && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-navy/70">
              Your Counselor
            </p>
            <CounselorCard counselor={counselor} />
          </div>
        )}

        {/* Assigned page content */}
        {assignedPage?.content && assignedPage.content.length > 0 && (
          <div>
            <BlockRenderer blocks={assignedPage.content} />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          {isActive && walletRemaining > 0 && (
            <Button asChild className="bg-button-gold hover:bg-button-gold-hover text-primary-navy font-semibold">
              <Link href="/predictor">Use Predictor</Link>
            </Button>
          )}
          <Button asChild variant="outline" className="border-primary-navy/30 text-primary-navy">
            <Link href="/pricing">Buy Another Plan</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function MyPlanPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/my-plan')
  }

  const subscriptions = await getUserSubscriptions(user.id)
  const walletRemaining = await getTotalCredits(user.id)

  return (
    <>
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-primary-navy py-12 sm:py-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-button-gold blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <Container className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge className="mb-3 border-0 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase hover:bg-white/10">
                My Plans
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {subscriptions.length > 0 ? 'Your Counselling Plans' : 'No Plans Yet'}
              </h1>
              {subscriptions.length > 0 && (
                <p className="mt-2 text-base text-white/80">
                  You have {subscriptions.length} plan{subscriptions.length !== 1 ? 's' : ''} purchased
                </p>
              )}
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        </Container>
      </section>

      <Section className="bg-navbar-bg/30">
        <Container className="max-w-3xl">
          {/* No subscriptions state */}
          {subscriptions.length === 0 && (
            <Card className="border-border bg-card shadow-md">
              <CardContent className="py-16 text-center">
                <div className="mb-4 text-5xl">📋</div>
                <CardTitle className="mb-2 text-xl text-primary-navy">No Plans Purchased Yet</CardTitle>
                <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                  You haven&apos;t purchased any counselling plans yet. Browse our plans to get started with
                  personalised college predictions and dedicated counsellor support.
                </p>
                <Button
                  asChild
                  className="bg-button-gold hover:bg-button-gold-hover text-primary-navy font-bold"
                >
                  <Link href="/pricing">Browse Plans</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Wallet banner */}
          {subscriptions.length > 0 && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-button-gold/10 p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-button-gold/20 text-2xl">
                    🎯
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-navy">
                      Prediction Credits
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Used across all your plans
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-primary-navy tabular-nums">
                      {walletRemaining}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      remaining
                    </span>
                  </div>
                  {walletRemaining > 0 && (
                    <Button
                      asChild
                      className="bg-button-gold hover:bg-button-gold-hover text-primary-navy font-bold shadow-sm"
                    >
                      <Link href="/predictor">Use Predictor</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Subscription cards */}
          {subscriptions.length > 0 && (
            <div className="space-y-6">
              {subscriptions.map((sub) => (
                <SubscriptionCard key={sub.id} subscription={sub} walletRemaining={walletRemaining} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
