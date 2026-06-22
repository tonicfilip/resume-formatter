import { createClient } from '@supabase/supabase-js'

// Public client — safe for use in browser
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Service role client — server-side only (webhooks, API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── User helpers ────────────────────────────────────────────────

export async function getUser(clerkUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', clerkUserId)
    .single()

  if (error) return null
  return data
}

export async function upsertUser(clerkUserId: string, email: string) {
  const { error } = await supabaseAdmin
    .from('users')
    .upsert({ id: clerkUserId, email }, { onConflict: 'id' })

  if (error) throw new Error(`Failed to upsert user: ${error.message}`)
}

export async function markUserPaid(
  clerkUserId: string,
  orderId: string
) {
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      paid: true,
      paid_at: new Date().toISOString(),
      order_id: orderId,
    })
    .eq('id', clerkUserId)

  if (error) throw new Error(`Failed to mark user paid: ${error.message}`)
}

export async function isUserPaid(clerkUserId: string): Promise<boolean> {
  const user = await getUser(clerkUserId)
  return user?.paid === true
}
