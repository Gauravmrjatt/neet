import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  totalPages: number
  currentPage: number
  basePath: string
}

function getPageWindow(totalPages: number, currentPage: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []
  const siblings = 1
  const range = siblings * 2 + 1
  const start = Math.max(2, currentPage - siblings)
  const end = Math.min(totalPages - 1, currentPage + siblings)

  pages.push(1)
  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push('ellipsis')
  if (totalPages > 1) pages.push(totalPages)

  return pages
}

export function Pagination({ totalPages, currentPage, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const window = getPageWindow(totalPages, currentPage)

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      {currentPage > 1 && (
        <Link href={`${basePath}?page=${currentPage - 1}`}>
          <Button variant="outline" size="sm">
            Previous
          </Button>
        </Link>
      )}

      {window.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-foreground/40 select-none">
            &hellip;
          </span>
        ) : (
          <Link key={page} href={`${basePath}?page=${page}`}>
            <Button
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              className={cn(page === currentPage && 'pointer-events-none', 'min-w-[36px]')}
            >
              {page}
            </Button>
          </Link>
        )
      )}

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
