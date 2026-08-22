import type { ApiEvent, AdminClaims } from '../types.js'

type Introspection = { active?: boolean; sub?: string; email?: string; role?: string; roles?: string[]; scope?: string }
type GoogleProfile = { sub?: string; email?: string; verified_email?: boolean }

export function oauthConfiguration() {
  const clientId = process.env.OAUTH2_CLIENT_ID
  if (!clientId) throw new Error('SERVER_MISCONFIGURED')
  return { provider: process.env.OAUTH2_PROVIDER || 'google', clientId }
}

async function googleClaims(token: string) {
  let response: Response
  try { response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { authorization: `Bearer ${token}` } }) } catch { throw new Error('OAUTH_UNAVAILABLE') }
  if (!response.ok) throw new Error('UNAUTHORIZED')
  const profile = await response.json() as GoogleProfile
  if (!profile.sub || !profile.email || profile.verified_email === false) throw new Error('UNAUTHORIZED')
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || profile.email.toLowerCase() !== adminEmail.toLowerCase()) throw new Error('FORBIDDEN')
  return { sub: profile.sub, email: profile.email, role: 'admin' as const }
}

async function introspectedClaims(token: string) {
  const url = process.env.OAUTH2_TOKEN_INTROSPECT_URL; const clientId = process.env.OAUTH2_CLIENT_ID; const secret = process.env.OAUTH2_CLIENT_SECRET
  if (!url || !clientId || !secret) throw new Error('SERVER_MISCONFIGURED')
  let response: Response
  try { response = await fetch(url, { method: 'POST', headers: { authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ token }).toString() }) } catch { throw new Error('OAUTH_UNAVAILABLE') }
  if (!response.ok) throw new Error('UNAUTHORIZED')
  const claims = await response.json() as Introspection
  const isAdmin = claims.role === 'admin' || claims.roles?.includes('admin') || claims.scope?.split(/\s+/).includes('admin')
  if (!claims.active) throw new Error('UNAUTHORIZED')
  if (!isAdmin || !claims.sub || !claims.email) throw new Error('FORBIDDEN')
  return { sub: claims.sub, email: claims.email, role: 'admin' as const }
}

export async function requireAdmin(event: ApiEvent): Promise<AdminClaims> {
  const token = event.headers.authorization?.replace(/^Bearer\s+/i, '').trim()
  if (!token) throw new Error('UNAUTHORIZED')
  return oauthConfiguration().provider === 'google' ? googleClaims(token) : introspectedClaims(token)
}
