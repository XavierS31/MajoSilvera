import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle } from '@/services/auth'
import { siteConfig } from '@/data/siteConfig'
import { MSLogo } from './SvgIcons'

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  async function login() {
    setLoading(true); setMessage('')
    try { const session = await signInWithGoogle(); if (session.email !== siteConfig.adminEmail) throw new Error('Esta cuenta no tiene acceso administrativo.'); onClose(); navigate('/admin/dashboard') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'No fue posible iniciar sesión.') }
    finally { setLoading(false) }
  }
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-title" onMouseDown={onClose}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">×</button><MSLogo size={52}/><p className="eyebrow">Acceso privado</p><h2 id="admin-title">Administración</h2><p>Este acceso está reservado para la cuenta autorizada de Majo Silvera Fisio Estetic.</p><button className="button-gold" type="button" disabled={loading} onClick={login}>{loading ? 'Verificando...' : 'Continuar con Google'}</button>{message && <p role="alert" style={{ color: '#9c3d31', marginBottom: 0 }}>{message}</p>}</div></div>
}
