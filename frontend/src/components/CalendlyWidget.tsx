import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/services/apiClient'

type CalendlyWidgetProps = { service?: string; name?: string; email?: string }
type CalendlyConfiguration = { schedulingUrl: string }

export function CalendlyWidget({ service, name, email }: CalendlyWidgetProps) {
  const [configuration, setConfiguration] = useState<CalendlyConfiguration>()
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    apiClient<CalendlyConfiguration>('/config/calendly').then((value) => {
      if (active) setConfiguration(value)
    }).catch(() => {
      if (active) setError(true)
    })
    return () => { active = false }
  }, [])

  const source = useMemo(() => {
    if (!configuration) return ''
    const url = new URL(configuration.schedulingUrl)
    if (service) url.searchParams.set('a1', service)
    if (name) url.searchParams.set('name', name)
    if (email) url.searchParams.set('email', email)
    return url.toString()
  }, [configuration, email, name, service])

  if (error) return <p className="form-message form-message-dark">La agenda no está disponible ahora. Escríbenos por WhatsApp para ayudarte.</p>
  if (!source) return <p className="form-message form-message-dark">Cargando horarios disponibles…</p>
  return <div className="calendly-embed"><iframe className="calendly-frame" title="Agenda tu cita con Majo Silvera" src={source} loading="lazy" scrolling="no" /></div>
}
