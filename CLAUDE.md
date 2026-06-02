# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NEET counselling website — a content-driven site for medical admissions counselling in India. Built with Payload CMS 3.x as a headless CMS integrated into Next.js. Content editors manage pages, blogs, videos, counsellors, helpdesk, and live counselling sessions through the Payload admin panel at `/admin`.

## Commands

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` |
| Dev server (clean) | `pnpm devsafe` (rm -rf .next first) |
| Build | `pnpm build` |
| Production start | `pnpm start` |
| Lint | `pnpm lint` |
| Generate Payload types | `pnpm generate:types` |
| Generate import map | `pnpm generate:importmap` |
| Run all tests | `pnpm test` |
| Integration tests | `pnpm test:int` |
| Single integration test | `pnpm vitest run --config ./vitest.config.mts tests/int/<file>.int.spec.ts` |
| E2E tests | `pnpm test:e2e` |
| Single E2E test | `pnpm exec playwright test --config=playwright.config.ts tests/e2e/<file>.e2e.spec.ts` |

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (standalone output) + Payload CMS 3.85
- **Database**: MongoDB via `@payloadcms/db-mongodb` (Mongoose)
- **Editor**: Lexical (`@payloadcms/richtext-lexical`)
- **Styling**: Tailwind CSS with dark mode (`class` strategy), Radix UI primitives, `class-variance-authority`
- **Package manager**: pnpm (v9/v10)
- **Node**: ^18.20.2 or >=20.9.0

### Route Structure (`src/app/`)
- `(frontend)/` — Public-facing pages: home, about, blog, contact, counsellors, helpdesk, josaa-counsellor, live-counselling, videos
- `(auth)/login` — Login page
- `(payload)/admin` — Payload admin panel
- `(payload)/api` — Payload REST/GraphQL API

### Content Model (`src/collections/`)
Users, Media, Blogs, PricingCards, Videos, Counselors, Helpdesk, LiveCounselling, Pages. Pages uses a blocks-based layout system.

### Global Settings (`src/globals/`)
Header, Footer, SiteSettings, HomePageSEO, NewsTicker — singleton configs editable from the admin panel.

### Blocks (`src/blocks/`)
Reusable page builder blocks: Hero, Content (rich text), FeatureGrid, CTA, CounsellorBlock, FAQBlock, HelpdeskBlock, PricingBlock, RichTextBlock, TestimonialBlock, VideoBlock. Each block is a Payload `Block` config with its own fields.

### Components (`src/components/`)
React components organized by domain: `auth/`, `blocks/` (block renderers), `contact/`, `counsellors/`, `helpdesk/`, `layout/`, `shared/`, `ui/` (shadcn-style primitives).

### Middleware (`src/middleware.ts`)
Guards `/live-counselling` and `/admin/custom` routes — redirects to `/login` if no `payload-token` cookie is present.

### Path Aliases
- `@/*` → `./src/*`
- `@payload-config` → `./src/payload.config.ts`

## Environment Variables

Required in `.env`:
```
DATABASE_URI=mongodb://127.0.0.1/neet
PAYLOAD_SECRET=<random-secret>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Docker

- **Production**: `docker-compose up` — builds the app, runs MongoDB 7, serves on port 3000
- **Development**: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up` — mounts source, enables hot reload, exposes debugger on port 9229

## Testing

- **Integration** (`tests/int/`): Vitest with jsdom environment, setup in `vitest.setup.ts`. Tests use `*.int.spec.ts` naming.
- **E2E** (`tests/e2e/`): Playwright with Chromium, auto-starts dev server. Tests use `*.e2e.spec.ts` naming.
- **Helpers** (`tests/helpers/`): Shared test utilities including `seed.ts` and `seedUser.ts`.

## Regenerating Types

After modifying any collection or global config, run `pnpm generate:types` to update `src/payload-types.ts`. This file is auto-generated — do not edit it manually.
