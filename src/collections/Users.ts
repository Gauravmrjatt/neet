import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, anyone } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    listSearchableFields: ['name', 'email', 'phone'],
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
