import type { GlobalConfig } from 'payload'
import { isAdmin, anyone } from '../access/roles'

function validateUrl(value: string | null | undefined) {
  if (!value || typeof value !== 'string') return true
  const trimmed = value.trim()
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return true
  return 'URL must start with /, #, http://, https://, mailto:, or tel:'
}

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Left-side logo (e.g., Ministry of Education emblem)',
      },
    },
    {
      name: 'emblem',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Right-side emblem/logo (e.g., NTA or organization logo)',
      },
    },
    {
      name: 'hindiTitle',
      type: 'text',
      defaultValue: 'नीट काउंसलिंग',
    },
    {
      name: 'englishTitle',
      type: 'text',
      defaultValue: 'NEET Counselling',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Expert NEET and JOSAA Counselling Services',
    },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          validate: validateUrl,
        },
        {
          name: 'children',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              validate: validateUrl,
            },
          ],
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
          validate: validateUrl,
        },
      ],
    },
  ],
}
