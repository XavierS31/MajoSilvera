import { FloralCorner, FloralLotus } from '@/components/SvgIcons'

const careDetails = [
  ['Una sola profesional', 'no rotas de manos entre sesiones'],
  ['Valoración antes de tratar', 'el plan sale de tu caso'],
  ['Material de un solo uso', 'en todo procedimiento invasivo'],
  ['Historia clínica', 'registramos tu evolución'],
]

export function About() { return <main className="page-shell about-page">
  <section className="two-column cream about-intro"><FloralLotus className="motif top-left"/><div className="about-photo image-cover" style={{ backgroundImage: 'url(/majo/majo1.jpeg)' }}/><div className="content-pad about-card"><p className="eyebrow">Quién te atiende</p><h1 className="section-title">Majo<br/>Silvera</h1><p className="eyebrow">Fisioterapeuta · Cosmiatra</p><blockquote className="display about-quote">“Creo firmemente que la belleza y la salud van de la mano. Por eso atiendo yo misma cada sesión, de principio a fin.”</blockquote><ul className="facts">{careDetails.map(([title, description]) => <li key={title}><strong>{title}</strong><span>{description}</span></li>)}</ul></div></section>
  <section className="section dark"><FloralCorner className="motif top-right"/><div className="container about-story"><p className="eyebrow">Una atención personal</p><h2 className="section-title">Tu caso guía<br/><em>cada decisión.</em></h2><p className="soft">Antes de tratar, escuchamos y valoramos. Cada sesión se construye con criterio clínico, objetivos claros y el cuidado que tu cuerpo y tu piel necesitan.</p></div></section>
  <section className="section cream spaces-video-section"><FloralLotus className="motif bottom-right"/><div className="container"><p className="eyebrow">Nuestros espacios de trabajo</p><h2 className="section-title">Un lugar pensado<br/><em>para cuidarte.</em></h2><div className="space-grid space-video-grid"><article className="space-card"><div className="video-frame"><video autoPlay muted loop playsInline preload="metadata"><source src="/rooms/room1.mp4" type="video/mp4"/></video></div><h3>Cabina de estética</h3></article><article className="space-card"><div className="video-frame"><video autoPlay muted loop playsInline preload="metadata"><source src="/rooms/room2.mp4" type="video/mp4"/></video></div><h3>Sala de fisioterapia</h3></article></div></div></section>
</main> }
