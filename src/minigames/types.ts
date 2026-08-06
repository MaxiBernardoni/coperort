import type { ComponentType } from 'react'
import type { MinigameResult } from '@/types/minigame'
import type { PlayerAttributes } from '@/types/player'

export type { MinigameResult }

export interface MinigameComponentProps {
  /** semilla del motor: el minijuego debe derivar todo su azar de acá para ser reproducible */
  seed: number
  /** 1-100, reputación del rival — cuanto más alta, más difícil */
  difficulty: number
  opponentName: string
  /**
   * Atributos del jugador. Se pasan enteros y cada minijuego elige los que le sirven
   * (penales -> shooting, tiro libre -> shooting/passing, gambeta -> dribbling/pace),
   * así el contrato no se amplía cada vez que se suma uno con necesidades distintas.
   */
  attributes: PlayerAttributes
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
