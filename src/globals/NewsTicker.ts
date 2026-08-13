import type { GlobalConfig } from 'payload'
import { anyone } from '../access/roles'
import { can, hiddenForGlobal } from '../access/permissions'

export const NewsTicker: GlobalConfig = {
  slug: 'news-ticker',
  admin: {
    ...hiddenForGlobal('news-ticker'),
  },
  hooks: {
    afterChange: [
      async () => {
        const { revalidateGlobals } = await import('@/lib/revalidate')
        revalidateGlobals()
      },
    ],
  },
  access: {
    read: anyone,
    update: can('news-ticker').update,
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
