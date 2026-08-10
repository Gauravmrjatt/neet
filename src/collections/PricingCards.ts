import type { CollectionConfig } from 'payload'
import { anyone } from '../access/roles'
import { can } from '../access/permissions'

export const PricingCards: CollectionConfig = {
  slug: 'pricing-cards',
  admin: {
    useAsTitle: 'planName',
  },
  access: {
    read: anyone,
    create: can('pricing-cards').create,
    update: can('pricing-cards').update,
    delete: can('pricing-cards').delete,
  },
  fields: [
    {
      name: 'planName',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal name (e.g., "JOSAA Plan")',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Card heading (e.g., "Complete JOSAA & CSAB Counselling Plan")',
      },
    },
    {
      name: 'price',
      type: 'text',
      required: true,
      admin: {
        description: 'Display price (e.g., "₹2399")',
      },
    },
    {
      name: 'priceInPaise',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description:
          'Numeric price in paise for Razorpay (e.g., 239900 for ₹2399). 100 paise = ₹1.',
        position: 'sidebar',
      },
    },
    {
      name: 'predictionCredits',
      type: 'number',
      defaultValue: 1,
      min: 0,
      required: true,
      admin: {
        description: 'Number of AI college predictions a user gets with this plan',
        position: 'sidebar',
      },
    },
    {
      name: 'originalPrice',
      type: 'text',
      admin: {
        description: 'Strikethrough price (e.g., "₹2999"). Leave empty for no strikethrough.',
      },
    },
    {
      name: 'discount',
      type: 'text',
      admin: {
        description: 'Discount badge (e.g., "20% OFF"). Leave empty for no badge.',
      },
    },
    {
      name: 'badge',
      type: 'text',
      admin: {
        description: 'Badge text (e.g., "Premium", "NEW"). Shows if no discount.',
      },
    },
    {
      name: 'colorScheme',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Popular (darkest brown)', value: 'popular' },
        { label: 'Premium (dark brown)', value: 'premium' },
        { label: 'Standard (medium brown)', value: 'standard' },
        { label: 'Basic (light brown)', value: 'basic' },
      ],
      admin: {
        description: 'Card color scheme — all use brown family shades',
        position: 'sidebar',
      },
    },
    {
      name: 'colleges',
      type: 'text',
      admin: {
        description: 'College list (e.g., "DTU · NSUT · IIIT-D · IGDTUW · DSEU")',
      },
    },
    {
      name: 'description',
      type: 'text',
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
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark as most popular plan',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Get Started',
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
  ],
}
