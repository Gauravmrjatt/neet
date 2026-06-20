function dedupeNewlines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n').trim()
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQBlock {
  blockType: 'faqBlock'
  title: string
  items: FAQItem[]
}

export interface CTABlock {
  blockType: 'ctaBlock'
  heading: string
  description: string
  buttonText: string
  buttonLink: string
}

function extractFAQSection(md: string): { faqBlock: FAQBlock | null; cleanedMd: string } {
  const faqPattern = /##\s+(Frequently Asked Questions|Common Questions About[^]*?|FAQ)[^\n]*\n([\s\S]*?)(?=\n##\s|\n---|$)/i
  const match = md.match(faqPattern)
  if (!match) return { faqBlock: null, cleanedMd: md }

  const sectionContent = match[2]

  const items: FAQItem[] = []
  const qaPattern = /###\s+(.+?)\n([\s\S]*?)(?=\n###\s|\n##\s|\n---|$)/g
  let qaMatch
  while ((qaMatch = qaPattern.exec(sectionContent)) !== null) {
    const question = qaMatch[1].trim()
    const answer = qaMatch[2].trim()
    if (question && answer) {
      items.push({ question, answer })
    }
  }

  const faqBlock = items.length > 0 ? { blockType: 'faqBlock' as const, title: 'Frequently Asked Questions', items } : null

  const cleanedMd = md.replace(faqPattern, '')

  return { faqBlock, cleanedMd }
}

function extractCTASection(md: string): { ctaBlock: CTABlock | null; cleanedMd: string } {
  const conclusionPattern = /##\s+Conclusion\n([\s\S]*?)(?=\n---|\n\*Last|$)/i
  const match = md.match(conclusionPattern)
  if (!match) return { ctaBlock: null, cleanedMd: md }

  const sectionContent = match[1].trim()

  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
  const links: { text: string; href: string }[] = []
  let linkMatch
  while ((linkMatch = linkPattern.exec(sectionContent)) !== null) {
    links.push({ text: linkMatch[1].trim(), href: linkMatch[2].trim() })
  }

  const plainText = sectionContent.replace(linkPattern, '').replace(/\*\*/g, '').trim()

  const lastLink = links[links.length - 1]

  if (!lastLink) return { ctaBlock: null, cleanedMd: md }

  const ctaBlock: CTABlock = {
    blockType: 'ctaBlock',
    heading: 'Need Expert Guidance?',
    description: plainText.slice(0, 300),
    buttonText: lastLink.text,
    buttonLink: lastLink.href,
  }

  const cleanedMd = md.replace(conclusionPattern, '')

  return { ctaBlock, cleanedMd }
}

export function extractBlocks(
  md: string,
): { faqBlock: FAQBlock | null; ctaBlock: CTABlock | null; cleanedMd: string } {
  let cleanedMd = md

  const { faqBlock, cleanedMd: afterFaq } = extractFAQSection(cleanedMd)
  cleanedMd = afterFaq

  const { ctaBlock, cleanedMd: afterCta } = extractCTASection(cleanedMd)
  cleanedMd = afterCta

  const separatorPattern = /---\s*\n(\*Last[^]*)?$/i
  cleanedMd = cleanedMd.replace(separatorPattern, '').trim()

  return { faqBlock, ctaBlock, cleanedMd }
}
