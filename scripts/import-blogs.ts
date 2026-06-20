import 'dotenv/config'
import { readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'
import matter from 'gray-matter'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { markdownToLexical } from './lib/markdown-to-lexical.js'
import { extractBlocks } from './lib/extract-blocks.js'
import { getCategory } from './lib/categories.js'

const CONTENT_DIR = resolve(import.meta.dirname, '..', 'neetcounselors-content')
const AUTHOR_EMAIL = 'gauravmrjatt4@gmail.com'

function buildKeywords(frontmatter: Record<string, any>): { keyword: string }[] {
  const keywords: string[] = []

  if (frontmatter.primary_keyword) {
    keywords.push(frontmatter.primary_keyword.trim())
  }

  if (frontmatter.secondary_keywords) {
    const secondary = frontmatter.secondary_keywords
      .split(',')
      .map((k: string) => k.trim())
      .filter(Boolean)
    keywords.push(...secondary)
  }

  return [...new Set(keywords)].map((keyword) => ({ keyword }))
}

function getExcerpt(body: string, maxChars = 200): string {
  const cleaned = body.replace(/^#+\s*.*$/m, '').trim()
  const firstPara = cleaned.split(/\n\n+/)[0]
  if (!firstPara) return ''
  const stripped = firstPara.replace(/[#*\[\]`>|]/g, '').trim()
  return stripped.length > maxChars ? stripped.slice(0, maxChars).replace(/\s+\S*$/, '') + '...' : stripped
}

function getBlogNum(filename: string): number {
  const match = filename.match(/blog-(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

async function main() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })

  console.log(`Looking up author by email: ${AUTHOR_EMAIL}`)
  const { docs: authors } = await payload.find({
    collection: 'users',
    where: { email: { equals: AUTHOR_EMAIL } },
    limit: 1,
    depth: 0,
  })

  if (authors.length === 0) {
    console.error(`Author not found with email "${AUTHOR_EMAIL}". Make sure the user exists in the database.`)
    process.exit(1)
  }

  const authorId = authors[0].id
  console.log(`Author found: "${authors[0].name || authors[0].email}" (ID: ${authorId})`)

  const files = readdirSync(CONTENT_DIR)
    .filter((f) => f.startsWith('blog-') && f.endsWith('.md'))
    .sort()

  console.log(`Found ${files.length} blog files in ${CONTENT_DIR}`)

  let created = 0
  let skipped = 0
  let errors = 0

  for (const file of files) {
    const blogNum = getBlogNum(file)
    const filePath = join(CONTENT_DIR, file)

    try {
      const raw = readFileSync(filePath, 'utf-8')

      const { data: frontmatter, content: body } = matter(raw)

      if (!frontmatter.slug) {
        console.warn(`  Skipping ${file}: no slug in frontmatter`)
        errors++
        continue
      }

      const { docs: existing } = await payload.find({
        collection: 'blogs',
        where: { slug: { equals: frontmatter.slug } },
        limit: 1,
        depth: 0,
        pagination: false,
      })

      if (existing.length > 0) {
        console.log(`  Skipping ${file}: slug "${frontmatter.slug}" already exists`)
        skipped++
        continue
      }

      const { faqBlock, ctaBlock, cleanedMd } = extractBlocks(body)

      const lexicalContent = markdownToLexical(cleanedMd)

      const category = getCategory(blogNum)

      const blogData: Record<string, any> = {
        title: frontmatter.title,
        slug: frontmatter.slug,
        excerpt: getExcerpt(body),
        content: lexicalContent,
        author: authorId,
        categories: [{ category }],
        publishedAt: new Date().toISOString(),
        status: 'published',
        seo: {
          metaTitle: frontmatter.meta_title || frontmatter.title,
          metaDescription: frontmatter.meta_description || '',
          keywords: buildKeywords(frontmatter),
          noIndex: false,
        },
      }

      const blocks: any[] = []
      if (faqBlock) blocks.push(faqBlock)
      if (ctaBlock) blocks.push(ctaBlock)
      if (blocks.length > 0) blogData.blocks = blocks

      await payload.create({
        collection: 'blogs',
        data: blogData,
        depth: 0,
      })

      console.log(`  Created: [${String(blogNum).padStart(2, '0')}] ${frontmatter.title}`)
      created++
    } catch (err) {
      console.error(`  ERROR: ${file}:`, err instanceof Error ? err.message : err)
      errors++
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`)
  process.exit(errors > 0 ? 1 : 0)
}

main()
