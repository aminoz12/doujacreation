import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/api-auth'

// sharp requires the Node.js runtime (not Edge).
export const runtime = 'nodejs'

// Longest edge (px) kept for stored product images — plenty for photography.
const MAX_DIMENSION = 1600
// WebP quality — 80 is visually lossless for photos at a fraction of the size.
const WEBP_QUALITY = 80

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'products'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate input size (max 15MB). The stored image is compressed below, so
    // we accept large high-res originals (e.g. phone photos) up front.
    const maxSize = 15 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 15MB limit' },
        { status: 400 }
      )
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const originalSize = inputBuffer.length

    // Process the image: auto-orient (EXIF), downscale to MAX_DIMENSION, and
    // re-encode as WebP to slash storage/bandwidth. Animated GIFs are passed
    // through untouched so they keep their animation.
    const isGif = file.type === 'image/gif'
    let outputBuffer: Buffer = inputBuffer
    let contentType = file.type
    let extension = (file.name.split('.').pop() || 'jpg').toLowerCase()

    if (!isGif) {
      try {
        outputBuffer = await sharp(inputBuffer)
          .rotate() // respect EXIF orientation (phone photos)
          .resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer()
        contentType = 'image/webp'
        extension = 'webp'
      } catch (err) {
        // Corrupt/unsupported input — fall back to uploading the original.
        console.error('Image processing failed, uploading original:', err)
        outputBuffer = inputBuffer
        contentType = file.type
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `${folder}/${timestamp}-${randomStr}.${extension}`

    // Upload to Supabase Storage. Filenames are unique+immutable, so cache hard.
    const { data, error } = await supabaseAdmin
      .storage
      .from('product-images')
      .upload(filename, outputBuffer, {
        contentType,
        cacheControl: '31536000',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from('product-images')
      .getPublicUrl(filename)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      originalSize,
      size: outputBuffer.length,
      contentType,
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}

// DELETE image from storage
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'No path provided' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .storage
      .from('product-images')
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete file' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    )
  }
}







