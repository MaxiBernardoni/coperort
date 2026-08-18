import { selectClubForMove, selectDebutClubOffers } from './clubTransition'
import { ATTRIBUTE_KEYS, attributeGrowthDelta, clamp, deriveOverallRating, generateBaseAttributes, marketValueForRating } from './statMath'
import { getRivalArchetypeById, RIVAL_ARCHETYPES } from '@/content/rivalArchetypes'
import { RIVAL_FIRST_NAMES, RIVAL_SURNAMES } from '@/content/rivalNames'
import type { Rng } from './rng'
import type { Club } from '@/types/club'
import type { Position } from '@/types/player'
import type { RivalState } from '@/types/rival'

const POSITIONS: Position[] = ['GK', 'DEF', 'MID', 'FWD']
const DEBUT_AGE = 17

const GOAL_CHANCE_BY_POSITION: Record<Position, number> = { FWD: 0.4, MID: 0.18, DEF: 0.05, GK: 0.01 }
const ASSIST_CHANCE_BY_POSITION: Record<Position, number> = { FWD: 0.18, MID: 0.3, DEF: 0.08, GK: 0.02 }

/**
 * Rival fijo de la carrera: mismo país que el jugador (creció en el mismo lugar), posición y
 * arquetipo aleatorios. Reusa `generateBaseAttributes`/`selectDebutClubOffers` del jugador
 * para no duplicar la generación, pero simula su temporada con una fórmula más liviana
 * (`simulateRivalSeason` acá abajo) — es un personaje de fondo, no necesita la fidelidad
 * completa de `seasonPerformance.ts`.
 */
export function createRival(nationality: string, allClubs: Club[], rng: Rng): RivalState {
  const archetype = rng.pick(RIVAL_ARCHETYPES)
  const position = rng.pick(POSITIONS)

  let attributes = generateBaseAttributes(position, rng)
  for (const key of ATTRIBUTE_KEYS) {
    attributes[key] = clamp(attributes[key] + archetype.baseBoost, 1, 99)
  }

  const overallRating = deriveOverallRating(attributes, position)
  const marketValue = Math.round(marketValueForRating(overallRating, DEBUT_AGE) * archetype.marketValueMultiplier)
  const [club] = selectDebutClubOffers(allClubs, rng, 1)

  return {
    firstName: rng.pick(RIVAL_FIRST_NAMES),
    surname: rng.pick(RIVAL_SURNAMES),
    nationality,
    position,
    archetypeId: archetype.id,
    clubId: club.id,
    attributes,
    overallRating,
    marketValue,
    stats: { matches: 0, goals: 0, assists: 0 },
    titles: 0,
  }
}

function growthMultiplierForAge(age: number, archetype: { youthMultiplier: number; primeMultiplier: number; lateMultiplier: number }): number {
  if (age <= 21) return archetype.youthMultiplier
  if (age <= 32) return archetype.primeMultiplier
  return archetype.lateMultiplier
}

function simulateRivalSeason(rating: number, position: Position, rng: Rng) {
  const matches = rng.randInt(20, 38)
  const skillFactor = rating / 99
  const goalChance = GOAL_CHANCE_BY_POSITION[position] * skillFactor
  const assistChance = ASSIST_CHANCE_BY_POSITION[position] * skillFactor

  let goals = 0
  let assists = 0
  for (let i = 0; i < matches; i++) {
    if (rng.next() < goalChance) goals += 1
    if (rng.next() < assistChance) assists += 1
  }
  return { matches, goals, assists }
}

/**
 * Avanza al rival una temporada: crecimiento (curva base del motor, acentuada por el
 * arquetipo), stats simplificados, chance de título proporcional al rating, y una chance
 * chica de cambiar de club (sin criterio — cualquier club sirve, es color, no una carrera
 * real con transfers/préstamos propios).
 */
export function advanceRival(rival: RivalState, age: number, allClubs: Club[], rng: Rng): RivalState {
  const archetype = getRivalArchetypeById(rival.archetypeId)
  const multiplier = growthMultiplierForAge(age, archetype)

  const attributes = { ...rival.attributes }
  for (const key of ATTRIBUTE_KEYS) {
    const delta = Math.round(attributeGrowthDelta(age, rng) * multiplier)
    attributes[key] = clamp(attributes[key] + delta, 1, 99)
  }

  const overallRating = deriveOverallRating(attributes, rival.position)
  const marketValue = Math.round(marketValueForRating(overallRating, age) * archetype.marketValueMultiplier)

  const performance = simulateRivalSeason(overallRating, rival.position, rng)

  const titleChance = clamp(overallRating / 400, 0.02, 0.25)
  const titles = rng.next() < titleChance ? rival.titles + 1 : rival.titles

  const currentClub = allClubs.find((club) => club.id === rival.clubId) ?? allClubs[0]
  const movesClub = rng.next() < 0.12
  const nextClub = movesClub ? selectClubForMove(currentClub, allClubs, {}, rng, (club) => club.reputation) : currentClub

  return {
    ...rival,
    clubId: (nextClub ?? currentClub).id,
    attributes,
    overallRating,
    marketValue,
    stats: {
      matches: rival.stats.matches + performance.matches,
      goals: rival.stats.goals + performance.goals,
      assists: rival.stats.assists + performance.assists,
    },
    titles,
  }
}
