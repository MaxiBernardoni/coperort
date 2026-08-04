/**
 * Deterministic PRNG (mulberry32). Given the same seed/state, `next()` always
 * produces the same sequence — this is what makes a career reproducible from
 * its seed alone.
 */
export function mulberry32Step(state: number): { value: number; nextState: number } {
  const nextState = (state + 0x6d2b79f5) | 0
  let t = nextState
  t = Math.imul(t ^ (t >>> 15), 1 | t)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296
  return { value, nextState }
}

export interface Rng {
  next: () => number
  randInt: (min: number, max: number) => number
  pick: <T>(items: readonly T[]) => T
  pickWeighted: <T>(items: readonly T[], weight: (item: T) => number) => T
  getState: () => number
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0

  const next = (): number => {
    const { value, nextState } = mulberry32Step(state)
    state = nextState
    return value
  }

  const randInt = (min: number, max: number): number => Math.floor(next() * (max - min + 1)) + min

  const pick = <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)]

  const pickWeighted = <T>(items: readonly T[], weight: (item: T) => number): T => {
    const total = items.reduce((sum, item) => sum + weight(item), 0)
    let roll = next() * total
    for (const item of items) {
      roll -= weight(item)
      if (roll <= 0) return item
    }
    return items[items.length - 1]
  }

  return { next, randInt, pick, pickWeighted, getState: () => state }
}
