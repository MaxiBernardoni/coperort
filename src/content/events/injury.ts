import type { SeasonEvent } from '@/types/event'

/**
 * TODO (Fase 3a, sin terminar): expandir a ~5 eventos y usar el campo
 * `choice.injury.matchesReductionPct` (ver `types/event.ts`) para que las lesiones tengan
 * peso mecánico real (menos partidos esa temporada), no solo un penalty de atributo. Ver
 * CLAUDE.md, sección "Fase 3a" para el detalle de lo que falta.
 */
export const INJURY_EVENTS: SeasonEvent[] = [
  {
    id: 'minor-injury',
    category: 'injury',
    text: 'Sentís una molestia muscular tras un partido exigente.',
    weight: 2,
    minAge: 20,
    choices: [
      {
        id: 'rest',
        label: 'Parar y recuperarte a fondo',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
      },
      {
        id: 'push-through',
        label: 'Jugar igual el próximo partido',
        effects: [{ target: 'physical', op: 'add', value: -3 }],
      },
    ],
  },
]
