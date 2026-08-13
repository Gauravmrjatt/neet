import type { CollectionConfig } from 'payload'
import { can, hiddenForCollection } from '../access/permissions'

function formatSlug(val: string): string {
  return val
    .replace(/^\//, '')
    .replace(/\/+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export const Tehsils: CollectionConfig = {
  slug: 'tehsils',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    ...hiddenForCollection('tehsils'),
    defaultColumns: ['name', 'district', 'state', 'status', 'id'],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.slug) {
          data.slug = formatSlug(data.slug)
        }
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidateTehsils } = await import('@/lib/revalidate')
          revalidateTehsils(doc.slug)
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
      },
    ],
  },
  access: {
    read: () => true,
    create: can('tehsils').create,
    update: can('tehsils').update,
    delete: can('tehsils').delete,
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
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
      required: true,
      index: true,
    },
    {
      name: 'state',
      type: 'relationship',
      relationTo: 'states',
      required: true,
      index: true,
    },
    {
      name: 'lgdCode',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'LGD (Local Government Directory) code for this tehsil',
      },
    },
    {
      name: 'description',
      type: 'richText',
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
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'keywords',
          type: 'array',
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
          defaultValue: false,
        },
      ],
    },
  ],
}
