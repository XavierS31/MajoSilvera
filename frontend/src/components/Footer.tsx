import { useState } from 'react'
import { Link } from 'react-router-dom'
import { navLinks, siteConfig } from '@/data/siteConfig'
import { AuthModal } from './AuthModal'
import { LockButton } from './LockButton'

export function Footer() {
  const [showAuth, setShowAuth] = useState(false)
  const footerLinks = [...navLinks, { label: 'Agendar cita', to: '/agendar' }]

  return <><footer className="footer"><div className="footer-inner"><Link className="footer-brand" to="/" aria-label="Ir al inicio"><img src="/msWhiteNoBg.png" alt="Majo Silvera Fisio Estetic" /></Link><nav className="footer-nav" aria-label="Navegacion del pie de pagina">{footerLinks.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}</nav><div className="footer-meta"><span>Copyright {new Date().getFullYear()} Majo Silvera Fisio Estetic - {siteConfig.city}</span><LockButton onClick={() => setShowAuth(true)}/></div></div></footer>{showAuth && <AuthModal onClose={() => setShowAuth(false)}/>}</>
}
