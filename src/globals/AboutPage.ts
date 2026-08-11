import type { GlobalConfig } from 'payload'
import { anyone } from '../access/roles'
import { can } from '../access/permissions'

const iconOptions = [
  { label: 'Award', value: 'Award' },
  { label: 'Target', value: 'Target' },
  { label: 'BookOpen', value: 'BookOpen' },
  { label: 'Headphones', value: 'Headphones' },
  { label: 'Heart', value: 'Heart' },
  { label: 'Users', value: 'Users' },
]

const statAccentOptions = [
  { label: 'Navy', value: 'navy' },
  { label: 'Gold', value: 'gold' },
]

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  hooks: {
    afterChange: [
      async () => {
        const { revalidateAbout } = await import('@/lib/revalidate')
        revalidateAbout()
      },
    ],
  },
  access: {
    read: anyone,
    update: can('about-page').update,
  },
  admin: {
    description: 'Content for the /about page',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      fields: [
        {
          name: 'badge',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'About Us',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue:
            'Our mission is to help NEET aspirants achieve their dreams through expert guidance and personalized counselling.',
        },
      ],
    },
    {
      name: 'mission',
      type: 'group',
      label: 'Mission',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Our Mission',
        },
        {
          name: 'body',
          type: 'richText',
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Stats (2×2 grid)',
          minRows: 0,
          maxRows: 4,
          admin: {
            description:
              'Shown in the 2×2 stats grid next to the mission text. Use "Gold" accent for the primary number.',
          },
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'e.g. 10k+',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'e.g. Students guided',
              },
            },
            {
              name: 'accent',
              type: 'select',
              options: statAccentOptions,
              defaultValue: 'navy',
            },
          ],
        },
      ],
    },
    {
      name: 'whyChooseUs',
      type: 'group',
      label: 'Why Choose Us',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Why Choose Us',
        },
        {
          name: 'intro',
          type: 'textarea',
          defaultValue: 'Six reasons students and parents across India trust us with their NEET journey.',
        },
        {
          name: 'items',
          type: 'array',
          labels: {
            singular: 'Feature',
            plural: 'Features',
          },
          minRows: 1,
          maxRows: 12,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: iconOptions,
              defaultValue: 'Award',
            },
          ],
        },
      ],
    },
    {
      name: 'team',
      type: 'group',
      label: 'Team',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Our Team',
        },
        {
          name: 'body',
          type: 'richText',
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Stats (3-column strip)',
          minRows: 0,
          maxRows: 6,
          admin: {
            description:
              'Shown below the team description. Use "Gold" accent for the primary number.',
          },
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'e.g. 20+',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'e.g. Medical experts',
              },
            },
            {
              name: 'accent',
              type: 'select',
              options: statAccentOptions,
              defaultValue: 'navy',
            },
          ],
        },
      ],
    },
    {
      name: 'extraSections',
      type: 'array',
      label: 'Additional Sections',
      admin: {
        description: 'Optional extra content blocks rendered after the Team section',
      },
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
