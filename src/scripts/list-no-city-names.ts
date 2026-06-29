import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })
  
  const noCity = await payload.find({
    collection: 'colleges',
    where: { and: [{ district: { exists: false } }, { city: { exists: false } }] },
    limit: 200,
    depth: 0,
  })
  
  for (const c of noCity.docs as any[]) {
    console.log((c as any).name)
  }
  process.exit(0)
}
main().catch(console.error)
