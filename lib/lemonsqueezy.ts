import { createHmac, timingSafeEqual } from 'crypto'

const LS_API_BASE = 'https://api.lemonsqueezy.com/v1'

// ─── Checkout ────────────────────────────────────────────────────

interface CheckoutOptions {
  clerkUserId: string
  email: string
  redirectUrl: string
}

/**
 * Creates a Lemon Squeezy checkout URL for the resume formatter product.
 * We embed the Clerk user ID in custom data so the webhook can match
 * the payment back to the right user.
 */
export async function createCheckoutUrl(opts: CheckoutOptions): Promise<string> {
  const response = await fetch(`${LS_API_BASE}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: opts.email,
            custom: {
              clerk_user_id: opts.clerkUserId,
            },
          },
          product_options: {
            redirect_url: opts.redirectUrl,
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: process.env.LEMON_SQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: process.env.LEMON_SQUEEZY_PRODUCT_ID,
            },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create checkout: ${error}`)
  }

  const json = await response.json()
  return json.data.attributes.url as string
}

// ─── Webhook verification ─────────────────────────────────────────

/**
 * Verifies the Lemon Squeezy webhook signature.
 * Must be called with the raw request body (not parsed JSON).
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!
  const hmac = createHmac('sha256', secret)
  const digest = hmac.update(rawBody).digest('hex')

  // timingSafeEqual requires equal-length buffers — if lengths differ the
  // signature is invalid by definition, so return false immediately
  const digestBuf = Buffer.from(digest)
  const sigBuf    = Buffer.from(signatureHeader)
  if (digestBuf.length !== sigBuf.length) return false
  return timingSafeEqual(digestBuf, sigBuf)
}

// ─── Event types ─────────────────────────────────────────────────

export interface LemonSqueezyOrderEvent {
  meta: {
    event_name: string
    custom_data?: {
      clerk_user_id?: string
    }
  }
  data: {
    id: string
    attributes: {
      order_number: number
      status: string
      user_email: string
    }
  }
}
