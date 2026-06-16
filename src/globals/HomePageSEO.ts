import type { GlobalConfig } from 'payload'
import { isAdmin, anyone } from '../access/roles'

export const HomePageSEO: GlobalConfig = {
  slug: 'home-page-seo',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'keywords',
      type: 'array',
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
  ],
}
