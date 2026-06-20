import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

function wrapInlineChildren(node: any): boolean {
  if (!node || typeof node !== 'object') return false

  let modified = false

  if (node.type === 'tablecell' && Array.isArray(node.children)) {
    const hasInlineChild = node.children.some(
      (child: any) =>
        child.type === 'text' || child.type === 'link' || child.type === 'linebreak',
    )

    if (hasInlineChild) {
      const inlineChildren = [...node.children]
      node.children = inlineChildren.length > 0
        ? [{
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: inlineChildren,
            direction: 'ltr',
            textFormat: 0,
            textStyle: '',
          }]
        : []
      modified = true
    }
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (wrapInlineChildren(child)) modified = true
    }
  }

  if (Array.isArray(node.items)) {
    for (const item of node.items) {
      if (wrapInlineChildren(item)) modified = true
    }
  }

  return modified
}

async function main() {
  const payload = await getPayload({ config })

  const { docs: blogs, totalDocs } = await payload.find({
    collection: 'blogs',
    limit: 200,
    depth: 0,
    pagination: false,
  })

  console.log(`Checking ${totalDocs} blogs for table cell fixes...`)

  let fixed = 0
  let skipped = 0

  for (const blog of blogs) {
    if (!blog.content?.root?.children) {
      skipped++
      continue
    }

    const modified = wrapInlineChildren(blog.content.root)
    if (!modified) {
      skipped++
      continue
    }

    await payload.update({
      collection: 'blogs',
      id: blog.id,
      data: {
        content: blog.content,
      },
      depth: 0,
    })

    console.log(`  Fixed: ${blog.title}`)
    fixed++
  }

  console.log(`\nDone! Fixed: ${fixed}, Skipped (no tables or already correct): ${skipped}`)
}

main()
