import 'dotenv/config'
import { readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'
import matter from 'gray-matter'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { markdownToLexical } from './lib/markdown-to-lexical.js'
import { extractBlocks } from './lib/extract-blocks.js'
import { getCategory } from './lib/categories.js'

const CONTENT_DIR = resolve(import.meta.dirname, '..', 'neetcounselors-50-blogs-v2')
const AUTHOR_EMAIL = 'gauravmrjatt4@gmail.com'

function buildKeywords(frontmatter: Record<string, any>): { keyword: string }[] {
  const keywords: string[] = []

  if (frontmatter.primaryKeyword) {
    keywords.push(frontmatter.primaryKeyword.trim())
  }

  if (frontmatter.secondaryKeywords && Array.isArray(frontmatter.secondaryKeywords)) {
    keywords.push(...frontmatter.secondaryKeywords.map((k: string) => k.trim()).filter(Boolean))
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseNoFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const lines = raw.split('\n')
  const h1 = lines.find((l) => l.startsWith('# '))
  const title = h1 ? h1.replace(/^#\s*/, '').trim() : ''

  let primaryKeyword = ''
  for (const line of lines) {
    const m = line.match(/^\*\*Primary Keyword:\*\*\s*(.+)/)
    if (m) { primaryKeyword = m[1].trim(); break }
  }

  const sepIndex = raw.indexOf('\n---\n')
  const content = sepIndex !== -1 ? raw.slice(sepIndex + 5) : raw

  return {
    data: {
      title,
      slug: slugify(title),
      primaryKeyword,
      metaTitle: title,
      metaDesc: '',
      date: null,
    },
    content,
  }
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
    console.error(`Author not found with email "${AUTHOR_EMAIL}".`)
    process.exit(1)
  }

  const authorId = authors[0].id
  console.log(`Author found: "${authors[0].name || authors[0].email}" (ID: ${authorId})`)

  const files = readdirSync(CONTENT_DIR)
    .filter((f) => f.startsWith('blog-') && f.endsWith('.md'))
    .sort()

  console.log(`Found ${files.length} blog files in ${CONTENT_DIR}\n`)

  let created = 0
  let updated = 0
  let errors = 0

  for (const file of files) {
    const blogNum = getBlogNum(file)
    const filePath = join(CONTENT_DIR, file)

    try {
      const raw = readFileSync(filePath, 'utf-8')

      const parsed = matter(raw)
      const { data: frontmatter, content: body } =
        parsed.data?.slug ? parsed : parseNoFrontmatter(raw)

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
        publishedAt: frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString(),
        status: 'published',
        seo: {
          metaTitle: frontmatter.metaTitle || frontmatter.title,
          metaDescription: frontmatter.metaDesc || '',
          keywords: buildKeywords(frontmatter),
          noIndex: false,
        },
      }

      const blocks: any[] = []
      if (faqBlock) blocks.push(faqBlock)
      if (ctaBlock) blocks.push(ctaBlock)
      if (blocks.length > 0) blogData.blocks = blocks

      const { docs: existing } = await payload.find({
        collection: 'blogs',
        where: { slug: { equals: frontmatter.slug } },
        limit: 1,
        depth: 0,
        pagination: false,
      })

      if (existing.length > 0) {
        await (payload.update as any)({
          collection: 'blogs',
          id: existing[0].id,
          data: blogData,
          depth: 0,
        })
        console.log(`  Updated: [${String(blogNum).padStart(2, '0')}] ${frontmatter.title}`)
        updated++
      } else {
        await (payload.create as any)({
          collection: 'blogs',
          data: blogData,
          depth: 0,
        })
        console.log(`  Created: [${String(blogNum).padStart(2, '0')}] ${frontmatter.title}`)
        created++
      }
    } catch (err) {
      console.error(`  ERROR: ${file}:`, err instanceof Error ? err.message : err)
      errors++
    }
  }

  console.log(`\nDone! Updated: ${updated}, Created: ${created}, Errors: ${errors}`)
  process.exit(errors > 0 ? 1 : 0)
}

main()
