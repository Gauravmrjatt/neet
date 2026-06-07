import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/roles'

const canRead = ({ req: { user } }: { req: { user: any } }) => {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true
  return {
    user: {
      equals: user.id,
    },
  }
}

const canCreate = ({ req: { user } }: { req: { user: any } }) => {
  return !!user
}

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'plan', 'status', 'transaction', 'assignedCounselor', 'assignedPage'],
    description: 'Tracks user plan purchases and admin assignments',
  },
  access: {
    read: canRead,
    create: canCreate,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // On create: set user from context if not already set (webhook sets it explicitly)
        if (operation === 'create') {
          if (!data.user && req.user) {
            data.user = req.user.id
          }

          // Check for existing active/pending subscription
          if (data.user) {
            const existing = await req.payload.find({
              collection: 'subscriptions',
              where: {
                and: [
                  { user: { equals: data.user } },
                  { status: { in: ['pending', 'active'] } },
                ],
              },
              limit: 1,
            })
            if (existing.docs.length > 0) {
              throw new Error('You already have an active or pending subscription')
            }
          }

          // Set purchasedAt
          if (!data.purchasedAt) {
            data.purchasedAt = new Date().toISOString()
          }
        }

        // Set assignedAt when status changes to 'active'
        if (
          data.status === 'active' &&
          (operation === 'create' || (originalDoc && originalDoc.status !== 'active'))
        ) {
          if (!data.assignedAt) {
            data.assignedAt = new Date().toISOString()
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who purchased this plan',
      },
    },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'pricing-cards',
      required: true,
      admin: {
        description: 'Which plan was purchased',
      },
    },
    {
      name: 'transaction',
      type: 'relationship',
      relationTo: 'transactions',
      admin: {
        description: 'The payment transaction for this subscription',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending (awaiting admin assignment)', value: 'pending' },
        { label: 'Active (assigned and ready)', value: 'active' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Expired', value: 'expired' },
      ],
      defaultValue: 'pending',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Set to "active" once both counselor and page are assigned',
      },
    },
    {
      name: 'assignedCounselor',
      type: 'relationship',
      relationTo: 'counselors',
      admin: {
        description: 'Counselor assigned to this user (set by admin)',
      },
    },
    {
      name: 'assignedPage',
      type: 'relationship',
      relationTo: 'pages',
      filterOptions: {
        status: {
          equals: 'published',
        },
      },
      admin: {
        description: 'CMS page the user will see on /my-plan (set by admin)',
      },
    },
    {
      name: 'purchasedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Auto-set on creation',
        readOnly: true,
      },
    },
    {
      name: 'assignedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Auto-set when status becomes active',
        readOnly: true,
      },
    },
    {
      name: 'predictorUsed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Auto-set after premium user uses their one-time AI college predictor',
        readOnly: true,
      },
    },
  ],
}
