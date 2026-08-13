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

export const States: CollectionConfig = {
  slug: 'states',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    ...hiddenForCollection('states'),
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
          const { revalidateStates } = await import('@/lib/revalidate')
          revalidateStates(doc.slug)
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
      },
    ],
  },
  access: {
    read: () => true,
    create: can('states').create,
    update: can('states').update,
    delete: can('states').delete,
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
      name: 'code',
      type: 'text',
      admin: {
        description: 'State code (e.g., MH, KA, TN)',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'counsellingAuthority',
      type: 'text',
      admin: {
        description: 'Name of the counselling authority (e.g., DMER Maharashtra, KEA Karnataka)',
      },
    },
    {
      name: 'counsellingWebsite',
      type: 'text',
      admin: {
        description: 'Official counselling website URL',
      },
    },
    {
      name: 'counsellingProcess',
      type: 'textarea',
      admin: {
        description: 'Brief description of how counselling works in this state',
      },
    },
    {
      name: 'importantDates',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'date',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'eligibilityNotes',
      type: 'richText',
    },
    {
      name: 'documentRequirements',
      type: 'richText',
    },
    {
      name: 'reservationPolicy',
      type: 'richText',
    },
    {
      name: 'feeStructureNotes',
      type: 'richText',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
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
