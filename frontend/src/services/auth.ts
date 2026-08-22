import { apiClient } from './apiClient'

declare global { interface Window { google?: { accounts: { oauth2: { initTokenClient: (config: { client_id: string; scope: string; callback: (response: { access_token?: string; expires_in?: number; error?: string }) => void }) => { requestAccessToken: () => void } } } } } }

type OAuthConfiguration = { provider: string; clientId: string }
type GoogleProfile = { email?: string; verified_email?: boolean }
export type AuthSession = { token: string; email: string; expiresAt: string }
const storageKey = 'majo-admin-session'

export function getSession(): AuthSession | null { try { const value = localStorage.getItem(storageKey); const session = value ? JSON.parse(value) as AuthSession : null; return session && new Date(session.expiresAt) > new Date() ? session : null } catch { return null } }
export function signOut() { localStorage.removeItem(storageKey) }

/** Obtains a Google access token and its verified account email for administrator access. */
export async function signInWithGoogle(): Promise<AuthSession> {
  const configuration = await apiClient<OAuthConfiguration>('/config/auth')
  if (configuration.provider !== 'google') throw new Error('El proveedor de acceso administrativo no es compatible con Google.')
  if (!configuration.clientId || !window.google) throw new Error('El acceso con Google todavía no está disponible. Intenta de nuevo en un momento.')

  return new Promise((resolve, reject) => {
    const client = window.google?.accounts.oauth2.initTokenClient({ client_id: configuration.clientId, scope: 'openid email profile', callback: async ({ access_token, expires_in, error }) => {
      if (error || !access_token) { reject(new Error('No fue posible obtener el token de Google.')); return }
      try {
        const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { authorization: `Bearer ${access_token}` } })
        const profile = await response.json() as GoogleProfile
        if (!response.ok || !profile.email || profile.verified_email === false) throw new Error('No fue posible verificar la cuenta de Google.')
        const session = { token: access_token, email: profile.email, expiresAt: new Date(Date.now() + (expires_in || 3600) * 1000).toISOString() }
        localStorage.setItem(storageKey, JSON.stringify(session)); resolve(session)
      } catch (reason) { reject(reason instanceof Error ? reason : new Error('No fue posible verificar la cuenta de Google.')) }
    } })
    client?.requestAccessToken()
  })
}
