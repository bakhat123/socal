import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  try {
    const { locale } = params
    
    // Get blogs directly from MongoDB (primary source)
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected for blogs')
      
      const blogs = await db.collection('blogs')
        .find({ 
          language: locale,
          status: 'Published' // Only published blogs
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
      
      if (blogs && blogs.length > 0) {
        console.log(`✅ Returning ${blogs.length} blogs from database for locale: ${locale}`)
        return NextResponse.json(blogs)
      }
      
      // If no blogs found for this locale, try English as fallback
      if (locale !== 'en') {
        console.log(`⚠️ No blogs found for locale ${locale}, trying English fallback`)
        const englishBlogs = await db.collection('blogs')
          .find({ 
            language: 'en',
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
        
        if (englishBlogs && englishBlogs.length > 0) {
          console.log(`✅ Returning ${englishBlogs.length} English blogs as fallback`)
          return NextResponse.json(englishBlogs)
        }
      }
      
      console.log('⚠️ No blogs found in database, returning empty array')
      return NextResponse.json([])
      
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Cannot fetch blogs without database connection' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error reading blogs by locale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


