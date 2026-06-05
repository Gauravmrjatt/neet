import { getPayloadClient } from '../payload'
import type { AboutPage as AboutPageType } from '@/payload-types'

export async function getAboutPage(): Promise<AboutPageType> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'about-page' })
}
