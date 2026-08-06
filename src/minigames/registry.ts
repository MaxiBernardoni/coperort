import { createRng } from '@/engine/rng'
import { penaltyShootout } from './penaltyShootout'
import type { MinigameDefinition } from './types'

/**
 * Registry de minijuegos. Agregar uno nuevo es escribir su componente + definición y sumarlo
 * a este array — el motor no se toca (no sabe qué minijuegos existen, solo emite un
 * `PendingMinigame` agnóstico y consume el `MinigameResult`; ver `types/minigame.ts`).
 *
 * Fase 5 suma `freeKick` y `dribbleChallenge` acá.
 */
export const MINIGAMES: MinigameDefinition[] = [penaltyShootout]

export function getMinigameById(id: string): MinigameDefinition {
  const minigame = MINIGAMES.find((candidate) => candidate.id === id)
  if (!minigame) throw new Error(`Minijuego desconocido: ${id}`)
  return minigame
}

/** Elige un minijuego de forma determinística a partir de la seed que entregó el motor. */
export function pickMinigame(seed: number): MinigameDefinition {
  return createRng(seed).pick(MINIGAMES)
}
