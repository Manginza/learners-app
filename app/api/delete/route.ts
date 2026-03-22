import { del } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin_auth')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
