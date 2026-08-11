import { DefaultNav } from '@payloadcms/next/rsc'
import type { PayloadRequest, ServerProps, VisibleEntities } from 'payload'

import { getPermittedSlugs } from '@/access/permissions'

type NavProps = {
  req?: PayloadRequest
} & ServerProps

/**
 * Filters the admin sidebar to only the collections/globals the current
 * user has access to. Payload's default nav shows every entity to anyone
 * able to reach /admin, relying on `admin.hidden` which has no access to
 * the database. This override evaluates permissions against the freshest
 * user doc and then renders Payload's default nav.
 *
 * Collections are shown when the user can read them. Globals are shown
 * when the user can update them, since their read access is public.
 */
export const PayloadNav = async (props: NavProps) => {
  const { req, visibleEntities } = props

  if (!req) {
    return <DefaultNav {...props} />
  }

  const collections = (await getPermittedSlugs(
    req,
    visibleEntities?.collections ?? [],
    'read',
  )) as VisibleEntities['collections']
  const globals = (await getPermittedSlugs(
    req,
    visibleEntities?.globals ?? [],
    'update',
  )) as VisibleEntities['globals']

  return <DefaultNav {...props} visibleEntities={{ collections, globals }} />
}