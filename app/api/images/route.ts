import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: 'question-images/',
    })

    // Group images by question ID
    const imagesByQuestion: Record<string, string[]> = {}
    
    for (const blob of blobs) {
      // Extract question ID from path like "question-images/code8-q1/image.jpg"
      const parts = blob.pathname.split('/')
      if (parts.length >= 2) {
        const questionId = parts[1]
        if (!imagesByQuestion[questionId]) {
          imagesByQuestion[questionId] = []
        }
        imagesByQuestion[questionId].push(blob.url)
      }
    }

    return NextResponse.json({ images: imagesByQuestion })
  } catch (error) {
    console.error('Error listing images:', error)
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 })
  }
}
