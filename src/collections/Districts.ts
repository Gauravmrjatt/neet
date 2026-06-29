import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'

function formatSlug(val: string): string {
  return val
    .replace(/^\//, '')
    .replace(/\/+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export const Districts: CollectionConfig = {
  slug: 'districts',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'state', 'status', 'id'],
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
          const { revalidateDistricts } = await import('@/lib/revalidate')
          revalidateDistricts(doc.slug)
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
      },
    ],
  },
  access: {
    read: () => true,
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
      name: 'state',
      type: 'relationship',
      relationTo: 'states',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'population',
      type: 'text',
    },
    {
      name: 'famousColleges',
      type: 'relationship',
      relationTo: 'colleges',
      hasMany: true,
      admin: {
        description: 'Notable medical colleges in this district',
      },
    },
    {
      name: 'nearbyDistricts',
      type: 'relationship',
      relationTo: 'districts',
      hasMany: true,
      admin: {
        description: 'Geographically nearby districts for cross-linking',
      },
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
