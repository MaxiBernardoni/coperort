import type { SeasonEvent } from '@/types/event'

/**
 * TODO (Fase 3a, sin terminar): expandir a ~5 eventos y usar el campo `choice.transfer`
 * (ver `types/event.ts` / `engine/clubTransition.ts`) para que la opción de irse mueva de
 * club de verdad, no solo multiplique `marketValue`. Ver CLAUDE.md, sección "Fase 3a".
 */
export const TRANSFER_EVENTS: SeasonEvent[] = [
  {
    id: 'transfer-offer',
    category: 'transfer',
    text: 'Un club de mayor nivel pregunta por tu situación contractual.',
    weight: 2,
    minAge: 19,
    choices: [
      {
        id: 'push-for-move',
        label: 'Pedirle al club que negocie tu salida',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.15 }],
      },
      {
        id: 'stay-loyal',
        label: 'Quedarte en el club',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.05 }],
      },
    ],
  },
]
