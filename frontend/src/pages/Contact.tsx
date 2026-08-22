import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendlyWidget } from '@/components/CalendlyWidget'
import { FloralCorner } from '@/components/SvgIcons'
import { contactDetails } from '@/data/siteConfig'
import { apiClient } from '@/services/apiClient'

type ContactPrefill = { name: string; email: string }

export function Contact() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [prefill, setPrefill] = useState<ContactPrefill>({ name: '', email: '' })
  const selectedService = searchParams.get('service') || undefined

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setStatus('')
    const form = new FormData(event.currentTarget)
    try { await apiClient('/contact', { method: 'POST', body: JSON.stringify(Object.fromEntries(form)) }); event.currentTarget.reset(); setPrefill({ name: '', email: '' }); setStatus('Gracias. Recibimos tu mensaje y te responderemos pronto.') } catch (error) { setStatus(error instanceof Error ? error.message : 'No fue posible enviar el mensaje.') } finally { setSending(false) }
  }

  return <main className="page-shell"><section className="section dark form-page"><FloralCorner className="motif top-right"/><div className="container contact-grid"><div className="form-page-copy"><p className="eyebrow">Contacto</p><h1 className="section-title">Hablemos de tu<br/><em>bienestar.</em></h1><p className="soft">Escríbenos para resolver una duda o solicitar orientación antes de tu valoración.</p><dl className="contact-list">{contactDetails.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.href ? <a href={detail.href} target={detail.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{detail.value}</a> : detail.value}</dd></div>)}</dl></div><div className="contact-form-stack"><form className="form-panel" onSubmit={submit}><p className="eyebrow">Déjanos un mensaje</p>{selectedService && <p className="selected-service">Servicio seleccionado: <strong>{selectedService}</strong></p>}<div className="form-field"><label htmlFor="name">Nombre</label><input id="name" name="name" minLength={2} required value={prefill.name} onChange={(event) => setPrefill((value) => ({ ...value, name: event.target.value }))} /></div><div className="form-field"><label htmlFor="email">Correo</label><input id="email" name="email" type="email" required value={prefill.email} onChange={(event) => setPrefill((value) => ({ ...value, email: event.target.value }))} /></div><div className="form-field"><label htmlFor="phone">Teléfono</label><input id="phone" name="phone" minLength={7} required /></div><div className="form-field"><label htmlFor="message">¿Cómo podemos ayudarte?</label><textarea id="message" name="message" rows={5} minLength={10} required /></div><button className="button-gold" disabled={sending} type="submit">{sending ? 'Enviando...' : 'Enviar mensaje'}</button><p className="form-message" role="status">{status}</p></form><CalendlyWidget service={selectedService} name={prefill.name} email={prefill.email}/></div></div></section></main>
}
