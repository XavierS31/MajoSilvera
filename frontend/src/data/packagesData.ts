export type TreatmentPackage = { id: string; name: string; sessions: string; price: string; originalPrice: string; savings: string }

export const treatmentPackages: TreatmentPackage[] = [
  { id: 'prp', name: 'Plasma rico en plaquetas', sessions: '5 sesiones · $304.000 c/u', price: '$1.520.000', originalPrice: '$1.900.000', savings: 'Ahorras $380.000' },
  { id: 'capilar', name: 'Mesoterapia capilar', sessions: '4 sesiones · $437.500 c/u', price: '$1.750.000', originalPrice: '$1.920.000', savings: 'Ahorras $170.000' },
  { id: 'suero', name: 'Sueroterapia', sessions: '5 sesiones · $234.000 c/u', price: '$1.170.000', originalPrice: '$1.300.000', savings: 'Ahorras $130.000' },
  { id: 'adn', name: 'ADN de salmón', sessions: '3 sesiones · $283.000 c/u', price: '$850.000', originalPrice: '$960.000', savings: 'Ahorras $110.000' },
  { id: 'neural', name: 'Terapia neural', sessions: '5 sesiones · $170.000 c/u', price: '$850.000', originalPrice: '$1.000.000', savings: 'Ahorras $150.000' },
  { id: 'ondas', name: 'Ondas de choque', sessions: '5 sesiones · $153.000 c/u', price: '$765.000', originalPrice: '$900.000', savings: 'Ahorras $135.000' },
]
