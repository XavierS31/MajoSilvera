export type Service = { id: string; name: string; description: string; price: string }
export type ServiceCategory = { id: string; label: string; title: string; italicTitle: string; dark: boolean; note?: string; items: Service[] }

export const serviceCategories: ServiceCategory[] = [
  { id: 'fisioterapia', label: 'Fisioterapia', title: 'Fisioterapia', italicTitle: 'avanzada', dark: true, items: [
    { id: 'valoracion', name: 'Valoración', description: 'Incluye plan de tratamiento por escrito', price: '$80.000' },
    { id: 'rehabilitacion', name: 'Rehabilitación funcional', description: 'Bicicleta, step, ligas y conos', price: '$70.000' },
    { id: 'electroterapia', name: 'Electroterapia', description: 'Corriente analgésica y ultrasonido', price: '$90.000' },
    { id: 'descontracturante', name: 'Descontracturante', description: 'Espalda · 45 minutos', price: '$95.000' },
    { id: 'puncion-seca', name: 'Punción seca', description: 'Liberación de puntos gatillo', price: '$140.000' },
    { id: 'electropuncion', name: 'Electropunción', description: 'Punción seca + corriente terapéutica', price: '$160.000' },
    { id: 'drenaje', name: 'Drenaje linfático', description: 'Retención de líquidos y post quirúrgico', price: '$170.000' },
    { id: 'ondas', name: 'Ondas de choque', description: 'Tendinitis y fascitis plantar', price: '$180.000' },
    { id: 'neural', name: 'Terapia neural', description: 'Microinyecciones para dolor crónico', price: '$200.000' },
  ] },
  { id: 'estetica', label: 'Estética facial', title: 'Estética', italicTitle: 'facial', dark: false, note: 'Los faciales se potencian entre sí. En tu valoración definimos cuál va primero y cada cuánto repetirlo.', items: [
    { id: 'led', name: 'Máscara LED', description: 'Fototerapia · acné y rojeces', price: '$70.000' },
    { id: 'higiene', name: 'Higiene profunda', description: 'Extracción, hidratación y mascarilla', price: '$140.000' },
    { id: 'microneedling', name: 'Microneedling', description: 'Inducción de colágeno con dermapen', price: '$240.000' },
    { id: 'hidrafacial', name: 'Hidrafacial', description: 'Limpia, extrae e hidrata en un paso', price: '$290.000' },
    { id: 'plasma', name: 'Plasma facial', description: 'Regeneración con tu propio plasma (PRP)', price: '$380.000' },
  ] },
  { id: 'regenerativos', label: 'Regenerativos', title: 'Tratamientos', italicTitle: 'regenerativos', dark: true, note: 'Insumos importados de Corea. Actúan desde adentro: no rellenan, reactivan tu propia piel.', items: [
    { id: 'adn-salmon', name: 'Facial ADN de salmón', description: 'Polinucleótidos con dermapen · regeneración celular', price: '$320.000' },
    { id: 'skinbooster', name: 'Skinbooster hidratación', description: 'Microinyecciones de ácido hialurónico', price: '$550.000' },
    { id: 'pdrn', name: 'Skinbooster PDRN', description: 'Hialurónico + polinucleótidos · máxima firmeza', price: '$680.000' },
  ] },
  { id: 'capilar', label: 'Capilar', title: 'Tratamiento', italicTitle: 'capilar', dark: false, note: 'Para quienes notan el cabello más débil o ven que la caída no se detiene. Actuamos directo en el folículo.', items: [
    { id: 'mesoterapia', name: 'Mesoterapia capilar', description: 'Microinyecciones en cuero cabelludo', price: '$480.000' },
  ] },
  { id: 'bienestar', label: 'Bienestar corporal', title: 'Bienestar', italicTitle: 'corporal', dark: true, note: 'Ideal después de viajes largos, semanas de mucho estrés o entrenamientos exigentes.', items: [
    { id: 'percusion', name: 'Terapia percusiva', description: 'Pistola de masaje · recuperación muscular', price: '$70.000' },
    { id: 'relajante', name: 'Masaje relajante', description: 'Cuerpo completo · 60 minutos', price: '$150.000' },
    { id: 'piedras', name: 'Piedras volcánicas', description: 'Masaje relajante + termoterapia · 75 min', price: '$190.000' },
    { id: 'sueroterapia', name: 'Sueroterapia', description: 'Nutrición celular intravenosa · previa valoración', price: '$260.000' },
  ] },
]
