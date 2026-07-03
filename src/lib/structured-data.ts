const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export function generateOrganizationSchema(
  siteName = 'NEET Counselling',
  sameAs: string[] = [],
  phone?: string,
  logoUrl?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: SITE_URL,
    ...(logoUrl ? { logo: logoUrl } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone || '+91-9509698208',
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
  authorFallback = 'Admin',
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
      name: blog.author?.name || authorFallback,
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

export function generateItemListSchema(items: { url: string; name: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
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
  logoUrl,
}: {
  name?: string
  description?: string
  telephone?: string
  ratingValue?: string
  reviewCount?: string
  logoUrl?: string
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name,
    ...(logoUrl ? { image: logoUrl } : { image: `${SITE_URL}/logo.png` }),
    description,
    url: SITE_URL,
    ...(telephone ? { telephone } : {}),
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
  url,
  opens = '09:00',
  closes = '19:00',
  days,
  logoUrl,
}: {
  name?: string
  telephone?: string
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  latitude?: number
  longitude?: number
  url?: string
  opens?: string
  closes?: string
  days?: string[]
  logoUrl?: string
} = {}) {
  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    ...(logoUrl ? { image: logoUrl } : { image: `${SITE_URL}/logo.png` }),
    url: url || SITE_URL,
    ...(telephone ? { telephone } : {}),
    ...(streetAddress || addressLocality || addressRegion || postalCode
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
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens,
      closes,
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
  authorFallback = 'Admin',
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
  authorFallback?: string
}) {
  const author: Record<string, string> = {
    '@type': 'Person',
    name: authorName || authorFallback,
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

export function generateEducationalOccupationalCredentialSchema(credentialName = 'MBBS Degree') {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: credentialName,
    educationalLevel: 'Undergraduate',
    url: SITE_URL,
  }
}

export function generateCollegeOrUniversitySchema({
  name,
  description,
  url,
  image,
  city,
  state,
  courses,
  established,
  ranking,
}: {
  name?: string
  description?: string
  url?: string
  image?: string
  city?: string
  state?: string
  courses?: string[]
  established?: number
  ranking?: number
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: name || 'Medical College',
    url: url || SITE_URL,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(established ? { foundingDate: String(established) } : {}),
    ...(ranking ? { globalRanking: { '@type': 'Ranking', rankingValue: String(ranking) } } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(city ? { addressLocality: city } : {}),
      ...(state ? { addressRegion: state } : {}),
      addressCountry: 'IN',
    },
  }
  if (courses && courses.length > 0) {
    schema.hasCourse = courses.map((course) => ({
      '@type': 'Course',
      name: course,
      courseCode: course,
      educationalLevel: 'Undergraduate',
      numberOfCredits: typeof course === 'string' && course === 'MBBS' ? '5.5 Years' : '4.5 Years',
    }))
  }
  return schema
}

export function generateWebSiteSchema({
  name = 'NEET Counselling',
  url,
  description,
  searchActionUrl,
}: {
  name?: string
  url?: string
  description?: string
  searchActionUrl?: string
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: url || SITE_URL,
    ...(description ? { description } : {}),
    ...(searchActionUrl
      ? {
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: searchActionUrl,
            },
            'query-input': 'required name=search_term_string',
          },
        }
      : {}),
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
