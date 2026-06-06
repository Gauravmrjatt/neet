import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'

const canReadCounselors = ({ req: { user } }: { req: { user: any } }) => {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true
  return {
    status: {
      equals: 'active',
    },
  }
}

export const Counselors: CollectionConfig = {
  slug: 'counselors',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: canReadCounselors,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterRead: [
      ({ doc, req: { user } }) => {
        if (user?.role !== 'admin' && user?.role !== 'editor' && doc) {
          delete doc.email
          delete doc.phone
        }
        return doc
      },
    ],
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'designation',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'specializations',
      type: 'array',
      fields: [
        {
          name: 'specialization',
          type: 'select',
          options: [
            { label: 'JEE', value: 'jee' },
            { label: 'NEET', value: 'neet' },
            { label: 'JoSAA', value: 'josaa' },
            { label: 'General', value: 'general' },
          ],
        },
      ],
    },
    {
      name: 'experience',
      type: 'number',
      admin: {
        description: 'Years of experience',
      },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
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
