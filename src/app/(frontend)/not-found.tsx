import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center">
      <Container className="text-center">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Go Home
          </Link>
        </div>
      </Container>
    </section>
  )
}
