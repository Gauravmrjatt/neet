import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import type { User } from '@/payload-types'

export async function getCurrentUser(): Promise<(User & { role?: string }) | null> {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  return (user as User & { role?: string }) ?? null
}

export async function requireAuth(): Promise<User & { role?: string }> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requireRole(role: 'admin' | 'editor' | 'user') {
  const user = await requireAuth()
  if (user.role !== role && user.role !== 'admin') throw new Error('Forbidden')
  return user
}

export async function requireAdmin() {
  return requireRole('admin')
}

export async function requireEditor() {
  const user = await requireAuth()
  if (!['admin', 'editor'].includes(user.role ?? '')) throw new Error('Forbidden')
  return user
}

export function isAdmin(user: User & { role?: string }): boolean {
  return user?.role === 'admin'
}

export function isEditor(user: User & { role?: string }): boolean {
  return ['admin', 'editor'].includes(user?.role ?? '')
}
