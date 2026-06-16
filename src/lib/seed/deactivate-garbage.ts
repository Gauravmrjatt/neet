import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'

// Fragment/text-fragment slugs that appear to be garbage data
const GARBAGE_SLUGS = [
  'ility-of-the-college',
  'ing-in-view-the-lim',
  'ays-sundays-and-gazetted',
  'e-filling-choice',
  'w-the-limited-tim',
  't-of-the-seat-matr',
  'ge-seat-matrix-of',
  'e-and-the-college',
  'is-dental-college',
  'is-ayush-college',
  'dentistry-seat-mat',
  'x-of-the-college',
  'filling-choice',
  'saturday-and-sunday-as',
]

async function main() {
  const payload = await getPayload({ config })

  for (const slug of GARBAGE_SLUGS) {
    const found = await payload.find({
      collection: 'colleges',
      where: { slug: { equals: slug } },
      limit: 10,
      depth: 0,
    })

    for (const doc of found.docs) {
      await payload.update({
        collection: 'colleges',
        id: doc.id,
        data: { status: 'inactive' },
        depth: 0,
      })
      payload.logger.info(`Marked inactive: "${doc.name}" (slug: ${doc.slug}, id: ${doc.id})`)
    }
  }

  // Also find entries with very short slugs (< 8 chars) that aren't real
  const short = await payload.find({
    collection: 'colleges',
    where: {
      and: [
        { slug: { less_than: 8 } },
        { status: { equals: 'active' } },
      ],
    },
    limit: 100,
    depth: 0,
  })

  for (const doc of short.docs) {
    // Skip known short but valid slugs
    const validShort = ['ims-bhu', 'afmc', 'aiims', 'jipmer', 'bhu']
    if (validShort.includes(doc.slug)) continue

    await payload.update({
      collection: 'colleges',
      id: doc.id,
      data: { status: 'inactive' },
      depth: 0,
    })
    payload.logger.info(`Marked inactive (short slug): "${doc.name}" (slug: "${doc.slug}", id: ${doc.id})`)
  }

  payload.logger.info('Done marking garbage entries inactive.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
