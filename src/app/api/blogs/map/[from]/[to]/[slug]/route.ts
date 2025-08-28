import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function readBlogs(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'blogs', locale, 'blogs.json')
  if (!fs.existsSync(filePath)) return []
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const blogs = JSON.parse(raw)
    return Array.isArray(blogs) ? blogs : []
  } catch {
    return []
  }
}

export async function GET(
  req: NextRequest,
  {
    params
  }: { params: { from: string; to: string; slug: string } }
) {
  try {
    const { from, to, slug } = params
    const fromBlogs = readBlogs(from)
    const toBlogs = readBlogs(to)

    const fromBlog = fromBlogs.find((b: any) => b.slug === slug)
    if (!fromBlog) {
      return NextResponse.json({ slug }, { status: 200 })
    }

    const groupId = fromBlog.group_id
    if (groupId == null) {
      // Fallback: try same slug in target locale
      const sameSlug = toBlogs.find((b: any) => b.slug === slug)
      return NextResponse.json({ slug: sameSlug?.slug || slug }, { status: 200 })
    }

    const target = toBlogs.find((b: any) => b.group_id === groupId)
    if (target) {
      return NextResponse.json({ slug: target.slug }, { status: 200 })
    }

    // Fallback to same slug if no mapping found
    return NextResponse.json({ slug }, { status: 200 })
  } catch (e) {
    console.error('Error mapping blog slug between locales:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


