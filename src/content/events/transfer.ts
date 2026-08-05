import type { SeasonEvent } from '@/types/event'

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
        transfer: { reputationMin: 60 },
      },
      {
        id: 'stay-loyal',
        label: 'Quedarte en el club',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.05 }],
      },
    ],
  },
  {
    id: 'foreign-suitor',
    category: 'transfer',
    text: 'Un club del exterior mete una oferta agresiva por vos.',
    weight: 1,
    minAge: 22,
    choices: [
      {
        id: 'move-abroad',
        label: 'Aceptar la aventura afuera',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.1 }],
        transfer: { reputationMin: 50 },
      },
      {
        id: 'reject-offer',
        label: 'Rechazar la oferta y quedarte',
        effects: [{ target: 'passing', op: 'add', value: 1 }],
      },
    ],
  },
  {
    id: 'release-clause-triggered',
    category: 'transfer',
    text: 'Un club activa la cláusula de rescisión de tu contrato.',
    weight: 1,
    minAge: 24,
    choices: [
      {
        id: 'accept-release',
        label: 'Aceptar la salida',
        effects: [],
        transfer: { reputationMin: 55 },
      },
      {
        id: 'block-move',
        label: 'Intentar renegociar y quedarte',
        effects: [{ target: 'marketValue', op: 'multiply', value: 0.97 }],
      },
    ],
  },
  {
    id: 'relegation-release',
    category: 'transfer',
    text: 'Tu club pelea el descenso y un directivo te insinúa que busques otro destino.',
    weight: 1,
    minAge: 20,
    maxAge: 30,
    choices: [
      {
        id: 'seek-exit',
        label: 'Buscar la salida antes de que sea tarde',
        effects: [],
        transfer: { reputationMin: 40 },
      },
      {
        id: 'fight-for-the-shirt',
        label: 'Quedarte a pelear el descenso',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
      },
    ],
  },
  {
    id: 'boyhood-club-calls',
    category: 'transfer',
    text: 'El club de tus amores te hace una oferta para volver.',
    weight: 1,
    minAge: 26,
    choices: [
      {
        id: 'go-home',
        label: 'Volver al club de tu infancia',
        effects: [],
        transfer: { sameCountry: true },
      },
      {
        id: 'stay-focused',
        label: 'Seguir enfocado donde estás',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.03 }],
      },
    ],
  },
]
