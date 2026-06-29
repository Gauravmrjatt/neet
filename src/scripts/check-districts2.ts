import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })
  
  // Check specific districts
  for (const name of ['Purnea', 'Purnia', 'Nandyal', 'Eluru', 'Lakhimpur Kheri', 'Kheri']) {
    const found = await payload.find({
      collection: 'districts', 
      where: { name: { equals: name } },
      limit: 5
    })
    if (found.docs.length > 0) {
      console.log(`Found: "${name}" -> slug="${(found.docs[0] as any).slug}" id="${(found.docs[0] as any).id}"`)
    } else {
      console.log(`NOT found: "${name}"`)
    }
  }
  
  // Check total mapped vs unmapped
  const total = await payload.find({ collection: 'colleges', limit: 0, depth: 0 })
  const mapped = await payload.find({ collection: 'colleges', where: { district: { exists: true } }, limit: 0, depth: 0 })
  const withCity = await payload.find({ collection: 'colleges', where: { city: { exists: true } }, limit: 0, depth: 0 })
  const unmapped = await payload.find({ collection: 'colleges', where: { district: { exists: false } }, limit: 0, depth: 0 })
  const unmappedNoCity = await payload.find({
    collection: 'colleges',
    where: { and: [{ district: { exists: false } }, { city: { exists: false } }] },
    limit: 0, depth: 0,
  })
  const unmappedWithCity = unmapped.docs.length - unmappedNoCity.docs.length
  
  console.log(`\nTotal colleges: ${total.docs.length}`)
  console.log(`Mapped to district: ${mapped.docs.length}`)
  console.log(`With city: ${withCity.docs.length}`)
  console.log(`Unmapped: ${unmapped.docs.length} (${unmappedWithCity} with city, ${unmappedNoCity.docs.length} without city)`)
  
  process.exit(0)
}
main().catch(console.error)
