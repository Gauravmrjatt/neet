import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isAdminOrEditor } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  upload: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'focalPoint',
      type: 'group',
      admin: {
        description: 'Select the focal point of the image for cropping',
      },
      fields: [
        {
          name: 'x',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 50,
        },
        {
          name: 'y',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 50,
        },
      ],
    },
  ],
}
