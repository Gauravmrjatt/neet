import type { Access, PayloadRequest } from 'payload'

export type PermissionOperation = 'create' | 'read' | 'update' | 'delete'

export type PermissionCollectionAccess = {
  slug?: string | null
  create?: boolean | null
  read?: boolean | null
  update?: boolean | null
  delete?: boolean | null
}

export type PermissionsGroup = {
  publish?: boolean | null
  collections?: PermissionCollectionAccess[] | null
}

export type PermissionedUser = {
  id: string | number
  role?: string | null
  permissions?: PermissionsGroup | null
}

/**
 * Collections that were historically gated by `isAdminOrEditor`.
 * The legacy 'editor' fallback only applies to these — sensitive
 * collections (users, subscriptions, transactions, contact-submissions)
 * never fall back so old editors cannot silently gain access to them.
 */
export const LEGACY_CONTENT_SLUGS = [
  'blogs',
  'pages',
  'videos',
  'counselling',
  'counselors',
  'helpdesk',
  'live-counselling',
  'pricing-cards',
  'media',
  'colleges',
  'cutoff-records',
  'seat-matrix',
  'specializations',
  'states',
  'districts',
  'district-content',
  'tehsils',
  'bonds',
  'stipends',
  'saved-content',
]

/**
 * Globals that were historically gated by `isAdminOrEditor` on update.
 * Same legacy-editor fallback semantics as LEGACY_CONTENT_SLUGS.
 */
export const LEGACY_GLOBAL_SLUGS = ['about-page', 'predictor-page', 'page-seo', 'pricing-page']

/**
 * A user is considered "explicitly configured" once the permissions
 * group contains a collections array (even an empty one). Explicitly
 * configured users are granted exactly what is listed — no legacy
 * fallback. Users without any permissions field fall back to the
 * legacy role behavior so existing data is unaffected.
 */
function isExplicitlyConfigured(user: PermissionedUser): boolean {
  return Array.isArray(user.permissions?.collections)
}

/**
 * Payload's `req.user` is decoded from the JWT, which never contains
 * the permissions group (they change frequently and would bloat the
 * token). Access checks must therefore refetch the freshest user doc
 * from the database before evaluating permissions.
 */
async function freshUser(req: PayloadRequest): Promise<PermissionedUser | null> {
  if (!req.user?.id) return null
  try {
    const user = await req.payload.findByID({
      collection: 'users',
      id: req.user.id,
      depth: 0,
      overrideAccess: true,
    })
    return user as unknown as PermissionedUser
  } catch {
    return req.user as unknown as PermissionedUser
  }
}

export function userHasPermission(
  user: PermissionedUser | null,
  collectionSlug: string,
  operation: PermissionOperation,
): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  if (isExplicitlyConfigured(user)) {
    return (
      user.permissions?.collections?.some(
        (entry) => entry.slug === collectionSlug && entry[operation] === true,
      ) ?? false
    )
  }
  // Legacy fallback: pre-existing 'editor' users keep full content access
  // to the collections/globals they could manage before, and nothing else.
  return (
    user.role === 'editor' &&
    (LEGACY_CONTENT_SLUGS.includes(collectionSlug) || LEGACY_GLOBAL_SLUGS.includes(collectionSlug))
  )
}

export function userCanPublish(user: PermissionedUser | null): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  if (isExplicitlyConfigured(user)) return user.permissions?.publish === true
  // Legacy fallback: pre-existing 'editor' users could publish
  return user.role === 'editor'
}

export async function hasPermission(
  req: PayloadRequest,
  collectionSlug: string,
  operation: PermissionOperation,
): Promise<boolean> {
  return userHasPermission(await freshUser(req), collectionSlug, operation)
}

export async function canPublish(req: PayloadRequest): Promise<boolean> {
  return userCanPublish(await freshUser(req))
}

export const can = (collectionSlug: string): Record<PermissionOperation, Access> => ({
  create: async ({ req }) => hasPermission(req, collectionSlug, 'create'),
  read: async ({ req }) => hasPermission(req, collectionSlug, 'read'),
  update: async ({ req }) => hasPermission(req, collectionSlug, 'update'),
  delete: async ({ req }) => hasPermission(req, collectionSlug, 'delete'),
})

/**
 * Published docs are readable by everyone; drafts are only visible to
 * users with explicit read permission on the collection (admin included).
 */
export const publishedOrAdmin = (collectionSlug: string): Access => async ({ req }) => {
  if (await hasPermission(req, collectionSlug, 'read')) return true
  return {
    status: {
      equals: 'published',
    },
  }
}

/**
 * For collections whose visibility is gated by a custom status value
 * (e.g. counselors 'active', helpdesk 'active') and that block anonymous
 * reads. Authenticated users with read permission see everything,
 * everyone else only the matching status. `allowAnonymous` mirrors each
 * collection's existing behavior: when false, unauthenticated requests
 * are denied entirely.
 */
export const statusFilteredOrAdmin = (
  collectionSlug: string,
  statusValue: string,
  allowAnonymous = true,
): Access => async ({ req }) => {
  if (!req.user) return allowAnonymous
  if (await hasPermission(req, collectionSlug, 'read')) return true
  return {
    status: {
      equals: statusValue,
    },
  }
}

/**
 * Returns the subset of the given slugs the current user is allowed to
 * perform `operation` on. Fetches the user from the DB once (single
 * query) and evaluates against every slug, so it is safe to use for
 * admin nav filtering. Admins always get the full list.
 */
export async function getPermittedSlugs(
  req: PayloadRequest,
  slugs: string[],
  operation: PermissionOperation,
): Promise<string[]> {
  const user = await freshUser(req)
  return slugs.filter((slug) => userHasPermission(user, slug, operation))
}

export async function getReadableCollectionSlugs(
  req: PayloadRequest,
  slugs: string[],
): Promise<string[]> {
  return getPermittedSlugs(req, slugs, 'read')
}