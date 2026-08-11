import type { GlobalConfig } from 'payload'
import { anyone } from '../access/roles'
import { can } from '../access/permissions'

const PAGE_OPTIONS = [
  { label: 'Blog Listing', value: '/blog' },
  { label: 'Contact', value: '/contact' },
  { label: 'Counsellors Listing', value: '/counsellors' },
  { label: 'Helpdesk', value: '/helpdesk' },
  { label: 'FAQs', value: '/faq' },
  { label: 'Videos Listing', value: '/videos' },
  { label: 'Live Counselling Listing', value: '/live-counselling' },
  { label: 'Live Counselling Detail', value: '/live-counselling/[id]' },
  { label: 'JOSAA Counsellor', value: '/josaa-counsellor' },
  { label: 'Counselling Guides Listing', value: '/counselling' },
  { label: 'State-Wise Counselling Listing', value: '/counselling/state' },
  { label: 'Colleges Listing', value: '/colleges' },
]

export const PageSeo: GlobalConfig = {
  slug: 'page-seo',
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
    update: can('page-seo').update,
  },
  admin: {
    description: 'SEO metadata for listing/index pages that do not have their own collection or global. Set breadcrumb labels and meta tags for each route.',
  },
  fields: [
    {
      name: 'pages',
      type: 'array',
      label: 'Page SEO Entries',
      labels: {
        singular: 'Page',
        plural: 'Pages',
      },
      admin: {
        description: 'Configure SEO metadata for each static listing page.',
      },
      fields: [
        {
          name: 'page',
          type: 'select',
          label: 'Route',
          options: PAGE_OPTIONS,
          required: true,
          unique: true,
        },
        {
          name: 'breadcrumbLabel',
          type: 'text',
          label: 'Breadcrumb Label',
          admin: {
            placeholder: 'e.g. Blog, Contact, FAQs',
            description: 'Displayed in breadcrumb navigation on the page.',
          },
        },
        {
          type: 'tabs',
          tabs: [
            {
              label: 'SEO',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Meta Title',
                  admin: {
                    placeholder: 'Page title shown in search results and browser tab',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Meta Description',
                  admin: {
                    placeholder: '160-character description for search results',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  label: 'OG Image',
                  relationTo: 'media',
                  admin: {
                    description: '1200×630px image for social sharing. Falls back to the default site OG image if not set.',
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  label: 'Keywords',
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
                  label: 'Prevent Indexing',
                  defaultValue: false,
                  admin: {
                    description: 'Prevent search engines from indexing this page.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
