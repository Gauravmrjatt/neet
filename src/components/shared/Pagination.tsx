import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  totalPages: number
  currentPage: number
  basePath: string
}

export function Pagination({ totalPages, currentPage, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link href={`${basePath}?page=${currentPage - 1}`}>
          <Button variant="outline" size="sm">
            Previous
          </Button>
        </Link>
      )}

      {pages.map((page) => (
        <Link key={page} href={`${basePath}?page=${page}`}>
          <Button
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            className={cn(page === currentPage && 'pointer-events-none')}
          >
            {page}
          </Button>
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link href={`${basePath}?page=${currentPage + 1}`}>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </Link>
      )}
    </nav>
  )
}
