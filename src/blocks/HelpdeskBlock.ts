import type { Block } from 'payload'

export const HelpdeskBlock: Block = {
  slug: 'helpdesk-block',
  labels: {
    singular: 'Helpdesk',
    plural: 'Helpdesks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'categories',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'items',
          type: 'array',
          fields: [
            {
              name: 'question',
              type: 'text',
            },
            {
              name: 'answer',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
