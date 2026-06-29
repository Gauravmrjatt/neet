import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })
  
  // Find Andhra Pradesh
  const ap = await payload.find({ collection: 'states', where: { name: { equals: 'Andhra Pradesh' } }, limit: 5 })
  if (ap.docs.length > 0) {
    const stateId = (ap.docs[0] as any).id
    const districts = await payload.find({ collection: 'districts', where: { state: { equals: stateId } }, limit: 100, depth: 0 })
    console.log('Andhra Pradesh districts:')
    for (const d of districts.docs as any[]) {
      console.log(`  "${d.name}" slug="${d.slug}"`)
    }
  }
  process.exit(0)
}
main().catch(console.error)
