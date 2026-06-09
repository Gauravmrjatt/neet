import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { findTransactionById } from '@/lib/queries'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, transactionId } =
      await request.json()

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 },
      )
    }

    const transaction = await findTransactionById(transactionId)
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Security: ensure the transaction belongs to this user
    if (typeof transaction.user === 'object' && transaction.user?.id !== user.id) {
      return NextResponse.json({ error: 'Transaction does not belong to this user' }, { status: 403 })
    }

    // Idempotency: if already paid, return success
    if (transaction.status === 'paid') {
      return NextResponse.json({
        success: true,
        subscriptionId:
          typeof transaction.subscription === 'object'
            ? transaction.subscription?.id
            : transaction.subscription,
      })
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    if (!isValid) {
      const failPayload = await getPayloadClient()
      await failPayload.update({
        collection: 'transactions',
        id: transactionId,
        data: {
          status: 'failed',
          razorpayPaymentId,
          razorpaySignature,
          errorMessage: 'Payment signature verification failed',
        },
      })
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // Update transaction as paid
    await payload.update({
      collection: 'transactions',
      id: transactionId,
      data: {
        status: 'paid',
        razorpayPaymentId,
        razorpaySignature,
        paidAt: new Date().toISOString(),
      },
    })

    // Create subscription
    const planId = typeof transaction.plan === 'object' ? transaction.plan?.id : transaction.plan

    const subscription = await payload.create({
      collection: 'subscriptions',
      data: {
        user: user.id,
        plan: planId,
        transaction: transactionId,
        status: 'pending',
      },
    })

    // Link subscription back to transaction
    await payload.update({
      collection: 'transactions',
      id: transactionId,
      data: {
        subscription: subscription.id,
      },
    })

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed. Please contact support.' },
      { status: 500 },
    )
  }
}
