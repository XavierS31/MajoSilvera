import { useState } from 'react'
import { siteConfig } from '@/data/siteConfig'
import { AuthModal } from './AuthModal'
import { FloralCorner } from './SvgIcons'
import { LockButton } from './LockButton'

export function Footer() {
  const [showAuth, setShowAuth] = useState(false)
  return <><footer className="footer"><div className="footer-inner"><span>© {new Date().getFullYear()} Majo Silvera Fisio Estetic · {siteConfig.city}</span><FloralCorner style={{ color: '#B8973A', width: 20, height: 20 }}/><LockButton onClick={() => setShowAuth(true)}/></div></footer>{showAuth && <AuthModal onClose={() => setShowAuth(false)}/>}</>
}
