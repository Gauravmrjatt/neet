import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })
  const states = await payload.find({ collection: 'states', where: { name: { equals: 'Delhi' } }, limit: 10 })
  const delhi = (states.docs as any[])[0]
  if (delhi) {
    const districts = await payload.find({ collection: 'districts', where: { state: { equals: delhi.id } }, limit: 100, depth: 0 })
    console.log('Delhi districts:')
    for (const d of districts.docs as any[]) {
      console.log(`  "${d.name}" slug="${d.slug || ''}"`)
    }
  }
  
  // Also check some districts by name
  for (const name of ['Delhi', 'New Delhi', 'Central Delhi', 'Purba Medinipur', 'Imphal West', 'Sivaganga']) {
    const found = await payload.find({ collection: 'districts', where: { name: { equals: name } }, limit: 5 })
    if (found.docs.length > 0) {
      console.log(`Found district: "${name}" id=${(found.docs[0] as any).id} slug="${(found.docs[0] as any).slug || ''}"`)
    } else {
      console.log(`NOT found: "${name}"`)
    }
  }
  process.exit(0)
}
main().catch(console.error)
