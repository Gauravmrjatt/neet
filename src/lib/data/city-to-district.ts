export interface CityMapping {
  city: string
  districtSlug: string
  districtName: string
}

const OVERRIDE_MAP: Record<string, { slug: string; name: string }> = {
  'banglore': { slug: 'bengaluru-urban', name: 'Bengaluru Urban' },
  'belgaum': { slug: 'belagavi', name: 'Belagavi' },
  'mangalore': { slug: 'dakshina-kannada', name: 'Dakshina Kannada' },
  'bellary': { slug: 'bellary', name: 'Bellary' },
  'gulbarga': { slug: 'kalaburagi', name: 'Kalaburagi' },
  'bijapur': { slug: 'vijayapura', name: 'Vijayapura' },
  'shimoga': { slug: 'shivamogga', name: 'Shivamogga' },
  'mysuru': { slug: 'mysuru', name: 'Mysuru' },
  'mangaluru': { slug: 'dakshina-kannada', name: 'Dakshina Kannada' },
  'hubli': { slug: 'dharwad', name: 'Dharwad' },
  'yadgiri': { slug: 'yadgir', name: 'Yadgir' },
  'indiranagar': { slug: 'bengaluru-urban', name: 'Bengaluru Urban' },

  'mumbai': { slug: 'mumbai-city', name: 'Mumbai City' },
  'navi mumbai': { slug: 'thane', name: 'Thane' },
  'andheri': { slug: 'mumbai-suburban', name: 'Mumbai Suburban' },
  'nerul': { slug: 'thane', name: 'Thane' },
  'panvel': { slug: 'raigad', name: 'Raigad' },
  'vashi': { slug: 'thane', name: 'Thane' },
  'ambernath': { slug: 'thane', name: 'Thane' },
  'sholapur': { slug: 'solapur', name: 'Solapur' },
  'alibag': { slug: 'raigad', name: 'Raigad' },
  'loni': { slug: 'ahmednagar', name: 'Ahmednagar' },
  'karad': { slug: 'satara', name: 'Satara' },
  'miraj': { slug: 'sangli', name: 'Sangli' },
  'ambajogai': { slug: 'bid', name: 'Bid' },
  'sevagram wardha': { slug: 'wardha', name: 'Wardha' },
  'datta meghe, wardha': { slug: 'wardha', name: 'Wardha' },

  'new delhi': { slug: 'delhi', name: 'Delhi' },
  'basaidarapur': { slug: 'delhi', name: 'Delhi' },
  'jamia millia islamia, new delhi': { slug: 'delhi', name: 'Delhi' },

  'chandigar': { slug: 'chandigarh', name: 'Chandigarh' },

  'pondicherry': { slug: 'puducherry', name: 'Puducherry' },

  'silcher': { slug: 'cachar', name: 'Cachar' },
  'beltola': { slug: 'kamrup-metropolitan', name: 'Kamrup Metropolitan' },
  'north lakhimpur': { slug: 'lakhimpur', name: 'Lakhimpur' },
  'guwahati': { slug: 'kamrup-metropolitan', name: 'Kamrup Metropolitan' },

  'bihta': { slug: 'patna', name: 'Patna' },
  'laheriasarai': { slug: 'darbhanga', name: 'Darbhanga' },
  'nalanda': { slug: 'nalanda', name: 'Nalanda' },

  'chhainsa': { slug: 'faridabad', name: 'Faridabad' },
  'koriawas': { slug: 'rewari', name: 'Rewari' },
  'mullana': { slug: 'ambala', name: 'Ambala' },
  'nalhar': { slug: 'nuh', name: 'Nuh' },
  'pt.bds univ.of health sci, rohtak': { slug: 'rohtak', name: 'Rohtak' },
  'sonepat': { slug: 'sonipat', name: 'Sonipat' },

  'baroda': { slug: 'vadodara', name: 'Vadodara' },
  'panchmahal godhra': { slug: 'panchmahal', name: 'Panchmahal' },
  'rajpipla': { slug: 'narmada', name: 'Narmada' },

  'tanda': { slug: 'kangra', name: 'Kangra' },

  'hazaribag': { slug: 'hazaribagh', name: 'Hazaribagh' },
  'rims, ranchi': { slug: 'ranchi', name: 'Ranchi' },
  'palamu': { slug: 'palamu', name: 'Palamu' },
  'dumka': { slug: 'dumka', name: 'Dumka' },

  'trivandrum': { slug: 'thiruvananthapuram', name: 'Thiruvananthapuram' },
  'allappuzha': { slug: 'alappuzha', name: 'Alappuzha' },
  'kozhikode': { slug: 'kozhikode', name: 'Kozhikode' },
  'kozikode': { slug: 'kozhikode', name: 'Kozhikode' },
  'ernakulam': { slug: 'ernakulam', name: 'Ernakulam' },
  'kochi': { slug: 'ernakulam', name: 'Ernakulam' },
  'konni': { slug: 'pathanamthitta', name: 'Pathanamthitta' },
  'manjeri': { slug: 'malappuram', name: 'Malappuram' },
  'esic, kollam': { slug: 'kollam', name: 'Kollam' },

  'bhopal': { slug: 'bhopal', name: 'Bhopal' },
  'indore': { slug: 'indore', name: 'Indore' },
  'medical college and hospital, indore': { slug: 'indore', name: 'Indore' },
  'gwalior': { slug: 'gwalior', name: 'Gwalior' },
  'rewa': { slug: 'rewa', name: 'Rewa' },
  'jabalpur': { slug: 'jabalpur', name: 'Jabalpur' },
  'sagar': { slug: 'sagar', name: 'Sagar' },
  'datia': { slug: 'datia', name: 'Datia' },
  'vidisha': { slug: 'vidisha', name: 'Vidisha' },
  'khandwa': { slug: 'khandwa', name: 'Khandwa' },
  'neemuch': { slug: 'neemuch', name: 'Neemuch' },
  'seoni': { slug: 'seoni', name: 'Seoni' },

  'bhubaneswar': { slug: 'khordha', name: 'Khordha' },
  'cuttack': { slug: 'cuttack', name: 'Cuttack' },
  'burla': { slug: 'sambalpur', name: 'Sambalpur' },
  'brahmapur': { slug: 'ganjam', name: 'Ganjam' },
  'baripada': { slug: 'mayurbhanj', name: 'Mayurbhanj' },
  'balangir': { slug: 'balangir', name: 'Balangir' },
  'balasore': { slug: 'baleshwar', name: 'Baleshwar' },
  'phulbani': { slug: 'kandhamal', name: 'Kandhamal' },

  'hyderbad': { slug: 'hyderabad', name: 'Hyderabad' },
  'bhadradri': { slug: 'bhadradri-kothagudem', name: 'Bhadradri Kothagudem' },
  'jogulamba, gadwal': { slug: 'jogulamba-gadwal', name: 'Jogulamba Gadwal' },
  'kumuram bheem asifabad': { slug: 'kumuram-bheem-asifabad', name: 'Kumuram Bheem Asifabad' },
  'mahabubangar': { slug: 'mahabubnagar', name: 'Mahabubnagar' },
  'mahabubabad': { slug: 'mahabubabad', name: 'Mahabubabad' },
  'maheshwaram': { slug: 'vikarabad', name: 'Vikarabad' },
  'quthbullapur': { slug: 'medchal-malkajgiri', name: 'Medchal Malkajgiri' },
  'kodangal': { slug: 'vikarabad', name: 'Vikarabad' },
  'yadadri': { slug: 'yadadri-bhuvanagiri', name: 'Yadadri Bhuvanagiri' },
  'sangareddy': { slug: 'sangareddy', name: 'Sangareddy' },
  'nagarkurnool': { slug: 'nagarkurnool', name: 'Nagarkurnool' },
  'narayanpet': { slug: 'narayanpet', name: 'Narayanpet' },
  'wanaparthy': { slug: 'wanaparthy', name: 'Wanaparthy' },
  'jagtial': { slug: 'jagtial', name: 'Jagtial' },
  'mancherial': { slug: 'mancherial', name: 'Mancherial' },
  'ramagundam': { slug: 'peddapalli', name: 'Peddapalli' },
  'mulugu': { slug: 'mulugu', name: 'Mulugu' },
  'medak': { slug: 'medak', name: 'Medak' },
  'nizamabad': { slug: 'nizamabad', name: 'Nizamabad' },

  'agra': { slug: 'agra', name: 'Agra' },
  'allahabad': { slug: 'prayagraj', name: 'Prayagraj' },
  'amu, aligarh': { slug: 'aligarh', name: 'Aligarh' },
  'bhu, varanasi': { slug: 'varanasi', name: 'Varanasi' },
  'kg med univ, lucknow': { slug: 'lucknow', name: 'Lucknow' },
  'greater noida': { slug: 'gautam-buddha-nagar', name: 'Gautam Buddha Nagar' },
  'noida': { slug: 'gautam-buddha-nagar', name: 'Gautam Buddha Nagar' },
  'kanpur dehat': { slug: 'kanpur-dehat', name: 'Kanpur Dehat' },
  'lakhimpur kheri': { slug: 'lakhimpur-kheri', name: 'Lakhimpur Kheri' },
  'siddharthnagar': { slug: 'siddharthnagar', name: 'Siddharthnagar' },
  'shahjhanpur': { slug: 'shahjahanpur', name: 'Shahjahanpur' },
  'sonebhadra': { slug: 'sonbhadra', name: 'Sonbhadra' },
  'amethi': { slug: 'amethi', name: 'Amethi' },
  'chandauli': { slug: 'chandauli', name: 'Chandauli' },
  'kaushambi': { slug: 'kaushambi', name: 'Kaushambi' },
  'kanpur': { slug: 'kanpur-nagar', name: 'Kanpur Nagar' },
  'jhansi': { slug: 'jhansi', name: 'Jhansi' },
  'fatehpur': { slug: 'fatehpur', name: 'Fatehpur' },
  'etah': { slug: 'etah', name: 'Etah' },
  'hardoi': { slug: 'hardoi', name: 'Hardoi' },
  'jalaun': { slug: 'jalaun', name: 'Jalaun' },
  'kannauj': { slug: 'kannauj', name: 'Kannauj' },
  'pilibhit': { slug: 'pilibhit', name: 'Pilibhit' },
  'saifai': { slug: 'etawah', name: 'Etawah' },
  'sehud, auraiya': { slug: 'auraiya', name: 'Auraiya' },

  'ananthapuram': { slug: 'anantapuramu', name: 'Anantapuramu' },
  'kakinada': { slug: 'kakinada', name: 'Kakinada' },
  'rajamahendravaram': { slug: 'east-godavari', name: 'East Godavari' },
  'thalarasingi village': { slug: 'srikakulam', name: 'Srikakulam' },
  'vijayawada': { slug: 'ntr', name: 'NTR' },
  'ongole': { slug: 'prakasam', name: 'Prakasam' },
  'eluru': { slug: 'eluru', name: 'Eluru' },
  'tirupati': { slug: 'tirupati', name: 'Tirupati' },
  'kadapa': { slug: 'ysr', name: 'YSR' },
  'kurnool': { slug: 'kurnool', name: 'Kurnool' },

  'agartala': { slug: 'west-tripura', name: 'West Tripura' },

  'jamshedpur': { slug: 'east-singhbhum', name: 'East Singhbhum' },

  'bhiwani': { slug: 'bhiwani', name: 'Bhiwani' },
  'faridabad': { slug: 'faridabad', name: 'Faridabad' },
  'karnal': { slug: 'karnal', name: 'Karnal' },
  'rohtak': { slug: 'rohtak', name: 'Rohtak' },

  'azamgarh': { slug: 'azamgarh', name: 'Azamgarh' },
  'baghpat': { slug: 'baghpat', name: 'Baghpat' },
  'bahraich': { slug: 'bahraich', name: 'Bahraich' },
  'ballia': { slug: 'ballia', name: 'Ballia' },
  'banda': { slug: 'banda', name: 'Banda' },
  'barabanki': { slug: 'barabanki', name: 'Barabanki' },
  'bareilly': { slug: 'bareilly', name: 'Bareilly' },
  'basti': { slug: 'basti', name: 'Basti' },
  'bijnor': { slug: 'bijnor', name: 'Bijnor' },
  'buduan': { slug: 'budaun', name: 'Budaun' },
  'bulandshahr': { slug: 'bulandshahr', name: 'Bulandshahr' },
  'deoria': { slug: 'deoria', name: 'Deoria' },
  'etawah': { slug: 'etawah', name: 'Etawah' },
  'faizabad': { slug: 'ayodhya', name: 'Ayodhya' },
  'farrukhabad': { slug: 'farrukhabad', name: 'Farrukhabad' },
  'firozabad': { slug: 'firozabad', name: 'Firozabad' },
  'gautam buddha nagar': { slug: 'gautam-buddha-nagar', name: 'Gautam Buddha Nagar' },
  'ghaziabad': { slug: 'ghaziabad', name: 'Ghaziabad' },
  'ghazipur': { slug: 'ghazipur', name: 'Ghazipur' },
  'gonda': { slug: 'gonda', name: 'Gonda' },
  'gorakhpur': { slug: 'gorakhpur', name: 'Gorakhpur' },
  'hamirpur': { slug: 'hamirpur', name: 'Hamirpur' },
  'hapur': { slug: 'hapur', name: 'Hapur' },
  'hathras': { slug: 'hathras', name: 'Hathras' },
  'jaunpur': { slug: 'jaunpur', name: 'Jaunpur' },
  'kushinagar': { slug: 'kushinagar', name: 'Kushinagar' },
  'lalitpur': { slug: 'lalitpur', name: 'Lalitpur' },
  'lucknow': { slug: 'lucknow', name: 'Lucknow' },
  'mahoba': { slug: 'mahoba', name: 'Mahoba' },
  'mainpuri': { slug: 'mainpuri', name: 'Mainpuri' },
  'mathura': { slug: 'mathura', name: 'Mathura' },
  'meerut': { slug: 'meerut', name: 'Meerut' },
  'mirzapur': { slug: 'mirzapur', name: 'Mirzapur' },
  'moradabad': { slug: 'moradabad', name: 'Moradabad' },
  'muzaffarnagar': { slug: 'muzaffarnagar', name: 'Muzaffarnagar' },
  'pratapgarh': { slug: 'pratapgarh', name: 'Pratapgarh' },
  'raebareli': { slug: 'raebareli', name: 'Raebareli' },
  'saharanpur': { slug: 'saharanpur', name: 'Saharanpur' },
  'sambhal': { slug: 'sambhal', name: 'Sambhal' },
  'shahjahanpur': { slug: 'shahjahanpur', name: 'Shahjahanpur' },
  'sitapur': { slug: 'sitapur', name: 'Sitapur' },
  'sultanpur': { slug: 'sultanpur', name: 'Sultanpur' },
  'unnao': { slug: 'unnao', name: 'Unnao' },
  'varanasi': { slug: 'varanasi', name: 'Varanasi' },

  'ajmer': { slug: 'ajmer', name: 'Ajmer' },
  'alwar': { slug: 'alwar', name: 'Alwar' },
  'banswara': { slug: 'banswara', name: 'Banswara' },
  'baran': { slug: 'baran', name: 'Baran' },
  'barmer': { slug: 'barmer', name: 'Barmer' },
  'bharatpur': { slug: 'bharatpur', name: 'Bharatpur' },
  'bhilwara': { slug: 'bhilwara', name: 'Bhilwara' },
  'bikaner': { slug: 'bikaner', name: 'Bikaner' },
  'bundi': { slug: 'bundi', name: 'Bundi' },
  'chittorgarh': { slug: 'chittorgarh', name: 'Chittorgarh' },
  'churu': { slug: 'churu', name: 'Churu' },
  'dausa': { slug: 'dausa', name: 'Dausa' },
  'dholpur': { slug: 'dholpur', name: 'Dholpur' },
  'dungarpur': { slug: 'dungarpur', name: 'Dungarpur' },
  'hanumangarh': { slug: 'hanumangarh', name: 'Hanumangarh' },
  'jaipur': { slug: 'jaipur', name: 'Jaipur' },
  'jaisalmer': { slug: 'jaisalmer', name: 'Jaisalmer' },
  'jalor': { slug: 'jalor', name: 'Jalor' },
  'jhunjhunu': { slug: 'jhunjhunu', name: 'Jhunjhunu' },
  'jodhpur': { slug: 'jodhpur', name: 'Jodhpur' },
  'karauli': { slug: 'karauli', name: 'Karauli' },
  'kota': { slug: 'kota', name: 'Kota' },
  'nagaur': { slug: 'nagaur', name: 'Nagaur' },
  'pali': { slug: 'pali', name: 'Pali' },
  'pratapgarh rj': { slug: 'pratapgarh', name: 'Pratapgarh' },
  'sawai madhopur': { slug: 'sawai-madhopur', name: 'Sawai Madhopur' },
  'sikar': { slug: 'sikar', name: 'Sikar' },
  'sirohi': { slug: 'sirohi', name: 'Sirohi' },
  'sriganganagar': { slug: 'sri-ganganagar', name: 'Sri Ganganagar' },
  'tonk': { slug: 'tonk', name: 'Tonk' },
  'udaipur': { slug: 'udaipur', name: 'Udaipur' },

  'chennai': { slug: 'chennai', name: 'Chennai' },
  'coimbatore': { slug: 'coimbatore', name: 'Coimbatore' },
  'madurai': { slug: 'madurai', name: 'Madurai' },
  'tiruchirapalli': { slug: 'tiruchirappalli', name: 'Tiruchirappalli' },
  'tirunelveli': { slug: 'tirunelveli', name: 'Tirunelveli' },
  'salem': { slug: 'salem', name: 'Salem' },
  'thoothukudi': { slug: 'thoothukudi', name: 'Thoothukudi' },
  'dharmapuri': { slug: 'dharmapuri', name: 'Dharmapuri' },
  'dindigul': { slug: 'dindigul', name: 'Dindigul' },
  'erode': { slug: 'erode', name: 'Erode' },
  'kancheepuram': { slug: 'kancheepuram', name: 'Kancheepuram' },
  'kanniyakumari': { slug: 'kanyakumari', name: 'Kanyakumari' },
  'karur': { slug: 'karur', name: 'Karur' },
  'krishnagiri': { slug: 'krishnagiri', name: 'Krishnagiri' },
  'namakkal': { slug: 'namakkal', name: 'Namakkal' },
  'nilgiris': { slug: 'nilgiris', name: 'Nilgiris' },
  'perambalur': { slug: 'perambalur', name: 'Perambalur' },
  'pudukkottai': { slug: 'pudukkottai', name: 'Pudukkottai' },
  'ramanathapuram': { slug: 'ramanathapuram', name: 'Ramanathapuram' },
  'sivaganga': { slug: 'sivaganga', name: 'Sivaganga' },
  'thanjavur': { slug: 'thanjavur', name: 'Thanjavur' },
  'theni': { slug: 'theni', name: 'Theni' },
  'thiruvallur': { slug: 'tiruvallur', name: 'Tiruvallur' },
  'thiruvannamalai': { slug: 'tiruvannamalai', name: 'Tiruvannamalai' },
  'thiruvarur': { slug: 'tiruvarur', name: 'Tiruvarur' },
  'tiruppur': { slug: 'tiruppur', name: 'Tiruppur' },
  'tiruvannamalai': { slug: 'tiruvannamalai', name: 'Tiruvannamalai' },
  'vellore': { slug: 'vellore', name: 'Vellore' },
  'villupuram': { slug: 'villupuram', name: 'Villupuram' },
  'virudhunagar': { slug: 'virudhunagar', name: 'Virudhunagar' },
  'ariyalur': { slug: 'ariyalur', name: 'Ariyalur' },
  'asaripallam': { slug: 'kanyakumari', name: 'Kanyakumari' },
  'chengalpattu': { slug: 'chengalpattu', name: 'Chengalpattu' },
  'kallakurichi': { slug: 'kallakurichi', name: 'Kallakurichi' },
  'nagapattinam': { slug: 'nagapattinam', name: 'Nagapattinam' },
  'omandurar': { slug: 'chennai', name: 'Chennai' },
  'perundurai': { slug: 'erode', name: 'Erode' },

  'anantnag': { slug: 'anantnag', name: 'Anantnag' },
  'baramulla': { slug: 'baramulla', name: 'Baramulla' },
  'bemina': { slug: 'srinagar', name: 'Srinagar' },
  'doda': { slug: 'doda', name: 'Doda' },
  'handwara': { slug: 'kupwara', name: 'Kupwara' },
  'jammu': { slug: 'jammu', name: 'Jammu' },
  'kathua': { slug: 'kathua', name: 'Kathua' },
  'rajouri': { slug: 'rajouri', name: 'Rajouri' },
  'srinagar': { slug: 'srinagar', name: 'Srinagar' },
  'udhampur': { slug: 'udhampur', name: 'Udhampur' },

  'joka': { slug: 'south-24-parganas', name: 'South 24 Parganas' },
  'kalyani': { slug: 'nadia', name: 'Nadia' },
  'burdwan': { slug: 'purba-bardhaman', name: 'Purba Bardhaman' },
  'midnapur': { slug: 'paschim-medinipur', name: 'Paschim Medinipur' },
  'mursidabad': { slug: 'murshidabad', name: 'Murshidabad' },
  'sushrutnagar': { slug: 'bankura', name: 'Bankura' },
  'darjeeling': { slug: 'darjeeling', name: 'Darjeeling' },
  'jalpaiguri': { slug: 'jalpaiguri', name: 'Jalpaiguri' },
  'bankura': { slug: 'bankura', name: 'Bankura' },
  'malda': { slug: 'malda', name: 'Malda' },
  'kolkata': { slug: 'kolkata', name: 'Kolkata' },
}

export function normalizeCity(raw: string): string {
  let city = raw.trim()

  const commaIdx = city.indexOf(',')
  if (commaIdx > 0) {
    city = city.slice(commaIdx + 1).trim()
  }

  const prefixes = ['ESIC, ', 'RIMS, ', 'PT.', 'DR.', 'STD, ']
  for (const prefix of prefixes) {
    if (city.toUpperCase().startsWith(prefix.toUpperCase())) {
      city = city.slice(prefix.length).trim()
      break
    }
  }

  city = city.replace(/\s+/g, ' ').trim()

  return city
}

export function getDistrictSlug(cityName: string, stateSlug?: string): string | null {
  if (!cityName) return null

  const normalized = normalizeCity(cityName).toLowerCase().trim()

  const override = OVERRIDE_MAP[normalized]
  if (override) return override.slug

  const hyphenated = normalized.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

  return hyphenated || null
}

export function getDistrictName(cityName: string): string | null {
  if (!cityName) return null

  const normalized = normalizeCity(cityName).toLowerCase().trim()

  const override = OVERRIDE_MAP[normalized]
  if (override) return override.name

  const parts = normalized.split(/\s+/).map(p => p.charAt(0).toUpperCase() + p.slice(1))
  return parts.join(' ') || null
}

export function cleanCityForCollege(raw: string): string {
  const commaIdx = raw.indexOf(',')
  if (commaIdx > 0) {
    return raw.slice(commaIdx + 1).trim()
  }
  return raw.trim()
}

export function prepareDistrictSeed(
  cities: string[],
  stateSlug: string,
): { name: string; slug: string; cityNames: string[] }[] {
  const districtMap = new Map<string, { name: string; slug: string; cityNames: string[] }>()

  for (const city of cities) {
    const slug = getDistrictSlug(city, stateSlug)
    const name = getDistrictName(city)
    if (!slug || !name) continue

    if (!districtMap.has(slug)) {
      districtMap.set(slug, { name, slug, cityNames: [] })
    }
    districtMap.get(slug)!.cityNames.push(city)
  }

  return [...districtMap.values()]
}
