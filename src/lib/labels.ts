import type { PlayerAttributes, Position, Foot } from '@/types/player'
import type { EventCategory } from '@/types/event'

export const POSITION_LABELS: Record<Position, string> = {
  GK: 'Arquero',
  DEF: 'Defensor',
  MID: 'Mediocampista',
  FWD: 'Delantero',
}

export const POSITION_SHORT_LABELS: Record<Position, string> = {
  GK: 'POR',
  DEF: 'DEF',
  MID: 'MED',
  FWD: 'DEL',
}

export const FOOT_LABELS: Record<Foot, string> = {
  right: 'Derecho',
  left: 'Izquierdo',
  both: 'Ambidiestro',
}

export const ATTRIBUTE_LABELS: Record<keyof PlayerAttributes, string> = {
  pace: 'Ritmo',
  shooting: 'Definición',
  passing: 'Pase',
  dribbling: 'Regate',
  defending: 'Defensa',
  physical: 'Físico',
  goalkeeping: 'Atajada',
}

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  training: 'Entrenamiento',
  transfer: 'Transferencia',
  loan: 'Préstamo',
  injury: 'Lesión',
  diet: 'Alimentación',
  scandal: 'Escándalo',
  media: 'Prensa',
  personal: 'Personal',
}

export function formatCurrency(value: number): string {
  return `€${value.toLocaleString('es-AR')}`
}
