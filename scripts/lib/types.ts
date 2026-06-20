export type LexicalNode =
  | TextNode
  | ParagraphNode
  | HeadingNode
  | ListNode
  | ListItemNode
  | QuoteNode
  | LinkNode
  | LinebreakNode
  | TableNode
  | TableRowNode
  | TableCellNode

export interface TextNode {
  type: 'text'
  mode: 'normal'
  text: string
  style: string
  detail: number
  format: number
  version: number
}

export interface ParagraphNode {
  type: 'paragraph'
  format: string
  indent: number
  version: number
  children: LexicalNode[]
  direction: 'ltr'
  textFormat: number
  textStyle: string
}

export interface HeadingNode {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  format: string
  indent: number
  version: number
  children: LexicalNode[]
  direction: 'ltr'
}

export interface ListNode {
  type: 'list'
  listType: 'bullet' | 'number'
  format: string
  indent: number
  version: number
  children: LexicalNode[]
  direction: 'ltr'
  start: number
}

export interface ListItemNode {
  type: 'listitem'
  format: string
  indent: number
  version: number
  children: LexicalNode[]
  direction: 'ltr'
}

export interface QuoteNode {
  type: 'quote'
  format: string
  indent: number
  version: number
  children: LexicalNode[]
  direction: 'ltr'
}

export interface LinkNode {
  type: 'link'
  format: string
  indent: number
  version: number
  fields: { url: string }
  children: LexicalNode[]
  direction: 'ltr'
}

export interface LinebreakNode {
  type: 'linebreak'
  version: number
}

export interface TableNode {
  type: 'table'
  format: string
  indent: number
  version: number
  children: TableRowNode[]
  direction: 'ltr'
}

export interface TableRowNode {
  type: 'tablerow'
  format: string
  indent: number
  version: number
  children: TableCellNode[]
  direction: 'ltr'
}

export interface TableCellNode {
  type: 'tablecell'
  format: string
  indent: number
  version: number
  children: LexicalNode[]
  direction: 'ltr'
  headerState: number
}

export interface LexicalRoot {
  root: {
    type: 'root'
    format: string
    indent: number
    version: number
    children: LexicalNode[]
    direction: 'ltr'
  }
}

export interface FAQBlock {
  blockType: 'faqBlock'
  title: string
  items: { question: string; answer: string }[]
}

export interface CTABlock {
  blockType: 'ctaBlock'
  heading: string
  description: string
  buttonText: string
  buttonLink: string
}

export type ExtractedBlock = FAQBlock | CTABlock
