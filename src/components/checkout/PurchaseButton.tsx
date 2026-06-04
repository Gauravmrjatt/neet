'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PurchaseButtonProps {
  planId: string
  planName: string
}

export function PurchaseButton({ planId, planName }: PurchaseButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePurchase() {
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.errors?.[0]?.message || 'Failed to create subscription. Please try again.')
        setLoading(false)
        return
      }

      router.push('/my-plan')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div
          className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}
      <Button
        onClick={handlePurchase}
        disabled={loading}
        size="lg"
        className="h-12 w-full rounded-md bg-amber-300 text-base font-bold text-amber-950 hover:bg-amber-200 disabled:opacity-60"
      >
        {loading ? 'Processing...' : `Confirm Purchase - ${planName}`}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        By confirming, you agree to our terms of service. This is a simulated purchase for
        demonstration purposes.
      </p>
    </div>
  )
}
