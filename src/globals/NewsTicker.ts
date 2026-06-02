import type { GlobalConfig } from 'payload'
import { isAdmin, anyone } from '../access/roles'

export const NewsTicker: GlobalConfig = {
  slug: 'news-ticker',
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
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
