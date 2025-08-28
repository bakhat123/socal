import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'


export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const homeData = await db.collection('home').findOne({})
    
    if (!homeData) {
      // Return default structure if no data exists
      return NextResponse.json({
        hero: {
          badge: "Global Luxury Real Estate",
          title: "Exclusive Properties for Discerning Clients",
          subtitle: "With over 20 years of experience, we connect international buyers with the finest properties across the world's most desirable locations.",
          viewProperties: "View Properties",
          contactUs: "Contact Us",
          scrollDown: "Scroll Down"
        },
        stats: {
          yearsExperience: "25+",
          billionInSales: "4.2B",
          countriesServed: "50+",
          clientSatisfaction: "100%"
        },
        services: {
          title: "Our Services",
          subtitle: "Comprehensive real estate solutions tailored to your unique needs.",
          propertyAcquisition: {
            title: "Property Acquisition",
            description: "Our global network and market expertise ensures you find the perfect property that meets all your requirements.",
            icon: "🏡"
          },
          investmentAdvisory: {
            title: "Investment Advisory",
            description: "Strategic guidance to maximize returns on your real estate investments with our data-driven approach.",
            icon: "💰"
          },
          relocationServices: {
            title: "Relocation Services",
            description: "Comprehensive support for international clients moving to new countries, including legal and logistical assistance.",
            icon: "🌎"
          }
        },
        cta: {
          title: "Ready to Find Your Dream Property?",
          text: "Contact our team of experts today for a personalized consultation and begin your journey to finding the perfect home or investment property.",
          button: "Schedule Consultation"
        }
      })
    }

    return NextResponse.json(homeData)
  } catch (error) {
    console.error('Error fetching home data:', error)
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const homeData = await request.json()

    // Upsert the home data (create if doesn't exist, update if exists)
    const result = await db.collection('home').updateOne(
      {}, // empty filter to match any document
      { $set: homeData },
      { upsert: true }
    )

    return NextResponse.json({ 
      message: 'Home data updated successfully',
      _id: result.upsertedId || 'updated'
    })
  } catch (error) {
    console.error('Error updating home data:', error)
    return NextResponse.json({ error: 'Failed to update home data' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const homeData = await request.json()

    // Update the home data
    const result = await db.collection('home').updateOne(
      {}, // empty filter to match any document
      { $set: homeData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'No home data found to update' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Home data updated successfully' })
  } catch (error) {
    console.error('Error updating home data:', error)
    return NextResponse.json({ error: 'Failed to update home data' }, { status: 500 })
  }
}

