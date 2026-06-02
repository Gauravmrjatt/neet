import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, anyone } from '../access/roles'

export const Counselors: CollectionConfig = {
  slug: 'counselors',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
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
