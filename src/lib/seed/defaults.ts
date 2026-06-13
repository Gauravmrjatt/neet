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
          tagline: 'Expert NEET and JOSAA Counselling Services',
          navigation: [
            { label: 'Home', link: '/' },
            { label: 'Counselling', link: '/counselling', children: [
              { label: 'All Guides', link: '/counselling' },
              { label: 'State-Wise', link: '/counselling/state' },
              { label: 'College Directory', link: '/colleges' },
              { label: 'FAQs', link: '/faq' },
            ]},
            { label: 'Blog', link: '/blog' },
            { label: 'Videos', link: '/videos' },
            { label: 'Counsellors', link: '/counsellors' },
            { label: 'Live Counselling', link: '/live-counselling' },
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

  // ── Why Choose Us ────────────────────────────────────────────────
  try {
    const wcu = await payload.findGlobal({ slug: 'why-choose-us' })

    if (!wcu.cards || wcu.cards.length === 0) {
      await payload.updateGlobal({
        slug: 'why-choose-us',
        data: {
          badge: 'Why Us',
          heading: 'Why 17,000+ Students Trust Us',
          subheading:
            'NEET Counselling is your one-stop guide for college admissions — made for every student, in every corner of India.',
          cards: [
            {
              icon: 'Target',
              title: 'Personalized Help',
              description:
                "Every student gets a customized counselling plan based on their rank, category, and preferences. We don't believe in one-size-fits-all.",
            },
            {
              icon: 'Users',
              title: 'Expert Counselors',
              description:
                'Our team consists of 50+ experienced counsellors who have guided thousands of students to their dream colleges.',
            },
            {
              icon: 'Clock',
              title: '24x7 Support',
              description:
                "Round-the-clock support via WhatsApp, call, and video sessions. We're always available when you need us.",
            },
            {
              icon: 'BookOpen',
              title: 'Comprehensive Resources',
              description:
                'Access to blog articles, video guides, college predictors, and rank analysis tools to make informed decisions.',
            },
            {
              icon: 'Shield',
              title: 'Proven Track Record',
              description:
                '17,000+ students guided successfully. Our predictions have helped students get into top medical and engineering colleges.',
            },
            {
              icon: 'Headphones',
              title: 'Hindi & English',
              description:
                'Guidance available in both Hindi and English. We understand every student and parent, regardless of language preference.',
            },
          ],
        },
      })
      payload.logger.info('Seeded default why-choose-us cards')
    }
  } catch (e) {
    payload.logger.warn('Could not seed why-choose-us: ' + e)
  }
}
