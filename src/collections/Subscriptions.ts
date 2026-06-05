import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf } from '../access/roles'

const canRead = ({ req: { user } }: { req: { user: any } }) => {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true
  // Users can read their own subscriptions
  return {
    user: {
      equals: user.id,
    },
  }
}

const canCreate = ({ req: { user } }: { req: { user: any } }) => {
  // Any authenticated user can create a subscription (for themselves)
  return !!user
}

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'plan', 'status', 'assignedCounselor', 'assignedPage'],
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
        // Force user to be the logged-in user on create
        if (operation === 'create' && req.user) {
          data.user = req.user.id
        }

        // Check for existing active/pending subscription on create
        if (operation === 'create' && req.user) {
          const existing = await req.payload.find({
            collection: 'subscriptions',
            where: {
              and: [
                { user: { equals: req.user.id } },
                { status: { in: ['pending', 'active'] } },
              ],
            },
            limit: 1,
          })
          if (existing.docs.length > 0) {
            throw new Error('You already have an active or pending subscription')
          }
        }

        // Set purchasedAt on create
        if (operation === 'create' && !data.purchasedAt) {
          data.purchasedAt = new Date().toISOString()
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
  ],
}
