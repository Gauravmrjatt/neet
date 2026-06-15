import { getPageSeo } from '@/lib/queries/globals'

interface PageSeoEntry {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: { url?: string } | null
  breadcrumbLabel?: string | null
  keywords?: string[]
  noIndex?: boolean | null
}

export async function getPageSeoByPath(path: string): Promise<PageSeoEntry | null> {
  try {
    const data = await getPageSeo()
    const entry = (data as any)?.pages?.find((p: any) => p.page === path)
    if (!entry) return null
    return {
      metaTitle: entry.metaTitle || null,
      metaDescription: entry.metaDescription || null,
      ogImage: entry.ogImage ? { url: (entry.ogImage as any)?.url } : null,
      breadcrumbLabel: entry.breadcrumbLabel || null,
      keywords: entry.keywords?.map((k: any) => k.keyword).filter(Boolean) || undefined,
      noIndex: entry.noIndex || null,
    }
  } catch {
    return null
  }
}
