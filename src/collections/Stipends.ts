import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'

export const Stipends: CollectionConfig = {
  slug: 'stipends',
  admin: {
    useAsTitle: 'id',
    group: 'Content',
    defaultColumns: ['college', 'course', 'internYear', 'amount'],
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
      name: 'internYear',
      type: 'text',
      admin: {
        description: 'e.g., First Year, Second Year, Internship Period',
      },
    },
    {
      name: 'amount',
      type: 'number',
      admin: {
        description: 'Stipend amount in INR',
      },
    },
    {
      name: 'frequency',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
      ],
      defaultValue: 'monthly',
    },
  ],
}
