import React from 'react'

interface RichTextProps {
  content: any
  className?: string
  maxHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true
  try {
    const parsed = new URL(trimmed)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

function safeHref(url: string | null | undefined): string {
  return isSafeUrl(url) ? (url as string) : '#'
}

function serializeLexical(node: any, maxHeadingLevel?: number): React.ReactNode {
  if (!node) return null

  if (node.type === 'text') {
    let text: React.ReactNode = node.text
    if (node.format & 1) text = <strong>{text}</strong>
    if (node.format & 2) text = <em>{text}</em>
    if (node.format & 8) text = <u>{text}</u>
    if (node.format & 16) text = <s>{text}</s>
    if (node.format & 4) text = <code className="rounded bg-muted px-1">{text}</code>
    return text
  }

  const children = node.children?.map((child: any, i: number) => (
    <React.Fragment key={i}>{serializeLexical(child, maxHeadingLevel)}</React.Fragment>
  ))

  switch (node.type) {
    case 'root':
      return <>{children}</>
    case 'paragraph':
      return <p>{children}</p>
    case 'heading': {
      let level = parseInt(node.tag?.replace('h', '') || '2', 10)
      if (maxHeadingLevel && level < maxHeadingLevel) {
        level = maxHeadingLevel
      }
      if (level === 1) return <h1>{children}</h1>
      if (level === 2) return <h2>{children}</h2>
      if (level === 3) return <h3>{children}</h3>
      if (level === 4) return <h4>{children}</h4>
      if (level === 5) return <h5>{children}</h5>
      if (level === 6) return <h6>{children}</h6>
      return <h2>{children}</h2>
    }
    case 'list':
      if (node.listType === 'number') return <ol>{children}</ol>
      return <ul>{children}</ul>
    case 'listitem':
      return <li>{children}</li>
    case 'quote':
      return <blockquote>{children}</blockquote>
    case 'link':
      return <a href={safeHref(node.fields?.url)} className="text-primary underline">{children}</a>
    case 'linebreak':
      return <br />
    case 'upload':
      if (node.value?.url) {
        return <img src={node.value.url} alt={node.value.alt || ''} className="rounded-lg" />
      }
      return null
    default:
      return <>{children}</>
  }
}

export function RichText({ content, className, maxHeadingLevel }: RichTextProps) {
  if (!content?.root?.children) return null

  return (
    <div className={className}>
      {serializeLexical(content.root, maxHeadingLevel)}
    </div>
  )
}
