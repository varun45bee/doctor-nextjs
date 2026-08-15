import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-sanity-secret')
    const body = await req.json()

    // Verify the secret
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate based on the document type
    const { _type, slug } = body

    if (_type === 'blogPost' && slug?.current) {
      revalidatePath(`/blog/${slug.current}`)
      revalidateTag('blog')
      return NextResponse.json({ revalidated: true, path: `/blog/${slug.current}` })
    }

    if (_type === 'condition' && slug?.current) {
      revalidatePath(`/conditions/${slug.current}`)
      revalidateTag('conditions')
      return NextResponse.json({ revalidated: true, path: `/conditions/${slug.current}` })
    }

    if (_type === 'siteSettings') {
      revalidatePath('/')
      revalidateTag('siteSettings')
      return NextResponse.json({ revalidated: true, path: '/' })
    }

    // Revalidate all pages if type is not specific
    revalidateTag('all')
    return NextResponse.json({ revalidated: true, path: 'all' })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
