import { SAMPLE_EVENTS } from '@/content/events'
import type { CareerState } from '@/types/career'
import type { SeasonEvent } from '@/types/event'
import type { Rng } from './rng'

export function selectEvent(state: CareerState, rng: Rng): SeasonEvent {
  const eligible = SAMPLE_EVENTS.filter((event) => {
    if (event.minAge !== undefined && state.player.age < event.minAge) return false
    if (event.maxAge !== undefined && state.player.age > event.maxAge) return false
    return true
  })
  const pool = eligible.length > 0 ? eligible : SAMPLE_EVENTS
  return rng.pickWeighted(pool, (event) => event.weight)
}
