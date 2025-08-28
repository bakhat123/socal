import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { writeCityFile, deleteCityFileBySlugLanguage, updateIndividualCityFiles } from '@/lib/json-updater'
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || undefined
    console.log('Connecting to database...')
    const { db } = await connectToDatabase()
    console.log('Connected to database successfully')
    
    let query: any = {}
    if (language) {
      if (language === 'en') {
        // Treat missing language as English for legacy docs
        query = { $or: [ { language: 'en' }, { language: { $exists: false } } ] }
      } else {
        query = { language }
      }
    }
    const cities = await db.collection('cities').find(query).toArray()
    console.log('Cities from database:', cities)
    console.log('Number of cities in database:', cities.length)
    
    // If database is empty, return empty array
    if (cities.length === 0) {
      console.log('Database is empty, returning empty array')
      return NextResponse.json([])
    }
    
    return NextResponse.json(cities)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received city data:', body)
    
    // Validate required fields according to new comprehensive schema
    const requiredFields = [
      'slug', 'name', 'state', 'population', 'avgHomePrice', 'shortDescription',
      'tags', 'neighborhoods', 'highlights', 'faqs', 'seo'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }
    
    // Validate highlights structure
    if (!Array.isArray(body.highlights) || body.highlights.length === 0) {
      return NextResponse.json({ 
        error: 'Highlights must be a non-empty array' 
      }, { status: 400 })
    }
    
    for (const highlight of body.highlights) {
      if (!highlight.title || !highlight.description || !highlight.icon || !highlight.bgImage) {
        return NextResponse.json({ 
          error: 'Each highlight must include title, description, icon, and bgImage' 
        }, { status: 400 })
      }
    }
    
    // Validate FAQs structure
    if (!Array.isArray(body.faqs) || body.faqs.length === 0) {
      return NextResponse.json({ 
        error: 'FAQs must be a non-empty array' 
      }, { status: 400 })
    }
    
    for (const faq of body.faqs) {
      if (!faq.question || !faq.answer || !faq.category) {
        return NextResponse.json({ 
          error: 'Each FAQ must include question, answer, and category' 
        }, { status: 400 })
      }
    }
    
    // Clients optional
    if (body.clients) {
      if (!Array.isArray(body.clients)) {
        return NextResponse.json({ error: 'Clients must be an array' }, { status: 400 })
      }
    }
    
    // Validate SEO object
    if (!body.seo.metaTitle || !body.seo.metaDescription) {
      return NextResponse.json({ 
        error: 'SEO object must include metaTitle and metaDescription' 
      }, { status: 400 })
    }
    
    // hreflang_tags optional
    if (body.hreflang_tags && !Array.isArray(body.hreflang_tags)) {
      return NextResponse.json({ error: 'hreflang_tags must be an array' }, { status: 400 })
    }
    
    // schema_markup optional
    if (body.schema_markup && !Array.isArray(body.schema_markup)) {
      return NextResponse.json({ error: 'schema_markup must be an array' }, { status: 400 })
    }
    
    // internal_links optional
    if (body.internal_links && !Array.isArray(body.internal_links)) {
      return NextResponse.json({ error: 'internal_links must be an array' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    console.log('Connected to database')
    
    const cityData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('Inserting city data:', cityData)
    
    const result = await db.collection('cities').insertOne(cityData)
    console.log('City inserted with ID:', result.insertedId)

    // Write per-language per-slug JSON file and update individual city files
    await writeCityFile(cityData)
    await updateIndividualCityFiles()

    return NextResponse.json({ 
      message: 'City created successfully', 
      _id: result.insertedId 
    })
  } catch (error) {
    console.error('Error creating city:', error)
    return NextResponse.json({ 
      error: 'Failed to create city',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, ...updateData } = body
    console.log('Updating city with ID:', _id)

    if (!_id) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    let result

    // Case 1: Try with ObjectId
    if (ObjectId.isValid(_id)) {
      result = await db.collection('cities').updateOne(
        { _id: new ObjectId(_id) },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      )
    }

    // Case 2: If not valid ObjectId OR no match, try with string
    if (!result || result.matchedCount === 0) {
      result = await db.collection('cities').updateOne(
        { _id: _id }, // keep as string
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      )
    }

    if (!result || result.matchedCount === 0) {
      console.error('City not found:', _id)
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    // ✅ Fetch updated city
    const updated = await db.collection('cities').findOne({ 
      _id: ObjectId.isValid(_id) ? new ObjectId(_id) : _id 
    })

    if (updated) {
      await writeCityFile(updated as any)
    }
    await updateIndividualCityFiles()

    return NextResponse.json({ message: 'City updated successfully' })
  } catch (error) {
    console.error('Error updating city:', error)
    return NextResponse.json({ 
      error: 'Failed to update city',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id } = body
    console.log('Deleting city with ID:', _id)
    
    if (!_id) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(_id)) {
      console.error('Invalid ObjectId format:', _id)
      return NextResponse.json({ 
        error: 'Invalid city ID format',
        details: 'The provided ID is not a valid MongoDB ObjectId'
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Find document to get slug/language before delete
    const existing = await db.collection('cities').findOne({ _id: new ObjectId(_id) })
    const result = await db.collection('cities').deleteOne({ _id: new ObjectId(_id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    // Delete per-language file and update individual city files
    if (existing) {
      await deleteCityFileBySlugLanguage(existing.slug, (existing as any).language)
    }
    await updateIndividualCityFiles()

    return NextResponse.json({ message: 'City deleted successfully' })
  } catch (error) {
    console.error('Error deleting city:', error)
    return NextResponse.json({ 
      error: 'Failed to delete city',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 