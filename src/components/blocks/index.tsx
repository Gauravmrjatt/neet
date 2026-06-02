import React from 'react'
import { HeroBlock } from './HeroBlock'
import { FeatureBlock } from './FeatureBlock'
import { CTABlock } from './CTABlock'
import { PricingBlock } from './PricingBlock'
import { FAQBlock } from './FAQBlock'
import { TestimonialBlock } from './TestimonialBlock'
import { RichTextBlock } from './RichTextBlock'
import { VideoBlock } from './VideoBlock'
import { CounsellorBlock } from './CounsellorBlock'
import { HelpdeskBlock } from './HelpdeskBlock'

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  features: FeatureBlock,
  cta: CTABlock,
  contentBlock: RichTextBlock,
  testimonials: TestimonialBlock,
  'pricing-block': PricingBlock,
  'faq-block': FAQBlock,
  'feature-block': FeatureBlock,
  'video-block': VideoBlock,
  'counsellor-block': CounsellorBlock,
  'helpdesk-block': HelpdeskBlock,
  'rich-text-block': RichTextBlock,
}

export function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={block.id || index} {...block} />
      })}
    </>
  )
}
