import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'

const canReadHelpdesk = ({ req: { user } }: { req: { user: any } }) => {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true
  return {
    status: {
      equals: 'active',
    },
  }
}

export const Helpdesk: CollectionConfig = {
  slug: 'helpdesk',
  admin: {
    useAsTitle: 'question',
  },
  access: {
    read: canReadHelpdesk,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Admission', value: 'admission' },
        { label: 'Exam', value: 'exam' },
        { label: 'Counselling', value: 'counselling' },
        { label: 'Technical', value: 'technical' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'other',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
