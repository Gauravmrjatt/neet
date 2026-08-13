import type { CollectionConfig } from 'payload'
import { can, statusFilteredOrAdmin, hiddenForCollection } from '../access/permissions'

export const Counselors: CollectionConfig = {
  slug: 'counselors',
  admin: {
    useAsTitle: 'name',
    ...hiddenForCollection('counselors'),
  },
  access: {
    read: statusFilteredOrAdmin('counselors', 'active', false),
    create: can('counselors').create,
    update: can('counselors').update,
    delete: can('counselors').delete,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidateCounsellors } = await import('@/lib/revalidate')
          revalidateCounsellors()
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
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
          type: 'relationship',
          relationTo: 'specializations',
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
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'ogImage',
          type: 'upload',
          label: 'OG Image',
          relationTo: 'media',
        },
        {
          name: 'keywords',
          type: 'array',
          label: 'Keywords',
          admin: {
            components: {
              Field: '/components/admin/CommaSeparatedArray#CommaSeparatedArray',
            },
          },
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'Prevent Indexing',
          defaultValue: false,
        },
      ],
    },
  ],
}
