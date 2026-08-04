import { SAMPLE_EVENTS } from '@/content/events'
import type { CareerState } from '@/types/career'
import type { SeasonEvent } from '@/types/event'
import type { Rng } from './rng'

function isAgeEligible(event: SeasonEvent, age: number): boolean {
  if (event.minAge !== undefined && age < event.minAge) return false
  if (event.maxAge !== undefined && age > event.maxAge) return false
  return true
}

/** Mientras el jugador está a préstamo, no puede recibir un nuevo transfer/préstamo. */
function isBlockedByLoan(event: SeasonEvent, state: CareerState): boolean {
  return Boolean(state.loan) && (event.category === 'transfer' || event.category === 'loan')
}

export function selectEvent(state: CareerState, rng: Rng): SeasonEvent {
  const notBlockedByLoan = SAMPLE_EVENTS.filter((event) => !isBlockedByLoan(event, state))
  const ageEligible = notBlockedByLoan.filter((event) => isAgeEligible(event, state.player.age))
  const pool = ageEligible.length > 0 ? ageEligible : notBlockedByLoan.length > 0 ? notBlockedByLoan : SAMPLE_EVENTS
  return rng.pickWeighted(pool, (event) => event.weight)
}
