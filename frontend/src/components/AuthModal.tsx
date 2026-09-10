import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithOAuth2, signOut } from '@/services/auth'
import { apiClient } from '@/services/apiClient'
import { MSLogo } from './SvgIcons'

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage('')
    try { const session = signInWithOAuth2(token); await apiClient('/admin/session', {}, session.token); onClose(); navigate('/admin/dashboard') } catch (error) { signOut(); setMessage(error instanceof Error ? error.message : 'No fue posible iniciar sesión.') }
  }
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-title" onMouseDown={onClose}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">×</button><MSLogo size={52}/><p className="eyebrow">Acceso privado</p><h2 id="admin-title">Administración</h2><p>Ingresa el token OAuth2 otorgado por tu proveedor de identidad.</p><form onSubmit={login}><div className="form-field"><label htmlFor="oauth-token">Token OAuth2</label><textarea id="oauth-token" value={token} onChange={(event) => setToken(event.target.value)} rows={4} required autoComplete="off" /></div><button className="button-gold" type="submit">Continuar</button></form>{message && <p role="alert" style={{ color: '#9c3d31', marginBottom: 0 }}>{message}</p>}</div></div>
}
