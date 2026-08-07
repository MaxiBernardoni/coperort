import { describe, expect, it } from 'vitest'
import { cupFinalChance, resolveCupFinal } from '../trophyEngine'
import { createRng } from '../rng'
import { getClubById, SAMPLE_CLUBS } from '@/content/clubs'
import type { Club } from '@/types/club'

/** Corre N intentos y devuelve cuántas veces hubo final y contra quiénes. */
function sampleFinals(playerClub: Club, seed: number, attempts: number) {
  const rng = createRng(seed)
  const opponents: Club[] = []
  for (let i = 0; i < attempts; i++) {
    const opponent = resolveCupFinal(SAMPLE_CLUBS, playerClub, rng)
    if (opponent) opponents.push(opponent)
  }
  return opponents
}

describe('cupFinalChance', () => {
  it('escala con la reputación y se mantiene dentro de [0.15, 0.30]', () => {
    const small = cupFinalChance(getClubById('san-telmo'))
    const big = cupFinalChance(getClubById('boca-juniors'))

    expect(big).toBeGreaterThan(small)
    for (const club of SAMPLE_CLUBS) {
      expect(cupFinalChance(club)).toBeGreaterThanOrEqual(0.15)
      expect(cupFinalChance(club)).toBeLessThanOrEqual(0.3)
    }
  })
})

describe('resolveCupFinal', () => {
  it('el rival siempre es otro club del mismo país', () => {
    const playerClub = getClubById('river-plate')
    const opponents = sampleFinals(playerClub, 1, 200)

    expect(opponents.length).toBeGreaterThan(0)
    for (const opponent of opponents) {
      expect(opponent.id).not.toBe(playerClub.id)
      expect(opponent.country).toBe(playerClub.country)
    }
  })

  it('es determinístico: la misma seed produce la misma secuencia de finales', () => {
    const playerClub = getClubById('boca-juniors')
    const first = sampleFinals(playerClub, 99, 50).map((club) => club.id)
    const second = sampleFinals(playerClub, 99, 50).map((club) => club.id)

    expect(first).toEqual(second)
  })

  it('un club de reputación alta llega a la final más seguido que uno de reputación baja', () => {
    const big = sampleFinals(getClubById('boca-juniors'), 7, 400).length
    const small = sampleFinals(getClubById('san-telmo'), 7, 400).length

    expect(big).toBeGreaterThan(small)
  })

  it('devuelve null si el país del club no tiene ningún otro club', () => {
    const rng = createRng(3)
    // Club sintético, único de su país (antes se usaba Manchester City, pero
    // desde la Fase 3b Europa ya tiene rivales reales en Inglaterra).
    const lonelyClub: Club = { id: 'lonely-fc', name: 'Lonely FC', country: 'Solandia', tier: 1, reputation: 80 }
    // 100 intentos: aunque clasifique, no hay rival posible en Solandia
    for (let i = 0; i < 100; i++) {
      expect(resolveCupFinal(SAMPLE_CLUBS, lonelyClub, rng)).toBeNull()
    }
  })

  it('la copa cruza divisiones: el rival puede ser de otro tier', () => {
    const playerClub = getClubById('river-plate')
    const opponents = sampleFinals(playerClub, 11, 400)
    const tiers = new Set(opponents.map((club) => club.tier))

    expect(tiers.size).toBeGreaterThan(1)
  })
})
