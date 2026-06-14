import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'

export const Bonds: CollectionConfig = {
  slug: 'bonds',
  admin: {
    useAsTitle: 'id',
    group: 'Content',
    defaultColumns: ['college', 'course', 'bondAmount', 'bondYears'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'college',
      type: 'relationship',
      relationTo: 'colleges',
      required: true,
      index: true,
    },
    {
      name: 'course',
      type: 'text',
    },
    {
      name: 'bondAmount',
      type: 'number',
      admin: {
        description: 'Bond amount in INR',
      },
    },
    {
      name: 'bondYears',
      type: 'number',
      admin: {
        description: 'Number of years of service required',
      },
    },
    {
      name: 'serviceArea',
      type: 'text',
      admin: {
        description: 'Where the bond service must be served (e.g., Rural, State, Any)',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
  ],
}
