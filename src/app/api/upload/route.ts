import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'hero', 'logo', etc.

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!type) {
      return NextResponse.json({ error: 'No type specified' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Get file extension and enforce PNG for property_* uploads
    const originalExt = (file.name.split('.').pop() || '').toLowerCase()
    const isPropertyImage = type.startsWith('property_')
    if (isPropertyImage && file.type !== 'image/png') {
      return NextResponse.json({ error: 'Please upload PNG images for properties' }, { status: 400 })
    }
    const fileExtension = isPropertyImage ? 'png' : originalExt
    const fileName = `${type}.${fileExtension}`
    
    // Define upload directory
    // - hero -> public/home
    // - property_* -> public/contact
    // - default -> public
    // NOTE: isPropertyImage declared above
    const uploadDir = type === 'hero'
      ? join(process.cwd(), 'public', 'home')
      : isPropertyImage
        ? join(process.cwd(), 'public', 'contact')
        : join(process.cwd(), 'public')
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    
    const filePath = join(uploadDir, fileName)

    // Remove old file if it exists
    try {
      await unlink(filePath)
    } catch (error) {
      // File doesn't exist, which is fine
    }

    // For property images, proactively delete any previous variants to avoid duplicates (jpg, jpeg, webp, png)
    if (isPropertyImage) {
      const variants = ['png', 'jpg', 'jpeg', 'webp']
      await Promise.all(variants.map(async (ext) => {
        const variantPath = join(uploadDir, `${type}.${ext}`)
        try { await unlink(variantPath) } catch {}
      }))
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write new file
    await writeFile(filePath, buffer)

    // Return the file path that can be used in the frontend
    const fileUrl = type === 'hero'
      ? `/home/${fileName}`
      : isPropertyImage
        ? `/contact/${fileName}`
        : `/${fileName}`

    return NextResponse.json({ 
      success: true, 
      fileUrl,
      fileName 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}


