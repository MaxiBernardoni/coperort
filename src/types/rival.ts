import type { PlayerAttributes, Position } from './player'

/**
 * Perfil de crecimiento del rival. Los multiplicadores se aplican sobre el mismo
 * `attributeGrowthDelta(age)` que usa el jugador real, así el rival envejece con la misma
 * curva base (fuerte hasta 21, estable hasta 32, declive después) pero acentuada o atenuada
 * según el arquetipo — sin necesitar una curva propia.
 */
export interface RivalArchetype {
  id: string
  name: string
  description: string
  /** ajuste a los atributos iniciales, aplicado una sola vez al crearlo */
  baseBoost: number
  youthMultiplier: number
  primeMultiplier: number
  lateMultiplier: number
  /** encima del valor de mercado que le tocaría por rating, para arquetipos mediáticos */
  marketValueMultiplier: number
}

export interface RivalStats {
  matches: number
  goals: number
  assists: number
}

/**
 * Rival fijo de la carrera: se genera una sola vez en `createCareer` (determinístico, mismo
 * seed que el resto) y evoluciona en paralelo cada temporada en `resolveEvent`. Vive dentro de
 * `CareerState` — no tiene tabla propia en Supabase, viaja con el resto del `state` jsonb.
 */
export interface RivalState {
  firstName: string
  surname: string
  nationality: string
  position: Position
  archetypeId: string
  clubId: string
  attributes: PlayerAttributes
  overallRating: number
  marketValue: number
  stats: RivalStats
  /** cantidad de títulos ganados — a diferencia del jugador, no se detalla tipo/año/club */
  titles: number
}
