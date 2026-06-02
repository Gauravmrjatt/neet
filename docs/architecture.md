# NEET Counselling Platform - Architecture

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.6 |
| CMS | Payload CMS | 3.85.0 |
| Database | MongoDB (Mongoose) | @payloadcms/db-mongodb 3.85.0 |
| UI Library | React | 19.2.6 |
| Language | TypeScript | 5.7.3 |
| Styling | Tailwind CSS + shadcn/ui | TBD |
| Rich Text | Lexical | @payloadcms/richtext-lexical 3.85.0 |
| Testing | Vitest + Playwright | 4.0.18 / 1.58.2 |
| Package Manager | pnpm | ^9 / ^10 |
| Runtime | Node.js | ^18.20.2 / >=20.9.0 |

---

## Project Folder Structure

```
neet/
├── docs/
│   └── architecture.md              # This file
├── src/
│   ├── app/
│   │   ├── (frontend)/              # Public-facing pages (route group, no layout wrapper)
│   │   │   ├── layout.tsx           # Root layout: Navbar + Footer + global providers
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── styles.css           # Frontend-specific styles
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx         # Blog listing page
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx     # Individual blog post
│   │   │   ├── videos/
│   │   │   │   └── page.tsx         # Video listing / library
│   │   │   ├── about/
│   │   │   │   └── page.tsx         # About page
│   │   │   ├── contact/
│   │   │   │   └── page.tsx         # Contact form page
│   │   │   ├── helpdesk/
│   │   │   │   └── page.tsx         # Help / FAQ page
│   │   │   ├── counsellors/
│   │   │   │   └── page.tsx         # Counsellor directory
│   │   │   ├── josaa-counsellor/
│   │   │   │   └── page.tsx         # JOSAA counsellor specific page
│   │   │   └── live-counselling/
│   │   │       └── page.tsx         # Live counselling sessions
│   │   ├── (auth)/                  # Authentication routes
│   │   │   └── login/
│   │   │       └── page.tsx         # Login page
│   │   ├── (payload)/               # Payload CMS admin (existing, DO NOT MODIFY)
│   │   │   ├── admin/
│   │   │   │   └── [[...segments]]/
│   │   │   │       └── page.tsx
│   │   │   ├── api/
│   │   │   │   └── [...slug]/
│   │   │   │       └── route.ts
│   │   │   ├── custom.scss
│   │   │   └── layout.tsx
│   │   └── my-route/                # Existing custom route (DO NOT MODIFY)
│   ├── collections/                 # Payload CMS collections
│   │   ├── Users.ts                 # Users collection (existing)
│   │   ├── Media.ts                 # Media collection (existing)
│   │   ├── Blogs.ts                 # Blogs collection (existing)
│   │   ├── Pricing.ts               # Pricing collection (existing)
│   │   ├── Videos.ts                # Video content (NEW)
│   │   ├── Counsellors.ts           # Counsellor profiles (NEW)
│   │   ├── CounsellingSlots.ts      # Counselling session slots (NEW)
│   │   ├── Pages.ts                 # Dynamic pages with blocks (NEW)
│   │   ├── FAQs.ts                  # FAQ entries (NEW)
│   │   ├── Testimonials.ts          # Student testimonials (NEW)
│   │   └── Contacts.ts              # Contact form submissions (NEW)
│   ├── globals/                     # Payload CMS globals (site-wide singletons)
│   │   └── index.ts                 # Exports: SiteSettings, HeaderNav, FooterNav
│   ├── blocks/                      # Payload CMS block configs (reusable content blocks)
│   │   └── index.ts                 # Exports all block configs
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives (Button, Card, Input, etc.)
│   │   │   └── index.ts
│   │   ├── layout/                  # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   ├── blocks/                  # Block renderer components (map CMS blocks to React)
│   │   │   └── index.ts
│   │   └── shared/                  # Shared components (CTA, SectionHeader, etc.)
│   │       └── index.ts
│   ├── lib/
│   │   ├── utils.ts                 # General utilities (cn helper, formatters)
│   │   ├── constants.ts             # App-wide constants (nav links, site metadata)
│   │   └── queries/                 # Payload CMS query functions (server-side data fetching)
│   │       └── index.ts
│   ├── hooks/                       # Custom React hooks
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css              # Global Tailwind + custom styles
│   ├── payload.config.ts            # Payload CMS configuration (existing)
│   └── payload-types.ts             # Auto-generated Payload types (existing)
├── tests/
│   ├── e2e/                         # Playwright end-to-end tests
│   └── int/                         # Vitest integration tests
├── public/                          # Static assets
├── docker-compose.yml               # Docker setup (existing)
├── Dockerfile                       # App Dockerfile (existing)
├── next.config.ts                   # Next.js config (existing)
├── tsconfig.json                    # TypeScript config (existing)
├── eslint.config.mjs                # ESLint config (existing)
├── vitest.config.mts                # Vitest config (existing)
├── playwright.config.ts             # Playwright config (existing)
└── package.json                     # Dependencies (existing)
```

---

## Dependency Map

### Core Dependencies (existing)

```
payload 3.85.0
  ├── @payloadcms/next 3.85.0
  ├── @payloadcms/db-mongodb 3.85.0
  ├── @payloadcms/richtext-lexical 3.85.0
  ├── @payloadcms/ui 3.85.0
  └── sharp 0.34.2

next 16.2.6
  ├── react 19.2.6
  └── react-dom 19.2.6

Supporting
  ├── graphql ^16.8.1
  ├── dotenv 16.4.7
  └── cross-env ^7.0.3
```

### Recommended Additions

| Package | Purpose |
|---------|---------|
| `tailwindcss` + `@tailwindcss/postcss` | Utility-first CSS |
| `@shadcn/ui` (manual setup) | Accessible component primitives |
| `lucide-react` | Icon library |
| `zod` | Schema validation |
| `react-hook-form` + `@hookform/resolvers` | Form handling |
| `framer-motion` | Animations |
| `next-sitemap` | SEO sitemap generation |
| `@vercel/analytics` | Analytics |
| `nodemailer` | Email (contact form, notifications) |

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | MongoDB connection string | `mongodb://127.0.0.1/neet` |
| `PAYLOAD_SECRET` | Yes | Secret key for Payload CMS | `your-secret-key-min-32-chars` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL | `https://neetcounselling.in` |
| `PAYLOAD_PUBLIC_SITE_URL` | Yes | Site URL accessible server-side | `https://neetcounselling.in` |
| `SMTP_HOST` | No | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | No | Email SMTP port | `587` |
| `SMTP_USER` | No | Email SMTP username | `noreply@neetcounselling.in` |
| `SMTP_PASS` | No | Email SMTP password | `app-specific-password` |
| `CRON_SECRET` | No | Secret for Payload cron jobs | `cron-secret-key` |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics ID | `G-XXXXXXXXXX` |

---

## Coding Standards

### File Naming

- **Components**: PascalCase (`Navbar.tsx`, `BlogCard.tsx`)
- **Utilities/lib**: camelCase (`utils.ts`, `formatDate.ts`)
- **Collections**: PascalCase matching slug (`Blogs.ts`, `Counsellors.ts`)
- **Pages**: always `page.tsx` (Next.js convention)
- **Layouts**: always `layout.tsx`
- **Route handlers**: always `route.ts`

### Component Patterns

- Server Components by default; add `'use client'` only when needed (interactivity, hooks, browser APIs)
- Payload query functions live in `src/lib/queries/` and are called from Server Components
- Block renderer components in `src/components/blocks/` map CMS block types to React components
- UI primitives from shadcn go in `src/components/ui/`
- Shared components (used across multiple pages) go in `src/components/shared/`

### Payload CMS Conventions

- Each collection gets its own file in `src/collections/`
- Block configs go in `src/blocks/` and are referenced by collections/pages
- Globals (site settings, nav config) go in `src/globals/`
- All Payload types are auto-generated to `src/payload-types.ts`

### Import Aliases

Configured in `tsconfig.json`:
- `@/*` → `./src/*`
- `@payload-config` → `./src/payload.config.ts`

### Code Style

- **Formatter**: Prettier (`.prettierrc.json` exists)
- **Linter**: ESLint with `eslint-config-next`
- **TypeScript**: Strict mode enabled
- **No comments** in code unless explicitly requested

---

## Data Flow

```
Browser → Next.js App Router (Server Component)
  → src/lib/queries/*.ts (Payload local API)
    → MongoDB via @payloadcms/db-mongodb
  → Server Component renders HTML
  → Client Components hydrate for interactivity
```

### Payload CMS Admin Flow

```
Browser → /admin/* → Payload Admin UI
  → Payload REST/GraphQL API
    → MongoDB
```

---

## Key Architecture Decisions

1. **Route Groups**: `(frontend)` for public pages, `(payload)` for admin, `(auth)` for authentication
2. **Payload Local API**: Use `getPayload()` + `payload.find()`/`payload.findByID()` in Server Components for data fetching — no REST calls needed
3. **Block-based Pages**: The `Pages` collection uses Payload's blocks field for flexible page building
4. **No API Routes for Frontend**: Frontend pages fetch data server-side via Payload's local API; no custom API routes needed for basic CRUD
5. **MongoDB**: Document-based storage suitable for content-heavy sites with flexible schemas
