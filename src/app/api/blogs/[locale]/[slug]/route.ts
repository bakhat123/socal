import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string; slug: string } }
) {
  try {
    const { locale, slug } = params
    
    // Get blog directly from MongoDB (primary source)
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected for blog data')
      
      // First try the requested locale
      let blog = await db.collection('blogs').findOne({ 
        slug: slug,
        language: locale,
        status: 'Published'
      })
      
      if (blog) {
        console.log(`✅ Blog found in database for locale: ${locale}`)
        const { _id, ...cleanBlogData } = blog // Remove _id field
        return NextResponse.json({
          ...cleanBlogData,
          id: blog._id.toString()
        })
      }
      
      // If not found, try English fallback
      if (locale !== 'en') {
        console.log(`⚠️ Blog not found for locale ${locale}, trying English fallback`)
        blog = await db.collection('blogs').findOne({ 
          slug: slug,
          language: 'en',
          status: 'Published'
        })
        
        if (blog) {
          console.log('✅ Blog found in English fallback')
          const { _id, ...cleanBlogData } = blog // Remove _id field
          return NextResponse.json({
            ...cleanBlogData,
            id: blog._id.toString()
          })
        }
      }
      
      console.log(`❌ Blog not found: ${slug} for any locale`)
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
      
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Cannot fetch blog data without database connection' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error reading blog by slug:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
