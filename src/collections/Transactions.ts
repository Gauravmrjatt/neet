import type { CollectionConfig } from 'payload'
import { can, hasPermission, hiddenForCollection } from '../access/permissions'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'id',
    ...hiddenForCollection('transactions'),
    defaultColumns: ['user', 'plan', 'amount', 'status', 'razorpayOrderId', 'createdAt'],
    description: 'Tracks Razorpay payment transactions',
  },
  access: {
    read: async ({ req }) => {
      if (!req.user) return false
      if (await hasPermission(req, 'transactions', 'read')) return true
      return { user: { equals: req.user.id } }
    },
    create: () => false,
    update: can('transactions').update,
    delete: can('transactions').delete,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'pricing-cards',
      required: true,
    },
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscriptions',
      admin: {
        description: 'Subscription created after successful payment',
      },
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      unique: true,
      admin: {
        description: 'Razorpay order ID',
      },
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      admin: {
        description: 'Razorpay payment ID (set after successful payment)',
      },
    },
    {
      name: 'razorpaySignature',
      type: 'text',
      admin: {
        description: 'Razorpay payment signature (for verification)',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Amount in paise (e.g., 239900 for ₹2399)',
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'INR',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'created',
      options: [
        { label: 'Created', value: 'created' },
        { label: 'Attempted', value: 'attempted' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'idempotencyKey',
      type: 'text',
      unique: true,
      admin: {
        description: 'Prevents duplicate order creation',
      },
    },
    {
      name: 'paymentMethod',
      type: 'text',
      admin: {
        description: 'e.g., upi, card, netbanking',
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      admin: {
        description: 'Error details if payment failed',
      },
    },
    {
      name: 'webhookEvents',
      type: 'json',
      admin: {
        description: 'Audit log of received webhook events',
      },
    },
  ],
}
