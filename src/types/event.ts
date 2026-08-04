import type { PlayerAttributes } from './player'

export type EventCategory = 'training' | 'transfer' | 'loan' | 'injury' | 'diet' | 'scandal' | 'media' | 'personal'

export interface StatEffect {
  target: keyof PlayerAttributes | 'marketValue'
  op: 'add' | 'multiply'
  value: number
}

export interface ClubMoveCriteria {
  reputationMin?: number
  reputationMax?: number
  sameCountry?: boolean
  tier?: 1 | 2
}

export interface LoanEffect extends ClubMoveCriteria {
  /** temporadas hasta el retorno automático al club de origen; default 1 */
  durationSeasons?: number
}

export interface InjuryEffect {
  /** fracción [0,1] de partidos perdidos esta temporada */
  matchesReductionPct: number
}

export interface EventChoice {
  id: string
  label: string
  effects: StatEffect[]
  /** si está presente, esta elección mueve al jugador a otro club de forma permanente */
  transfer?: ClubMoveCriteria
  /** si está presente, esta elección manda al jugador a préstamo (vuelve solo) */
  loan?: LoanEffect
  /** si está presente, esta elección reduce los partidos jugados esa temporada */
  injury?: InjuryEffect
}

export interface SeasonEvent {
  id: string
  category: EventCategory
  minAge?: number
  maxAge?: number
  text: string
  choices: EventChoice[]
  /** peso relativo para la selección aleatoria ponderada */
  weight: number
}
