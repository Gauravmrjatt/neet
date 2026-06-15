// @ts-nocheck
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const RANKINGS = [
  ['Madras Medical College, Chennai', 17],
  ['Calcutta National Med Coll, Kolkata', 29],
  ['Maulana Azad Medical College, New Delhi', 13],
  ['Lady Hardinge Medical College, New Delhi', 14],
  ['University College of Medical Sciences, New Delhi', 21],
  ['B.J. Medical College, Ahmedabad', 22],
  ['Vardhman Mahavir Medical College and Safdarjung Hospital', 19],
  ['Kasturba Medical College, Manipal', 11],
  ['Kasturba Medical College, Mangalore', 11],
  ['Andhra Medical College, Visakhapatnam', 45],
  ['Guntur Medical College, Guntur', 46],
  ['Rangaraya Medical College, Kakinada', 47],
  ['Siddartha Medical College, Vijayawada', 48],
  ['Kurnool Medical College, Kurnool', 49],
  ['Grant Medical Coll & Sir J.J.Hosp, Mumbai', 15],
  ['Govt. Medical College, Nagpur', 27],
  ['Govt.Medical College, Thiruvananthapuram', 28],
  ['Sri Venkateswara Medical College, Tirupati', 23],
  ['JIPMER Puducherry', 5],
  ['JIPMER Karaikal', 5],
  ['Yenepoya Medical College, Mangalore', 35],
  ['Government Medical College and Hospital, Chandigar', 20],
  ['Moti Lal Nehru Medical Coll, Allahabad', 43],
  ['S.N. Medical College, Agra', 44],
  ['Grant Medical Coll & Sir J.J.Hosp, Mumbai', 15],
  ['Institute of Medical Sciences & SUM Hospital', 6],
  ['Dr. DY Patil Medical College, Navi Mumbai', 34],
  ['B.J. Government Medical College, Pune', 22],
  ['Bharati Vidyapeeth DU Medical College, Pune', 34],
  ['JSS Medical College, Mysuru', 36],
  ['Amrita Institute of Medical Science, Kochi', 7],
  ['king george medical university', 8],
]

async function main() {
  const payload = await getPayload({ config })
  const all = await payload.find({ collection: 'colleges', limit: 2000, depth: 0 })
  const list = all.docs
  const nameMap = new Map(list.map(c => [c.name.toLowerCase().trim(), c]))
  payload.logger.info('Loaded ' + list.length + ' colleges')

  let matched = 0
  let uniq = new Set()

  for (const [dbName, rank] of RANKINGS) {
    const lower = dbName.toLowerCase().trim()
    const c = nameMap.get(lower)
    if (!c) {
      payload.logger.info('  NO: "' + dbName + '"')
      continue
    }
    if (uniq.has(c.id)) {
      payload.logger.info('  DUP: "' + dbName + '" (already ranked)')
      continue
    }
    try {
      await payload.update({
        collection: 'colleges',
        id: c.id,
        data: { ranking: rank },
        depth: 0,
      })
      uniq.add(c.id)
      payload.logger.info('  OK r' + rank + ': "' + dbName + '"')
      matched++
    } catch (err) {
      payload.logger.warn('  ERR: ' + err.message)
    }
  }

  payload.logger.info('\nSet rankings for ' + matched + ' colleges')
  process.exit(0)
}
main().catch(console.error)
