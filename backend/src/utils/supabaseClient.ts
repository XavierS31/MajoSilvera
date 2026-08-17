import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | undefined
export function supabaseClient() {
  if (client) return client
  const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('SERVER_MISCONFIGURED')
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  return client
}
