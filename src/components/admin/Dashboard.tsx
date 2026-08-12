import { DefaultDashboard } from '@payloadcms/next/views'
import { EntityVisibilityProvider } from '@payloadcms/ui'
import { getGlobalData } from '@payloadcms/ui/shared'
import type {
  AdminViewServerProps,
  CollectionSlug,
  GlobalSlug,
  VisibleEntities,
} from 'payload'

import { getPermittedSlugs } from '@/access/permissions'

/**
 * Filters the admin homepage (dashboard cards) to only the collections
 * the current user has permission to read. Payload renders the same
 * cards to everyone able to reach /admin because public collections
 * report `read: true` in the access endpoint and `admin.hidden` has no
 * database access. This override re-provides the client entity
 * visibility context with permission-filtered slugs and then renders
 * Payload's default dashboard.
 */
export const PermissionAwareDashboard = async (props: AdminViewServerProps) => {
  const { req, visibleEntities: serverVisibleEntities } = props.initPageResult

  const collections = req
    ? ((await getPermittedSlugs(req, serverVisibleEntities?.collections ?? [], 'read')) as VisibleEntities['collections'])
    : (serverVisibleEntities?.collections ?? [])

  const globalData = req ? await getGlobalData(req) : []

  return (
    <EntityVisibilityProvider
      visibleEntities={{
        collections: collections as CollectionSlug[],
        globals: (serverVisibleEntities?.globals ?? []) as GlobalSlug[],
      }}
    >
      <DefaultDashboard
        {...props}
        globalData={globalData}
        locale={props.initPageResult.locale as NonNullable<AdminViewServerProps['initPageResult']['locale']>}
        viewType="dashboard"
      />
    </EntityVisibilityProvider>
  )
}