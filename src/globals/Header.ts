import type { GlobalConfig } from 'payload'
import { isAdmin, anyone } from '../access/roles'

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
        },
      ],
    },
  ],
}
