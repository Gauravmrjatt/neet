import type { GlobalConfig } from 'payload'
import { isAdminOrEditor, anyone } from '../access/roles'

const iconOptions = [
  { label: 'Award', value: 'Award' },
  { label: 'Target', value: 'Target' },
  { label: 'BookOpen', value: 'BookOpen' },
  { label: 'Headphones', value: 'Headphones' },
  { label: 'Heart', value: 'Heart' },
  { label: 'Users', value: 'Users' },
  { label: 'BarChart3', value: 'BarChart3' },
  { label: 'Handshake', value: 'Handshake' },
  { label: 'Shield', value: 'Shield' },
  { label: 'Star', value: 'Star' },
  { label: 'Zap', value: 'Zap' },
  { label: 'GraduationCap', value: 'GraduationCap' },
  { label: 'TrendingUp', value: 'TrendingUp' },
  { label: 'Clock', value: 'Clock' },
]

export const PricingPage: GlobalConfig = {
  slug: 'pricing-page',
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  admin: {
    description: 'Content for the /pricing page',
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
          defaultValue: 'Pricing Plans',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Choose the Plan That Gets You In',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue:
            'Transparent pricing. No hidden fees. Pick the counselling plan that matches your ambition — from single-round guidance to full admission coverage.',
        },
      ],
    },
    {
      name: 'ctaBanner',
      type: 'group',
      label: 'CTA Banner (between hero and plans)',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          admin: {
            description: 'Optional text above the button',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'View Plans',
        },
        {
          name: 'buttonLink',
          type: 'text',
          defaultValue: '#plans',
        },
        {
          name: 'isEnabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show/hide this banner',
          },
        },
      ],
    },
    {
      name: 'trustSection',
      type: 'group',
      label: 'Why Thousands Trust Us',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Why Thousands Trust Us',
        },
        {
          name: 'items',
          type: 'array',
          labels: {
            singular: 'Trust Point',
            plural: 'Trust Points',
          },
          minRows: 0,
          maxRows: 8,
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
              defaultValue: 'Users',
            },
          ],
        },
      ],
    },
    {
      name: 'faqSection',
      type: 'group',
      label: 'FAQ Section',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Frequently Asked Questions',
        },
      ],
    },
    {
      name: 'bottomCta',
      type: 'group',
      label: 'Bottom CTA (blue section)',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Still not sure which plan?',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Book a free 15-minute call with our counsellors and we will help you pick the right plan.',
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'Book a Free Call',
        },
        {
          name: 'buttonLink',
          type: 'text',
          defaultValue: '/contact',
        },
        {
          name: 'isEnabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show/hide this section',
          },
        },
      ],
    },
  ],
}
