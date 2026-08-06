import type { StatEffect } from './event'
import type { Position } from './player'

/**
 * Enfoque de pretemporada que el jugador elige entre 3 opciones cada temporada (estilo
 * roguelike). Reusa `StatEffect` a propósito: el reducer ya sabe aplicar esa forma para las
 * elecciones de evento, así que no hace falta maquinaria nueva.
 */
export interface Motivation {
  id: string
  name: string
  description: string
  effects: StatEffect[]
  /** solo se ofrece a partir de esta edad */
  minAge?: number
  /** solo se ofrece hasta esta edad */
  maxAge?: number
  /** si está presente, solo se ofrece a estas posiciones */
  positions?: Position[]
}
