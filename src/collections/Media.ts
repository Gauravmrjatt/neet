import type { CollectionConfig } from 'payload'
import { anyone, isAdmin } from '../access/roles'
import { can, hiddenForCollection } from '../access/permissions'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    ...hiddenForCollection('media'),
  },
  access: {
    read: anyone,
    create: can('media').create,
    update: can('media').update,
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
