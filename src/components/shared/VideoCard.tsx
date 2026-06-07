import { memo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MediaImage } from './MediaImage'
import { Play } from 'lucide-react'

interface VideoCardProps {
  video: any
}

export const VideoCard = memo(function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
        <div className="relative aspect-video">
          <MediaImage media={video.thumbnail} fill />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="w-12 h-12 text-white" />
          </div>
          {video.duration && (
            <Badge className="absolute bottom-2 right-2">{video.duration}</Badge>
          )}
        </div>
        <CardHeader>
          <h3 className="text-lg font-semibold line-clamp-2">{video.title}</h3>
        </CardHeader>
        <CardContent>{video.category && <Badge variant="outline">{video.category}</Badge>}</CardContent>
      </Card>
    </Link>
  )
})
