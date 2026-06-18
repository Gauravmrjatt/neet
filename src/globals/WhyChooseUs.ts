import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '../access/roles'

export const WhyChooseUs: GlobalConfig = {
  slug: 'why-choose-us',
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
    update: isAdmin,
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Why Us',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Why 17,000+ Students Trust Us',
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue:
        'NEET Counselling is your one-stop guide for college admissions — made for every student, in every corner of India.',
    },
    {
      name: 'cards',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Target', value: 'Target' },
            { label: 'Users', value: 'Users' },
            { label: 'Clock', value: 'Clock' },
            { label: 'BookOpen', value: 'BookOpen' },
            { label: 'Shield', value: 'Shield' },
            { label: 'Headphones', value: 'Headphones' },
            { label: 'Star', value: 'Star' },
            { label: 'Heart', value: 'Heart' },
            { label: 'CheckCircle', value: 'CheckCircle' },
            { label: 'ThumbsUp', value: 'ThumbsUp' },
            { label: 'Award', value: 'Award' },
            { label: 'Zap', value: 'Zap' },
            { label: 'Sparkles', value: 'Sparkles' },
          ],
        },
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
      ],
    },
  ],
}
