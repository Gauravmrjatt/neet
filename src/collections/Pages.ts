import type { CollectionConfig } from 'payload'
import { can, publishedOrAdmin, canPublish, hiddenForCollection } from '../access/permissions'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    ...hiddenForCollection('pages'),
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data || !req.user) return data
        if (await canPublish(req)) return data
        data.status = 'draft'
        if (data._status === 'published') data._status = 'draft'
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePages } = await import('@/lib/revalidate')
          revalidatePages(doc.slug)
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
      },
    ],
  },
  access: {
    read: publishedOrAdmin('pages'),
    create: can('pages').create,
    update: can('pages').update,
    delete: can('pages').delete,
  },
  fields: [
    {
      name: 'jsonImport',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/PageJsonImporter#PageJsonImporter',
        },
      },
    },
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
      name: 'content',
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
          slug: 'hero',
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'subheading',
              type: 'textarea',
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'ctaText',
              type: 'text',
            },
            {
              name: 'ctaLink',
              type: 'text',
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
          slug: 'cta',
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
      ],
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
      access: {
        read: async ({ req }) => canPublish(req),
        update: async ({ req }) => canPublish(req),
      },
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
          admin: {
            description: 'Prevent search engines from indexing this page',
          },
        },
      ],
    },
  ],
}
