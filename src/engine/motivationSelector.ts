import { MOTIVATIONS } from '@/content/motivations'
import type { Rng } from './rng'
import type { Motivation } from '@/types/motivation'
import type { Position } from '@/types/player'

function isEligible(motivation: Motivation, age: number, position: Position): boolean {
  if (motivation.minAge !== undefined && age < motivation.minAge) return false
  if (motivation.maxAge !== undefined && age > motivation.maxAge) return false
  if (motivation.positions && !motivation.positions.includes(position)) return false
  return true
}

/**
 * Ofrece `count` enfoques de pretemporada distintos para la edad y posición del jugador.
 * Si el filtro deja menos candidatos de los pedidos relaja al pool completo, mismo criterio
 * que ya usan `eventSelector.ts` y `clubTransition.ts#selectDebutClubOffers` — así nunca se
 * llama `pick` sobre un array vacío ni se devuelve una oferta corta por un hueco de contenido.
 */
export function selectMotivationOffers(age: number, position: Position, rng: Rng, count = 3): Motivation[] {
  const eligible = MOTIVATIONS.filter((motivation) => isEligible(motivation, age, position))
  const pool = eligible.length >= count ? eligible : MOTIVATIONS

  const working = [...pool]
  const offers: Motivation[] = []
  const offerCount = Math.min(count, working.length)

  for (let i = 0; i < offerCount; i++) {
    const picked = rng.pick(working)
    offers.push(picked)
    working.splice(working.indexOf(picked), 1)
  }

  return offers
}
