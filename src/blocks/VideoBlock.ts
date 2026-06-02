import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'video-block',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
