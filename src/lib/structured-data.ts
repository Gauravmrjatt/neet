const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export function generateOrganizationSchema(siteName = 'NEET Counselling', sameAs: string[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: SITE_URL,
    logo: '/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
    },
    sameAs,
  }
}

export function generateBlogPostingSchema(
  blog: {
    title?: string
    excerpt?: string
    featuredImage?: { url?: string } | null
    publishedAt?: string
    updatedAt?: string
    author?: { name?: string } | null
  },
  siteName = 'NEET Counselling',
) {
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
      name: siteName,
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

export function generateProfessionalServiceSchema({
  name = 'NEET Counselling',
  description = 'Expert NEET counselling services for MBBS, BDS, and medical admission guidance',
  telephone,
  ratingValue = '4.8',
  reviewCount = '17000',
}: {
  name?: string
  description?: string
  telephone?: string
  ratingValue?: string
  reviewCount?: string
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name,
    image: `${SITE_URL}/logo.png`,
    description,
    url: SITE_URL,
    telephone,
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
    },
  }
}

export function generateHowToSchema(steps: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Choose the Best NEET Counselor',
    description: 'Step-by-step guide to finding the right NEET counselling expert',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

export function generateLocalBusinessSchema({
  name = 'NEET Counselling',
  telephone,
  streetAddress,
  addressLocality,
  addressRegion,
  postalCode,
  latitude,
  longitude,
}: {
  name?: string
  telephone?: string
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  latitude?: number
  longitude?: number
} = {}) {
  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    ...(telephone ? { telephone } : {}),
    ...((streetAddress || addressLocality || addressRegion || postalCode)
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(streetAddress ? { streetAddress } : {}),
            ...(addressLocality ? { addressLocality } : {}),
            ...(addressRegion ? { addressRegion } : {}),
            ...(postalCode ? { postalCode } : {}),
            addressCountry: 'IN',
          },
        }
      : {}),
    ...(latitude && longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude,
            longitude,
          },
        }
      : {}),
    ...{
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    },
  }

  return result
}

export function generateServiceSchema({
  serviceType = 'NEET Counselling',
  providerName = 'NEET Counselling',
  areaServed = 'India',
  offers,
}: {
  serviceType?: string
  providerName?: string
  areaServed?: string
  offers?: { name: string; description?: string; price?: string }[]
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: {
      '@type': 'Organization',
      name: providerName,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
    ...(offers
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${serviceType} Services`,
            itemListElement: offers.map((offer) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: offer.name,
                description: offer.description,
              },
            })),
          },
        }
      : {}),
  }
}

export function generateArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  publisherName = 'NEET Counselling',
  publisherLogo,
}: {
  title?: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  authorName?: string
  authorUrl?: string
  publisherName?: string
  publisherLogo?: string
}) {
  const author: Record<string, string> = {
    '@type': 'Person',
    name: authorName || 'Admin',
  }
  if (authorUrl) author.url = authorUrl

  const publisher: Record<string, unknown> = {
    '@type': 'Organization',
    name: publisherName,
  }
  if (publisherLogo) {
    publisher.logo = {
      '@type': 'ImageObject',
      url: publisherLogo,
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author,
    publisher,
  }
}

export function generateEducationalOccupationalCredentialSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: 'MBBS Degree',
    educationalLevel: 'Undergraduate',
    url: SITE_URL,
  }
}

export function generateWebApplicationSchema({
  name = 'NEET College Predictor',
  description = 'Predict your medical college chances based on NEET rank',
  operatingSystem = 'Web',
  applicationCategory = 'EducationalApplication',
}: {
  name?: string
  description?: string
  operatingSystem?: string
  applicationCategory?: string
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    operatingSystem,
    applicationCategory,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  }
}
