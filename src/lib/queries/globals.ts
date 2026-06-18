import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { Header, Footer, SiteSetting, HomePageSeo, VideoCategory } from '@/payload-types'

export const getHeader = cache(async (): Promise<Header> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'header' })
})

export const getFooter = cache(async (): Promise<Footer> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'footer' })
})

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings' })
})

export const getHomePageSEO = cache(async (): Promise<HomePageSeo> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home-page-seo' })
})

export const getVideoCategories = cache(async (): Promise<VideoCategory> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'video-categories' })
})

export const getPredictorPage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'predictor-page' })
})

export const getPricingPage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'pricing-page' })
})

export const getWhyChooseUs = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'why-choose-us' })
})

export const getPageSeo = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'page-seo' })
})

export const getNewsTicker = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'news-ticker' })
})

export const getTestimonials = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'testimonials' })
})
