import { DIET_EVENTS } from './diet'
import { INJURY_EVENTS } from './injury'
import { LOAN_EVENTS } from './loan'
import { MEDIA_EVENTS } from './media'
import { PERSONAL_EVENTS } from './personal'
import { SCANDAL_EVENTS } from './scandal'
import { TRAINING_EVENTS } from './training'
import { TRANSFER_EVENTS } from './transfer'
import type { SeasonEvent } from '@/types/event'

/** Contenido narrativo hardcodeado a mano, organizado por categoría (ver `EventCategory` en `types/event.ts`). */
export const SAMPLE_EVENTS: SeasonEvent[] = [
  ...TRAINING_EVENTS,
  ...DIET_EVENTS,
  ...INJURY_EVENTS,
  ...TRANSFER_EVENTS,
  ...LOAN_EVENTS,
  ...MEDIA_EVENTS,
  ...PERSONAL_EVENTS,
  ...SCANDAL_EVENTS,
]

export function getEventById(id: string): SeasonEvent {
  const event = SAMPLE_EVENTS.find((candidate) => candidate.id === id)
  if (!event) throw new Error(`Evento desconocido: ${id}`)
  return event
}
