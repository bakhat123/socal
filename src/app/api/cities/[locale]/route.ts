import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  try {
    const { locale } = params
    
    // Get cities directly from MongoDB (primary source)
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected for cities')
      
      const cities = await db.collection('cities')
        .find({ language: locale })
        .project({
          slug: 1,
          name: 1,
          state: 1,
          shortDescription: 1,
          heroImage: 1,
          population: 1,
          avgHomePrice: 1,
          tags: 1,
          neighborhoods: 1,
          county: 1
        })
        .toArray()
      
      if (cities && cities.length > 0) {
        console.log(`✅ Returning ${cities.length} cities from database for locale: ${locale}`)
        return NextResponse.json(cities)
      }
      
      // If no cities found for this locale, try English as fallback
      if (locale !== 'en') {
        console.log(`⚠️ No cities found for locale ${locale}, falling back to English`)
        const englishCities = await db.collection('cities')
          .find({ language: 'en' })
          .project({
            slug: 1,
            name: 1,
            state: 1,
            shortDescription: 1,
            heroImage: 1,
            population: 1,
            avgHomePrice: 1,
            tags: 1,
            neighborhoods: 1,
            county: 1
          })
          .toArray()
        
        if (englishCities && englishCities.length > 0) {
          console.log(`✅ Returning ${englishCities.length} English cities as fallback`)
          return NextResponse.json(englishCities)
        }
      }
      
      console.log('⚠️ No cities found in database, returning empty array')
      return NextResponse.json([])
      
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Cannot fetch cities without database connection' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error reading cities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
