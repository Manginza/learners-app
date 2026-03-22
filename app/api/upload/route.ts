import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin_auth')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const questionId = formData.get('questionId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!questionId) {
      return NextResponse.json({ error: 'No question ID provided' }, { status: 400 })
    }

    // Upload to Vercel Blob with a structured path
    const blob = await put(`question-images/${questionId}/${file.name}`, file, {
      access: 'public',
    })

    return NextResponse.json({ 
      success: true,
      url: blob.url,
      questionId 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
