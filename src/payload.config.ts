import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
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
import { Transactions } from './collections/Transactions'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Specializations } from './collections/Specializations'
import { Counselling } from './collections/Counselling'
import { States } from './collections/States'
import { Colleges } from './collections/Colleges'
import { CutoffRecords } from './collections/CutoffRecords'
import { SeatMatrix } from './collections/SeatMatrix'
import { Bonds } from './collections/Bonds'
import { Stipends } from './collections/Stipends'
import { SavedContent } from './collections/SavedContent'
import { Districts } from './collections/Districts'
import { DistrictContent } from './collections/DistrictContent'
import { Tehsils } from './collections/Tehsils'

import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'
import { HomePageSEO } from './globals/HomePageSEO'
import { NewsTicker } from './globals/NewsTicker'
import { AboutPage } from './globals/AboutPage'
import { VideoCategories } from './globals/VideoCategories'
import { Testimonials } from './globals/Testimonials'
import { PredictorPage } from './globals/PredictorPage'
import { PricingPage } from './globals/PricingPage'
import { WhyChooseUs } from './globals/WhyChooseUs'
import { PageSeo } from './globals/PageSeo'

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
    Transactions,
    ContactSubmissions,
    Specializations,
    Counselling,
    States,
    Colleges,
    CutoffRecords,
    SeatMatrix,
    Bonds,
    Stipends,
    SavedContent,
    Districts,
    DistrictContent,
    Tehsils,
  ],
  globals: [Header, Footer, SiteSettings, HomePageSEO, NewsTicker, AboutPage, VideoCategories, Testimonials, PredictorPage, PricingPage, WhyChooseUs, PageSeo],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      EXPERIMENTAL_TableFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || (() => { throw new Error('PAYLOAD_SECRET environment variable is required') })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
