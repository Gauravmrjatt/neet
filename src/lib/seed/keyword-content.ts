import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../../payload.config.js'

function textNode(text: string) {
  return { type: 'text' as const, text, version: 1 }
}

function paragraphNode(...children: ReturnType<typeof textNode>[]) {
  return { type: 'paragraph' as const, children, version: 1 }
}

function rootBody(paragraphs: ReturnType<typeof paragraphNode>[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs,
      direction: 'ltr' as const,
    },
  }
}

function singleParagraph(text: string) {
  return rootBody([paragraphNode(textNode(text))])
}

function multiParagraph(texts: string[]) {
  return rootBody(texts.map((t) => paragraphNode(textNode(t))))
}

const GUIDES = [
  {
    collection: 'counselling' as const,
    title: 'AIQ vs State Quota NEET Counselling 2026 — Complete Comparison',
    slug: 'aiq-vs-state-quota',
    excerpt: 'Understand the key differences between All India Quota and State Quota NEET counselling. Learn which one to prioritize, how both work, and how to maximize your chances.',
    category: 'guide' as const,
    content: multiParagraph([
      'NEET counselling runs on two parallel tracks: All India Quota (AIQ) handled by MCC for 15% of government seats plus all deemed/central universities, and State Quota handled by 29 state authorities for the remaining 85% seats. Every NEET aspirant should understand both systems to maximize their admission chances.',
      'AIQ counselling is conducted by the Medical Counselling Committee (MCC) at mcc.nic.in. It covers 15% of government medical college seats across India, all seats in deemed universities, central universities (AMU, BHU, DU), AIIMS, JIPMER, ESIC and AFMC institutes. AIQ is open to candidates from any Indian state with no domicile restriction.',
      'State quota counselling covers 85% of seats in government medical colleges of each state. It is conducted by individual state counselling authorities (KEA for Karnataka, CET Cell for Maharashtra, DGME for Uttar Pradesh, etc.). State quota is generally restricted to candidates who meet the state\'s domicile requirements, though some states like Karnataka\'s OPN quota are open to all-India candidates.',
      'You should register for both. They run on parallel timelines from July to October. Register on mcc.nic.in for AIQ and on your state\'s counselling portal for state quota. Maximise your options by participating in both.',
    ]),
    blocks: [
      {
        blockType: 'comparisonTable',
        heading: 'AIQ vs State Quota — Key Differences',
        rows: [
          { label: 'Seat Share', columnA: '15% of govt MBBS seats + all deemed/central/AIIMS/JIPMER', columnB: '85% of govt MBBS seats + all private college seats in each state', columnC: '' },
          { label: 'Conducting Body', columnA: 'MCC (Medical Counselling Committee) at mcc.nic.in', columnB: '29 state authorities (KEA, CET Cell, DGME, BCECEB, etc.)', columnC: '' },
          { label: 'Eligibility', columnA: 'Open to all Indian citizens — no domicile requirement', columnB: 'State domicile required (varies by state; some states have open quota)', columnC: '' },
          { label: 'Courses Covered', columnA: 'MBBS, BDS, B.Sc. Nursing (limited)', columnB: 'MBBS, BDS, AYUSH (BAMS, BHMS, BUMS, BSMS)', columnC: '' },
          { label: 'Number of Rounds', columnA: '4 rounds (R1, R2, Mop-Up, Stray Vacancy)', columnB: 'Typically 3-4 rounds per state', columnC: '' },
          { label: 'Registration Fee', columnA: '₹1,000 (General) / ₹500 (SC/ST/OBC)', columnB: '₹500-₹2,500 varies by state', columnC: '' },
          { label: 'Security Deposit', columnA: '₹2,00,000 (General) / ₹50,000 (Reserved)', columnB: 'Varies by state (typically lower)', columnC: '' },
          { label: 'Timeline', columnA: 'July to October (same as state but offset)', columnB: 'July to October (varies by state)', columnC: '' },
        ],
      },
      {
        blockType: 'faqBlock',
        title: 'Frequently Asked Questions',
        items: [
          { question: 'Can I participate in both AIQ and state quota counselling?', answer: 'Yes, you can and should register for both. They run on separate timelines that overlap. Participating in both maximises your seat options.' },
          { question: 'Which counselling should I prioritise?', answer: 'If you have a strong rank (under AIR 10,000), prioritise AIQ for top government colleges. If your rank is moderate, state quota often offers better seat availability.' },
          { question: 'Does AIQ counselling cover all medical colleges?', answer: 'No, AIQ covers only 15% of government college seats plus deemed/central universities. The remaining 85% of government seats and all private college seats are covered by state counselling.' },
          { question: 'Can I switch from AIQ to state quota between rounds?', answer: 'Yes. Many students accept an AIQ seat in Round 1 and then move to a better state quota seat in later rounds. This is common and allowed.' },
        ],
      },
      {
        blockType: 'ctaBlock',
        heading: 'Not Sure Which Path to Choose?',
        description: 'Get personalised counselling from our experts. We analyse your rank, category, and preferences to create the optimal strategy.',
        buttonText: 'Get Expert Guidance',
        buttonLink: '/pricing',
      },
    ],
    seo: {
      metaTitle: 'AIQ vs State Quota NEET Counselling 2026 — Complete Comparison Guide',
      metaDescription: 'Compare AIQ vs state quota NEET counselling 2026. Understand the 15%-85% seat split, eligibility, fees, rounds, and which path is best for your rank and category.',
      keywords: [
        { keyword: 'aiq vs state quota neet counselling' },
        { keyword: 'aiq counselling 2026' },
        { keyword: 'state quota neet counselling difference' },
        { keyword: 'mcc vs state counselling' },
        { keyword: 'neet aiq 15% state 85% explained' },
      ],
    },
  },
  {
    collection: 'counselling' as const,
    title: 'Documents Required for NEET Counselling 2026 — Complete Checklist',
    slug: 'documents-required-neet-counselling',
    excerpt: 'Complete list of all documents needed for NEET UG counselling 2026 registration, choice filling, and college reporting. Category certificates, ID proof, academic docs, and more.',
    category: 'guide' as const,
    content: multiParagraph([
      'Having the correct documents ready before NEET counselling begins is crucial. Missing documents can delay your registration or even disqualify you from seat allotment. Here is a comprehensive checklist of every document you need for NEET UG counselling 2026.',
      'Keep scanned copies (under 200KB each, PDF/JPG format) of every document ready before registration opens. Original documents will be required during college reporting.',
    ]),
    blocks: [
      {
        blockType: 'alertBlock',
        content: rootBody([paragraphNode(textNode('Important: Keep both physical originals and scanned copies (PDF/JPG, under 200KB) of all documents ready before registration opens. Document verification happens during college reporting, not during online registration.'))]),
        type: 'warning',
      },
      {
        blockType: 'contentBlock',
        heading: 'Essential Academic Documents',
        body: multiParagraph([
          'NEET UG 2026 Admit Card — issued by NTA',
          'NEET UG 2026 Scorecard / Rank Letter — downloaded from nta.nic.in',
          'Class 10 Mark Sheet and Passing Certificate — for date of birth verification',
          'Class 12 Mark Sheet and Passing Certificate — for academic eligibility',
          'Graduation Degree (if applying for AYUSH courses requiring specific stream) — applicable for certain courses',
        ]),
      },
      {
        blockType: 'contentBlock',
        heading: 'Identity and Category Documents',
        body: multiParagraph([
          'Aadhaar Card or any government-issued photo ID (Passport, Voter ID, Driving License)',
          'Category Certificate (SC/ST/OBC-NCL/EWS) — must be issued within the last 12 months for OBC-NCL; format as per Government of India',
          'PwD Certificate — if applicable, issued by authorised medical board',
          'Domicile Certificate — required for state quota counselling (varies by state: usually birth in state, parental domicile, or school education in state)',
          'NRI Status Documents — for NRI quota seats (passport, visa, NRI certificate, etc.)',
        ]),
      },
      {
        blockType: 'contentBlock',
        heading: 'Other Required Documents',
        body: multiParagraph([
          'Passport-size photographs (same as uploaded during NEET registration) — 8-10 copies',
          'Transfer Certificate / School Leaving Certificate — from last attended institution',
          'Character Certificate — from last attended institution',
          'Migration Certificate — if applicable (for candidates from other boards)',
          'Allotment Letter — downloaded after each counselling round',
          'Self-declaration of seat acceptance (format available on MCC website)',
        ]),
      },
      {
        blockType: 'faqBlock',
        title: 'Document FAQs',
        items: [
          { question: 'What if my OBC-NCL certificate is more than one year old?', answer: 'You need a fresh OBC-NCL certificate issued within the last 12 months. Certificates older than one year will not be accepted during document verification.' },
          { question: 'Can I upload colour photocopies of documents?', answer: 'Yes, scanned colour copies are accepted during online registration. Original documents must be produced during physical reporting at the allotted college.' },
          { question: 'What if I lost my NEET admit card?', answer: 'You can download it again from the NTA website using your application number and date of birth. The download link remains active even after the exam.' },
        ],
      },
      {
        blockType: 'ctaBlock',
        heading: 'Need Help With Document Preparation?',
        description: 'Our counsellors can guide you through the documentation process, verify your documents, and ensure nothing is missed.',
        buttonText: 'Get Expert Help',
        buttonLink: '/contact',
      },
    ],
    seo: {
      metaTitle: 'Documents Required for NEET Counselling 2026 — Complete Checklist',
      metaDescription: 'Full list of documents needed for NEET UG counselling 2026. Includes academic docs, category certificates, ID proof, domicile requirements, and expert tips for smooth verification.',
      keywords: [
        { keyword: 'documents required for neet counselling 2026' },
        { keyword: 'neet counselling document list' },
        { keyword: 'neet counselling certificate verification' },
        { keyword: 'neet counselling checklist 2026' },
        { keyword: 'documents needed for neet counselling registration' },
      ],
    },
  },
  {
    collection: 'counselling' as const,
    title: 'How to Fill Choices in NEET Counselling 2026 — Step-by-Step Strategy Guide',
    slug: 'how-to-fill-neet-counselling-choices',
    excerpt: 'Master the NEET counselling choice filling process with our expert strategy guide. Learn how to order preferences, use cutoffs data, and optimise your allotment across all rounds.',
    category: 'guide' as const,
    content: multiParagraph([
      'Choice filling is the most critical step in NEET counselling. Your rank determines your eligibility, but your choices determine where you end up. A well-planned choice list can be the difference between a top government college and a missed opportunity.',
      'You can fill up to 300 choices across different colleges and courses. The MCC allotment algorithm assigns you the highest-ranked choice for which you meet the cutoff. Below is a proven strategy to build your choice list.',
    ]),
    blocks: [
      {
        blockType: 'contentBlock',
        heading: 'Step 1: Research Past-Year Cutoffs Before You Start',
        body: multiParagraph([
          'Download the previous year\'s opening and closing ranks for each college under your category from the MCC website.',
          'Use our NEET College Predictor to see which colleges you\'re likely to get based on your rank.',
          'Make three lists: Dream colleges (reach), Target colleges (realistic), Safety colleges (guaranteed).',
        ]),
      },
      {
        blockType: 'contentBlock',
        heading: 'Step 2: Organise Choices in the Right Order',
        body: multiParagraph([
          'Place your absolute dream college first, even if it seems out of reach. There is no penalty for reaching too high.',
          'Order by genuine preference, not by perceived cutoff rank. List colleges you actually want to attend.',
          'Do not leave gaps in your list. If you skip a college you would accept, and nothing above it gets allotted, you may end up with nothing.',
          'Include all courses you are willing to consider — mixing MBBS, BDS, and AYUSH choices gives you more options.',
        ]),
      },
      {
        blockType: 'contentBlock',
        heading: 'Step 3: Strategy Per Round',
        body: multiParagraph([
          'Round 1: Fill ALL choices (up to 300). There is no penalty for not reporting in R1 — you get a free exit. Use this round to test your strategy.',
          'Round 2: Refine your list. Remove colleges you would not attend. New seats open up from R1 non-reportees and vacancies.',
          'Round 3 (Mop-Up): Only add choices you are genuinely willing to accept. The security deposit is forfeited if you withdraw after R2.',
          'Stray Vacancy Round: For leftover seats only. Most top seats are already filled by this stage.',
        ]),
      },
      {
        blockType: 'alertBlock',
        content: rootBody([paragraphNode(textNode('Critical: Always lock your choices before the deadline. Unlocked choices are NOT considered in the allotment algorithm. Set a reminder 2 hours before the deadline and lock manually.'))]),
        type: 'info',
      },
      {
        blockType: 'faqBlock',
        title: 'Choice Filling FAQs',
        items: [
          { question: 'How many choices can I fill?', answer: 'You can fill up to 300 choices. There is no minimum limit, but filling more choices increases your chances of getting a seat.' },
          { question: 'Can I change my choices after locking?', answer: 'No, locked choices cannot be modified in the current round. You can fill fresh choices in subsequent rounds.' },
          { question: 'Should I include private colleges in my choices?', answer: 'Yes, include them as backup options. Many students benefit from including deemed and private colleges in case government seats do not work out.' },
          { question: 'What if I forget to lock my choices?', answer: 'Unlocked choices are not considered. You will have to wait for the next round to participate again. Always lock before the deadline.' },
        ],
      },
      {
        blockType: 'ctaBlock',
        heading: 'Want a Personalised Choice Strategy?',
        description: 'Our expert counsellors create a custom choice-filling strategy based on your rank, category, and preferences. Maximise your allotment chances.',
        buttonText: 'Get Your Strategy',
        buttonLink: '/pricing',
      },
    ],
    seo: {
      metaTitle: 'How to Fill Choices in NEET Counselling — Step-by-Step Strategy 2026',
      metaDescription: 'Learn how to fill NEET counselling choices with expert strategies. Research cutoffs, order preferences, and optimise allotment across all 4 rounds for MBBS/BDS/AYUSH.',
      keywords: [
        { keyword: 'how to fill choices in neet counselling' },
        { keyword: 'neet choice filling strategy' },
        { keyword: 'neet counselling choice list order' },
        { keyword: 'how to lock choices in neet counselling' },
        { keyword: 'neet counselling choice filling tips' },
      ],
    },
  },
  {
    collection: 'counselling' as const,
    title: 'NEET College Predictor Guide 2026 — How to Predict Your Best College',
    slug: 'neet-college-predictor-guide',
    excerpt: 'Everything you need to know about NEET college predictors. How they work, which parameters matter, accuracy tips, and how to use predictions for your choice filling strategy.',
    category: 'guide' as const,
    content: singleParagraph('A NEET College Predictor is an online tool that estimates which MBBS, BDS, or AYUSH colleges you can realistically get into based on your NEET rank, category, domicile state, and quota preference. It uses historical MCC and state counselling cutoff data to give you a probability-based college shortlist. Use it before choice filling to build a data-driven strategy.'),
    blocks: [
      {
        blockType: 'features',
        heading: 'What a Good College Predictor Should Have',
        items: [
          { title: 'Data Freshness', description: 'Uses last 3-5 years of official MCC and state allotment data — not generic estimates.' },
          { title: 'Multi-Category Support', description: 'Handles General, OBC, SC, ST, EWS, and PwD categories with proper rank normalisation.' },
          { title: 'State Quota Coverage', description: 'Separates AIQ and state quota predictions with state-specific cutoff data.' },
          { title: 'Safe/Likely/Risky Bands', description: 'Gives probability-based college lists, not just a single college name.' },
          { title: 'Round-Wise Analysis', description: 'Shows cutoff trends across counselling rounds — R1 vs R2 vs Mop-Up.' },
          { title: 'Course Coverage', description: 'Covers MBBS, BDS, BAMS, BHMS, BUMS, BSMS, and B.Sc. Nursing.' },
        ],
      },
      {
        blockType: 'faqBlock',
        title: 'College Predictor FAQs',
        items: [
          { question: 'How accurate are NEET college predictors?', answer: 'Accuracy depends on data quality and freshness. Good predictors using 3-5 years of official data achieve 80-95% accuracy for the "Safe" band. Predictions are estimates, not guarantees.' },
          { question: 'What parameters do predictors use?', answer: 'NEET rank/all India rank, category (General/OBC/SC/ST/EWS), domicile state, quota preference (AIQ or state), gender, and course preference (MBBS/BDS/AYUSH).' },
          { question: 'Can I use a predictor before NEET results?', answer: 'You can use pre-result predictors that estimate based on your expected marks. Post-result predictors using actual ranks are more accurate.' },
        ],
      },
      {
        blockType: 'ctaBlock',
        heading: 'Try Our NEET College Predictor',
        description: 'Get accurate college predictions based on official MCC and state counselling data. Safe, Likely, and Risky analysis for your rank.',
        buttonText: 'Predict My College',
        buttonLink: '/predictor',
      },
    ],
    seo: {
      metaTitle: 'NEET College Predictor Guide 2026 — How to Predict MBBS/BDS Colleges',
      metaDescription: 'Complete guide to NEET college predictors 2026. Learn how they work, what accuracy to expect, and how to use predictions for a winning choice filling strategy.',
      keywords: [
        { keyword: 'neet college predictor guide' },
        { keyword: 'best neet college predictor tool' },
        { keyword: 'how does neet college predictor work' },
        { keyword: 'mbbs college predictor free' },
        { keyword: 'neet college predictor accuracy' },
      ],
    },
  },
  {
    collection: 'counselling' as const,
    title: 'NEET Counselling for NRI Students 2026 — Complete Guide',
    slug: 'neet-counselling-nri-students',
    excerpt: 'Complete guide for NRI students applying through NEET counselling 2026. NRI quota seats, eligibility documents, fee structure, and step-by-step counselling process.',
    category: 'guide' as const,
    content: multiParagraph([
      'NRI students and children of NRIs can apply for NRI quota seats in private medical colleges and deemed universities through NEET counselling. NRI quota typically accounts for 15-20% of seats in private and deemed medical colleges across India.',
      'The counselling process for NRI quota seats is handled differently from general counselling. Some seats are filled through MCC central counselling, while others are managed directly by the respective colleges or state counselling authorities.',
    ]),
    blocks: [
      {
        blockType: 'contentBlock',
        heading: 'NRI Quota Eligibility Criteria',
        body: multiParagraph([
          'NRI status definition: An Indian citizen residing outside India for employment, business, or education purposes, or a Person of Indian Origin (PIO) / Overseas Citizen of India (OCI) cardholder.',
          'Children of NRIs (NRI-sponsored candidates) are also eligible under NRI quota.',
          'NRI quota seats are filled based on NEET UG scores. Some states require separate applications to the state counselling authority for NRI quota.',
          'Fee structure for NRI quota is significantly higher than management quota — typically ₹15-40 lakh per year depending on the college.',
        ]),
      },
      {
        blockType: 'contentBlock',
        heading: 'Documents Required for NRI Candidates',
        body: multiParagraph([
          'NRI/PIO/OCI certificate or valid supporting documents',
          'Passport and visa copies of the NRI parent',
          'Affidavit of NRI status on stamp paper',
          'Sponsorship certificate (if sponsored by NRI relative)',
          'NEET UG 2026 scorecard',
          'Class 10 and 12 mark sheets',
          'Proof of relationship (birth certificate, passport of parent showing NRI status)',
        ]),
      },
      {
        blockType: 'faqBlock',
        title: 'NRI Counselling FAQs',
        items: [
          { question: 'Do NRI students need to appear for NEET UG?', answer: 'Yes, NEET UG is mandatory for NRI quota seats. There is no exemption from the entrance exam for NRI candidates.' },
          { question: 'Is there separate counselling for NRI quota?', answer: 'Some NRI seats are filled through MCC central counselling, while others require separate applications to individual colleges or state counselling authorities.' },
          { question: 'What is the fee range for NRI quota MBBS?', answer: 'NRI quota fees typically range from ₹15-40 lakh per year for private colleges and ₹25-50 lakh per year for deemed universities.' },
          { question: 'Can NRI students get government college seats?', answer: 'No, NRI quota is only available in private medical colleges and deemed universities. Government colleges do not have an NRI quota.' },
        ],
      },
      {
        blockType: 'ctaBlock',
        heading: 'Need NRI Counselling Guidance?',
        description: 'Our counsellors specialise in NRI quota admissions. Get personalised guidance on documents, college selection, and the entire counselling process.',
        buttonText: 'Get NRI Guidance',
        buttonLink: '/pricing',
      },
    ],
    seo: {
      metaTitle: 'NEET Counselling for NRI Students 2026 — NRI Quota MBBS Guide',
      metaDescription: 'Complete guide for NRI NEET counselling 2026. NRI quota eligibility, documents required, fee structure, and counselling process for NRI MBBS/BDS admissions in India.',
      keywords: [
        { keyword: 'neet counselling for nri students' },
        { keyword: 'nri quota neet counselling 2026' },
        { keyword: 'nri mbbs admission india' },
        { keyword: 'nri quota medical college fees' },
        { keyword: 'neet counselling for nri sponsored candidates' },
      ],
    },
  },
  {
    collection: 'counselling' as const,
    title: 'NEET Counselling Process 2026 — Complete Step-by-Step Guide',
    slug: 'neet-counselling-process-2026',
    excerpt: 'Complete step-by-step guide to the NE UG counselling 2026 process. From registration to seat allotment and college reporting, understand every stage.',
    category: 'guide' as const,
    content: multiParagraph([
      'NEET counselling is the centralised seat allocation process for MBBS, BDS, AYUSH (BAMS, BHMS, BUMS, BSMS), and BVSc courses in India. It is conducted in four rounds by the Medical Counselling Committee (MCC) for All India Quota seats, and separately by state authorities for state quota seats.',
      'The entire process is online except for the final reporting step at the allotted college. Understanding each stage thoroughly is essential to avoid mistakes that could cost you a seat.',
    ]),
    blocks: [
      {
        blockType: 'contentBlock',
        heading: 'Stage 1: Registration and Fee Payment',
        body: multiParagraph([
          'Visit mcc.nic.in and click on the UG counselling registration link.',
          'Enter your NEET roll number, application number, name, date of birth, and mother\'s name.',
          'Pay the non-refundable registration fee (₹1,000 for General/EWS, ₹500 for SC/ST/OBC-NCL/PwD).',
          'Pay the refundable security deposit (₹2,00,000 for General/EWS, ₹50,000 for reserved categories).',
          'Upload scanned copies of your photograph and signature.',
          'Registration window is typically 7-10 days. Do not wait until the last day.',
        ]),
      },
      {
        blockType: 'contentBlock',
        heading: 'Stage 2: Choice Filling and Locking',
        body: multiParagraph([
          'Browse the seat matrix released by MCC for the current round.',
          'Select and order your preferred colleges and courses (up to 300 choices).',
          'Research past-year cutoffs to gauge realistic chances at each college.',
          'Place your dream college first, followed by realistic options, then safety choices.',
          'Lock your choices before the deadline. Unlocked choices are NOT considered by the allotment algorithm.',
          'You can modify unlocked choices any number of times before the lock deadline.',
        ]),
      },
      {
        blockType: 'contentBlock',
        heading: 'Stage 3: Seat Allotment Result',
        body: multiParagraph([
          'MCC publishes the seat allotment result on mcc.nic.in in PDF format.',
          'Results are first released as provisional with a 24-48 hour grievance window.',
          'After resolving grievances, the final result is published.',
          'Check your allotment by searching your roll number in the PDF.',
          'If allotted, you can either accept the seat (freeze), float for a better option in the next round, or exit counselling.',
        ]),
      },
      {
        blockType: 'contentBlock',
        heading: 'Stage 4: Reporting to Allotted College',
        body: multiParagraph([
          'Download the provisional allotment letter from the MCC portal.',
          'Visit the allotted college within the specified reporting period with all original documents.',
          'Complete document verification and pay the college fees.',
          'If you fail to report within the deadline, the seat is forfeited and offered to the next candidate.',
        ]),
      },
      {
        blockType: 'faqBlock',
        title: 'Process FAQs',
        items: [
          { question: 'Can I participate in state counselling if I have accepted an MCC seat?', answer: 'Yes, you can participate in both simultaneously. Many students accept an MCC seat in Round 1 and wait for a better state quota seat in later rounds.' },
          { question: 'What is the float option in seat allotment?', answer: 'Float means you accept the current allotment but want to be considered for a higher-preferred choice in subsequent rounds. If a better option opens up, you are automatically upgraded.' },
          { question: 'What happens if I do not report after Round 2?', answer: 'If you do not report after Round 2, your security deposit is forfeited. In Round 1, there is no penalty for not reporting.' },
        ],
      },
      {
        blockType: 'ctaBlock',
        heading: 'Confused About the Process?',
        description: 'Our expert counsellors guide you through every stage — from registration to final reporting. Get personalised step-by-step support.',
        buttonText: 'Get Personalised Help',
        buttonLink: '/pricing',
      },
    ],
    seo: {
      metaTitle: 'NEET Counselling Process 2026 — Complete Step-by-Step Guide',
      metaDescription: 'Complete step-by-step guide to NEET UG counselling 2026. Learn about registration, choice filling, seat allotment, and college reporting for MBBS/BDS/AYUSH admissions.',
      keywords: [
        { keyword: 'neet counselling process 2026' },
        { keyword: 'how does neet counselling work' },
        { keyword: 'neet counselling registration steps' },
        { keyword: 'neet counselling seat allotment process' },
        { keyword: 'step by step neet counselling guide' },
      ],
    },
  },
  {
    collection: 'counselling' as const,
    title: 'MBBS Fees in India 2026 — Government vs Private vs Deemed vs Abroad',
    slug: 'mbbs-fees-india-2026',
    excerpt: 'Complete comparison of MBBS fees in India for 2026. Government college fees, private college fees, deemed university costs, and MBBS abroad options with detailed breakdown.',
    category: 'guide' as const,
    content: singleParagraph('MBBS fees in India vary enormously depending on the type of institution. Government medical colleges offer the most affordable education (₹10,000-₹1,00,000 per year), while private colleges and deemed universities charge significantly more (₹5-25 lakh per year). Understanding the fee structure across different college types is essential for planning your medical education budget.'),
    blocks: [
      {
        blockType: 'comparisonTable',
        heading: 'MBBS Fee Comparison 2026',
        rows: [
          { label: 'AIIMS (All India Institute of Medical Sciences)', columnA: '₹1,628/year', columnB: '₹1,628/year', columnC: '₹0 (nominal fees)' },
          { label: 'Central Universities (AMU, BHU, DU)', columnA: '₹15,000-₹50,000/year', columnB: '₹15,000-₹50,000/year', columnC: '₹0 (central govt subsidy)' },
          { label: 'State Government Colleges (Tier 1)', columnA: '₹25,000-₹1,00,000/year', columnB: '₹25,000-₹50,000/year', columnC: '₹50,000-₹1,00,000/year' },
          { label: 'State Government Colleges (Tier 2/3)', columnA: '₹10,000-₹50,000/year', columnB: '₹10,000-₹25,000/year', columnC: '₹25,000-₹50,000/year' },
          { label: 'Private Colleges (Management Quota)', columnA: '₹5-15 lakh/year', columnB: '₹5-10 lakh/year', columnC: '₹10-15 lakh/year' },
          { label: 'Deemed Universities', columnA: '₹10-25 lakh/year', columnB: '₹10-18 lakh/year', columnC: '₹18-25 lakh/year' },
          { label: 'MBBS Abroad (Russia, China, Bangladesh, Georgia)', columnA: '₹3-6 lakh/year', columnB: '₹3-5 lakh/year', columnC: '₹4-6 lakh/year' },
        ],
      },
      {
        blockType: 'contentBlock',
        heading: 'Fee Breakdown by College Type',
        body: singleParagraph('Government colleges: Tuition fee ₹10,000-₹1,00,000/year + hostel ₹5,000-₹20,000/year + miscellaneous ₹5,000-₹15,000/year. Private colleges: Tuition fee ₹5-15 lakh/year + hostel ₹50,000-₹1,50,000/year + development fee ₹1-2 lakh/year. Deemed universities: Tuition fee ₹10-25 lakh/year + hostel ₹50,000-₹2,00,000/year + caution deposit ₹1-2 lakh (one-time).'),
      },
      {
        blockType: 'alertBlock',
        content: rootBody([paragraphNode(textNode('Note: The figures above are indicative averages for 2026. Actual fees vary by college, state, and quota. Always verify the exact fee structure on the official college website or counselling portal before applying.'))]),
        type: 'info',
      },
      {
        blockType: 'faqBlock',
        title: 'Fee FAQs',
        items: [
          { question: 'Are government college fees really that low?', answer: 'Yes, government medical college fees are heavily subsidised. AIIMS charges just ₹1,628/year, and state government colleges charge ₹10,000-₹1,00,000/year. This is why government MBBS seats are the most competitive.' },
          { question: 'What is the total cost of MBBS abroad?', answer: 'Total cost ranges from ₹18-35 lakh for countries like Bangladesh, Russia, and Georgia for the full 5.5-year course including tuition and living expenses. Verify NMC recognition before applying.' },
          { question: 'Do deemed universities offer scholarships?', answer: 'Some deemed universities offer merit-based scholarships for high NEET ranks. Scholarships typically cover 25-50% of tuition fees. Check individual college websites for scholarship policies.' },
        ],
      },
      {
        blockType: 'ctaBlock',
        heading: 'Need Help Choosing the Right College for Your Budget?',
        description: 'Our counsellors help you find the best medical college that fits both your rank and your budget. Get personalised fee analysis and recommendations.',
        buttonText: 'Get Fee Guidance',
        buttonLink: '/pricing',
      },
    ],
    seo: {
      metaTitle: 'MBBS Fees in India 2026 — Govt vs Private vs Deemed vs Abroad Comparison',
      metaDescription: 'Complete comparison of MBBS fees in India 2026. Government college fees from ₹10K/year, private colleges ₹5-15L/year, deemed universities ₹10-25L/year, and abroad options.',
      keywords: [
        { keyword: 'mbbs fees in india 2026' },
        { keyword: 'government mbbs college fees' },
        { keyword: 'private mbbs college fees' },
        { keyword: 'cheapest medical colleges in india' },
        { keyword: 'mbbs fees comparison government vs private' },
      ],
    },
  },
  {
    collection: 'blogs' as const,
    title: 'NEET Cutoffs 2026 for Government Medical Colleges — Complete Analysis',
    slug: 'neet-cutoffs-2026',
    excerpt: 'Complete analysis of NEET cutoffs 2026 for government medical colleges. Opening and closing ranks for AIQ and state quota seats across all categories. Past trends and expected cutoffs.',
    categories: [{ category: 'Counselling' }],
    content: multiParagraph([
      'NEET cutoffs (opening and closing ranks) are the most critical data points for counselling strategy. They tell you which colleges you can realistically target based on your rank. Cutoffs vary by college, category, round, and quota type (AIQ vs state).',
      'For top government medical colleges like Maulana Azad Delhi, Grant Medical Mumbai, Madras Medical Chennai, and KGMU Lucknow, closing ranks for general category AIQ seats typically range from AIR 1,000 to 5,000. State quota cutoffs for these same colleges are generally higher (lower rank numbers) due to state domicile preference.',
      'For tier-2 government colleges in state capitals, general category AIQ closing ranks range from AIR 5,000 to 25,000. State quota closing ranks vary significantly by state.',
      'Use our NEET College Predictor to check specific college-wise cutoffs for your rank and category. Cutoff data from previous years (2022-2025) is available for trend analysis.',
    ]),
    blocks: [
      {
        blockType: 'contentBlock',
        heading: 'AIQ Cutoff Trends (General Category)',
        body: multiParagraph([
          'Top 5 Colleges (AIIMS Delhi, Maulana Azad, Grant Medical, Madras Medical, KGMU): Closing rank AIR 500-3,000',
          'Top Government Colleges (BJ Medical Pune, Gandhi Hyderabad, Bangalore Medical, SMS Jaipur): Closing rank AIR 3,000-8,000',
          'Tier-2 Government Colleges: Closing rank AIR 8,000-25,000',
          'Tier-3 Government Colleges and newer institutions: Closing rank AIR 25,000-50,000',
        ]),
      },
      {
        blockType: 'contentBlock',
        heading: 'Category-wise Cutoff Multipliers',
        body: multiParagraph([
          'OBC-NCL: Typically 2.5-3.5x the general category closing rank',
          'SC: Typically 5-8x the general category closing rank',
          'ST: Typically 8-12x the general category closing rank',
          'EWS: Typically similar to general (10% EWS quota within overall seats)',
          'PwD: Varies by category sub-type, generally 1.5-2x within each category',
        ]),
      },
      {
        blockType: 'ctaBlock',
        heading: 'Check Cutoffs for Your Rank',
        description: 'Get personalised cutoff analysis for your NEET rank and category. See exactly which government colleges you can target.',
        buttonText: 'Check My Cutoffs',
        buttonLink: '/predictor',
      },
    ],
    seo: {
      metaTitle: 'NEET Cutoffs 2026 — Opening and Closing Ranks for Government Medical Colleges',
      metaDescription: 'Complete NEET cutoff analysis 2026. Opening and closing ranks for government MBBS colleges across AIQ and state quota. Category-wise trends and rank predictors for all categories.',
      keywords: [
        { keyword: 'neet cutoffs 2026' },
        { keyword: 'neet cutoff for government colleges' },
        { keyword: 'neet opening and closing ranks' },
        { keyword: 'neet aiq cutoff 2026' },
        { keyword: 'government mbbs college closing rank' },
      ],
    },
  },
]

async function seedKeywordContent(payload: Awaited<ReturnType<typeof getPayload>>) {
  let created = 0
  let skipped = 0

  for (const guide of GUIDES) {
    const collection = guide.collection

    const existing = await payload.find({
      collection,
      where: { slug: { equals: guide.slug } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      payload.logger.info(`Skipping "${guide.title}" — already exists (slug: ${guide.slug})`)
      skipped++
      continue
    }

    const data: Record<string, unknown> = {
      title: guide.title,
      slug: guide.slug,
      excerpt: guide.excerpt,
      content: guide.content,
      blocks: guide.blocks,
      status: 'published',
      publishedAt: new Date().toISOString(),
      seo: guide.seo,
    }

    if (collection === 'counselling') {
      data.category = guide.category
    }

    if (collection === 'blogs') {
      data.categories = (guide as any).categories
      data.featuredImage = undefined
    }

    await payload.create({
      collection,
      data: data as any,
      depth: 0,
    })

    payload.logger.info(`Created: "${guide.title}" → /${collection === 'blogs' ? 'blog' : 'counselling'}/${guide.slug}`)
    created++
  }

  return { created, skipped }
}

async function main() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting keyword content seed...\n')

  const result = await seedKeywordContent(payload)

  payload.logger.info(`\nDone. Created: ${result.created}, Skipped (already exists): ${result.skipped}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
