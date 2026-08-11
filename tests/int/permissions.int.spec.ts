import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import {
  userHasPermission,
  userCanPublish,
  getPermittedSlugs,
  LEGACY_CONTENT_SLUGS,
  LEGACY_GLOBAL_SLUGS,
} from '../../src/access/permissions'

describe('Content permissions', () => {
  let payload: Awaited<ReturnType<typeof getPayload>>

  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  const legacyEditor = { id: '1', role: 'editor' }
  const admin = { id: '2', role: 'admin' }
  const configuredEditor = {
    id: '3',
    role: 'editor',
    permissions: {
      publish: false,
      collections: [
        { slug: 'blogs', create: true, read: true, update: true, delete: false },
        { slug: 'subscriptions', read: true },
      ],
    },
  }

  describe('userHasPermission', () => {
    it('grants everything to admins', () => {
      expect(userHasPermission(admin, 'blogs', 'delete')).toBe(true)
      expect(userHasPermission(admin, 'users', 'read')).toBe(true)
      expect(userHasPermission(admin, 'transactions', 'update')).toBe(true)
    })

    it('legacy editor keeps full access to content collections only', () => {
      expect(userHasPermission(legacyEditor, 'blogs', 'update')).toBe(true)
      expect(userHasPermission(legacyEditor, 'videos', 'delete')).toBe(true)
      expect(userHasPermission(legacyEditor, 'pages', 'create')).toBe(true)
      for (const slug of LEGACY_CONTENT_SLUGS) {
        expect(userHasPermission(legacyEditor, slug, 'read')).toBe(true)
      }
    })

    it('legacy editor is denied on sensitive collections', () => {
      expect(userHasPermission(legacyEditor, 'subscriptions', 'read')).toBe(false)
      expect(userHasPermission(legacyEditor, 'transactions', 'read')).toBe(false)
      expect(userHasPermission(legacyEditor, 'contact-submissions', 'read')).toBe(false)
      expect(userHasPermission(legacyEditor, 'users', 'read')).toBe(false)
    })

    it('legacy editor keeps update access on legacy globals only', () => {
      for (const slug of LEGACY_GLOBAL_SLUGS) {
        expect(userHasPermission(legacyEditor, slug, 'update')).toBe(true)
      }
      expect(userHasPermission(legacyEditor, 'header', 'update')).toBe(false)
      expect(userHasPermission(legacyEditor, 'site-settings', 'update')).toBe(false)
      expect(userHasPermission(legacyEditor, 'why-choose-us', 'update')).toBe(false)
    })

    it('globals require an explicit grant once configured', () => {
      expect(userHasPermission(configuredEditor, 'about-page', 'update')).toBe(false)
      expect(userHasPermission(configuredEditor, 'pricing-page', 'update')).toBe(false)
      expect(
        userHasPermission(
          {
            id: '5',
            role: 'editor',
            permissions: {
              publish: false,
              collections: [{ slug: 'header', update: true }],
            },
          },
          'header',
          'update',
        ),
      ).toBe(true)
    })

    it('configured editor gets exactly what is granted', () => {
      expect(userHasPermission(configuredEditor, 'blogs', 'create')).toBe(true)
      expect(userHasPermission(configuredEditor, 'blogs', 'read')).toBe(true)
      expect(userHasPermission(configuredEditor, 'blogs', 'delete')).toBe(false)
      expect(userHasPermission(configuredEditor, 'videos', 'read')).toBe(false)
      expect(userHasPermission(configuredEditor, 'pages', 'create')).toBe(false)
      expect(userHasPermission(configuredEditor, 'subscriptions', 'read')).toBe(true)
      expect(userHasPermission(configuredEditor, 'subscriptions', 'update')).toBe(false)
    })

    it('anonymous users are denied', () => {
      expect(userHasPermission(null, 'blogs', 'read')).toBe(false)
    })
  })

  describe('userCanPublish', () => {
    it('admin and legacy editor can publish, configured editor only with publish flag', () => {
      expect(userCanPublish(admin)).toBe(true)
      expect(userCanPublish(legacyEditor)).toBe(true)
      expect(userCanPublish(configuredEditor)).toBe(false)
      expect(
        userCanPublish({
          id: '4',
          role: 'editor',
          permissions: { publish: true, collections: [{ slug: 'blogs', read: true }] },
        }),
      ).toBe(true)
    })
  })

  describe('getPermittedSlugs (nav filtering)', () => {
    it('fetches permissions from the database, not the JWT', async () => {
      const user = await payload.create({
        collection: 'users',
        data: {
          email: `permtest-${Date.now()}@example.com`,
          password: 'testpassword123',
          name: 'Perm Test',
          role: 'editor',
          permissions: {
            publish: false,
            collections: [{ slug: 'blogs', read: true, create: true, update: true }],
          },
        },
      })

      try {
        const allSlugs = [...LEGACY_CONTENT_SLUGS, 'subscriptions', 'transactions', 'users']
        const req = { user: { id: user.id }, payload } as any

        const readable = await getPermittedSlugs(req, allSlugs, 'read')
        expect(readable).toEqual(['blogs'])

        const globals = await getPermittedSlugs(req, LEGACY_GLOBAL_SLUGS, 'update')
        expect(globals).toEqual([])

        const adminReq = {
          user: { id: user.id, role: 'admin' },
          payload,
        } as any
        await payload.update({
          collection: 'users',
          id: user.id,
          data: { role: 'admin' },
          user: { id: user.id, role: 'admin', collection: 'users' } as any,
          overrideAccess: true,
        })
        const adminReadable = await getPermittedSlugs(adminReq, allSlugs, 'read')
        expect(adminReadable).toEqual(allSlugs)
        const adminGlobals = await getPermittedSlugs(adminReq, LEGACY_GLOBAL_SLUGS, 'update')
        expect(adminGlobals).toEqual(LEGACY_GLOBAL_SLUGS)
      } finally {
        await payload.delete({ collection: 'users', id: user.id })
      }
    })
  })
})