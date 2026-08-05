import { describe, expect, it } from 'vitest'
import { resolveLeagueWinner } from '../leagueEngine'
import { createRng } from '../rng'
import { SAMPLE_CLUBS } from '@/content/clubs'

describe('resolveLeagueWinner', () => {
  it('siempre devuelve un club del mismo país y división que el grupo pedido', () => {
    const rng = createRng(1)
    for (let i = 0; i < 30; i++) {
      const winner = resolveLeagueWinner(SAMPLE_CLUBS, { country: 'Argentina', tier: 1 }, rng)
      expect(winner.country).toBe('Argentina')
      expect(winner.tier).toBe(1)
    }
  })

  it('un grupo de un solo club siempre lo devuelve a él', () => {
    const rng = createRng(2)
    const winner = resolveLeagueWinner(SAMPLE_CLUBS, { country: 'Inglaterra', tier: 1 }, rng)
    expect(winner.id).toBe('manchester-city')
  })

  it('es determinístico: mismo estado de rng produce el mismo ganador', () => {
    const first = resolveLeagueWinner(SAMPLE_CLUBS, { country: 'España', tier: 1 }, createRng(42))
    const second = resolveLeagueWinner(SAMPLE_CLUBS, { country: 'España', tier: 1 }, createRng(42))
    expect(first.id).toBe(second.id)
  })

  it('clubes con más reputación ganan con más frecuencia dentro del mismo grupo', () => {
    const rng = createRng(7)
    const wins = new Map<string, number>()
    for (let i = 0; i < 400; i++) {
      const winner = resolveLeagueWinner(SAMPLE_CLUBS, { country: 'España', tier: 1 }, rng)
      wins.set(winner.id, (wins.get(winner.id) ?? 0) + 1)
    }
    // real-madrid (97) y barcelona (96) tienen mucha más reputación que sevilla (72)
    expect(wins.get('real-madrid') ?? 0).toBeGreaterThan(wins.get('sevilla') ?? 0)
  })
})
