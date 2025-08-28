import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/contact called')
    
    // Get locale from query parameters
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    console.log('🌍 Requested locale:', locale)
    
    // First try to get data from MongoDB (restore original working flow)
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected')
      
      const contactData = await db.collection('contact').findOne({ locale })
      
      if (contactData) {
        console.log('✅ Returning data from database for locale:', locale)
        const { _id, ...cleanContactData } = contactData // Remove _id field
        return NextResponse.json(cleanContactData)
      }
    } catch (dbError) {
      console.log('⚠️ Database not available, falling back to JSON file:', dbError)
    }

    // Fallback to JSON file based on locale
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'contact', locale, 'contact.json')
    if (fs.existsSync(jsonPath)) {
      console.log('✅ Returning data from JSON file for locale:', locale)
      const jsonData = fs.readFileSync(jsonPath, 'utf8')
      return NextResponse.json(JSON.parse(jsonData))
    }

    // Fallback to English if requested locale doesn't exist
    if (locale !== 'en') {
      const englishPath = path.join(process.cwd(), 'src', 'data', 'contact', 'en', 'contact.json')
      if (fs.existsSync(englishPath)) {
        console.log('⚠️ Locale not found, falling back to English')
        const jsonData = fs.readFileSync(englishPath, 'utf8')
        return NextResponse.json(JSON.parse(jsonData))
      }
    }



    // Return default structure if no data exists
    console.log('✅ Returning default data structure')
    return NextResponse.json({
      hero: {
        profileStatus: "Available Now",
        profileCompany: "eXp of California",
        profileTitle: "Lead of Crown Coastal Concierge",
        profileBadges: {
          topProducer: "Top Producer",
          fiveStarRated: "5-Star Rated"
        },
        recentSales: {
          title: "Recent Sales",
          seeAll: "See All",
          sold: "Sold",
          properties: [
            {
              address: "1234 Ocean View Dr, La Jolla",
              price: "$2,450,000",
              year: "2024"
            },
            {
              address: "5678 Coastal Blvd, Del Mar",
              price: "$1,890,000",
              year: "2024"
            },
            {
              address: "9012 Sunset Cliffs Rd, Point Loma",
              price: "$3,120,000",
              year: "2023"
            },
            {
              address: "3456 Pacific Coast Hwy, Encinitas",
              price: "$2,850,000",
              year: "2023"
            }
          ]
        }
      },
      form: {
        header: {
          badge: "Ready to Connect",
          title: "Contact Crown Coastal Concierge",
          subtitle: "Ready to start your real estate journey? Get in touch today and let's discuss your dream property in San Diego."
        },
        fields: {
          name: {
            label: "Full Name",
            placeholder: "Enter your full name",
            required: "*"
          },
          phone: {
            label: "Phone Number",
            placeholder: "Enter your phone number",
            required: "*"
          },
          email: {
            label: "Email Address",
            placeholder: "Enter your email address",
            required: "*"
          },
          message: {
            label: "Message",
            placeholder: "Tell us about your real estate needs, preferred locations, budget, and any specific requirements...",
            required: "*"
          }
        },
        consent: {
          title: "Privacy & Consent",
          text: "By submitting your information, you agree that the real estate professional identified above may call/text you about your search, which may involve use of automated means and pre-recorded/artificial voices. You don't need to consent as a condition of buying any property, goods, or services. Message/data rates may apply. You also agree to our Terms of Use."
        },
        submit: {
          sending: "Sending Message...",
          send: "Send Message"
        },
        footer: {
          responseTime: "We typically respond within 2 hours during business hours"
        }
      },
      info: {
        description: {
          title: "Get to know Crown Coastal Concierge",
          subtitle: "Real Estate Professional",
          text1: "With a journey that has taken him across 32 countries and over a hundred cities, Reza brings a world of experience and a unique global perspective to San Diego's real estate market. He firmly believes there's no place like San Diego, with its unparalleled coastal lines, vibrant cityscape, and endless adventures.",
          text2: "Utilizing 17 years of client management & negotiation expertise, Reza has perfected the art of understanding his clients' needs and exceeding their expectations. But it's not just about transactions for him. Whether guiding sellers to maximize their home's value or helping buyers find their dream property, Reza's true passion lies in scoring big for his clients.",
          text3: "Beyond real estate, Reza is deeply embedded in the fabric of the San Diego community. He's championed righteous causes through grassroots petitions, actively participated in beach clean-ups, and tirelessly worked to uplift underserved communities via various government-subsidized programs. For Reza, real estate isn't just business—it's a platform to further serve and enrich the community he cherishes most."
        },
        specialties: {
          title: "Specialties",
          tags: [
            "Buyer's Agent",
            "Listing Agent",
            "Relocation",
            "Vacation / Short-term Rentals"
          ],
          languages: "Speaks: English, Arabic, Farsi, Turkish"
        }
      }
    })
  } catch (error) {
    console.error('❌ Error fetching contact data:', error)
    return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 PUT /api/contact called')
    
    const contactData = await request.json()
    console.log('✅ Request body parsed:', JSON.stringify(contactData, null, 2))

    // Get locale from query parameters
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    console.log('🌍 Updating data for locale:', locale)

    // Try to update MongoDB if available
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected')
      
      // Update the contact data for specific locale
      const result = await db.collection('contact').updateOne(
        { locale }, // filter by locale
        { $set: { ...contactData, locale } },
        { upsert: true }
      )
      console.log('✅ Database update result:', result)
    } catch (dbError) {
      console.log('⚠️ Database not available, skipping database update:', dbError)
    }

    // Update the JSON file for the specific locale
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'contact', locale, 'contact.json')
    const { _id, ...contactDataForJson } = contactData // Remove _id field
    
    // Ensure directory exists
    const dir = path.dirname(jsonPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(jsonPath, JSON.stringify(contactDataForJson, null, 2))
    console.log('✅ JSON file updated at:', jsonPath)

    // Set a flag to notify the contact page to refresh
    // Note: This won't work in server-side code, but we'll handle it in the admin panel

    return NextResponse.json({ 
      message: 'Contact data updated successfully',
      locale: locale,
      timestamp: Date.now() // Add timestamp to force cache invalidation
    })
  } catch (error) {
    console.error('❌ Error updating contact data:', error)
    return NextResponse.json({ 
      error: 'Failed to update contact data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
