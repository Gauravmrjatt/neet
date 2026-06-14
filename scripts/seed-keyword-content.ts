import { getPayloadClient } from '../src/lib/payload'

/* ─── Lexical content builders ─── */

function t(text: string, format = 0): any {
  return { mode: 'normal', text, type: 'text', style: '', detail: 0, format, version: 1 }
}

function bold(text: string): any {
  return t(text, 1)
}

function p(...children: any[]): any {
  return { type: 'paragraph', format: '', indent: 0, version: 1, children, direction: 'ltr', textFormat: 0, textStyle: '' }
}

function heading(tag: string, ...children: any[]): any {
  return { type: 'heading', tag, format: '', indent: 0, version: 1, children, direction: 'ltr' }
}

function listItem(...children: any[]): any {
  return { type: 'listitem', format: '', indent: 0, version: 1, children, direction: 'ltr' }
}

function bulletList(...items: any[]): any {
  return { type: 'list', listType: 'bullet', format: '', indent: 0, version: 1, children: items, direction: 'ltr', start: 1 }
}

function root(...children: any[]): any {
  return { root: { type: 'root', format: '', indent: 0, version: 1, children, direction: 'ltr' } }
}

/* ─── Content data ─── */

const blogPosts = [
  {
    title: 'NEET MDS Counselling 2026 — Dates, Process, Cutoffs & College Allotment',
    slug: 'neet-mds-counselling-2026',
    excerpt: 'Complete guide to NEET MDS counselling 2026 by MCC/NBEMS. Check counselling dates, registration process, choice filling, seat allotment, and cutoffs for MDS admission in dental colleges.',
    content: root(
      heading('h2', t('What is NEET MDS Counselling?')),
      p(t('NEET MDS counselling is the centralised admission process for Master of Dental Surgery (MDS) programmes across India. Conducted by the Medical Counselling Committee (MCC) under the Directorate General of Health Services (DGHS) on behalf of the Ministry of Health & Family Welfare, this counselling allocates seats in government, government-aided, and private dental colleges based on NEET MDS scores.')),
      p(t('For the 2026 admission cycle, NEET MDS counselling will be conducted online through the official MCC portal at mcc.nic.in. The process includes registration, choice filling, seat allotment in multiple rounds, and reporting to the allotted college.')),
      heading('h2', t('NEET MDS Counselling 2026 Important Dates')),
      p(t('While the official schedule for NEET MDS 2026 counselling is yet to be announced by MCC, based on previous year trends, the expected timeline is as follows:')),
      bulletList(
        listItem(bold('NEET MDS 2026 Exam: '), t('Expected in March 2026')),
        listItem(bold('Result Declaration: '), t('Expected within 6-8 weeks after exam')),
        listItem(bold('Round 1 Registration: '), t('Expected in June-July 2026')),
        listItem(bold('Round 1 Seat Allotment: '), t('Expected in July 2026')),
        listItem(bold('Round 2 Registration: '), t('Expected in August 2026')),
        listItem(bold('Mop-Up Round: '), t('Expected in September 2026')),
        listItem(bold('Stray Vacancy Round: '), t('Expected in October 2026')),
      ),
      p(t('Candidates are advised to regularly check the official MCC website and nbems.in for the latest updates on NEET MDS counselling dates.')),
      heading('h2', t('NEET MDS Counselling Process — Step by Step')),
      p(t('The NEET MDS counselling process involves the following steps:')),
      bulletList(
        listItem(bold('Registration: '), t('Visit mcc.nic.in and register using your NEET MDS roll number, application number, and other credentials. Pay the registration fee based on your category.')),
        listItem(bold('Choice Filling & Locking: '), t('Select and prioritise your preferred dental colleges and courses. Lock your choices before the deadline.')),
        listItem(bold('Seat Allotment: '), t('Seats are allotted based on your NEET MDS rank, category, and filled choices. Results are published on the MCC website.')),
        listItem(bold('Document Verification: '), t('Upload required documents online for verification.')),
        listItem(bold('Reporting to College: '), t('If allotted a seat, report to the designated college within the specified timeframe for admission confirmation.')),
      ),
      heading('h2', t('NEET MDS 2026 Cutoff Ranks')),
      p(t('NEET MDS cutoff ranks vary across colleges and specialities. The closing ranks depend on factors such as the number of applicants, seat availability, and category. Here are the expected cutoff trends:')),
      bulletList(
        listItem(bold('Government Dental Colleges: '), t('Closing ranks typically range from 500 to 5,000 for General category candidates, depending on the college and speciality.')),
        listItem(bold('Private Dental Colleges: '), t('Closing ranks can extend up to 20,000 or more for General category.')),
        listItem(bold('OBC/SC/ST Categories: '), t('Candidates from reserved categories receive relaxation as per government norms.')),
      ),
      heading('h2', t('Documents Required for NEET MDS Counselling')),
      p(t('Candidates must keep the following documents ready for NEET MDS counselling:')),
      bulletList(
        listItem(t('NEET MDS 2026 scorecard/rank letter')),
        listItem(t('NEET MDS admit card')),
        listItem(t('MBBS degree certificate and mark sheets')),
        listItem(t('Internship completion certificate')),
        listItem(t('Provisional or permanent registration certificate issued by DCI')),
        listItem(t('Category certificate (if applicable)')),
        listItem(t('PwD certificate (if applicable)')),
        listItem(t('Identity proof (Aadhaar, PAN, or passport)')),
        listItem(t('Passport-size photographs')),
      ),
      heading('h2', t('NBEMS NEET MDS — Role of National Board of Examinations')),
      p(t('The NBEMS (National Board of Examinations in Medical Sciences) conducts the NEET MDS examination. The counselling, however, is managed by MCC for 50% All India Quota seats and by respective state authorities for state quota seats. Candidates should check nbems.in for exam-related updates and mcc.nic.in for counselling-related information.')),
    ),
    blocks: [
      {
        blockType: 'faqBlock',
        title: 'Frequently Asked Questions about NEET MDS Counselling',
        items: [
          {
            question: 'What is the NEET MDS counselling 2026 date?',
            answer: 'The official NEET MDS counselling 2026 dates will be announced by MCC on mcc.nic.in after the NEET MDS 2026 results are declared. Registration typically begins 4-6 weeks after the result announcement.',
          },
          {
            question: 'How many rounds are there in NEET MDS counselling?',
            answer: 'NEET MDS counselling typically has two main rounds, followed by a mop-up round and a stray vacancy round. The exact number of rounds depends on seat availability and the number of candidates.',
          },
          {
            question: 'Can I get a dental college through NEET MDS with a low rank?',
            answer: 'Yes, candidates with lower ranks can get seats in private dental colleges or less popular specialities. The closing ranks vary significantly between institutions, so it is important to fill choices strategically across all available options.',
          },
          {
            question: 'What is the difference between MCC counselling and state counselling for NEET MDS?',
            answer: 'MCC conducts counselling for 50% All India Quota seats in participating dental colleges. State counselling authorities manage the remaining 50% state quota seats along with seats in state private colleges. Candidates can participate in both if eligible.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'NEET MDS Counselling 2026 — Dates, Process, Cutoffs & Allotment',
      metaDescription: 'Complete NEET MDS counselling 2026 guide by MCC/NBEMS. Get counselling dates, registration process, choice filling steps, seat allotment rounds, cutoff ranks, and document requirements for MDS admission.',
      keywords: [
        { keyword: 'NEET MDS counselling 2026' },
        { keyword: 'NEET MDS counselling date' },
        { keyword: 'NEET MDS 2026 cut off' },
        { keyword: 'MDS counselling 2026' },
        { keyword: 'MCC NEET MDS' },
        { keyword: 'NBEMS NEET MDS' },
      ],
    },
  },
  {
    title: 'RE-NEET 2026 — Exam Date, Admit Card, Result & Complete Guide',
    slug: 're-neet-2026-exam-date-admit-card',
    excerpt: 'Get complete information about RE-NEET 2026 including exam date, admit card download, city intimation slip, result, and counselling process. Everything you need to know about the NEET re-exam.',
    content: root(
      heading('h2', t('What is RE-NEET 2026?')),
      p(t('RE-NEET is the re-examination conducted by the National Testing Agency (NTA) for candidates who faced issues during the main NEET UG 2026 examination. These re-exams are typically held for candidates who experienced technical glitches, time loss, or other examination-day irregularities that affected their performance.')),
      p(t('The NTA has conducted re-exams in previous years for affected candidates, and a similar process is expected for NEET 2026. Candidates who qualify for the re-exam will have their scores based on the re-exam performance.')),
      heading('h2', t('RE-NEET 2026 Exam Date (Expected)')),
      p(t('While the official RE-NEET 2026 date will be announced by NTA on the official website neet.nta.nic.in, based on past patterns:')),
      bulletList(
        listItem(bold('NEET UG 2026 Main Exam: '), t('Expected in May 2026')),
        listItem(bold('RE-NEET 2026 Exam: '), t('Expected 3-4 weeks after the main exam, likely in June 2026')),
        listItem(bold('RE-NEET Result: '), t('Expected within 2 weeks of the re-exam')),
      ),
      heading('h2', t('RE-NEET 2026 Admit Card & City Intimation Slip')),
      p(t('The RE-NEET 2026 admit card will be released on the official NTA website. Candidates eligible for the re-exam must:')),
      bulletList(
        listItem(t('Check the NTA website (neet.nta.nic.in) for the city intimation slip, usually released 7-10 days before the exam.')),
        listItem(t('Download the RE-NEET admit card from the official portal using their application number and date of birth.')),
        listItem(t('Verify all details on the admit card, including name, photograph, signature, exam centre, and timings.')),
        listItem(t('Carry a printed copy of the admit card along with a valid photo ID to the exam centre.')),
      ),
      heading('h2', t('Who is Eligible for RE-NEET 2026?')),
      p(t('The following categories of candidates are typically eligible for the NEET re-exam:')),
      bulletList(
        listItem(t('Candidates who lost exam time due to technical glitches in their computer-based test.')),
        listItem(t('Candidates whose exam was disrupted due to natural calamities or unavoidable circumstances at the test centre.')),
        listItem(t('Candidates who were unable to attempt the exam due to issues with the OMR sheet or CBT system at the allotted centre.')),
        listItem(t('Any other category of candidates as specified by NTA in the official notice.')),
      ),
      heading('h2', t('RE-NEET 2026 Result and Scorecard')),
      p(t('The RE-NEET 2026 result will be published on neet.nta.nic.in. Candidates can download their scorecard using their roll number and other credentials. The score obtained in the re-exam will be considered as the final NEET score for counselling purposes for those who appeared for the re-exam.')),
      heading('h2', t('Important Tips for RE-NEET Candidates')),
      bulletList(
        listItem(t('Regularly check the official NTA website for updates — do not rely on unofficial sources.')),
        listItem(t('Keep your application number and password handy.')),
        listItem(t('Reach the exam centre at least one hour before the reporting time.')),
        listItem(t('Carry all required documents as mentioned on the admit card.')),
        listItem(t('Contact NTA helpline immediately if you face any issues on the exam day.')),
      ),
    ),
    blocks: [
      {
        blockType: 'faqBlock',
        title: 'Frequently Asked Questions about RE-NEET 2026',
        items: [
          {
            question: 'When is the RE-NEET 2026 exam date?',
            answer: 'The official RE-NEET 2026 date will be announced by NTA on neet.nta.nic.in. It is typically held 3-4 weeks after the main NEET UG exam. Candidates eligible for the re-exam will be notified via the official website.',
          },
          {
            question: 'How do I download the RE-NEET 2026 admit card?',
            answer: 'The RE-NEET admit card can be downloaded from neet.nta.nic.in using your application number and date of birth. The admit card is usually released 7-10 days before the re-exam date.',
          },
          {
            question: 'What is the RE-NEET city intimation slip?',
            answer: 'The city intimation slip is released before the admit card and informs candidates about the city where their exam centre is located. This helps candidates plan their travel in advance.',
          },
          {
            question: 'Will RE-NEET 2026 affect my original NEET score?',
            answer: 'For candidates who appear for the RE-NEET, the score obtained in the re-exam will be considered as the final score for merit list and counselling purposes. The original score becomes invalid for those candidates.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'RE-NEET 2026 — Exam Date, Admit Card, City Intimation & Result',
      metaDescription: 'Complete guide to RE-NEET 2026. Check re-exam date, admit card download process, city intimation slip, eligibility criteria, result date, and counselling process. Official NTA updates.',
      keywords: [
        { keyword: 'RE-NEET admit card 2026' },
        { keyword: 'RE-NEET exam date 2026' },
        { keyword: 'RE-NEET date' },
        { keyword: 'RE-NEET 2026 admit card' },
        { keyword: 'RE-NEET city intimation slip 2026' },
        { keyword: 'RE-NEET 2026 exam date' },
      ],
    },
  },
  {
    title: 'NEET 2026 Refund — Portal, Amount, Eligibility & Complete Process',
    slug: 'neet-2026-refund-portal-amount',
    excerpt: 'Complete guide to NEET 2026 refund process. Check refund eligibility, amount, NTA refund portal, how to apply for refund, and status tracking. Get detailed information about NEET application fee refund.',
    content: root(
      heading('h2', t('NEET 2026 Refund — Overview')),
      p(t('The National Testing Agency (NTA) provides a refund of the NEET UG application fee under specific circumstances. Understanding the refund policy, eligibility criteria, and the application process is essential for candidates who need to claim their fee back.')),
      p(t('The NEET refund process is handled through the official NTA refund portal. Candidates who have made duplicate payments, candidates of cancelled exams, and specific categories of applicants are eligible for refunds.')),
      heading('h2', t('NEET 2026 Refund Amount')),
      p(t('The NEET 2026 refund amount depends on the category of the candidate and the circumstances of the refund:')),
      bulletList(
        listItem(bold('General Category: '), t('The application fee for NEET UG is typically ₹1,600-1,700 for general category candidates. The refund amount varies based on the specific refund policy for that year.')),
        listItem(bold('OBC-NCL/EWS: '), t('₹1,500-1,600')),
        listItem(bold('SC/ST/PwD: '), t('₹900-1,000')),
        listItem(bold('Duplicate Payment: '), t('Full refund of the duplicate payment amount')),
        listItem(bold('Exam Cancellation: '), t('Full refund of the application fee if the exam is cancelled for the candidate\'s centre')),
      ),
      heading('h2', t('How to Apply for NEET 2026 Refund')),
      p(t('The process to apply for a NEET 2026 refund is as follows:')),
      bulletList(
        listItem(t('Visit the official NTA refund portal at nta.ac.in or neet.nta.nic.in.')),
        listItem(t('Navigate to the refund section using your NEET application credentials.')),
        listItem(t('Select the reason for the refund request (duplicate payment, exam cancellation, etc.).')),
        listItem(t('Upload the required documents, including payment proof and bank account details.')),
        listItem(t('Submit the application and note down the acknowledgment/reference number for future tracking.')),
      ),
      heading('h2', t('NEET Refund Portal — How to Check Status')),
      p(t('Once you have submitted your refund application, you can track its status through the official NTA portal:')),
      bulletList(
        listItem(t('Visit the NTA website and log in with your application credentials.')),
        listItem(t('Go to the "Refund Status" section.')),
        listItem(t('Enter your application number or refund acknowledgment number.')),
        listItem(t('View the current status of your refund request.')),
        listItem(t('Contact NTA helpline if the refund is delayed beyond the specified processing time.')),
      ),
      heading('h2', t('NEET 2026 Refund Eligibility Criteria')),
      p(t('Candidates are eligible for a NEET 2026 refund in the following cases:')),
      bulletList(
        listItem(t('Duplicate payment of the application fee.')),
        listItem(t('Cancellation of the exam at the allotted centre due to unavoidable circumstances.')),
        listItem(t('Excess payment made during the application process.')),
        listItem(t('Payment made for a transaction that ultimately failed but the amount was deducted.')),
        listItem(t('Other circumstances as specified by NTA in the official refund policy.')),
      ),
      heading('h2', t('Important Points to Remember')),
      bulletList(
        listItem(t('Refunds are processed only through the official NTA portal. Do not use third-party services.')),
        listItem(t('Ensure that the bank account details provided are accurate to avoid delays.')),
        listItem(t('The refund processing time may vary from 15 to 45 working days, depending on the case.')),
        listItem(t('Keep a screenshot or printout of your refund application acknowledgment for reference.')),
        listItem(t('Contact NTA helpline at 011-40759000 for refund-related queries.')),
      ),
    ),
    blocks: [
      {
        blockType: 'faqBlock',
        title: 'Frequently Asked Questions about NEET 2026 Refund',
        items: [
          {
            question: 'What is the NEET 2026 refund amount?',
            answer: 'The refund amount depends on your category and the reason for refund. General category candidates typically receive ₹1,600-1,700. SC/ST/PwD candidates receive ₹900-1,000. Duplicate payments are refunded in full.',
          },
          {
            question: 'How to check NEET refund status?',
            answer: 'You can check your NEET refund status on the official NTA website (nta.ac.in or neet.nta.nic.in) by logging in with your application credentials and visiting the refund status section.',
          },
          {
            question: 'What is the NTA NEET refund portal?',
            answer: 'The NTA NEET refund portal is the official online platform where candidates can apply for and track their refund applications. It is accessible through the NTA website at nta.ac.in.',
          },
          {
            question: 'How long does the NEET refund take to process?',
            answer: 'The NEET refund processing time is typically 15 to 45 working days from the date of application submission. Delays can occur if the bank details provided are incorrect or if additional verification is required.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'NEET 2026 Refund — Portal, Amount, Eligibility & Process',
      metaDescription: 'Complete guide to NEET 2026 refund process. Check NTA refund portal, refund amount for all categories, eligibility criteria, how to apply, and refund status tracking. Official NTA refund information.',
      keywords: [
        { keyword: 'NTA NEET refund' },
        { keyword: 'NEET refund amount 2026' },
        { keyword: 'NEET refund portal' },
        { keyword: 'NEET 2026 refund' },
        { keyword: 'NEET NTA nic in refund' },
      ],
    },
  },
]

const counsellingGuides = [
  {
    title: 'NEET PG 2026 Counselling — Exam Date, Registration & Complete Process',
    slug: 'neet-pg-2026-counselling',
    excerpt: 'Complete guide to NEET PG 2026 counselling including exam date, registration process, choice filling, seat allotment rounds, MCC counselling, state counselling, and cutoff ranks for MD/MS admission.',
    content: root(
      heading('h2', t('NEET PG 2026 Counselling — An Overview')),
      p(t('NEET PG counselling is the centralised admission process for postgraduate medical courses (MD/MS/Diploma) across India. The Medical Counselling Committee (MCC) conducts counselling for 50% All India Quota seats, while state authorities manage the remaining state quota seats.')),
      p(t('The NEET PG 2026 counselling process will be conducted online through the official MCC portal at mcc.nic.in. Candidates who qualify in the NEET PG 2026 examination are eligible to participate in the counselling process.')),
      heading('h2', t('NEET PG 2026 Important Dates')),
      p(t('While the official schedule will be published by NBE and MCC, the expected timeline for NEET PG 2026 is:')),
      bulletList(
        listItem(bold('NEET PG 2026 Exam: '), t('Expected in January 2026')),
        listItem(bold('Result Declaration: '), t('Expected in March 2026')),
        listItem(bold('MCC Round 1 Registration: '), t('Expected in April-May 2026')),
        listItem(bold('Round 1 Seat Allotment: '), t('Expected in May 2026')),
        listItem(bold('Round 2 Registration: '), t('Expected in June 2026')),
        listItem(bold('Mop-Up Round: '), t('Expected in July 2026')),
        listItem(bold('Stray Vacancy Round: '), t('Expected in August 2026')),
      ),
      heading('h2', t('NEET PG 2026 Registration Process')),
      p(t('The NEET PG 2026 counselling registration involves the following steps:')),
      bulletList(
        listItem(bold('Registration: '), t('Visit mcc.nic.in and register with your NEET PG roll number and other details.')),
        listItem(bold('Payment of Registration Fee: '), t('Pay the non-refundable registration fee based on your category.')),
        listItem(bold('Choice Filling & Locking: '), t('Select your preferred colleges and courses in order of priority. Lock your choices before the deadline.')),
        listItem(bold('Seat Allotment: '), t('Seats are allotted based on your NEET PG rank, category, choices, and seat availability.')),
        listItem(bold('Document Verification: '), t('Upload required documents for verification.')),
        listItem(bold('Reporting: '), t('Report to the allotted college for admission confirmation.')),
      ),
      heading('h2', t('NEET PG 2026 Eligibility Criteria')),
      bulletList(
        listItem(t('Candidates must have an MBBS degree from a recognised medical college.')),
        listItem(t('Must have completed or be completing the compulsory rotatory internship by the specified date.')),
        listItem(t('Must have permanent or provisional registration with NMC/MCI/State Medical Council.')),
        listItem(t('Must have qualified NEET PG 2026 with the minimum required percentile for their category.')),
      ),
      heading('h2', t('NEET PG 2026 Cutoff Ranks')),
      p(t('NEET PG cutoff ranks vary by speciality, college, and category. Competitive specialities like Radiology, Dermatology, General Surgery, and Orthopaedics typically have higher cutoffs. Government medical colleges have more competitive cutoffs compared to private colleges.')),
    ),
    blocks: [
      {
        blockType: 'faqBlock',
        title: 'Frequently Asked Questions about NEET PG 2026 Counselling',
        items: [
          {
            question: 'When is the NEET PG 2026 exam date?',
            answer: 'The NEET PG 2026 exam is expected to be conducted in January 2026. The official date will be announced by the National Board of Examinations (NBE) on the official website at natboard.edu.in.',
          },
          {
            question: 'When will NEET PG 2026 counselling registration start?',
            answer: 'NEET PG 2026 counselling registration is expected to begin in April-May 2026, after the declaration of results. The exact dates will be announced by MCC on mcc.nic.in.',
          },
          {
            question: 'What is the difference between MCC and state counselling for NEET PG?',
            answer: 'MCC conducts counselling for 50% All India Quota seats. State counselling authorities manage the remaining 50% state quota seats and seats in state private colleges. Candidates can participate in both if they meet the eligibility criteria.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'NEET PG 2026 Counselling — Dates, Registration, Process & Cutoffs',
      metaDescription: 'Complete guide to NEET PG 2026 counselling. Check exam dates, MCC counselling registration, choice filling process, seat allotment rounds, eligibility criteria, and cutoff ranks for MD/MS admission.',
      keywords: [
        { keyword: 'NEET PG 2026 exam date' },
        { keyword: 'NEET PG 2026 registration date' },
        { keyword: 'NEET PG counselling' },
        { keyword: 'NEET PG 2026 counselling' },
      ],
    },
  },
  {
    title: 'KCET Counselling 2026 — Dates, Choice Filling, Seat Allotment & Cutoffs',
    slug: 'kcet-counselling-2026',
    excerpt: 'Complete KCET counselling 2026 guide. Check KCET 2026 counselling dates, online registration process, option entry, seat allotment rounds, document verification, and cutoff ranks for engineering and pharmacy admission in Karnataka.',
    content: root(
      heading('h2', t('What is KCET Counselling?')),
      p(t('KCET (Karnataka Common Entrance Test) counselling is the centralised admission process conducted by the Karnataka Examination Authority (KEA) for admission to engineering, pharmacy, and other professional courses in colleges across Karnataka. The counselling process is conducted online through the official KEA website.')),
      p(t('KCET 2026 counselling will be conducted for candidates who have qualified in the KCET 2026 examination. The process includes registration, option entry, seat allotment in multiple rounds, and reporting to the allotted college.')),
      heading('h2', t('KCET Counselling 2026 Important Dates')),
      p(t('The expected schedule for KCET 2026 counselling is as follows:')),
      bulletList(
        listItem(bold('KCET 2026 Exam: '), t('Expected in April-May 2026')),
        listItem(bold('Result Declaration: '), t('Expected in June 2026')),
        listItem(bold('Counselling Registration: '), t('Expected in June-July 2026')),
        listItem(bold('Option Entry (Choice Filling): '), t('Expected in July 2026')),
        listItem(bold('Round 1 Seat Allotment: '), t('Expected in July 2026')),
        listItem(bold('Round 2 Seat Allotment: '), t('Expected in August 2026')),
        listItem(bold('Extended/Round 3: '), t('Expected in August-September 2026')),
      ),
      heading('h2', t('KCET Counselling 2026 Registration Process')),
      p(t('Eligible candidates must follow these steps for KCET counselling registration:')),
      bulletList(
        listItem(t('Visit the official KEA website at kea.kar.nic.in.')),
        listItem(t('Click on the KCET counselling registration link and enter your KCET roll number and other credentials.')),
        listItem(t('Verify your personal and academic details. Make corrections if needed during the correction window.')),
        listItem(t('Pay the counselling registration fee online through net banking, credit card, or debit card.')),
        listItem(t('Submit the registration form and note down the application number.')),
      ),
      heading('h2', t('KCET Choice Filling and Option Entry')),
      p(t('After registration, candidates must fill in their choices of colleges and courses through the option entry portal:')),
      bulletList(
        listItem(t('Log in to the KEA option entry portal using your credentials.')),
        listItem(t('Browse the list of available colleges and courses.')),
        listItem(t('Select and prioritise your choices in order of preference.')),
        listItem(t('Save your choices frequently to avoid data loss.')),
        listItem(t('Lock your final choices before the specified deadline. Once locked, choices cannot be modified.')),
      ),
      heading('h2', t('KCET 2026 Seat Allotment Process')),
      p(t('Seat allotment in KCET counselling is based on the candidate\'s rank, category, filled choices, and seat availability. The allotment results are published on the KEA website. Candidates who are allotted a seat must:')),
      bulletList(
        listItem(t('Download the provisional allotment letter from the KEA website.')),
        listItem(t('Report to the allotted college for document verification and admission confirmation.')),
        listItem(t('Pay the admission fee as specified by KEA and the college.')),
        listItem(t('Candidates not satisfied with their allotment can participate in subsequent rounds.')),
      ),
    ),
    blocks: [
      {
        blockType: 'faqBlock',
        title: 'Frequently Asked Questions about KCET Counselling 2026',
        items: [
          {
            question: 'When will KCET counselling 2026 start?',
            answer: 'KCET 2026 counselling is expected to start in June-July 2026 after the declaration of KCET results. Exact dates will be announced by KEA on kea.kar.nic.in.',
          },
          {
            question: 'How many rounds are there in KCET counselling?',
            answer: 'KCET counselling typically has two to three rounds of seat allotment. Additional extended rounds and spot counselling may be conducted depending on vacant seats after the main rounds.',
          },
          {
            question: 'What is the KCET 2026 counselling date?',
            answer: 'The official KCET 2026 counselling schedule will be published on the KEA website after the exam results are declared. Registration typically begins 2-3 weeks after the result announcement.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'KCET Counselling 2026 — Registration, Dates, Choice Filling & Allotment',
      metaDescription: 'Complete KCET 2026 counselling guide by KEA. Check counselling dates, registration process, option entry, choice filling, seat allotment rounds, document verification, and cutoff ranks for Karnataka engineering and pharmacy admissions.',
      keywords: [
        { keyword: 'KCET counselling date 2026' },
        { keyword: 'KCET counselling 2026' },
        { keyword: 'KCET counselling' },
        { keyword: 'KCET 2026' },
      ],
    },
  },
  {
    title: 'TNEA Counselling 2026 — Registration, Dates, Merit List & Seat Allotment',
    slug: 'tnea-counselling-2026',
    excerpt: 'Complete TNEA counselling 2026 guide. Check TNEA registration dates, merit list, choice filling, seat allotment rounds, document verification, and cutoff ranks for engineering admission in Tamil Nadu colleges.',
    content: root(
      heading('h2', t('What is TNEA Counselling?')),
      p(t('TNEA (Tamil Nadu Engineering Admissions) is the counselling process conducted by the Directorate of Technical Education (DoTE), Tamil Nadu for admission to engineering and technology programmes in government, government-aided, and private engineering colleges across the state.')),
      p(t('TNEA counselling 2026 will be conducted entirely online. Candidates who have qualified in their Class 12 board examination with the required subjects and marks are eligible to apply for TNEA counselling. The process does not require any separate entrance exam score.')),
      heading('h2', t('TNEA Counselling 2026 Important Dates')),
      p(t('The expected schedule for TNEA 2026 counselling is:')),
      bulletList(
        listItem(bold('TNEA Notification Release: '), t('Expected in April 2026')),
        listItem(bold('Online Registration Starts: '), t('Expected in May 2026')),
        listItem(bold('Last Date for Registration: '), t('Expected in June 2026')),
        listItem(bold('Merit List Publication: '), t('Expected in June 2026')),
        listItem(bold('Choice Filling: '), t('Expected in June-July 2026')),
        listItem(bold('Round 1 Allotment: '), t('Expected in July 2026')),
        listItem(bold('Round 2 Allotment: '), t('Expected in August 2026')),
        listItem(bold('Supplementary Counselling: '), t('Expected in August-September 2026')),
      ),
      heading('h2', t('TNEA Counselling 2026 Registration Process')),
      p(t('The TNEA counselling registration process involves the following steps:')),
      bulletList(
        listItem(t('Visit the official TNEA website at tneaonline.org.')),
        listItem(t('Click on "New Candidate Registration" and fill in your personal and academic details.')),
        listItem(t('Upload scanned copies of required documents including class 10 and class 12 mark sheets.')),
        listItem(t('Pay the registration fee online based on your category.')),
        listItem(t('Submit the application and note down the TNEA application number.')),
      ),
      heading('h2', t('TNEA 2026 Merit List and Rank Calculation')),
      p(t('The TNEA merit list is prepared based on the marks obtained in Mathematics, Physics, and Chemistry in the Class 12 board examination. The cutoff marks are calculated as:')),
      bulletList(
        listItem(bold('Cutoff = (Mathematics Marks) + (Physics Marks / 2) + (Chemistry Marks / 2)'), t('')),
        listItem(t('The maximum cutoff mark is 200.')),
        listItem(t('In case of a tie, marks in Mathematics, then Physics, then Chemistry are considered.')),
        listItem(t('Candidates with higher cutoff marks get priority in seat allotment.')),
      ),
      heading('h2', t('TNEA Choice Filling and Seat Allotment')),
      p(t('After the merit list is published, candidates must participate in choice filling:')),
      bulletList(
        listItem(t('Log in to the TNEA counselling portal and fill your preferred colleges and courses in order.')),
        listItem(t('Seats are allotted based on your cutoff rank, category, choices, and seat availability.')),
        listItem(t('7.5% reservation is applicable for government school students.')),
        listItem(t('Candidates must confirm their allotment and report to the college within the given timeframe.')),
      ),
    ),
    blocks: [
      {
        blockType: 'faqBlock',
        title: 'Frequently Asked Questions about TNEA Counselling 2026',
        items: [
          {
            question: 'When is the TNEA counselling 2026 date?',
            answer: 'TNEA 2026 counselling registration is expected to begin in May 2026. The official schedule will be published on tneaonline.org by the Directorate of Technical Education, Tamil Nadu.',
          },
          {
            question: 'How to register for TNEA counselling 2026?',
            answer: 'TNEA counselling registration is done online through the official website at tneaonline.org. Candidates need to provide their personal details, academic marks, and upload scanned documents, followed by payment of the registration fee.',
          },
          {
            question: 'What is the TNEA counselling process?',
            answer: 'TNEA counselling involves online registration, document verification, merit list publication, choice filling, and seat allotment in multiple rounds. Candidates who are allotted seats must report to the college for admission confirmation.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'TNEA Counselling 2026 — Registration, Merit List, Choice Filling & Allotment',
      metaDescription: 'Complete TNEA 2026 counselling guide. Check registration dates, merit list cutoff calculation, choice filling process, seat allotment rounds, document requirements, and college reporting for Tamil Nadu engineering admissions.',
      keywords: [
        { keyword: 'TNEA counselling 2026 date' },
        { keyword: 'TNEA counselling 2026' },
        { keyword: 'TNEA counselling 2026 registration' },
        { keyword: 'TNEA' },
      ],
    },
  },
  {
    title: 'TG EAPCET / TS EAMCET Counselling 2026 — Full Guide',
    slug: 'tg-eapcet-counselling-2026',
    excerpt: 'Complete TG EAPCET (TS EAMCET) counselling 2026 guide. Check counselling dates, registration process, web options, seat allotment, document verification, and guidelines for engineering and pharmacy admission in Telangana.',
    content: root(
      heading('h2', t('TG EAPCET / TS EAMCET Counselling 2026 — Overview')),
      p(t('TG EAPCET (Telangana Engineering, Agriculture and Pharmacy Common Entrance Test), previously known as TS EAMCET, is the state-level entrance exam for admission to engineering, agriculture, and pharmacy programmes in colleges across Telangana. The counselling process is conducted by the Telangana State Council of Higher Education (TSCHE).')),
      p(t('The TG EAPCET 2026 counselling will be conducted online through the official website. Candidates who qualify in the TG EAPCET 2026 examination are eligible to participate in the counselling and seat allotment process.')),
      heading('h2', t('TG EAPCET Counselling 2026 Expected Dates')),
      p(t('The tentative schedule for TG EAPCET 2026 counselling is:')),
      bulletList(
        listItem(bold('TG EAPCET 2026 Exam: '), t('Expected in May 2026')),
        listItem(bold('Result Declaration: '), t('Expected in June 2026')),
        listItem(bold('Counselling Registration: '), t('Expected in June-July 2026')),
        listItem(bold('Web Options (Choice Filling): '), t('Expected in July 2026')),
        listItem(bold('Round 1 Seat Allotment: '), t('Expected in July 2026')),
        listItem(bold('Round 2 Seat Allotment: '), t('Expected in August 2026')),
        listItem(bold('Spot Counselling: '), t('Expected in September 2026')),
      ),
      heading('h2', t('TG EAPCET Counselling Registration Process')),
      p(t('Candidates must follow these steps for TG EAPCET counselling registration:')),
      bulletList(
        listItem(t('Visit the official TG EAPCET counselling website (eapcet.tsche.ac.in).')),
        listItem(t('Register using your TG EAPCET hall ticket number and other credentials.')),
        listItem(t('Verify your personal, academic, and category details.')),
        listItem(t('Pay the counselling registration fee online through the payment gateway.')),
        listItem(t('Complete the document verification process at a designated help centre or online.')),
      ),
      heading('h2', t('Web Options (Choice Filling)')),
      p(t('After registration and verification, candidates must enter their web options:')),
      bulletList(
        listItem(t('Log in to the web options portal using your credentials.')),
        listItem(t('Browse the list of available colleges and branches for your rank range.')),
        listItem(t('Select and arrange your choices in order of preference.')),
        listItem(t('Save and lock your web options before the deadline.')),
        listItem(t('Candidates can modify their options any number of times before the final lock.')),
      ),
      heading('h2', t('Seat Allotment and Reporting')),
      p(t('Seat allotment is based on the candidate\'s TG EAPCET rank, category, web options, and seat availability:')),
      bulletList(
        listItem(t('Allotment results are published on the official counselling website.')),
        listItem(t('Candidates must download the allotment order from the portal.')),
        listItem(t('Report to the allotted college for admission confirmation within the specified dates.')),
        listItem(t('Carry all original documents for verification at the college.')),
      ),
    ),
    blocks: [
      {
        blockType: 'faqBlock',
        title: 'Frequently Asked Questions about TG EAPCET / TS EAMCET Counselling 2026',
        items: [
          {
            question: 'When is the TG EAPCET counselling date 2026?',
            answer: 'TG EAPCET 2026 counselling is expected to begin in June-July 2026 after the declaration of results. The official schedule will be published on eapcet.tsche.ac.in.',
          },
          {
            question: 'What is the difference between TG EAPCET and TS EAMCET?',
            answer: 'TS EAMCET was renamed to TG EAPCET (Telangana EAPCET) in 2024. Both refer to the same entrance exam and counselling process for admissions in Telangana state. The exam and counselling are conducted by TSCHE.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'TG EAPCET / TS EAMCET Counselling 2026 — Dates, Process & Allotment',
      metaDescription: 'Complete TG EAPCET (TS EAMCET) 2026 counselling guide. Check counselling dates, online registration, web options entry, seat allotment rounds, document verification, and reporting process for Telangana engineering admissions.',
      keywords: [
        { keyword: 'TS EAMCET 2026 counselling date' },
        { keyword: 'TG EAPCET counselling date 2026' },
        { keyword: 'EAMCET counselling dates 2026' },
      ],
    },
  },
  {
    title: 'CSAB Counselling 2026 — Registration, Rounds, Seat Allotment & Schedule',
    slug: 'csab-counselling-2026',
    excerpt: 'Complete CSAB counselling 2026 guide. Check CSAB registration process, special rounds, seat allotment schedule, and participating NITs, IIITs, and CFTIs. Everything you need to know about CSAB counselling after JEE Main.',
    content: root(
      heading('h2', t('What is CSAB Counselling?')),
      p(t('CSAB (Central Seat Allocation Board) counselling is conducted for admission to the National Institutes of Technology (NITs), Indian Institutes of Information Technology (IIITs), and other Centrally Funded Technical Institutions (CFTIs) after the JEE Main examination. CSAB counselling is conducted in multiple special rounds after the main JoSAA counselling process.')),
      p(t('CSAB counselling 2026 will be conducted for vacant seats that remain after the JoSAA counselling rounds. This provides an additional opportunity for candidates to secure admission in premier technical institutions across India.')),
      heading('h2', t('CSAB Counselling 2026 Important Dates')),
      p(t('The expected schedule for CSAB 2026 counselling is:')),
      bulletList(
        listItem(bold('JoSAA Round 6 (Last Round): '), t('Expected in August 2026')),
        listItem(bold('CSAB Round 1 Registration: '), t('Expected in August 2026')),
        listItem(bold('CSAB Round 1 Allotment: '), t('Expected in August 2026')),
        listItem(bold('CSAB Round 2 Registration: '), t('Expected in August-September 2026')),
        listItem(bold('CSAB Round 2 Allotment: '), t('Expected in September 2026')),
        listItem(bold('Special Spot Round (if applicable): '), t('Expected in September 2026')),
      ),
      heading('h2', t('CSAB Counselling 2026 Registration Process')),
      p(t('The CSAB counselling registration process is as follows:')),
      bulletList(
        listItem(t('Visit the official CSAB website at csab.nic.in.')),
        listItem(t('Candidates who have already registered for JoSAA can use their existing credentials.')),
        listItem(t('Fresh registration is required for candidates who did not register for JoSAA.')),
        listItem(t('Pay the CSAB counselling registration fee.')),
        listItem(t('Fill in your choices of NITs, IIITs, and CFTIs and lock them before the deadline.')),
      ),
      heading('h2', t('Who is Eligible for CSAB Counselling 2026?')),
      bulletList(
        listItem(t('Candidates who have qualified JEE Main 2026.')),
        listItem(t('Candidates who did not get a seat in JoSAA counselling.')),
        listItem(t('Candidates who want to upgrade their previously allotted seat in JoSAA.')),
        listItem(t('Candidates who missed the JoSAA registration window.')),
        listItem(t('Candidates who meet the specific eligibility criteria for the chosen institution.')),
      ),
      heading('h2', t('CSAB vs JoSAA — Key Differences')),
      bulletList(
        listItem(bold('JoSAA: '), t('Main counselling for NITs, IIITs, and CFTIs conducted in multiple rounds (typically 6 rounds).')),
        listItem(bold('CSAB: '), t('Special counselling rounds conducted after JoSAA for remaining vacant seats. Usually 2-3 rounds.')),
        listItem(t('CSAB counselling fees are generally lower than JoSAA registration fees.')),
        listItem(t('CSAB provides an additional opportunity for candidates who did not secure a seat in JoSAA.')),
      ),
    ),
    blocks: [
      {
        blockType: 'faqBlock',
        title: 'Frequently Asked Questions about CSAB Counselling 2026',
        items: [
          {
            question: 'What is CSAB counselling?',
            answer: 'CSAB (Central Seat Allocation Board) counselling is the special counselling process conducted for filling vacant seats in NITs, IIITs, and CFTIs after the main JoSAA counselling rounds. It provides an additional opportunity for candidates to get admission in these prestigious institutions.',
          },
          {
            question: 'When does CSAB counselling 2026 start?',
            answer: 'CSAB 2026 counselling is expected to start in August 2026 after the conclusion of JoSAA rounds. The exact schedule will be published on the official CSAB website at csab.nic.in.',
          },
          {
            question: 'Who can apply for CSAB counselling?',
            answer: 'Candidates who have qualified JEE Main 2026 and did not secure a seat in JoSAA, or those who wish to upgrade their allotted seat, can apply for CSAB counselling. Candidates who missed JoSAA registration can also apply.',
          },
        ],
      },
    ],
    seo: {
      metaTitle: 'CSAB Counselling 2026 — Registration, Rounds, Schedule & Seat Allotment',
      metaDescription: 'Complete CSAB counselling 2026 guide. Check registration process, counselling rounds, seat allotment schedule, participating NITs, IIITs, and CFTIs, eligibility criteria, and difference from JoSAA counselling.',
      keywords: [
        { keyword: 'CSAB counselling 2026' },
        { keyword: 'CSAB 2026 counselling' },
        { keyword: 'CSAB counselling process' },
      ],
    },
  },
]

const helpdeskFAQs = [
  {
    question: 'What is NEET MDS counselling?',
    answer: root(
      p(t('NEET MDS counselling is the centralised admission process for Master of Dental Surgery (MDS) programmes in dental colleges across India. It is conducted by the Medical Counselling Committee (MCC) for 50% All India Quota seats. Candidates who qualify in the NEET MDS examination can participate in the counselling process through the official MCC portal at mcc.nic.in. The counselling includes registration, choice filling, seat allotment in multiple rounds, and reporting to the allotted college.')),
    ),
    category: 'counselling',
    order: 1,
  },
  {
    question: 'How to get NEET 2026 refund?',
    answer: root(
      p(t('To get a NEET 2026 refund, visit the official NTA refund portal at neet.nta.nic.in or nta.ac.in. Log in with your application credentials, navigate to the refund section, select the reason for refund (duplicate payment, exam cancellation, etc.), upload required documents including proof of payment, and submit the application. The refund processing time is typically 15 to 45 working days.')),
    ),
    category: 'exam',
    order: 1,
  },
  {
    question: 'When is RE-NEET 2026 exam date?',
    answer: root(
      p(t('The RE-NEET 2026 exam date will be announced by the National Testing Agency (NTA) on the official website neet.nta.nic.in. Based on previous year patterns, the re-exam is typically conducted 3-4 weeks after the main NEET UG exam, likely in June 2026. Candidates eligible for the re-exam will be notified through the official NTA website.')),
    ),
    category: 'exam',
    order: 1,
  },
  {
    question: 'What is the NEET 2026 refund amount?',
    answer: root(
      p(t('The NEET 2026 refund amount varies by category. General category candidates typically receive a refund of ₹1,600-1,700. OBC-NCL/EWS candidates receive approximately ₹1,500-1,600. SC/ST/PwD candidates receive approximately ₹900-1,000. In case of duplicate payment, the full duplicate amount is refunded. If the exam is cancelled at a centre, the full application fee is refunded to all affected candidates.')),
    ),
    category: 'exam',
    order: 1,
  },
  {
    question: 'How to check NEET refund status?',
    answer: root(
      p(t('To check your NEET refund status, visit the official NTA website at neet.nta.nic.in, log in with your NEET application number and password, navigate to the "Refund Status" section, and enter your refund acknowledgment or application number. The portal will display the current status of your refund request. If the refund is delayed beyond 45 working days, contact NTA helpline at 011-40759000.')),
    ),
    category: 'exam',
    order: 1,
  },
  {
    question: 'What is the NEET PG counselling process?',
    answer: root(
      p(t('NEET PG counselling is conducted by the Medical Counselling Committee (MCC) for 50% All India Quota seats and by state authorities for state quota seats. The process includes online registration, choice filling and locking, seat allotment in multiple rounds (typically 2 main rounds plus mop-up and stray vacancy), document verification, and reporting to the allotted college for MD/MS/Diploma programmes.')),
    ),
    category: 'counselling',
    order: 1,
  },
  {
    question: 'How do I register for KCET counselling 2026?',
    answer: root(
      p(t('To register for KCET counselling 2026, visit the official Karnataka Examination Authority (KEA) website at kea.kar.nic.in. Click on the KCET counselling registration link, enter your KCET roll number and other required credentials, verify your personal and academic details, pay the registration fee online, and submit the form. After registration, you can fill your options and participate in seat allotment rounds.')),
    ),
    category: 'counselling',
    order: 1,
  },
  {
    question: 'How do I register for TNEA counselling 2026?',
    answer: root(
      p(t('TNEA counselling registration is done online through the official website at tneaonline.org. Click on "New Candidate Registration", fill in your personal and academic details including class 10 and class 12 marks, upload scanned copies of required documents, pay the registration fee based on your category, and submit the application. After successful registration, candidates are assigned a rank based on their cutoff marks for seat allotment.')),
    ),
    category: 'counselling',
    order: 1,
  },
]

/* ─── Slugify helper ─── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/* ─── Main seed function ─── */

async function main() {
  const isDry = process.argv.includes('--dry')
  if (isDry) console.log('🧪 DRY RUN — no data will be written\n')

  const payload = await getPayloadClient()

  const results = { blogs: 0, counselling: 0, helpdesk: 0, skipped: 0, errors: 0 }

  /* ── Blog posts ── */

  for (const post of blogPosts) {
    try {
      const existing = await payload.find({
        collection: 'blogs',
        where: { slug: { equals: post.slug } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length > 0) {
        console.log(`⏭  Blog "${post.title}" already exists — skipping`)
        results.skipped++
        continue
      }

      if (isDry) {
        console.log(`📄 Would create blog: "${post.title}"`)
        results.blogs++
        continue
      }

      await payload.create({
        collection: 'blogs',
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          blocks: post.blocks as any,
          status: 'published',
          publishedAt: new Date().toISOString(),
          seo: post.seo as any,
        },
        depth: 0,
      })
      console.log(`✅ Created blog: "${post.title}"`)
      results.blogs++
    } catch (err) {
      console.error(`❌ Error creating blog "${post.title}":`, err)
      results.errors++
    }
  }

  /* ── Counselling guides ── */

  for (const guide of counsellingGuides) {
    try {
      const existing = await payload.find({
        collection: 'counselling',
        where: { slug: { equals: guide.slug } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length > 0) {
        console.log(`⏭  Counselling "${guide.title}" already exists — skipping`)
        results.skipped++
        continue
      }

      if (isDry) {
        console.log(`📄 Would create counselling guide: "${guide.title}"`)
        results.counselling++
        continue
      }

      await payload.create({
        collection: 'counselling',
        data: {
          title: guide.title,
          slug: guide.slug,
          excerpt: guide.excerpt,
          content: guide.content,
          blocks: guide.blocks as any,
          category: guide.slug.includes('kcet') || guide.slug.includes('tnea') || guide.slug.includes('eapcet') || guide.slug.includes('csab') ? 'state-counselling' : 'pg-counselling',
          status: 'published',
          publishedAt: new Date().toISOString(),
          seo: guide.seo as any,
        },
        depth: 0,
      })
      console.log(`✅ Created counselling guide: "${guide.title}"`)
      results.counselling++
    } catch (err) {
      console.error(`❌ Error creating counselling "${guide.title}":`, err)
      results.errors++
    }
  }

  /* ── Helpdesk FAQs ── */

  for (const faq of helpdeskFAQs) {
    try {
      const existing = await payload.find({
        collection: 'helpdesk',
        where: { question: { equals: faq.question } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length > 0) {
        console.log(`⏭  FAQ "${faq.question}" already exists — skipping`)
        results.skipped++
        continue
      }

      if (isDry) {
        console.log(`📄 Would create FAQ: "${faq.question}"`)
        results.helpdesk++
        continue
      }

      await payload.create({
        collection: 'helpdesk',
        data: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category as any,
          order: faq.order,
          status: 'active',
        },
        depth: 0,
      })
      console.log(`✅ Created FAQ: "${faq.question}"`)
      results.helpdesk++
    } catch (err) {
      console.error(`❌ Error creating FAQ "${faq.question}":`, err)
      results.errors++
    }
  }

  /* ── Summary ── */

  console.log(`\n${isDry ? '🧪 DRY RUN' : '📦'} Summary:`)
  console.log(`   Blogs:         ${results.blogs} created`)
  console.log(`   Counselling:   ${results.counselling} created`)
  console.log(`   Helpdesk FAQs: ${results.helpdesk} created`)
  console.log(`   Skipped:       ${results.skipped}`)
  if (results.errors > 0) console.log(`   Errors:        ${results.errors}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
