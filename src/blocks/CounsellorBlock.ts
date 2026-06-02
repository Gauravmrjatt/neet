import type { Block } from 'payload'

export const CounsellorBlock: Block = {
  slug: 'counsellor-block',
  labels: {
    singular: 'Counsellor Section',
    plural: 'Counsellor Sections',
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
      name: 'counsellors',
      type: 'relationship',
      relationTo: 'counselors',
      hasMany: true,
    },
  ],
}
