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

export const Colleges: CollectionConfig = {
  slug: 'colleges',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    ...hiddenForCollection('colleges'),
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
          const { revalidateColleges } = await import('@/lib/revalidate')
          revalidateColleges(doc.slug)
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
      },
    ],
  },
  access: {
    read: () => true,
    create: can('colleges').create,
    update: can('colleges').update,
    delete: can('colleges').delete,
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
      name: 'type',
      type: 'select',
      options: [
        { label: 'Government', value: 'government' },
        { label: 'Private', value: 'private' },
        { label: 'Deemed University', value: 'deemed' },
        { label: 'Central University', value: 'central' },
      ],
      required: true,
    },
    {
      name: 'state',
      type: 'relationship',
      relationTo: 'states',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'District where this college is located',
      },
    },
    {
      name: 'tehsil',
      type: 'relationship',
      relationTo: 'tehsils',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Tehsil/sub-district where this college is located',
      },
    },
    {
      name: 'established',
      type: 'number',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'accreditation',
      type: 'select',
      options: [
        { label: 'NMC Approved', value: 'nmc' },
        { label: 'MCI Approved', value: 'mci' },
      ],
      defaultValue: 'nmc',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
        },
      ],
    },
    {
      name: 'courses',
      type: 'array',
      fields: [
        {
          name: 'course',
          type: 'text',
        },
        {
          name: 'duration',
          type: 'text',
        },
        {
          name: 'seats',
          type: 'number',
        },
      ],
    },
    {
      name: 'feeStructure',
      type: 'group',
      fields: [
        {
          name: 'mbbsAnnual',
          type: 'number',
          admin: {
            description: 'Annual MBBS fee in INR',
          },
        },
        {
          name: 'totalCourseFee',
          type: 'text',
          admin: {
            description: 'Display string like "₹50 Lakh - ₹1.2 Cr"',
          },
        },
        {
          name: 'hostelFee',
          type: 'number',
        },
        {
          name: 'otherFees',
          type: 'text',
        },
      ],
    },
    {
      name: 'cutoffs',
      type: 'group',
      fields: [
        {
          name: 'year',
          type: 'number',
          defaultValue: 2025,
        },
        {
          name: 'general',
          type: 'number',
        },
        {
          name: 'obc',
          type: 'number',
        },
        {
          name: 'sc',
          type: 'number',
        },
        {
          name: 'st',
          type: 'number',
        },
        {
          name: 'ews',
          type: 'number',
        },
      ],
    },
    {
      name: 'hospitalInfo',
      type: 'group',
      fields: [
        {
          name: 'hospitalBeds',
          type: 'number',
        },
        {
          name: 'specialties',
          type: 'text',
        },
      ],
    },
    {
      name: 'ranking',
      type: 'number',
      admin: {
        description: 'Optional ranking number',
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
