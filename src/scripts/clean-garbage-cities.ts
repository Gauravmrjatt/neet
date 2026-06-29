import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Clearing garbage city values on unmapped colleges...')
  
  const bad = await payload.find({
    collection: 'colleges',
    where: { and: [{ district: { exists: false } }, { city: { exists: true } }] },
    limit: 1000,
    depth: 0,
  })
  
  let cleared = 0
  for (const c of bad.docs as any[]) {
    try {
      await payload.update({
        collection: 'colleges',
        id: c.id,
        data: { city: null } as any,
        depth: 0,
      })
      cleared++
    } catch { /* ignore */ }
  }
  payload.logger.info(`Cleared city field on ${cleared} unmapped colleges`)
  process.exit(0)
}
main().catch(console.error)
