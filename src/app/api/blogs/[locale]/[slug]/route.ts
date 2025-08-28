import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string; slug: string } }
) {
  try {
    const { locale, slug } = params
    const filePath = path.join(process.cwd(), 'src', 'data', 'blogs', locale, 'blogs.json')
    const fallbackPath = path.join(process.cwd(), 'src', 'data', 'blogs', 'en', 'blogs.json')

    let filePathToUse = filePath
    if (!fs.existsSync(filePathToUse)) {
      filePathToUse = fallbackPath
    }

    if (!fs.existsSync(filePathToUse)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const raw = fs.readFileSync(filePathToUse, 'utf8')
    const blogs = JSON.parse(raw)
    const blog = Array.isArray(blogs) ? blogs.find((b: any) => b.slug === slug) : null

    if (!blog) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error reading blog by slug:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


