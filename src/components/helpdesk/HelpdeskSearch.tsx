'use client'

import React, { useState, useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'

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
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            type="text"
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-gray-300 focus-visible:ring-[#062963]"
          />
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-gray-500 py-8">No results found.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="mb-4 text-lg font-bold text-[#062963] capitalize">{category}</h3>
              <Accordion type="single" collapsible className="w-full">
                {categoryItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="border-gray-200">
                    <AccordionTrigger className="text-left hover:no-underline hover:text-[#062963]">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none text-gray-600">
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
