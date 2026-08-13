import type { GlobalConfig } from 'payload'
import { anyone } from '../access/roles'
import { can, hiddenForGlobal } from '../access/permissions'

export const Testimonials: GlobalConfig = {
  slug: 'testimonials',
  admin: {
    ...hiddenForGlobal('testimonials'),
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
    update: can('testimonials').update,
  },
  fields: [
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'designation',
          type: 'text',
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          defaultValue: 5,
        },
      ],
    },
  ],
}
