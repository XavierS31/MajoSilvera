import jwt from 'jsonwebtoken'
import { z } from 'zod'
import type { ApiEvent } from '../types.js'
import { parseBody } from '../middleware/sanitize.js'

const schema = z.object({ credential: z.string().min(100).max(6000) })
export async function googleAuth(event: ApiEvent) {
  const { credential } = parseBody(event, schema); const clientId = process.env.GOOGLE_CLIENT_ID; const adminEmail = process.env.ADMIN_EMAIL; const secret = process.env.JWT_SECRET
  if (!clientId || !adminEmail || !secret) throw new Error('SERVER_MISCONFIGURED')
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
  if (!response.ok) throw new Error('INVALID_GOOGLE_TOKEN')
  const profile = await response.json() as { aud?: string; email?: string; email_verified?: string | boolean; sub?: string; exp?: string }
  if (profile.aud !== clientId || profile.email_verified !== true && profile.email_verified !== 'true') throw new Error('INVALID_GOOGLE_TOKEN')
  if (profile.email?.toLowerCase() !== adminEmail.toLowerCase()) throw new Error('FORBIDDEN')
  const token = jwt.sign({ sub: profile.sub, email: adminEmail, role: 'admin' }, secret, { expiresIn: '8h', issuer: 'majo-silvera-api', audience: 'majo-silvera-admin' })
  return { token, email: adminEmail, expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() }
}
