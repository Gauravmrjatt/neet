import type { CollectionConfig } from 'payload'
import { can } from '../access/permissions'

export const CutoffRecords: CollectionConfig = {
  slug: 'cutoff-records',
  admin: {
    useAsTitle: 'id',
    group: 'Content',
    defaultColumns: ['college', 'course', 'year', 'round', 'quota', 'category', 'closingRank'],
  },
  access: {
    read: () => true,
    create: can('cutoff-records').create,
    update: can('cutoff-records').update,
    delete: can('cutoff-records').delete,
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
      type: 'select',
      required: true,
      options: [
        { label: 'MBBS', value: 'MBBS' },
        { label: 'BDS', value: 'BDS' },
        { label: 'BAMS', value: 'BAMS' },
        { label: 'BUMS', value: 'BUMS' },
        { label: 'BSMS', value: 'BSMS' },
        { label: 'BVSc & AH', value: 'BVSc & AH' },
        { label: 'B.Sc. Nursing', value: 'B.Sc. Nursing' },
        { label: 'Nursing', value: 'Nursing' },
      ],
      index: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      index: true,
    },
    {
      name: 'round',
      type: 'number',
      required: true,
    },
    {
      name: 'quota',
      type: 'select',
      required: true,
      options: [
        { label: 'All India', value: 'All India' },
        { label: 'State Quota', value: 'State Quota' },
        { label: 'Management', value: 'Management' },
        { label: 'NRI', value: 'NRI' },
        { label: 'Deemed', value: 'Deemed' },
        { label: 'Deemed/Paid Seats', value: 'Deemed/Paid Seats' },
        { label: 'Central', value: 'Central' },
        { label: 'Minority', value: 'Minority' },
        { label: 'ESI', value: 'ESI' },
        { label: 'Delhi University', value: 'Delhi University' },
        { label: 'AMU Quota', value: 'AMU Quota' },
        { label: 'IP University', value: 'IP University' },
        { label: 'Open Seat', value: 'Open Seat' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'General', value: 'General' },
        { label: 'General PwD', value: 'General PwD' },
        { label: 'OBC-NCL', value: 'OBC-NCL' },
        { label: 'OBC-NCL PwD', value: 'OBC-NCL PwD' },
        { label: 'SC', value: 'SC' },
        { label: 'SC PwD', value: 'SC PwD' },
        { label: 'ST', value: 'ST' },
        { label: 'ST PwD', value: 'ST PwD' },
        { label: 'EWS', value: 'EWS' },
        { label: 'EWS PwD', value: 'EWS PwD' },
        { label: 'OP', value: 'OP' },
        { label: 'GEN', value: 'GEN' },
        { label: 'OBC', value: 'OBC' },
      ],
    },
    {
      name: 'openingRank',
      type: 'number',
      required: true,
    },
    {
      name: 'closingRank',
      type: 'number',
      required: true,
    },
    {
      name: 'collegeType',
      type: 'text',
      admin: {
        description: 'Type as it appeared in source data (e.g., Private, Government, Deemed)',
      },
    },
    {
      name: 'fees',
      type: 'number',
      admin: {
        description: 'Annual fee from source data (if available)',
      },
    },
  ],
}
