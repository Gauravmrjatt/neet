import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config: config as any })

  const result = await payload.find({
    collection: 'colleges',
    limit: 1000,
    select: { name: true, feeStructure: true },
  })

  console.log(`Total CMS colleges: ${result.docs.length}`)
  const withFees = result.docs.filter((d: any) => d.feeStructure?.mbbsAnnual)
  console.log(`With fees: ${withFees.length}`)

  // Sample college names
  for (let i = 0; i < 20 && i < result.docs.length; i++) {
    const d = result.docs[i]
    console.log(`[${i}] ${d.name} | fees: ${d.feeStructure?.mbbsAnnual || 'N/A'}`)
  }

  process.exit(0)
}

main()
