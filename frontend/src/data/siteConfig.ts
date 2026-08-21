export const siteConfig = {
  name: 'Majo Silvera',
  specialty: 'Fisio Estetic',
  city: 'Barranquilla, Colombia',
  whatsapp: '573002025284',
  instagram: '@majosilvera93',
  tiktok: '@majosilvera93',
  email: 'hijuelos88@hotmail.com',
  address: 'Cra. 47 # 84-102 · Ed. Lanzarote, Apto 1C',
  adminEmail: 'xaviersotoba31@gmail.com',
  calendlyUrl: 'https://calendly.com/',
  images: {
    hero: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1800&h=1100&fit=crop&auto=format',
    practitioner: 'https://images.unsplash.com/photo-1706353399656-210cca727a33?w=900&h=1100&fit=crop&auto=format',
    therapy: 'https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?w=900&h=1100&fit=crop&auto=format',
  },
} as const

export const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Paquetes', to: '/paquetes' },
  { label: 'Contacto', to: '/contacto' },
]

export const contactDetails = [
  { label: 'WhatsApp', value: '300 202 5284', href: `https://wa.me/${siteConfig.whatsapp}` },
  { label: 'Instagram', value: siteConfig.instagram, href: 'https://www.instagram.com/majosilvera93/' },
  { label: 'TikTok', value: siteConfig.tiktok, href: 'https://www.tiktok.com/@majosilvera93' },
  { label: 'Consultorio', value: siteConfig.address },
  { label: 'Correo', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
]
