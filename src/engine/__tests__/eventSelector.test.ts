import { describe, expect, it } from 'vitest'
import { selectEvent } from '../eventSelector'
import { careerReducer } from '../careerReducer'
import { createRng } from '../rng'
import { SAMPLE_EVENTS } from '@/content/events'
import type { CareerState, CharacterCreationInput } from '@/types/career'

const testInput: CharacterCreationInput = {
  firstName: 'Diego',
  surname: 'Testagol',
  nationality: 'Argentina',
  jerseyNumber: 10,
  dominantFoot: 'left',
  position: 'FWD',
}

function activeState(seed: number): CareerState {
  const created = careerReducer(null, { type: 'CREATE_CAREER', input: testInput, seed })
  return careerReducer(created, { type: 'SELECT_CLUB', clubId: created.clubOffers[0].id })
}

describe('selectEvent', () => {
  it('nunca elige un evento fuera del rango minAge/maxAge del jugador', () => {
    const state = activeState(1)
    const rng = createRng(99)
    for (let age = 17; age <= 40; age++) {
      const withAge: CareerState = { ...state, player: { ...state.player, age } }
      const event = selectEvent(withAge, rng)
      if (event.minAge !== undefined) expect(age).toBeGreaterThanOrEqual(event.minAge)
      if (event.maxAge !== undefined) expect(age).toBeLessThanOrEqual(event.maxAge)
    }
  })

  it('nunca elige un evento de categoría transfer o loan mientras el jugador está a préstamo', () => {
    const state = activeState(2)
    const onLoan: CareerState = {
      ...state,
      loan: { parentClubId: state.currentClub!.id, returnYear: state.year + 1 },
    }
    const rng = createRng(123)
    for (let i = 0; i < 100; i++) {
      const event = selectEvent(onLoan, rng)
      expect(['transfer', 'loan']).not.toContain(event.category)
    }
  })

  it('sin préstamo activo, sí puede elegir eventos de transfer o loan', () => {
    const state = activeState(3)
    const withAge: CareerState = { ...state, player: { ...state.player, age: 22 } }
    const rng = createRng(456)
    const categories = new Set<string>()
    for (let i = 0; i < 200; i++) {
      categories.add(selectEvent(withAge, rng).category)
    }
    expect(categories.has('transfer') || categories.has('loan')).toBe(true)
  })

  it('si ningún evento cumple minAge/maxAge para la edad, relaja al pool completo (sin tirar error)', () => {
    const state = activeState(4)
    const veryOldAge: CareerState = { ...state, player: { ...state.player, age: 200 } }
    const rng = createRng(5)
    expect(() => selectEvent(veryOldAge, rng)).not.toThrow()
  })

  it('el evento elegido siempre pertenece a SAMPLE_EVENTS', () => {
    const state = activeState(6)
    const rng = createRng(7)
    const event = selectEvent(state, rng)
    expect(SAMPLE_EVENTS.some((candidate) => candidate.id === event.id)).toBe(true)
  })
})
