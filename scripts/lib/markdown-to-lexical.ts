import { marked } from 'marked'
import type { LexicalNode, LexicalRoot, TextNode, ParagraphNode, HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode, LinebreakNode, TableNode, TableRowNode, TableCellNode } from './types.js'

type MarkedToken = any

function t(text: string, format = 0): TextNode {
  return { type: 'text', mode: 'normal', text, style: '', detail: 0, format, version: 1 }
}

function p(...children: LexicalNode[]): ParagraphNode {
  return { type: 'paragraph', format: '', indent: 0, version: 1, children, direction: 'ltr', textFormat: 0, textStyle: '' }
}

function h(tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', ...children: LexicalNode[]): HeadingNode {
  return { type: 'heading', tag, format: '', indent: 0, version: 1, children, direction: 'ltr' }
}

function bulletList(...children: LexicalNode[]): ListNode {
  return { type: 'list', listType: 'bullet', format: '', indent: 0, version: 1, children, direction: 'ltr', start: 1 }
}

function numberList(...children: LexicalNode[]): ListNode {
  return { type: 'list', listType: 'number', format: '', indent: 0, version: 1, children, direction: 'ltr', start: 1 }
}

function li(...children: LexicalNode[]): ListItemNode {
  return { type: 'listitem', format: '', indent: 0, version: 1, children, direction: 'ltr' }
}

function quote(...children: LexicalNode[]): QuoteNode {
  return { type: 'quote', format: '', indent: 0, version: 1, children, direction: 'ltr' }
}

function link(url: string, ...children: LexicalNode[]): LinkNode {
  return { type: 'link', format: '', indent: 0, version: 1, fields: { url }, children, direction: 'ltr' }
}

function lb(): LinebreakNode {
  return { type: 'linebreak', version: 1 }
}

function tableNode(...children: TableRowNode[]): TableNode {
  return { type: 'table', format: '', indent: 0, version: 1, children, direction: 'ltr' }
}

function tableRow(...children: TableCellNode[]): TableRowNode {
  return { type: 'tablerow', format: '', indent: 0, version: 1, children, direction: 'ltr' }
}

function tableCell(headerState: number, ...children: LexicalNode[]): TableCellNode {
  const cellChildren = children.length > 0 ? [p(...children)] : []
  return { type: 'tablecell', format: '', indent: 0, version: 1, children: cellChildren, direction: 'ltr', headerState }
}

function rewriteUrl(url: string): string {
  const domainPattern = /^https?:\/\/(?:www\.)?neetcounselors\.com/i
  if (domainPattern.test(url)) {
    const path = url.replace(domainPattern, '')
    return path || '/'
  }
  return url
}

function processInline(tokens: MarkedToken[], formatBitmask = 0): LexicalNode[] {
  const result: LexicalNode[] = []

  for (const token of tokens) {
    if (token.type === 'text') {
      result.push(t((token as any).text, formatBitmask))
    } else if (token.type === 'strong') {
      result.push(...processInline((token as any).tokens || [], formatBitmask | 1))
    } else if (token.type === 'em') {
      result.push(...processInline((token as any).tokens || [], formatBitmask | 2))
    } else if (token.type === 'del') {
      result.push(...processInline((token as any).tokens || [], formatBitmask | 16))
    } else if (token.type === 'codespan') {
      result.push(t((token as any).text, formatBitmask | 4))
    } else if (token.type === 'link') {
      const t = token as any
      result.push(link(rewriteUrl(t.href || ''), ...processInline(t.tokens || [], formatBitmask)))
    } else if (token.type === 'br') {
      result.push(lb())
    } else if (token.type === 'html') {
      result.push(t((token as any).text || '', formatBitmask))
    } else if (token.type === 'escape') {
      result.push(t((token as any).text || '', formatBitmask))
    }
  }

  return result
}

function processBlock(token: MarkedToken): LexicalNode | null {
  switch (token.type) {
    case 'heading': {
      const t = token as any
      const tag = `h${t.depth}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return h(tag, ...processInline(t.tokens || []))
    }

    case 'paragraph': {
      const t = token as any
      const children = processInline(t.tokens || [])
      if (children.length === 0) return null
      return p(...children)
    }

    case 'list': {
      const t = token as any
      const items: ListItemNode[] = []
      for (const item of t.items) {
        const itemTokens = item.tokens || []

        const inlineNodes = processInline(
          itemTokens.filter((ct: any) => !['paragraph', 'list'].includes(ct.type)),
        )

        const childLists = itemTokens.filter((ct: any) => ct.type === 'list')
        const children: LexicalNode[] = [...inlineNodes]

        for (const childList of childLists) {
          const listNode = processBlock(childList)
          if (listNode) children.push(listNode)
        }

        const paraTokens = itemTokens.filter((ct: any) => ct.type === 'paragraph')
        for (const pt of paraTokens) {
          const paraChildren = processInline((pt as any).tokens || [])
          children.push(...paraChildren)
        }

        items.push(li(...children))
      }

      if (t.ordered) return numberList(...items)
      return bulletList(...items)
    }

    case 'blockquote': {
      const t = token as any
      const children: LexicalNode[] = []
      for (const child of t.tokens || []) {
        const node = processBlock(child)
        if (node) children.push(node)
      }
      if (children.length === 0) return null
      return quote(...children)
    }

    case 'table': {
      const t = token as any
      const rows: TableRowNode[] = []

      if (t.header && t.header.length > 0) {
        const headerCells: TableCellNode[] = t.header.map((cell: any) => {
          const cellChildren = processInline(cell.tokens || [])
          return tableCell(1, ...cellChildren)
        })
        rows.push(tableRow(...headerCells))
      }

      for (const row of t.rows || []) {
        const dataCells: TableCellNode[] = row.map((cell: any) => {
          const cellChildren = processInline(cell.tokens || [])
          return tableCell(0, ...cellChildren)
        })
        rows.push(tableRow(...dataCells))
      }

      if (rows.length === 0) return null
      return tableNode(...rows)
    }

    case 'code': {
      const t = token as any
      return p(t(t.text || ''))
    }

    case 'space':
    case 'hr':
      return null

    case 'html': {
      const t = token as any
      if (t.text?.trim()) return p(t(t.text.trim()))
      return null
    }

    default:
      return null
  }
}

export function markdownToLexical(md: string): LexicalRoot {
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
      direction: 'ltr',
    },
  }
}
