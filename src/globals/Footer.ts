import type { GlobalConfig } from 'payload'
import { anyone } from '../access/roles'
import { can, hiddenForGlobal } from '../access/permissions'

function validateUrl(value: string | null | undefined) {
  if (!value || typeof value !== 'string') return true
  const trimmed = value.trim()
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return true
  return 'URL must start with /, #, http://, https://, mailto:, or tel:'
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    ...hiddenForGlobal('footer'),
  },
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
    update: can('footer').update,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Expert NEET and JOSAA counselling services to help you secure your dream medical seat.',
    },
    {
      name: 'columns',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              validate: validateUrl,
            },
          ],
        },
      ],
    },
    {
      name: 'policyLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: validateUrl,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: validateUrl,
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2025 NEET Counselling. All rights reserved.',
    },
    {
      name: 'creditsText',
      type: 'text',
      defaultValue: 'Content Owned and Maintained by NEET Counselling',
    },
    {
      name: 'businessHours',
      type: 'text',
      defaultValue: 'Mon\u2013Sat, 10:00\u201318:00 IST',
    },
    {
      name: 'supportEmail',
      type: 'text',
      defaultValue: 'support@neetcounselling.example',
    },
  ],
}
