import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string; slug: string } }
) {
  try {
    const { locale, slug } = params
    
    // Construct the file path to the city JSON file
    const filePath = path.join(process.cwd(), 'src', 'data', 'cities', locale, `${slug}.json`)
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }
    
    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const cityData = JSON.parse(fileContent)
    
    return NextResponse.json(cityData)
  } catch (error) {
    console.error('Error reading city data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
