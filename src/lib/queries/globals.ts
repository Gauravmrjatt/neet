import { getPayloadClient } from '../payload'
import type { Header, Footer, SiteSetting, HomePageSeo } from '@/payload-types'

export async function getHeader(): Promise<Header> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'header' })
}

export async function getFooter(): Promise<Footer> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'footer' })
}

export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings' })
}

export async function getHomePageSEO(): Promise<HomePageSeo> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home-page-seo' })
}
