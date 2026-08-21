import { useState } from 'react'
import { Link } from 'react-router-dom'
import { navLinks, siteConfig } from '@/data/siteConfig'
import { AuthModal } from './AuthModal'
import { LockButton } from './LockButton'

export function Footer() {
  const [showAuth, setShowAuth] = useState(false)
  const footerLinks = [...navLinks, { label: 'Agendar cita', to: '/agendar' }]

  return <>
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-main">
          <Link className="footer-brand" to="/" aria-label="Ir al inicio">
            <img src="/msWhiteNoBg.png" alt="Majo Silvera Fisio Estetic" />
          </Link>
          <nav className="footer-nav" aria-label="Navegación del pie de página">
            {footerLinks.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
          </nav>
          <div className="footer-meta">
            <p className="footer-contact-title">Conversemos</p>
            <div className="footer-socials">
              <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp · 300 202 5284</a>
              <a href="https://www.instagram.com/majosilvera93/" target="_blank" rel="noreferrer">Instagram · {siteConfig.instagram}</a>
              <a href="https://www.tiktok.com/@majosilvera93" target="_blank" rel="noreferrer">TikTok · {siteConfig.tiktok}</a>
            </div>
          </div>
        </div>
        <div className="footer-legal">
          <span>Copyright {new Date().getFullYear()} Majo Silvera Fisio Estetic · {siteConfig.city}</span>
          <LockButton onClick={() => setShowAuth(true)} />
        </div>
      </div>
    </footer>
    {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
  </>
}
