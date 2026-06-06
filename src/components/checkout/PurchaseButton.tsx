'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PurchaseButtonProps {
  planId: string
  planName: string
  amount: number
  userName?: string | null
  userEmail?: string | null
  userPhone?: string | null
}

declare global {
  interface Window {
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

type Step =
  | 'idle'
  | 'creating-order'
  | 'checkout-open'
  | 'verifying'
  | 'success'
  | 'error'
  | 'dismissed'

export function PurchaseButton({
  planId,
  planName,
  amount,
  userName,
  userEmail,
  userPhone,
}: PurchaseButtonProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState('')

  const handlePurchase = useCallback(async () => {
    setStep('creating-order')
    setError('')

    try {
      const idempotencyKey = crypto.randomUUID()

      // Step 1: Create Razorpay order
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, idempotencyKey }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        setError(orderData.error || 'Failed to create order. Please try again.')
        setStep('idle')
        return
      }

      // Step 2: Load Razorpay script
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        setError('Failed to load payment gateway. Please refresh and try again.')
        setStep('idle')
        return
      }

      // Step 3: Open Razorpay checkout
      setStep('checkout-open')

      const options = {
        key: orderData.keyId,
        order_id: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'NEET Counselling',
        description: planName,
        prefill: {
          name: userName || '',
          email: userEmail || '',
          contact: userPhone || '',
        },
        handler: async function (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) {
          setStep('verifying')

          // Step 4: Verify payment on server
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              transactionId: orderData.transactionId,
            }),
          })

          const verifyData = await verifyRes.json()

          if (!verifyRes.ok) {
            setError(verifyData.error || 'Payment verification failed. Please contact support.')
            setStep('error')
            return
          }

          setStep('success')
          router.push('/my-plan')
          router.refresh()
        },
        modal: {
          ondismiss: function () {
            setStep('dismissed')
            setTimeout(() => setStep('idle'), 3000)
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', function (response: { error: { description: string } }) {
        setError(response.error?.description || 'Payment failed. Please try again.')
        setStep('error')
      })

      rzp.open()
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('error')
    }
  }, [planId, planName, amount, userName, userEmail, userPhone, router])

  const buttonLabel = (() => {
    switch (step) {
      case 'creating-order':
        return 'Creating order...'
      case 'checkout-open':
        return 'Complete payment in popup...'
      case 'verifying':
        return 'Verifying payment...'
      case 'success':
        return 'Redirecting...'
      default:
        return `Purchase - ₹${(amount / 100).toLocaleString('en-IN')}`
    }
  })()

  const isDisabled =
    step === 'creating-order' ||
    step === 'checkout-open' ||
    step === 'verifying' ||
    step === 'success'

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

      {step === 'dismissed' && (
        <div
          className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800"
          role="status"
        >
          Payment cancelled. You can try again.
        </div>
      )}

      <Button
        onClick={handlePurchase}
        disabled={isDisabled}
        size="lg"
        className="h-12 w-full rounded-md bg-amber-300 text-base font-bold text-amber-950 hover:bg-amber-200 disabled:opacity-60"
      >
        {buttonLabel}
      </Button>

      {step === 'error' && (
        <Button
          onClick={() => {
            setStep('idle')
            setError('')
          }}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Try Again
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Secured by Razorpay. Your payment info is encrypted and processed securely.
      </p>
    </div>
  )
}
