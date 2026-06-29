import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const CITY_PATTERNS = [
  // Extract last word patterns: "Medical College <City>", "GMC <City>", etc.
  /(?:medical\s+college|med\.?\s*college?|gmc|dental\s+college)\s+(?:and\s+hospital\s+)?(.+)/i,
  // "Govt Medical College, <City>"
  /(?:government|govt)\s+.*?\s+college[,\s]+(.+)/i,
  // "Government College of <something>, <City>"
  /,\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*$/,
]

// Known city names to extract from college names
const KNOWN_CITIES = [
  'Agra', 'Ahmedabad', 'Ajmer', 'Aligarh', 'Allahabad', 'Alwar', 'Amritsar', 'Anand', 'Aurangabad',
  'Bagalkot', 'Bangalore', 'Banka', 'Banswara', 'Baran', 'Bareilly', 'Barmer', 'Belagavi', 'Bengaluru',
  'Bharatpur', 'Bhavnagar', 'Bhilwara', 'Bhopal', 'Bikaner', 'Bilaspur', 'Bokaro', 'Bundi',
  'Chandigarh', 'Chennai', 'Chittorgarh', 'Churu', 'Coimbatore', 'Cooch Behar', 'Coochbehar', 'Cuttack',
  'Dausa', 'Dehradun', 'Delhi', 'Dhanbad', 'Dharwad', 'Dholpur', 'Dibrugarh', 'Dungarpur',
  'Faizabad', 'Faridabad', 'Gandhinagar', 'Gaya', 'Ghaziabad', 'Gorakhpur', 'Guwahati', 'Gulbarga',
  'Guntur', 'Gurugram', 'Gwalior', 'Haldwani', 'Hanumangarh', 'Haridwar', 'Hassan', 'Hisar',
  'Hyderabad', 'Indore', 'Jabalpur', 'Jaipur', 'Jaisalmer', 'Jalandhar', 'Jalgaon', 'Jammu',
  'Jamnagar', 'Jhansi', 'Jhunjhunu', 'Jodhpur', 'Junagadh', 'Kakinada', 'Kannur', 'Kanpur',
  'Karauli', 'Karnal', 'Karwar', 'Kochi', 'Kota', 'Kolkata', 'Kollam', 'Kozhikode', 'Kurnool',
  'Lucknow', 'Ludhiana', 'Madurai', 'Mangalore', 'Mathura', 'Meerut', 'Mohali', 'Mumbai', 'Mysore',
  'Nagpur', 'Nashik', 'Noida', 'Nagaur', 'Nellore', 'New Delhi', 'Nizamabad',
  'Palakkad', 'Pali', 'Panaji', 'Panjim', 'Patiala', 'Patna', 'Pondicherry', 'Puducherry', 'Pune',
  'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Rohtak', 'Rourkela', 'Saharanpur',
  'Salem', 'Sambalpur', 'Satara', 'Sawai Madhopur', 'Shillong', 'Shimla', 'Sikar', 'Siliguri',
  'Sirohi', 'Solapur', 'Srinagar', 'Sri Ganganagar', 'Sriganganagar', 'Surendranagar', 'Surat',
  'Thane', 'Thiruvananthapuram', 'Tiruchirappalli', 'Tirupati', 'Tonk', 'Trivandrum',
  'Udaipur', 'Udupi', 'Vadodara', 'Varanasi', 'Vellore', 'Vijayawada', 'Visakhapatnam', 'Warangal',
  'Chengalpattu', 'Chengallpattu',
]

function extractCityFromName(name: string): string | null {
  // Try known cities first (case-insensitive)
  for (const city of KNOWN_CITIES) {
    // Match whole word
    const regex = new RegExp(`\\b${city}\\b`, 'i')
    if (regex.test(name)) {
      return city
    }
  }
  return null
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Fixing college cities...')

  const colleges = await payload.find({
    collection: 'colleges',
    where: { city: { exists: false } },
    limit: 1000,
    depth: 0,
  })
  payload.logger.info(`Colleges without city: ${colleges.docs.length}`)

  let updated = 0
  let stillMissing = 0

  for (const c of colleges.docs as any[]) {
    const name = c.name?.trim()
    if (!name) {
      stillMissing++
      continue
    }

    const city = extractCityFromName(name)
    if (city) {
      await payload.update({
        collection: 'colleges',
        id: c.id,
        data: { city } as any,
        depth: 0,
      })
      updated++
    } else {
      stillMissing++
    }
  }

  payload.logger.info(`Updated: ${updated}, Still missing: ${stillMissing}`)
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
