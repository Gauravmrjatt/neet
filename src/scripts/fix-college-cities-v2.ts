import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Fixing college cities v2...')

  // Load all districts
  const districts = await payload.find({ collection: 'districts', limit: 2000, depth: 0 })
  const districtNames = districts.docs.map((d: any) => ({ name: d.name, slug: d.slug, id: d.id }))
  // Sort by name length (longest first) to match "Sri Ganganagar" before "Ganganagar"
  districtNames.sort((a: any, b: any) => b.name.length - a.name.length)
  payload.logger.info(`Loaded ${districtNames.length} district names`)

  // Also add common city names that aren't district names
  const extraCities = [
    'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Bengaluru', 'Bangalore', 'Hyderabad',
    'Ahmedabad', 'Pune', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
    'Thane', 'Bhopal', 'Visakhapatnam', 'Vijayawada', 'Patna', 'Vadodara', 'Ghaziabad',
    'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
    'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah',
    'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayapura', 'Mysore', 'Jodhpur', 'Madurai',
    'Kota', 'Guwahati', 'Chandigarh', 'Hubli', 'Solapur', 'Tirunelveli', 'Bareilly',
    'Aligarh', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Mira-Bhayandar', 'Thiruvananthapuram',
    'Kochi', 'Kozhikode', 'Gurugram', 'Shimla', 'Dehradun', 'Panaji', 'Gandhinagar',
    'Siliguri', 'Mangalore', 'Udupi', 'Belagavi', 'Shillong', 'Imphal', 'Puducherry',
    'Port Blair', 'Daman', 'Silvassa', 'Kavaratti', 'Aizawl', 'Kohima', 'Itanagar',
    'Dispur', 'Gangtok', 'Agartala', 'Panjim', 'Raipur', 'Naya Raipur', 'Bilaspur',
    'Jammu', 'Leh', 'Kargil', 'Rohtak', 'Hisar', 'Ambala', 'Patiala', 'Bathinda',
    'Mathura', 'Ayodhya', 'Saharanpur', 'Muzaffarnagar', 'Alwar', 'Bharatpur', 'Sikar',
    'Udaipur', 'Pali', 'Tonk', 'Churu', 'Jhunjhunu', 'Jaisalmer', 'Barmer', 'Nagaur',
    'Bikaner', 'Ajmer', 'Bhilwara', 'Bundi', 'Karauli', 'Dausa', 'Dholpur', 'Sawai Madhopur',
    'Sirohi', 'Pratapgarh', 'Hanumangarh', 'Banswara', 'Dungarpur', 'Baran', 'Jhalawar',
    'Chittorgarh', 'Rajsamand', 'Sri Ganganagar', 'Ganganagar', 'Kurnool', 'Nellore',
    'Guntur', 'Kakinada', 'Tirupati', 'Kadapa', 'Anantapur', 'Eluru', 'Ongole', 'Machilipatnam',
    'Nandyal', 'Vizianagaram', 'Srikakulam', 'Chittoor', 'Proddatur', 'Hindupur',
    'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Warangal', 'Mahbubnagar',
    'Mancherial', 'Suryapet', 'Siddipet', 'Adilabad', 'Nalgonda', 'Miryalaguda', 'Jagtial',
    'Vikarabad', 'Sangareddy', 'Bhongir', 'Mahabubabad', 'Wanaparthy', 'Kagaznagar',
    'Gadwal', 'Nirmal', 'Kamareddy', 'Secunderabad', 'Shamshabad', 'Medchal',
    'Chengallpattu', 'Chengalpattu', 'Kancheepuram', 'Vellore', 'Erode', 'Tiruppur',
    'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Kumbakonam', 'Karur', 'Nagercoil',
    'Cuddalore', 'Dharmapuri', 'Krishnagiri', 'Nagapattinam', 'Namakkal', 'Perambalur',
    'Pudukkottai', 'Ramanathapuram', 'Theni', 'Thoothukudi', 'Tiruvarur', 'Tiruvannamalai',
    'Viluppuram', 'Virudhunagar', 'Ariyalur', 'Tirupathur', 'Kallakurichi',
    'Mayiladuthurai', 'Tenkasi', 'Sivaganga', 'Kanchipuram', 'Trichy',
    'Jamnagar', 'Bhavnagar', 'Junagadh', 'Anand', 'Nadiad', 'Morbi', 'Mahesana',
    'Gandhidham', 'Surendranagar', 'Porbandar', 'Palanpur', 'Valsad', 'Navsari',
    'Bharuch', 'Amreli', 'Botad', 'Chhota Udaipur', 'Dahod', 'Kutch', 'Patan',
    'Sabarkantha', 'Tapi', 'Aravalli', 'Devbhumi Dwarka', 'Gir Somnath', 'Mahisagar',
    'Kheda', 'Narmada', 'Panchmahal', 'Banaskantha', 'Mehsana', 'Himatnagar',
    'Visnagar', 'Siddhpur', 'Kadi', 'Savli', 'Limda', 'Kalol', 'Kuvadava', 'Mubarakpur',
    'Vadnagar', 'Basna', 'Vahelal', 'Naroda', 'Dharpur', 'Gotri',
    'Firozabad', 'Badaun', 'Basti', 'Ambedkar Nagar', 'Shahdol', 'Satna', 'Ratlam',
    'Mandsaur', 'Shivpuri', 'Sheopur', 'Narsinghpur', 'Seoni', 'Chhindwara', 'Siddipet',
    'Rai Bareli', 'Baramati', 'Nandurbar', 'Kolhapur', 'Mangalagiri', 'Kalyani',
    'Rishikesh', 'Bathinda', 'Bhubaneswar', 'Deogarh', 'Rampurhat', 'Diamond Harbour',
    'Nagaon', 'Diphu', 'Dhubri', 'Nalbari', 'Tinsukia', 'Jorhat', 'Kokrajhar',
    'Silchar', 'Shilong', 'Falkawn', 'Zoram', 'Rendo', 'Majhi', 'Chettinad',
    'Mohanpur', 'Nadia', 'Paithna', 'Bhaganbigha', 'Purnea', 'Suryapet', 'Nirmal',
    'Narsampet', 'Nandyal', 'Mahasamund', 'Karimnagar', 'Machilipatnam', 'Srikakulam',
    'Adilabad', 'Kadapa', 'Pudukkottai', 'Karur', 'Sivagangai', 'Jayashankar',
    'Bhupalpally', 'Rajanna', 'Sircilla', 'Vikarabad', 'Vizianagaram', 'Jangaon',
    'Kamareddy', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Haveri',
    'Kodagu', 'Koppal', 'Gadag', 'Bagalkot', 'Hassan', 'Dharwad', 'Hinduhridayasamrat',
    'Balasaheb', 'Thackeray', 'Soban', 'Singh', 'Jeena', 'Garhwali', 'Garhwal',
    'Srikakulam', 'Ambedkar', 'Nagar', 'Prafulla', 'Chandra', 'Sen', 'Pabitra',
    'Mohan', 'Pradhan', 'Saheed', 'Nirmal', 'Mahto', 'Sarat', 'Chandra', 'Chattopadhyay',
    'Deben', 'Mahata', 'Tamralipto', 'Raiganj', 'Rampurhat', 'Jhargram', 'Cooch',
    'Behar', 'Coochbehar', 'Alipurduar', 'Jalpaiguri', 'Darjeeling', 'Kalimpong',
    'Amaravati', 'Tiruvalla', 'Cherthala', 'Perinthalmanna', 'Manjeri', 'Ponnani',
    'Tirur', 'Kasaragod', 'Kannur', 'Wayanad', 'Idukki', 'Pathanamthitta',
    'Kottayam', 'Alappuzha', 'Palakkad', 'Thrissur', 'Ernakulam', 'Malappuram',
    'Falakata', 'Gangarampur', 'Islampur', 'Jangipur', 'Karimpur', 'Mathabhanga',
    'Mekhliganj', 'Ranaghat', 'Tehatta', 'Tufanganj', 'Uluberia', 'Bali',
  ]

  const allCityNames = [...districtNames.map((d: any) => d.name), ...extraCities]
  // Remove duplicates and sort by length desc
  const unique = [...new Set(allCityNames)].sort((a, b) => b.length - a.length)

  // Load colleges without city
  const colleges = await payload.find({
    collection: 'colleges',
    where: { city: { exists: false } },
    limit: 1000,
    depth: 0,
  })
  payload.logger.info(`Colleges without city: ${colleges.docs.length}`)

  // Load state mapping for context
  const allStates = await payload.find({ collection: 'states', limit: 100, depth: 0 })
  const stateNames = new Map(allStates.docs.map((s: any) => [s.id, s.name]))

  let updated = 0
  let stillMissing = 0

  for (const c of colleges.docs as any[]) {
    const name = c.name?.trim() || ''
    if (!name) { stillMissing++; continue }

    // Try to find a city name in the college name
    let foundCity: string | null = null
    for (const city of unique) {
      const regex = new RegExp(`\\b${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (regex.test(name)) {
        foundCity = city
        break
      }
    }

    if (foundCity) {
      await payload.update({
        collection: 'colleges',
        id: c.id,
        data: { city: foundCity } as any,
        depth: 0,
      })
      updated++
    } else {
      stillMissing++
    }
  }

  payload.logger.info(`Updated: ${updated}, Still missing: ${stillMissing}`)
  
  // Show some still missing for manual fix
  if (stillMissing > 0) {
    const stillMissingColleges = await payload.find({
      collection: 'colleges',
      where: { city: { exists: false } },
      limit: 30,
      depth: 0,
    })
    payload.logger.info('Sample still missing:')
    for (const c of stillMissingColleges.docs as any[]) {
      const stateName = stateNames.get(c.state as string) || 'unknown'
      payload.logger.info(`  [${stateName}] ${c.name}`)
    }
  }

  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
