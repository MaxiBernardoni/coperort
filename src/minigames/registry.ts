import { createRng } from '@/engine/rng'
import { dribbleChallenge } from './dribbleChallenge'
import { freeKick } from './freeKick'
import { penaltyShootout } from './penaltyShootout'
import type { MinigameDefinition } from './types'

/**
 * Registry de minijuegos. Agregar uno nuevo es escribir su componente + definición y sumarlo
 * a este array — el motor no se toca (no sabe qué minijuegos existen, solo emite un
 * `PendingMinigame` agnóstico y consume el `MinigameResult`; ver `types/minigame.ts`).
 *
 * Las tres mecánicas son deliberadamente distintas entre sí (lectura / timing / push-your-luck),
 * no variantes de lo mismo.
 */
export const MINIGAMES: MinigameDefinition[] = [penaltyShootout, freeKick, dribbleChallenge]

export function getMinigameById(id: string): MinigameDefinition {
  const minigame = MINIGAMES.find((candidate) => candidate.id === id)
  if (!minigame) throw new Error(`Minijuego desconocido: ${id}`)
  return minigame
}

/** Elige un minijuego de forma determinística a partir de la seed que entregó el motor. */
export function pickMinigame(seed: number): MinigameDefinition {
  return createRng(seed).pick(MINIGAMES)
}
