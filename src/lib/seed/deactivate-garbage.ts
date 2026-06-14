import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'

const GARBAGE_NAMES = [
  'th 4 january',
  'selling',
  'december',
]

async function main() {
  const payload = await getPayload({ config })

  for (const name of GARBAGE_NAMES) {
    const found = await payload.find({
      collection: 'colleges',
      where: { name: { equals: name } },
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
      payload.logger.info(`Marked inactive: "${doc.name}" (${doc.id})`)
    }
  }

  payload.logger.info('Done marking garbage entries inactive.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
