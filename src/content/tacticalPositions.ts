import type { Position } from '@/types/player'

export interface TacticalPosition {
  id: string
  base: Position
  /** posición en la cancha, porcentaje desde arriba/izquierda */
  top: number
  left: number
}

/**
 * 12 posiciones tácticas mostradas en la cancha interactiva de creación de jugador.
 * Puramente cosmético — mapean a las 4 posiciones reales del motor (Position),
 * copiadas tal cual del handoff de diseño (coperort.dc.html líneas 411-424).
 */
export const TACTICAL_POSITIONS: TacticalPosition[] = [
  { id: 'POR', base: 'GK', top: 90, left: 50 },
  { id: 'DFC', base: 'DEF', top: 77, left: 50 },
  { id: 'LI', base: 'DEF', top: 65, left: 18 },
  { id: 'LD', base: 'DEF', top: 65, left: 82 },
  { id: 'MCD', base: 'MID', top: 53, left: 50 },
  { id: 'MI', base: 'MID', top: 40, left: 20 },
  { id: 'MC', base: 'MID', top: 40, left: 50 },
  { id: 'MD', base: 'MID', top: 40, left: 80 },
  { id: 'MCO', base: 'MID', top: 27, left: 50 },
  { id: 'EI', base: 'FWD', top: 12, left: 20 },
  { id: 'DC', base: 'FWD', top: 8, left: 50 },
  { id: 'ED', base: 'FWD', top: 12, left: 80 },
]

export function tacticalPositionsForBase(base: Position): TacticalPosition[] {
  return TACTICAL_POSITIONS.filter((position) => position.base === base)
}
