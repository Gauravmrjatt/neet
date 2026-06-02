import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'editor'
}

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (user?.role === 'admin') return true
  return user?.id === id
}

export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'editor') return true
  return {
    status: {
      equals: 'published',
    },
  }
}

export const anyone: Access = () => true
