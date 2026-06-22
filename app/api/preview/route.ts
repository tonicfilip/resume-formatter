import { NextRequest, NextResponse } from 'next/server'
import { renderTemplate } from '../../../lib/templates'
import type { GenerateRequest } from '../../../types/resume'

/**
 * POST /api/preview
 *
 * Free endpoint. Takes resume data + template ID,
 * returns rendered HTML for the live preview iframe.
 * No auth, no payment check — this is the hook.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRequest

    if (!body.resumeData || !body.templateId) {
      return NextResponse.json(
        { error: 'Missing resumeData or templateId' },
        { status: 400 }
      )
    }

    const html = renderTemplate(body.templateId, body.resumeData)

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (err) {
    console.error('[preview] error:', err)
    return NextResponse.json({ error: 'Failed to render preview' }, { status: 500 })
  }
}
