import { describe, expect, it } from 'vitest'
import { getMinigameById, MINIGAMES, pickMinigame } from '../registry'

describe('registry de minijuegos', () => {
  it('tiene al menos un minijuego y todos con ids únicos', () => {
    expect(MINIGAMES.length).toBeGreaterThan(0)
    const ids = MINIGAMES.map((minigame) => minigame.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cada definición tiene los campos del contrato completos', () => {
    for (const minigame of MINIGAMES) {
      expect(minigame.id).toBeTruthy()
      expect(minigame.name).toBeTruthy()
      expect(minigame.description).toBeTruthy()
      expect(typeof minigame.Component).toBe('function')
    }
  })

  it('getMinigameById devuelve el minijuego pedido y tira error con un id desconocido', () => {
    const [first] = MINIGAMES
    expect(getMinigameById(first.id)).toBe(first)
    expect(() => getMinigameById('no-existe')).toThrow()
  })

  it('pickMinigame es determinístico y siempre devuelve algo del registry', () => {
    for (const seed of [1, 42, 12345, 987654]) {
      const picked = pickMinigame(seed)
      expect(MINIGAMES).toContain(picked)
      expect(pickMinigame(seed)).toBe(picked)
    }
  })
})
