import type { CollectionConfig } from 'payload'
import { can, publishedOrAdmin, canPublish, hiddenForCollection } from '../access/permissions'

function formatSlug(val: string): string {
  return val
    .replace(/^\//, '')
    .replace(/\/+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    ...hiddenForCollection('videos'),
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
          const { revalidateVideos } = await import('@/lib/revalidate')
          revalidateVideos(doc.slug)
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
      },
    ],
  },
  access: {
    read: publishedOrAdmin('videos'),
    create: can('videos').create,
    update: can('videos').update,
    delete: can('videos').delete,
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
      name: 'description',
      type: 'richText',
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'YouTube or Vimeo URL',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'e.g. 12:34',
      },
    },
    {
      name: 'category',
      type: 'text',
      admin: {
        components: {
          Field: '/components/admin/VideoCategorySelect#VideoCategorySelect',
        },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
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
          label: 'Prevent search engines from indexing this page',
          defaultValue: false,
        },
      ],
    },
  ],
}
