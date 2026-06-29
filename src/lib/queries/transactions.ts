import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { Transaction } from '@/payload-types'

export const findTransactionByRazorpayOrderId = cache(async (
  razorpayOrderId: string,
): Promise<Transaction | null> => {
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
})

export const getTransactionsByUser = cache(async (userId: string, limit = 50) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'transactions',
    where: { user: { equals: userId } },
    sort: '-createdAt',
    limit,
    depth: 1,
  })
  return result.docs as Transaction[]
})

export const findTransactionById = cache(async (
  transactionId: string,
): Promise<Transaction | null> => {
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
})
