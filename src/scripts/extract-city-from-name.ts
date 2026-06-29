import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const PATTERNS = [
  // "gmers medical college himmatnagar" style
  /gmers\s+medical\s+college\s+(.+?)$/i,
  // "College of ... City" — last word after known patterns
  /(?:College|Institute|Mahavidyalaya|Centre)\s+(?:and\s+)?(?:Research\s+)?(?:Institute\s+)?(?:of\s+)?(.+?)$/i,
  // "Veterinary College ... <City>" patterns
  /Veterinary\s+College\s+and\s+Research\s+Institute\s+(.+?)$/i,
  /College\s+of\s+Veterinary\s+[^.]+?\.\s*(.+?)$/i,
  /Veterinary\s+College\s+(.+?)$/i,
  // "NORTH EASTERN INSTITUTE ... SHILONG"
  /HOMEOPATHY[-\s]*([A-Z]{3,})$/i,
  // "ESIC Dental College and Hospital"
  /ESIC\s+(.+?)\s+College/i,
  // "College of Nursing <Name> <City>"
  /College\s+of\s+Nursing\s+.+?\s+(.+?)$/i,
  // Generic: last word after "College and Hospital" if not common stop-words
  /College\s+and\s+Hospital[,\s]+(.+?)$/i,
  /College\s+and\s+Hospital\s+(.+?)$/i,
  // "Government ... College <City>"
  /Government\s+.+?\s+College[,\s]+(.+?)$/i,
  /Government\s+.+?\s+College\s+(.+?)$/i,
  // "mgmc and sri balaji vidyapeeth" — skip
]

const STOP_WORDS = new Set(['and', 'the', 'of', 'for', 'in', 'at', '&', 'hospital', 'research', 'centre', 'institute', 'college', 'university', 'deemed', 'ltd', 'pvt', 'smt', 'shri', 'dr', 'prof', 'b.v.d.u', 'k.n.p', 'r.g.s.c'])

function extractCity(name: string): string | null {
  if (!name || name.length < 5) return null
  // Skip clearly garbage entries
  if (/^(saturday|sunday|december|january|online|muslim|will |ith |ays\/|e filing|ility|ing in|selling|eligible)/i.test(name)) return null
  if (name.includes('@') || name.includes('http')) return null
  
  for (const p of PATTERNS) {
    const m = name.match(p)
    if (m && m[1]) {
      let city = m[1].trim()
      // Remove trailing punctuation/numbers
      city = city.replace(/[.,;:\d]+$/, '').trim()
      // Must be 2+ chars, not a stop word
      if (city.length >= 2 && !STOP_WORDS.has(city.toLowerCase())) {
        return city
      }
    }
  }
  return null
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Extracting cities from college names (improved)...')
  
  const noCity = await payload.find({
    collection: 'colleges',
    where: { and: [{ district: { exists: false } }, { city: { exists: false } }] },
    limit: 200,
    depth: 0,
  })
  payload.logger.info(`Total no-city entries: ${noCity.docs.length}`)
  
  let assigned = 0
  let skipped = 0
  for (const c of noCity.docs as any[]) {
    const name = (c.name || '').trim()
    if (!name) { skipped++; continue }
    
    const city = extractCity(name)
    if (!city) {
      skipped++
      continue
    }
    
    try {
      await payload.update({
        collection: 'colleges',
        id: c.id,
        data: { city } as any,
        depth: 0,
      })
      assigned++
      console.log(`  ✓ "${name.substring(0, 60)}" → city="${city}"`)
    } catch {
      skipped++
    }
  }
  payload.logger.info(`Assigned: ${assigned}, Skipped: ${skipped}`)
  process.exit(0)
}
main().catch(console.error)
