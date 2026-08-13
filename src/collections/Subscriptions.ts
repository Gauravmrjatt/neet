import type { CollectionConfig } from 'payload'
import { can, hasPermission, hiddenForCollection } from '../access/permissions'

const canRead = async ({ req }: { req: any }) => {
  if (!req.user) return false
  if (await hasPermission(req, 'subscriptions', 'read')) return true
  return {
    user: {
      equals: req.user.id,
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
    ...hiddenForCollection('subscriptions'),
    defaultColumns: ['user', 'plan', 'status', 'transaction', 'assignedCounselor', 'assignedPage'],
    description: 'Tracks user plan purchases and admin assignments',
  },
  access: {
    read: canRead,
    create: canCreate,
    update: can('subscriptions').update,
    delete: can('subscriptions').delete,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // On create: set user from context if not already set (webhook sets it explicitly)
        if (operation === 'create') {
          if (!data.user && req.user) {
            data.user = req.user.id
          }

          // Set purchasedAt
          if (!data.purchasedAt) {
            data.purchasedAt = new Date().toISOString()
          }

          // Add plan credits to user's wallet instead of storing on subscription
          if (data.plan) {
            try {
              const planId =
                typeof data.plan === 'object' ? (data.plan as any).id : data.plan
              const plan = await req.payload.findByID({
                collection: 'pricing-cards',
                id: planId,
              })
              const credits = Math.max((plan as any).predictionCredits ?? 1, 1)

              // Atomic $inc on the user's wallet
              const userId = data.user || req.user?.id
              if (userId) {
                const UserModel = req.payload.db.collections['users']
                if (UserModel) {
                  await UserModel.updateOne(
                    { _id: userId },
                    {
                      $inc: {
                        predictionCredits: credits,
                        predictionCreditsRemaining: credits,
                      },
                    },
                  )
                }
              }
            } catch {
              // Silently fail — credits are a bonus, not blocking
            }
          }

          // Set per-subscription fields to 0 (wallet is the source of truth)
          data.creditsTotal = 0
          data.creditsRemaining = 0
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
      name: 'creditsTotal',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Total credits granted with this plan (auto-set from plan on creation)',
        readOnly: true,
      },
    },
    {
      name: 'creditsRemaining',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Remaining prediction credits (decremented on each use)',
        readOnly: true,
      },
    },
  ],
}
