'use client'

import React, { useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

interface HelpdeskItemData {
  id: string
  question: string
  answer: any
  category?: string | null
}

interface HelpdeskSearchProps {
  items: HelpdeskItemData[]
  search?: string
  page?: number
  totalPages?: number
  totalDocs?: number
  contactEmail?: string | null
  phone?: string | null
  address?: string | null
}

export function HelpdeskSearch({
  items,
  search = '',
  page = 1,
  totalPages = 1,
  totalDocs = 0,
  contactEmail,
  phone,
  address,
}: HelpdeskSearchProps) {
  const router = useRouter()

  const grouped = useMemo(() => {
    const groups: Record<string, HelpdeskItemData[]> = {}
    items.forEach((item) => {
      const cat = item.category || 'General'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    return groups
  }, [items])

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const q = (formData.get('q') as string) || ''
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      params.set('page', '1')
      router.push(`?${params.toString()}`)
    },
    [router],
  )

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search help articles..."
            className="pl-10"
          />
        </div>
      </form>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No results found.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="mb-4 text-lg font-bold text-primary-navy capitalize">{category}</h3>
              <Accordion type="single" collapsible className="w-full">
                {categoryItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="border-border">
                    <AccordionTrigger className="text-left hover:no-underline hover:text-primary-navy">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        {item.answer?.root?.children
                          ?.map((n: any) =>
                            n.children
                              ?.map((c: any) => c.text)
                              .filter(Boolean)
                              .join(' '),
                          )
                          .filter(Boolean)
                          .join(' ') || 'See our documentation for more details.'}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => {
              const params = new URLSearchParams()
              if (search) params.set('q', search)
              params.set('page', String(page - 1))
              router.push(`?${params.toString()}`)
            }}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({totalDocs} articles)
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => {
              const params = new URLSearchParams()
              if (search) params.set('q', search)
              params.set('page', String(page + 1))
              router.push(`?${params.toString()}`)
            }}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {(contactEmail || phone || address) && (
        <div className="mt-12 rounded-lg border border-border bg-muted/50 p-6">
          <h3 className="text-lg font-bold text-primary-navy">Contact Our Admins</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Still have questions? Reach out to our team directly.
          </p>
          <div className="mt-4 space-y-4">
            {contactEmail && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-navy/10 text-primary-navy">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <a href={`mailto:${contactEmail}`} className="text-sm font-semibold text-primary-navy hover:underline">
                    {contactEmail}
                  </a>
                </div>
              </div>
            )}
            {phone && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-navy/10 text-primary-navy">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Phone</p>
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-sm font-semibold text-primary-navy hover:underline">
                    {phone}
                  </a>
                </div>
              </div>
            )}
            {address && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-navy/10 text-primary-navy">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Address</p>
                  <p className="text-sm font-semibold text-primary-navy">{address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t find what you&apos;re looking for?
        </p>
        <Link
          href="/contact"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-navy hover:underline"
        >
          Send us your feedback
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
