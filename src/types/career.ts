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

export type CareerPhase = 'ACTIVE' | 'RETIRED'

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
  stats: CareerStats
  eventLog: { season: number; eventId: string; choiceId: string }[]
}

export type CareerAction =
  | { type: 'CREATE_CAREER'; input: CharacterCreationInput; seed?: number }
  | { type: 'ADVANCE_SEASON' }
