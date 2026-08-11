import type { GlobalConfig } from 'payload'
import { anyone } from '../access/roles'
import { can } from '../access/permissions'

export const PredictorPage: GlobalConfig = {
  slug: 'predictor-page',
  hooks: {
    afterChange: [
      async () => {
        const { revalidateGlobals } = await import('@/lib/revalidate')
        revalidateGlobals()
      },
    ],
  },
  access: {
    read: anyone,
    update: can('predictor-page').update,
  },
  admin: {
    description: 'Content for the /predictor page',
  },
  fields: [
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
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from indexing this page',
          },
        },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          defaultValue: 'NEET College Predictor',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Predict Your College',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue:
            'Select your course stream — MBBS/BDS, AYUSH or Veterinary — enter your rank and get personalized admission predictions with Safe, Likely & Risky probability analysis based on official allotment data.',
        },
      ],
    },
    {
      name: 'beforeForm',
      type: 'blocks',
      label: 'Content Above Predictor Form',
      labels: {
        singular: 'Block',
        plural: 'Blocks',
      },
      admin: {
        description: 'Optional content sections displayed before the predictor form',
      },
      blocks: [
        {
          slug: 'savedContentBlock',
          labels: { singular: 'Saved Content', plural: 'Saved Content' },
          fields: [
            {
              name: 'savedContent',
              type: 'relationship',
              relationTo: 'saved-content',
              required: true,
              label: 'Select Saved Content',
            },
          ],
        },
        {
          slug: 'contentBlock',
          fields: [
            {
              name: 'heading',
              type: 'text',
            },
            {
              name: 'body',
              type: 'richText',
            },
          ],
        },
        {
          slug: 'features',
          fields: [
            {
              name: 'heading',
              type: 'text',
            },
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        {
          slug: 'faqBlock',
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          slug: 'imageBlock',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
            {
              name: 'alignment',
              type: 'select',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
              defaultValue: 'center',
            },
          ],
        },
        {
          slug: 'alertBlock',
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Info', value: 'info' },
                { label: 'Warning', value: 'warning' },
                { label: 'Success', value: 'success' },
                { label: 'Error', value: 'error' },
              ],
              defaultValue: 'info',
            },
          ],
        },
        {
          slug: 'quoteBlock',
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
            },
            {
              name: 'author',
              type: 'text',
            },
            {
              name: 'style',
              type: 'select',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Highlight', value: 'highlight' },
                { label: 'Border', value: 'border' },
              ],
              defaultValue: 'default',
            },
          ],
        },
      ],
    },
    {
      name: 'afterForm',
      type: 'blocks',
      label: 'Content Below Predictor Form',
      labels: {
        singular: 'Block',
        plural: 'Blocks',
      },
      admin: {
        description: 'Optional content sections displayed after the predictor form',
      },
      blocks: [
        {
          slug: 'savedContentBlock',
          labels: { singular: 'Saved Content', plural: 'Saved Content' },
          fields: [
            {
              name: 'savedContent',
              type: 'relationship',
              relationTo: 'saved-content',
              required: true,
              label: 'Select Saved Content',
            },
          ],
        },
        {
          slug: 'contentBlock',
          fields: [
            {
              name: 'heading',
              type: 'text',
            },
            {
              name: 'body',
              type: 'richText',
            },
          ],
        },
        {
          slug: 'features',
          fields: [
            {
              name: 'heading',
              type: 'text',
            },
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        {
          slug: 'testimonials',
          fields: [
            {
              name: 'heading',
              type: 'text',
            },
            {
              name: 'testimonials',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'quote',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'designation',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          slug: 'ctaBlock',
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'buttonText',
              type: 'text',
              required: true,
            },
            {
              name: 'buttonLink',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          slug: 'faqBlock',
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          slug: 'imageBlock',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
            {
              name: 'alignment',
              type: 'select',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
              defaultValue: 'center',
            },
          ],
        },
        {
          slug: 'alertBlock',
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Info', value: 'info' },
                { label: 'Warning', value: 'warning' },
                { label: 'Success', value: 'success' },
                { label: 'Error', value: 'error' },
              ],
              defaultValue: 'info',
            },
          ],
        },
        {
          slug: 'quoteBlock',
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
            },
            {
              name: 'author',
              type: 'text',
            },
            {
              name: 'style',
              type: 'select',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Highlight', value: 'highlight' },
                { label: 'Border', value: 'border' },
              ],
              defaultValue: 'default',
            },
          ],
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'group',
      label: 'Disclaimer',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          defaultValue:
            'Based on official MCC, AACCC & VCI NEET UG counselling data. Predictions are estimates and do not guarantee admission.',
        },
        {
          name: 'isEnabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show/hide the disclaimer bar at the bottom of the page',
          },
        },
      ],
    },
  ],
}
