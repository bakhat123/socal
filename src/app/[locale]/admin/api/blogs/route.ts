import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection('blogs').find({}).toArray()
    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Creating blog with data:', JSON.stringify(body, null, 2))
    
    // Validate required fields according to new schema
    const requiredFields = [
      'slug', 'title', 'category', 'author', 'date', 'readTime', 
      'heroImage', 'heroimagealt', 'canonicalurl', 'language', 'city', 'topic',
      'keyword', 'group_id', 'seo', 'hreflang_tags', 
       'wordcount', 'ctaSection', 'content'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }
    
    // Validate author object structure
    if (!body.author.name || !body.author.title || !body.author.avatar || !body.author.bio) {
      return NextResponse.json({ 
        error: 'Author object must include name, title, avatar, and bio' 
      }, { status: 400 })
    }
    
    // Validate content structure
    if (!body.content.lead || !body.content.sections || body.content.sections.length === 0) {
      return NextResponse.json({ 
        error: 'Content must include lead and at least one section' 
      }, { status: 400 })
    }
    
    // Validate SEO object
    if (!body.seo.metaTitle || !body.seo.metaDescription) {
      return NextResponse.json({ 
        error: 'SEO object must include metaTitle and metaDescription' 
      }, { status: 400 })
    }
    
    // Validate CTA section
    if (!body.ctaSection.title || !body.ctaSection.ctaText || !body.ctaSection.ctaLink) {
      return NextResponse.json({ 
        error: 'CTA section must include title, ctaText, and ctaLink' 
      }, { status: 400 })
    }
    
    console.log('📡 Connecting to database...')
    const { db } = await connectToDatabase()
    console.log('📡 Connected to database:', db.databaseName)
    
    // Prepare blog data with defaults for optional fields
    const blogData = {
      ...body,
      // Set defaults for optional fields if not provided
      status: body.status || 'Draft',
      views: body.views || 0,
      likes: body.likes || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('📝 Blog data to insert:', JSON.stringify(blogData, null, 2))
    
    console.log('📝 Inserting blog into collection...')
    const result = await db.collection('blogs').insertOne(blogData)

    return NextResponse.json({ 
      message: 'Blog created successfully', 
      _id: result.insertedId 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create blog'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, ...updateData } = body
    const { db } = await connectToDatabase()
    
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(String(_id)) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Blog updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id } = body
    const { db } = await connectToDatabase()
    
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(String(_id)) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}