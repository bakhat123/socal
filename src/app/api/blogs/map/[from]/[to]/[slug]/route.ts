import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

async function readBlogs(locale: string) {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection('blogs')
      .find({ 
        language: locale,
        status: 'Published'
      })
      .project({
        id: { $toString: '$_id' },
        slug: 1,
        title: 1,
        subtitle: 1,
        category: 1,
        author: 1,
        date: 1,
        readTime: 1,
        featured: 1,
        heroImage: 1,
        heroImageAlt: 1,
        canonicalUrl: 1,
        language: 1,
        city: 1,
        topic: 1,
        keyword: 1,
        group_id: 1,
        seo: 1,
        hreflang_tags: 1,
        internal_links: 1,
        schema_markup: 1,
        images: 1,
        word_count: 1,
        ctaSection: 1,
        content: 1,
        views: 1,
        likes: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .toArray()
    
    return blogs || []
  } catch (error) {
    console.error('Error reading blogs from database:', error)
    return []
  }
}

export async function GET(
  req: NextRequest,
  {
    params
  }: { params: { from: string; to: string; slug: string } }
) {
  try {
    const { from, to, slug } = params
    const fromBlogs = await readBlogs(from)
    const toBlogs = await readBlogs(to)

    const fromBlog = fromBlogs.find((b: any) => b.slug === slug)
    if (!fromBlog) {
      return NextResponse.json({ slug }, { status: 200 })
    }

    const groupId = fromBlog.group_id
    if (groupId == null) {
      // Fallback: try same slug in target locale
      const sameSlug = toBlogs.find((b: any) => b.slug === slug)
      return NextResponse.json({ slug: sameSlug?.slug || slug }, { status: 200 })
    }

    const target = toBlogs.find((b: any) => b.group_id === groupId)
    if (target) {
      return NextResponse.json({ slug: target.slug }, { status: 200 })
    }

    // Fallback to same slug if no mapping found
    return NextResponse.json({ slug }, { status: 200 })
  } catch (e) {
    console.error('Error mapping blog slug between locales:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


