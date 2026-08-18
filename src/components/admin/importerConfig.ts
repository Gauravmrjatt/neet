export type ImporterSelect = {
  field: string
  apiPath: string
  label: string
}

export type ImporterConfig = {
  apiSlug: string
  entityNoun: string
  prompt: string
  jsonExample: string
  requiredFields: string[]
  h1BlockTypes: string[]
  hasDrafts: boolean
  requireSelect?: ImporterSelect
}

type PromptParts = {
  entityNoun: string
  basicFields: string
  blocks: string
  h1Rule: string
  h1RuleLong: string
  example: string
}

function buildPrompt(parts: PromptParts): string {
  return `You are an SEO content writer for NEET counselling (medical admissions in India). Generate a complete Payload CMS ${parts.entityNoun} entry in JSON format.

## Target Topic
[PASTE YOUR TOPIC HERE]

## Collection Schema
The ${parts.entityNoun} has these fields:

### Basic Fields
${parts.basicFields}

### Blocks (content array)
Available block types (choose 1-4):
${parts.blocks}

### SEO Group
- metaTitle (text) — 50-60 chars, include the target keyword, end with "| NEET Counselling 2025"
- metaDescription (textarea) — 150-160 chars, start with the primary keyword, include the year, end with a CTA
- keywords — array of objects: [{"keyword": "..."}, {"keyword": "..."}, ...] — 5-10 long-tail and short-tail NEET counselling keywords
- noIndex (boolean) — always false

## SEO Rules
1. Primary keyword in: metaTitle, metaDescription, and the single H1 (${parts.h1Rule})
2. Meta title format: "[Primary Keyword] | NEET Counselling 2025"
3. Meta description: start with primary keyword, include year, end with CTA
4. Keywords: mix head terms, long-tail, and related terms
5. Tone: target Indian parents and students (class 12 / droppers)
6. SINGLE-H1 RULE: ${parts.h1RuleLong}
7. Do not fabricate specific dates, ranks, fees, or statistics. Use general phrasing (e.g. "typically begins in July") unless the target topic provides exact facts.
8. Write substantive, helpful content (600-1200 words across the chosen blocks).

## Output Format
Respond ONLY with valid JSON. Example shape:

${parts.example}

Do NOT include any explanation, markdown code fences, or any text outside the JSON object. Output ONLY the JSON.`
}

const PAGES_PROMPT = buildPrompt({
  entityNoun: 'page',
  basicFields: `- title (text, required) — the H1/page title
- slug (text, required, unique) — auto-generate from title: lowercase, hyphens, no special chars
- status (select: "draft" or "published") — set "published" (the import panel can save as draft instead)`,
  blocks: `1. **hero** (use at most once — it is the page's only H1)
   - heading (text, required) — the H1; must include the primary keyword
   - subheading (textarea)
   - ctaText (text)
   - ctaLink (text)
2. **contentBlock** — rich text content section
   - heading (text) — render as H2
   - body (skip — set to empty string "")
3. **features** — feature grid
   - heading (text) — render as H2
   - items[] (array):
     - title (text, required)
     - description (textarea)
4. **testimonials**
   - heading (text) — render as H2
   - testimonials[] (array):
     - name (text, required)
     - quote (textarea, required)
     - designation (text)
5. **cta**
   - heading (text, required) — render as H2
   - description (textarea)
   - buttonText (text, required)
   - buttonLink (text, required) — internal path starting with "/" (e.g. "/contact", "/pricing")`,
  h1Rule: 'the hero block heading',
  h1RuleLong:
    'The page has EXACTLY ONE H1 — the hero block heading. All other headings (contentBlock, features, testimonials, cta) must be H2/H3 subheadings and must not repeat the H1 text verbatim.',
  example: `{
  "title": "NEET Counselling 2025: Complete Guide for Tamil Nadu Students",
  "slug": "neet-counselling-2025-tamil-nadu-guide",
  "status": "published",
  "content": [
    {
      "blockType": "hero",
      "heading": "NEET Counselling 2025: Complete Guide for Tamil Nadu Students",
      "subheading": "Everything you need to know about TN NEET counselling 2025 — registration, merit list, seat allotment, and more.",
      "ctaText": "Get Expert Guidance",
      "ctaLink": "/contact"
    },
    {
      "blockType": "features",
      "heading": "Key Dates for TN NEET Counselling 2025",
      "items": [
        { "title": "Registration Starts", "description": "July 2025" },
        { "title": "Merit List Release", "description": "August 2025" },
        { "title": "Choice Filling", "description": "August 2025" }
      ]
    },
    {
      "blockType": "cta",
      "heading": "Need Help with NEET Counselling?",
      "description": "Our experts guide you through every step of the counselling process.",
      "buttonText": "Book a Free Session",
      "buttonLink": "/contact"
    }
  ],
  "seo": {
    "metaTitle": "NEET Counselling 2025 Tamil Nadu — Complete Guide | NEET",
    "metaDescription": "Complete guide to NEET counselling 2025 for Tamil Nadu students. Learn about registration, merit list, choice filling, and seat allotment. Get expert guidance now.",
    "keywords": [
      { "keyword": "NEET counselling 2025" },
      { "keyword": "TN NEET counselling" },
      { "keyword": "NEET seat allotment 2025" }
    ],
    "noIndex": false
  }
}`,
})

const BLOGS_PROMPT = buildPrompt({
  entityNoun: 'blog post',
  basicFields: `- title (text, required) — the article title, rendered as the single H1
- slug (text, required, unique) — auto-generate from title: lowercase, hyphens, no special chars
- status (select: "draft" or "published") — set "published" (the import panel can save as draft instead)
- excerpt (textarea) — 1-2 sentence summary for cards and search results
- content (richText) — skip; set to empty string ""
- categories — array of objects: [{"category": "..."}, {"category": "..."}] (e.g. "NEET Counselling", "Cutoff", "Choice Filling")`,
  blocks: `1. **contentBlock** — rich text content section
   - heading (text) — render as H2
   - body (skip — set to empty string "")
2. **quoteBlock**
   - quote (textarea, required)
   - author (text)
   - style (select: "default" | "highlight" | "border") — use "default"
3. **faqBlock**
   - title (text) — render as H2
   - items[] (array):
     - question (text, required)
     - answer (textarea, required)
4. **ctaBlock**
   - heading (text, required) — render as H2
   - description (textarea)
   - buttonText (text, required)
   - buttonLink (text, required) — internal path starting with "/"
5. **alertBlock**
   - content (text, required) — short important notice
   - type (select: "info" | "warning" | "success" | "error") — use "info"
6. **features** — feature grid
   - heading (text) — render as H2
   - items[] (array):
     - title (text, required)
     - description (textarea)

Do NOT use imageBlock, videoBlock, savedContentBlock, or relatedPostsBlock (they require media uploads or relationships).`,
  h1Rule: 'the title field',
  h1RuleLong:
    'The blog post has EXACTLY ONE H1 — the title field, rendered by the page template. All block headings (contentBlock, faqBlock, ctaBlock, features, quoteBlock, alertBlock) must be H2/H3 subheadings and must not repeat the title verbatim.',
  example: `{
  "title": "NEET Counselling 2025: Step-by-Step Guide to MCC Registration",
  "slug": "neet-counselling-2025-mcc-registration-guide",
  "status": "published",
  "excerpt": "A complete step-by-step guide to NEET counselling 2025 — from MCC registration to choice filling and seat allotment.",
  "content": "",
  "categories": [{ "category": "NEET Counselling" }],
  "blocks": [
    {
      "blockType": "contentBlock",
      "heading": "What is MCC Counselling?",
      "body": ""
    },
    {
      "blockType": "faqBlock",
      "title": "Frequently Asked Questions",
      "items": [
        { "question": "When does NEET counselling 2025 start?", "answer": "MCC counselling typically begins within a few weeks of the NEET result declaration." }
      ]
    },
    {
      "blockType": "ctaBlock",
      "heading": "Get Personalised Counselling Help",
      "description": "Our experts help you shortlist colleges and fill choices the right way.",
      "buttonText": "Talk to an Expert",
      "buttonLink": "/contact"
    }
  ],
  "seo": {
    "metaTitle": "NEET Counselling 2025 MCC Registration Guide | NEET",
    "metaDescription": "Step-by-step NEET counselling 2025 guide: MCC registration, choice filling, and seat allotment explained for students and parents. Get expert help now.",
    "keywords": [
      { "keyword": "NEET counselling 2025" },
      { "keyword": "MCC registration" },
      { "keyword": "NEET choice filling" }
    ],
    "noIndex": false
  }
}`,
})

const COUNSELLING_PROMPT = buildPrompt({
  entityNoun: 'counselling guide',
  basicFields: `- title (text, required) — the guide title, rendered as the single H1
- slug (text, required, unique) — auto-generate from title: lowercase, hyphens, no special chars
- status (select: "draft" or "published") — set "published" (the import panel can save as draft instead)
- excerpt (textarea) — 1-2 sentence summary
- content (richText) — skip; set to empty string ""
- category (select, required) — one of: "ug-counselling" (NEET UG Counselling), "pg-counselling" (NEET PG Counselling), "state-counselling" (State Counselling), "abroad" (MBBS Abroad), "guide" (Guides & Tips)`,
  blocks: `1. **contentBlock** — rich text content section
   - heading (text) — render as H2
   - body (skip — set to empty string "")
2. **faqBlock**
   - title (text) — render as H2
   - items[] (array):
     - question (text, required)
     - answer (textarea, required)
3. **ctaBlock**
   - heading (text, required) — render as H2
   - description (textarea)
   - buttonText (text, required)
   - buttonLink (text, required) — internal path starting with "/"
4. **features** — feature grid
   - heading (text) — render as H2
   - items[] (array):
     - title (text, required)
     - description (textarea)
5. **comparisonTable**
   - heading (text) — render as H2
   - rows[] (array):
     - label (text, required)
     - columnA (text)
     - columnB (text)
     - columnC (text)

Do NOT use imageBlock, savedContentBlock, or relatedPostsBlock (they require media uploads or relationships).`,
  h1Rule: 'the title field',
  h1RuleLong:
    'The guide has EXACTLY ONE H1 — the title field, rendered by the page template. All block headings (contentBlock, faqBlock, ctaBlock, features, comparisonTable) must be H2/H3 subheadings and must not repeat the title verbatim.',
  example: `{
  "title": "NEET UG Counselling 2025: Complete Guide for Maharashtra Students",
  "slug": "neet-ug-counselling-2025-maharashtra-guide",
  "status": "published",
  "excerpt": "Everything about NEET UG counselling 2025 for Maharashtra — registration, merit list, choice filling, and state quota seats.",
  "content": "",
  "category": "state-counselling",
  "blocks": [
    {
      "blockType": "contentBlock",
      "heading": "How Does State Quota Counselling Work?",
      "body": ""
    },
    {
      "blockType": "features",
      "heading": "Key Documents Required",
      "items": [
        { "title": "Class 12 Marksheet", "description": "Original plus photocopies" },
        { "title": "NEET Admit Card", "description": "2025 admit card copy" }
      ]
    },
    {
      "blockType": "ctaBlock",
      "heading": "Confused About Your Options?",
      "description": "Get one-on-one guidance from expert counsellors.",
      "buttonText": "Book a Free Session",
      "buttonLink": "/contact"
    }
  ],
  "seo": {
    "metaTitle": "NEET UG Counselling 2025 Maharashtra Guide | NEET",
    "metaDescription": "Complete NEET UG counselling 2025 guide for Maharashtra students — registration, merit list, choice filling, and state quota seats explained. Get expert help now.",
    "keywords": [
      { "keyword": "NEET UG counselling 2025" },
      { "keyword": "Maharashtra NEET counselling" },
      { "keyword": "state quota seats" }
    ],
    "noIndex": false
  }
}`,
})

const DISTRICT_CONTENT_PROMPT = buildPrompt({
  entityNoun: 'district content entry',
  basicFields: `- district (relationship to districts) — REQUIRED but cannot be generated: leave it out of the JSON and choose the district in the import panel dropdown
- type (select, required) — one of: "neet-counselling", "mbbs-admission", "government-medical-colleges", "private-medical-colleges", "cutoff", "fees", "documents-required", "choice-filling", "seat-matrix", "mcc-counselling", "state-counselling", "expected-cutoff", "all-medical-colleges", "important-dates", "faq", "news", "updates"
- status (select: "draft" or "published") — set "published" (the import panel can save as draft instead)`,
  blocks: `1. **contentBlock** — rich text content section
   - heading (text) — render as H2
   - body (skip — set to empty string "")
2. **faqBlock**
   - title (text) — render as H2
   - items[] (array):
     - question (text, required)
     - answer (textarea, required)
3. **comparisonTable**
   - heading (text) — render as H2
   - rows[] (array):
     - label (text, required)
     - columnA (text)
     - columnB (text)
     - columnC (text)
4. **ctaBlock**
   - heading (text, required) — render as H2
   - description (textarea)
   - buttonText (text, required)
   - buttonLink (text, required) — internal path starting with "/"`,
  h1Rule: 'the page heading rendered by the template (content type + district name)',
  h1RuleLong:
    'The page has EXACTLY ONE H1 — rendered by the template from the content type and district name. All block headings (contentBlock, faqBlock, comparisonTable, ctaBlock) must be H2/H3 subheadings and must not repeat the H1 text verbatim.',
  example: `{
  "type": "neet-counselling",
  "status": "published",
  "blocks": [
    {
      "blockType": "contentBlock",
      "heading": "NEET Counselling Process for This District",
      "body": ""
    },
    {
      "blockType": "faqBlock",
      "title": "Frequently Asked Questions",
      "items": [
        { "question": "Which colleges are near this district?", "answer": "Local government and private medical colleges are listed on the college pages of this site." }
      ]
    },
    {
      "blockType": "ctaBlock",
      "heading": "Need Personal Guidance?",
      "description": "Talk to an expert counsellor about your options.",
      "buttonText": "Get Free Guidance",
      "buttonLink": "/contact"
    }
  ],
  "seo": {
    "metaTitle": "NEET Counselling in [District] 2025 | NEET",
    "metaDescription": "NEET counselling 2025 for students from [District] — colleges nearby, documents required, and the counselling process explained. Get expert guidance now.",
    "keywords": [
      { "keyword": "NEET counselling 2025" },
      { "keyword": "medical colleges near [District]" },
      { "keyword": "NEET counselling documents" }
    ],
    "noIndex": false
  }
}`,
})

export const IMPORTER_CONFIGS: Record<string, ImporterConfig> = {
  pages: {
    apiSlug: 'pages',
    entityNoun: 'page',
    prompt: PAGES_PROMPT,
    jsonExample: exampleFromPrompt(PAGES_PROMPT),
    requiredFields: ['title'],
    h1BlockTypes: ['hero'],
    hasDrafts: true,
  },
  blogs: {
    apiSlug: 'blogs',
    entityNoun: 'blog post',
    prompt: BLOGS_PROMPT,
    jsonExample: exampleFromPrompt(BLOGS_PROMPT),
    requiredFields: ['title'],
    h1BlockTypes: [],
    hasDrafts: true,
  },
  counselling: {
    apiSlug: 'counselling',
    entityNoun: 'counselling guide',
    prompt: COUNSELLING_PROMPT,
    jsonExample: exampleFromPrompt(COUNSELLING_PROMPT),
    requiredFields: ['title'],
    h1BlockTypes: [],
    hasDrafts: true,
  },
  'district-content': {
    apiSlug: 'district-content',
    entityNoun: 'district content entry',
    prompt: DISTRICT_CONTENT_PROMPT,
    jsonExample: exampleFromPrompt(DISTRICT_CONTENT_PROMPT),
    requiredFields: ['type'],
    h1BlockTypes: [],
    hasDrafts: false,
    requireSelect: {
      field: 'district',
      apiPath: '/api/districts?limit=1000&sort=name',
      label: 'District',
    },
  },
}

function exampleFromPrompt(prompt: string): string {
  const startMarker = 'Example shape:\n\n'
  const endMarker = '\n\nDo NOT include any explanation'
  const start = prompt.indexOf(startMarker)
  const end = prompt.indexOf(endMarker, start)
  if (start === -1 || end === -1) return ''
  return prompt.slice(start + startMarker.length, end).trimEnd()
}
