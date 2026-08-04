import type { Rng } from './rng'
import type { PlayerAttributes, Position } from '@/types/player'

export const ATTRIBUTE_KEYS: (keyof PlayerAttributes)[] = [
  'pace',
  'shooting',
  'passing',
  'dribbling',
  'defending',
  'physical',
  'goalkeeping',
]

/** Atributos que cada posición prioriza al generar el jugador y al calcular el rating. */
const POSITION_WEIGHTS: Record<Position, Partial<Record<keyof PlayerAttributes, number>>> = {
  GK: { goalkeeping: 0.7, physical: 0.15, passing: 0.15 },
  DEF: { defending: 0.45, physical: 0.25, passing: 0.15, pace: 0.15 },
  MID: { passing: 0.3, dribbling: 0.25, physical: 0.15, defending: 0.15, pace: 0.15 },
  FWD: { shooting: 0.4, pace: 0.25, dribbling: 0.25, physical: 0.1 },
}

export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

export function generateBaseAttributes(position: Position, rng: Rng): PlayerAttributes {
  const attributes = ATTRIBUTE_KEYS.reduce<PlayerAttributes>(
    (acc, key) => {
      acc[key] = rng.randInt(30, 45)
      return acc
    },
    {} as PlayerAttributes,
  )

  const weights = POSITION_WEIGHTS[position]
  for (const key of Object.keys(weights) as (keyof PlayerAttributes)[]) {
    attributes[key] = clamp(attributes[key] + rng.randInt(20, 35), 1, 99)
  }

  return attributes
}

/**
 * Delta de crecimiento por atributo en una temporada. Sigue la curva de una
 * carrera real: crecimiento fuerte hasta los 21, estable hasta el pico
 * (26-32), declive después.
 */
export function attributeGrowthDelta(age: number, rng: Rng): number {
  if (age <= 21) return rng.randInt(2, 5)
  if (age <= 25) return rng.randInt(1, 3)
  if (age <= 32) return rng.randInt(-1, 1)
  return rng.randInt(-5, -2)
}

export function deriveOverallRating(attributes: PlayerAttributes, position: Position): number {
  const weights = POSITION_WEIGHTS[position]
  const weighted = Object.entries(weights).reduce(
    (sum, [key, weight]) => sum + attributes[key as keyof PlayerAttributes] * (weight ?? 0),
    0,
  )
  return Math.round(clamp(weighted, 1, 99))
}

export function marketValueForRating(rating: number, age: number): number {
  const ageFactor = age <= 27 ? 1 : Math.max(0.2, 1 - (age - 27) * 0.08)
  return Math.round(rating ** 2.5 * ageFactor * 50)
}
