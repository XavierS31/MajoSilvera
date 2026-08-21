import { siteConfig } from '@/data/siteConfig'

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.9 11.9 0 0 0 12.04 0C5.47 0 .13 5.34.13 11.91c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.73 1.46h.01c6.56 0 11.9-5.34 11.9-11.91 0-3.18-1.24-6.16-3.44-8.4ZM12.04 21.8a9.88 9.88 0 0 1-5.04-1.38l-.36-.22-3.74.98 1-3.65-.24-.38a9.87 9.87 0 1 1 8.38 4.65Zm5.42-7.4c-.3-.15-1.77-.87-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-1.78-.9-2.95-1.6-4.13-3.63-.31-.53.3-.5.88-1.67.1-.2.05-.38-.03-.53-.07-.15-.68-1.64-.93-2.25-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.15 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" fill="currentColor" /></svg>
}

export function FloatingSocialButtons() {
  return <aside className="floating-social" aria-label="Canales de contacto">
    <a className="floating-social-link whatsapp" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Contáctanos por WhatsApp">
      <span className="floating-social-label">Contáctanos</span>
      <span className="floating-social-icon"><WhatsAppIcon /></span>
    </a>
  </aside>
}
