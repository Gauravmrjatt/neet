import type { CollectionConfig } from 'payload'
import { can, hiddenForCollection } from '../access/permissions'

export const SeatMatrix: CollectionConfig = {
  slug: 'seat-matrix',
  admin: {
    useAsTitle: 'id',
    group: 'Content',
    ...hiddenForCollection('seat-matrix'),
    defaultColumns: ['college', 'course', 'year', 'totalSeats'],
  },
  access: {
    read: () => true,
    create: can('seat-matrix').create,
    update: can('seat-matrix').update,
    delete: can('seat-matrix').delete,
  },
  fields: [
    {
      name: 'college',
      type: 'relationship',
      relationTo: 'colleges',
      required: true,
      index: true,
    },
    {
      name: 'course',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      defaultValue: 2025,
    },
    {
      name: 'totalSeats',
      type: 'number',
    },
    {
      name: 'aiqSeats',
      type: 'number',
      admin: {
        description: 'All India Quota seats',
      },
    },
    {
      name: 'stateSeats',
      type: 'number',
      admin: {
        description: 'State Quota seats',
      },
    },
    {
      name: 'managementSeats',
      type: 'number',
      admin: {
        description: 'Management Quota seats',
      },
    },
    {
      name: 'nriSeats',
      type: 'number',
      admin: {
        description: 'NRI Quota seats',
      },
    },
    {
      name: 'otherSeats',
      type: 'text',
      admin: {
        description: 'Any other seat type breakdown',
      },
    },
  ],
}
