import { describe, expect, it } from 'vitest'
import { createRng } from '../rng'

describe('createRng', () => {
  it('produces the same sequence for the same seed', () => {
    const a = createRng(42)
    const b = createRng(42)
    const sequenceA = Array.from({ length: 20 }, () => a.next())
    const sequenceB = Array.from({ length: 20 }, () => b.next())
    expect(sequenceA).toEqual(sequenceB)
  })

  it('produces different sequences for different seeds', () => {
    const a = createRng(1)
    const b = createRng(2)
    expect(a.next()).not.toBe(b.next())
  })

  it('resuming from a captured state continues the same sequence', () => {
    const rng = createRng(7)
    rng.next()
    rng.next()
    const capturedState = rng.getState()
    const expectedNext = rng.next()

    const resumed = createRng(capturedState)
    expect(resumed.next()).toBe(expectedNext)
  })

  it('keeps every draw within [0, 1)', () => {
    const rng = createRng(123)
    for (let i = 0; i < 500; i++) {
      const value = rng.next()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})
