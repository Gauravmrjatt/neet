import { getPayloadClient } from '../payload'
import type { Transaction } from '@/payload-types'

export async function findTransactionByRazorpayOrderId(
  razorpayOrderId: string,
): Promise<Transaction | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'transactions',
    where: {
      razorpayOrderId: {
        equals: razorpayOrderId,
      },
    },
    limit: 1,
    depth: 1,
  })
  return (result.docs[0] as Transaction) || null
}

export async function findTransactionById(
  transactionId: string,
): Promise<Transaction | null> {
  const payload = await getPayloadClient()
  try {
    const result = await payload.findByID({
      collection: 'transactions',
      id: transactionId,
      depth: 1,
    })
    return result as Transaction
  } catch {
    return null
  }
}
