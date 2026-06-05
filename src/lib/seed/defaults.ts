import type { Payload } from 'payload'

/**
 * Seeds Header and Footer globals with defaults on first run.
 * Only writes if the navigation array is empty (no admin data yet).
 */
export async function seedDefaultGlobals(payload: Payload): Promise<void> {
  // ── Header ──────────────────────────────────────────────────────
  try {
    const header = await payload.findGlobal({ slug: 'header' })

    if (!header.navigation || header.navigation.length === 0) {
      await payload.updateGlobal({
        slug: 'header',
        data: {
          hindiTitle: 'नीट काउंसलिंग',
          englishTitle: 'NEET Counselling',
          tagline: 'Expert NEET and JOSAA Counselling Services',
          navigation: [
            { label: 'Home', link: '/' },
            { label: 'Blog', link: '/blog' },
            { label: 'Videos', link: '/videos' },
            { label: 'Counsellors', link: '/counsellors' },
            { label: 'Helpdesk', link: '/helpdesk' },
            { label: 'About', link: '/about' },
            { label: 'Contact', link: '/contact' },
            { label: 'Login', link: '/login' },
            { label: 'Sign Up', link: '/signup' },
            { label: 'My Plan', link: '/my-plan' },
            { label: 'Dashboard', link: '/admin' },
            { label: 'Logout', link: '/logout' },
          ],
          ctaButton: { text: 'Sign Up', link: '/signup' },
        },
      })
      payload.logger.info('Seeded default header navigation')
    }
  } catch (e) {
    payload.logger.warn('Could not seed header navigation: ' + e)
  }

  // ── Footer ──────────────────────────────────────────────────────
  try {
    const footer = await payload.findGlobal({ slug: 'footer' })

    if (!footer.columns || footer.columns.length === 0) {
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
      payload.logger.info('Seeded default footer')
    }
  } catch (e) {
    payload.logger.warn('Could not seed footer: ' + e)
  }
}
