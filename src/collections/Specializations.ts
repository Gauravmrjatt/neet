import type { CollectionConfig } from 'payload'
import { can, hiddenForCollection } from '../access/permissions'

export const Specializations: CollectionConfig = {
  slug: 'specializations',
  admin: {
    useAsTitle: 'name',
    ...hiddenForCollection('specializations'),
  },
  access: {
    read: () => true,
    create: can('specializations').create,
    update: can('specializations').update,
    delete: can('specializations').delete,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
