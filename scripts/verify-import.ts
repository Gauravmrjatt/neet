import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const SITE_URL = 'https://neetcounselors.com'

async function main() {
  const payload = await getPayload({ config })

  const { docs: blogs, totalDocs } = await payload.find({
    collection: 'blogs',
    sort: 'createdAt',
    limit: 100,
    depth: 0,
    pagination: false,
  })

  const skipSlugs = new Set(['test-blog-post'])

  const imported = blogs.filter((b: any) => !skipSlugs.has(b.slug))

  for (const b of imported) {
    console.log(`${SITE_URL}/blog/${b.slug}`)
  }
}

main()
