import type { SeasonEvent } from '@/types/event'

/** TODO (Fase 3a, sin terminar): expandir a ~5 eventos. Ver CLAUDE.md, sección "Fase 3a". */
export const MEDIA_EVENTS: SeasonEvent[] = [
  {
    id: 'media-pressure',
    category: 'media',
    text: 'La prensa te viene siguiendo de cerca tras una racha floja.',
    weight: 1,
    minAge: 21,
    choices: [
      {
        id: 'ignore-media',
        label: 'Ignorar el ruido y enfocarte en lo tuyo',
        effects: [{ target: 'passing', op: 'add', value: 1 }],
      },
      {
        id: 'public-response',
        label: 'Responder públicamente',
        effects: [{ target: 'marketValue', op: 'multiply', value: 0.95 }],
      },
    ],
  },
  {
    id: 'sponsor-deal',
    category: 'media',
    text: 'Una marca te ofrece un contrato de auspicio importante.',
    weight: 1,
    minAge: 23,
    choices: [
      {
        id: 'sign-sponsor',
        label: 'Firmar el contrato',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.1 }],
      },
      {
        id: 'decline-sponsor',
        label: 'Rechazarlo para enfocarte en lo deportivo',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
      },
    ],
  },
]
