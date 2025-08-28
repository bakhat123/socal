import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string; slug: string } }
) {
  try {
    const { locale, slug } = params
    
    console.log('API Counties - Received params:', { locale, slug })
    
    // Get county directly from MongoDB (primary source)
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected for county data')
      
      // First try the requested locale
      let countyData = await db.collection('counties').findOne({ 
        slug: slug,
        language: locale 
      })
      
      if (countyData) {
        console.log(`✅ County found in database for locale: ${locale}`)
        const { _id, ...cleanCountyData } = countyData // Remove _id field
        return NextResponse.json(cleanCountyData)
      }
      
      // If not found, try English fallback
      if (locale !== 'en') {
        console.log(`⚠️ County not found for locale ${locale}, trying English fallback`)
        countyData = await db.collection('counties').findOne({ 
          slug: slug,
          language: 'en' 
        })
        
        if (countyData) {
          console.log('✅ County found in English fallback')
          const { _id, ...cleanCountyData } = countyData // Remove _id field
          return NextResponse.json(cleanCountyData)
        }
      }
      
      console.log(`❌ County not found: ${slug} for any locale`)
      return NextResponse.json(
        { error: 'County not found' },
        { status: 404 }
      )
      
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Cannot fetch county data without database connection' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API Counties - Error fetching county data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
