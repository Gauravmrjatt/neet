import type { GlobalConfig } from 'payload'
import { anyone } from '../access/roles'
import { can } from '../access/permissions'

export const HomePageSEO: GlobalConfig = {
  slug: 'home-page-seo',
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
    update: can('home-page-seo').update,
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
