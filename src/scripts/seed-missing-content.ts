import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { markdownToLexical } from './lib/lexical-builder'

const SUBPAGE_TYPES = [
  'neet-counselling', 'mbbs-admission', 'cutoff', 'fees',
  'documents-required', 'choice-filling', 'seat-matrix',
  'all-medical-colleges', 'government-medical-colleges', 'private-medical-colleges',
  'mcc-counselling', 'state-counselling', 'expected-cutoff',
  'important-dates', 'faq', 'news', 'updates',
] as const

function getDistrictCutoffRange(district: any, cutoffs: any[]): { min: number; max: number } | null {
  if (cutoffs.length === 0) return null
  const genCutoffs = cutoffs
    .filter((c: any) => c.category === 'General' && c.closingRank > 0)
    .map((c: any) => c.closingRank)
  if (genCutoffs.length === 0) return null
  return { min: Math.min(...genCutoffs), max: Math.max(...genCutoffs) }
}

function getDistrictFees(colleges: any[]): { min: number; max: number } | null {
  const fees = colleges
    .map((c: any) => c.feeStructure?.mbbsAnnual)
    .filter((f: number | undefined): f is number => typeof f === 'number' && f > 0)
  if (fees.length === 0) return null
  return { min: Math.min(...fees), max: Math.max(...fees) }
}

function generateContent(type: string, ctx: { district: any; state: any; colleges: any[]; cutoffs: any[] }): string {
  const { district, state, colleges, cutoffs } = ctx
  switch (type) {
    case 'neet-counselling':
      return `## NEET Counselling in ${district.name}, ${state.name}

Get complete information about NEET counselling 2026 for students in ${district.name}, ${state.name}. The ${state.name} NEET counselling is conducted by ${state.counsellingAuthority || 'the state counselling authority'} for state quota seats. Students must also register for MCC AIQ counselling for All India Quota seats.

### Key Dates

- NEET Result Declaration: Expected by June 2026
- MCC AIQ Counselling Registration: July–August 2026
- ${state.name} State Counselling Registration: July–September 2026
- Round 1 Allotment: August 2026

### Counselling Process

1. **Registration**: Register on the official counselling portal with NEET roll number and personal details
2. **Document Verification**: Upload scanned copies of required documents
3. **Choice Filling**: Fill your preferred colleges and courses in order of priority
4. **Seat Allotment**: Seats are allotted based on merit, preference, category, and availability
5. **Reporting**: Report to the allotted college with original documents

### Important Links

- Official counselling website: ${state.counsellingWebsite || `${state.name} counselling portal`}
- MCC AIQ counselling: https://mcc.nic.in

For expert guidance on NEET counselling 2026 in ${district.name}, ${state.name}, contact our counsellors who can help you with college selection, choice filling strategy, and admission assistance.`

    case 'mbbs-admission':
      return `## MBBS Admission in ${district.name}, ${state.name}

Learn about the MBBS admission process 2026 for students in ${district.name}, ${state.name}. Admission to MBBS programs is based on NEET UG score, followed by counselling.

### Eligibility Criteria

- Minimum 50% marks in PCB (Physics, Chemistry, Biology) in Class 12 for General category
- 40% for SC/ST/OBC-NCL categories
- 45% for General PwD candidates
- Minimum NEET percentile as per category requirements

### Documents Required

- NEET 2026 Admit Card and Scorecard
- Class 10 and 12 Mark Sheets and Certificates
- Domicile Certificate (for state quota)
- Category Certificate (if applicable)
- Aadhaar Card / Photo ID
- Passport-size photographs

### Admission Process

1. Qualify NEET UG 2026 with required cutoff
2. Register for AIQ counselling on mcc.nic.in
3. Register for ${state.name} state counselling${state.counsellingWebsite ? ` on ${state.counsellingWebsite}` : ''}
4. Fill choices and participate in seat allotment rounds
5. Report to allotted college

${colleges.length > 0 ? `### Medical Colleges Accessible from ${district.name}\n\n${colleges.map((c: any) => `- **${c.name}**${c.city ? ` (${c.city})` : ''}${c.type ? ` — ${c.type} college` : ''}`).join('\n')}` : `### Where Can ${district.name} Students Apply?\n\nSince ${district.name} has limited or no medical colleges, students can apply to colleges across ${state.name} and other states through AIQ counselling.`}`

    case 'cutoff':
      return `## NEET Cutoff for Medical Colleges in ${district.name}, ${state.name}

${cutoffs.length > 0 ? `Based on available cutoff data for medical colleges accessible from ${district.name}:` : `Find the expected NEET cutoff ranks for medical college admission for students from ${district.name}, ${state.name}.`}

### What is NEET Cutoff?

NEET cutoff is the minimum rank or score required to secure admission to a particular medical college. Cutoff ranks vary by college, category, quota type, and year.

### Cutoff Categories

- **General/Open**: Highest cutoff rank for unreserved candidates
- **OBC-NCL**: Relaxed cutoff for Other Backward Classes
- **SC**: Further relaxed cutoff for Scheduled Castes
- **ST**: Most relaxed cutoff for Scheduled Tribes
- **EWS**: Economically Weaker Sections
- **PwD**: Persons with Disabilities

### Factors Affecting Cutoff

- Number of applicants vs available seats
- Difficulty level of NEET exam
- Category and reservation policies
- College reputation and location
- Quota type (AIQ vs State)

${getDistrictCutoffRange(district, cutoffs) ? `### Recent Cutoff Range (General Category)\n\nGeneral category closing rank range for colleges in this district: **${getDistrictCutoffRange(district, cutoffs)!.min.toLocaleString()} — ${getDistrictCutoffRange(district, cutoffs)!.max.toLocaleString()}**` : ''}

### Expected Cutoff 2026

Based on 2025 trends, expect a slight shift in cutoff ranks. Students from ${district.name} should aim for NEET scores well above the previous year's closing ranks for their desired colleges.`

    case 'fees':
      return `## MBBS Fees Structure for Colleges in ${district.name}, ${state.name}

${colleges.length > 0 ? `Detailed fee structure for medical colleges accessible to students from ${district.name}, ${state.name}.` : `Find information about MBBS fees for medical colleges accessible to students from ${district.name}, ${state.name}.`}

### Fee Structure Overview

Type | Annual Fees (Approx)
Government College | ₹10,000 — ₹1,00,000
Private College | ₹5,00,000 — ₹25,00,000
Deemed University | ₹10,00,000 — ₹25,00,000
Central University | ₹1,390 — ₹15,000

${getDistrictFees(colleges) ? `### Fee Range in This District\n\nAnnual MBBS fees for colleges in this district range from **₹${(getDistrictFees(colleges)!.min / 100000).toFixed(1)} Lakh** to **₹${(getDistrictFees(colleges)!.max / 100000).toFixed(1)} Lakh**.` : ''}

### Additional Costs

- Hostel fees: ₹30,000 — ₹2,00,000 per year
- Mess charges: ₹2,000 — ₹5,000 per month
- Books and study materials: ₹10,000 — ₹20,000 per year
- Miscellaneous fees: ₹5,000 — ₹15,000 per year

### Payment Options

Most colleges offer annual or semester-wise payment. Some private institutions may require a one-time donation or capitation fee. Education loans are available from banks for eligible students.

For personalised fee analysis and college comparison in ${district.name}, ${state.name}, consult our expert counsellors.`

    case 'documents-required':
      return `## Documents Required for NEET Counselling 2026 in ${district.name}, ${state.name}

List of essential documents needed for NEET UG 2026 counselling registration, document verification, and college reporting for students from ${district.name}, ${state.name}.

### Mandatory Documents

1. **NEET 2026 Admit Card** — Issued by NTA
2. **NEET 2026 Scorecard / Rank Letter** — Download from nta.nic.in
3. **Class 10 Mark Sheet and Certificate** — Proof of date of birth
4. **Class 12 Mark Sheet and Certificate** — Academic qualification proof
5. **Domicile Certificate** — For state quota eligibility${state.name !== district.name ? ` in ${state.name}` : ''}
6. **Category Certificate** — SC/ST/OBC-NCL/EWS (if applicable)
7. **PwD Certificate** — If claiming disability reservation
8. **Aadhaar Card** — Government ID proof
9. **Passport-size Photographs** — 5-6 recent photographs
10. **Provisional Allotment Letter** — Downloaded from counselling portal

### State-Specific Requirements for ${state.name}

${state.counsellingWebsite ? `- Certificate of local residency\n- ${state.name} NEUT (if applicable)\n- School leaving certificate from ${state.name} board\n\nDetailed state-specific requirements are available on the official portal: ${state.counsellingWebsite}` : `Students from ${district.name} may need additional state-specific documents for ${state.name} state counselling. Check the official ${state.name} counselling authority website for the complete list.`}

### Important Tips

- Keep original documents and at least 3 sets of self-attested photocopies
- Get documents attested by a gazetted officer if required
- Upload clear, legible scanned copies for online registration
- Carry all documents in a secure folder on reporting day`

    case 'choice-filling':
      return `## Choice Filling for NEET Counselling in ${district.name}, ${state.name}

Master the choice filling process for NEET UG 2026 counselling. Making the right choice sequence is crucial for getting your preferred college and course.

### Understanding Choice Filling

Choice filling is the process where you list your preferred colleges and courses in order of priority. The counselling system allocates seats based on your NEET rank, choices, category, and seat availability.

### Choice Filling Strategy

1. **Research Ahead**: Study cutoff trends of previous years for colleges you're interested in
2. **Create Priority List**: Arrange colleges from most to least desired
3. **Include Safety Options**: Add colleges with lower cutoffs as backup
4. **Consider All Quotas**: Fill choices under both AIQ and state quota if applicable
5. **Use All Options**: Fill maximum possible choices — unused choices don't affect your chances

### Sample Choice Sequence

**Priority 1-10 (Dream Colleges)**: Top government medical colleges
**Priority 11-30 (Realistic)**: Government colleges you have good chances at
**Priority 31-60 (Safe)**: Private colleges with acceptable fees
**Priority 61+ (Backup)**: All remaining options

### Mistakes to Avoid

- Not researching college cutoff trends before filling choices
- Leaving choices unfilled — always fill all available slots
- Forgetting to lock choices after filling
- Not considering commute and accommodation costs
- Ignoring bond requirements for certain colleges

For expert choice filling assistance for ${district.name}, ${state.name} students, connect with our NEET counselling specialists.`

    case 'seat-matrix':
      return `## Seat Matrix for Medical Colleges in ${district.name}, ${state.name}

Understanding the seat distribution in medical colleges helps plan your counselling strategy effectively.

### Seat Distribution

Medical college seats are distributed across various quotas:

- **All India Quota (AIQ)**: 15% of total seats in government medical colleges
- **State Quota**: 85% of seats in state government medical colleges
- **Central Universities**: 100% seats through MCC counselling
- **Deemed Universities**: 100% seats through MCC counselling
- **Private Colleges**: State counselling or institutional level

### Category-wise Reservation (Central)

Category | Reservation %
General | —
EWS | 10%
OBC-NCL | 27%
SC | 15%
ST | 7.5%
PwD | 5% (horizontal)

### ${state.name} State Quota Reservation

${state.name} has its own reservation policy for state quota seats. Check the official ${state.counsellingWebsite || state.counsellingAuthority || `${state.name} counselling authority`} website for the detailed reservation breakdown.

### Tips for ${district.name} Students

- Know the seat matrix of colleges you're applying to
- Calculate your chances based on your category and rank
- Apply under all eligible quotas to maximize options
- Keep track of seat availability changes across counselling rounds`

    case 'all-medical-colleges':
      return `## Medical Colleges in ${district.name}, ${state.name}

${colleges.length > 0 ? `${district.name} has the following NMC-approved medical colleges:\n\n${colleges.map((c: any) => `- **${c.name}**${c.city ? ` — ${c.city}` : ''}${c.type ? ` (${c.type})` : ''}`).join('\n')}\n\n${colleges.length > 1 ? `\nFor detailed information about each college including fees, cutoffs, infrastructure, and facilities, search our comprehensive college database.` : ''}` : `${district.name} district currently does not have any NMC-approved medical colleges within its boundaries. Students from ${district.name} can apply to medical colleges in other districts of ${state.name} through state counselling, or across India through AIQ counselling.`}`

    case 'government-medical-colleges':
      return `## Government Medical Colleges in ${district.name}, ${state.name}

Government medical colleges offer affordable MBBS education with fees typically ranging from ₹10,000 to ₹1,00,000 per year.

${colleges.filter((c: any) => c.type === 'government' || c.type === 'central').length > 0 ?
  `Government colleges in ${district.name}:\n\n${colleges.filter((c: any) => c.type === 'government' || c.type === 'central').map((c: any) => `- **${c.name}**${c.city ? ` — ${c.city}` : ''}`).join('\n')}` :
  `${district.name} does not have government medical colleges. Students can apply to government colleges in other districts through ${state.name} state counselling or AIQ counselling.`}

### Benefits of Government Colleges

- Highly affordable tuition fees
- Quality education with experienced faculty
- Better clinical exposure in attached hospitals
- Government scholarships and stipends available
- Higher recognition and respect in the medical community

### Admission Process

Admission to government medical colleges is through NEET UG counselling. For ${state.name} state quota seats, students from ${district.name} must register on the state counselling portal.`

    case 'private-medical-colleges':
      return `## Private Medical Colleges in ${district.name}, ${state.name}

Private medical colleges offer MBBS education with higher fees but often better infrastructure and facilities.

${colleges.filter((c: any) => c.type === 'private' || c.type === 'deemed').length > 0 ?
  `Private/Deemed colleges in ${district.name}:\n\n${colleges.filter((c: any) => c.type === 'private' || c.type === 'deemed').map((c: any) => `- **${c.name}**${c.city ? ` — ${c.city}` : ''}`).join('\n')}` :
  `${district.name} has limited or no private medical colleges. Students can consider private colleges in other districts or states as alternatives.`}

### Private College Fees

Private medical college fees generally range from ₹5,00,000 to ₹25,00,000 per year. Management/NRI quota seats have significantly higher fees.

### Things to Consider

- Check NMC recognition status before applying
- Research the college's clinical exposure and hospital facilities
- Compare fee structures across multiple private colleges
- Consider education loan options and repayment feasibility
- Verify the college's track record of FMGE/NExT pass percentage`

    case 'mcc-counselling':
      return `## MCC NEET Counselling 2026 for ${district.name}, ${state.name} Students

The Medical Counselling Committee (MCC) conducts NEET UG counselling for All India Quota (AIQ) seats, deemed universities, central universities, AIIMS, and JIPMER.

### Seats Covered by MCC

- **AIQ**: 15% seats in state government medical colleges
- **Deemed Universities**: 100% seats
- **Central Universities**: 100% seats
- **AIIMS & JIPMER**: 100% seats
- **ESIC Colleges**: All seats

### MCC Counselling Schedule (Expected)

- **Round 1**: July–August 2026
- **Round 2**: August–September 2026
- **Mop-Up Round**: September 2026
- **Stray Vacancy Round**: October 2026

### Registration Process

1. Visit mcc.nic.in
2. Register with NEET UG 2026 credentials
3. Pay registration fee (₹500 for General, ₹250 for SC/ST)
4. Fill college choices
5. Lock choices before deadline
6. Check allotment result
7. Report to college if allotted

### Tips for ${district.name} Students

- Register for MCC counselling even if you prefer state quota — having multiple options increases your chances
- Participate in all rounds including mop-up round
- Understand the concept of "free exit" vs "locked" seats across rounds
- Consider deemed universities if rank is competitive but not enough for top government colleges`

    case 'state-counselling':
      return `## ${state.name} NEET State Counselling 2026 for ${district.name} Students

${state.name} NEET state counselling covers 85% of seats in state government medical colleges along with private medical college seats.

### Counselling Authority

${state.counsellingAuthority || `${state.name} counselling authority`}
${state.counsellingWebsite ? `Official website: ${state.counsellingWebsite}` : ''}

### State Quota Eligibility

- Domicile of ${state.name}
- Students who have studied in ${state.name} for a minimum period (varies by state)
- Children of central government employees serving in ${state.name}

### Counselling Process

1. Online registration on the state counselling portal
2. Document verification
3. Choice filling and locking
4. Merit list publication
5. Seat allotment and result declaration
6. Reporting to allotted college

### Reservation in ${state.name}

Each state has its own reservation policy. ${state.name} provides reservation to various categories as per state government norms. Check the official counselling brochure for detailed information.

For personalized guidance on ${state.name} state counselling 2026 for ${district.name} students, contact our NEET counselling experts.`

    case 'expected-cutoff':
      return `## Expected NEET Cutoff 2026 for ${district.name}, ${state.name}

Expected cutoff ranks for NEET UG 2026 admission to medical colleges accessible from ${district.name}, ${state.name}.

### Factors Influencing 2026 Cutoff

- **Number of Applicants**: Expected increase of 5-10% over 2025
- **NEET Difficulty**: Subject-wise difficulty affects score distribution
- **Seat Matrix Changes**: New colleges or increased seat capacity
- **Category-wise Trends**: Historical data patterns

### Expected Cutoff Range by Category (All India Quota)

Category | Expected Closing Rank Range
General | 50,000 — 7,00,000
OBC-NCL | 4,00,000 — 8,00,000
SC | 8,00,000 — 12,00,000
ST | 10,00,000 — 15,00,000
EWS | 5,00,000 — 7,50,000

### ${state.name} State Quota Expected Cutoff

State quota cutoffs are generally more relaxed than AIQ for state residents. ${state.name} state quota expected cutoff range for General category: **varies by college**

### How to Use Expected Cutoff

- Shortlist colleges where your rank is within or close to the expected cutoff range
- Fill realistic choices based on your predicted chances
- Prepare backup options for all scenarios
- Track actual cutoffs after each counselling round

Check our detailed cutoff analysis for personalised rank-based college prediction for ${district.name} students.`

    case 'important-dates':
      return `## Important Dates for NEET Counselling 2026 — ${district.name}, ${state.name}

### NEET UG 2026 Important Dates

Event | Expected Date
NEET UG 2026 Exam | May 2026
Result Declaration | June 2026
MCC Round 1 Registration | July 2026
MCC Round 1 Allotment | August 2026
MCC Round 2 Registration | August 2026
MCC Mop-Up Round | September 2026
${state.name} State Counselling | July–October 2026
Academic Session Start | September–October 2026

### ${state.name} State Counselling Key Dates

${state.counsellingWebsite ? `Check the official portal ${state.counsellingWebsite} for ${state.name} state counselling schedule.` : `The ${state.stateCode || state.name} counselling authority announces specific dates for state counselling. Students from ${district.name} should monitor the official website regularly for updates.`}

### Important Deadlines for ${district.name} Students

- Online registration deadline
- Document verification appointment date
- Choice filling last date
- Choice locking deadline
- Reporting to allotted college
- Tuition fee payment deadline

Bookmark this page and check regularly for updated NEET counselling 2026 dates. Missing a deadline can result in disqualification from that counselling round.`

    case 'faq':
      return `## NEET Counselling FAQ for ${district.name}, ${state.name}

### General Questions

**Q: What is the NEET counselling process for ${district.name} students?**
A: Students from ${district.name}, ${state.name} must register for both MCC AIQ counselling (mcc.nic.in) and ${state.name} state counselling. The process includes registration, document verification, choice filling, and seat allotment.

**Q: What is the minimum NEET rank required for MBBS in ${state.name}?**
A: Minimum ranks vary by college and category. Government college cutoffs in ${state.name} typically range from 1,000 to 50,000 for General category. Private colleges accept ranks up to 7-8 lakh.

**Q: Can ${district.name} students apply to colleges outside ${state.name}?**
A: Yes, through MCC AIQ counselling which covers 15% seats in all state government colleges plus deemed and central universities.

**Q: How many rounds of counselling are there?**
A: MCC conducts 4 rounds (Round 1, Round 2, Mop-Up, Stray Vacancy). ${state.name} state counselling typically has 3-5 rounds.

### State-Specific Questions

**Q: What documents do ${district.name} students need for ${state.name} state counselling?**
A: Standard documents plus ${state.name} domicile certificate, ${state.name} school leaving certificate (if studied in state), and category certificates.

**Q: Is there any state quota for ${district.name} students?**
A: Yes, ${state.name} state quota covers 85% of seats in state government colleges. ${district.name} students who meet domicile requirements are eligible.`

    case 'news':
      return `## NEET Counselling News for ${district.name}, ${state.name}

### Latest Updates

**${state.name} NEET Counselling 2026**
The ${state.counsellingAuthority || `${state.name} counselling authority`} is preparing for NEET UG 2026 counselling. Students from ${district.name} should start collecting required documents and researching college options.

**Expected Changes for 2026**
- Possible increase in MBBS seats across India
- New medical colleges may be approved by NMC
- Changes in reservation policy or counselling process

### Subscribe for Updates

Stay informed about the latest NEET 2026 news, counselling dates, and college admission updates for ${district.name}, ${state.name}.`

    case 'updates':
      return `## NEET Counselling Updates for ${district.name}, ${state.name}

### Latest Updates for ${district.name} Students

Stay tuned here for real-time updates on NEET counselling 2026 for students from ${district.name}, ${state.name}.

**Upcoming**: NEET UG 2026 results announcement, counselling registration dates, and college allotment results.

### Quick Links

- MCC Official Site: https://mcc.nic.in
- NTA NEET Site: https://neet.nta.nic.in
${state.counsellingWebsite ? `- ${state.name} Counselling: ${state.counsellingWebsite}` : ''}

For latest updates, bookmark this page and check regularly.`

    default:
      return `## ${type.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} in ${district.name}, ${state.name}

Complete information about ${type} for NEET counselling 2026 for students in ${district.name}, ${state.name}.`
  }
}

function generateMetaTitle(type: string, district: any, state: any): string {
  const titles: Record<string, string> = {
    'neet-counselling': `${district.name} NEET Counselling 2026 — ${state.name} MBBS/BDS Admission`,
    'mbbs-admission': `MBBS Admission in ${district.name}, ${state.name} 2026 — NEET UG Process`,
    'cutoff': `${district.name} NEET Cutoff 2025 — Medical College Cutoff Ranks`,
    'fees': `${district.name} MBBS Fees 2026 — Medical College Fee Structure`,
    'documents-required': `Documents Required for NEET Counselling 2026 in ${district.name}`,
    'choice-filling': `Choice Filling for NEET Counselling 2026 — ${district.name} Guide`,
    'seat-matrix': `${district.name} Medical College Seat Matrix 2026 — ${state.name}`,
    'all-medical-colleges': `Medical Colleges in ${district.name} — Complete List 2026`,
    'government-medical-colleges': `Government Medical Colleges in ${district.name}, ${state.name} 2026`,
    'private-medical-colleges': `Private Medical Colleges in ${district.name}, ${state.name} 2026`,
    'mcc-counselling': `MCC NEET Counselling 2026 — ${district.name}, ${state.name} Guide`,
    'state-counselling': `${state.name} NEET State Counselling 2026 for ${district.name}`,
    'expected-cutoff': `Expected NEET Cutoff 2026 for ${district.name} — Rank Prediction`,
    'important-dates': `NEET Counselling 2026 Important Dates for ${district.name}, ${state.name}`,
    'faq': `NEET Counselling FAQ for ${district.name}, ${state.name} — All Questions Answered`,
    'news': `NEET Counselling News 2026 — ${district.name}, ${state.name}`,
    'updates': `NEET Counselling Updates 2026 for ${district.name}, ${state.name}`,
  }
  return titles[type] || `${district.name} NEET ${type.replace(/-/g, ' ')} 2026 — ${state.name}`
}

function generateMetaDescription(type: string, district: any, state: any, colleges: any[]): string {
  const collegeCount = colleges.length
  const descriptions: Record<string, string> = {
    'neet-counselling': `Complete guide to NEET counselling 2026 for ${district.name}, ${state.name}. Get ${state.name} state quota details, MCC AIQ registration, choice filling strategy, and seat allotment process for MBBS/BDS admission.`,
    'mbbs-admission': `MBBS admission 2026 guide for students in ${district.name}, ${state.name}. Check eligibility, documents required, counselling process, and college options for NEET UG qualified students.`,
    'cutoff': `NEET cutoff ranks for medical colleges accessible from ${district.name}, ${state.name}. ${collegeCount > 0 ? `${collegeCount} colleges — ` : ''}Check category-wise closing ranks, trends, and expected cutoff for 2026.`,
    'fees': `MBBS fee structure for medical colleges accessible from ${district.name}, ${state.name}. Compare government vs private college fees, hostel charges, and education loan options.`,
    'documents-required': `Complete list of documents required for NEET counselling 2026 for ${district.name} students. Know what to carry for registration, verification, and college reporting.`,
    'choice-filling': `Learn choice filling strategy for NEET counselling 2026. Get tips for college selection, priority listing, and common mistakes to avoid for ${district.name} students.`,
    'seat-matrix': `Seat matrix and reservation details for medical colleges accessible from ${district.name}, ${state.name}. Understand AIQ vs state quota seat distribution.`,
    'all-medical-colleges': `${collegeCount > 0 ? `${collegeCount} NMC-approved` : 'List of'} medical colleges ${collegeCount > 0 ? 'in' : 'near'} ${district.name}, ${state.name}. Get details on types, accreditation, and courses.`,
    'government-medical-colleges': `Government medical colleges ${colleges.filter((c: any) => c.type === 'government' || c.type === 'central').length > 0 ? 'in' : 'near'} ${district.name}. Affordable MBBS education with fee details and admission process.`,
    'private-medical-colleges': `Private medical colleges ${colleges.filter((c: any) => c.type === 'private' || c.type === 'deemed').length > 0 ? 'in' : 'near'} ${district.name}. Fee structure, management quota, and admission process for NEET qualified students.`,
    'mcc-counselling': `MCC NEET counselling 2026 guide for ${district.name}, ${state.name} students. AIQ registration, deemed university counselling, central quota seats, and all counselling rounds explained.`,
    'state-counselling': `${state.name} NEET state counselling 2026 for ${district.name} students. State quota eligibility, reservation policy, registration process, and seat allotment details.`,
    'expected-cutoff': `Expected NEET cutoff 2026 for ${district.name}, ${state.name}. Category-wise rank predictions, historical trends, and college-wise estimated closing ranks.`,
    'important-dates': `NEET counselling 2026 important dates and deadlines for ${district.name}, ${state.name}. Never miss registration, counselling, or reporting dates.`,
    'faq': `Frequently asked questions about NEET counselling 2026 for ${district.name}, ${state.name}. Get answers about eligibility, process, documents, and deadlines.`,
    'news': `Latest NEET counselling news 2026 for ${district.name}, ${state.name}. Updates on counselling schedule, seat increase, new colleges, and policy changes.`,
    'updates': `Real-time NEET counselling updates 2026 for ${district.name}, ${state.name}. Latest announcements from MCC and ${state.name} counselling authority.`,
  }
  return descriptions[type] || `Complete NEET ${type.replace(/-/g, ' ')} guide for ${district.name}, ${state.name}. Get expert guidance and detailed information.`
}

function generateKeywords(type: string, district: any, state: any): string[] {
  const base = [
    `${district.name} NEET counselling 2026`,
    `${district.name} MBBS admission`,
    `${district.name} medical colleges`,
    `${state.name} NEET counselling`,
    `NEET counselling ${district.name}`,
    `${district.name} MBBS fees`,
    `${district.name} NEET cutoff`,
    `${state.name} state counselling ${district.name}`,
  ]
  const typeSpecific = [
    `${district.name} ${type.replace(/-/g, ' ')}`,
    `${type.replace(/-/g, ' ')} ${district.name}`,
  ]
  return [...base, ...typeSpecific]
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting missing district content seed...')

  const districtSlugs = ['kargil', 'leh', 'lakshadweep']
  const districts: any[] = []

  for (const slug of districtSlugs) {
    const result = await payload.find({
      collection: 'districts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    if (result.docs.length > 0) {
      districts.push(result.docs[0])
      payload.logger.info(`Found district: ${result.docs[0].name} (${slug})`)
    } else {
      payload.logger.warn(`District not found: ${slug}`)
    }
  }

  if (districts.length === 0) {
    payload.logger.error('No new districts found to seed.')
    process.exit(1)
  }

  // Load states for names
  const statesResult = await payload.find({
    collection: 'states',
    limit: 100,
    depth: 0,
  })
  const statesMap = new Map<string, any>()
  for (const s of statesResult.docs as any[]) {
    statesMap.set(s.id, s)
  }

  const collegesResult = await payload.find({
    collection: 'colleges',
    where: { status: { equals: 'active' } },
    limit: 2000,
    depth: 0,
  })
  const allColleges = collegesResult.docs as any[]
  const collegesByDistrict = new Map<string, any[]>()
  for (const c of allColleges) {
    const dId = typeof c.district === 'string' ? c.district : c.district?.id
    if (dId) {
      if (!collegesByDistrict.has(dId)) collegesByDistrict.set(dId, [])
      collegesByDistrict.get(dId)!.push(c)
    }
  }

  // Load cutoff records
  const cutoffsResult = await payload.find({
    collection: 'cutoff-records',
    limit: 5000,
    depth: 0,
  })
  const allCutoffs = cutoffsResult.docs as any[]
  const cutoffsByCollege = new Map<string, any[]>()
  for (const c of allCutoffs) {
    const collegeId = typeof c.college === 'string' ? c.college : c.college?.id
    if (collegeId) {
      if (!cutoffsByCollege.has(collegeId)) cutoffsByCollege.set(collegeId, [])
      cutoffsByCollege.get(collegeId)!.push(c)
    }
  }

  let created = 0
  let skipped = 0
  let errors = 0

  for (const district of districts) {
    const stateId = district.state as string
    const state = statesMap.get(stateId) || { name: '', slug: '' }
    const districtColleges = collegesByDistrict.get(district.id) || []
    const districtCutoffs: any[] = []
    for (const c of districtColleges) {
      const cCutoffs = cutoffsByCollege.get(c.id) || []
      districtCutoffs.push(...cCutoffs)
    }

    const ctx = { district, state, colleges: districtColleges, cutoffs: districtCutoffs }

    for (const type of SUBPAGE_TYPES) {
      try {
        // Check existing
        const existing = await payload.find({
          collection: 'district-content',
          where: { and: [{ district: { equals: district.id } }, { type: { equals: type } }] },
          limit: 1,
          depth: 0,
        })
        if (existing.docs.length > 0) {
          skipped++
          continue
        }

        const markdown = generateContent(type, ctx)
        const lexicalContent = markdownToLexical(markdown)

        await payload.create({
          collection: 'district-content',
          data: {
            district: district.id,
            type,
            content: lexicalContent,
            status: 'published',
            generatedAt: new Date().toISOString(),
            seo: {
              metaTitle: generateMetaTitle(type, district, state),
              metaDescription: generateMetaDescription(type, district, state, districtColleges),
              keywords: generateKeywords(type, district, state).map((k: string) => ({ keyword: k })),
            },
          } as any,
          depth: 0,
        })
        created++
        payload.logger.info(`  Created: ${district.name}/${type}`)
      } catch (err: any) {
        errors++
        payload.logger.error(`  Error ${district.name}/${type}: ${err.message}`)
      }
    }
  }

  payload.logger.info(`\nDone — Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`)
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
