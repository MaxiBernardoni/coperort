import type { PlayerState, Position } from '@/types/player'
import type { Rng } from './rng'

export interface SeasonPerformance {
  matches: number
  goals: number
  assists: number
}

const GOAL_CHANCE_BY_POSITION: Record<Position, number> = { FWD: 0.45, MID: 0.2, DEF: 0.05, GK: 0.01 }
const ASSIST_CHANCE_BY_POSITION: Record<Position, number> = { FWD: 0.2, MID: 0.35, DEF: 0.1, GK: 0.02 }

export function simulateSeasonPerformance(player: PlayerState, rng: Rng): SeasonPerformance {
  const matches = rng.randInt(20, 38)
  const { attributes, identity } = player

  const shootingFactor = (attributes.shooting + attributes.dribbling) / 200
  const passingFactor = (attributes.passing + attributes.dribbling) / 200
  const goalChance = GOAL_CHANCE_BY_POSITION[identity.position] * shootingFactor
  const assistChance = ASSIST_CHANCE_BY_POSITION[identity.position] * passingFactor

  let goals = 0
  let assists = 0
  for (let i = 0; i < matches; i++) {
    if (rng.next() < goalChance) goals += 1
    if (rng.next() < assistChance) assists += 1
  }

  return { matches, goals, assists }
}
