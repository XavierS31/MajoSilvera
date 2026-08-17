import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks } from '@/data/siteConfig'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { const update = () => setScrolled(window.scrollY > 30); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update) }, [])
  return <nav className={`nav ${scrolled || pathname !== '/' ? 'is-solid' : ''}`} aria-label="Navegación principal">
    <div className="nav-inner">
      <Link className="brand" to="/" onClick={() => setOpen(false)}><img src="/msGoldnoBg.png" alt="Majo Silvera Fisio Estetic" /></Link>
      <div className="nav-links">{navLinks.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}<Link className="button-gold" to="/agendar">Agendar cita</Link></div>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-label="Abrir menú" onClick={() => setOpen((value) => !value)}>☰</button>
    </div>
    <div className={`mobile-nav ${open ? 'open' : ''}`}>{navLinks.map((link) => <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label}</Link>)}<Link className="button-gold" to="/agendar" onClick={() => setOpen(false)}>Agendar cita</Link></div>
  </nav>
}
