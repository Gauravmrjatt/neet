export const INDIA_CITIES = [
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra', population: '12M+' },
  { slug: 'delhi', name: 'Delhi', state: 'Delhi', population: '11M+' },
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka', population: '8.4M+' },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra', population: '3.1M+' },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu', population: '4.6M+' },
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana', population: '6.8M+' },
  { slug: 'kolkata', name: 'Kolkata', state: 'West Bengal', population: '4.5M+' },
  { slug: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', population: '5.6M+' },
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan', population: '3.1M+' },
  { slug: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', population: '2.8M+' },
  { slug: 'nagpur', name: 'Nagpur', state: 'Maharashtra', population: '2.4M+' },
  { slug: 'indore', name: 'Indore', state: 'Madhya Pradesh', population: '2.0M+' },
  { slug: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', population: '1.9M+' },
  { slug: 'surat', name: 'Surat', state: 'Gujarat', population: '4.5M+' },
  { slug: 'patna', name: 'Patna', state: 'Bihar', population: '1.7M+' },
  { slug: 'chandigarh', name: 'Chandigarh', state: 'Chandigarh', population: '1.0M+' },
  { slug: 'kochi', name: 'Kochi', state: 'Kerala', population: '0.6M+' },
  { slug: 'thiruvananthapuram', name: 'Thiruvananthapuram', state: 'Kerala', population: '0.7M+' },
  { slug: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', population: '1.0M+' },
  { slug: 'guwahati', name: 'Guwahati', state: 'Assam', population: '0.9M+' },
] as const

export type CitySlug = (typeof INDIA_CITIES)[number]['slug']

export function getCityBySlug(slug: string) {
  return INDIA_CITIES.find((c) => c.slug === slug) || null
}
