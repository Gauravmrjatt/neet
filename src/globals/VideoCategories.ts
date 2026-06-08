import type { GlobalConfig } from 'payload'
import { isAdmin, anyone } from '../access/roles'

export const VideoCategories: GlobalConfig = {
  slug: 'video-categories',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
