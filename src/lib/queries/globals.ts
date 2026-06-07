import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { Header, Footer, SiteSetting, HomePageSeo } from '@/payload-types'

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
