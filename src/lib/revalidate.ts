import { revalidateTag, revalidatePath } from 'next/cache'

export function revalidateBlogs(slug?: string) {
  revalidateTag('blogs', 'max')
  revalidatePath('/blog')
  revalidatePath('/')
  if (slug) revalidatePath(`/blog/${slug}`)
}

export function revalidateCounselling(slug?: string) {
  revalidateTag('counselling', 'max')
  revalidatePath('/counselling')
  revalidatePath('/counselling/state')
  revalidatePath('/')
  if (slug) revalidatePath(`/counselling/${slug}`)
}

export function revalidateVideos(slug?: string) {
  revalidateTag('videos', 'max')
  revalidatePath('/videos')
  if (slug) revalidatePath(`/videos/${slug}`)
}

export function revalidateColleges(slug?: string) {
  revalidateTag('colleges', 'max')
  revalidatePath('/colleges')
  revalidatePath('/')
  if (slug) revalidatePath(`/colleges/${slug}`)
}

export function revalidateStates(slug?: string) {
  revalidateTag('states', 'max')
  revalidatePath('/counselling/state')
  revalidatePath('/colleges')
  revalidatePath('/')
  if (slug) revalidatePath(`/counselling/state/${slug}`)
}

export function revalidateCounsellors() {
  revalidateTag('counsellors', 'max')
  revalidatePath('/counsellors')
  revalidatePath('/')
}

export function revalidateHelpdesk() {
  revalidateTag('helpdesk', 'max')
  revalidatePath('/helpdesk')
  revalidatePath('/faq')
}

export function revalidateLiveCounselling() {
  revalidateTag('live-counselling', 'max')
  revalidatePath('/live-counselling')
}

export function revalidatePages(slug?: string) {
  revalidateTag('pages', 'max')
  if (slug) revalidatePath(`/${slug}`)
}

export function revalidateGlobals() {
  revalidateTag('globals', 'max')
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/videos')
  revalidatePath('/counselling')
  revalidatePath('/counsellors')
  revalidatePath('/colleges')
  revalidatePath('/helpdesk')
  revalidatePath('/pricing')
  revalidatePath('/about')
  revalidatePath('/contact')
}

export function revalidatePricing() {
  revalidateTag('globals', 'max')
  revalidatePath('/pricing')
  revalidatePath('/')
}

export function revalidateAbout() {
  revalidateTag('globals', 'max')
  revalidatePath('/about')
  revalidatePath('/')
}
