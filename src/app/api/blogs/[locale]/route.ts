import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  try {
    const { locale } = params
    const localePath = path.join(process.cwd(), 'src', 'data', 'blogs', locale, 'blogs.json')
    const fallbackPath = path.join(process.cwd(), 'src', 'data', 'blogs', 'en', 'blogs.json')

    let filePathToUse = localePath
    if (!fs.existsSync(filePathToUse)) {
      filePathToUse = fallbackPath
    }

    if (!fs.existsSync(filePathToUse)) {
      return NextResponse.json([], { status: 200 })
    }

    const raw = fs.readFileSync(filePathToUse, 'utf8')
    let blogs
    try {
      blogs = JSON.parse(raw)
    } catch {
      blogs = []
    }

    // Only return published blogs if status exists
    const published = Array.isArray(blogs)
      ? blogs.filter((b: any) => !b.status || b.status === 'Published')
      : []

    return NextResponse.json(published)
  } catch (error) {
    console.error('Error reading blogs by locale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


