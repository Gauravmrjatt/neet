import type { GlobalConfig } from 'payload'
import { isAdminOrEditor, anyone } from '../access/roles'

const defaultMissionBody = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [
          {
            type: 'text',
            text: 'We are dedicated to providing expert guidance and support to NEET aspirants. Our team of experienced counsellors helps students navigate the complex counselling process and make informed decisions about their medical career.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
}

const defaultTeamBody = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [
          {
            type: 'text',
            text: 'Our team consists of medical professionals, education experts, and experienced counsellors who have guided thousands of students to successful admissions in top medical colleges across India.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
}

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  access: {
    read: anyone,
    update: isAdminOrEditor,
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
          defaultValue: defaultMissionBody,
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
          defaultValue: 'Why Choose Us?',
        },
        {
          name: 'items',
          type: 'array',
          labels: {
            singular: 'Bullet',
            plural: 'Bullets',
          },
          defaultValue: [
            { text: 'Experienced counsellors with proven track records' },
            { text: 'Personalized guidance tailored to your needs' },
            { text: 'Comprehensive support throughout the counselling process' },
            { text: 'Access to exclusive resources and video content' },
            { text: 'Live sessions for real-time interaction with experts' },
          ],
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
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
          defaultValue: defaultTeamBody,
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
