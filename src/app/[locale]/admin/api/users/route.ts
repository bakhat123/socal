import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const users = await db.collection('users').find({}).toArray()
    
    // Transform the data to include both _id and id fields for compatibility
    const transformedUsers = users.map(user => ({
      _id: user._id.toString(),
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'User',
      status: user.status || 'Active',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))
    
    return NextResponse.json(transformedUsers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { db } = await connectToDatabase()
    
    // Hash the password if present
    const userData = { ...body }
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10)
    }
    userData.createdAt = new Date()
    userData.updatedAt = new Date()
    
    const result = await db.collection('users').insertOne(userData)

    const insertedId = result.insertedId ? result.insertedId.toString() : ''
    const response = { 
      message: 'User created successfully', 
      _id: insertedId,
      id: insertedId
    }
    
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, id, ...updateData } = body
    const userId = _id || id
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, id } = body
    const userId = _id || id
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}