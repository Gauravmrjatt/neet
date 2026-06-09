import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '../access/roles'

export const Testimonials: GlobalConfig = {
  slug: 'testimonials',
  access: {
    read: anyone,
    update: isAdmin,
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
