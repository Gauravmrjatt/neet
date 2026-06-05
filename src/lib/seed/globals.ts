import { getPayload } from 'payload'
import config from '../../payload.config.js'

/**
 * Seeds the Header and Footer globals with default navigation and footer data.
 * Run with: pnpm tsx src/lib/seed/globals.ts
 */
async function seedGlobals() {
  const payload = await getPayload({ config })

  // ── Header: Navigation + CTA ────────────────────────────────────
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navigation: [
        // Public links
        { label: 'Home', link: '/', showWhen: 'always' },
        { label: 'Blog', link: '/blog', showWhen: 'always' },
        { label: 'Videos', link: '/videos', showWhen: 'always' },
        { label: 'Counsellors', link: '/counsellors', showWhen: 'always' },
        { label: 'Helpdesk', link: '/helpdesk', showWhen: 'always' },
        { label: 'About', link: '/about', showWhen: 'always' },
        { label: 'Contact', link: '/contact', showWhen: 'always' },
        // Auth-only links
        { label: 'My Plan', link: '/my-plan', showWhen: 'authenticated' },
        { label: 'Dashboard', link: '/admin', showWhen: 'authenticated' },
        { label: 'Logout', link: '/logout', showWhen: 'authenticated' },
        // Unauth-only links
        { label: 'Login', link: '/login', showWhen: 'unauthenticated' },
        { label: 'Sign Up', link: '/signup', showWhen: 'unauthenticated' },
      ],
      ctaButton: { text: 'Sign Up', link: '/signup' },
    },
  })
  console.log('✅ Header navigation seeded')

  // ── Footer: Columns, Policy Links, Social Links, etc. ───────────
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      description:
        'Expert NEET and JOSAA counselling services to help you secure your dream medical seat.',
      columns: [
        {
          title: 'Services',
          links: [
            { label: 'NEET Counselling', url: '/services/neet' },
            { label: 'JOSAA Counselling', url: '/services/josaa' },
            { label: 'College Predictor', url: '/tools/predictor' },
            { label: 'Rank Analysis', url: '/tools/rank-analysis' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { label: 'Blog', url: '/blog' },
            { label: 'Videos', url: '/videos' },
            { label: 'FAQs', url: '/helpdesk' },
            { label: 'Helpdesk', url: '/helpdesk' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About Us', url: '/about' },
            { label: 'Contact', url: '/contact' },
            { label: 'Counsellors', url: '/counsellors' },
            { label: 'Live Counselling', url: '/live-counselling' },
          ],
        },
      ],
      policyLinks: [
        { label: 'Copyright Policy', url: '/copyright' },
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Hyperlink Policy', url: '/hyperlinks' },
        { label: 'Terms & Conditions', url: '/terms' },
        { label: 'Help', url: '/helpdesk' },
      ],
      socialLinks: [
        { platform: 'facebook', url: '#' },
        { platform: 'twitter', url: '#' },
        { platform: 'instagram', url: '#' },
        { platform: 'youtube', url: '#' },
      ],
      copyright: '© 2025 NEET Counselling. All rights reserved.',
      creditsText: 'Content Owned and Maintained by NEET Counselling',
    },
  })
  console.log('✅ Footer seeded')

  process.exit(0)
}

seedGlobals().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
