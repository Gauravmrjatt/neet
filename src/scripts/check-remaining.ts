import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })
  const unmapped = await payload.find({
    collection: 'colleges',
    where: { and: [{ district: { exists: false } }, { city: { exists: true } }] },
    limit: 500,
    depth: 0,
  })
  console.log(`Remaining with city: ${unmapped.docs.length}`)
  for (const c of unmapped.docs as any[]) {
    console.log(`  "${c.city}" | ${c.name?.substring(0, 80)}`)
  }
  process.exit(0)
}
main().catch(console.error)
