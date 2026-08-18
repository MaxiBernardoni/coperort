import type { RivalArchetype } from '@/types/rival'

/**
 * Arquetipos de crecimiento del rival — cada uno acentúa o atenúa la curva base
 * (`attributeGrowthDelta`) en una franja de edad distinta, para que cada carrera tenga un
 * rival con una historia de fondo reconocible sin necesitar texto propio por temporada.
 */
export const RIVAL_ARCHETYPES: RivalArchetype[] = [
  {
    id: 'the-prodigy',
    name: 'El Precoz',
    description: 'Debutó altísimo y fue noticia desde chico, pero se estanca antes que el resto.',
    baseBoost: 8,
    youthMultiplier: 1.5,
    primeMultiplier: 0.6,
    lateMultiplier: 1,
    marketValueMultiplier: 1,
  },
  {
    id: 'the-late-bloomer',
    name: 'El Tardío',
    description: 'Arrancó discreto, casi invisible, pero sigue mejorando bien pasados los 25.',
    baseBoost: -8,
    youthMultiplier: 0.6,
    primeMultiplier: 1.6,
    lateMultiplier: 1,
    marketValueMultiplier: 1,
  },
  {
    id: 'the-steady-one',
    name: 'El Todoterreno',
    description: 'Sin techo ni piso pronunciado: parejo temporada a temporada, sin sobresaltos.',
    baseBoost: 0,
    youthMultiplier: 1,
    primeMultiplier: 1,
    lateMultiplier: 1,
    marketValueMultiplier: 1,
  },
  {
    id: 'the-media-darling',
    name: 'La Estrella Mediática',
    description: 'Crece rápido en la cancha, pero su cotización crece todavía más rápido afuera.',
    baseBoost: 4,
    youthMultiplier: 1.2,
    primeMultiplier: 1.1,
    lateMultiplier: 0.8,
    marketValueMultiplier: 1.6,
  },
  {
    id: 'the-grinder',
    name: 'El Currante',
    description: 'Crecimiento lento pero constante, y un declive final mucho más suave que el resto.',
    baseBoost: -4,
    youthMultiplier: 0.8,
    primeMultiplier: 1,
    lateMultiplier: 0.4,
    marketValueMultiplier: 1,
  },
]

export function getRivalArchetypeById(id: string): RivalArchetype {
  const archetype = RIVAL_ARCHETYPES.find((candidate) => candidate.id === id)
  if (!archetype) throw new Error(`Arquetipo de rival desconocido: ${id}`)
  return archetype
}
