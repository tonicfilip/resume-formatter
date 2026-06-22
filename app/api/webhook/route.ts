import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, type LemonSqueezyOrderEvent } from '../../../lib/lemonsqueezy'
import { markUserPaid } from '../../../lib/supabase'

/**
 * POST /api/webhook
 *
 * Lemon Squeezy fires this after a successful payment.
 * We verify the signature, extract the Clerk user ID from
 * custom_data, and flip the user's paid flag in Supabase.
 *
 * IMPORTANT: This route must receive the raw body for
 * HMAC verification — do NOT parse it before verifying.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-signature')

  // 1. Verify signature
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn('[webhook] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: LemonSqueezyOrderEvent
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 2. Only handle successful order completions
  if (event.meta.event_name !== 'order_created') {
    return NextResponse.json({ received: true })
  }

  if (event.data.attributes.status !== 'paid') {
    return NextResponse.json({ received: true })
  }

  // 3. Extract the Clerk user ID we embedded at checkout creation
  const clerkUserId = event.meta.custom_data?.clerk_user_id
  if (!clerkUserId) {
    console.error('[webhook] No clerk_user_id in custom_data', event)
    return NextResponse.json({ error: 'No user ID in payload' }, { status: 400 })
  }

  // 4. Mark user as paid
  try {
    await markUserPaid(clerkUserId, event.data.id)
    console.log(`[webhook] Marked user ${clerkUserId} as paid (order ${event.data.id})`)
  } catch (err) {
    console.error('[webhook] Failed to mark user paid:', err)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// Required: disable Next.js body parsing so we receive raw bytes
export const config = {
  api: { bodyParser: false },
}
