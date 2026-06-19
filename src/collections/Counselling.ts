import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrAdmin } from '../access/roles'

function formatSlug(val: string): string {
  return val
    .replace(/^\//, '')
    .replace(/\/+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export const Counselling: CollectionConfig = {
  slug: 'counselling',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  versions: {
    drafts: true,
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
        const { revalidateCounselling } = await import('@/lib/revalidate')
        revalidateCounselling(doc.slug)
      },
    ],
  },
  access: {
    read: publishedOrAdmin,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
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
      name: 'excerpt',
      type: 'textarea',
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
          slug: 'relatedPostsBlock',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
            },
            {
              name: 'posts',
              type: 'array',
              label: 'Related Posts',
              fields: [
                {
                  name: 'post',
                  type: 'relationship',
                  relationTo: ['blogs', 'counselling', 'pages'],
                  required: true,
                },
              ],
            },
          ],
        },
        {
          slug: 'comparisonTable',
          fields: [
            {
              name: 'heading',
              type: 'text',
            },
            {
              name: 'rows',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'columnA',
                  type: 'text',
                },
                {
                  name: 'columnB',
                  type: 'text',
                },
                {
                  name: 'columnC',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'NEET UG Counselling', value: 'ug-counselling' },
        { label: 'NEET PG Counselling', value: 'pg-counselling' },
        { label: 'State Counselling', value: 'state-counselling' },
        { label: 'MBBS Abroad', value: 'abroad' },
        { label: 'Guides & Tips', value: 'guide' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'state',
      type: 'relationship',
      relationTo: 'states',
      hasMany: false,
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.category === 'state-counselling',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
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
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
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
        },
      ],
    },
  ],
}
