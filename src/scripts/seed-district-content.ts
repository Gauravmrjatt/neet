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

function generateCollegeSection(district: any, state: any, colleges: any[]): string {
  if (colleges.length === 0) {
    return `## Medical Colleges in ${district.name}

${district.name} district in ${state.name} currently does not have any NMC-approved medical colleges within its boundaries. Students from ${district.name} typically apply to medical colleges in nearby districts within ${state.name} and across India through both AIQ (All India Quota) and state counselling.

### Nearby Options for ${district.name} Students

You can explore colleges in neighbouring districts of ${district.name}. Use our college directory to filter by state and find the best options for your NEET rank and budget. Consider applying to colleges in multiple districts to maximize your chances of securing an MBBS seat.`
  }
  const govt = colleges.filter((c: any) => c.type === 'government' || c.type === 'central')
  const pvt = colleges.filter((c: any) => c.type === 'private' || c.type === 'deemed')
  let md = `## Medical Colleges in ${district.name}

${district.name} has **${colleges.length} NMC-approved medical college(s)**. Here is the complete list:\n\n`
  for (const c of colleges) {
    md += `- **${c.name}**${c.type ? ` (${c.type})` : ''}${c.city ? ` — ${c.city}` : ''}\n`
  }
  md += `\n### College Type Distribution\n\n`
  md += `- **Government**: ${govt.length} college(s)\n`
  md += `- **Private/Deemed**: ${pvt.length} college(s)\n`
  md += `\n### Choosing the Right College in ${district.name}\n\nWhen selecting a medical college in ${district.name}, consider factors like NMC approval status, fee structure, NEET cutoff trends, seat availability, and infrastructure. Government colleges offer affordable fees (₹10,000–₹1,00,000/year), while private colleges charge higher fees (₹5–₹25 lakh/year). Compare multiple colleges before making your choice.`
  return md
}

function generateGovtCollegeSection(district: any, state: any, colleges: any[]): string {
  const govt = colleges.filter((c: any) => c.type === 'government' || c.type === 'central')
  if (govt.length === 0) {
    return `## Government Medical Colleges in ${district.name}

${district.name} does not have any government medical colleges. Students from ${district.name} seeking affordable MBBS education at government colleges should explore options in nearby districts of ${state.name} or apply to central institutions through All India Quota counselling conducted by MCC.`
  }
  let md = `## Government Medical Colleges in ${district.name}

${district.name} has **${govt.length} government medical college(s)** offering affordable MBBS education:\n\n`
  for (const c of govt) {
    md += `- **${c.name}**${c.city ? ` — ${c.city}` : ''}\n`
  }
  md += `\n### Government College Fees\n\nGovernment medical college fees in ${district.name} are significantly lower than private colleges, typically ranging from ₹10,000 to ₹1,00,000 per year. Hostel and miscellaneous fees are additional but affordable.\n\n### Admission through NEET\n\nAdmission to government colleges in ${district.name} is through NEET UG counselling. 15% seats are filled through MCC AIQ counselling and 85% through ${state.name} state counselling.`
  return md
}

function generatePrivateCollegeSection(district: any, state: any, colleges: any[]): string {
  const pvt = colleges.filter((c: any) => c.type === 'private' || c.type === 'deemed')
  if (pvt.length === 0) {
    return `## Private Medical Colleges in ${district.name}

${district.name} does not have any private medical colleges. Students looking for private MBBS options can explore colleges in other districts of ${state.name} or apply to private and deemed universities across India through MCC counselling.`
  }
  let md = `## Private Medical Colleges in ${district.name}

${district.name} has **${pvt.length} private medical college(s)** offering MBBS programs:\n\n`
  for (const c of pvt) {
    md += `- **${c.name}**${c.city ? ` — ${c.city}` : ''}\n`
  }
  md += `\n### Private College Fees\n\nPrivate medical college fees in ${district.name} range from approximately ₹5,00,000 to ₹25,00,000 per year. Deemed universities may charge higher fees. Management and NRI quota seats have separate, higher fee structures.\n\n### Admission Process\n\nAdmission to private colleges in ${district.name} requires a valid NEET UG score. Seats are filled through MCC counselling (for deemed universities) and ${state.name} state counselling. Some seats may be available under management/NRI quota.`
  return md
}

function generateNeetCounsellingSection(district: any, state: any, colleges: any[]): string {
  return `## NEET Counselling in ${district.name}, ${state.name}

NEET counselling for students from ${district.name}, ${state.name} involves a two-step process: **MCC counselling** for All India Quota (AIQ) seats and **${state.name} state counselling** for state quota seats. Understanding both processes is crucial for securing an MBBS seat.

### MCC Counselling (AIQ Seats)

MCC conducts NEET counselling for 15% of government college seats as All India Quota, all seats in deemed universities, central universities, ESIC, AIIMS, and JIPMER. ${district.name} students can apply for AIQ seats regardless of domicile. Registration happens on mcc.nic.in.

### ${state.name} State Counselling

85% of government college seats in ${state.name} are filled through state counselling. To claim state quota benefits, ${district.name} students need valid ${state.name} domicile as per state government rules. ${colleges.length > 0 ? `${district.name} has ${colleges.length} medical college(s) where state quota seats are available.` : ''}

### Step-by-Step Process

1. Register on MCC portal (mcc.nic.in) and ${state.name} state counselling portal
2. Upload and verify required documents
3. Fill choices — list up to 300 colleges in order of preference
4. Seat allotment based on NEET rank, preferences, and category
5. Report to allotted college after fee payment and document verification`
}

function generateCutoffSection(district: any, state: any, colleges: any[], cutoffs: any[]): string {
  let md = `## NEET Cutoff for ${district.name}, ${state.name}

NEET cutoff ranks for medical colleges in ${district.name} vary by institution type, category, and year. Here's what you need to know about cutoff trends.

### Category-Wise Cutoff Overview

NEET qualifying criteria requires General category students to score minimum 50th percentile (approx 137+ marks out of 720), OBC/SC/ST need 40th percentile (approx 107+), and PwD need 45th percentile. However, actual college cutoffs are significantly higher, especially for government colleges.

### Previous Year Trends\n\n`
  if (cutoffs.length > 0) {
    md += `Based on available cutoff data for ${district.name}, here are some key trends:\n\n`
    const years = [...new Set(cutoffs.map((c: any) => c.year).filter(Boolean))].sort().reverse()
    if (years.length > 0) md += `- Data available for years: ${years.join(', ')}\n`
    const categories = [...new Set(cutoffs.map((c: any) => c.category).filter(Boolean))]
    if (categories.length > 0) md += `- Categories in data: ${categories.join(', ')}\n`
    md += `\n`
  } else {
    md += `Specific cutoff data for ${district.name} colleges is being compiled. Cutoff ranks vary significantly between government and private colleges. Government college cutoffs in ${state.name} are generally higher due to lower fees and better infrastructure.\n\n`
  }
  md += `### Factors Affecting Cutoff\n\n- Number of applicants from ${district.name} and across India\n- Available seats in ${district.name} colleges\n- NEET UG ${new Date().getFullYear()} difficulty level\n- Category-wise reservation policies\n- Previous year cutoff trends`
  return md
}

function generateFeesSection(district: any, state: any, colleges: any[]): string {
  const govt = colleges.filter((c: any) => c.type === 'government' || c.type === 'central')
  const pvt = colleges.filter((c: any) => c.type === 'private' || c.type === 'deemed')
  let md = `## MBBS Fees in ${district.name}, ${state.name}

Medical college fees in ${district.name} vary significantly based on the type of institution.\n\n`
  if (colleges.length > 0) {
    md += `${district.name} has ${colleges.length} medical college(s) with the following fee structure:\n\n`
    for (const c of colleges) {
      const feeRange = c.type === 'government' || c.type === 'central'
        ? '₹10,000 – ₹1,10,000 per year'
        : '₹5,00,000 – ₹25,00,000 per year'
      md += `- **${c.name}** (${c.type || 'N/A'}): ${c.fees || feeRange}\n`
    }
    md += `\n`
  }
  md += `### Government College Fees\n\nGovernment medical college fees in ${district.name} range from **₹10,000 to ₹1,10,000 per year**. ${govt.length > 0 ? `${govt.length} government college(s) in ${district.name} offer MBBS at these affordable rates.` : 'Students from ' + district.name + ' seeking affordable options should explore government colleges in nearby districts.'} Tuition fees are subsidized by the state government.\n\n### Private College Fees\n\nPrivate medical college fees in ${district.name} range from **₹5,00,000 to ₹25,00,000 per year**. ${pvt.length > 0 ? `${pvt.length} private college(s) operate in ${district.name}.` : ''} Deemed university fees are typically at the higher end of this range.\n\n### Additional Costs\n\n- Hostel fees: ₹30,000 – ₹2,00,000 per year\n- Mess charges: ₹30,000 – ₹60,000 per year\n- Books and supplies: ₹10,000 – ₹25,000 per year\n- Miscellaneous: ₹5,000 – ₹15,000`
  return md
}

function generateDocumentsSection(district: any, state: any): string {
  return `## Documents Required for NEET Counselling in ${district.name}

${district.name} students must prepare the following documents for NEET UG counselling.

### Mandatory Documents

1. NEET UG ${new Date().getFullYear()} Admit Card
2. NEET ${new Date().getFullYear()} Scorecard / Rank Letter
3. Class 10 Certificate (as proof of date of birth)
4. Class 12 Marksheet and Passing Certificate
5. Aadhaar Card (or any government-issued photo ID)
6. Passport-size photographs (8-10 copies)
7. Provisional Allotment Letter (after seat allotment)

### Category-Specific Documents

- **SC/ST/OBC-NCL**: Valid caste certificate issued by competent authority
- **EWS**: Income and asset certificate as per government format
- **PwD**: Disability certificate (40% or more)
- **NRI/NRI-sponsored**: Relevant NRI status documents

### ${state.name} State Quota Documents

For ${state.name} state counselling, additional documents include:
- ${state.name} Domicile Certificate
- State-specific migration certificate (if applicable)
- Character certificate from last attended institution`
}

function generateChoiceFillingSection(district: any, state: any, colleges: any[]): string {
  return `## NEET Choice Filling Strategy for ${district.name} Students

Choice filling is a critical step in NEET counselling. A well-planned strategy can significantly improve your chances of securing a seat.

### Step-by-Step Choice Filling Process

1. Log in to the MCC or ${state.name} state counselling portal
2. Browse available colleges and courses
3. Arrange colleges in order of genuine preference
4. Review and lock choices before the deadline
5. Download the filled choice form for reference

### Strategy for ${district.name} Students

- **Top priority**: List your dream college first — ${colleges.length > 0 ? `consider ${colleges[0]?.name || 'colleges in ' + district.name}` : 'colleges in ' + district.name + ' and nearby districts'}
- **Include all options**: Never limit to ${district.name} only — include colleges across ${state.name} and other states
- **Fill all 300 choices**: MCC allows up to 300 choices — fill them all
- **Use college predictor**: Our NEET college predictor can help estimate your chances
- **Research cutoffs**: Check ${district.name} previous year cutoffs to gauge realistic options

### Common Mistakes to Avoid

1. Not filling enough choices — always maximize your options
2. Ignoring lower preference colleges — seat is better than no seat
3. Forgetting to lock choices — unlocked choices are not considered
4. Not checking cutoff trends before filling
5. Filling choices without considering commute/accommodation`
}

function generateSeatMatrixSection(district: any, state: any, colleges: any[]): string {
  let md = `## MBBS Seat Matrix for ${district.name}, ${state.name}\n\n`
  if (colleges.length > 0) {
    md += `${district.name} has **${colleges.length} medical college(s)**. Each college has varying seat capacity approved by NMC. Typically, government colleges have 100-200 MBBS seats per year, while private colleges may have 100-150 seats.\n\n`
    md += `### College-Wise Seat Distribution (Estimated)\n\n`
    for (const c of colleges) {
      const estSeats = c.type === 'government' ? '100-200' : '100-150'
      md += `- **${c.name}**: ~${estSeats} MBBS seats\n`
    }
    md += `\n`
  } else {
    md += `${district.name} currently does not have NMC-approved medical colleges within the district.\n\n`
  }
  md += `### Seat Distribution Categories\n\n- **All India Quota (AIQ)**: 15% of total government seats\n- **State Quota**: 85% of government seats for ${state.name} domicile holders\n- **Management Quota**: Available in private colleges\n- **NRI Quota**: Separate seats in private/deemed colleges\n\n### Category Reservation\n\n- SC: 15%\n- ST: 7.5%\n- OBC-NCL: 27%\n- EWS: 10%\n- PwD: 5% horizontal reservation`
  return md
}

function generateImportantDatesSection(district: any, state: any): string {
  return `## NEET Counselling Important Dates for ${district.name} Students — ${new Date().getFullYear()}

Stay updated with the complete NEET UG counselling schedule for ${new Date().getFullYear()}.

### MCC NEET UG Counselling Schedule (Expected)

| Round | Activity | Expected Dates |
|-------|----------|---------------|
| Round 1 | Registration & Payment | July ${new Date().getFullYear()} |
| Round 1 | Choice Filling | July ${new Date().getFullYear()} |
| Round 1 | Seat Allotment | August ${new Date().getFullYear()} |
| Round 1 | Reporting | August ${new Date().getFullYear()} |
| Round 2 | Registration & Choice Filling | August-September ${new Date().getFullYear()} |
| Round 2 | Seat Allotment | September ${new Date().getFullYear()} |
| Mop-Up Round | Registration & Allotment | September-October ${new Date().getFullYear()} |
| Stray Vacancy | Spot Round | October ${new Date().getFullYear()} |

### ${state.name} State Counselling Schedule (Expected)

State counselling dates are typically announced after the NEET results. ${state.name} counselling usually runs parallel to MCC rounds but with separate timelines. Check the official ${state.name} counselling website for exact dates.`
}

function generateFaqSection(district: any, state: any, colleges: any[]): string {
  return `## NEET Counselling FAQs for ${district.name}, ${state.name}

### General Questions

**Q: What is the NEET qualifying cutoff for ${new Date().getFullYear()}?**
A: General category students need minimum 50th percentile (approx 137+ marks out of 720). OBC/SC/ST need 40th percentile (approx 107+). PwD candidates need 45th percentile. Note that these are minimum qualifying scores — actual college cutoffs are much higher.

**Q: Can students from other states apply to ${district.name} colleges?**
A: Yes, for AIQ seats (15% of government seats), any Indian student can apply. For state quota seats (85%), you need valid ${state.name} domicile. Private colleges may have management quota seats open to all-India candidates.

**Q: When does NEET counselling start for ${district.name} students?**
A: NEET UG counselling typically starts in July after NEET results. First register on MCC portal for AIQ seats, then on ${state.name} state counselling portal for state quota.

**Q: Is there ${state.name} state quota in ${district.name} medical colleges?**
A: Yes, 85% of government college seats are reserved for ${state.name} state quota. ${district.name} students with valid ${state.name} domicile can claim these seats.

**Q: How many medical colleges are in ${district.name}?**
A: ${district.name} has ${colleges.length} NMC-approved medical college(s). ${colleges.filter((c: any) => c.type === 'government' || c.type === 'central').length} government and ${colleges.filter((c: any) => c.type === 'private' || c.type === 'deemed').length} private.

${colleges.length > 0 ? `**Q: Which is the best medical college in ${district.name}?**\nA: The top choice depends on your preferences. ${colleges[0]?.name || 'The medical college in ' + district.name} is a popular option. Compare based on NMC approval, fees, cutoff, infrastructure, and location.\n\n` : ''}**Q: Do I need to register for both MCC and ${state.name} counselling?**
A: Yes, always register for both. MCC handles AIQ and central institution seats, while ${state.name} counselling covers 85% state quota seats. Skipping either limits your options.`
}

function generateMccSection(district: any, state: any): string {
  return `## MCC NEET Counselling for ${district.name} Students — ${new Date().getFullYear()}

MCC (Medical Counselling Committee) conducts NEET UG counselling for All India Quota seats.

### What MCC Counselling Covers

- 15% All India Quota seats in government medical colleges
- 100% seats in deemed universities
- Central universities, ESIC colleges, AIIMS, and JIPMER
- AFMC (Armed Forces Medical College)

### Registration Process for ${district.name} Students

1. Visit mcc.nic.in
2. Register with NEET application number and personal details
3. Pay registration fee (₹1000-₹2000 depending on category)
4. Upload scanned documents
5. Fill choices — up to 300 preferences
6. Lock choices before deadline

### Key Points

- AIQ seats are open to all Indian students, including those from ${district.name}
- No domicile requirement for AIQ seats
- Registration is mandatory even if you only want ${state.name} state quota seats
- AIQ allotment is purely merit-based on NEET rank`
}

function generateStateCounsellingSection(district: any, state: any): string {
  return `## ${state.name} NEET State Counselling for ${district.name} Students — ${new Date().getFullYear()}

${state.name} state counselling covers 85% of government medical college seats in the state.

### Eligibility for ${district.name} Students

- Must have qualified NEET UG ${new Date().getFullYear()}
- Must hold valid ${state.name} domicile certificate
- Must have passed Class 12 with Physics, Chemistry, Biology/Biotechnology and English
- Must meet minimum age requirements (17 years as of December 31, ${new Date().getFullYear()})

### State Quota Benefits for ${district.name}

${district.name} students with ${state.name} domicile can claim 85% of government MBBS seats in ${state.name}. This significantly improves chances of getting a seat at lower NEET ranks compared to AIQ competition.

### Counselling Process

1. Register on ${state.name} state counselling official portal
2. Pay registration fee as per category
3. Document upload and verification
4. Choice filling — include all ${state.name} colleges
5. Seat allotment based on NEET rank, preferences, category, and reservation
6. Reporting to allotted college`
}

function generateExpectedCutoffSection(district: any, state: any, colleges: any[], cutoffs: any[]): string {
  let md = `## Expected NEET Cutoff for ${district.name} — ${new Date().getFullYear()}

Based on previous year trends and current year factors, here are the expected cutoff ranges for ${district.name} medical colleges.\n\n`
  if (colleges.length > 0) {
    const prevYear = String(Number(new Date().getFullYear()) - 1)
    md += `Based on ${prevYear} trends, expected ${new Date().getFullYear()} cutoffs:\n\n`
    for (const c of colleges) {
      const govtExpected = c.type === 'government' || c.type === 'central' ? 'AIR 5,000 – 50,000' : 'AIR 50,000 – 3,00,000'
      md += `- **${c.name}**: Expected closing rank ${govtExpected} (varies by category)\n`
    }
    md += `\n`
  } else {
    md += `Expected cutoff ranges for colleges accessible to ${district.name} students vary based on the institution type and category.\n\n`
  }
  md += `### Factors That May Affect ${new Date().getFullYear()} Cutoffs\n\n- **NEET difficulty level**: Easier paper → higher cutoffs\n- **Number of applicants**: More competition → higher cutoffs\n- **Seat availability**: New colleges → possible lower cutoffs\n- **Category**: SC/ST/OBC cutoffs are lower than General\n- **Previous year trends**: Cutoffs generally remain stable\n\n### How to Use Expected Cutoff\n\nUse expected cutoffs as a guideline for choice filling, not as guaranteed predictions. Always fill preferences based on genuine interest and use our college predictor for personalized estimates based on your NEET rank and category.`
  return md
}

function generateMbbsSection(district: any, state: any, colleges: any[]): string {
  return `## MBBS Admission in ${district.name}, ${state.name}

Complete MBBS admission guide for ${district.name} students.

### Eligibility Criteria

1. **Educational**: Pass Class 12 with Physics, Chemistry, Biology/Biotechnology, and English
2. **Minimum Marks**: General 50%, OBC/SC/ST 40%, PwD 45% in PCB subjects
3. **Age**: Minimum 17 years as of December 31 of admission year
4. **NEET Qualification**: Minimum required percentile based on category

### Admission Process

1. Appear for NEET UG ${new Date().getFullYear()}
2. Register for MCC AIQ counselling (mcc.nic.in)
3. Register for ${state.name} state counselling
4. Fill college choices including ${district.name} colleges${colleges.length > 0 ? ` and nearby districts` : ''}
5. Seat allotment based on rank and preferences
6. Document verification and fee payment
7. Report to allotted college

### Tips for ${district.name} Students

- Start document preparation early
- Research cutoff trends for target colleges
- Fill maximum choices to increase chances
- Keep both AIQ and state counselling options open
- Use college predictor for rank-based predictions`
}

function generateNewsSection(district: any, state: any): string {
  return `## ${district.name} NEET Counselling News — Latest Updates

Stay informed with the latest NEET counselling news relevant to ${district.name}, ${state.name}.

### Recent Developments

- **NEET UG ${new Date().getFullYear()}**: Exam conducted by NTA. Results expected in June.
- **Counselling Schedule**: MCC ${new Date().getFullYear()} counselling expected to start in July.
- **${state.name} Updates**: ${state.name} state counselling schedule to be announced post NEET results.

### Important Announcements

- Check mcc.nic.in for AIQ counselling updates
- Visit ${state.name} counselling portal for state-specific news
- Follow NTA official website for NEET-related announcements`
}

function generateUpdatesSection(district: any, state: any): string {
  return `## ${district.name} NEET Counselling Updates — ${new Date().getFullYear()}

Real-time updates about NEET counselling for ${district.name} students.

### Latest Updates

- **NEET ${new Date().getFullYear()} Application**: Keep checking NTA website for updates
- **Counselling Registration**: MCC and ${state.name} counselling registrations will open after NEET results
- **Document Preparation**: Start gathering required documents for verification

### Stay Updated

- Bookmark mcc.nic.in for AIQ counselling
- Follow ${state.name} official counselling portal
- Check our important dates page for the complete schedule
- Subscribe to updates for real-time notifications`
}

function generateContent(type: string, ctx: { district: any; state: any; colleges: any[]; cutoffs: any[] }): string {
  const { district, state, colleges, cutoffs } = ctx
  switch (type) {
    case 'neet-counselling': return generateNeetCounsellingSection(district, state, colleges)
    case 'cutoff': return generateCutoffSection(district, state, colleges, cutoffs)
    case 'fees': return generateFeesSection(district, state, colleges)
    case 'documents-required': return generateDocumentsSection(district, state)
    case 'choice-filling': return generateChoiceFillingSection(district, state, colleges)
    case 'seat-matrix': return generateSeatMatrixSection(district, state, colleges)
    case 'all-medical-colleges': return generateCollegeSection(district, state, colleges)
    case 'government-medical-colleges': return generateGovtCollegeSection(district, state, colleges)
    case 'private-medical-colleges': return generatePrivateCollegeSection(district, state, colleges)
    case 'mcc-counselling': return generateMccSection(district, state)
    case 'state-counselling': return generateStateCounsellingSection(district, state)
    case 'expected-cutoff': return generateExpectedCutoffSection(district, state, colleges, cutoffs)
    case 'important-dates': return generateImportantDatesSection(district, state)
    case 'faq': return generateFaqSection(district, state, colleges)
    case 'mbbs-admission': return generateMbbsSection(district, state, colleges)
    case 'news': return generateNewsSection(district, state)
    case 'updates': return generateUpdatesSection(district, state)
    default: return `## ${type.replace(/-/g, ' ')} for ${district.name}, ${state.name}\n\nInformation about ${type.replace(/-/g, ' ')} for NEET counselling in ${district.name}, ${state.name}.`
  }
}

function generateMetaTitle(type: string, district: any, state: any): string {
  const year = String(new Date().getFullYear())
  const titles: Record<string, string> = {
    'neet-counselling': `NEET Counselling in ${district.name}, ${state.name} ${year} — Complete Process Guide`,
    'mbbs-admission': `MBBS Admission in ${district.name}, ${state.name} ${year} — Complete Guide`,
    'cutoff': `${district.name} NEET Cutoff ${year} — Category-Wise MBBS Closing Ranks`,
    'fees': `MBBS Fees in ${district.name}, ${state.name} ${year} — Fee Structure`,
    'documents-required': `Documents Required for NEET Counselling in ${district.name}, ${state.name} ${year}`,
    'choice-filling': `NEET Choice Filling Strategy for ${district.name}, ${state.name} ${year}`,
    'seat-matrix': `${district.name} MBBS Seat Matrix ${year} — Category-Wise Distribution`,
    'all-medical-colleges': `Medical Colleges in ${district.name}, ${state.name} ${year} — Complete List`,
    'government-medical-colleges': `Government Medical Colleges in ${district.name}, ${state.name} ${year}`,
    'private-medical-colleges': `Private Medical Colleges in ${district.name}, ${state.name} ${year}`,
    'mcc-counselling': `MCC NEET Counselling ${year} for ${district.name}, ${state.name}`,
    'state-counselling': `${state.name} NEET State Counselling ${year} for ${district.name}`,
    'expected-cutoff': `Expected NEET Cutoff for ${district.name}, ${state.name} ${year}`,
    'important-dates': `${district.name} NEET Counselling Important Dates ${year}`,
    'faq': `NEET Counselling FAQs for ${district.name}, ${state.name} ${year}`,
    'news': `${district.name} NEET Counselling News ${year} — Latest Updates`,
    'updates': `${district.name} NEET Counselling Updates ${year} — Real-Time Information`,
  }
  return titles[type] || `${district.name} NEET Counselling ${year} — ${type.replace(/-/g, ' ')}`
}

function generateMetaDescription(type: string, district: any, state: any, colleges: any[]): string {
  const year = String(new Date().getFullYear())
  const descs: Record<string, string> = {
    'neet-counselling': `Complete NEET counselling guide for ${district.name}, ${state.name}. Step-by-step process, registration, choice filling, seat allotment, and document requirements for ${year} MBBS admission.`,
    'mbbs-admission': `Complete MBBS admission guide for ${district.name}, ${state.name} ${year}. Eligibility, NEET cutoff, counselling, fees, and college list. Expert guidance for ${district.name} students.`,
    'cutoff': `NEET cutoff ${year} for ${district.name}, ${state.name}. Category-wise opening and closing ranks for government and private medical colleges. Check trends and expected cutoffs.`,
    'fees': `MBBS fee structure for ${district.name}, ${state.name} medical colleges. Compare government vs private college fees. Get hostel, security deposit, and total course fee details.`,
    'documents-required': `Complete list of documents for NEET counselling in ${district.name}, ${state.name}. NEET scorecard, admit card, marksheets, domicile, category certificates, and more.`,
    'choice-filling': `Expert NEET choice filling strategy for ${district.name} students. Learn how to arrange preferences, lock choices, and maximize MBBS seat chances in ${year}.`,
    'seat-matrix': `MBBS seat matrix for ${district.name}, ${state.name} ${year}. Total seats, AIQ, state quota, management, and NRI quota distribution for each medical college.`,
    'all-medical-colleges': `Complete list of medical colleges in ${district.name}, ${state.name}. ${colleges.length} NMC-approved MBBS colleges with fees, cutoff, seat matrix, and admission details.`,
    'government-medical-colleges': `List of government medical colleges in ${district.name}, ${state.name}. Low fees (₹10K-1L/year), cutoff ranks, seat matrix, and admission process for ${year}.`,
    'private-medical-colleges': `List of private medical colleges in ${district.name}, ${state.name}. MBBS fees (₹5-25L/year), cutoff, management quota, NRI quota, and admission process for ${year}.`,
    'mcc-counselling': `MCC NEET counselling ${year} guide for ${district.name} students. AIQ seat registration, choice filling, allotment, document verification, and important dates.`,
    'state-counselling': `${state.name} state NEET counselling ${year} guide for ${district.name}. State quota registration, eligibility, domicile requirements, seat matrix, and process.`,
    'expected-cutoff': `Expected NEET cutoff for ${district.name}, ${state.name} ${year}. Predicted opening and closing ranks for MBBS colleges based on previous year trends.`,
    'important-dates': `NEET counselling ${year} important dates for ${district.name}, ${state.name}. Registration, choice filling, allotment, reporting dates for MCC and state counselling.`,
    'faq': `FAQs about NEET counselling in ${district.name}, ${state.name}. Answers about eligibility, documents, choice filling, seat allotment, and college selection.`,
    'news': `Latest NEET counselling news for ${district.name}, ${state.name} ${year}. Updates on admission schedules, cutoffs, seat matrices, and announcements.`,
    'updates': `Real-time NEET counselling updates for ${district.name}, ${state.name} ${year}. Registration deadlines, allotment results, cutoffs, and counselling rounds.`,
  }
  return descs[type] || `Information about ${type.replace(/-/g, ' ')} for NEET counselling in ${district.name}, ${state.name}.`
}

function generateKeywords(type: string, district: any, state: any): string[] {
  const year = String(new Date().getFullYear())
  return [
    `${district.name} ${type.replace(/-/g, ' ')}`,
    `${district.name} NEET ${year}`,
    `${district.name} MBBS`,
    `${state.name} NEET counselling`,
    `${district.name} medical college`,
  ]
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting district content seed (optimized)...')

  const startTime = Date.now()

  // Load all data upfront
  const districtsResult = await payload.find({
    collection: 'districts',
    where: { status: { equals: 'active' } },
    limit: 2000,
    depth: 0,
  })
  const districts = districtsResult.docs as any[]
  payload.logger.info(`Loaded ${districts.length} districts`)

  // Load all colleges with district populated
  const collegesResult = await payload.find({
    collection: 'colleges',
    where: { status: { equals: 'active' }, district: { exists: true } },
    limit: 2000,
    depth: 0,
  })
  const allColleges = collegesResult.docs as any[]
  payload.logger.info(`Loaded ${allColleges.length} colleges with district mapping`)

  // Map colleges by district ID
  const collegesByDistrict = new Map<string, any[]>()
  for (const c of allColleges) {
    const districtId = typeof c.district === 'string' ? c.district : c.district?.id
    if (districtId) {
      if (!collegesByDistrict.has(districtId)) collegesByDistrict.set(districtId, [])
      collegesByDistrict.get(districtId)!.push(c)
    }
  }

  // Load all cutoff records
  const cutoffsResult = await payload.find({
    collection: 'cutoff-records',
    limit: 5000,
    depth: 0,
  })
  const allCutoffs = cutoffsResult.docs as any[]
  payload.logger.info(`Loaded ${allCutoffs.length} cutoff records`)

  // Map cutoffs by college ID
  const cutoffsByCollege = new Map<string, any[]>()
  for (const c of allCutoffs) {
    const collegeId = typeof c.college === 'string' ? c.college : c.college?.id
    if (collegeId) {
      if (!cutoffsByCollege.has(collegeId)) cutoffsByCollege.set(collegeId, [])
      cutoffsByCollege.get(collegeId)!.push(c)
    }
  }

  // Load existing content entries to skip
  const existingResult = await payload.find({
    collection: 'district-content',
    limit: 20000,
    depth: 0,
  })
  const existingEntries = existingResult.docs as any[]
  const existingSet = new Set<string>()
  for (const e of existingEntries) {
    const dId = typeof e.district === 'string' ? e.district : e.district?.id
    if (dId) existingSet.add(`${dId}:${e.type}`)
  }
  payload.logger.info(`Existing content entries: ${existingSet.size}`)

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

  // Process all districts
  let created = 0
  let skipped = 0
  let errors = 0
  const total = districts.length * SUBPAGE_TYPES.length

  for (let di = 0; di < districts.length; di++) {
    const district = districts[di]
    const stateId = district.state as string
    const state = statesMap.get(stateId) || { name: '', slug: '' }

    const districtColleges = collegesByDistrict.get(district.id) || []

    // Get cutoffs for this district's colleges
    const districtCutoffs: any[] = []
    for (const c of districtColleges) {
      const cCutoffs = cutoffsByCollege.get(c.id) || []
      districtCutoffs.push(...cCutoffs)
    }

    const ctx = { district, state, colleges: districtColleges, cutoffs: districtCutoffs }

    for (const type of SUBPAGE_TYPES) {
      const key = `${district.id}:${type}`
      if (existingSet.has(key)) {
        skipped++
        continue
      }

      try {
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
      } catch (err: any) {
        errors++
        if (errors <= 5) payload.logger.error(`Error ${district.name}/${type}: ${err.message}`)
      }
    }

    if ((di + 1) % 50 === 0 || di === districts.length - 1) {
      const elapsed = Math.round((Date.now() - startTime) / 1000)
      const pct = Math.round(((di + 1) / districts.length) * 100)
      payload.logger.info(`${pct}% — ${di + 1}/${districts.length} districts — ${created} created, ${skipped} skipped, ${errors} errors — ${elapsed}s elapsed`)
    }
  }

  const totalTime = Math.round((Date.now() - startTime) / 1000)
  payload.logger.info(`\n=== District Content Seed Complete ===`)
  payload.logger.info(`Expected entries: ${total}`)
  payload.logger.info(`Created: ${created}`)
  payload.logger.info(`Skipped: ${skipped}`)
  payload.logger.info(`Errors: ${errors}`)
  payload.logger.info(`Time: ${totalTime}s`)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
