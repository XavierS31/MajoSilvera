import { apiClient } from './apiClient'

declare global { interface Window { google?: { accounts: { id: { initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void; prompt: () => void } } } } }

export type AuthSession = { token: string; email: string; expiresAt: string }
const storageKey = 'majo-admin-session'

export function getSession(): AuthSession | null {
  try { const value = localStorage.getItem(storageKey); return value ? JSON.parse(value) as AuthSession : null } catch { return null }
}
export function signOut() { localStorage.removeItem(storageKey) }

export function signInWithGoogle(): Promise<AuthSession> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId || !window.google) return Promise.reject(new Error('Google OAuth no está configurado todavía.'))
  return new Promise((resolve, reject) => {
    window.google?.accounts.id.initialize({ client_id: clientId, callback: async ({ credential }) => {
      try { const session = await apiClient<AuthSession>('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }); localStorage.setItem(storageKey, JSON.stringify(session)); resolve(session) } catch (error) { reject(error) }
    } })
    window.google?.accounts.id.prompt()
  })
}
