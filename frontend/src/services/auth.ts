declare global { interface Window { google?: { accounts: { oauth2: { initTokenClient: (config: { client_id: string; scope: string; callback: (response: { access_token?: string; expires_in?: number; error?: string }) => void }) => { requestAccessToken: () => void } } } } } }

export type AuthSession = { token: string; email: string; expiresAt: string }
const storageKey = 'majo-admin-session'
export function getSession(): AuthSession | null { try { const value = localStorage.getItem(storageKey); const session = value ? JSON.parse(value) as AuthSession : null; return session && new Date(session.expiresAt) > new Date() ? session : null } catch { return null } }
export function signOut() { localStorage.removeItem(storageKey) }

/** Obtains an OAuth2 access token; the API validates it with the configured introspection endpoint. */
export function signInWithGoogle(): Promise<AuthSession> {
  const clientId = import.meta.env.VITE_OAUTH2_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId || !window.google) return Promise.reject(new Error('OAuth2 no está configurado todavía.'))
  return new Promise((resolve, reject) => {
    const client = window.google?.accounts.oauth2.initTokenClient({ client_id: clientId, scope: 'openid email profile admin', callback: ({ access_token, expires_in, error }) => {
      if (error || !access_token) { reject(new Error('No fue posible obtener el token OAuth2.')); return }
      const session = { token: access_token, email: '', expiresAt: new Date(Date.now() + (expires_in || 3600) * 1000).toISOString() }
      localStorage.setItem(storageKey, JSON.stringify(session)); resolve(session)
    } })
    client?.requestAccessToken()
  })
}
