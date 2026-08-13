import type { GlobalConfig } from 'payload'
import { anyone } from '../access/roles'
import { can, hiddenForGlobal } from '../access/permissions'

export const VideoCategories: GlobalConfig = {
  slug: 'video-categories',
  admin: {
    ...hiddenForGlobal('video-categories'),
  },
  access: {
    read: anyone,
    update: can('video-categories').update,
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
