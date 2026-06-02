const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NEET Counselling',
    url: SITE_URL,
    logo: '/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
    },
    sameAs: [],
  }
}

export function generateBlogPostingSchema(blog: {
  title?: string
  excerpt?: string
  featuredImage?: { url?: string } | null
  publishedAt?: string
  updatedAt?: string
  author?: { name?: string } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage?.url,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'Admin',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NEET Counselling',
    },
  }
}

export function generateVideoObjectSchema(video: {
  title?: string
  description?: string
  thumbnail?: { url?: string } | null
  publishedAt?: string
  duration?: string
  videoUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail?.url,
    uploadDate: video.publishedAt,
    duration: video.duration,
    contentUrl: video.videoUrl,
  }
}

export function generateFAQSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
