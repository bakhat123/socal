import { NextRequest, NextResponse } from 'next/server'
import { updateAllJsonFiles } from '@/lib/json-updater'

export async function POST(request: NextRequest) {
  try {
    // Update all JSON files
    await updateAllJsonFiles()
    
    return NextResponse.json({ 
      message: 'All JSON files updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating JSON files:', error)
    return NextResponse.json({ 
      error: 'Failed to update JSON files' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Update all JSON files
    await updateAllJsonFiles()
    
    return NextResponse.json({ 
      message: 'All JSON files updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating JSON files:', error)
    return NextResponse.json({ 
      error: 'Failed to update JSON files' 
    }, { status: 500 })
  }
}
