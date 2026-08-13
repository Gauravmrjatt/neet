import type { CollectionConfig, FieldAccess } from 'payload'
import { isAdmin, isAdminOrSelf, anyone } from '../access/roles'
import { hiddenForCollection } from '../access/permissions'

const isAdminField: FieldAccess = ({ req: { user } }) => user?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    listSearchableFields: ['name', 'email', 'phone'],
    ...hiddenForCollection('users'),
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    create: anyone,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req, originalDoc }) => {
        if (!data) return data
        if (operation === 'create') {
          // Force role to 'user' on self-registration to prevent privilege escalation
          data.role = 'user'
        }
        if (operation === 'update' && req?.user?.role !== 'admin' && originalDoc) {
          // Non-admin users cannot change their own role
          data.role = originalDoc.role
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      saveToJWT: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'permissions',
      type: 'group',
      label: 'Content Permissions',
      saveToJWT: true,
      admin: {
        description:
          'Leave empty to keep legacy role behavior (editor = full content access + publish). Once any collection access is added, the user is limited to exactly what is granted here.',
      },
      access: {
        read: isAdminField,
        create: isAdminField,
        update: isAdminField,
      },
      fields: [
        {
          name: 'publish',
          type: 'checkbox',
          label: 'Can publish / set status to published',
          defaultValue: false,
        },
        {
          name: 'collections',
          type: 'array',
          label: 'Collection Access',
          admin: {
            components: {
              RowLabel: '/components/admin/PermissionRowLabel#PermissionRowLabel',
            },
          },
          fields: [
            {
              name: 'slug',
              type: 'select',
              required: true,
              options: [
                { label: 'Blogs', value: 'blogs' },
                { label: 'Pages', value: 'pages' },
                { label: 'Videos', value: 'videos' },
                { label: 'Counselling', value: 'counselling' },
                { label: 'Counselors', value: 'counselors' },
                { label: 'Helpdesk', value: 'helpdesk' },
                { label: 'Live Counselling', value: 'live-counselling' },
                { label: 'Pricing Cards', value: 'pricing-cards' },
                { label: 'Media', value: 'media' },
                { label: 'Colleges', value: 'colleges' },
                { label: 'Cutoff Records', value: 'cutoff-records' },
                { label: 'Seat Matrix', value: 'seat-matrix' },
                { label: 'Specializations', value: 'specializations' },
                { label: 'States', value: 'states' },
                { label: 'Districts', value: 'districts' },
                { label: 'District Content', value: 'district-content' },
                { label: 'Tehsils', value: 'tehsils' },
                { label: 'Bonds', value: 'bonds' },
                { label: 'Stipends', value: 'stipends' },
                { label: 'Saved Content', value: 'saved-content' },
                { label: 'Subscriptions', value: 'subscriptions' },
                { label: 'Transactions', value: 'transactions' },
                { label: 'Contact Submissions', value: 'contact-submissions' },
                { label: 'Header (Global)', value: 'header' },
                { label: 'Footer (Global)', value: 'footer' },
                { label: 'Site Settings (Global)', value: 'site-settings' },
                { label: 'Home Page SEO (Global)', value: 'home-page-seo' },
                { label: 'News Ticker (Global)', value: 'news-ticker' },
                { label: 'About Page (Global)', value: 'about-page' },
                { label: 'Predictor Page (Global)', value: 'predictor-page' },
                { label: 'Pricing Page (Global)', value: 'pricing-page' },
                { label: 'Why Choose Us (Global)', value: 'why-choose-us' },
                { label: 'Video Categories (Global)', value: 'video-categories' },
                { label: 'Testimonials (Global)', value: 'testimonials' },
                { label: 'Page SEO (Global)', value: 'page-seo' },
              ],
            },
            {
              name: 'create',
              type: 'checkbox',
              label: 'Add',
            },
            {
              name: 'read',
              type: 'checkbox',
              label: 'Read',
            },
            {
              name: 'update',
              type: 'checkbox',
              label: 'Edit',
            },
            {
              name: 'delete',
              type: 'checkbox',
              label: 'Delete',
            },
          ],
        },
      ],
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'predictionCredits',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Lifetime total prediction credits added via purchases',
      },
    },
    {
      name: 'predictionCreditsRemaining',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Available prediction credits in wallet',
      },
    },
  ],
}
