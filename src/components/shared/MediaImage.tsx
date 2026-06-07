import { memo } from 'react'
import Image from 'next/image'
import { getMediaUrl, getMediaAlt } from '@/lib/media'
import { cn } from '@/lib/utils'

interface MediaImageProps {
  media: any
  alt?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
}

export const MediaImage = memo(function MediaImage({
  media,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className,
  priority = false,
}: MediaImageProps) {
  const src = getMediaUrl(media)
  const imageAlt = alt || getMediaAlt(media)

  if (!src) return null

  if (fill) {
    return (
      <Image
        src={src}
        alt={imageAlt}
        fill
        sizes={sizes}
        className={cn('object-cover', className)}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={imageAlt}
      width={width || media?.width || 800}
      height={height || media?.height || 600}
      sizes={sizes}
      className={cn('object-cover', className)}
      priority={priority}
    />
  )
})
