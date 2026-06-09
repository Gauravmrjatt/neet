import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay'
import { getPricingCardById } from '@/lib/queries/pricing'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { planId, idempotencyKey } = await request.json()

    if (!planId || !idempotencyKey) {
      return NextResponse.json(
        { error: 'planId and idempotencyKey are required' },
        { status: 400 },
      )
    }

    const plan = await getPricingCardById(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const payload = await getPayloadClient()

    // Idempotency check: if a transaction with this key already exists, return the same order
    const existing = await payload.find({
      collection: 'transactions',
      where: { idempotencyKey: { equals: idempotencyKey } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const existingTxn = existing.docs[0]
      return NextResponse.json({
        orderId: existingTxn.razorpayOrderId,
        amount: existingTxn.amount,
        currency: existingTxn.currency,
        keyId: getRazorpayKeyId(),
        transactionId: existingTxn.id,
      })
    }

    // Create Razorpay order
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: plan.priceInPaise,
      currency: 'INR',
      receipt: `${user.id}_${Date.now()}`,
      payment_capture: true,
      notes: {
        userId: user.id,
        planId: plan.id,
      },
    })

    // Store transaction
    const transaction = await payload.create({
      collection: 'transactions',
      data: {
        user: user.id,
        plan: plan.id,
        razorpayOrderId: order.id,
        amount: order.amount as number,
        currency: order.currency as string,
        status: 'created',
        idempotencyKey,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      transactionId: transaction.id,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 },
    )
  }
}
