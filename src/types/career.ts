import type { Club } from './club'
import type { Foot, PlayerState, Position } from './player'

export interface CharacterCreationInput {
  firstName: string
  surname: string
  nationality: string
  jerseyNumber: number
  dominantFoot: Foot
  position: Position
}

export interface CareerStats {
  matches: number
  goals: number
  assists: number
  peakRating: number
  peakMarketValue: number
}

export interface ClubStint {
  clubId: string
  fromYear: number
  toYear: number | null
}

export type CareerPhase = 'ACTIVE' | 'EVENT_PENDING' | 'RETIRED'

export interface LoanState {
  parentClubId: string
  /** año en el que el jugador vuelve automáticamente al club de origen */
  returnYear: number
}

/**
 * `type` solo tiene `'league'` por ahora. `'cup'` se agrega en la Fase 4 cuando exista
 * `engine/trophyEngine.ts` — no declararlo antes de tener código que lo llene (mismo criterio
 * que se usó con `CareerAction` en la Fase 1).
 */
export interface Title {
  type: 'league'
  season: number
  year: number
  clubId: string
  country: string
  tier: 1 | 2
}

export interface CareerState {
  id: string
  seed: number
  /** estado interno del PRNG (mulberry32); junto con `seed` hace la carrera reproducible */
  rngState: number
  player: PlayerState
  currentClub: Club
  clubHistory: ClubStint[]
  retirementAge: number
  season: number
  year: number
  phase: CareerPhase
  /** id del evento que espera una elección del usuario cuando `phase === 'EVENT_PENDING'` */
  pendingEventId: string | null
  /** club de origen y fecha de retorno mientras el jugador está a préstamo en otro club */
  loan: LoanState | null
  stats: CareerStats
  titles: Title[]
  eventLog: { season: number; eventId: string; choiceId: string }[]
}

export type CareerAction =
  | { type: 'CREATE_CAREER'; input: CharacterCreationInput; seed?: number }
  | { type: 'ADVANCE_SEASON' }
  | { type: 'RESOLVE_EVENT'; choiceId: string }
