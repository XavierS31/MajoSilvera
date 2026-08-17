import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '@/services/auth'
import { siteConfig } from '@/data/siteConfig'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation(); const session = getSession()
  if (!session || session.email !== siteConfig.adminEmail || new Date(session.expiresAt) <= new Date()) return <Navigate to="/" replace state={{ from: location.pathname }}/>
  return <>{children}</>
}
