import type { ComponentType } from 'react'
import type { MinigameResult } from '@/types/minigame'

export type { MinigameResult }

export interface MinigameComponentProps {
  /** semilla del motor: el minijuego debe derivar todo su azar de acá para ser reproducible */
  seed: number
  /** 1-100, reputación del rival — cuanto más alta, más difícil */
  difficulty: number
  opponentName: string
  onComplete: (result: MinigameResult) => void
}

/**
 * Contrato de un minijuego. Agregar uno nuevo debería ser solo escribir el componente y
 * sumarlo a `registry.ts` — sin tocar el motor ni las pantallas (ver CLAUDE.md).
 */
export interface MinigameDefinition {
  id: string
  name: string
  description: string
  Component: ComponentType<MinigameComponentProps>
}
