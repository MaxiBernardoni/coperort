import type { Club } from './club'
import type { MinigameResult, PendingMinigame } from './minigame'
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

export type CareerPhase = 'CLUB_PENDING' | 'ACTIVE' | 'EVENT_PENDING' | 'MINIGAME_PENDING' | 'RETIRED'

export interface LoanState {
  parentClubId: string
  /** año en el que el jugador vuelve automáticamente al club de origen */
  returnYear: number
}

/**
 * `'league'` lo resuelve automáticamente `engine/leagueEngine.ts` cada temporada; `'cup'`
 * lo otorga `engine/trophyEngine.ts` solo si el jugador gana la final jugando el minijuego
 * (Fase 4). `awards`/`rival` siguen sin existir, se agregan en Fase 7/8.
 */
export interface Title {
  type: 'league' | 'cup'
  season: number
  year: number
  clubId: string
  country: string
  tier: 1 | 2
}

export interface SeasonHistoryEntry {
  season: number
  year: number
  age: number
  clubId: string
  overallRating: number
  matches: number
  goals: number
  assists: number
}

export interface CareerState {
  id: string
  seed: number
  /** estado interno del PRNG (mulberry32); junto con `seed` hace la carrera reproducible */
  rngState: number
  player: PlayerState
  /** `null` solo mientras `phase === 'CLUB_PENDING'`, antes de que el jugador elija una oferta */
  currentClub: Club | null
  /** ofertas de club de debut, ponderadas por reputación; solo pobladas durante `CLUB_PENDING` */
  clubOffers: Club[]
  clubHistory: ClubStint[]
  retirementAge: number
  season: number
  year: number
  phase: CareerPhase
  /** id del evento que espera una elección del usuario cuando `phase === 'EVENT_PENDING'` */
  pendingEventId: string | null
  /** final de copa esperando que el usuario la juegue cuando `phase === 'MINIGAME_PENDING'` */
  pendingMinigame: PendingMinigame | null
  /** club de origen y fecha de retorno mientras el jugador está a préstamo en otro club */
  loan: LoanState | null
  stats: CareerStats
  titles: Title[]
  eventLog: { season: number; eventId: string; choiceId: string }[]
  /** snapshot por temporada resuelta (edad, club, rating, PJ/GLS/AST) — usado por el timeline de carrera */
  seasonHistory: SeasonHistoryEntry[]
}

export type CareerAction =
  | { type: 'CREATE_CAREER'; input: CharacterCreationInput; seed?: number }
  | { type: 'SELECT_CLUB'; clubId: string }
  | { type: 'ADVANCE_SEASON' }
  | { type: 'RESOLVE_EVENT'; choiceId: string }
  | { type: 'RESOLVE_MINIGAME'; result: MinigameResult }
