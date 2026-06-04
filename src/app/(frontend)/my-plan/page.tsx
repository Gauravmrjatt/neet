import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getUserSubscription } from '@/lib/queries'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { CounselorCard } from '@/components/shared/CounselorCard'
import { BlockRenderer } from '@/components/blocks'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Counselor, Page, PricingCard } from '@/payload-types'

export const metadata: Metadata = {
  title: 'My Plan',
  description: 'Your personalized counselling plan dashboard',
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

export default async function MyPlanPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/my-plan')
  }

  const subscription = await getUserSubscription(user.id)

  // State B: No subscription
  if (!subscription) {
    redirect('/pricing?reason=no-plan')
  }

  const plan = subscription.plan
  const planName = getPlanName(plan)
  const planSubtitle = getPlanSubtitle(plan)
  const status = subscription.status
  const purchasedAt = subscription.purchasedAt
  const isActive = status === 'active' && isCounselor(subscription.assignedCounselor)
  const counselor = isCounselor(subscription.assignedCounselor) ? subscription.assignedCounselor : null
  const assignedPage = isPage(subscription.assignedPage) ? subscription.assignedPage : null

  return (
    <>
      {/* Plan Info Banner - always visible */}
      <section className="relative overflow-hidden bg-[#062963] py-12 sm:py-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#FBAC1A] blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <Container className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge
                className={`mb-3 border-0 px-3 py-1 text-xs font-semibold tracking-wider uppercase ${
                  isActive
                    ? 'bg-green-300/20 text-green-200 hover:bg-green-300/20'
                    : 'bg-[#FBAC1A]/20 text-[#FBAC1A] hover:bg-[#FBAC1A]/20'
                }`}
              >
                {isActive ? 'Active' : 'Pending Assignment'}
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{planName}</h1>
              {planSubtitle && <p className="mt-2 text-base text-white/80">{planSubtitle}</p>}
              {purchasedAt && (
                <p className="mt-3 text-sm text-white/60">
                  Purchased on {formatDate(purchasedAt)}
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

      {/* State C: Pending - waiting for assignment */}
      {!isActive && (
        <Section className="bg-[#F6F3EE]/30">
          <Container className="max-w-3xl">
            <Card className="border-gray-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#062963]">
                  Your Counselor is Being Assigned
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed text-gray-700">
                  Thank you for purchasing the{' '}
                  <strong className="text-[#062963]">{planName}</strong> plan. Our team is
                  reviewing your purchase and will assign a dedicated counselor to you shortly.
                </p>
                <p className="text-base leading-relaxed text-gray-700">
                  Once your counselor is assigned and your personalized plan page is ready, you&apos;ll
                  have full access to:
                </p>
                <ul className="ml-2 space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FBAC1A]">✓</span>
                    Your dedicated counselor&apos;s contact details
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FBAC1A]">✓</span>
                    Personalized plan content curated for you
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FBAC1A]">✓</span>
                    All premium resources and guidance
                  </li>
                </ul>
                <div className="rounded-md border border-[#062963]/20 bg-[#062963]/5 p-4 text-sm text-gray-700">
                  <strong className="text-[#062963]">Need help?</strong> Contact our support team
                  if you have any questions about your purchase.
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="bg-[#FBAC1A] hover:bg-[#e09b18] text-[#062963] font-semibold"
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-[#062963]/30 text-[#062963]">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Container>
        </Section>
      )}

      {/* State D: Active - render counselor + page content */}
      {isActive && (
        <>
          {/* Counselor Section */}
          {counselor && (
            <Section className="bg-[#F6F3EE]/30">
              <Container>
                <div className="mb-8">
                  <Badge className="mb-3 border-0 bg-[#062963]/10 px-3 py-1 text-xs font-semibold tracking-wider text-[#062963] uppercase hover:bg-[#062963]/10">
                    Your Dedicated Counselor
                  </Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-[#062963] sm:text-3xl">
                    Meet Your Counselor
                  </h2>
                  <p className="mt-2 text-base text-gray-600">
                    Reach out to your counselor for personalized guidance and support.
                  </p>
                </div>
                <div className="mx-auto max-w-md">
                  <CounselorCard counselor={counselor} />
                </div>
              </Container>
            </Section>
          )}

          {/* Assigned Page Content - rendered via BlockRenderer */}
          {assignedPage?.content && assignedPage.content.length > 0 && (
            <BlockRenderer blocks={assignedPage.content} />
          )}

          {/* If no page content blocks, show a fallback */}
          {(!assignedPage?.content || assignedPage.content.length === 0) && (
            <Section className="bg-white">
              <Container className="max-w-3xl text-center">
                <h2 className="text-2xl font-bold text-[#062963]">Your Plan is Ready</h2>
                <p className="mt-3 text-base text-gray-600">
                  Your personalized plan content will appear here once configured by the admin.
                </p>
              </Container>
            </Section>
          )}
        </>
      )}
    </>
  )
}
