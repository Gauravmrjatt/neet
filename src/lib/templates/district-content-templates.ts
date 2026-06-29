export type TemplateContext = {
  district: any
  state: any
  colleges: any[]
  cutoffs: any[]
  nearbyDistricts: any[]
  relatedBlogs: any[]
  year: string
}

export interface TemplateOutput {
  metaTitle: string
  metaDescription: string
  h1: string
  h2s: string[]
  seoKeywords: string[]
  faqs: { question: string; answer: string }[]
  internalLinks: { label: string; url: string }[]
}

function govtCount(colleges: any[]): number {
  return colleges.filter((c: any) => c.type === 'government' || c.type === 'central').length
}

function privateCount(colleges: any[]): number {
  return colleges.filter((c: any) => c.type === 'private' || c.type === 'deemed').length
}

function collegeNames(colleges: any[]): string {
  return colleges.map((c: any) => c.name).join(', ')
}

export const templates: Record<string, (ctx: TemplateContext) => TemplateOutput> = {
  'neet-counselling': (ctx) => ({
    metaTitle: `NEET Counselling in ${ctx.district.name}, ${ctx.state.name} ${ctx.year} — Complete Process Guide`,
    metaDescription: `Complete NEET counselling guide for ${ctx.district.name}, ${ctx.state.name}. Step-by-step process, registration, choice filling, seat allotment, and document requirements for ${ctx.year} admission. Get expert guidance now.`,
    h1: `NEET Counselling in ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    h2s: [
      `Overview of NEET Counselling in ${ctx.district.name}`,
      `Counselling Process for ${ctx.district.name} Students`,
      `Important Dates for ${ctx.district.name} NEET Counselling ${ctx.year}`,
      `Documents Required for NEET Counselling in ${ctx.district.name}`,
      `Medical Colleges in ${ctx.district.name}`,
      `Frequently Asked Questions`,
    ],
    seoKeywords: [
      `NEET counselling ${ctx.district.name}`,
      `${ctx.district.name} NEET counselling ${ctx.year}`,
      `${ctx.state.name} NEET counselling`,
      `${ctx.district.name} MBBS admission`,
      `NEET counselling process ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `When does NEET counselling start for ${ctx.district.name}?`,
        answer: `NEET UG counselling ${ctx.year} is expected to start in July ${ctx.year}. ${ctx.district.name} students should register on both MCC (for AIQ seats) and ${ctx.state.name} state counselling portal (for state quota seats).`,
      },
      {
        question: `How many medical colleges are in ${ctx.district.name}?`,
        answer: `${ctx.district.name} has ${ctx.colleges.length} medical college(s). ${govtCount(ctx.colleges)} government and ${privateCount(ctx.colleges)} private. ${ctx.colleges.length > 0 ? `These include ${collegeNames(ctx.colleges.slice(0, 3))}.` : 'Students typically apply to colleges in nearby districts.'}`,
      },
      {
        question: `What is the counselling authority for ${ctx.district.name}?`,
        answer: `NEET counselling for ${ctx.district.name} is conducted by ${ctx.state.counsellingAuthority || `${ctx.state.name} counselling authority`} for state quota seats. All India Quota counselling is conducted by MCC.`,
      },
      {
        question: `Can I get MBBS seat in ${ctx.district.name} with ${ctx.year} NEET score?`,
        answer: `Seat availability depends on your NEET rank, category, and the colleges in ${ctx.district.name}. Government college cutoffs are typically higher than private. Use our college predictor tool to check your chances.`,
      },
    ],
    internalLinks: [
      { label: `Cutoff for ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/cutoff` },
      { label: `Fees in ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/fees` },
      { label: `Colleges in ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/all-medical-colleges` },
      { label: `${ctx.state.name} Counselling`, url: `/counselling/state/${ctx.state.slug}` },
    ],
  }),

  'cutoff': (ctx) => ({
    metaTitle: `${ctx.district.name} NEET Cutoff ${ctx.year} — Category-Wise MBBS Closing Ranks`,
    metaDescription: `NEET cutoff ${ctx.year} for ${ctx.district.name}, ${ctx.state.name}. Get category-wise opening and closing ranks for government and private medical colleges. Check previous year trends and expected cutoffs.`,
    h1: `${ctx.district.name} NEET Cutoff ${ctx.year} — Category-Wise Analysis`,
    h2s: [
      `NEET Cutoff for ${ctx.district.name} Medical Colleges ${ctx.year}`,
      `Category-Wise Cutoff Trends`,
      `Government College Cutoffs in ${ctx.district.name}`,
      `Private College Cutoffs in ${ctx.district.name}`,
      `Factors Affecting Cutoff in ${ctx.district.name}`,
      `Expected Cutoff for ${ctx.year}`,
    ],
    seoKeywords: [
      `${ctx.district.name} NEET cutoff ${ctx.year}`,
      `${ctx.district.name} MBBS cutoff`,
      `${ctx.district.name} medical college cutoff`,
      `NEET cutoff ${ctx.district.name} category wise`,
      `${ctx.district.name} government college cutoff`,
    ],
    faqs: [
      {
        question: `What was the NEET cutoff for government colleges in ${ctx.district.name} last year?`,
        answer: ctx.cutoffs.length > 0
          ? `Cutoff varies by college and category in ${ctx.district.name}. Government college closing ranks typically range higher than private colleges. Check our detailed cutoff tables for college-specific data.`
          : `Specific cutoff data for ${ctx.district.name} varies by college. Check our detailed cutoff tables for college-specific opening and closing ranks.`,
      },
      {
        question: `How is NEET cutoff determined for ${ctx.district.name} colleges?`,
        answer: `NEET cutoff for ${ctx.district.name} medical colleges depends on the number of applicants, available seats, category-wise reservation, and the difficulty level of the NEET exam that year.`,
      },
    ],
    internalLinks: [
      { label: `Expected cutoff ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/expected-cutoff` },
      { label: `Colleges in ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/all-medical-colleges` },
      { label: `NEET Counselling ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/neet-counselling` },
    ],
  }),

  'fees': (ctx) => ({
    metaTitle: `MBBS Fees in ${ctx.district.name}, ${ctx.state.name} ${ctx.year} — Government & Private College Fee Structure`,
    metaDescription: `MBBS fee structure for ${ctx.district.name}, ${ctx.state.name} medical colleges. Compare government college fees vs private college fees. Get hostel, security deposit, and total course fee details.`,
    h1: `MBBS Fees in ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    h2s: [
      `Fee Structure for Medical Colleges in ${ctx.district.name}`,
      `Government College Fees in ${ctx.district.name}`,
      `Private College Fees in ${ctx.district.name}`,
      `Hostel and Other Fees`,
      `NRI Quota Fees in ${ctx.district.name}`,
      `Fee Comparison with Nearby Districts`,
    ],
    seoKeywords: [
      `MBBS fees ${ctx.district.name}`,
      `${ctx.district.name} medical college fees`,
      `${ctx.district.name} MBBS fee structure ${ctx.year}`,
      `government college fees ${ctx.district.name}`,
      `private college fees ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `What is the MBBS fee for government colleges in ${ctx.district.name}?`,
        answer: `Government medical college fees in ${ctx.district.name} range from approximately ₹10,000 to ₹1,00,000 per year, depending on the college. Hostel fees are additional.`,
      },
      {
        question: `What is the MBBS fee for private colleges in ${ctx.district.name}?`,
        answer: `Private medical college fees in ${ctx.district.name} range from approximately ₹5 lakh to ₹25 lakh per year. Deemed universities may charge higher fees.`,
      },
    ],
    internalLinks: [
      { label: `Cutoff ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/cutoff` },
      { label: `Seat Matrix ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/seat-matrix` },
      { label: `Documents Required`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/documents-required` },
    ],
  }),

  'documents-required': (ctx) => ({
    metaTitle: `Documents Required for NEET Counselling in ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    metaDescription: `Complete list of documents required for NEET counselling in ${ctx.district.name}, ${ctx.state.name}. NEET scorecard, admit card, class 10/12 marksheets, domicile, category certificates, and more.`,
    h1: `Documents Required for NEET Counselling in ${ctx.district.name} ${ctx.year}`,
    h2s: [
      `Essential Documents for NEET Counselling`,
      `Category Certificate Requirements`,
      `${ctx.state.name} Domicile Requirements for ${ctx.district.name}`,
      `Document Verification Process in ${ctx.district.name}`,
      `Common Document Mistakes to Avoid`,
    ],
    seoKeywords: [
      `documents for NEET counselling ${ctx.district.name}`,
      `${ctx.district.name} counselling documents`,
      `NEET document verification ${ctx.district.name}`,
      `MBBS admission documents ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `What are the mandatory documents for NEET counselling in ${ctx.district.name}?`,
        answer: `Mandatory documents include: NEET ${ctx.year} Admit Card, NEET Scorecard/Rank Letter, Class 10 Certificate (date of birth), Class 12 Marksheet, Aadhaar Card, Passport-size photographs, and State Domicile Certificate (for ${ctx.state.name} state quota).`,
      },
      {
        question: `Do I need domicile certificate for ${ctx.district.name} counselling?`,
        answer: `${ctx.district.name} falls under ${ctx.state.name} state counselling. You need a valid ${ctx.state.name} domicile certificate to claim state quota seats. Requirements vary — check the official counselling website.`,
      },
    ],
    internalLinks: [
      { label: `NEET Counselling ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/neet-counselling` },
      { label: `${ctx.state.name} Counselling Guide`, url: `/counselling/state/${ctx.state.slug}` },
    ],
  }),

  'choice-filling': (ctx) => ({
    metaTitle: `NEET Choice Filling Strategy for ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    metaDescription: `Expert NEET choice filling strategy for ${ctx.district.name} students. Learn how to arrange college preferences, use the choice locking system, and maximize your MBBS seat chances.`,
    h1: `NEET Choice Filling Strategy for ${ctx.district.name} ${ctx.year}`,
    h2s: [
      `How to Fill Choices for NEET Counselling in ${ctx.district.name}`,
      `Step-by-Step Choice Filling Process`,
      `Choice Filling Strategy for ${ctx.district.name} Students`,
      `Common Choice Filling Mistakes`,
      `Using College Predictor for Better Choices`,
      `Choice Locking and Modification Rules`,
    ],
    seoKeywords: [
      `choice filling ${ctx.district.name}`,
      `NEET choice filling strategy ${ctx.district.name}`,
      `${ctx.district.name} college preference list`,
      `how to fill NEET choices ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `How many choices can I fill for NEET counselling in ${ctx.district.name}?`,
        answer: `You can fill up to 300 choices across different colleges and courses in MCC counselling. For ${ctx.state.name} state counselling, the limit may vary. Include colleges in ${ctx.district.name} and nearby districts in your preference list.`,
      },
      {
        question: `Should I include colleges outside ${ctx.district.name} in my choices?`,
        answer: `Yes, always include colleges in other districts and states. Do not limit yourself to ${ctx.district.name} only. Fill all 300 choices in order of genuine preference to maximize your seat chances.`,
      },
    ],
    internalLinks: [
      { label: `NEET Counselling ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/neet-counselling` },
      { label: `Cutoff ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/cutoff` },
      { label: `College Predictor`, url: `/predictor` },
    ],
  }),

  'seat-matrix': (ctx) => ({
    metaTitle: `${ctx.district.name} MBBS Seat Matrix ${ctx.year} — Category-Wise Seat Distribution`,
    metaDescription: `MBBS seat matrix for ${ctx.district.name}, ${ctx.state.name} ${ctx.year}. Get total seats, AIQ seats, state quota seats, management quota, and NRI quota distribution for each medical college.`,
    h1: `${ctx.district.name} MBBS Seat Matrix ${ctx.year}`,
    h2s: [
      `Total MBBS Seats in ${ctx.district.name}`,
      `College-Wise Seat Distribution`,
      `Category-Wise Seat Breakdown`,
      `AIQ vs State Quota Seats in ${ctx.district.name}`,
      `Management and NRI Quota Seats`,
    ],
    seoKeywords: [
      `${ctx.district.name} MBBS seat matrix ${ctx.year}`,
      `${ctx.district.name} medical college seats`,
      `${ctx.district.name} NEET seat distribution`,
      `MBBS seats in ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `How many MBBS seats are available in ${ctx.district.name}?`,
        answer: `${ctx.district.name} has ${ctx.colleges.length} medical colleges with varying seat capacities. Total seats depend on NMC approval and college infrastructure. Check our detailed seat matrix for college-wise breakdown.`,
      },
      {
        question: `How many AIQ seats are in ${ctx.district.name} colleges?`,
        answer: `15% of total MBBS seats in government colleges of ${ctx.district.name} are reserved for All India Quota. The remaining 85% are filled through ${ctx.state.name} state counselling.`,
      },
    ],
    internalLinks: [
      { label: `Cutoff ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/cutoff` },
      { label: `Colleges in ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/all-medical-colleges` },
    ],
  }),

  'important-dates': (ctx) => ({
    metaTitle: `${ctx.district.name} NEET Counselling Important Dates ${ctx.year} — Full Schedule`,
    metaDescription: `NEET counselling ${ctx.year} important dates for ${ctx.district.name}, ${ctx.state.name}. Registration, choice filling, seat allotment, reporting dates for MCC and state counselling. Stay updated.`,
    h1: `${ctx.district.name} NEET Counselling Important Dates ${ctx.year}`,
    h2s: [
      `MCC NEET UG Counselling ${ctx.year} Schedule`,
      `${ctx.state.name} State Counselling ${ctx.year} Schedule`,
      `Choice Filling and Locking Dates`,
      `Seat Allotment Result Dates`,
      `Reporting and Document Verification Dates`,
      `Mop-Up and Stray Vacancy Round Dates`,
    ],
    seoKeywords: [
      `${ctx.district.name} NEET counselling dates ${ctx.year}`,
      `NEET counselling schedule ${ctx.district.name}`,
      `${ctx.district.name} MBBS admission dates`,
      `${ctx.state.name} counselling dates ${ctx.year}`,
    ],
    faqs: [
      {
        question: `When does NEET counselling registration start for ${ctx.district.name} students?`,
        answer: `MCC NEET UG counselling ${ctx.year} registration typically starts in July. ${ctx.state.name} state counselling dates are announced separately. Check our important dates page for the latest schedule.`,
      },
      {
        question: `What is the last date for choice filling in ${ctx.district.name}?`,
        answer: `Choice filling deadlines vary by round. Round 1 typically allows 4-5 days for choice filling. Late fees apply after the deadline. Always lock your choices before the scheduled deadline.`,
      },
    ],
    internalLinks: [
      { label: `NEET Counselling ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/neet-counselling` },
      { label: `${ctx.state.name} Counselling`, url: `/counselling/state/${ctx.state.slug}` },
      { label: `Latest Updates`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/updates` },
    ],
  }),

  'faq': (ctx) => ({
    metaTitle: `NEET Counselling FAQs for ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    metaDescription: `Frequently asked questions about NEET counselling in ${ctx.district.name}, ${ctx.state.name}. Get answers about eligibility, documents, choice filling, seat allotment, and college selection.`,
    h1: `NEET Counselling FAQs for ${ctx.district.name}, ${ctx.state.name}`,
    h2s: [
      `General NEET Counselling Questions for ${ctx.district.name}`,
      `Eligibility and Documents`,
      `College and Cutoff Questions`,
      `Choice Filling and Seat Allotment`,
      `${ctx.state.name} State Counselling Queries`,
    ],
    seoKeywords: [
      `${ctx.district.name} NEET counselling FAQs`,
      `NEET counselling questions ${ctx.district.name}`,
      `${ctx.district.name} MBBS admission FAQs`,
      `${ctx.state.name} counselling queries`,
    ],
    faqs: [
      {
        question: `What is the NEET qualifying cutoff for ${ctx.district.name} students?`,
        answer: `General category students need 50th percentile (approx 137+ marks), OBC/SC/ST need 40th percentile (approx 107+), and PwD need 45th percentile. These are minimum qualifying scores — actual college cutoffs are much higher.`,
      },
      {
        question: `Can students from other states apply to ${ctx.district.name} colleges?`,
        answer: `For AIQ seats (15%), yes. For state quota seats, you need ${ctx.state.name} domicile. Private colleges in ${ctx.district.name} may have management quota seats open to all-India candidates, but at higher fees.`,
      },
      {
        question: `What is the counselling process for ${ctx.district.name}?`,
        answer: `The process includes: 1) Registration on MCC and ${ctx.state.name} portals, 2) Document upload and verification, 3) Choice filling (up to 300 preferences), 4) Seat allotment based on rank and preference, 5) Reporting to the allotted college.`,
      },
      {
        question: `Is there ${ctx.state.name} state quota in ${ctx.district.name} medical colleges?`,
        answer: `Yes, 85% of government college seats in ${ctx.district.name} are filled through ${ctx.state.name} state quota. Eligibility requires valid ${ctx.state.name} domicile as per state rules.`,
      },
      {
        question: `When will the ${ctx.district.name} NEET counselling ${ctx.year} start?`,
        answer: `MCC counselling is expected to start in July ${ctx.year}, followed by ${ctx.state.name} state counselling. Watch our updates page for the latest announcements.`,
      },
    ],
    internalLinks: [
      { label: `NEET Counselling ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/neet-counselling` },
      { label: `Documents Required`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/documents-required` },
      { label: `Important Dates`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/important-dates` },
    ],
  }),

  'all-medical-colleges': (ctx) => ({
    metaTitle: `Medical Colleges in ${ctx.district.name}, ${ctx.state.name} ${ctx.year} — Complete List`,
    metaDescription: `Complete list of medical colleges in ${ctx.district.name}, ${ctx.state.name}. Find government and private MBBS colleges with NMC approval, fees, cutoff, seat matrix, and admission process.`,
    h1: `Medical Colleges in ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    h2s: [
      `List of Medical Colleges in ${ctx.district.name}`,
      `Government Medical Colleges in ${ctx.district.name}`,
      `Private Medical Colleges in ${ctx.district.name}`,
      `College Comparison: Fees, Cutoff, and Seats`,
      `How to Choose the Right College in ${ctx.district.name}`,
    ],
    seoKeywords: [
      `medical colleges in ${ctx.district.name}`,
      `MBBS colleges in ${ctx.district.name}`,
      `${ctx.district.name} medical college list`,
      `${ctx.district.name} government medical college`,
      `${ctx.district.name} private medical college`,
    ],
    faqs: [
      {
        question: `How many medical colleges are in ${ctx.district.name}?`,
        answer: `${ctx.district.name} has ${ctx.colleges.length} medical college(s). ${govtCount(ctx.colleges)} government and ${privateCount(ctx.colleges)} private.`,
      },
      {
        question: `Which is the best medical college in ${ctx.district.name}?`,
        answer: ctx.colleges.length > 0
          ? `${ctx.colleges[0]?.name || `The medical college in ${ctx.district.name}`} is among the top choices. Check our college comparison for detailed rankings, fees, and cutoff data.`
          : `${ctx.district.name} does not have medical colleges. Students typically apply to nearby districts.`,
      },
    ],
    internalLinks: [
      { label: `Cutoff ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/cutoff` },
      { label: `Fees ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/fees` },
      { label: `Seat Matrix ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/seat-matrix` },
    ],
  }),

  'government-medical-colleges': (ctx) => ({
    metaTitle: `Government Medical Colleges in ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    metaDescription: `List of government medical colleges in ${ctx.district.name}, ${ctx.state.name}. Get details on fees (₹10K-1L/year), cutoff ranks, seat matrix, and admission process for ${ctx.year}.`,
    h1: `Government Medical Colleges in ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    h2s: [
      `Government Medical Colleges in ${ctx.district.name}`,
      `Fee Structure for Government Colleges`,
      `NEET Cutoff for Government Colleges in ${ctx.district.name}`,
      `Seat Matrix for Government Colleges`,
      `Admission Process for Government Colleges`,
    ],
    seoKeywords: [
      `government medical colleges ${ctx.district.name}`,
      `${ctx.district.name} government MBBS college`,
      `government college cutoff ${ctx.district.name}`,
      `government MBBS fees ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `How many government medical colleges are in ${ctx.district.name}?`,
        answer: `${ctx.district.name} has ${govtCount(ctx.colleges)} government medical college(s). Government colleges offer the most affordable MBBS education.`,
      },
      {
        question: `What is the fee for government MBBS in ${ctx.district.name}?`,
        answer: `Government medical college fees in ${ctx.district.name} range from approximately ₹10,000 to ₹1,00,000 per year, with additional hostel and miscellaneous fees.`,
      },
    ],
    internalLinks: [
      { label: `Private Colleges ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/private-medical-colleges` },
      { label: `Cutoff ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/cutoff` },
    ],
  }),

  'private-medical-colleges': (ctx) => ({
    metaTitle: `Private Medical Colleges in ${ctx.district.name}, ${ctx.state.name} ${ctx.year} — Fees & Cutoff`,
    metaDescription: `List of private medical colleges in ${ctx.district.name}, ${ctx.state.name}. Get MBBS fees (₹5-25L/year), cutoff ranks, management quota, NRI quota, and admission process for ${ctx.year}.`,
    h1: `Private Medical Colleges in ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    h2s: [
      `Private Medical Colleges in ${ctx.district.name}`,
      `Fee Structure for Private Colleges`,
      `Management and NRI Quota in ${ctx.district.name}`,
      `NEET Cutoff for Private Colleges`,
      `Admission Process for Private Colleges`,
    ],
    seoKeywords: [
      `private medical colleges ${ctx.district.name}`,
      `${ctx.district.name} private MBBS college`,
      `private MBBS fees ${ctx.district.name}`,
      `management quota ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `How many private medical colleges are in ${ctx.district.name}?`,
        answer: `${ctx.district.name} has ${privateCount(ctx.colleges)} private medical college(s). Private colleges offer MBBS at higher fees compared to government institutions.`,
      },
      {
        question: `What is the private MBBS fee in ${ctx.district.name}?`,
        answer: `Private medical college fees in ${ctx.district.name} range from approximately ₹5 lakh to ₹25 lakh per year. Deemed university fees may be higher. NRI quota seats have separate fee structures.`,
      },
    ],
    internalLinks: [
      { label: `Government Colleges ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/government-medical-colleges` },
      { label: `Fees ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/fees` },
    ],
  }),

  'mbbs-admission': (ctx) => ({
    metaTitle: `MBBS Admission in ${ctx.district.name}, ${ctx.state.name} ${ctx.year} — Complete Guide`,
    metaDescription: `Complete MBBS admission guide for ${ctx.district.name}, ${ctx.state.name} ${ctx.year}. Eligibility, NEET cutoff, counselling process, documents, fees, and college list. Get step-by-step guidance.`,
    h1: `MBBS Admission in ${ctx.district.name}, ${ctx.state.name} ${ctx.year}`,
    h2s: [
      `MBBS Admission Process in ${ctx.district.name}`,
      `Eligibility Criteria for MBBS in ${ctx.district.name}`,
      `NEET Cutoff for ${ctx.district.name} MBBS Colleges`,
      `Fee Structure for MBBS in ${ctx.district.name}`,
      `Counselling Process and Document Verification`,
      `Tips for Securing MBBS Seat in ${ctx.district.name}`,
    ],
    seoKeywords: [
      `MBBS admission ${ctx.district.name} ${ctx.year}`,
      `${ctx.district.name} MBBS admission process`,
      `how to get MBBS seat in ${ctx.district.name}`,
      `MBBS eligibility ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `What is the eligibility for MBBS admission in ${ctx.district.name}?`,
        answer: `Students must: 1) Qualify NEET UG ${ctx.year} with minimum percentile, 2) Pass Class 12 with Physics, Chemistry, Biology/Biotechnology and English, 3) Meet ${ctx.state.name} domicile requirements for state quota.`,
      },
      {
        question: `Can I get direct MBBS admission in ${ctx.district.name}?`,
        answer: `No, MBBS admissions in ${ctx.district.name} are strictly through NEET counselling. There is no direct admission. Management quota seats in private colleges also require valid NEET scores.`,
      },
    ],
    internalLinks: [
      { label: `NEET Counselling ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/neet-counselling` },
      { label: `Cutoff ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/cutoff` },
      { label: `Documents Required`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/documents-required` },
    ],
  }),

  'mcc-counselling': (ctx) => ({
    metaTitle: `MCC NEET Counselling ${ctx.year} for ${ctx.district.name}, ${ctx.state.name} — Complete Guide`,
    metaDescription: `MCC NEET counselling ${ctx.year} guide for ${ctx.district.name} students. AIQ seat registration, choice filling, allotment process, document verification, and important dates.`,
    h1: `MCC NEET Counselling ${ctx.year} for ${ctx.district.name} Students`,
    h2s: [
      `What is MCC Counselling for ${ctx.district.name} Students?`,
      `MCC Registration Process for ${ctx.district.name}`,
      `AIQ Seats Available for ${ctx.district.name} Candidates`,
      `MCC Choice Filling Strategy`,
      `MCC Seat Allotment Process`,
      `MCC vs State Counselling for ${ctx.district.name}`,
    ],
    seoKeywords: [
      `MCC counselling ${ctx.district.name}`,
      `MCC NEET counselling ${ctx.year} ${ctx.district.name}`,
      `AIQ counselling ${ctx.district.name}`,
      `MCC registration ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `What is MCC counselling for ${ctx.district.name} students?`,
        answer: `MCC (Medical Counselling Committee) conducts NEET counselling for 15% All India Quota seats in government colleges, 100% seats in deemed universities, central universities, ESIC, AIIMS, and JIPMER. ${ctx.district.name} students must register on mcc.nic.in.`,
      },
      {
        question: `Should I register for both MCC and ${ctx.state.name} state counselling?`,
        answer: `Yes, absolutely. Register for both MCC (for AIQ seats) and ${ctx.state.name} state counselling (for 85% state quota seats). Missing either limits your options.`,
      },
    ],
    internalLinks: [
      { label: `State Counselling ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/state-counselling` },
      { label: `NEET Counselling ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/neet-counselling` },
    ],
  }),

  'state-counselling': (ctx) => ({
    metaTitle: `${ctx.state.name} NEET State Counselling ${ctx.year} for ${ctx.district.name} — Complete Guide`,
    metaDescription: `${ctx.state.name} state NEET counselling ${ctx.year} guide for ${ctx.district.name}. State quota registration, eligibility, domicile requirements, seat matrix, and counselling process for ${ctx.district.name} students.`,
    h1: `${ctx.state.name} NEET State Counselling ${ctx.year} for ${ctx.district.name}`,
    h2s: [
      `${ctx.state.name} State Counselling Process`,
      `${ctx.state.name} Domicile Requirements for ${ctx.district.name}`,
      `Reservation Policy in ${ctx.state.name}`,
      `State Quota Seat Matrix for ${ctx.district.name}`,
      `${ctx.state.name} Counselling Important Dates`,
      `How to Apply for ${ctx.state.name} State Counselling`,
    ],
    seoKeywords: [
      `${ctx.state.name} state counselling ${ctx.district.name}`,
      `${ctx.district.name} state quota counselling`,
      `${ctx.state.name} NEET counselling ${ctx.year}`,
      `${ctx.state.name} domicile ${ctx.district.name}`,
    ],
    faqs: [
      {
        question: `How does ${ctx.state.name} state counselling work for ${ctx.district.name} students?`,
        answer: `${ctx.state.name} state counselling covers 85% of government college seats. ${ctx.district.name} students need valid ${ctx.state.name} domicile. The counselling is conducted by ${ctx.state.counsellationAuthority || ctx.state.name + ' counselling authority'}.`,
      },
      {
        question: `What is the reservation policy for ${ctx.district.name} in ${ctx.state.name}?`,
        answer: `${ctx.state.name} follows central reservation policy (SC 15%, ST 7.5%, OBC-NCL 27%, EWS 10%, PwD 5%) plus any state-specific reservations. Check the official counselling portal for detailed category-wise seat distribution.`,
      },
    ],
    internalLinks: [
      { label: `MCC Counselling ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/mcc-counselling` },
      { label: `${ctx.state.name} Counselling`, url: `/counselling/state/${ctx.state.slug}` },
    ],
  }),

  'expected-cutoff': (ctx) => ({
    metaTitle: `Expected NEET Cutoff for ${ctx.district.name}, ${ctx.state.name} ${ctx.year} — Predicted Ranks`,
    metaDescription: `Expected NEET cutoff for ${ctx.district.name}, ${ctx.state.name} ${ctx.year}. Predicted opening and closing ranks for government and private MBBS colleges based on previous year trends.`,
    h1: `Expected NEET Cutoff for ${ctx.district.name} ${ctx.year}`,
    h2s: [
      `Expected Cutoff for Government Colleges in ${ctx.district.name}`,
      `Expected Cutoff for Private Colleges in ${ctx.district.name}`,
      `Category-Wise Expected Cutoff ${ctx.year}`,
      `Previous Year Cutoff Trends for ${ctx.district.name}`,
      `Factors Influencing Cutoff Changes`,
    ],
    seoKeywords: [
      `expected NEET cutoff ${ctx.district.name} ${ctx.year}`,
      `${ctx.district.name} predicted cutoff ${ctx.year}`,
      `expected cutoff ${ctx.district.name} government college`,
      `${ctx.district.name} MBBS cutoff prediction`,
    ],
    faqs: [
      {
        question: `What is the expected NEET cutoff for government colleges in ${ctx.district.name} ${ctx.year}?`,
        answer: `Expected cutoff varies. Based on ${ctx.year === '2026' ? '2025' : String(Number(ctx.year) - 1)} trends, government college closing ranks in ${ctx.district.name} are likely to remain similar or see minor changes. Use our college predictor for personalized estimates.`,
      },
      {
        question: `Will the cutoff for ${ctx.district.name} increase or decrease in ${ctx.year}?`,
        answer: `Cutoff trends depend on NEET difficulty, number of applicants, and seat availability. Generally, cutoffs remain stable year-on-year with minor fluctuations. Increased competition may push cutoffs slightly higher.`,
      },
    ],
    internalLinks: [
      { label: `Actual Cutoff ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/cutoff` },
      { label: `College Predictor`, url: `/predictor` },
    ],
  }),

  'news': (ctx) => ({
    metaTitle: `${ctx.district.name} NEET Counselling News ${ctx.year} — Latest Updates`,
    metaDescription: `Latest NEET counselling news and updates for ${ctx.district.name}, ${ctx.state.name} ${ctx.year}. Get real-time updates on admission schedules, cutoffs, seat matrices, and counselling announcements.`,
    h1: `${ctx.district.name} NEET Counselling News ${ctx.year}`,
    h2s: [
      `Latest News for ${ctx.district.name} NEET Counselling`,
      `${ctx.state.name} Medical Education Updates`,
      `NEET ${ctx.year} Announcements for ${ctx.district.name}`,
      `Government Policy Changes Affecting ${ctx.district.name}`,
    ],
    seoKeywords: [
      `${ctx.district.name} NEET news ${ctx.year}`,
      `${ctx.district.name} MBBS admission news`,
      `${ctx.state.name} medical education news`,
      `NEET counselling updates ${ctx.district.name}`,
    ],
    faqs: [],
    internalLinks: [
      { label: `Updates ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/updates` },
      { label: `Important Dates`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/important-dates` },
    ],
  }),

  'updates': (ctx) => ({
    metaTitle: `${ctx.district.name} NEET Counselling Updates ${ctx.year} — Real-Time Information`,
    metaDescription: `Real-time NEET counselling updates for ${ctx.district.name}, ${ctx.state.name} ${ctx.year}. Stay informed about registration deadlines, seat allotment results, cutoffs, and counselling rounds.`,
    h1: `${ctx.district.name} NEET Counselling Updates ${ctx.year}`,
    h2s: [
      `Recent Updates for ${ctx.district.name}`,
      `${ctx.state.name} State Counselling Updates`,
      `MCC Counselling Updates`,
      `Important Alerts for ${ctx.district.name} Students`,
    ],
    seoKeywords: [
      `${ctx.district.name} NEET updates ${ctx.year}`,
      `${ctx.district.name} counselling updates`,
      `NEET ${ctx.year} latest updates ${ctx.district.name}`,
    ],
    faqs: [],
    internalLinks: [
      { label: `News ${ctx.district.name}`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/news` },
      { label: `Important Dates`, url: `/states/${ctx.state.slug}/${ctx.district.slug}/important-dates` },
    ],
  }),
}
