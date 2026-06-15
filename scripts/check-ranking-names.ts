// @ts-nocheck
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const KNOWN = [
  'All India Institute of Medical Sciences Delhi', 'AIIMS Delhi',
  'Post Graduate Institute of Medical Education and Research', 'PGIMER Chandigarh',
  'Christian Medical College', 'CMC Vellore',
  'JIPMER', 'Jawaharlal Institute of Postgraduate Medical Education and Research',
  'Institute of Medical Sciences BHU', 'Banaras Hindu University',
  'Kasturba Medical College Manipal', 'KMC Manipal',
  'Seth GS Medical College', 'King Edward Memorial Hospital',
  'Grant Medical College and Sir Jamshedjee Jeejeebhoy Group of Hospitals', 'Grant Medical College',
  'Madras Medical College',
  'Maulana Azad Medical College',
  'Lady Hardinge Medical College',
  'Safdarjung Hospital', 'Vardhman Mahavir Medical College',
  'University College of Medical Sciences',
  'Government Medical College and Hospital Chandigarh',
  'B.J. Medical College Ahmedabad',
  'Sri Venkateswara Institute of Medical Sciences',
  'Rajendra Institute of Medical Sciences',
  'Government Medical College Nagpur',
  'Calcutta National Medical College',
  'R. G. Kar Medical College and Hospital',
  'Andhra Medical College',
  'Guntur Medical College',
  'Kurnool Medical College',
  'King George\'s Medical University', 'KGMU',
  'Motilal Nehru Medical College',
  'Sarojini Naidu Medical College',
  'GSVM Medical College',
]

async function main() {
  const payload = await getPayload({ config })
  const all = await payload.find({ collection: 'colleges', limit: 1000, depth: 0 })

  console.log('=== SAMPLE COLLEGE NAMES (first 50) ===')
  all.docs.slice(0, 50).forEach(c => {
    console.log(`  "${c.name}"  (type: ${c.type})`)
  })

  console.log('\n=== MATCHING KNOWN RANKINGS ===')
  for (const known of KNOWN) {
    const lower = known.toLowerCase()
    const matches = all.docs.filter(c => {
      const cl = c.name.toLowerCase()
      return cl.includes(lower) || lower.includes(cl) || cl.startsWith(lower.slice(0, 15))
    })
    if (matches.length === 1) {
      console.log(`  ✅ "${known}" → "${matches[0].name}"`)
    } else if (matches.length > 1) {
      console.log(`  ⚠️  "${known}" → multiple (${matches.length}): ${matches.map(m => `"${m.name}"`).join(', ')}`)
    } else {
      console.log(`  ❌ "${known}" → no match`)
    }
  }

  process.exit(0)
}
main().catch(console.error)
