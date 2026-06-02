import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, anyone } from '../access/roles'

export const LiveCounselling: CollectionConfig = {
  slug: 'live-counselling',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
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
  ],
}
