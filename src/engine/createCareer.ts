import { selectDebutClubOffers } from './clubTransition'
import { createRng } from './rng'
import { deriveOverallRating, generateBaseAttributes, marketValueForRating } from './statMath'
import { SAMPLE_CLUBS } from '@/content/clubs'
import type { CareerState, CharacterCreationInput } from '@/types/career'

const DEBUT_AGE = 17

export function createCareer(input: CharacterCreationInput, seed?: number): CareerState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 2 ** 31)
  const rng = createRng(resolvedSeed)

  const attributes = generateBaseAttributes(input.position, rng)
  const overallRating = deriveOverallRating(attributes, input.position)
  const marketValue = marketValueForRating(overallRating, DEBUT_AGE)
  const retirementAge = rng.randInt(34, 38)

  const clubOffers = selectDebutClubOffers(SAMPLE_CLUBS, rng, 3)

  const year = new Date().getFullYear()

  return {
    id: crypto.randomUUID(),
    seed: resolvedSeed,
    rngState: rng.getState(),
    player: {
      identity: {
        firstName: input.firstName,
        surname: input.surname,
        nationality: input.nationality,
        jerseyNumber: input.jerseyNumber,
        dominantFoot: input.dominantFoot,
        position: input.position,
      },
      attributes,
      age: DEBUT_AGE,
      overallRating,
      marketValue,
    },
    currentClub: null,
    clubOffers,
    clubHistory: [],
    retirementAge,
    season: 1,
    year,
    phase: 'CLUB_PENDING',
    pendingEventId: null,
    loan: null,
    stats: { matches: 0, goals: 0, assists: 0, peakRating: overallRating, peakMarketValue: marketValue },
    titles: [],
    eventLog: [],
    seasonHistory: [],
  }
}
