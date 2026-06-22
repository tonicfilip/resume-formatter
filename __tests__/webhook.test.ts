import { createHmac } from 'crypto'
import { verifyWebhookSignature } from '../lib/lemonsqueezy'

process.env.LEMON_SQUEEZY_WEBHOOK_SECRET = 'test-secret-key'

function makeSignature(body: string, secret = 'test-secret-key'): string {
  return createHmac('sha256', secret).update(body).digest('hex')
}

describe('verifyWebhookSignature', () => {
  const body = JSON.stringify({ meta: { event_name: 'order_created' } })

  it('returns true for a valid signature', () => {
    const sig = makeSignature(body)
    expect(verifyWebhookSignature(body, sig)).toBe(true)
  })

  it('returns false for an invalid signature', () => {
    expect(verifyWebhookSignature(body, 'bad-signature')).toBe(false)
  })

  it('returns false when signature is null', () => {
    expect(verifyWebhookSignature(body, null)).toBe(false)
  })

  it('returns false when signature is empty string', () => {
    expect(verifyWebhookSignature(body, '')).toBe(false)
  })

  it('returns false when body is tampered with', () => {
    const sig = makeSignature(body)
    const tamperedBody = body.replace('order_created', 'order_refunded')
    expect(verifyWebhookSignature(tamperedBody, sig)).toBe(false)
  })

  it('returns false when signed with wrong secret', () => {
    const sig = makeSignature(body, 'wrong-secret')
    expect(verifyWebhookSignature(body, sig)).toBe(false)
  })
})
