import type { CollectionConfig } from 'payload'
import { can, canPublish } from '../access/permissions'

const DISTRICT_PAGE_TYPES = [
  { label: 'NEET Counselling', value: 'neet-counselling' },
  { label: 'MBBS Admission', value: 'mbbs-admission' },
  { label: 'Government Medical Colleges', value: 'government-medical-colleges' },
  { label: 'Private Medical Colleges', value: 'private-medical-colleges' },
  { label: 'Cutoff', value: 'cutoff' },
  { label: 'Fees', value: 'fees' },
  { label: 'Documents Required', value: 'documents-required' },
  { label: 'Choice Filling', value: 'choice-filling' },
  { label: 'Seat Matrix', value: 'seat-matrix' },
  { label: 'MCC Counselling', value: 'mcc-counselling' },
  { label: 'State Counselling', value: 'state-counselling' },
  { label: 'Expected Cutoff', value: 'expected-cutoff' },
  { label: 'All Medical Colleges', value: 'all-medical-colleges' },
  { label: 'Important Dates', value: 'important-dates' },
  { label: 'FAQ', value: 'faq' },
  { label: 'News', value: 'news' },
  { label: 'Updates', value: 'updates' },
] as const

export const DistrictContent: CollectionConfig = {
  slug: 'district-content',
  admin: {
    useAsTitle: 'type',
    group: 'Content',
    defaultColumns: ['district', 'type', 'status', 'generatedAt'],
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data || !req.user) return data
        if (await canPublish(req)) return data
        data.status = 'draft'
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidateDistrictContent } = await import('@/lib/revalidate')
          const districtSlug = typeof doc.district === 'object' ? doc.district?.slug : undefined
          if (districtSlug) {
            revalidateDistrictContent(districtSlug, doc.type as string)
          }
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
      },
    ],
  },
  access: {
    read: () => true,
    create: can('district-content').create,
    update: can('district-content').update,
    delete: can('district-content').delete,
  },
  fields: [
    {
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
      required: true,
      index: true,
    },
    {
      name: 'type',
      type: 'select',
      options: DISTRICT_PAGE_TYPES.map(t => ({ label: t.label, value: t.value })),
      required: true,
      index: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'contentBlock',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'body', type: 'richText' },
          ],
        },
        {
          slug: 'faqBlock',
          fields: [
            { name: 'title', type: 'text' },
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text' },
                { name: 'answer', type: 'textarea' },
              ],
            },
          ],
        },
        {
          slug: 'comparisonTable',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'rows',
              type: 'array',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'columnA', type: 'text' },
                { name: 'columnB', type: 'text' },
                { name: 'columnC', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'ctaBlock',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'buttonText', type: 'text' },
            { name: 'buttonLink', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'published',
      required: true,
      access: {
        read: async ({ req }) => canPublish(req),
        update: async ({ req }) => canPublish(req),
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'generatedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'When this content was auto-generated',
      },
    },
    {
      name: 'manuallyOverridden',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Set to true when admin manually edits this content',
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
