export type AuthSession = { token: string; expiresAt: string }
const storageKey = 'majo-admin-session'

export function getSession(): AuthSession | null { try { const value = localStorage.getItem(storageKey); const session = value ? JSON.parse(value) as AuthSession : null; return session && new Date(session.expiresAt) > new Date() ? session : null } catch { return null } }
export function signOut() { localStorage.removeItem(storageKey) }

/** Stores an OAuth2 access token. The API introspection endpoint remains the authority for admin access. */
export function signInWithOAuth2(token: string): AuthSession {
  const cleanToken = token.trim().replace(/^Bearer\s+/i, '')
  if (!cleanToken) throw new Error('Ingresa un token OAuth2 válido.')
  const session = { token: cleanToken, expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() }
  localStorage.setItem(storageKey, JSON.stringify(session))
  return session
}
