import { cache } from 'react'
import { getPayloadClient } from '../payload'
import type { AboutPage as AboutPageType } from '@/payload-types'

export const getAboutPage = cache(async (): Promise<AboutPageType> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'about-page' })
})
