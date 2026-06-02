export function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media.url || ''
}

export function getMediaAlt(media: any, fallback = ''): string {
  if (!media) return fallback
  if (typeof media === 'string') return fallback
  return media.alt || fallback
}

export function getMediaSizes(media: any) {
  return {
    url: media?.url || '',
    width: media?.width || 0,
    height: media?.height || 0,
  }
}
