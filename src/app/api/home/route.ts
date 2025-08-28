import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'

    // Get data directly from MongoDB (primary source)
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected for home data')
      
      const homeData = await db.collection('home').findOne({ locale })
      
      if (homeData) {
        console.log('✅ Returning home data from database for locale:', locale)
        const { _id, ...cleanHomeData } = homeData // Remove _id field
        return NextResponse.json(cleanHomeData)
      }
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Cannot fetch home data without database connection'
      }, { status: 500 })
    }

    // If no data found in MongoDB, return default structure
    console.log('⚠️ No home data found in database for locale:', locale)

    // Final fallback: default structure (English)
    return NextResponse.json({
      hero: {
        badge: 'Premium Destination',
        title: 'Discover the Magic of Southern California',
        subtitle: 'From coastal sanctuaries to vibrant city residences, explore the most desirable locations in the region',
        explore: 'Explore Properties',
        contact: 'Contact Agent'
      },
      stats: {
        yearsExperience: 20,
        billionInSales: 3.2,
        countriesServed: 15,
        clientSatisfaction: 98
      },
      blog: {
        title: 'Latest Insights',
        subtitle: 'Discover our expert perspectives on luxury real estate markets worldwide.'
      },
      testimonials: {
        title: 'What Our Clients Say',
        subtitle: 'Real stories from families who found their dream homes with us',
        items: [
          {
            id: 't1',
            quote:
              'Working with Reza meant to be working with excellency! We had an incredible experience, due to his professionalism, was very knowledgeable, and truly invested his willingness and time in helping us find the place we chose.',
            author: 'Silvia Jacobo',
            rating: 5,
            image: '/clients/client1.png'
          },
          {
            id: 't2',
            quote:
              "Reza Barghlalmeno made buying our home such an incredible experience—one of the best we've had as a family, and I've been through quite a few home purchases in my 80+ years!",
            author: 'Fern Siegel',
            rating: 5,
            image: '/clients/client2.png'
          },
          {
            id: 't3',
            quote:
              'I recently had the pleasure of working with Reza and I cannot speak highly enough of the exceptional experience I had. From start to finish, Reza went above and beyond to ensure that my home buying process was as smooth as possible.',
            author: 'Maxim Gantman',
            rating: 5,
            image: '/clients/client3.png'
          }
        ]
      },
      cta: {
        title: 'Ready to Find Your Dream Property?',
        text: 'Contact our team of experts today for a personalized consultation and begin your journey to finding the perfect home or investment property.',
        button: 'Schedule Consultation'
      }
    })
  } catch (error) {
    console.error('❌ Error fetching home data:', error)
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 PUT /api/home called')
    
    const homeData = await request.json()
    console.log('✅ Request body parsed:', JSON.stringify(homeData, null, 2))

    // Get locale from query parameters
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    console.log('🌍 Updating home data for locale:', locale)

    // Update MongoDB (single source of truth)
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected for home data')
      
      // Update the home data for specific locale
      const result = await db.collection('home').updateOne(
        { locale }, // filter by locale
        { $set: { ...homeData, locale, updatedAt: new Date() } },
        { upsert: true }
      )
      console.log('✅ Database update result:', result)
      
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Cannot update home data without database connection'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Home data updated successfully in database',
      locale: locale,
      timestamp: Date.now(),
      source: 'mongodb'
    })
  } catch (error) {
    console.error('❌ Error updating home data:', error)
    return NextResponse.json({ 
      error: 'Failed to update home data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
