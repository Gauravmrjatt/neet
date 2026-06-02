import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { seedTestData, cleanupTestData } from '../helpers/seed'

describe('Payload Queries', () => {
  let testData: Awaited<ReturnType<typeof seedTestData>>

  beforeAll(async () => {
    testData = await seedTestData()
  })

  afterAll(async () => {
    await cleanupTestData()
  })

  describe('Blogs', () => {
    it('should fetch published blogs', async () => {
      const { getBlogs } = await import('@/lib/queries/blogs')
      const result = await getBlogs()
      expect(result.docs.length).toBeGreaterThan(0)
      expect(result.docs[0].status).toBe('published')
    })

    it('should fetch blog by slug', async () => {
      const { getBlogBySlug } = await import('@/lib/queries/blogs')
      const blog = await getBlogBySlug('test-blog-post')
      expect(blog).toBeTruthy()
      expect(blog?.title).toBe('Test Blog Post')
    })

    it('should return null for non-existent slug', async () => {
      const { getBlogBySlug } = await import('@/lib/queries/blogs')
      const blog = await getBlogBySlug('non-existent-slug')
      expect(blog).toBeNull()
    })

    it('should fetch recent blogs', async () => {
      const { getRecentBlogs } = await import('@/lib/queries/blogs')
      const result = await getRecentBlogs(5)
      expect(result.docs.length).toBeGreaterThan(0)
    })
  })

  describe('Videos', () => {
    it('should fetch published videos', async () => {
      const { getVideos } = await import('@/lib/queries/videos')
      const result = await getVideos()
      expect(result.docs.length).toBeGreaterThan(0)
      expect(result.docs[0].status).toBe('published')
    })

    it('should fetch video by slug', async () => {
      const { getVideoBySlug } = await import('@/lib/queries/videos')
      const video = await getVideoBySlug('test-video')
      expect(video).toBeTruthy()
      expect(video?.title).toBe('Test Video')
    })

    it('should return null for non-existent video slug', async () => {
      const { getVideoBySlug } = await import('@/lib/queries/videos')
      const video = await getVideoBySlug('non-existent-video')
      expect(video).toBeNull()
    })
  })

  describe('Counselors', () => {
    it('should fetch active counselors', async () => {
      const { getCounselors } = await import('@/lib/queries/counselors')
      const result = await getCounselors()
      expect(result.docs.length).toBeGreaterThan(0)
      expect(result.docs[0].status).toBe('active')
    })

    it('should filter by specialization', async () => {
      const { getCounselors } = await import('@/lib/queries/counselors')
      const result = await getCounselors({ specialization: 'neet' })
      expect(result.docs.length).toBeGreaterThan(0)
    })

    it('should fetch counselor by slug', async () => {
      const { getCounselorBySlug } = await import('@/lib/queries/counselors')
      const counselor = await getCounselorBySlug('dr-test-counselor')
      expect(counselor).toBeTruthy()
      expect(counselor?.name).toBe('Dr. Test Counselor')
    })

    it('should return null for non-existent counselor slug', async () => {
      const { getCounselorBySlug } = await import('@/lib/queries/counselors')
      const counselor = await getCounselorBySlug('non-existent')
      expect(counselor).toBeNull()
    })
  })

  describe('Helpdesk', () => {
    it('should fetch helpdesk items', async () => {
      const { getHelpdeskItems } = await import('@/lib/queries/helpdesk')
      const result = await getHelpdeskItems()
      expect(result.docs.length).toBeGreaterThan(0)
    })

    it('should filter by category', async () => {
      const { getHelpdeskItems } = await import('@/lib/queries/helpdesk')
      const result = await getHelpdeskItems({ category: 'exam' })
      expect(result.docs.length).toBeGreaterThan(0)
    })

    it('should fetch helpdesk categories', async () => {
      const { getHelpdeskCategories } = await import('@/lib/queries/helpdesk')
      const categories = await getHelpdeskCategories()
      expect(categories).toContain('exam')
    })
  })

  describe('Pricing', () => {
    it('should fetch pricing cards', async () => {
      const { getPricingCards } = await import('@/lib/queries/pricing')
      const result = await getPricingCards()
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Globals', () => {
    it('should fetch header global', async () => {
      const { getHeader } = await import('@/lib/queries/globals')
      const header = await getHeader()
      expect(header).toBeTruthy()
    })

    it('should fetch footer global', async () => {
      const { getFooter } = await import('@/lib/queries/globals')
      const footer = await getFooter()
      expect(footer).toBeTruthy()
    })

    it('should fetch site settings', async () => {
      const { getSiteSettings } = await import('@/lib/queries/globals')
      const settings = await getSiteSettings()
      expect(settings).toBeTruthy()
      expect(settings.siteName).toBe('NEET Counselling')
    })
  })
})
