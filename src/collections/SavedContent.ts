import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrAdmin } from '../access/roles'

export const SavedContent: CollectionConfig = {
  slug: 'saved-content',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Reusable content blocks that can be inserted into pages, blogs, and guides',
  },
  access: {
    read: publishedOrAdmin,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      async () => {
        try {
          const { revalidateSavedContent } = await import('@/lib/revalidate')
          revalidateSavedContent()
        } catch {
          // revalidateTag only works in Next.js request context — ignore in scripts
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Name',
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
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'contentBlock',
          labels: { singular: 'Content Block', plural: 'Content Blocks' },
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
          slug: 'imageBlock',
          labels: { singular: 'Image', plural: 'Images' },
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
          slug: 'videoBlock',
          labels: { singular: 'Video', plural: 'Videos' },
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'videoUrl',
              type: 'text',
              required: true,
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
        {
          slug: 'quoteBlock',
          labels: { singular: 'Quote', plural: 'Quotes' },
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
        {
          slug: 'ctaBlock',
          labels: { singular: 'CTA', plural: 'CTAs' },
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
          slug: 'alertBlock',
          labels: { singular: 'Alert', plural: 'Alerts' },
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
          slug: 'faqBlock',
          labels: { singular: 'FAQ', plural: 'FAQs' },
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
          slug: 'features',
          labels: { singular: 'Features', plural: 'Features' },
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
          labels: { singular: 'Testimonials', plural: 'Testimonials' },
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
          slug: 'comparisonTable',
          labels: { singular: 'Comparison Table', plural: 'Comparison Tables' },
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
  ],
}
