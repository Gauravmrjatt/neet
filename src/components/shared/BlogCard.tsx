import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MediaImage } from './MediaImage'
import { formatDate } from '@/lib/utils'

interface BlogCardProps {
  blog: any
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
        {blog.featuredImage && (
          <div className="relative aspect-video">
            <MediaImage media={blog.featuredImage} fill />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={blog.publishedAt}>{formatDate(blog.publishedAt)}</time>
            {blog.categories?.[0] && (
              <Badge variant="secondary">{blog.categories[0]}</Badge>
            )}
          </div>
          <h3 className="text-xl font-semibold line-clamp-2">{blog.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{blog.excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
