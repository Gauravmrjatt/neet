import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { seedTestData, cleanupTestData } from '../helpers/seed'

describe('Authentication', () => {
  let testData: Awaited<ReturnType<typeof seedTestData>>

  beforeAll(async () => {
    testData = await seedTestData()
  })

  afterAll(async () => {
    await cleanupTestData()
  })

  describe('Role Checks', () => {
    it('should identify admin users', async () => {
      const { isAdmin } = await import('@/lib/auth')
      expect(isAdmin(testData.user as any)).toBe(true)
    })

    it('should identify editor users as editor', async () => {
      const { isEditor } = await import('@/lib/auth')
      expect(isEditor(testData.user as any)).toBe(true)
    })

    it('should reject non-admin users for admin check', async () => {
      const { isAdmin } = await import('@/lib/auth')
      const regularUser = { ...testData.user, role: 'user' }
      expect(isAdmin(regularUser as any)).toBe(false)
    })

    it('should reject non-editor users for editor check', async () => {
      const { isEditor } = await import('@/lib/auth')
      const regularUser = { ...testData.user, role: 'user' }
      expect(isEditor(regularUser as any)).toBe(false)
    })

    it('should allow editors through editor check', async () => {
      const { isEditor } = await import('@/lib/auth')
      const editorUser = { ...testData.user, role: 'editor' }
      expect(isEditor(editorUser as any)).toBe(true)
    })
  })
})
