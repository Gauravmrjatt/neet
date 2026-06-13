import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { findTransactionByRazorpayOrderId } from '@/lib/queries'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 })
    }

    const isValid = verifyWebhookSignature(rawBody, signature)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const eventName = event.event

    // Razorpay sends array of events, or single event
    const events = Array.isArray(event) ? event : [event]

    for (const evt of events) {
      const evtName = evt.event || eventName

      if (evtName === 'payment.captured') {
        const payment = evt.payload?.payment?.entity
        if (!payment) continue

        const orderId = payment.order_id
        if (!orderId) continue

        const payload = await getPayloadClient()

        // Find the transaction by Razorpay order ID
        const transaction = await findTransactionByRazorpayOrderId(orderId)
        if (!transaction) {
          console.warn(`[Webhook] No transaction found for order ${orderId}`)
          continue
        }

        // Idempotency: skip if already paid
        if (transaction.status === 'paid') {
          continue
        }

        // Extract plan and user from the transaction
        const planId =
          typeof transaction.plan === 'object' ? transaction.plan?.id : transaction.plan
        const userId =
          typeof transaction.user === 'object' ? transaction.user?.id : transaction.user

        if (!planId || !userId) {
          console.error(`[Webhook] Missing plan/user on transaction ${transaction.id}`)
          continue
        }

        // Update transaction as paid
        await payload.update({
          collection: 'transactions',
          id: transaction.id,
          data: {
            status: 'paid',
            razorpayPaymentId: payment.id,
            paidAt: new Date().toISOString(),
            webhookEvents: [
              ...(Array.isArray((transaction as any).webhookEvents)
                ? (transaction as any).webhookEvents
                : []),
              {
                event: evtName,
                timestamp: new Date().toISOString(),
                paymentId: payment.id,
              },
            ],
          },
        })

        // Create subscription (auto-active since payment is captured)
        const subscription = await payload.create({
          collection: 'subscriptions',
          data: {
            user: userId,
            plan: planId,
            transaction: transaction.id,
            status: 'active',
          },
        })

        // Link subscription back to transaction
        await payload.update({
          collection: 'transactions',
          id: transaction.id,
          data: {
            subscription: subscription.id,
          },
        })
      }

      if (evtName === 'payment.failed') {
        const payment = evt.payload?.payment?.entity
        if (!payment) continue

        const orderId = payment.order_id
        if (!orderId) continue

        const payload = await getPayloadClient()
        const transaction = await findTransactionByRazorpayOrderId(orderId)
        if (!transaction) continue

        // Update transaction as failed
        await payload.update({
          collection: 'transactions',
          id: transaction.id,
          data: {
            status: 'failed',
            errorMessage: payment.error_description || 'Payment failed',
            webhookEvents: [
              ...(Array.isArray((transaction as any).webhookEvents)
                ? (transaction as any).webhookEvents
                : []),
              {
                event: evtName,
                timestamp: new Date().toISOString(),
                paymentId: payment.id,
                error: payment.error_description,
              },
            ],
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
