import type { CollectionConfig } from 'payload'
import { can, hasPermission } from '../access/permissions'

export const LiveCounselling: CollectionConfig = {
  slug: 'live-counselling',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: async ({ req }) => {
      if (req.user) {
        return hasPermission(req, 'live-counselling', 'read')
      }
      return true
    },
    create: can('live-counselling').create,
    update: can('live-counselling').update,
    delete: can('live-counselling').delete,
  },
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        const canReadUrl = req.user ? await hasPermission(req, 'live-counselling', 'read') : false
        if (!canReadUrl && doc) {
          delete doc.meetingUrl
        }
        return doc
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidateLiveCounselling } = await import('@/lib/revalidate')
          revalidateLiveCounselling()
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'scheduledAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'd MMM yyyy h:mm a',
        },
      },
    },
    {
      name: 'counsellor',
      type: 'relationship',
      relationTo: 'counselors',
    },
    {
      name: 'meetingUrl',
      type: 'text',
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'e.g. 1 hour, 30 minutes',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Live', value: 'live' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'scheduled',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'maxParticipants',
      type: 'number',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'ogImage',
          type: 'upload',
          label: 'OG Image',
          relationTo: 'media',
        },
        {
          name: 'keywords',
          type: 'array',
          label: 'Keywords',
          admin: {
            components: {
              Field: '/components/admin/CommaSeparatedArray#CommaSeparatedArray',
            },
          },
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'Prevent Indexing',
          defaultValue: false,
        },
      ],
    },
  ],
}
