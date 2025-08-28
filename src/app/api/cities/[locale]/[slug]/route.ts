import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string; slug: string } }
) {
  try {
    const { locale, slug } = params
    
    // Get city directly from MongoDB (primary source)
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected for city data')
      
      // First try the requested locale
      let cityData = await db.collection('cities').findOne({ 
        slug: slug,
        language: locale 
      })
      
      if (cityData) {
        console.log(`✅ City found in database for locale: ${locale}`)
        const { _id, ...cleanCityData } = cityData // Remove _id field
        return NextResponse.json(cleanCityData)
      }
      
      // If not found, try English fallback
      if (locale !== 'en') {
        console.log(`⚠️ City not found for locale ${locale}, trying English fallback`)
        cityData = await db.collection('cities').findOne({ 
          slug: slug,
          language: 'en' 
        })
        
        if (cityData) {
          console.log('✅ City found in English fallback')
          const { _id, ...cleanCityData } = cityData // Remove _id field
          return NextResponse.json(cleanCityData)
        }
      }
      
      console.log(`❌ City not found: ${slug} for any locale`)
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
      
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Cannot fetch city data without database connection' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error reading city data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
