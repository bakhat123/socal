import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string; slug: string } }
) {
  try {
    const { locale, slug } = params
    
    console.log('API Counties - Received params:', { locale, slug })
    console.log('API Counties - Current working directory:', process.cwd())

    // Construct the file path
    const filePath = path.join(process.cwd(), 'src', 'data', 'counties', locale, `${slug}.json`)
    console.log('API Counties - Looking for file at:', filePath)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('API Counties - File not found at:', filePath)
      return NextResponse.json(
        { error: 'County not found' },
        { status: 404 }
      )
    }

    console.log('API Counties - File found, reading data...')

    // Read the county data
    const countyData = fs.readFileSync(filePath, 'utf8')
    const county = JSON.parse(countyData)
    
    console.log('API Counties - Successfully loaded county:', county.name)

    return NextResponse.json(county)
  } catch (error) {
    console.error('API Counties - Error fetching county data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
