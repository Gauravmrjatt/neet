'use client'

import React, { useState, useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface HelpdeskItemData {
  id: string
  question: string
  answer: any
  category?: string | null
}

interface HelpdeskSearchProps {
  items: HelpdeskItemData[]
}

function getAnswerText(answer: any): string {
  if (!answer?.root?.children) return ''
  return answer.root.children
    .map((node: any) => {
      if (node.type === 'text') return node.text
      if (node.children) return getAnswerText({ root: node })
      return ''
    })
    .join(' ')
}

export function HelpdeskSearch({ items }: HelpdeskSearchProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        getAnswerText(item.answer).toLowerCase().includes(q)
    )
  }, [items, search])

  const grouped = useMemo(() => {
    const groups: Record<string, HelpdeskItemData[]> = {}
    filtered.forEach((item) => {
      const cat = item.category || 'General'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    return groups
  }, [filtered])

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search help articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border px-4 py-3"
        />
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-muted-foreground">No results found.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="mb-4 text-lg font-semibold capitalize">{category}</h3>
              <Accordion type="single" collapsible className="w-full">
                {categoryItems.map((item, index) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none">
                        {getAnswerText(item.answer) || 'See our documentation for more details.'}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
