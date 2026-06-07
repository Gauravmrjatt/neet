import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Check } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { getPricingCardById, hasActiveOrPendingSubscription } from '@/lib/queries'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PurchaseButton } from '@/components/checkout/PurchaseButton'

interface CheckoutPageProps {
  params: Promise<{ planId: string }>
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { planId } = await params
  const plan = await getPricingCardById(planId)
  return {
    title: plan ? `Checkout - ${plan.planName}` : 'Checkout',
    description: 'Confirm your plan purchase',
    robots: { index: false, follow: false },
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { planId } = await params

  // Auth check - redirect to login if not authenticated
  const user = await getCurrentUser()
  if (!user) {
    redirect(`/login?redirect=/checkout/${planId}`)
  }

  // Fetch the plan
  const plan = await getPricingCardById(planId)
  if (!plan) {
    notFound()
  }

  // Prevent duplicate purchases
  const alreadyPurchased = await hasActiveOrPendingSubscription(user.id)
  if (alreadyPurchased) {
    redirect('/my-plan?reason=already-purchased')
  }

  return (
    <Section className="bg-navbar-bg/30 min-h-screen">
      <Container className="max-w-3xl">
        <div className="mb-8 text-center">
          <Badge className="mb-4 border-0 bg-primary-navy px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase hover:bg-primary-navy">
            Secure Checkout
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-navy sm:text-4xl">
            Complete Your Purchase
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Review the plan details below and proceed to secure payment.
          </p>
        </div>

        <Card className="border-border bg-card shadow-lg">
          <CardHeader className="border-b border-border bg-primary-navy/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl font-bold text-primary-navy uppercase tracking-wide">
                  {plan.planName}
                </CardTitle>
                {plan.subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">{plan.subtitle}</p>
                )}
              </div>
              {plan.popular && (
                <Badge className="border-0 bg-button-gold px-2.5 py-1 text-xs font-bold text-primary-navy hover:bg-button-gold">
                  Most Popular
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-primary-navy">{plan.price}</span>
              {plan.originalPrice && (
                <span className="text-lg text-muted-foreground/70 line-through">
                  {plan.originalPrice}
                </span>
              )}
              {plan.discount && (
                <Badge className="border-0 bg-primary-navy/10 px-2 py-1 text-xs font-bold text-primary-navy hover:bg-primary-navy/10">
                  {plan.discount}
                </Badge>
              )}
            </div>

            {plan.description && (
              <p className="text-sm leading-relaxed text-foreground/80">{plan.description}</p>
            )}

            {plan.colleges && (
              <div className="rounded-lg border border-primary-navy/20 bg-primary-navy/5 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-navy/70">
                  Colleges covered
                </p>
                <p className="text-sm font-medium text-primary-navy">{plan.colleges}</p>
              </div>
            )}

            {plan.features && plan.features.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-navy/70">
                  What&apos;s included
                </p>
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={f.id ?? i} className="flex items-start text-sm leading-relaxed text-primary-navy">
                      <Check
                        className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-button-gold"
                        aria-hidden="true"
                        strokeWidth={2.5}
                      />
                      <span>{f.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-border pt-6">
              <PurchaseButton
                planId={plan.id}
                planName={plan.planName}
                amount={plan.priceInPaise}
                userName={user.name}
                userEmail={user.email}
                userPhone={user.phone}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button asChild variant="ghost" className="text-primary-navy hover:text-primary-navy-dark">
            <Link href="/pricing">&larr; Back to plans</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
