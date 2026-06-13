import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'

const STATES = [
  { name: 'Andhra Pradesh', code: 'AP', authority: 'Dr. NTR University of Health Sciences', website: 'https://ntruhs.ap.nic.in' },
  { name: 'Arunachal Pradesh', code: 'AR', authority: 'Directorate of Medical Education, Arunachal Pradesh', website: '' },
  { name: 'Assam', code: 'AS', authority: 'Directorate of Medical Education, Assam', website: 'https://dme.assam.gov.in' },
  { name: 'Bihar', code: 'BR', authority: 'BCECEB', website: 'https://bceceboard.bihar.gov.in' },
  { name: 'Chhattisgarh', code: 'CG', authority: 'Directorate of Medical Education, Chhattisgarh', website: 'https://cgdme.gov.in' },
  { name: 'Goa', code: 'GA', authority: 'Directorate of Technical Education, Goa', website: 'https://dte.goa.gov.in' },
  { name: 'Gujarat', code: 'GJ', authority: 'ACPUG', website: 'https://medadmission.gujarat.gov.in' },
  { name: 'Haryana', code: 'HR', authority: 'DMER Haryana', website: 'https://uhsmr.org' },
  { name: 'Himachal Pradesh', code: 'HP', authority: 'HP University / DME', website: 'https://hpushimla.in' },
  { name: 'Jharkhand', code: 'JH', authority: 'JCECEB', website: 'https://jceceb.jharkhand.gov.in' },
  { name: 'Karnataka', code: 'KA', authority: 'KEA', website: 'https://kea.kar.nic.in' },
  { name: 'Kerala', code: 'KL', authority: 'CEE Kerala', website: 'https://cee.kerala.gov.in' },
  { name: 'Madhya Pradesh', code: 'MP', authority: 'DME Madhya Pradesh', website: 'https://dmemadhyapradesh.in' },
  { name: 'Maharashtra', code: 'MH', authority: 'DMER Maharashtra', website: 'https://cetcell.mahacet.org' },
  { name: 'Manipur', code: 'MN', authority: 'Directorate of Health Services, Manipur', website: '' },
  { name: 'Meghalaya', code: 'ML', authority: 'Directorate of Medical Education, Meghalaya', website: '' },
  { name: 'Mizoram', code: 'MZ', authority: 'Directorate of Medical Education, Mizoram', website: '' },
  { name: 'Nagaland', code: 'NL', authority: 'Directorate of Health & Family Welfare, Nagaland', website: '' },
  { name: 'Odisha', code: 'OD', authority: 'OJEE', website: 'https://ojee.nic.in' },
  { name: 'Punjab', code: 'PB', authority: 'Baba Farid University of Health Sciences', website: 'https://bfuhs.ac.in' },
  { name: 'Rajasthan', code: 'RJ', authority: 'DME Rajasthan', website: 'https://medicaleducation.rajasthan.gov.in' },
  { name: 'Sikkim', code: 'SK', authority: 'Directorate of Medical Education, Sikkim', website: '' },
  { name: 'Tamil Nadu', code: 'TN', authority: 'DME Tamil Nadu', website: 'https://tnmedicalselection.net' },
  { name: 'Telangana', code: 'TS', authority: 'KNRUHS', website: 'https://knruhs.in' },
  { name: 'Tripura', code: 'TR', authority: 'Directorate of Medical Education, Tripura', website: '' },
  { name: 'Uttar Pradesh', code: 'UP', authority: 'DGME&T Uttar Pradesh', website: 'https://upneet.gov.in' },
  { name: 'Uttarakhand', code: 'UK', authority: 'Uttarakhand Medical Education Cell', website: 'https://ukmedicaleducation.in' },
  { name: 'West Bengal', code: 'WB', authority: 'WBMCC', website: 'https://wbmcc.nic.in' },
]

const FAQ_ITEMS = [
  { question: 'What is NEET Counselling 2026?', answer: 'NEET Counselling 2026 is the official seat allotment process for MBBS, BDS, AYUSH, and BVSC courses in India conducted by MCC for AIQ seats and by state authorities for state quota seats.', category: 'counselling' as const, order: 1 },
  { question: 'When will NEET Counselling 2026 start?', answer: 'MCC NEET UG 2026 counselling is expected to start in the first or third week of July 2026. Registration window is typically only 4-7 days after results. State counselling schedules vary by state.', category: 'counselling' as const, order: 2 },
  { question: 'What is the minimum NEET score required?', answer: 'General/EWS: 50th percentile (approx 137+), OBC/SC/ST: 40th percentile (approx 107+), PwD: 45th percentile. Actual cutoffs vary by college type and state.', category: 'exam' as const, order: 3 },
  { question: 'What documents are needed for NEET counselling?', answer: 'NEET Admit Card, Scorecard, Class 10 & 12 marksheets, Aadhaar Card, passport photos, Allotment Letter, Transfer Certificate, Character Certificate. Category certificates where applicable.', category: 'admission' as const, order: 4 },
  { question: 'Should I register for both AIQ and State counselling?', answer: 'Yes. AIQ registration on mcc.nic.in covers 15% seats. State registration on your state portal covers 85% seats. Missing either loses access to those seats.', category: 'counselling' as const, order: 5 },
  { question: 'How many rounds are in NEET counselling?', answer: 'MCC conducts 4 rounds: Round 1, Round 2, Mop-Up Round, and Stray Vacancy Round. States typically have 3-5 rounds. Participate in all rounds.', category: 'counselling' as const, order: 6 },
  { question: 'Can I get MBBS with 400 marks?', answer: 'Yes, in private colleges under state/management quota, or MBBS abroad (Russia, Bangladesh, Georgia) at ₹18-30L total cost. Govt colleges typically require 550+.', category: 'admission' as const, order: 7 },
  { question: 'What is AIQ counselling?', answer: 'All India Quota counselling by MCC for 15% govt college seats + 100% seats in Deemed Universities, Central Universities, ESIC, AIIMS/JIPMER. Open to all Indian students.', category: 'counselling' as const, order: 8 },
  { question: 'How does state quota counselling work?', answer: 'State quota covers 85% of seats in govt medical colleges. Eligibility based on state domicile. Each state has its own authority, schedule, and reservation policy.', category: 'counselling' as const, order: 9 },
  { question: 'Is MBBS abroad a good option?', answer: 'Yes, at ₹16-30L total vs ₹50L+ for Indian private colleges. Must pass FMGE/NExT to practice in India. Verify NMC recognition before admission.', category: 'admission' as const, order: 10 },
  { question: 'What are MBBS fees in India?', answer: 'AIIMS: ₹1,390/yr, State Govt: ₹15K-1L/yr, Private: ₹5-20L/yr, Deemed: ₹10-25L/yr, Abroad: ₹3-5L/yr.', category: 'pricing' as const, order: 11 },
  { question: 'Can I change college preference after locking?', answer: 'No, locked choices cannot be modified in that round. You can fill fresh choices in subsequent rounds if not satisfied with allotment.', category: 'counselling' as const, order: 12 },
  { question: 'What is the mop-up round?', answer: 'The third round of MCC counselling filling seats vacant after Round 2. Never skip it as better seats may open up.', category: 'counselling' as const, order: 13 },
  { question: 'How to verify NMC approved colleges?', answer: 'Visit nmc.org.in for the list of recognized medical colleges in India. For abroad colleges, check the list of foreign medical institutions on the same site.', category: 'admission' as const, order: 14 },
  { question: 'What is the reservation policy?', answer: 'Central: SC (15%), ST (7.5%), OBC-NCL (27%), EWS (10%), PWBD (5% horizontal). States have additional local reservations.', category: 'exam' as const, order: 15 },
  { question: 'What if I miss the registration deadline?', answer: 'You cannot participate in that round. You may register for subsequent rounds. For AIQ counselling, missing registration means losing your chance for that round.', category: 'counselling' as const, order: 16 },
  { question: 'How can I get help with NEET counselling?', answer: 'Expert NEET counsellors provide personalized guidance for college selection, choice filling, and admission support tailored to your rank and preferences.', category: 'counselling' as const, order: 17 },
  { question: 'Can NRI students apply?', answer: 'Yes. NRI students are eligible for NRI quota seats in private colleges and deemed universities. Must have qualified NEET and meet eligibility criteria.', category: 'admission' as const, order: 18 },
]

async function seedStates(payload: Awaited<ReturnType<typeof getPayload>>) {
  const existing = await payload.find({ collection: 'states', limit: 1, depth: 0 })
  if (existing.docs.length > 0) {
    payload.logger.info(`States already seeded (${existing.totalDocs} existing), skipping.`)
    return existing.totalDocs
  }

  let count = 0
  for (const state of STATES) {
    await payload.create({
      collection: 'states',
      data: {
        name: state.name,
        slug: state.name.toLowerCase().replace(/\s+/g, '-'),
        code: state.code,
        counsellingAuthority: state.authority,
        counsellingWebsite: state.website,
        counsellingProcess: `${state.name} NEET counselling is conducted by ${state.authority}. Students must register on the official portal and participate in choice filling and seat allotment rounds.`,
        status: 'active',
        order: count + 1,
      },
      depth: 0,
    })
    count++
    payload.logger.info(`  Created state: ${state.name}`)
  }
  payload.logger.info(`Seeded ${count} states.`)
  return count
}

async function seedFAQ(payload: Awaited<ReturnType<typeof getPayload>>) {
  const existing = await payload.find({ collection: 'helpdesk', limit: 1, depth: 0 })
  if (existing.docs.length > 0) {
    payload.logger.info(`FAQ items already seeded (${existing.totalDocs} existing), skipping.`)
    return existing.totalDocs
  }

  let count = 0
  for (const faq of FAQ_ITEMS) {
    await payload.create({
      collection: 'helpdesk',
      data: {
      question: faq.question,
      answer: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [{ type: 'text', text: faq.answer, version: 1 }],
          direction: 'ltr',
        },
      },
      category: faq.category,
        order: faq.order,
        status: 'active',
      },
      depth: 0,
    })
    count++
  }
  payload.logger.info(`Seeded ${count} FAQ items.`)
  return count
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting content seed...')

  const stateCount = await seedStates(payload)
  const faqCount = await seedFAQ(payload)

  payload.logger.info(`\nSeed summary: States=${stateCount}, FAQ=${faqCount}`)
  payload.logger.info('Content seed completed.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
