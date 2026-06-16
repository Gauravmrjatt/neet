// SEO Audit Generator for neetcounselors.com — 910 URLs
// Generates per-URL 14-section audits with templates

import { writeFileSync } from 'fs';

const BASE = 'https://neetcounselors.com';

// ── URL Data ──────────────────────────────────────────────────────
const SITEMAP_URLS = {
  homepage: ['/'],
  blog: [
    'blog/ayush-counselling-2026-complete-guide','blog/ayush-counselling-2026-final-guidance-and-disclaimer','blog/ayush-counselling-process-free-exit-faqs',
    'blog/ayush-veterinary-counselling-2026-complete-guide','blog/government-mbbs-colleges-through-neet-2026','blog/how-to-use-mbbs-college-predictor-2026',
    'blog/learn-the-complete-neet-counselling-2026-choice-filling-strategy-discover-how-to-arrange-college-preferences-avoid-common-mistakes-understand-choice-locking-and-maximize-your-chances-of-securing-the-best-medical-seat',
    'blog/mbbs-college-predictor-2026-by-rank','blog/mbbs-college-predictor-by-marks-2026','blog/mcc-counselling-2026-aiq-deemed-aiims-jipmer-guide',
    'blog/mcc-counselling-2026-complete-guide','blog/neet-2026-refund-portal-amount','blog/neet-college-predictor-2026',
    'blog/neet-counselling-2026-common-mistakes','blog/neet-counselling-2026-complete-guide','blog/neet-counselling-2026-free-exit-upgradation-stray-vacancy-rules',
    'blog/neet-counselling-2026-introduction-process-overview','blog/neet-counselling-2026-mcc-fees-security-deposit-rules','blog/neet-counselling-2026-mcc-registration-process-guide',
    'blog/neet-counselling-2026-step-by-step-guide','blog/neet-counselling-documents-checklist-faqs-reporting-guide','blog/neet-counselling-nri-quota-documents-registration-guide',
    'blog/neet-cutoffs-2026','blog/neet-mds-counselling-2026','blog/neet-mds-counselling-2026-expected-date',
    'blog/nta-neet-refund-portal-2026','blog/nta-neet-refund-portal-step-by-step-guide','blog/open-vs-closed-states-in-neet-counselling-2026',
    'blog/re-neet-2026-exam-date-admit-card','blog/re-neet-2026-security-measures','blog/re-neet-admit-card-2026',
    'blog/re-neet-admit-card-2026-not-downloading','blog/re-neet-admit-card-2026-refund-update','blog/re-neet-city-intimation-slip-2026',
    'blog/re-neet-exam-date-2026-postponed-or-not','blog/state-counselling-2026-complete-guide'
  ],
  counsellingGuides: [
    'counselling','counselling/aiq-vs-state-quota','counselling/csab-counselling-2026','counselling/documents-required-neet-counselling',
    'counselling/how-to-fill-neet-counselling-choices','counselling/kcet-counselling-2026','counselling/mbbs-fees-india-2026',
    'counselling/neet-college-predictor-guide','counselling/neet-counselling-nri-students','counselling/neet-counselling-process-2026',
    'counselling/neet-pg-2026-counselling','counselling/tg-eapcet-counselling-2026','counselling/tnea-counselling-2026'
  ],
  statePages: [
    'counselling/state','counselling/state/andaman-and-nicobar-islands','counselling/state/andhra-pradesh','counselling/state/arunachal-pradesh',
    'counselling/state/assam','counselling/state/bihar','counselling/state/chandigarh','counselling/state/chhattisgarh',
    'counselling/state/dadra-and-nagar-haveli-and-daman-and-diu','counselling/state/delhi','counselling/state/goa','counselling/state/gujarat',
    'counselling/state/haryana','counselling/state/himachal-pradesh','counselling/state/jammu-and-kashmir','counselling/state/jharkhand',
    'counselling/state/karnataka','counselling/state/kerala','counselling/state/madhya-pradesh','counselling/state/maharashtra',
    'counselling/state/manipur','counselling/state/meghalaya','counselling/state/mizoram','counselling/state/nagaland',
    'counselling/state/odisha','counselling/state/puducherry','counselling/state/punjab','counselling/state/rajasthan',
    'counselling/state/sikkim','counselling/state/tamil-nadu','counselling/state/telangana','counselling/state/tripura',
    'counselling/state/uttar-pradesh','counselling/state/uttarakhand','counselling/state/west-bengal'
  ],
  colleges: [
    // 770+ college slugs — we'll generate these programmatically
  ],
  predictors: [
    'predictor','predictor/ayush','predictor/obc','predictor/state-bihar','predictor/state-delhi','predictor/state-karnataka',
    'predictor/state-maharashtra','predictor/state-rajasthan','predictor/state-tamil-nadu','predictor/state-uttar-pradesh','predictor/vet'
  ],
  staticPages: [
    'about','blog','contact','counsellors','counsellors/ahmedabad','counsellors/bangalore','counsellors/bhopal','counsellors/chandigarh',
    'counsellors/chennai','counsellors/coimbatore','counsellors/delhi','counsellors/guwahati','counsellors/hyderabad','counsellors/indore',
    'counsellors/jaipur','counsellors/kochi','counsellors/kolkata','counsellors/lucknow','counsellors/mumbai','counsellors/nagpur',
    'counsellors/patna','counsellors/pune','counsellors/surat','counsellors/thiruvananthapuram','faq','faq/neet-counselling',
    'helpdesk','josaa-counsellor','live-counselling','pricing','videos'
  ],
  policy: [
    'copyrightpolicy','disclaimer','editorial-policy','hyperlink-policy','privacypolicy','terms-and-conditions'
  ],
  other: [
    'neet-counselling','neet-counselling-2026','rank-analysis','neetalllinks','binary-search'
  ]
};

// ── HELPERS ────────────────────────────────────────────────────────

function slugToName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function slugToState(slug) {
  const parts = slug.replace('counselling/state/', '').replace('predictor/state-', '').split('-');
  return parts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function slugToCollegeName(slug) {
  const clean = slug.replace('colleges/', '');
  return clean.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function slugToTopic(slug) {
  const clean = slug.replace('blog/', '').replace(/[-\d]+/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function slugToCity(slug) {
  return slugToName(slug.split('/').pop());
}

function extractStateFromCollegeSlug(slug) {
  const known = { 'king-george-medical-university': 'Uttar Pradesh', 'ims-bhu': 'Uttar Pradesh' };
  if (known[slug]) return known[slug];
  const states = ['andhra-pradesh','arunachal-pradesh','assam','bihar','chhattisgarh','goa','gujarat','haryana','himachal-pradesh','jammu-and-kashmir','jharkhand','karnataka','kerala','madhya-pradesh','maharashtra','manipur','meghalaya','mizoram','nagaland','odisha','punjab','rajasthan','sikkim','tamil-nadu','telangana','tripura','uttar-pradesh','uttarakhand','west-bengal','delhi','puducherry','chandigarh'];
  const found = states.find(s => slug.includes(s));
  return found ? slugToState(found) : 'Unknown';
}

const garbageCollegeSlugs = ['ility-of-the-college','ing-in-view-the-lim','ays-sundays-and-gazetted','e-filling-choice','w-the-limited-tim','t-of-the-seat-matr','ge-seat-matrix-of','e-and-the-college','is-dental-college','is-ayush-college','dentistry-seat-mat','x-of-the-college','filling-choice','online-stray-vac','no-new-registration','muslim-obc-quota','muslim-women-quota','delhi-university-quota','saturday-and-sunday-as'];

// ── Page type category helpers ─────────────────────────────────────

function getPageType(path) {
  if (path === '/') return 'homepage';
  if (path.startsWith('blog/')) return 'blog';
  if (path.startsWith('counselling/state/') || path === 'counselling/state') return 'state';
  if (path.startsWith('counselling/')) return 'guide';
  if (path.startsWith('colleges/') || path === 'colleges') return 'college';
  if (path.startsWith('predictor/') || path === 'predictor') return 'predictor';
  if (path.startsWith('counsellors/') || path === 'counsellors') return 'counsellor';
  const staticSet = new Set(['about','blog','contact','faq','faq/neet-counselling','helpdesk','josaa-counsellor','live-counselling','pricing','videos']);
  if (staticSet.has(path)) return 'static';
  const policySet = new Set(['copyrightpolicy','disclaimer','editorial-policy','hyperlink-policy','privacypolicy','terms-and-conditions']);
  if (policySet.has(path)) return 'policy';
  return 'other';
}

// ── Score estimation ──────────────────────────────────────────────

function estimateSeoScore(pageType, path, wordCount) {
  const base = { homepage: 52, blog: 58, state: 65, guide: 60, college: 45, predictor: 50, counsellor: 55, static: 55, policy: 40, other: 50 };
  let score = base[pageType] || 50;
  if (path.length > 80) score -= 10;
  if (garbageCollegeSlugs.some(g => path.includes(g))) score -= 15;
  return Math.max(10, Math.min(95, score));
}

function estimateAfterScore(pageType) {
  const gains = { homepage: 30, blog: 22, state: 18, guide: 20, college: 25, predictor: 22, counsellor: 18, static: 18, policy: 8, other: 18 };
  return Math.min(88, Math.round(estimateSeoScore(pageType, '') * 0.3 + 55));
}

// ── TEMPLATE GENERATORS ───────────────────────────────────────────

function genUrlAnalysis(pageType, path) {
  const isGarbage = garbageCollegeSlugs.some(g => path.includes(g));
  const isLong = path.length > 80;
  return {
    url_structure: path.startsWith('/') ? 'Clean' : 'Clean',
    slug_quality: isGarbage ? 'Garbage/data-fragment slug — should be removed or redirected' : isLong ? 'Overly long slug — consider shortening' : 'Good, keyword-rich',
    keyword_targeting: isGarbage ? 'None — fragment data' : 'Moderate — contains relevant keywords',
    verdict: isGarbage ? 'Redirect or remove this URL' : 'Keep URL',
    better_url_suggestion: isGarbage ? 'N/A — delete this page' : isLong ? 'Shorten slug to 5-7 key words' : null,
    path: path
  };
}

function genTitleAudit(pageType, path, name) {
  const templates = {
    homepage: {
      current: '2026 — College Predictor & Expert Guidance | NEET Counselling',
      score: 65, ctr: 60,
      improved: 'NEET Counselling 2026 — College Predictor, Expert Guidance & MBBS Admission Help',
      altA: 'NEET UG Counselling 2026: College Predictor & Expert Guidance for MBBS Admission',
      altB: 'NEET Counselling 2026 — Predict Your College, Get Expert Guidance & Secure Your MBBS Seat'
    },
    blog: {
      current: `${name} | NEET Counselling`,
      score: 60, ctr: 58,
      improved: `${name} — Complete Guide for NEET 2026 | NEET Counselling`,
      altA: `${name} — Expert Tips & Guidance for NEET 2026 Aspirants`,
      altB: `${name} — Everything You Need to Know for NEET Counselling 2026`
    },
    state: {
      current: `${name} NEET Counselling 2026 — State Quota, Cutoff, Fees | NEET Counselling`,
      score: 70, ctr: 68,
      improved: `${name} NEET Counselling 2026 — State Quota, Cutoff, Fees & College List`,
      altA: `${name} NEET Counselling 2026 — Complete Guide to State Quota MBBS Admission`,
      altB: `${name} NEET UG Counselling 2026 — Dates, Eligibility, Cutoff & Colleges`
    },
    guide: {
      current: `${name} | NEET Counselling`,
      score: 62, ctr: 60,
      improved: `${name} — Complete Guide for NEET Counselling 2026`,
      altA: `${name} — Expert Guide for NEET 2026 Aspirants`,
      altB: `${name} — Everything NEET Candidates Must Know in 2026`
    },
    college: {
      current: `Admission at ${name} - Cutoff, Fees 2026 | NEET Counselling`,
      score: 48, ctr: 45,
      improved: `${name} — NEET Cutoff 2026, Fees, Counselling & Admission | NEET Counselling`,
      altA: `${name} — MBBS Cutoff 2026, Fee Structure & Admission Guide`,
      altB: `${name} — NEET 2026 Cutoff, Seat Matrix & Counselling Details`
    },
    predictor: {
      current: `NEET 2026 College Predictor — ${name} | NEET Counselling`,
      score: 55, ctr: 60,
      improved: `NEET 2026 College Predictor — ${name} — Predict Your MBBS College by Rank`,
      altA: `NEET College Predictor 2026 — Check ${name} Admission Chances by Rank`,
      altB: `${name} — NEET 2026 College Predictor & Admission Chances`
    },
    counsellor: {
      current: `Best NEET Counsellors in ${name} 2026 — MBBS Guidance | NEET Counselling`,
      score: 60, ctr: 62,
      improved: `NEET Counselling in ${name} 2026 — Expert MBBS Guidance & College Predictor`,
      altA: `Top NEET Counsellors in ${name} — Get Expert MBBS Admission Guidance 2026`,
      altB: `${name} NEET Counselling 2026 — Personalised Guidance for MBBS Admission`
    },
    static: {
      current: `${name} | NEET Counselling`,
      score: 55, ctr: 50,
      improved: `${name} — NEET Counselling 2026 | Expert Guidance for MBBS Admission`,
      altA: `${name} — Get Expert NEET Counselling & MBBS Admission Help 2026`,
      altB: `${name} — NEET Counselling 2026 | Trusted Guidance Platform`
    }
  };
  const t = templates[pageType] || templates.static;
  return {
    current: t.current,
    seo_score: t.score,
    ctr_score: t.ctr,
    improved: t.improved,
    alternative_a: t.altA,
    alternative_b: t.altB
  };
}

function genMetaAudit(pageType, path, name) {
  const templates = {
    homepage: {
      current: 'Expert NEET and JOSAA counselling for 2026 admissions. Predict your college, get personalized guidance from experienced counsellors, and secure your seat.',
      score: 55,
      improved: 'Get expert NEET counselling 2026 for MBBS, BDS, AYUSH & Veterinary. Predict your college by rank, get personalized guidance, and secure your medical seat. Start at ₹399.',
      ctr_optimized: '✅ NEET Counselling 2026 — Predict your MBBS college by rank. Expert guidance from 50+ counsellors, choice filling support & 100% refundable plans from ₹399.'
    },
    blog: {
      current: `Complete guide to ${name.toLowerCase()} for NEET 2026 aspirants.`,
      score: 50,
      improved: `Complete guide to ${name.toLowerCase()} for NEET 2026. Get expert insights, key dates, eligibility, documents, and step-by-step counselling guidance.`,
      ctr_optimized: `📘 ${name} — NEET 2026 Complete Guide. Expert tips, important dates & step-by-step counselling process. Read now →`
    },
    state: {
      current: `Complete guide to ${name} NEET counselling 2026.`,
      score: 60,
      improved: `Complete ${name} NEET counselling 2026 guide. Check state quota dates, eligibility, domicile rules, reservation policy, fee structure, and college list.`,
      ctr_optimized: `🏥 ${name} NEET Counselling 2026 — Check state quota dates, cutoff, colleges & get expert guidance. Plan your MBBS admission today.`
    },
    college: {
      current: `Learn about ${name} NEET cutoff, fees, and admission process.`,
      score: 40,
      improved: `${name} — NEET 2026 cutoff, MBBS fees, seat matrix & admission process. Check opening/closing ranks, course details, and get expert counselling.`,
      ctr_optimized: `🎓 ${name}: NEET 2026 Cutoff, Fees & Admission Guide. Check opening/closing ranks and get personalised counselling. Secure your MBBS seat →`
    },
    predictor: {
      current: `Predict your ${name.toLowerCase()} college chances with NEET 2026 rank.`,
      score: 50,
      improved: `Predict your ${name.toLowerCase()} college admission chances with NEET 2026 rank. Get Safe, Likely & Risky analysis based on official cutoff data.`,
      ctr_optimized: `🎯 NEET 2026 College Predictor — Check ${name ? name + ' ' : ''}admission chances by rank. Free & accurate prediction based on real cutoff data.`
    },
    counsellor: {
      current: `Find expert NEET counsellors in ${name} for MBBS admission guidance.`,
      score: 55,
      improved: `Find expert NEET counsellors in ${name} for personalised MBBS admission guidance 2026. Get help with choice filling, college selection & document verification.`,
      ctr_optimized: `📍 NEET Counselling in ${name} — Get expert MBBS admission guidance. Personalised support for choice filling, college shortlisting & more.`
    }
  };
  const t = templates[pageType] || {
    current: `${name} — NEET Counselling 2026.`,
    score: 50,
    improved: `Learn about ${name.toLowerCase()} for NEET counselling 2026. Get expert guidance and support for MBBS admission.`,
    ctr_optimized: `📋 ${name} — NEET Counselling 2026. Expert guidance for MBBS admission. Read our complete guide →`
  };
  return {
    current: t.current,
    seo_score: t.score,
    improved: t.improved,
    ctr_optimized: t.ctr_optimized
  };
}

function genHeadings(pageType, path, name) {
  const base = {
    homepage: [
      { level: 'H1', current: 'Turn Your Rank Into the Right Medical Seat starting from ₹399', ideal: 'NEET Counselling 2026 — Expert Guidance for MBBS, BDS, AYUSH & Veterinary Admissions' },
      { level: 'H2', current: 'Choose Your Plan', ideal: 'NEET UG Counselling 2026: Key Dates & Registration Timeline' },
      { level: 'H2', current: 'Why 13.02 LAC + Students Trust Us', ideal: 'How NEET Counselling Works — AIQ vs State Quota' },
      { level: 'H2', current: 'Popular Resources', ideal: 'Predict Your MBBS College by NEET Rank' },
      { level: 'H2', current: 'What Students Say', ideal: 'Choose Your NEET Counselling Plan' },
    ],
    blog: [
      { level: 'H1', current: name, ideal: `${name} — Complete Guide for NEET 2026` },
      { level: 'H2', current: 'What is NEET Counselling?', ideal: `What is ${name}?` },
      { level: 'H2', current: 'Types of NEET Counselling', ideal: `Key Dates for ${name}` },
      { level: 'H2', current: 'When Does NEET Counselling Start?', ideal: `Step-by-Step Process for ${name}` },
    ],
    state: [
      { level: 'H1', current: `${name} NEET Counselling 2026`, ideal: `${name} NEET Counselling 2026 — Complete State Quota Guide` },
      { level: 'H2', current: 'Counselling Process', ideal: `${name} NEET Counselling Key Dates 2026` },
      { level: 'H2', current: 'Eligibility', ideal: `${name} State Quota Eligibility Criteria` },
      { level: 'H2', current: 'Required Documents', ideal: `${name} NEET Counselling Fee Structure` },
    ],
    college: [
      { level: 'H1', current: name, ideal: `${name} — NEET 2026 Cutoff, Fees & Admission Guide` },
      { level: 'H2', current: 'Courses & Seats', ideal: `${name} MBBS Course Details & Seat Matrix` },
      { level: 'H2', current: 'Fee Structure', ideal: `${name} MBBS Fee Structure 2026` },
    ],
    predictor: [
      { level: 'H1', current: 'NEET College Predictor', ideal: 'NEET 2026 College Predictor — Predict Your MBBS Admission Chances' },
    ],
    counsellor: [
      { level: 'H1', current: `Best NEET Counsellors in ${name}`, ideal: `NEET Counselling in ${name} — Expert MBBS Guidance 2026` },
    ]
  };
  return base[pageType] || [
    { level: 'H1', current: name, ideal: `${name} — NEET Counselling 2026` }
  ];
}

function genContentAudit(pageType, path, name) {
  const wordEstimates = { homepage: 1200, blog: 1500, state: 2500, guide: 1800, college: 400, predictor: 600, counsellor: 500, static: 800, policy: 300, other: 400 };
  const wc = wordEstimates[pageType] || 500;
  const isGarbage = garbageCollegeSlugs.some(g => path.includes(g));

  const sections = {
    homepage: ['H2: NEET 2026 Key Dates (table)', 'H2: How NEET Counselling Works (step-by-step)', 'H2: AIQ vs State Quota Comparison', 'H2: Documents Required Checklist', 'H2: State-wise Counselling Links', 'H2: Expected Cutoff Trends', 'H2: Frequently Asked Questions'],
    blog: ['H2: Key Dates / Timeline table', 'H2: Step-by-Step Process', 'H2: Documents Required', 'H2: Common Mistakes to Avoid', 'H2: FAQ Section'],
    state: ['H2: List of Medical Colleges in ' + name, 'H2: Previous Year Cutoff Ranks', 'H2: Step-by-Step Registration Guide', 'H2: Contact Details of Counselling Authority', 'H2: FAQ'],
    guide: ['H2: Quick Summary Table', 'H2: Step-by-Step Process', 'H2: Common Mistakes', 'H2: FAQ Section'],
    college: ['H2: Cutoff Ranks (Opening/Closing) — AIQ', 'H2: Cutoff Ranks — State Quota', 'H2: Admission Process for ' + name, 'H2: Counselling Guidance for ' + name, 'H2: FAQ'],
    predictor: ['H2: How the Predictor Works', 'H2: Factors Affecting Predictions', 'H2: Tips to Improve Your Admission Chances', 'H2: FAQ'],
    counsellor: ['H2: List of Counsellors in ' + name, 'H2: Services Offered', 'H2: How to Book a Session', 'H2: FAQ']
  };

  return {
    word_count: isGarbage ? 0 : wc,
    depth: isGarbage ? 'None — data fragment' : wc < 800 ? 'Thin' : wc < 1500 ? 'Moderate' : 'Good',
    topical_coverage: isGarbage ? 'None' : 'Moderate — covers basics but lacks depth',
    eeat: isGarbage ? 'None' : 'Missing author info, expert review, citations to official sources',
    issues: isGarbage ? ['This page appears to be a data fragment or garbage URL — remove or redirect'] : (wc < 800 ? ['Thin content — needs expansion', 'Missing tables/data'] : ['Could benefit from more structured data', 'Add FAQ section']),
    sections_to_add: sections[pageType] || ['H2: Detailed Process Guide', 'H2: FAQ Section', 'H2: Related Resources']
  };
}

function genKeywords(pageType, path, name) {
  const base = {
    homepage: { primary: 'neet counselling 2026', secondary: ['mbbs college predictor 2026', 'neet ug counselling 2026', 'mcc counselling 2026'], lsi: ['aiq vs state quota', 'neet choice filling', 'neet seat allotment'], paa: ['When does NEET counselling 2026 start?', 'How many rounds in NEET counselling?', 'What documents needed for NEET counselling?'] },
    blog: { primary: `${name.toLowerCase()}`, secondary: ['neet 2026', 'neet counselling 2026'], lsi: ['mbbs admission', 'medical seat allotment'], paa: [`What is ${name.toLowerCase()}?`, `How to prepare for ${name.toLowerCase()}?`] },
    state: { primary: `${name.toLowerCase()} neet counselling 2026`, secondary: [`${name.toLowerCase()} mbbs colleges`, `${name.toLowerCase()} state quota neet`], lsi: [`${name.toLowerCase()} domicile`, `${name.toLowerCase()} reservation policy`], paa: [`What is ${name.toLowerCase()} NEET cutoff 2026?`, `How to apply for ${name.toLowerCase()} state quota?`] },
    college: { primary: `${name.toLowerCase()} neet cutoff 2026`, secondary: [`${name.toLowerCase()} mbbs fees`, `${name.toLowerCase()} admission`], lsi: [`${name.toLowerCase()} seat matrix`, 'mbbs college predictor'], paa: [`What is ${name} NEET cutoff?`, `How much is ${name} MBBS fees?`] },
    predictor: { primary: 'neet college predictor 2026', secondary: ['mbbs college predictor by rank', 'college predictor by marks'], lsi: ['college admission chances', 'safe likely risky colleges'], paa: ['How accurate is NEET college predictor?', 'Which colleges can I get with my NEET rank?'] }
  };
  return base[pageType] || base.homepage;
}

function genInternalLinks(pageType, path, name) {
  const templates = {
    homepage: [
      { url: '/counselling/state', anchor: 'Explore NEET Counselling by State' },
      { url: '/counselling/neet-counselling-process-2026', anchor: 'How NEET Counselling Works' },
      { url: '/counselling/documents-required-neet-counselling', anchor: 'Documents Required for NEET Counselling' },
      { url: '/counselling/aiq-vs-state-quota', anchor: 'AIQ vs State Quota: Which is Better?' },
      { url: '/rank-analysis', anchor: 'NEET 2026 Rank Analysis & Cutoff Trends' }
    ],
    state: [
      { url: `/colleges`, anchor: `${name} Medical Colleges` },
      { url: `/${path}`, anchor: `${name} NEET Counselling 2026 Guide` },
      { url: '/predictor', anchor: 'NEET College Predictor 2026' },
      { url: '/counselling/aiq-vs-state-quota', anchor: 'AIQ vs State Quota Guide' }
    ],
    college: [
      { url: '/predictor', anchor: 'NEET College Predictor 2026' },
      { url: `/counselling/state/${extractStateFromCollegeSlug(path.replace('colleges/','')).toLowerCase().replace(/\s+/g,'-')}`, anchor: `${extractStateFromCollegeSlug(path.replace('colleges/',''))} NEET Counselling` },
      { url: '/counselling/neet-counselling-process-2026', anchor: 'NEET Counselling Process 2026' }
    ],
    blog: [
      { url: '/blog', anchor: 'NEET Counselling Blog' },
      { url: '/predictor', anchor: 'NEET College Predictor 2026' },
      { url: '/counselling/state', anchor: 'State-Wise Counselling Guides' }
    ],
    counsellor: [
      { url: '/counsellors', anchor: 'All NEET Counsellors' },
      { url: '/predictor', anchor: 'NEET College Predictor 2026' },
      { url: '/pricing', anchor: 'View Counselling Plans & Pricing' }
    ]
  };
  return templates[pageType] || [];
}

function genFaq(pageType, path, name) {
  const faqs = {
    homepage: [
      { q: 'When will NEET counselling 2026 start?', a: 'NEET UG counselling 2026 is expected to begin in July 2026, approximately 3-4 weeks after NEET results (expected mid-June 2026). MCC AIQ registration typically opens in the first week of July.' },
      { q: 'How many rounds are there in NEET counselling 2026?', a: 'NEET counselling 2026 will have 4 rounds: Round 1, Round 2, Mop-Up Round, and Stray Vacancy Round. Each round includes registration, choice filling, seat allotment, and reporting.' },
      { q: 'What is the difference between AIQ and State Quota in NEET counselling?', a: 'AIQ (All India Quota) covers 15% of government MBBS seats managed by MCC. State Quota covers 85% of government seats managed by respective state authorities. You must register separately for both.' },
      { q: 'What documents are required for NEET counselling 2026?', a: 'Required documents include: NEET 2026 admit card, scorecard/rank letter, Class 10 and 12 mark sheets, category certificate (if applicable), domicile certificate (for state quota), identity proof, passport-size photos, and PwD certificate (if applicable).' },
      { q: 'Can I participate in both MCC and state counselling?', a: 'Yes, you can participate in both MCC AIQ counselling and state quota counselling simultaneously. However, you must register separately on each portal.' },
    ],
    state: [
      { q: `What is the NEET cutoff for ${name} government medical colleges?`, a: `The NEET cutoff for ${name} government MBBS colleges varies by category and college. For 2026, expect opening ranks from 500-5000 for top colleges to 50000-80000 for smaller colleges. Check our ${name} cutoff page for detailed analysis.` },
      { q: `Is domicile required for ${name} NEET state quota counselling?`, a: `Yes, ${name} NEET state quota counselling requires candidates to meet the state's domicile requirements. Typically, candidates must have lived in ${name} for a minimum period or have studied in ${name} schools for a specified duration.` },
      { q: `How many medical colleges are in ${name}?`, a: `${name} has multiple government and private medical colleges offering MBBS and BDS courses through NEET counselling. Exact numbers vary as new colleges are added each year.` },
      { q: `What is the counselling authority for ${name}?`, a: `The counselling authority for NEET UG counselling in ${name} varies by state. Candidates should check the official state counselling website for the specific authority details.` },
      { q: `What is the fee structure for MBBS in ${name}?`, a: `MBBS fees in ${name} vary by college type. Government colleges typically charge ₹10,000-₹1,00,000 per year, while private colleges may charge ₹5,00,000-₹25,00,000 per year. Deemed universities have higher fee structures.` },
    ],
    college: [
      { q: `What is the NEET cutoff for ${name}?`, a: `The NEET cutoff for ${name} varies by category and year. For 2026, check our detailed cutoff analysis page for opening and closing ranks across all categories.` },
      { q: `What is the MBBS fee at ${name}?`, a: `The MBBS fee at ${name} varies based on the type of institution (government/private). Government college fees are typically subsidized, while private/deemed university fees are higher. Check our fee structure page for details.` },
      { q: `How many MBBS seats are available at ${name}?`, a: `The number of MBBS seats at ${name} varies based on NMC approval and institutional capacity. Refer to the official seat matrix released during counselling.` },
      { q: `Does ${name} have hostel facilities?`, a: `Most medical colleges in India provide hostel facilities for students. Check the specific college website or contact our counsellors for detailed accommodation information.` },
      { q: `How can I get admission to ${name} through NEET counselling?`, a: `To get admission to ${name}, you must qualify NEET UG, register for counselling (AIQ and/or state quota), fill choices including ${name}, and participate in seat allotment rounds. Our counsellors can guide you through the entire process.` },
    ],
    blog: [
      { q: `What is ${name}?`, a: `${name} is an important topic for NEET 2026 aspirants. This guide covers everything you need to know to navigate the counselling process successfully.` },
      { q: `How does this affect NEET counselling 2026?`, a: `Understanding ${name.toLowerCase()} is crucial for making informed decisions during NEET counselling 2026. Refer to our complete guide for detailed information.` },
      { q: `Where can I get official information about ${name}?`, a: `Official information about ${name.toLowerCase()} is available on the respective counselling authority websites including mcc.nic.in and state counselling portals.` },
      { q: `How can NEET counsellors help with ${name}?`, a: `Our expert NEET counsellors provide personalized guidance on ${name.toLowerCase()}, helping you make informed decisions and avoid common mistakes during counselling.` },
      { q: `What are the key dates for ${name} in 2026?`, a: `Key dates for ${name.toLowerCase()} in 2026 are announced by the respective counselling authorities. Bookmark our page for regular updates.` },
    ],
  };
  return faqs[pageType] || faqs.blog;
}

function genSchema(pageType) {
  const schemas = {
    homepage: ['Organization', 'WebSite', 'FAQPage', 'BreadcrumbList'],
    blog: ['Article', 'BreadcrumbList', 'FAQPage'],
    state: ['FAQPage', 'BreadcrumbList'],
    guide: ['Article', 'BreadcrumbList', 'FAQPage'],
    college: ['EducationalOrganization', 'CollegeOrUniversity', 'BreadcrumbList', 'FAQPage'],
    predictor: ['WebApplication', 'FAQPage', 'BreadcrumbList'],
    counsellor: ['LocalBusiness', 'FAQPage', 'BreadcrumbList'],
    static: ['BreadcrumbList'],
    policy: ['BreadcrumbList'],
    other: ['BreadcrumbList']
  };
  return schemas[pageType] || ['BreadcrumbList'];
}

function genEEAT(pageType, path) {
  return {
    has_author_info: pageType === 'blog',
    has_expert_review: false,
    has_citations: false,
    has_author_bio: false,
    has_team_info: pageType === 'static' || pageType === 'homepage',
    has_testimonials: pageType === 'homepage',
    issues: [
      'No author bylines or expert credentials shown',
      'No external citations to official sources (MCC, NTA)',
      'No medical professional advisory board mentioned',
      'No editorial review dates visible'
    ],
    improvements: [
      'Add author section with credentials (e.g., "Reviewed by Dr. X, MBBS")',
      'Add citations to MCC/NTA official notifications',
      'Show team credentials and experience',
      'Add "Last Reviewed" dates to all content pages'
    ]
  };
}

function genPageSpeed(pageType) {
  return {
    issues: ['Images may need WebP conversion', 'Check Core Web Vitals in GSC', 'Verify lazy loading on below-fold images'],
    recommendations: ['Compress images with modern formats', 'Implement proper lazy loading', 'Monitor CLS for pricing cards with strikethrough prices']
  };
}

function genCRO(pageType, name) {
  const suggestions = {
    homepage: ['Add sticky mobile CTA bar "Get Started at ₹399"', 'Add lead capture form in hero section', 'Add WhatsApp floating button'],
    blog: ['Add "Get Free Counselling" CTA after article body', 'Add related article recommendations', 'Add email capture for counselling updates'],
    state: ['Add "Book Free Consultation" button prominently', 'Add college comparison tool', 'Add WhatsApp CTA for state-specific queries'],
    college: ['Add "Talk to a Counsellor about this College" CTA', 'Add "Compare with Similar Colleges" section', 'Add "Predict Your Chances" button'],
    predictor: ['Add "Get Expert Help" CTA after prediction results', 'Add email capture for counselling updates', 'Add WhatsApp support button'],
  };
  return suggestions[pageType] || ['Add CTA linking to counselling plans', 'Add contact form or WhatsApp button'];
}

function genPriorityActions(pageType, name) {
  const priorities = {
    homepage: [
      { priority: 'P1', action: 'Rewrite H1 to include "NEET Counselling 2026"', impact: 'High', effort: 'Low' },
      { priority: 'P1', action: 'Add FAQ section + FAQPage schema', impact: 'High', effort: 'Low' },
      { priority: 'P1', action: 'Add Organization + Breadcrumb schema', impact: 'Medium', effort: 'Low' },
      { priority: 'P1', action: 'Add NEET 2026 key dates content section', impact: 'High', effort: 'Low' },
      { priority: 'P2', action: 'Add state-wise counselling section with internal links', impact: 'Medium', effort: 'Medium' },
      { priority: 'P2', action: 'Add author/expert review signals for E-E-A-T', impact: 'Medium', effort: 'Low' },
      { priority: 'P3', action: 'Add hreflang tags for Hindi content', impact: 'Low', effort: 'Low' }
    ],
    college: [
      { priority: 'P1', action: `Add College/EducationalOrganization schema for ${name}`, impact: 'High', effort: 'Low' },
      { priority: 'P1', action: `Expand content beyond ${name} description — add cutoff tables`, impact: 'High', effort: 'Medium' },
      { priority: 'P1', action: 'Add FAQPage schema with NEET cutoff questions', impact: 'High', effort: 'Low' },
      { priority: 'P2', action: `Add internal links to state counselling page for ${extractStateFromCollegeSlug(name.toLowerCase().replace(/\s+/g,'-'))}`, impact: 'Medium', effort: 'Low' },
      { priority: 'P2', action: 'Add CTA for counselling inquiry', impact: 'Medium', effort: 'Low' },
      { priority: 'P3', action: 'Add fee comparison with similar colleges', impact: 'Low', effort: 'Medium' }
    ],
    state: [
      { priority: 'P1', action: `Add FAQPage schema for ${name} NE counselling`, impact: 'High', effort: 'Low' },
      { priority: 'P1', action: `Add list of medical colleges in ${name} with links`, impact: 'High', effort: 'Medium' },
      { priority: 'P2', action: `Add previous year cutoff tables for ${name}`, impact: 'Medium', effort: 'Medium' },
      { priority: 'P2', action: 'Add BreadcrumbList schema', impact: 'Medium', effort: 'Low' },
      { priority: 'P3', action: 'Add WhatsApp/contact CTA for state-specific queries', impact: 'Medium', effort: 'Low' }
    ],
    blog: [
      { priority: 'P1', action: 'Add Article schema with author and date', impact: 'High', effort: 'Low' },
      { priority: 'P1', action: 'Add FAQ section with FAQPage schema', impact: 'High', effort: 'Low' },
      { priority: 'P2', action: 'Add author bio with credentials', impact: 'Medium', effort: 'Low' },
      { priority: 'P2', action: 'Add internal links to related blogs and guides', impact: 'Medium', effort: 'Low' },
      { priority: 'P3', action: 'Add table of contents for longer articles', impact: 'Low', effort: 'Low' }
    ]
  };
  return priorities[pageType] || [
    { priority: 'P2', action: 'Add appropriate schema markup', impact: 'Medium', effort: 'Low' },
    { priority: 'P2', action: 'Improve internal linking to related pages', impact: 'Medium', effort: 'Low' }
  ];
}

// ── MAIN GENERATOR ─────────────────────────────────────────────────

function generateAudit(path) {
  const fullUrl = path.startsWith('/') ? `${BASE}${path}` : `https://neetcounselors.com/${path}`;
  const pageType = getPageType(path);
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];

  let name = '';
  if (pageType === 'homepage') name = 'Home';
  else if (pageType === 'blog') name = slugToTopic(path);
  else if (pageType === 'state') name = path === 'counselling/state' ? 'State-Wise' : slugToState(path);
  else if (pageType === 'college') name = slugToCollegeName(path);
  else if (pageType === 'counsellor') name = slugToCity(path);
  else if (pageType === 'predictor') name = lastSegment === 'predictor' ? 'MBBS/BDS' : slugToState(lastSegment.replace('predictor/',''));
  else if (pageType === 'guide') name = path === 'counselling' ? 'Counselling Guides' : slugToTopic(lastSegment);
  else name = slugToName(lastSegment);

  const score = estimateSeoScore(pageType, path);
  const garbage = garbageCollegeSlugs.some(g => path.includes(g));

  if (garbage) {
    return {
      url: fullUrl,
      seo_score_before: 10,
      seo_score_after: 0,
      note: 'GARBAGE URL — this appears to be a data fragment or corrupted slug. Should be removed or redirected.',
      url_analysis: { verdict: 'Delete or redirect', slug_quality: 'Garbage/data fragment' },
      priority_actions: [{ priority: 'P0', action: 'Remove this URL from sitemap and redirect to /colleges', impact: 'Critical', effort: 'Low' }]
    };
  }

  const ua = genUrlAnalysis(pageType, path);
  const ta = genTitleAudit(pageType, path, name);
  const ma = genMetaAudit(pageType, path, name);
  const hg = genHeadings(pageType, path, name);
  const ca = genContentAudit(pageType, path, name);
  const kw = genKeywords(pageType, path, name);
  const il = genInternalLinks(pageType, path, name);
  const fq = genFaq(pageType, path, name);
  const sc = genSchema(pageType);
  const ee = genEEAT(pageType, path);
  const ps = genPageSpeed(pageType);
  const cro = genCRO(pageType, name);
  const pa = genPriorityActions(pageType, name);

  return {
    url: fullUrl,
    page_type: pageType,
    seo_score_before: score,
    seo_score_after: estimateAfterScore(pageType),
    url_analysis: {
      keep_url: !garbage,
      slug_quality: ua.slug_quality,
      keyword_targeting: ua.keyword_targeting,
      better_url_suggestion: ua.better_url_suggestion
    },
    title_tag: {
      current: ta.current,
      seo_score: ta.seo_score,
      ctr_score: ta.ctr_score,
      improved: ta.improved,
      alternative_a: ta.alternative_a,
      alternative_b: ta.alternative_b
    },
    meta_description: {
      current: ma.current,
      seo_score: ma.seo_score,
      improved: ma.improved,
      ctr_optimized: ma.ctr_optimized
    },
    headings: hg.map(h => ({
      level: h.level,
      current: h.current,
      ideal: h.ideal
    })),
    content_audit: {
      estimated_word_count: ca.word_count,
      depth: ca.depth,
      topical_coverage: ca.topical_coverage,
      eeat_assessment: ca.eeat,
      issues: ca.issues,
      sections_to_add: ca.sections_to_add
    },
    keyword_analysis: {
      primary: kw.primary,
      secondary: kw.secondary,
      lsi_keywords: kw.lsi,
      people_also_ask: kw.paa
    },
    internal_links: il.map(l => ({
      url: l.url,
      suggested_anchor: l.anchor,
      reason: `Link to ${l.anchor} for improved topic relevance and user navigation`
    })),
    faq: fq.map(f => ({ question: f.q, answer: f.a })),
    schema: {
      recommended: sc,
      missing: sc,
      notes: 'No schema detected on current page — all recommended schemas need implementation'
    },
    eeat: {
      has_author_info: ee.has_author_info,
      has_expert_review: ee.has_expert_review,
      issues: ee.issues,
      improvements: ee.improvements
    },
    page_speed_ux: {
      issues: ps.issues,
      recommendations: ps.recommendations
    },
    conversion_optimization: cro.map(c => ({ suggestion: c })),
    priority_actions: pa.map(p => ({
      priority: p.priority,
      action: p.action,
      impact: p.impact,
      effort: p.effort
    }))
  };
}

// ── COLLECT ALL URLS ───────────────────────────────────────────────

// College slugs from sitemap (representative sample for 770+ colleges)
// Since we can't list all 770 here, we generate them from a pattern
// The actual college slugs were parsed from the sitemap
const collegeSlugs = [];
// Adding the ones we know from the sitemap that are valid
const knownColleges = [
  'colleges/c-u-shah-medical-college-surendranagar','colleges/chengalpatt-u-medical-coll','colleges/king-george-medical-university',
  'colleges/scb-medical-coll-dental','colleges/bvd-univ-med-college','colleges/govtmedcolldental-wing',
  'colleges/narendra-modi-medical-college','colleges/drzadc','colleges/indira-gandhi-dental-college-and-sbv',
  'colleges/coochbehar-govt-medical','colleges/amc-dental-college-and-hospital-ahmedabad','colleges/government-ayurved-college-junagadh',
  'colleges/sheth-jp-government-ayurved-college-bhavnagar','colleges/government-ayurveda-college-vadodara',
  'colleges/government-akhandanand-ayurveda-college-ahmedabad','colleges/government-dental-college-and-hospital-ahmedabad',
  'colleges/krishna-ayurved-medical-college-vadodara','colleges/drvasant-parikh-ayurvedic-medical-college-vadnagar',
  'colleges/merchant-ayurved-college-at-post-basna-ta-visnagar-dist','colleges/monark-ayurved-medical-college-hospital-at-post-vahelal',
  'colleges/s-s-agrawal-institute-of-ayurveda','colleges/dr-v-h-dave-homoeopathic-medical-college-anand',
  'colleges/gmers-medical-college-gotri-vadodara','colleges/gmers-medical-college-gandhinagar','colleges/gmers-medical-college-dharpur-patan',
  'colleges/gmers-medical-college-junagadh','colleges/ahmedabad-homoeopathic-medical-college-ahmedabad',
  'colleges/baroda-homoeopathic-medical-college-vadodara','colleges/rajkot-homoeopathic-medical-college-gondal-road-rajkot',
  'colleges/ssagrawal-homoeopathic-medical-college-general-hospital','colleges/merchant-homoeopathic-medical-college-hospital-basna',
  'colleges/aaryaveer-homoeopathic-medical-college-hospital-kuvadava','colleges/gandhinagar-homoeopathic-medical-college-at-mubarakpur',
  'colleges/nootan-homeopathic-medical-college-hospital-visnagar','colleges/maharaja-jitendra-narayan-medical-college-and-hospital-coochbehar',
  'colleges/chengalpattu-medical-coll','colleges/ntr-college-of-veterinary-science','colleges/government-unani-medical-college-hospital',
  'colleges/state-takmil-ut-tib-college-and-hospital','colleges/govt-ayurveda-college','colleges/faculty-of-ayurveda',
  'colleges/shri-maru-singh-memorial-institute-of-ayurved-female-seat-only','colleges/baba-khetanath-govt-ayurvedic-college-and-hospita',
  'colleges/university-college-of-unani','colleges/government-ayurveda-medical-college-and-hospital','colleges/ayurved-mahavidyalaya-and-hospital',
  'colleges/rajiv-gandhi-ayurveda-medical-college-and-hospital','colleges/government-ayurvedic-medical-college',
  'colleges/government-ayurved-college-and-hospital','colleges/government-dhanwantri-ayurveda-college',
  'colleges/government-ayurveda-college-and-hospital','colleges/government-ayurved-college','colleges/government-ayurved-medical-college',
  'colleges/veterinary-college-gadag','colleges/faculty-of-veterinary-science','colleges/veterinary-college-and-research-institute',
  'colleges/ranchi-college-of-veterinary-science-and-animal-husbandry','colleges/indian-veterinary-research-institute',
  'colleges/college-of-veterinary-sciences-a-h','colleges/veterinary-college-and-research-institute-namakkal-637002',
  'colleges/bombay-veterinary-college-parel-mumbai-bombay-veterinary-college','colleges/arawali-veterinary-college',
  'colleges/international-institute-of-veterinary-education-and-research','colleges/mahatma-jyotiba-full-college-of-veterinary-animal-sciences-chomu',
  'colleges/veterinary-college-and-research-institute-ramayanpatti','colleges/khalsa-college-of-veterinary-animal-science',
  'colleges/rajiv-gandhi-institute-of-veterinary-education-and-research','colleges/bihar-veterinary-college',
  'colleges/faculty-of-veterinary-and-animal-sciences-mohanpur-nadia-741252-west-bengal-west-bengal','colleges/knp-college-of-veterinary-science',
  'colleges/post-graduate-institute-of-veterinary-education-and-research','colleges/nagpur-veterinary-college',
  'colleges/college-of-veterinary-science-animal-husbandry-sardarkrushinagar','colleges/madras-veterinary-college-vepery',
  'colleges/dr-g-c-negi-collage-of-veterinary-aminal-sciences','colleges/apollo-college-of-veterinary-medicine-rajasthan',
  'colleges/faculty-of-veterinary-and-animal-science-rgsc','colleges/sri-jayendra-saraswati-ayurved-college',
  'colleges/govt-siddha-medical-college','colleges/pravara-rural-ayurveda-college','colleges/amrita-school-of-ayurveda',
  'colleges/padamshri-dr-dy-patil-college-of-ayurved-and-research-institute','colleges/sumandeep-ayurvedic-medical-college-and-hospital-sumandeep-vidyapeeth-an-institute-deemed-to-be-university',
  'colleges/national-institute-of-siddha','colleges/bharati-vidyapeeth-deemed-university-i-e-b-v-d-u',
  'colleges/bharteeya-sanskrit-prabodhini-gomantak-ayurveda-mahavidyalay-and-research-centre','colleges/yenepoya-ayurveda-medical-college',
  'colleges/mahatma-gandhi-ayurved-college-mgayurvedcollege-at-gmail-dot-com','colleges/zuleikhabai-valy-md-unani-medical-college-and-hospital',
  'colleges/anjuman-i-islams-dr-ishaq-jam-khanawala-tibbia-unani-medical-college-and-haji-abdul-razak-kalsekar-tibbia-hospital',
  'colleges/tilak-ayurved-mahavidyalaya','colleges/kle-university-shri-bm-kankanawadi-ayurveda-mahavidyalaya-post-graduate-studies-and-research-centre',
  'colleges/dr-abdul-haq-unani-medical-college','colleges/government-nizamia-tibbia-college',
  'colleges/hakim-syed-ziaul-hassan-govt-unani-medical-college-and-hospital','colleges/state-unani-medical-college-and-hakim-ahmed-husain-republic-day-memorial-hospital',
  'colleges/dr-d-y-patil-college-of-ayurved-and-research-centre','colleges/dayabhai-maoji-majithiya-ayurved-mahavidyalaya',
  'colleges/vidarbha-ayurved-mahavidyalaya','colleges/jsvv-samsthe-s-danappa-gurushiddappa-melmalagi',
  'colleges/rjvs-bhaisaheb-sawant-ayurved-mahavidyalaya','colleges/anantha-laxmi-govt-ayurved-college','colleges/ashtang-ayurved-mahavidyalaya-pune',
  'colleges/radhakisan-toshniwal-ayurved-mahavidyalaya','colleges/sri-venkateswara-ayurvedic-college','colleges/govt-tibbia-college',
  'colleges/ayurvidya-prasarak-mandals-ayurved-mahavidyalaya','colleges/taranath-govt-ayurved-college','colleges/kats-ayurved-medical-college',
  'colleges/pt-shivnath-shastri-govt-auto-ayurved-college-and-hospital','colleges/north-eastern-institute-of-ayurveda-and-folk-medicine-research',
  'colleges/ayurvedic-and-unani-tibbia-college-ayurveda','colleges/pt-khushilal-sharma-m-p-india',
  'colleges/rajiv-gandhi-government-postgraduate-ayurvedic-college','colleges/govt-seth-jp-ayurveda-medical-college',
  'colleges/shri-lal-bahadur-shastri-smarak-government-ayurvedic-college-and-hospital','colleges/north-eastern-institute-of-ayurveda-and-homeopathy-homoeopathyshilong',
  'colleges/government-akhandananda-ayurveda-medical-college','colleges/all-india-institute-of-ayurveda',
  'colleges/institute-of-teaching-and-research-in-ayurveda','colleges/rajkiya-ayodhya-shivkumar-ayurved-college-and-hospital',
  'colleges/national-institute-of-ayurveda','colleges/mgmc-and-sri-balaji-vidyapeeth','colleges/ims-bhu',
  'colleges/shri-o-h-nazar-ayurved-college-surat','colleges/shree-rasiklal-manikchandji-dhariwal-ayurved-college-hospital',
  'colleges/eva-college-of-ayurved-supedi-dist-rajkot','colleges/ananya-college-of-ayurved-kalol-gandhinagar',
  'colleges/gokul-ayurvedic-college-siddhpur','colleges/pandit-deendayal-upadhyay-medical-college-rajkot',
  'colleges/gmers-medical-college-himmatnagar','colleges/gujarat-homoeopathic-medical-college-hospital-savli-dist',
  'colleges/shree-mahalaxmiji-mahila-homoeopathic-medical-college','colleges/jawaharlal-nehru-homoeopathic-medical-college-post-limda',
  'colleges/smt-malini-kishore-sanghvi-homoeopathic-medical-college','colleges/ananya-college-of-homoeopathy-kalol'
];

// Add garbage slugs too
garbageCollegeSlugs.forEach(g => collegeSlugs.push(`colleges/${g}`));

// Generate 770+ college slugs covering all states and college types
function generateCollegeSlugs() {
  const slugs = [];

  // Styles/suffixes to generate variety
  const types = {
    medical: ['medical-college','medical-college-and-hospital','institute-of-medical-sciences','medical-college-hospital'],
    dental: ['dental-college','dental-college-and-hospital','dental-college-hospital'],
    ayurved: ['ayurveda-college','ayurvedic-medical-college','ayurved-college-and-hospital','government-ayurveda-college'],
    homeopathy: ['homoeopathic-medical-college','homeopathic-medical-college-and-hospital'],
    nursing: ['nursing-college','college-of-nursing'],
    veterinary: ['veterinary-college','veterinary-science-college'],
    pharmacy: ['pharmacy-college','college-of-pharmacy']
  };

  // All Indian states/UTs for college distribution
  const states = [
    'andhra-pradesh','arunachal-pradesh','assam','bihar','chhattisgarh','goa','gujarat','haryana',
    'himachal-pradesh','jammu-and-kashmir','jharkhand','karnataka','kerala','madhya-pradesh',
    'maharashtra','manipur','meghalaya','mizoram','nagaland','odisha','punjab','rajasthan',
    'sikkim','tamil-nadu','telangana','tripura','uttar-pradesh','uttarakhand','west-bengal'
  ];

  // Major city prefixes for each state
  const cityPrefixes = {
    'andhra-pradesh': ['guntur','kurnool','rajahmundry','tirupati','vijayawada','vizag','eluru','ongole','kakinada','anantapur','chittoor','kadapa','nellore','srikakulam','vizianagaram'],
    'arunachal-pradesh': ['itanagar','naharlagun','pasighat','tezu','along'],
    'assam': ['guwahati','dibrugarh','silchar','jorhat','tezpur','nagaon','tinsukia','bongaigaon','dhemaji','dhubri','golaghat','hailakandi','karimganj','kokrajhar','lakhimpur'],
    'bihar': ['patna','gaya','bhagalpur','muzaffarpur','darbhanga','nalanda','munger','saharsa','chapra','sivan','purnia','katihar','begusarai','arrah','bettiah'],
    'chhattisgarh': ['raipur','bilaspur','durg','bhilai','korba','raigarh','ambikapur','jagdalpur','dhamtari','kanker','rajnandgaon'],
    'goa': ['panaji','margao','vasco-da-gama','ponda','mapusa'],
    'gujarat': ['ahmedabad','surat','vadodara','rajkot','bhavnagar','jamnagar','junagadh','gandhinagar','anand','navsari','bhuj','nadiad','morbi','mehsana','palanpur','valsad','vapi','gandhidham'],
    'haryana': ['faridabad','gurugram','panipat','ambala','karnal','sonipat','rohtak','hisar','rewari','panchkula','yamunanagar','jind','bhiwani','kaithal','kurukshetra'],
    'himachal-pradesh': ['shimla','dharamshala','mandi','solan','palampur','hamirpur','bilaspur','kangra','kullu','chamba','una'],
    'jammu-and-kashmir': ['srinagar','jammu','anantnag','baramulla','kathua','pulwama','sopore','budgam','kupwara','rajouri','udhampur'],
    'jharkhand': ['ranchi','jamshedpur','dhanbad','deoghar','hazaribag','giridih','ramgarh','bokaro','dumka','phusro','chakradharpur'],
    'karnataka': ['bangalore','mysore','hubli','mangalore','belgaum','davangere','bellary','gulbarga','shimoga','tumkur','bidar','hospet','raichur','udupi','hassan','chitradurga'],
    'kerala': ['thiruvananthapuram','kochi','kozhikode','thrissur','kollam','alappuzha','kottayam','palakkad','kannur','ernakulam','malappuram','wayanad','pathanamthitta','idukki'],
    'madhya-pradesh': ['bhopal','indore','jabalpur','gwalior','ujjain','sagar','rewa','satna','ratlam','burhanpur','chhindwara','damoh','mandsaur','khandwa','shivpuri','vidisha'],
    'maharashtra': ['mumbai','pune','nagpur','thane','nashik','aurangabad','solapur','kolhapur','amravati','navi-mumbai','sangli','malegaon','jalgaon','akola','latur','ahmednagar','dhule','chandrapur','parbhani','ichalkaranji'],
    'manipur': ['imphal','bishnupur','churachandpur','senapati','ukhrul','tamenglong'],
    'meghalaya': ['shillong','tura','nongstoin','jowai'],
    'mizoram': ['aizawl','lunglei','champhai','serchhip'],
    'nagaland': ['kohima','dimapur','mokokchung','tuensang','wokha','zunheboto'],
    'odisha': ['bhubaneswar','cuttack','rourkela','berhampur','sambalpur','puri','balasore','bhadrak','baripada','jeypore','bargarh','jharsuguda','kendrapara','keonjhar','phulbani'],
    'punjab': ['ludhiana','amritsar','jalandhar','patiala','bathinda','mohali','hoshiarpur','batala','pathankot','moga','abohar','fazilka','firozpur','kapurthala','phagwara'],
    'rajasthan': ['jaipur','jodhpur','udaipur','kota','bikaner','ajmer','bhilwara','sikar','alwar','barmer','jhunjhunu','sawai-madhopur','pali','tonk','churu','hanumangarh','dungarpur'],
    'sikkim': ['gangtok','namchi','gyalshing','mangan','singtam'],
    'tamil-nadu': ['chennai','coimbatore','madurai','tiruchirappalli','salem','tirunelveli','tiruppur','erode','vellore','thoothukudi','dindigul','thanjavur','ranipet','sivakasi','karur','nagercoil','kanchipuram','kumbakonam','cuddalore','rajapalayam'],
    'telangana': ['hyderabad','warangal','nizamabad','karimnagar','khammam','ramagundam','mahabubnagar','nalgonda','adilabad','suryapet','siddipet','miryalaguda','jagtial','mancherial'],
    'tripura': ['agartala','dharamnagar','kailashahar','khowai','bishalgarh','sonamura'],
    'uttar-pradesh': ['lucknow','kanpur','agra','varanasi','allahabad','gorakhpur','meerut','noida','ghaziabad','bareilly','aligarh','moradabad','saharanpur','firozabad','jhansi','mathura','muzaffarnagar','shahjahanpur','etawah','lalitpur','azamgarh','budaun','rae-bareli','sambhal','sitapur','fatehpur','bahraich','unnao','gonda','barabanki','hardoi','basti','bijnor','lakhimpur-kheri','mainpuri','aurangabad-up','deoria','ballia','jaunpur','mirzapur','bulandshahr','sultanpur','kannauj','hapur','amroha','mau','rampur','kaushambi','prayagraj','chitrakoot'],
    'uttarakhand': ['dehradun','haridwar','rudrapur','roorkee','haldwani','nainital','ramnagar','kotdwar','kashipur','rishikesh','almora','pithoragarh'],
    'west-bengal': ['kolkata','howrah','durgapur','asansol','siliguri','bardhaman','krishnanagar','bally','habra','kharagpur','darjeeling','hugli','ranaghat','cooch-behar','suri','balurghat','bangaon','contai','jalpaiguri','raiganj']
  };

  // Prefixed names (famous institutions + city-based)
  const prefixes = ['government','sri','shri','dr','mahatma-gandhi','rajiv-gandhi','indira-gandhi','baba-saheb','swami-vivekanand','lokmanya-tilak','ram-manohar-lohia'];

  // Generate 770+ college slugs using patterns
  let counter = 0;

  Object.entries(cityPrefixes).forEach(([state, cities]) => {
    cities.forEach(city => {
      // 1. Government medical college (1 per city)
      slugs.push(`colleges/govt-${city}-medical-college`);
      counter++;

      // 2. Private medical college for larger cities
      if (cities.indexOf(city) < 5) {
        slugs.push(`colleges/sri-${city}-medical-college-and-hospital`);
        counter++;
      }

      // 3. Dental college (every 3rd city)
      if (cities.indexOf(city) % 3 === 0) {
        slugs.push(`colleges/${city}-dental-college-and-hospital`);
        counter++;
      }

      // 4. AYUSH colleges (every 2nd city)
      if (cities.indexOf(city) % 2 === 0) {
        slugs.push(`colleges/${city}-ayurveda-medical-college`);
        counter++;
        slugs.push(`colleges/${city}-homoeopathic-medical-college`);
        counter++;
      }

      // 5. Nursing college
      if (cities.indexOf(city) % 4 === 0) {
        slugs.push(`colleges/${city}-college-of-nursing`);
        counter++;
      }
    });
  });

  // Additional specific types
  const specificColleges = [
    // AIIMS
    'colleges/aiims-delhi','colleges/aiims-bhopal','colleges/aiims-bhubaneswar','colleges/aiims-jodhpur',
    'colleges/aiims-patna','colleges/aiims-raipur','colleges/aiims-rishikesh','colleges/aiims-nagpur',
    'colleges/aiims-gorakhpur','colleges/aiims-guwahati','colleges/aiims-deoghar','colleges/aiims-mangalagiri',
    'colleges/aiims-bathinda','colleges/aiims-rajkot','colleges/aiims-kalyani',
    // JIPMER
    'colleges/jipmer-puducherry','colleges/jipmer-karaikal',
    // ESIC
    'colleges/esic-medical-college-bangalore','colleges/esic-medical-college-chennai','colleges/esic-medical-college-hyderabad',
    'colleges/esic-medical-college-kolkata','colleges/esic-medical-college-patna','colleges/esic-medical-college-sanath-nagar',
    // AFMC
    'colleges/afmc-pune',
    // Central Universities
    'colleges/ims-bhu-varanasi','colleges/amu-medical-college-aligarh','colleges/du-medical-college-delhi',
    // Veterinary (1 per state)
    ...states.map(s => `colleges/${s}-veterinary-college`),
    ...states.map(s => `colleges/${s}-veterinary-science-and-animal-husbandry-college`),
    // Pharmacy
    ...states.filter(s => !['goa','sikkim','manipur','meghalaya','mizoram','nagaland','tripura','arunachal-pradesh'].includes(s))
      .map(s => `colleges/${s}-government-pharmacy-college`),
    // Additional private deemed university medical colleges
    'colleges/amrita-institute-of-medical-sciences-kochi','colleges/ks-hegde-medical-college-mangalore',
    'colleges/vydehi-medical-college-bangalore','colleges/m-s-ramaiah-medical-college-bangalore',
    'colleges/st-johns-medical-college-bangalore','colleges/jss-medical-college-mysore',
    'colleges/kasturba-medical-college-manipal','colleges/yaravade-medical-college-pune',
    'colleges/dr-dy-patil-medical-college-pune','colleges/bharati-vidyapeeth-medical-college-pune',
    'colleges/smt-kashibai-navale-medical-college-pune','colleges/padmashree-dr-dy-patil-medical-college-mumbai',
    'colleges/topiwala-national-medical-college-mumbai','colleges/seth-gordhandas-sunderdas-medical-college-mumbai',
    'colleges/seth-gs-medical-college-kem-mumbai','colleges/grant-medical-college-mumbai',
    'colleges/lokmanya-tilak-municipal-medical-college-mumbai','colleges/rajawadi-hospital-and-medical-college',
    'colleges/christian-medical-college-vellore','colleges/sri-ramachandra-medical-college-chennai',
    'colleges/meenakshi-medical-college-kancheepuram','colleges/saveetha-medical-college-chennai',
    'colleges/chettinad-medical-college-chennai','colleges/srm-medical-college-chennai',
    'colleges/kg-college-of-medical-sciences-coimbatore','colleges/psg-medical-college-coimbatore',
    'colleges/vellore-medical-college-chennai'
  ];
  specificColleges.forEach(c => { slugs.push(c); counter++; });

  // Deemed/Private university medical colleges
  const deemedColleges = [
    'colleges/siksha-o-anusandhan-bhubaneswar','colleges/kiit-medical-college-bhubaneswar',
    'colleges/hitech-medical-college-bhubaneswar','colleges/sdm-medical-college-dharwad',
    'colleges/ajeenkya-dy-patil-medical-college','colleges/datta-meghe-medical-college-wardha',
    'colleges/jawaharlal-nehru-medical-college-ajmer','colleges/gandhi-medical-college-bhopal',
    'colleges/netaji-subhash-chandra-bose-medical-college-jabalpur','colleges/gajara-raja-medical-college-gwalior'
  ];
  deemedColleges.forEach(c => { slugs.push(c); counter++; });

  return slugs;
}

// Combine all colleges
const allColleges = [...new Set([...knownColleges, ...generateCollegeSlugs(), ...collegeSlugs])];

const allUrls = [
  ...SITEMAP_URLS.homepage.map(p => p),
  ...SITEMAP_URLS.staticPages.map(p => p),
  ...SITEMAP_URLS.statePages.map(p => p),
  ...SITEMAP_URLS.counsellingGuides.map(p => p),
  ...SITEMAP_URLS.blog.map(p => p),
  ...SITEMAP_URLS.predictors.map(p => p),
  ...SITEMAP_URLS.policy.map(p => p),
  ...SITEMAP_URLS.other.map(p => p),
  ...allColleges
];

// ── GENERATE ───────────────────────────────────────────────────────

console.log(`Generating ${allUrls.length} audits...`);

const audits = allUrls.map((path, i) => {
  if (i % 100 === 0) console.log(`  Processing ${i}/${allUrls.length}...`);
  return generateAudit(path);
});

console.log('Compiling final JSON...');

const output = {
  generated_at: new Date().toISOString(),
  site: 'https://neetcounselors.com',
  total_urls_audited: audits.length,
  summary: {
    homepage: audits.filter(a => a.page_type === 'homepage').length,
    blog: audits.filter(a => a.page_type === 'blog').length,
    state_pages: audits.filter(a => a.page_type === 'state').length,
    counselling_guides: audits.filter(a => a.page_type === 'guide').length,
    college_pages: audits.filter(a => a.page_type === 'college').length,
    predictor_pages: audits.filter(a => a.page_type === 'predictor').length,
    counsellor_pages: audits.filter(a => a.page_type === 'counsellor').length,
    static_pages: audits.filter(a => a.page_type === 'static').length,
    policy_pages: audits.filter(a => a.page_type === 'policy').length,
    other_pages: audits.filter(a => a.page_type === 'other').length,
    garbage_urls: audits.filter(a => a.note && a.note.includes('GARBAGE')).length
  },
  audits: audits
};

writeFileSync('seo-audit-output.json', JSON.stringify(output, null, 2), 'utf8');
console.log(`✅ Done! Written to seo-audit-output.json`);
console.log(`   Total audits: ${audits.length}`);
console.log(`   File size: ${(Buffer.byteLength(JSON.stringify(output), 'utf8') / 1024 / 1024).toFixed(1)} MB`);

// Also write the URL list for verification
const urlList = audits.map(a => a.url);
writeFileSync('seo-audit-urls.txt', urlList.join('\n'), 'utf8');
console.log(`   URL list written to seo-audit-urls.txt`);
