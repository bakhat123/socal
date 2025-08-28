import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('🧪 Testing database connection...')
    console.log('📡 DATABASE_URI:', process.env.DATABASE_URI ? 'Set' : 'Not set')
    console.log('📡 MONGODB_DB:', process.env.MONGODB_DB || 'Not set (using default: socal-frontend)')
    console.log('📡 NODE_ENV:', process.env.NODE_ENV)
    
    const { db } = await connectToDatabase()
    console.log('✅ Connected to database:', db.databaseName)
    console.log('✅ Database admin info:', await db.admin().listDatabases())
    
    // Test inserting a simple document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Database connection test',
      developer: 'test',
      database: db.databaseName
    }
    
    const result = await db.collection('test').insertOne(testDoc)
    console.log('✅ Test document created with _id:', result.insertedId)
    
    // Retrieve the test document
    const retrievedDoc = await db.collection('test').findOne({ _id: result.insertedId })
    console.log('✅ Retrieved test document:', JSON.stringify(retrievedDoc, null, 2))
    
    // Clean up - delete the test document
    await db.collection('test').deleteOne({ _id: result.insertedId })
    console.log('✅ Test document cleaned up')
    
    return NextResponse.json({ 
      success: true, 
      database: db.databaseName,
      testId: result.insertedId.toString(),
      message: 'Database connection working properly',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongodbDb: process.env.MONGODB_DB || 'socal-frontend (default)',
        databaseUri: process.env.DATABASE_URI ? 'Set' : 'Not set'
      }
    })
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongodbDb: process.env.MONGODB_DB || 'socal-frontend (default)',
        databaseUri: process.env.DATABASE_URI ? 'Set' : 'Not set'
      }
    }, { status: 500 })
  }
} 