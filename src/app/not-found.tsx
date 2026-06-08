import React from 'react'
import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center">
      <Container className="text-center">
        <p className="glass-pill mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm">
          404 — Lost in the corridor
        </p>
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-primary-navy tracking-tight">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed">
          The page you are looking for does not exist or has been moved. Let us point
          you back in the right direction.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-button-gold hover:bg-button-gold-hover text-primary-navy font-bold"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Go Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/blog">
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              Browse Blog
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}
