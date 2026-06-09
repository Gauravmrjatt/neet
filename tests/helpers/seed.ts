import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export async function seedTestData() {
  const payload = await getPayload({ config })

  const user = await payload.create({
    collection: 'users',
    data: {
      email: 'test@example.com',
      password: 'testpassword123',
      name: 'Test User',
      role: 'admin',
    },
  })

  const blog = await payload.create({
    collection: 'blogs',
    data: {
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      content: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Test content', version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      excerpt: 'Test excerpt',
      status: 'published',
      publishedAt: new Date().toISOString(),
      author: user.id,
    },
  })

  const video = await payload.create({
    collection: 'videos',
    data: {
      title: 'Test Video',
      slug: 'test-video',
      videoUrl: 'https://www.youtube.com/watch?v=test',
      description: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Test video description', version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  const counselor = await payload.create({
    collection: 'counselors',
    data: {
      name: 'Dr. Test Counselor',
      slug: 'dr-test-counselor',
      designation: 'Senior Counselor',
      bio: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Test bio', version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      specializations: [{ specialization: 'neet' }, { specialization: 'jee' }],
      experience: 10,
      status: 'active',
      email: 'counselor@test.com',
      phone: '+91-9876543210',
    },
  })

  const pricingCard = await payload.create({
    collection: 'pricing-cards',
    data: {
      planName: 'Basic Plan',
      price: '₹999',
      priceInPaise: 99900,
      predictionCredits: 1,
      features: [{ feature: 'Feature 1' }, { feature: 'Feature 2' }],
      description: 'Basic plan description',
      popular: false,
      ctaText: 'Get Started',
      ctaLink: '/contact',
      order: 1,
    },
  })

  const helpdesk = await payload.create({
    collection: 'helpdesk',
    data: {
      question: 'What is NEET?',
      answer: {
        root: {
          type: 'root',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'NEET is a national exam', version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: 'exam',
      order: 1,
      status: 'active',
    },
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navigation: [
        { label: 'Home', link: '/' },
        { label: 'Blog', link: '/blog' },
      ],
      ctaButton: { text: 'Contact Us', link: '/contact' },
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        { title: 'Quick Links', links: [{ label: 'About', url: '/about' }] },
      ],
      copyright: '© 2025 NEET Counselling',
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'NEET Counselling',
      siteDescription: 'Expert NEET counselling services',
      contactEmail: 'info@test.com',
      phone: '+91-9876543210',
      address: 'Test Address, India',
    },
  })

  return { user, blog, video, counselor, pricingCard, helpdesk }
}

export async function cleanupTestData() {
  const payload = await getPayload({ config })

  await payload.delete({ collection: 'blogs', where: {} })
  await payload.delete({ collection: 'videos', where: {} })
  await payload.delete({ collection: 'counselors', where: {} })
  await payload.delete({ collection: 'pricing-cards', where: {} })
  await payload.delete({ collection: 'helpdesk', where: {} })
  await payload.delete({ collection: 'users', where: {} })
}
