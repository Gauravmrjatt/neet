import type { Block } from 'payload'

export const PricingBlock: Block = {
  slug: 'pricing-block',
  labels: {
    singular: 'Pricing Section',
    plural: 'Pricing Sections',
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
      name: 'pricingCards',
      type: 'array',
      fields: [
        {
          name: 'planName',
          type: 'text',
        },
        {
          name: 'price',
          type: 'number',
        },
        {
          name: 'features',
          type: 'array',
          fields: [
            {
              name: 'feature',
              type: 'text',
            },
          ],
        },
        {
          name: 'popular',
          type: 'checkbox',
        },
        {
          name: 'ctaText',
          type: 'text',
        },
        {
          name: 'ctaLink',
          type: 'text',
        },
      ],
    },
  ],
}
