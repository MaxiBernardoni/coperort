import { describe, expect, it } from 'vitest'
import { careerReducer } from '../careerReducer'
import { getEventById } from '@/content/events'
import type { CareerState, CharacterCreationInput } from '@/types/career'

const testInput: CharacterCreationInput = {
  firstName: 'Diego',
  surname: 'Testagol',
  nationality: 'Argentina',
  jerseyNumber: 10,
  dominantFoot: 'left',
  position: 'FWD',
}

const MAX_SEASONS = 40

/** Simula a la UI: avanza la temporada y siempre elige la primera opción del evento pendiente. */
function runFullCareer(seed: number, input: CharacterCreationInput = testInput): CareerState {
  let state = careerReducer(null, { type: 'CREATE_CAREER', input, seed })
  let iterations = 0
  while (state.phase !== 'RETIRED') {
    state = careerReducer(state, { type: 'ADVANCE_SEASON' })
    if (state.phase === 'EVENT_PENDING') {
      const event = getEventById(state.pendingEventId!)
      state = careerReducer(state, { type: 'RESOLVE_EVENT', choiceId: event.choices[0].id })
    }
    iterations += 1
    if (iterations > MAX_SEASONS) {
      throw new Error('La carrera no llegó a RETIRED dentro del límite de seguridad de temporadas')
    }
  }
  return state
}

/** Compara todo menos el `id`, que usa crypto.randomUUID() y no es determinístico. */
function withoutId(state: CareerState) {
  const { id: _id, ...rest } = state
  return rest
}

describe('careerReducer', () => {
  it('runs a full career from debut (17) to retirement deterministically', () => {
    const state = runFullCareer(12345)

    expect(state.phase).toBe('RETIRED')
    expect(state.player.age).toBe(state.retirementAge)
    expect(state.retirementAge).toBeGreaterThanOrEqual(34)
    expect(state.retirementAge).toBeLessThanOrEqual(38)
    expect(state.eventLog).toHaveLength(state.retirementAge - 17)
  })

  it('keeps the overall rating within the valid 1-99 range every season', () => {
    let state = careerReducer(null, { type: 'CREATE_CAREER', input: testInput, seed: 999 })
    expect(state.player.overallRating).toBeGreaterThanOrEqual(1)
    expect(state.player.overallRating).toBeLessThanOrEqual(99)

    let iterations = 0
    while (state.phase !== 'RETIRED') {
      state = careerReducer(state, { type: 'ADVANCE_SEASON' })
      if (state.phase === 'EVENT_PENDING') {
        const event = getEventById(state.pendingEventId!)
        state = careerReducer(state, { type: 'RESOLVE_EVENT', choiceId: event.choices[0].id })
      }
      expect(state.player.overallRating).toBeGreaterThanOrEqual(1)
      expect(state.player.overallRating).toBeLessThanOrEqual(99)
      iterations += 1
      if (iterations > MAX_SEASONS) throw new Error('La carrera no llegó a RETIRED')
    }
  })

  it('accumulates plausible career stats for a forward', () => {
    const state = runFullCareer(555)

    expect(state.stats.matches).toBeGreaterThan(0)
    expect(state.stats.goals).toBeGreaterThan(0)
    expect(state.stats.assists).toBeGreaterThanOrEqual(0)
    expect(state.stats.peakRating).toBeLessThanOrEqual(99)
    expect(state.stats.peakMarketValue).toBeGreaterThan(0)
  })

  it('is fully deterministic: the same seed produces an identical career', () => {
    const first = runFullCareer(2026)
    const second = runFullCareer(2026)
    expect(withoutId(first)).toEqual(withoutId(second))
  })

  it('produces different careers for different seeds', () => {
    const a = runFullCareer(1)
    const b = runFullCareer(2)
    expect(withoutId(a)).not.toEqual(withoutId(b))
  })

  it('throws if ADVANCE_SEASON is dispatched before CREATE_CAREER', () => {
    expect(() => careerReducer(null, { type: 'ADVANCE_SEASON' })).toThrow()
  })

  it('is a no-op once the career is retired', () => {
    const retired = runFullCareer(42)
    const again = careerReducer(retired, { type: 'ADVANCE_SEASON' })
    expect(again).toBe(retired)
  })

  it('ADVANCE_SEASON moves to EVENT_PENDING with a resolvable pendingEventId, without touching the player yet', () => {
    const created = careerReducer(null, { type: 'CREATE_CAREER', input: testInput, seed: 7 })
    const pending = careerReducer(created, { type: 'ADVANCE_SEASON' })

    expect(pending.phase).toBe('EVENT_PENDING')
    expect(pending.pendingEventId).not.toBeNull()
    expect(() => getEventById(pending.pendingEventId!)).not.toThrow()
    expect(pending.player.age).toBe(created.player.age)
    expect(pending.season).toBe(created.season)
  })

  it('ADVANCE_SEASON is a no-op while an event is already pending', () => {
    const created = careerReducer(null, { type: 'CREATE_CAREER', input: testInput, seed: 7 })
    const pending = careerReducer(created, { type: 'ADVANCE_SEASON' })
    const again = careerReducer(pending, { type: 'ADVANCE_SEASON' })
    expect(again).toBe(pending)
  })

  it('RESOLVE_EVENT applies the chosen effects, advances age/season and clears pendingEventId', () => {
    const created = careerReducer(null, { type: 'CREATE_CAREER', input: testInput, seed: 7 })
    const pending = careerReducer(created, { type: 'ADVANCE_SEASON' })
    const event = getEventById(pending.pendingEventId!)
    const resolved = careerReducer(pending, { type: 'RESOLVE_EVENT', choiceId: event.choices[0].id })

    expect(resolved.pendingEventId).toBeNull()
    expect(resolved.player.age).toBe(created.player.age + 1)
    expect(resolved.season).toBe(created.season + 1)
    expect(resolved.eventLog.at(-1)).toEqual({ season: created.season, eventId: event.id, choiceId: event.choices[0].id })
  })

  it('throws when RESOLVE_EVENT is dispatched with no event pending', () => {
    const created = careerReducer(null, { type: 'CREATE_CAREER', input: testInput, seed: 7 })
    expect(() => careerReducer(created, { type: 'RESOLVE_EVENT', choiceId: 'anything' })).toThrow()
  })

  it('throws when RESOLVE_EVENT is dispatched with an unknown choiceId', () => {
    const created = careerReducer(null, { type: 'CREATE_CAREER', input: testInput, seed: 7 })
    const pending = careerReducer(created, { type: 'ADVANCE_SEASON' })
    expect(() => careerReducer(pending, { type: 'RESOLVE_EVENT', choiceId: 'not-a-real-choice' })).toThrow()
  })

  it('throws if RESOLVE_EVENT is dispatched before CREATE_CAREER', () => {
    expect(() => careerReducer(null, { type: 'RESOLVE_EVENT', choiceId: 'x' })).toThrow()
  })
})
