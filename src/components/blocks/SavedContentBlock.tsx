import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { BlockRenderer } from './index'

interface SavedContentBlockProps {
  savedContent: string | { id: string; blocks?: any[]; title?: string } | null
}

export async function SavedContentBlock({ savedContent }: SavedContentBlockProps) {
  if (!savedContent) return null

  let blocks: any[] | null = null

  if (typeof savedContent === 'object' && savedContent.blocks) {
    blocks = savedContent.blocks
  } else if (typeof savedContent === 'string') {
    try {
      const payload = await getPayloadClient()
      const doc = await payload.findByID({
        collection: 'saved-content',
        id: savedContent,
        depth: 1,
      })
      blocks = (doc as any)?.blocks || null
    } catch {
      return null
    }
  }

  if (!blocks || blocks.length === 0) return null

  return <BlockRenderer blocks={blocks} />
}
