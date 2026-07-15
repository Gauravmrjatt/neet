import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { convertHTMLToLexical } from '@payloadcms/richtext-lexical'
import { editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

function stripImgTags(html: string): string {
  return html.replace(/<img[^>]*>/gi, '')
}

export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.PUBLISH_API_KEY) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      title,
      htmlContent,
      excerpt,
      featuredImage,
      contentImages,
      categories,
      publishedAt,
      status = 'published',
    } = body

    if (!title || !htmlContent) {
      return NextResponse.json(
        { error: 'title and htmlContent are required' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    let slug = slugify(title)
    const existing = await payload.find({
      collection: 'blogs',
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
    })
    if (existing.docs.length > 0) {
      slug = `${slug}-${Date.now()}`
    }

    const editorConfig = await editorConfigFactory.fromEditor({
      editor: payload.config.editor as any,
      config: payload.config,
    })

    const cleanHtml = stripImgTags(htmlContent)
    const lexicalContent = convertHTMLToLexical({
      editorConfig,
      html: cleanHtml,
      JSDOM,
    })

    const blocks: any[] = []
    if (contentImages && Array.isArray(contentImages)) {
      for (const imgId of contentImages) {
        if (imgId) {
          blocks.push({
            blockType: 'imageBlock',
            image: imgId,
            alignment: 'center',
          })
        }
      }
    }

    const categoriesArray = categories
      ? (Array.isArray(categories)
          ? categories.map((c: string) => ({ category: c }))
          : [{ category: categories }])
      : undefined

    const blog = await payload.create({
      collection: 'blogs',
      data: {
        title,
        slug,
        excerpt: excerpt || undefined,
        content: lexicalContent,
        blocks: blocks.length > 0 ? blocks : undefined,
        featuredImage: featuredImage || undefined,
        categories: categoriesArray,
        status,
        publishedAt: publishedAt || new Date().toISOString(),
      },
    })

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://neetcounselors.com'

    return NextResponse.json(
      {
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        url: `${siteUrl}/blog/${blog.slug}`,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('publish-blog error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 },
    )
  }
}
