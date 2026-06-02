import type { GlobalConfig } from 'payload'
import { isAdmin, anyone } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'NEET Counselling',
    },
    {
      name: 'siteNameHindi',
      type: 'text',
      defaultValue: 'नीट काउंसलिंग',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Expert NEET and JOSAA counselling services',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Phone number for call button (e.g., +91-9876543210)',
      },
    },
    {
      name: 'whatsapp',
      type: 'text',
      admin: {
        description: 'WhatsApp number',
      },
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'socialMedia',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      admin: {
        description: 'Trust badge statistics displayed on homepage',
      },
      fields: [
        { name: 'students', type: 'text', defaultValue: '17,000+' },
        { name: 'support', type: 'text', defaultValue: '24x7' },
        { name: 'personalized', type: 'text', defaultValue: '100%' },
        { name: 'counselors', type: 'text', defaultValue: '50+' },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      admin: {
        description: 'Homepage hero section content',
      },
      fields: [
        { name: 'badge', type: 'text', defaultValue: "🇮🇳 India's Best NEET College Predictor" },
        { name: 'heading', type: 'text', defaultValue: 'NEET Counselling 2026 — Predict Your College & Start Expert Guidance' },
        { name: 'priceText', type: 'text', defaultValue: '₹2399/-' },
        { name: 'description', type: 'textarea', defaultValue: 'NEET Counselling — India\'s trusted NEET counselling team for NEET counselling 2026: NEET rank-based college predictor, round-wise predictions, JOSAA & CSAB choice strategy, and counselor support for students and parents.' },
        { name: 'hindiDescription', type: 'text', defaultValue: 'नीट काउंसलिंग — read free JOSAA counseling guides on our blog.' },
        { name: 'primaryCtaText', type: 'text', defaultValue: 'Predict My College' },
        { name: 'primaryCtaLink', type: 'text', defaultValue: '/counsellors' },
        { name: 'secondaryCtaText', type: 'text', defaultValue: 'View Plans' },
        { name: 'secondaryCtaLink', type: 'text', defaultValue: '/pricing' },
      ],
    },
    {
      name: 'topBar',
      type: 'group',
      admin: {
        description: 'Top government branding bar',
      },
      fields: [
        { name: 'leftText', type: 'text', defaultValue: 'भारत सरकार / Government of India' },
        { name: 'rightText', type: 'text', defaultValue: 'शिक्षा मंत्रालय / Ministry of Education' },
      ],
    },
  ],
}
