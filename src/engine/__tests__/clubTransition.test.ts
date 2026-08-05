import { describe, expect, it } from 'vitest'
import { applyLoanReturn, applyLoanStart, applyTransfer, selectClubForMove, selectDebutClubOffers } from '../clubTransition'
import { createRng } from '../rng'
import { careerReducer } from '../careerReducer'
import { getClubById, SAMPLE_CLUBS } from '@/content/clubs'
import type { CareerState, CharacterCreationInput } from '@/types/career'
import type { Club } from '@/types/club'

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

const equalWeight = () => 1

describe('selectClubForMove', () => {
  it('nunca elige el club actual', () => {
    const rng = createRng(1)
    const currentClub = SAMPLE_CLUBS[0]
    for (let i = 0; i < 50; i++) {
      const picked = selectClubForMove(currentClub, SAMPLE_CLUBS, {}, rng, equalWeight)
      expect(picked?.id).not.toBe(currentClub.id)
    }
  })

  it('respeta el criterio cuando hay candidatos que lo cumplen', () => {
    const rng = createRng(2)
    const currentClub = getClubById('tigre')
    const picked = selectClubForMove(currentClub, SAMPLE_CLUBS, { reputationMin: 90 }, rng, equalWeight)
    expect(picked).not.toBeNull()
    expect(picked!.reputation).toBeGreaterThanOrEqual(90)
  })

  it('relaja los límites de reputación si nadie los cumple, pero mantiene otros criterios', () => {
    const rng = createRng(3)
    const currentClub = getClubById('tigre')
    // ningún club llega a reputación 999: fuerza la relajación de reputationMin
    const picked = selectClubForMove(currentClub, SAMPLE_CLUBS, { reputationMin: 999, tier: 1 }, rng, equalWeight)
    expect(picked).not.toBeNull()
    expect(picked!.tier).toBe(1)
  })

  it('se rinde y devuelve cualquier otro club si ningún criterio tiene candidatos', () => {
    const rng = createRng(4)
    const currentClub = getClubById('tigre')
    const picked = selectClubForMove(currentClub, SAMPLE_CLUBS, { reputationMin: 999, sameCountry: true, tier: 2 }, rng, equalWeight)
    expect(picked).not.toBeNull()
    expect(picked!.id).not.toBe(currentClub.id)
  })

  it('devuelve null si no hay ningún otro club en el pool', () => {
    const rng = createRng(5)
    const currentClub = SAMPLE_CLUBS[0]
    const picked = selectClubForMove(currentClub, [currentClub], {}, rng, equalWeight)
    expect(picked).toBeNull()
  })
})

describe('selectDebutClubOffers', () => {
  it('devuelve hasta `count` clubes distintos', () => {
    const rng = createRng(10)
    const offers = selectDebutClubOffers(SAMPLE_CLUBS, rng, 3)
    const ids = offers.map((club) => club.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(offers.length).toBeLessThanOrEqual(3)
    expect(offers.length).toBeGreaterThan(0)
  })

  it('relaja al pool completo si hay menos candidatos de baja reputación que `count`', () => {
    const rng = createRng(11)
    const highReputationOnly: Club[] = SAMPLE_CLUBS.filter((club) => club.reputation >= 40)
    const offers = selectDebutClubOffers(highReputationOnly, rng, 3)
    expect(offers.length).toBeGreaterThan(0)
  })

  it('devuelve un array vacío si no hay ningún club', () => {
    const rng = createRng(12)
    expect(selectDebutClubOffers([], rng, 3)).toEqual([])
  })

  it('nunca llama pickWeighted sobre un array vacío incluso pidiendo más ofertas que clubes disponibles', () => {
    const rng = createRng(13)
    const twoClubs = SAMPLE_CLUBS.slice(0, 2)
    const offers = selectDebutClubOffers(twoClubs, rng, 5)
    expect(offers.length).toBe(2)
  })
})

describe('applyTransfer', () => {
  it('cambia el club actual, cierra el stint anterior y limpia el préstamo', () => {
    const state = activeState(20)
    const destination = SAMPLE_CLUBS.find((club) => club.id !== state.currentClub!.id)!
    const result = applyTransfer(state, destination, state.year + 1)

    expect(result.currentClub).toBe(destination)
    expect(result.loan).toBeNull()
    expect(result.clubHistory).toHaveLength(2)
    expect(result.clubHistory[0].toYear).toBe(state.year + 1)
    expect(result.clubHistory[1]).toEqual({ clubId: destination.id, fromYear: state.year + 1, toYear: null })
  })
})

describe('applyLoanStart y applyLoanReturn', () => {
  it('applyLoanStart manda al jugador al club prestador y guarda el club de origen', () => {
    const state = activeState(21)
    const parentClubId = state.currentClub!.id
    const loanClub = SAMPLE_CLUBS.find((club) => club.id !== parentClubId)!
    const result = applyLoanStart(state, loanClub, state.year + 1, 1)

    expect(result.currentClub).toBe(loanClub)
    expect(result.loan).toEqual({ parentClubId, returnYear: state.year + 2 })
  })

  it('applyLoanReturn devuelve al jugador al club de origen y limpia el préstamo', () => {
    const state = activeState(22)
    const parentClubId = state.currentClub!.id
    const loanClub = SAMPLE_CLUBS.find((club) => club.id !== parentClubId)!
    const started = applyLoanStart(state, loanClub, state.year + 1, 1)
    const onLoanState: CareerState = { ...state, ...started }

    const returned = applyLoanReturn(onLoanState, state.year + 2)
    expect(returned.currentClub!.id).toBe(parentClubId)
    expect(returned.loan).toBeNull()
  })

  it('applyLoanReturn tira error si no hay préstamo activo', () => {
    const state = activeState(23)
    expect(() => applyLoanReturn(state, state.year + 1)).toThrow()
  })
})
