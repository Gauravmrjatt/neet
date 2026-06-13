import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

const categoryLabels: Record<string, string> = {
  'ug-counselling': 'NEET UG',
  'pg-counselling': 'NEET PG',
  'state-counselling': 'State',
  abroad: 'MBBS Abroad',
  guide: 'Guide',
}

interface CounsellingCardProps {
  post: any
}

export function CounsellingCard({ post }: CounsellingCardProps) {
  return (
    <Link href={`/counselling/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
        {post.featuredImage && (
          <div className="relative aspect-video overflow-hidden">
            {typeof post.featuredImage === 'object' && post.featuredImage?.url && (
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.category && (
              <Badge variant="secondary">{categoryLabels[post.category] || post.category}</Badge>
            )}
          </div>
          <h3 className="text-lg font-bold text-primary-navy line-clamp-2 group-hover:text-button-gold-hover transition-colors">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
