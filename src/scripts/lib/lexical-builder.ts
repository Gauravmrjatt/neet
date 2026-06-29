import { marked } from 'marked'

type LexicalNode = any
type TextNode = any
type ParagraphNode = any
type HeadingNode = any
type ListNode = any
type ListItemNode = any
type LinkNode = any

function t(text: string, format = 0): TextNode {
  return { type: 'text', mode: 'normal', text, style: '', detail: 0, format, version: 1 }
}

function p(...children: LexicalNode[]): ParagraphNode {
  return { type: 'paragraph', format: '', indent: 0, version: 1, children, direction: 'ltr', textFormat: 0, textStyle: '' }
}

function h(tag: 'h1' | 'h2' | 'h3', ...children: LexicalNode[]): HeadingNode {
  return { type: 'heading', tag, format: '', indent: 0, version: 1, children, direction: 'ltr' }
}

function bulletList(...children: LexicalNode[]): ListNode {
  return { type: 'list', listType: 'bullet', format: '', indent: 0, version: 1, children, direction: 'ltr', start: 1 }
}

function li(...children: LexicalNode[]): ListItemNode {
  return { type: 'listitem', format: '', indent: 0, version: 1, children, direction: 'ltr' }
}

function link(url: string, ...children: LexicalNode[]): LinkNode {
  return { type: 'link', format: '', indent: 0, version: 1, fields: { url }, children, direction: 'ltr' }
}

function processInline(tokens: any[], format = 0): LexicalNode[] {
  const result: LexicalNode[] = []
  for (const token of tokens) {
    if (token.type === 'text') result.push(t(token.text, format))
    else if (token.type === 'strong') result.push(...processInline(token.tokens || [], format | 1))
    else if (token.type === 'em') result.push(...processInline(token.tokens || [], format | 2))
    else if (token.type === 'link') result.push(link(token.href || '', ...processInline(token.tokens || [], format)))
    else if (token.type === 'br') result.push({ type: 'linebreak', version: 1 })
    else if (token.type === 'codespan') result.push(t(token.text, format | 4))
  }
  return result
}

function processBlock(token: any): LexicalNode | null {
  switch (token.type) {
    case 'heading': {
      const tag = `h${token.depth}` as 'h1' | 'h2' | 'h3'
      return h(tag, ...processInline(token.tokens || []))
    }
    case 'paragraph': {
      const children = processInline(token.tokens || [])
      if (children.length === 0) return null
      return p(...children)
    }
    case 'list': {
      const items: ListItemNode[] = []
      for (const item of token.items) {
        const inlineNodes = processInline((item.tokens || []).filter((ct: any) => ct.type !== 'list'))
        const childLists = (item.tokens || []).filter((ct: any) => ct.type === 'list')
        const children = [...inlineNodes]
        for (const childList of childLists) {
          const node = processBlock(childList)
          if (node) children.push(node)
        }
        const paraTokens = (item.tokens || []).filter((ct: any) => ct.type === 'paragraph')
        for (const pt of paraTokens) {
          children.push(...processInline(pt.tokens || []))
        }
        items.push(li(...children))
      }
      return token.ordered ? { type: 'list', listType: 'number', format: '', indent: 0, version: 1, children: items, direction: 'ltr', start: 1 } : bulletList(...items)
    }
    case 'code': return p(t(token.text || ''))
    case 'space': case 'hr': return null
    default: return null
  }
}

export function markdownToLexical(md: string) {
  const tokens = marked.lexer(md)
  const children: LexicalNode[] = []
  for (const token of tokens) {
    const node = processBlock(token)
    if (node) children.push(node)
  }
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
      direction: 'ltr' as const,
    },
  }
}
