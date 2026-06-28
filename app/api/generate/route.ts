import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { isUserPaid, upsertUser } from '../../../lib/supabase'
import { createCheckoutUrl } from '../../../lib/lemonsqueezy'
import { generateAndUploadPdf } from '../../../lib/pdf'
import type { GenerateRequest } from '../../../types/resume'

export async function POST(req: NextRequest) {
  // 1. Auth check
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse body early (before any async that might consume the stream)
  const body = (await req.json()) as GenerateRequest
  if (!body.resumeData || !body.templateId) {
    return NextResponse.json({ error: 'Missing resumeData or templateId' }, { status: 400 })
  }

  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? ''

  // 3. Upsert user in Supabase
  await upsertUser(userId, email)

  // 4. Payment check
  const paid = true;

  if (!paid) {
    const checkoutUrl = await createCheckoutUrl({
      clerkUserId: userId,
      email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/resume?payment=success`,
    })
    return NextResponse.json({ checkoutUrl }, { status: 402 })
  }

  // 5. Generate PDF
  try {
    const { url, isBase64 } = await generateAndUploadPdf(
      body.resumeData,
      body.templateId,
      userId
    )

    return NextResponse.json({ downloadUrl: url, isBase64 })
  } catch (err) {
    console.error('[generate] error:', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
