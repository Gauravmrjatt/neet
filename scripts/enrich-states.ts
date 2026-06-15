import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

interface LexicalTextNode {
  type: 'text'
  text: string
  version: number
  format?: number
  bold?: boolean
  italic?: boolean
}

interface LexicalParagraphNode {
  type: 'paragraph'
  format: string
  indent: number
  version: number
  direction: 'ltr'
  children: LexicalTextNode[]
}

interface LexicalHeadingNode {
  type: 'heading'
  tag: 'h2' | 'h3'
  format: string
  indent: number
  version: number
  direction: 'ltr'
  children: LexicalTextNode[]
}

interface LexicalListItemNode {
  type: 'listitem'
  version: number
  children: LexicalTextNode[]
}

interface LexicalListNode {
  type: 'list'
  listType: 'bullet' | 'number'
  format: string
  indent: number
  version: number
  direction: 'ltr'
  children: LexicalListItemNode[]
}

type LexicalBlockNode = LexicalParagraphNode | LexicalHeadingNode | LexicalListNode

interface LexicalRichText {
  root: {
    type: 'root'
    format: string
    indent: number
    version: number
    direction: 'ltr'
    children: LexicalBlockNode[]
  }
}

type Section =
  | { type: 'paragraph'; content: string }
  | { type: 'heading'; tag: 'h2' | 'h3'; content: string }
  | { type: 'bulletList'; items: string[] }
  | { type: 'numberedList'; items: string[] }

function textNode(text: string): LexicalTextNode {
  return { type: 'text', text, version: 1 }
}

function paragraphNode(content: string): LexicalParagraphNode {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [textNode(content)],
  }
}

function headingNode(tag: 'h2' | 'h3', content: string): LexicalHeadingNode {
  return {
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [textNode(content)],
  }
}

function bulletListNode(items: string[]): LexicalListNode {
  return {
    type: 'list',
    listType: 'bullet',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: items.map((item) => ({
      type: 'listitem',
      version: 1,
      children: [textNode(item)],
    })),
  }
}

function numberedListNode(items: string[]): LexicalListNode {
  return {
    type: 'list',
    listType: 'number',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: items.map((item) => ({
      type: 'listitem',
      version: 1,
      children: [textNode(item)],
    })),
  }
}

function buildRichText(sections: Section[]): LexicalRichText {
  const children: LexicalBlockNode[] = sections.map((s) => {
    switch (s.type) {
      case 'paragraph':
        return paragraphNode(s.content)
      case 'heading':
        return headingNode(s.tag, s.content)
      case 'bulletList':
        return bulletListNode(s.items)
      case 'numberedList':
        return numberedListNode(s.items)
    }
  })
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children,
    },
  }
}

const STANDARD_DOCUMENTS = [
  'NEET UG 2026 scorecard downloaded from the official NTA website',
  'NEET UG 2026 admit card',
  'Class 10th mark sheet and passing certificate',
  'Class 12th mark sheet and passing certificate',
  'State domicile certificate issued by competent authority',
  'Caste certificate (SC/ST/OBC-NCL) if applicable, issued by competent authority',
  'EWS certificate if applicable, in the prescribed format',
  'Income certificate for fee concession eligibility',
  'Aadhaar card or any government-issued photo ID',
  'Passport-size photographs (same as uploaded on NEET application)',
  'PH/PwD certificate if claiming disability quota',
  'School leaving certificate / Transfer certificate',
  'Character certificate from the institution last attended',
  'Gap year affidavit (if applicable)',
]

function stateDescription(
  state: string,
  authority: string,
  govtColleges: number,
  privateColleges: number,
  extra: string,
): Section[] {
  return [
    {
      type: 'paragraph',
      content: `${state} NEET counselling is conducted by ${authority}. The state offers medical education through ${govtColleges} government medical colleges and ${privateColleges} private medical colleges, providing a wide range of MBBS and BDS seats for eligible candidates. ${extra}`,
    },
    {
      type: 'paragraph',
      content: `Students who have qualified the NEET UG 2026 examination and meet the state domicile and eligibility criteria can participate in the ${state} state quota counselling process. The counselling involves online registration, choice filling, document verification, and multiple rounds of seat allotment. It is essential for candidates to carefully review the information bulletin and adhere to all deadlines to secure admission in their preferred medical college.`,
    },
  ]
}

function eligibilitySections(
  state: string,
  domicileYears: string,
  extraRules?: string,
): Section[] {
  const sections: Section[] = [
    {
      type: 'heading',
      tag: 'h2',
      content: 'Eligibility Criteria for NEET Counselling',
    },
    {
      type: 'paragraph',
      content: `Candidates seeking admission through ${state} NEET state quota counselling must fulfill the following eligibility requirements set by the counselling authority and the National Medical Commission (NMC).`,
    },
    {
      type: 'bulletList',
      items: [
        `Must have qualified NEET UG 2026 with the minimum required percentile: 50th percentile for General category, 40th percentile for SC/ST/OBC-NCL, and 45th percentile for General-PwD candidates.`,
        `Domicile requirement: Candidates must have a ${domicileYears} in ${state} or be born in the state. Children of central government employees posted in ${state} may also be eligible under certain conditions.`,
        `Age requirement: Candidate must have completed 17 years of age as of December 31, 2026. There is no upper age limit for NEET as per the latest NMC guidelines.`,
        `Educational qualification: Must have passed Class 12th or equivalent with Physics, Chemistry, Biology/Biotechnology, and English individually. General category candidates need 50% aggregate in PCB, while reserved category candidates need 40%.`,
        ...(extraRules ? [extraRules] : []),
      ],
    },
  ]
  return sections
}

function documentSections(): Section[] {
  return [
    {
      type: 'heading',
      tag: 'h2',
      content: 'Documents Required for Counselling Registration',
    },
    {
      type: 'paragraph',
      content: 'Candidates must keep the following documents ready in original and scanned format for online registration and physical verification during the NEET counselling process. All documents must be self-attested where required.',
    },
    {
      type: 'bulletList',
      items: STANDARD_DOCUMENTS,
    },
    {
      type: 'paragraph',
      content: 'Note: Additional documents may be requested by the counselling authority. Candidates are advised to carry multiple sets of photocopies to the document verification centre and keep digital copies ready for online upload.',
    },
  ]
}

function reservationSections(
  state: string,
  scPct: number,
  stPct: number,
  obcPct: number,
  ewsPct: number,
  extra: string,
): Section[] {
  return [
    {
      type: 'heading',
      tag: 'h2',
      content: `Reservation Policy in ${state} NEET Counselling`,
    },
    {
      type: 'paragraph',
      content: `The ${state} government follows a structured reservation policy for NEET UG counselling to ensure equitable access to medical education for all sections of society. The reservation percentages are applied to state quota seats in government medical colleges.`,
    },
    {
      type: 'heading',
      tag: 'h3',
      content: 'Category-wise Reservation Breakdown',
    },
    {
      type: 'bulletList',
      items: [
        `Scheduled Caste (SC): ${scPct}% of state quota seats`,
        `Scheduled Tribe (ST): ${stPct}% of state quota seats`,
        `Other Backward Classes (OBC): ${obcPct}% of state quota seats`,
        `Economically Weaker Sections (EWS): ${ewsPct}% of state quota seats`,
        'Horizontal reservation for Persons with Disability (PwD): 5% across all categories',
        ...(extra ? [extra] : []),
      ],
    },
    {
      type: 'paragraph',
      content: 'Additionally, there may be reservation for wards of defence personnel, ex-servicemen, and sports quota candidates as per state government norms. Candidates claiming reservation benefits must submit valid certificates issued by competent authorities.',
    },
  ]
}

function feeSections(
  state: string,
  govtFeeRange: string,
  privateFeeRange: string,
  deemedFeeRange: string,
  extra?: string,
): Section[] {
  return [
    {
      type: 'heading',
      tag: 'h2',
      content: `Fee Structure for MBBS in ${state}`,
    },
    {
      type: 'paragraph',
      content: `The tuition fees for MBBS programs in ${state} vary significantly depending on the type of institution — government colleges, private colleges, and deemed universities. The following are the approximate annual fee ranges for the 2026-27 academic session.`,
    },
    {
      type: 'bulletList',
      items: [
        `Government Medical Colleges: ${govtFeeRange} per year. These are highly subsidised and affordable for state domicile students.`,
        `Private Medical Colleges: ${privateFeeRange} per year. Fees vary based on the institution's location, infrastructure, and reputation.`,
        `Deemed Universities / Central Universities: ${deemedFeeRange} per year. These institutions have higher fee structures.`,
        ...(extra ? [extra] : []),
      ],
    },
    {
      type: 'paragraph',
      content: 'Note: The above fees are indicative and subject to change. Candidates should verify the exact fee structure from the respective college\'s official website or the counselling authority\'s information bulletin. Hostel and mess charges are additional.',
    },
  ]
}

interface StateData {
  name: string
  code: string
  authority: string
  description: string
  govtColleges: number
  privateColleges: number
  domicileYears: string
  extraDescription: string
  extraEligibility?: string
  scPct: number
  stPct: number
  obcPct: number
  ewsPct: number
  reservationExtra: string
  govtFeeRange: string
  privateFeeRange: string
  deemedFeeRange: string
  feeExtra?: string
  datesExtra?: string
}

const STATES_DATA: StateData[] = [
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    authority: 'Dr. NTR University of Health Sciences (NTRUHS)',
    description: 'Andhra Pradesh NEET counselling is conducted by Dr. NTR University of Health Sciences (NTRUHS), Vijayawada.',
    govtColleges: 20,
    privateColleges: 20,
    domicileYears: '10 years of domicile in Andhra Pradesh',
    extraDescription: 'The state has a well-structured counselling process with multiple rounds and a transparent merit-based seat allotment system. Andhra Pradesh follows the Andhra Pradesh Medical Colleges (Regulation of Admissions) Act and offers significant reservation for local candidates under the Andhra Pradesh Educational Institutions (Regulation of Admissions) Order. Candidates from Andhra Pradesh can also apply for tuition fee reimbursement through the Jnana Vidya Dhana (JVD) scheme if they belong to economically weaker sections.',
    extraEligibility: 'Telangana candidates are not eligible for Andhra Pradesh state quota seats. Candidates must satisfy the local status requirements as per AP act.',
    scPct: 15,
    stPct: 6,
    obcPct: 29,
    ewsPct: 10,
    reservationExtra: 'NTRUHS also implements local area reservation (multi-zone system) within Andhra Pradesh — seats are distributed among three regions (Coastal Andhra, Rayalaseema, and others) with preference to local candidates.',
    govtFeeRange: '₹7,000 — ₹45,000',
    privateFeeRange: '₹6,00,000 — ₹18,00,000',
    deemedFeeRange: '₹12,00,000 — ₹25,00,000',
    feeExtra: 'The JVD (Jnana Vidya Dhana) fee reimbursement scheme covers full tuition fees for eligible SC/ST/BC and EWS students studying in government and private colleges.',
  },
  {
    name: 'Arunachal Pradesh',
    code: 'AR',
    authority: 'Directorate of Medical Education, Arunachal Pradesh',
    description: 'Arunachal Pradesh NEET counselling is conducted by the Directorate of Medical Education (DME), Arunachal Pradesh.',
    govtColleges: 1,
    privateColleges: 0,
    domicileYears: 'permanent residence certificate of Arunachal Pradesh',
    extraDescription: 'The state has limited medical seats, primarily at Tomo Riba Institute of Health and Medical Sciences (TRIHMS), Naharlagun. Arunachal Pradesh offers special reservation for indigenous tribes of the state. Most candidates also participate in AIQ counselling and neighbouring state counselling for additional opportunities. The state provides 100% fee exemption for ST students in government colleges.',
    scPct: 0,
    stPct: 80,
    obcPct: 0,
    ewsPct: 10,
    reservationExtra: 'Being a tribal-majority state, Arunachal Pradesh has 80% reservation for Scheduled Tribes (ST), with priority given to indigenous communities of the state. The remaining 20% seats are for general category and other eligible candidates.',
    govtFeeRange: '₹10,000 — ₹25,000',
    privateFeeRange: 'N/A — no private medical colleges in the state',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Assam',
    code: 'AS',
    authority: 'Directorate of Medical Education (DME), Assam',
    description: 'Assam NEET counselling is conducted by the Directorate of Medical Education (DME), Assam.',
    govtColleges: 6,
    privateColleges: 4,
    domicileYears: 'permanent residency of Assam (at least 10 years)',
    extraDescription: 'The state has a mix of well-established government medical colleges like Gauhati Medical College and Assam Medical College, alongside emerging private institutions. Assam offers reservation for indigenous communities, tea garden workers, and other backward classes. The counselling process is managed through the DME Assam online portal with a multi-round allotment process.',
    extraEligibility: 'Candidates from other states are not eligible for Assam state quota seats. The child of central government employees posted in Assam may apply if they have studied in Assam for at least 5 years.',
    scPct: 7,
    stPct: 15,
    obcPct: 27,
    ewsPct: 10,
    reservationExtra: 'Assam has additional reservations for Tea Garden communities (Mohan/Ex-Tea Garden) at 5%, and Moran/Motok communities at 2%. There is also reservation for indigenous Assamese communities under various categories.',
    govtFeeRange: '₹15,000 — ₹50,000',
    privateFeeRange: '₹5,00,000 — ₹15,00,000',
    deemedFeeRange: '₹10,00,000 — ₹20,00,000',
  },
  {
    name: 'Bihar',
    code: 'BR',
    authority: 'BCECEB (Bihar Combined Entrance Competitive Examination Board)',
    description: 'Bihar NEET counselling is conducted by the Bihar Combined Entrance Competitive Examination Board (BCECEB).',
    govtColleges: 10,
    privateColleges: 8,
    domicileYears: 'domicile of Bihar (at least 10 years)',
    extraDescription: 'Bihar has a strong network of government medical colleges including Patna Medical College, IGIMS, and Sri Krishna Medical College. The state offers a significant number of MBBS seats through its counselling process. BCECEB manages the entire process from registration to seat allotment through its online portal. Bihar also provides the Mukhyamantri Chunavi Chikitsa Yojana for financially weaker students.',
    extraEligibility: 'Bihar domicile is mandatory. Candidates who have studied in Bihar for classes 11 and 12 are also eligible even if the parent is from another state on transferable job.',
    scPct: 16,
    stPct: 1,
    obcPct: 18,
    ewsPct: 10,
    reservationExtra: 'Bihar has additional reservations: EBC (Extremely Backward Classes) at 18%, BC (Backward Classes) at 12%, and women\'s reservation at 33% horizontal within each category. AXIS (general) category seats have been reduced significantly.',
    govtFeeRange: '₹12,000 — ₹60,000',
    privateFeeRange: '₹7,00,000 — ₹20,00,000',
    deemedFeeRange: '₹12,00,000 — ₹25,00,000',
  },
  {
    name: 'Chhattisgarh',
    code: 'CG',
    authority: 'Directorate of Medical Education (DME), Chhattisgarh',
    description: 'Chhattisgarh NEET counselling is conducted by the Directorate of Medical Education (DME), Chhattisgarh.',
    govtColleges: 7,
    privateColleges: 6,
    domicileYears: 'permanent residence of Chhattisgarh',
    extraDescription: 'Chhattisgarh has been expanding its medical education infrastructure with new government medical colleges in districts like Korba, Kanker, and Surajpur. The state offers reservation for tribal communities which form a significant portion of the population. DME Chhattisgarh conducts a transparent online counselling process with multiple rounds.',
    extraEligibility: 'Children of CG government employees and those born in CG or residing for 10+ years are eligible for state quota.',
    scPct: 13,
    stPct: 32,
    obcPct: 14,
    ewsPct: 10,
    reservationExtra: 'Chhattisgarh has one of the highest ST reservations in India at 32%, reflecting its large tribal population. Additional reservations exist for Other Backward Classes at 14%.',
    govtFeeRange: '₹10,000 — ₹40,000',
    privateFeeRange: '₹5,00,000 — ₹14,00,000',
    deemedFeeRange: '₹10,00,000 — ₹20,00,000',
  },
  {
    name: 'Goa',
    code: 'GA',
    authority: 'Directorate of Technical Education (DTE), Goa',
    description: 'Goa NEET counselling is conducted by the Directorate of Technical Education (DTE), Goa.',
    govtColleges: 1,
    privateColleges: 1,
    domicileYears: 'Goa domicile (at least 5 years)',
    extraDescription: 'Goa has a limited number of medical seats, primarily at Goa Medical College (government) and a few private institutions. The state follows a merit-based counselling process managed by DTE Goa. Due to the limited seats, competition is intense and candidates are advised to also register for AIQ counselling and other state counselling options.',
    scPct: 2,
    stPct: 12,
    obcPct: 27,
    ewsPct: 10,
    reservationExtra: 'Goa has OBC reservation at 27%, ST at 12%, and SC at 2%. There is also a special reservation for wards of freedom fighters and defence personnel.',
    govtFeeRange: '₹20,000 — ₹50,000',
    privateFeeRange: '₹8,00,000 — ₹16,00,000',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    authority: 'ACPUG (Admission Committee for Professional Undergraduate Courses), Gujarat',
    description: 'Gujarat NEET counselling is conducted by the Admission Committee for Professional Undergraduate Courses (ACPUG), Gujarat.',
    govtColleges: 15,
    privateColleges: 16,
    domicileYears: 'Gujarat domicile (at least 5 years)',
    extraDescription: 'Gujarat has a robust medical education system with top institutions like B.J. Medical College, Ahmedabad and SVP Hospital, Surat. The state offers MBBS and BDS seats through a centralised online counselling process managed by ACPUG. Gujarat has a well-defined SEBC (Socially and Educationally Backward Classes) reservation policy and provides various fee waiver schemes.',
    extraEligibility: 'Gujarat domicile required. Candidates who have studied in Gujarat for at least 5 years are eligible even without domicile certificate.',
    scPct: 7,
    stPct: 14,
    obcPct: 27,
    ewsPct: 10,
    reservationExtra: 'Gujarat has SEBC (Socially and Educationally Backward Classes) reservation at 27% (SEBC includes OBC and other backward communities). There is also reservation for Scheduled Tribes at 14% and Scheduled Castes at 7%.',
    govtFeeRange: '₹10,000 — ₹45,000',
    privateFeeRange: '₹5,00,000 — ₹20,00,000',
    deemedFeeRange: '₹12,00,000 — ₹25,00,000',
    feeExtra: 'Gujarat government provides fee reimbursement for SEBC, SC, and ST students through the Vidya Lakshmi scheme.',
  },
  {
    name: 'Haryana',
    code: 'HR',
    authority: 'DMER Haryana (Directorate of Medical Education and Research)',
    description: 'Haryana NEET counselling is conducted by the Directorate of Medical Education and Research (DMER), Haryana, through the UHSMR portal.',
    govtColleges: 8,
    privateColleges: 7,
    domicileYears: 'Haryana domicile (at least 10 years)',
    extraDescription: 'Haryana has quality government medical colleges including PGIMS Rohtak, BPS GMC Khanpur Kalan, and Shaheed Hasan Khan Mewati GMC. The state counselling process is managed online through the UHSMR portal. Haryana has a competitive counselling process with reservations for various categories including Backward Classes and special reservation for wards of ex-servicemen and para-military personnel.',
    extraEligibility: 'Haryana domicile required (residing in Haryana for 10+ years). Children of Haryana government employees serving outside the state are also eligible.',
    scPct: 20,
    stPct: 0,
    obcPct: 16,
    ewsPct: 10,
    reservationExtra: 'Haryana has no ST reservation. SC reservation is 20%, BC(A) at 11%, BC(B) at 5%, and EWS at 10%. There is additional reservation for wards of ex-servicemen and para-military forces at 5%.',
    govtFeeRange: '₹12,000 — ₹55,000',
    privateFeeRange: '₹6,00,000 — ₹18,00,000',
    deemedFeeRange: '₹12,00,000 — ₹22,00,000',
  },
  {
    name: 'Himachal Pradesh',
    code: 'HP',
    authority: 'Himachal Pradesh University / Directorate of Medical Education (DME), HP',
    description: 'Himachal Pradesh NEET counselling is conducted by the Himachal Pradesh University (HPU) Shimla and the Directorate of Medical Education, HP.',
    govtColleges: 5,
    privateColleges: 3,
    domicileYears: 'Himachal Pradesh domicile (at least 10 years)',
    extraDescription: 'Himachal Pradesh has government medical colleges like IGMC Shimla, Dr. RPGMC Tanda, and newly established colleges in Mandi and Hamirpur. The state offers a streamlined online counselling process. Being a hilly state with limited seats, competition is high. The state provides various reservation benefits for rural and remote area candidates.',
    extraEligibility: 'HP domicile mandatory. Children of central government employees serving in HP are eligible if they have studied in HP for at least 5 years.',
    scPct: 25,
    stPct: 4,
    obcPct: 12,
    ewsPct: 10,
    reservationExtra: 'Himachal Pradesh has SC reservation at 25%, ST at 4%, OBC at 12%, and EWS at 10%. There is additional reservation for candidates from rural areas and backward areas within the state.',
    govtFeeRange: '₹15,000 — ₹50,000',
    privateFeeRange: '₹5,00,000 — ₹14,00,000',
    deemedFeeRange: '₹10,00,000 — ₹18,00,000',
  },
  {
    name: 'Jharkhand',
    code: 'JH',
    authority: 'JCECEB (Jharkhand Combined Entrance Competitive Examination Board)',
    description: 'Jharkhand NEET counselling is conducted by the Jharkhand Combined Entrance Competitive Examination Board (JCECEB).',
    govtColleges: 4,
    privateColleges: 3,
    domicileYears: 'Jharkhand domicile (at least 10 years)',
    extraDescription: 'Jharkhand has government medical colleges including RIMS Ranchi, MGM Medical College Jamshedpur, and new colleges in Dumka and Hazaribagh. The state has significant tribal population and offers generous reservation for ST candidates. JCECEB manages the entire counselling process through its official online portal.',
    extraEligibility: 'Jharkhand domicile required. Candidates must have studied in Jharkhand for at least 5 years or have a permanent residence certificate.',
    scPct: 10,
    stPct: 26,
    obcPct: 14,
    ewsPct: 10,
    reservationExtra: 'Jharkhand has 26% ST reservation reflecting its large tribal population, 10% SC, 14% OBC, and 10% EWS. There is additional reservation for extremely backward classes within the OBC category.',
    govtFeeRange: '₹10,000 — ₹40,000',
    privateFeeRange: '₹5,00,000 — ₹15,00,000',
    deemedFeeRange: '₹10,00,000 — ₹20,00,000',
  },
  {
    name: 'Karnataka',
    code: 'KA',
    authority: 'KEA (Karnataka Examination Authority)',
    description: 'Karnataka NEET counselling is conducted by the Karnataka Examination Authority (KEA).',
    govtColleges: 20,
    privateColleges: 30,
    domicileYears: 'Karnataka domicile (at least 10 years)',
    extraDescription: 'Karnataka has one of the largest medical education systems in India with prestigious government colleges like Bangalore Medical College, Mysore Medical College, and KMC Manipal among its private institutions. The state conducts counselling for government quota, private quota, and management quota seats. KEA handles the entire process with multiple rounds and a well-established online system.',
    extraEligibility: 'Karnataka domicile is required for government quota seats. For private quota, candidates from anywhere in India may be eligible but preference is given to Karnataka candidates.',
    scPct: 15,
    stPct: 3,
    obcPct: 32,
    ewsPct: 10,
    reservationExtra: 'Karnataka has a high OBC reservation at 32% (Category 2A, 2B, 3A, 3B). SC at 15%, ST at 3%, Category I at 4%, and EWS at 10%. The state follows a complex caste-based reservation matrix with multiple OBC sub-categories.',
    govtFeeRange: '₹15,000 — ₹85,000',
    privateFeeRange: '₹6,00,000 — ₹24,00,000',
    deemedFeeRange: '₹10,00,000 — ₹30,00,000',
    feeExtra: 'Karnataka private colleges have variable fees based on the Karnataka Private Medical Colleges Association (KPMCA) agreement. Fee waiver schemes exist for SC/ST candidates through the government social welfare department.',
  },
  {
    name: 'Kerala',
    code: 'KL',
    authority: 'CEE Kerala (Commissioner of Entrance Examinations, Kerala)',
    description: 'Kerala NEET counselling is conducted by the Commissioner of Entrance Examinations (CEE), Kerala.',
    govtColleges: 12,
    privateColleges: 20,
    domicileYears: 'Kerala domicile (at least 5 years)',
    extraDescription: 'Kerala is known for its high-quality medical education and healthcare system. The state has top government colleges like Government Medical College Thiruvananthapuram and Kozhikode, along with numerous self-financing private colleges. CEE Kerala conducts a transparent online counselling process with multiple rounds of seat allotment.',
    extraEligibility: 'Kerala domicile required for government quota. Candidates who have studied in Kerala for 5+ years are eligible. NRI quota seats in private colleges have separate eligibility.',
    scPct: 15,
    stPct: 5,
    obcPct: 40,
    ewsPct: 10,
    reservationExtra: 'Kerala has one of the highest OBC reservations in India at 40% (including Ezhava, Muslim, and Other Backward Hindus). SC at 15%, ST at 5%, and EWS at 10%. There is also a 3% reservation for OEC (Other Eligible Communities).',
    govtFeeRange: '₹12,000 — ₹40,000',
    privateFeeRange: '₹5,00,000 — ₹18,00,000',
    deemedFeeRange: '₹10,00,000 — ₹22,00,000',
    feeExtra: 'The Kerala government provides free education to SC/ST students in government colleges. The state also offers the Suvarna Jubilee Merit Scholarship for top rankers.',
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    authority: 'Directorate of Medical Education (DME), Madhya Pradesh',
    description: 'Madhya Pradesh NEET counselling is conducted by the Directorate of Medical Education (DME), Madhya Pradesh.',
    govtColleges: 12,
    privateColleges: 10,
    domicileYears: 'Madhya Pradesh domicile (at least 10 years)',
    extraDescription: 'Madhya Pradesh has a growing network of government medical colleges with new institutions being established across the state. Notable colleges include Gandhi Medical College Bhopal, MGM Medical College Indore, and NSCB Medical College Jabalpur. DME MP manages the counselling process with a focus on transparency and efficiency.',
    extraEligibility: 'MP domicile mandatory. Candidates who have studied in MP for classes 11 and 12 are eligible. Wards of MP government employees serving outside the state are also eligible.',
    scPct: 16,
    stPct: 20,
    obcPct: 14,
    ewsPct: 10,
    reservationExtra: 'Madhya Pradesh has ST reservation at 20% (one of the highest for a non-NE state), SC at 16%, OBC at 14%, and EWS at 10%. There is special reservation for candidates from tribal and backward districts.',
    govtFeeRange: '₹10,000 — ₹50,000',
    privateFeeRange: '₹5,00,000 — ₹16,00,000',
    deemedFeeRange: '₹10,00,000 — ₹20,00,000',
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    authority: 'DMER Maharashtra (Directorate of Medical Education and Research)',
    description: 'Maharashtra NEET counselling is conducted by the Directorate of Medical Education and Research (DMER), Maharashtra, through the CET Cell.',
    govtColleges: 25,
    privateColleges: 35,
    domicileYears: 'Maharashtra domicile (at least 5 years)',
    extraDescription: 'Maharashtra has the largest medical education infrastructure in India with premier institutions like Grant Medical College, Seth GS Medical College, and BJ Medical College Pune. The state has a well-organised centralised admission process through CET Cell with multiple rounds of counselling. Maharashtra has been at the centre of the Maratha reservation debate, which may impact seat distribution.',
    extraEligibility: 'Maharashtra domicile required. Candidates who have completed 10th and 12th from Maharashtra are eligible under the state quota regardless of domicile.',
    scPct: 13,
    stPct: 7,
    obcPct: 19,
    ewsPct: 10,
    reservationExtra: 'Maharashtra has OBC at 19%, SC at 13%, ST at 7%, VJ/DT (Vimukta Jati/Denotified Tribes) at 3%, NT (Nomadic Tribes) at 2.5%, SBC (Special Backward Classes) at 2%, and EWS at 10%. The Maratha reservation (SEBC) has been subject to legal challenges.',
    govtFeeRange: '₹10,000 — ₹1,00,000',
    privateFeeRange: '₹7,00,000 — ₹25,00,000',
    deemedFeeRange: '₹12,00,000 — ₹30,00,000',
  },
  {
    name: 'Manipur',
    code: 'MN',
    authority: 'Directorate of Health Services (DHS), Manipur',
    description: 'Manipur NEET counselling is conducted by the Directorate of Health Services (DHS), Manipur.',
    govtColleges: 2,
    privateColleges: 2,
    domicileYears: 'permanent residency certificate of Manipur',
    extraDescription: 'Manipur has limited medical education facilities with Regional Institute of Medical Sciences (RIMS) as the primary government institution. The state offers reservation for Scheduled Tribes which form a significant portion of the population. Due to limited seats, Manipur candidates are encouraged to participate in AIQ counselling and counselling in neighbouring states.',
    scPct: 2,
    stPct: 40,
    obcPct: 4,
    ewsPct: 10,
    reservationExtra: 'Manipur has ST reservation at 40% (mostly Meitei and Naga communities), SC at 2%, OBC at 4%, and EWS at 10%. There is additional reservation for Scheduled Tribes from hill districts.',
    govtFeeRange: '₹10,000 — ₹30,000',
    privateFeeRange: '₹4,00,000 — ₹10,00,000',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Meghalaya',
    code: 'ML',
    authority: 'Directorate of Medical Education (DME), Meghalaya',
    description: 'Meghalaya NEET counselling is conducted by the Directorate of Medical Education (DME), Meghalaya.',
    govtColleges: 1,
    privateColleges: 1,
    domicileYears: 'permanent residence certificate of Meghalaya',
    extraDescription: 'Meghalaya Medical College, Shillong is the only government medical college in the state. The state has very limited MBBS seats and prioritises local candidates through its reservation policy. Meghalaya follows the Khasi, Jaintia, and Garo community reservation system. Candidates are strongly advised to also apply for AIQ counselling.',
    scPct: 0,
    stPct: 80,
    obcPct: 0,
    ewsPct: 10,
    reservationExtra: 'Meghalaya has 80% ST reservation for Khasi, Jaintia, Garo, and other indigenous communities. The remaining 20% is for General category including non-tribal residents. There is no SC or OBC reservation in Meghalaya.',
    govtFeeRange: '₹10,000 — ₹25,000',
    privateFeeRange: '₹3,00,000 — ₹8,00,000',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Mizoram',
    code: 'MZ',
    authority: 'Directorate of Medical Education (DME), Mizoram',
    description: 'Mizoram NEET counselling is conducted by the Directorate of Medical Education (DME), Mizoram.',
    govtColleges: 1,
    privateColleges: 0,
    domicileYears: 'permanent residence certificate of Mizoram',
    extraDescription: 'Mizoram has a single government medical college — Zoram Medical College, Falkawn — which is also the only MBBS teaching institution in the state. Seats are extremely limited and the state gives priority to Mizo candidates with ST certificates. Candidates should also apply for AIQ counselling to maximise their chances.',
    scPct: 0,
    stPct: 85,
    obcPct: 0,
    ewsPct: 10,
    reservationExtra: 'Mizoram has 85% reservation for ST (Mizo tribes) candidates. The remaining 15% is for General category. There is no SC or OBC reservation in Mizoram.',
    govtFeeRange: '₹8,000 — ₹20,000',
    privateFeeRange: 'N/A',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Nagaland',
    code: 'NL',
    authority: 'Directorate of Health & Family Welfare (DHFW), Nagaland',
    description: 'Nagaland NEET counselling is conducted by the Directorate of Health & Family Welfare (DHFW), Nagaland.',
    govtColleges: 1,
    privateColleges: 0,
    domicileYears: 'Nagaland domicile / indigenous inhabitant certificate',
    extraDescription: 'Nagaland has one government medical college — Nagaland Medical College, Kohima. The state has very limited MBBS seats and strictly prioritises indigenous Naga candidates. The counselling process is streamlined and transparent. Candidates are encouraged to apply for AIQ counselling and consider medical colleges in other states for additional options.',
    scPct: 0,
    stPct: 80,
    obcPct: 0,
    ewsPct: 10,
    reservationExtra: 'Nagaland has approximately 80% reservation for ST (indigenous Naga tribes) candidates. The remaining seats are for General category candidates (including non-tribal residents). There is no SC or OBC reservation.',
    govtFeeRange: '₹8,000 — ₹20,000',
    privateFeeRange: 'N/A',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Odisha',
    code: 'OD',
    authority: 'OJEE (Odisha Joint Entrance Examination)',
    description: 'Odisha NEET counselling is conducted by the Odisha Joint Entrance Examination (OJEE) committee.',
    govtColleges: 8,
    privateColleges: 6,
    domicileYears: 'Odisha domicile (at least 5 years)',
    extraDescription: 'Odisha has prestigious government medical colleges like SCB Medical College Cuttack and MKCG Medical College Berhampur, along with newer institutions. OJEE manages a well-structured online counselling process with multiple rounds. The state offers reservation benefits for tribal communities which form a significant percentage of the population.',
    extraEligibility: 'Odisha domicile required. Candidates who have studied in Odisha for at least 5 years are eligible. Children of Odisha government employees working outside the state are also eligible.',
    scPct: 16,
    stPct: 22,
    obcPct: 11,
    ewsPct: 10,
    reservationExtra: 'Odisha has ST reservation at 22%, SC at 16%, OBC at 11%, SEBC at 5%, and EWS at 10%. There is additional reservation for candidates from KBK (Kalahandi-Balangir-Koraput) districts at 5%.',
    govtFeeRange: '₹12,000 — ₹45,000',
    privateFeeRange: '₹5,00,000 — ₹15,00,000',
    deemedFeeRange: '₹10,00,000 — ₹20,00,000',
  },
  {
    name: 'Punjab',
    code: 'PB',
    authority: 'Baba Farid University of Health Sciences (BFUHS)',
    description: 'Punjab NEET counselling is conducted by Baba Farid University of Health Sciences (BFUHS), Faridkot.',
    govtColleges: 7,
    privateColleges: 6,
    domicileYears: 'Punjab domicile (at least 10 years)',
    extraDescription: 'Punjab has established government medical colleges like Government Medical College Patiala, Amritsar, and Faridkot. BFUHS manages the centralised counselling process for MBBS and BDS admissions across the state. The state also has several private medical colleges offering quality education. Punjab has a competitive counselling process with well-defined reservation policies.',
    extraEligibility: 'Punjab domicile required. Candidates who have studied in Punjab for at least 5 years are eligible. Wards of Punjab government employees serving outside the state may also apply.',
    scPct: 29,
    stPct: 0,
    obcPct: 12,
    ewsPct: 10,
    reservationExtra: 'Punjab has SC reservation at 29% (one of the highest), OBC at 12%, and EWS at 10%. There is no ST reservation. There is additional reservation for Backward Classes in rural areas and for wards of ex-servicemen.',
    govtFeeRange: '₹12,000 — ₹50,000',
    privateFeeRange: '₹6,00,000 — ₹18,00,000',
    deemedFeeRange: '₹10,00,000 — ₹22,00,000',
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    authority: 'Directorate of Medical Education (DME), Rajasthan',
    description: 'Rajasthan NEET counselling is conducted by the Directorate of Medical Education (DME), Rajasthan.',
    govtColleges: 12,
    privateColleges: 12,
    domicileYears: 'Rajasthan domicile (at least 10 years)',
    extraDescription: 'Rajasthan has a robust medical education system with prestigious colleges like SMS Medical College Jaipur, Dr. S.N. Medical College Jodhpur, and RNT Medical College Udaipur. The state offers numerous MBBS seats through its centralised online counselling process. DME Rajasthan manages the entire process with a focus on efficiency and transparency.',
    extraEligibility: 'Rajasthan domicile required. Candidates who have studied in Rajasthan for at least 5 years or whose parents are Rajasthan government employees are eligible.',
    scPct: 16,
    stPct: 12,
    obcPct: 21,
    ewsPct: 10,
    reservationExtra: 'Rajasthan has OBC (including MBC) at 21%, SC at 16%, ST at 12%, and EWS at 10%. There is additional reservation for the Gujjar community under Special Backward Class (SBC) and for wards of ex-servicemen and defence personnel.',
    govtFeeRange: '₹10,000 — ₹50,000',
    privateFeeRange: '₹5,00,000 — ₹18,00,000',
    deemedFeeRange: '₹10,00,000 — ₹22,00,000',
  },
  {
    name: 'Sikkim',
    code: 'SK',
    authority: 'Directorate of Medical Education (DME), Sikkim',
    description: 'Sikkim NEET counselling is conducted by the Directorate of Medical Education (DME), Sikkim.',
    govtColleges: 1,
    privateColleges: 1,
    domicileYears: 'Sikkim domicile (Sikkim Subject Certificate / Certificate of Identification)',
    extraDescription: 'Sikkim has Sikkim Medical College (SMIMS), Gangtok as the government institution and a few private colleges. The state offers strong reservation for Sikkimese Bhutia-Lepcha communities and other indigenous groups. Due to limited seats, competition is high and candidates should also apply for AIQ counselling.',
    scPct: 0,
    stPct: 55,
    obcPct: 10,
    ewsPct: 10,
    reservationExtra: 'Sikkim has ST (Bhutia-Lepcha) reservation at approximately 55%, OBC (including Most Backward Classes) at 10%, and EWS at 10%. SC reservation is minimal. Sikkim Subject Certificate holders get preference for government quota seats.',
    govtFeeRange: '₹10,000 — ₹30,000',
    privateFeeRange: '₹5,00,000 — ₹12,00,000',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    authority: 'Directorate of Medical Education (DME), Tamil Nadu',
    description: 'Tamil Nadu NEET counselling is conducted by the Directorate of Medical Education (DME), Tamil Nadu, through the TN Medical Selection portal.',
    govtColleges: 25,
    privateColleges: 20,
    domicileYears: 'Tamil Nadu domicile (at least 5 years)',
    extraDescription: 'Tamil Nadu has one of the most advanced medical education systems in India with premier institutions like Madras Medical College, Stanley Medical College, and Christian Medical College Vellore (private). The state follows a strict merit-based counselling process with reservations aligned with the Tamil Nadu Backward Classes Act. TN has been a strong advocate against NEET, but currently follows the Supreme Court-mandated NEET-based admission process.',
    extraEligibility: 'Tamil Nadu domicile required. Candidates who have studied in TN for classes 11 and 12 are eligible. The state has a separate 7.5% reservation for government school students.',
    scPct: 18,
    stPct: 1,
    obcPct: 50,
    ewsPct: 10,
    reservationExtra: 'Tamil Nadu has the highest OBC reservation in India at 50% (BC at 26.5%, MBC/DC at 20%, BC-Muslim at 3.5%). SC at 18%, ST at 1%, and EWS at 10%. Additionally, there is a 7.5% horizontal reservation for government school students within each category, introduced in 2021.',
    govtFeeRange: '₹10,000 — ₹40,000',
    privateFeeRange: '₹5,00,000 — ₹22,00,000',
    deemedFeeRange: '₹10,00,000 — ₹28,00,000',
  },
  {
    name: 'Telangana',
    code: 'TS',
    authority: 'KNRUHS (Kaloji Narayana Rao University of Health Sciences)',
    description: 'Telangana NEET counselling is conducted by Kaloji Narayana Rao University of Health Sciences (KNRUHS), Warangal.',
    govtColleges: 15,
    privateColleges: 15,
    domicileYears: 'Telangana domicile (at least 10 years)',
    extraDescription: 'Telangana has well-established medical colleges including Osmania Medical College Hyderabad, Gandhi Medical College, and Kamineni and Chalmeda private institutions. KNRUHS conducts a comprehensive online counselling process. The state offers significant reservation benefits and has a dedicated fee reimbursement scheme for economically weaker students.',
    extraEligibility: 'Telangana domicile required. Candidates from Andhra Pradesh are not eligible for Telangana state quota seats. Multi-zone reservation system is followed for seat distribution.',
    scPct: 15,
    stPct: 6,
    obcPct: 29,
    ewsPct: 10,
    reservationExtra: 'Telangana follows a multi-zone system similar to Andhra Pradesh with three regional zones. Reservations: SC at 15%, ST at 6%, OBC at 29%, and EWS at 10%. The state also offers KCR Kits and fee reimbursement schemes for SC/ST/BC students.',
    govtFeeRange: '₹7,000 — ₹45,000',
    privateFeeRange: '₹6,00,000 — ₹20,00,000',
    deemedFeeRange: '₹12,00,000 — ₹25,00,000',
  },
  {
    name: 'Tripura',
    code: 'TR',
    authority: 'Directorate of Medical Education (DME), Tripura',
    description: 'Tripura NEET counselling is conducted by the Directorate of Medical Education (DME), Tripura.',
    govtColleges: 2,
    privateColleges: 1,
    domicileYears: 'permanent residency certificate of Tripura',
    extraDescription: 'Tripura has Tripura Medical College (TMC) as the primary government institution. The state has limited MBBS seats and offers reservation primarily for tribal communities. DME Tripura manages the counselling process. Candidates from Tripura are advised to also apply for AIQ counselling and consider options in other states.',
    scPct: 17,
    stPct: 31,
    obcPct: 2,
    ewsPct: 10,
    reservationExtra: 'Tripura has ST reservation at 31% (mainly Tripuri, Reang, Jamatia communities), SC at 17%, OBC at 2%, and EWS at 10%. There is also reservation for indigenous communities under the ST category.',
    govtFeeRange: '₹10,000 — ₹30,000',
    privateFeeRange: '₹4,00,000 — ₹10,00,000',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    authority: 'DGME&T Uttar Pradesh (Directorate General of Medical Education & Training)',
    description: 'Uttar Pradesh NEET counselling is conducted by the Directorate General of Medical Education & Training (DGME&T), Uttar Pradesh, through the UP NEET portal.',
    govtColleges: 20,
    privateColleges: 30,
    domicileYears: 'Uttar Pradesh domicile (at least 10 years)',
    extraDescription: 'Uttar Pradesh has the largest number of medical colleges in India, both government and private. Premier institutions include King George\'s Medical University Lucknow, Institute of Medical Sciences BHU, and Sarojini Naidu Medical College Agra. DGME&T UP manages a large-scale online counselling process with multiple rounds. The state has a diverse reservation policy with significant quotas for OBC, SC, and EWS categories.',
    extraEligibility: 'UP domicile mandatory. Candidates who have studied in UP for at least 5 years are eligible. Wards of UP government employees serving outside UP may also apply.',
    scPct: 21,
    stPct: 2,
    obcPct: 27,
    ewsPct: 10,
    reservationExtra: 'Uttar Pradesh has OBC reservation at 27%, SC at 21%, ST at 2%, and EWS at 10%. There is additional reservation for dependents of freedom fighters and ex-servicemen. The state also offers the Mukhyamantri Abhyudaya Yojana for economically weaker students.',
    govtFeeRange: '₹10,000 — ₹60,000',
    privateFeeRange: '₹6,00,000 — ₹25,00,000',
    deemedFeeRange: '₹12,00,000 — ₹28,00,000',
  },
  {
    name: 'Uttarakhand',
    code: 'UK',
    authority: 'Uttarakhand Medical Education Cell',
    description: 'Uttarakhand NEET counselling is conducted by the Uttarakhand Medical Education Cell.',
    govtColleges: 5,
    privateColleges: 4,
    domicileYears: 'Uttarakhand domicile (at least 10 years)',
    extraDescription: 'Uttarakhand has government medical colleges including HIMS Haldwani, Government Medical College Dehradun, and newer colleges in Almora and Pithoragarh. The state has a streamlined counselling process with a focus on providing opportunities for local candidates. The hill state offers some fee concessions for candidates from remote and high-altitude areas.',
    extraEligibility: 'Uttarakhand domicile required. Candidates who have studied in UK for classes 11 and 12 are eligible. Preference is given to candidates from the Garhwal and Kumaon regions.',
    scPct: 19,
    stPct: 4,
    obcPct: 14,
    ewsPct: 10,
    reservationExtra: 'Uttarakhand has SC reservation at 19%, ST at 4%, OBC at 14%, and EWS at 10%. There is additional reservation for candidates from the Garhwal and Kumaon hill regions and for ex-servicemen.',
    govtFeeRange: '₹12,000 — ₹45,000',
    privateFeeRange: '₹5,00,000 — ₹14,00,000',
    deemedFeeRange: '₹10,00,000 — ₹18,00,000',
  },
  {
    name: 'West Bengal',
    code: 'WB',
    authority: 'WBMCC (West Bengal Medical Counselling Committee)',
    description: 'West Bengal NEET counselling is conducted by the West Bengal Medical Counselling Committee (WBMCC).',
    govtColleges: 15,
    privateColleges: 10,
    domicileYears: 'West Bengal domicile (at least 5 years)',
    extraDescription: 'West Bengal has a rich medical education heritage with prestigious institutions like Calcutta Medical College, NRS Medical College, and IPGMER Kolkata. The state has a centralised online counselling process managed by WBMCC. West Bengal offers reservation for OBC-A, OBC-B, SC, ST, and EWS categories. The state has been expanding its medical education infrastructure with new colleges in various districts.',
    extraEligibility: 'West Bengal domicile required. Candidates who have studied in WB for at least 5 years are eligible. The state has specific rules for candidates from the Gorkha Hill Council areas.',
    scPct: 22,
    stPct: 6,
    obcPct: 17,
    ewsPct: 10,
    reservationExtra: 'West Bengal has SC reservation at 22%, ST at 6%, OBC-A at 10%, OBC-B at 7%, and EWS at 10%. There is additional reservation for candidates from the Darjeeling and Kalimpong hill areas (under Gorkhaland Territorial Administration) and for wards of ex-servicemen.',
    govtFeeRange: '₹10,000 — ₹50,000',
    privateFeeRange: '₹5,00,000 — ₹18,00,000',
    deemedFeeRange: '₹10,00,000 — ₹22,00,000',
    feeExtra: 'West Bengal provides the Swami Vivekananda Merit-cum-Means Scholarship and various fee waiver schemes for SC/ST/OBC students in government colleges.',
  },
  {
    name: 'Delhi',
    code: 'DL',
    authority: 'Directorate of Medical Education (DME), Delhi & MCC',
    description: 'Delhi NEET counselling is managed by the Directorate of Medical Education (DME), Delhi for state quota seats, while AIQ seats are managed by MCC.',
    govtColleges: 5,
    privateColleges: 3,
    domicileYears: 'Delhi domicile (at least 5 years)',
    extraDescription: 'Delhi has premier medical institutions including Maulana Azad Medical College, UCMS, and LHMC, along with VMMC and Safdarjung. Delhi state quota counselling is highly competitive with limited seats. Most Delhi students also participate in AIQ counselling for central pool seats. The state has a well-defined domicile reservation policy for Delhi University colleges.',
    extraEligibility: 'Delhi domicile required for Delhi quota seats. Candidates must have passed class 12 from a Delhi school or have a Delhi residence certificate. For AIQ (MCC) counselling, no domicile restriction applies.',
    scPct: 15,
    stPct: 7,
    obcPct: 27,
    ewsPct: 10,
    reservationExtra: 'Delhi follows central reservation pattern for state quota: SC at 15%, ST at 7.5%, OBC-NCL at 27%, and EWS at 10%. There is 100% Delhi domicile preference for Delhi University medical college seats (Maulana Azad, UCMS, LHMC). Horizontal reservation includes 5% for PwD and 3% for wards of defence personnel.',
    govtFeeRange: '₹10,000 — ₹25,000',
    privateFeeRange: '₹6,00,000 — ₹20,00,000',
    deemedFeeRange: '₹15,00,000 — ₹30,00,000',
  },
  {
    name: 'Puducherry',
    code: 'PY',
    authority: 'CENTAC (Centralised Admission Committee), Puducherry',
    description: 'Puducherry NEET counselling is conducted by the Centralised Admission Committee (CENTAC), Puducherry.',
    govtColleges: 3,
    privateColleges: 5,
    domicileYears: 'Puducherry residence (at least 5 years)',
    extraDescription: 'Puducherry has government colleges like IGMC Puducherry and several well-known private/deemed institutions like JIPMER (central govt) which has its own separate counselling. CENTAC manages the state quota counselling for Puducherry residents. The Union Territory offers a unique mix of government and private medical education options.',
    extraEligibility: 'Puducherry residence required. Candidates who have studied in Puducherry for at least 5 years are eligible. Union territory residents get priority for state quota seats.',
    scPct: 16,
    stPct: 0,
    obcPct: 34,
    ewsPct: 10,
    reservationExtra: 'Puducherry has OBC reservation at 34%, SC at 16%, and EWS at 10%. There is no ST reservation. There is additional reservation for Most Backward Classes within the OBC category and for candidates from rural areas of Puducherry.',
    govtFeeRange: '₹10,000 — ₹40,000',
    privateFeeRange: '₹5,00,000 — ₹18,00,000',
    deemedFeeRange: '₹15,00,000 — ₹30,00,000',
  },
  {
    name: 'Chandigarh',
    code: 'CH',
    authority: 'GMCH Chandigarh / Panjab University',
    description: 'Chandigarh NEET counselling is conducted by GMCH Chandigarh and Panjab University for state quota seats.',
    govtColleges: 2,
    privateColleges: 1,
    domicileYears: 'Chandigarh residence (at least 5 years)',
    extraDescription: 'Chandigarh has Government Medical College and Hospital (GMCH) Sector 32 as the primary government institution. Being a Union Territory with limited seats, competition is very high. Most Chandigarh candidates also apply for AIQ counselling through MCC. The counselling follows a transparent process with reservations aligned to central norms.',
    extraEligibility: 'Chandigarh residence required. Candidates who have passed class 12 from a Chandigarh school are eligible. Children of central government employees posted in Chandigarh may also be considered.',
    scPct: 15,
    stPct: 0,
    obcPct: 27,
    ewsPct: 10,
    reservationExtra: 'Chandigarh follows central reservation norms: OBC at 27%, SC at 15%, and EWS at 10%. There is no ST reservation. Preference is given to Chandigarh residents for 85% of seats in GMCH Chandigarh.',
    govtFeeRange: '₹10,000 — ₹25,000',
    privateFeeRange: '₹5,00,000 — ₹12,00,000',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Andaman and Nicobar Islands',
    code: 'AN',
    authority: 'Directorate of Health Services (DHS), A&N Islands',
    description: 'Andaman and Nicobar Islands NEET counselling is conducted by the Directorate of Health Services (DHS), A&N Islands.',
    govtColleges: 1,
    privateColleges: 0,
    domicileYears: 'residence in A&N Islands (at least 10 years)',
    extraDescription: 'The Andaman and Nicobar Islands have ANIIMS (Andaman and Nicobar Islands Institute of Medical Sciences) as the only medical college. Seats are extremely limited and primarily reserved for island residents. The UT administration prioritises local candidates with strong reservation for tribal communities like the Nicobarese and Jarawa. Candidates should also apply for AIQ counselling.',
    scPct: 0,
    stPct: 55,
    obcPct: 10,
    ewsPct: 10,
    reservationExtra: 'A&N Islands have ST reservation at approximately 55% (primarily for indigenous tribes like Nicobarese, Onges, Jarawa, and Sentinelese), OBC at 10%, and EWS at 10%. General category seats are very limited.',
    govtFeeRange: '₹8,000 — ₹20,000',
    privateFeeRange: 'N/A',
    deemedFeeRange: 'N/A',
  },
  {
    name: 'Jammu and Kashmir',
    code: 'JK',
    authority: 'JKBOPEE (Jammu and Kashmir Board of Professional Entrance Examinations)',
    description: 'Jammu and Kashmir NEET counselling is conducted by the Jammu and Kashmir Board of Professional Entrance Examinations (JKBOPEE).',
    govtColleges: 6,
    privateColleges: 3,
    domicileYears: 'Jammu and Kashmir domicile',
    extraDescription: 'Jammu and Kashmir has government medical colleges in Srinagar, Jammu, and other districts, along with some private institutions. The state has a unique reservation system with quotas for residents of Jammu region, Kashmir region, and various other categories. JKBOPEE manages the counselling process with multiple rounds. Special reservation exists for candidates from border areas and migratory communities.',
    extraEligibility: 'J&K domicile mandatory as per the J&K Reorganisation Act. Candidates must have a valid Permanent Resident Certificate (PRC) or domicile certificate of J&K.',
    scPct: 7,
    stPct: 10,
    obcPct: 8,
    ewsPct: 10,
    reservationExtra: 'Jammu and Kashmir has a unique reservation system: RBA (Residents of Backward Areas) at 20%, ALC (Actual Line of Control) at 3%, OSC (Other Social Castes/OBC) at 8%, SC at 7%, ST at 10%, EWS at 10%, and PSP (Physically Challenged) at 3%. There is also separate regional reservation for Jammu and Kashmir provinces.',
    govtFeeRange: '₹10,000 — ₹40,000',
    privateFeeRange: '₹4,00,000 — ₹12,00,000',
    deemedFeeRange: '₹8,00,000 — ₹18,00,000',
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    code: 'DN',
    authority: 'Directorate of Medical Education (DME), Gujarat',
    description: 'Dadra and Nagar Haveli and Daman and Diu NEET counselling is managed by the Directorate of Medical Education (DME), Gujarat as the state is clubbed with Gujarat for medical admissions.',
    govtColleges: 0,
    privateColleges: 0,
    domicileYears: 'residence in the Union Territory for at least 5 years',
    extraDescription: 'Dadra and Nagar Haveli and Daman and Diu is a Union Territory that does not have its own medical college. Students from this UT are typically clubbed with Gujarat for medical admissions under the state quota. Candidates can also apply for AIQ counselling conducted by MCC. The UT administration provides fee reimbursement and other benefits for students pursuing medical education in Gujarat colleges.',
    extraEligibility: 'Residence certificate of the UT for at least 5 years. Candidates may also be eligible for Gujarat state quota seats under certain bilateral agreements.',
    scPct: 7,
    stPct: 26,
    obcPct: 25,
    ewsPct: 10,
    reservationExtra: 'Dadra and Nagar Haveli has significant ST population, leading to approximately 26% ST reservation. SC at 7%, OBC at 25%, and EWS at 10%. Since the UT is clubbed with Gujarat, seats in Gujarat colleges are offered to UT residents under these quotas.',
    govtFeeRange: '₹10,000 — ₹40,000 (as per Gujarat government rates)',
    privateFeeRange: '₹5,00,000 — ₹18,00,000 (as per Gujarat private college rates)',
    deemedFeeRange: '₹12,00,000 — ₹25,00,000',
  },
]

function generateDates(state: string): { label: string; date: string; description: string }[] {
  return [
    {
      label: 'Registration Start',
      date: 'July 2026 (Tentative)',
      description: `Online registration begins on the official ${state} NEET counselling portal. Candidates must fill in personal, academic, and contact details.`,
    },
    {
      label: 'Last Date to Register',
      date: 'July 2026 (Tentative)',
      description: 'Last date to complete online registration, upload documents, and pay the application fee. Late registration may not be permitted.',
    },
    {
      label: 'Choice Filling Start',
      date: 'July 2026 (Tentative)',
      description: 'Candidates can log in to the portal and fill their preferred college and course choices in order of priority.',
    },
    {
      label: 'Choice Filling Last Date',
      date: 'July 2026 (Tentative)',
      description: 'Last date to lock choices. After this, no modifications are allowed.',
    },
    {
      label: 'Round 1 Seat Allotment',
      date: 'August 2026 (Tentative)',
      description: 'First round seat allotment result published based on NEET rank, preferences filled, and seat availability.',
    },
    {
      label: 'Round 1 Reporting',
      date: 'August 2026 (Tentative)',
      description: `Candidates must report to the allotted college with original documents for verification and fee payment.`,
    },
    {
      label: 'Round 2 Seat Allotment',
      date: 'August-September 2026 (Tentative)',
      description: 'Second round allotment for candidates who did not get a seat in Round 1 or upgraded their preference.',
    },
    {
      label: 'Mop-Up Round',
      date: 'September 2026 (Tentative)',
      description: 'Special round to fill seats remaining vacant after Round 2. New registration may be allowed.',
    },
    {
      label: 'Stray Vacancy Round',
      date: 'September-October 2026 (Tentative)',
      description: 'Final round to fill any remaining vacant seats. Candidates already holding a seat can also participate.',
    },
  ]
}

async function enrichStates() {
  const payload = await getPayload({ config })
  payload.logger.info('Starting state enrichment script...\n')

  let updated = 0
  let errors = 0

  for (const state of STATES_DATA) {
    try {
      payload.logger.info(`Processing: ${state.name} (${state.code})...`)

      const existing = await payload.find({
        collection: 'states',
        where: { name: { equals: state.name } },
        limit: 1,
        depth: 0,
      })

      if (existing.docs.length === 0) {
        payload.logger.warn(`  WARNING: State "${state.name}" not found in database. Skipping.`)
        errors++
        continue
      }

      const stateId = existing.docs[0].id

      const descriptionSections = stateDescription(
        state.name,
        state.authority,
        state.govtColleges,
        state.privateColleges,
        state.extraDescription,
      )

      const importantDates = generateDates(state.name)

      const eligibility = eligibilitySections(state.name, state.domicileYears, state.extraEligibility)

      const documents = documentSections()

      const reservation = reservationSections(
        state.name,
        state.scPct,
        state.stPct,
        state.obcPct,
        state.ewsPct,
        state.reservationExtra,
      )

      const fees = feeSections(
        state.name,
        state.govtFeeRange,
        state.privateFeeRange,
        state.deemedFeeRange,
        state.feeExtra,
      )

      await payload.update({
        collection: 'states',
        id: stateId,
        data: {
          description: buildRichText(descriptionSections) as any,
          importantDates: importantDates as any,
          eligibilityNotes: buildRichText(eligibility) as any,
          documentRequirements: buildRichText(documents) as any,
          reservationPolicy: buildRichText(reservation) as any,
          feeStructureNotes: buildRichText(fees) as any,
        },
        depth: 0,
      })

      payload.logger.info(`  ✓ Updated: ${state.name}`)
      updated++
    } catch (err) {
      payload.logger.error(`  ✗ Error updating ${state.name}: ${err}`)
      errors++
    }
  }

  payload.logger.info(`\nEnrichment complete.`)
  payload.logger.info(`Updated: ${updated}/${STATES_DATA.length}`)
  payload.logger.info(`Errors: ${errors}`)
  process.exit(0)
}

enrichStates().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
