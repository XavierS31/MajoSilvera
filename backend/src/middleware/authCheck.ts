import jwt from 'jsonwebtoken'
import type { ApiEvent, AdminClaims } from '../types.js'

export function requireAdmin(event: ApiEvent): AdminClaims {
  const token = event.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) throw new Error('UNAUTHORIZED')
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('SERVER_MISCONFIGURED')
  const claims = jwt.verify(token, secret) as AdminClaims
  if (claims.role !== 'admin' || claims.email !== process.env.ADMIN_EMAIL) throw new Error('FORBIDDEN')
  return claims
}
