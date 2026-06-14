import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'

const canReadLiveCounselling = ({ req: { user } }: { req: { user: any } }) => {
  if (user?.role === 'admin' || user?.role === 'editor') return true
  return true
}

export const LiveCounselling: CollectionConfig = {
  slug: 'live-counselling',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: canReadLiveCounselling,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterRead: [
      ({ doc, req: { user } }) => {
        if (user?.role !== 'admin' && user?.role !== 'editor' && doc) {
          delete doc.meetingUrl
        }
        return doc
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
