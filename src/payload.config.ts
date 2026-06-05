import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Blogs } from './collections/Blogs'
import { PricingCards } from './collections/PricingCards'
import { Videos } from './collections/Videos'
import { Counselors } from './collections/Counselors'
import { Helpdesk } from './collections/Helpdesk'
import { LiveCounselling } from './collections/LiveCounselling'
import { Pages } from './collections/Pages'
import { Subscriptions } from './collections/Subscriptions'

import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'
import { HomePageSEO } from './globals/HomePageSEO'
import { NewsTicker } from './globals/NewsTicker'
import { AboutPage } from './globals/AboutPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Blogs,
    PricingCards,
    Videos,
    Counselors,
    Helpdesk,
    LiveCounselling,
    Pages,
    Subscriptions,
  ],
  globals: [Header, Footer, SiteSettings, HomePageSEO, NewsTicker, AboutPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
