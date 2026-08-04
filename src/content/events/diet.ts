import type { SeasonEvent } from '@/types/event'

export const DIET_EVENTS: SeasonEvent[] = [
  {
    id: 'diet-plan',
    category: 'diet',
    text: 'Un nutricionista te ofrece un plan de alimentación personalizado.',
    weight: 2,
    choices: [
      {
        id: 'accept-diet',
        label: 'Aceptar el plan',
        effects: [{ target: 'physical', op: 'add', value: 2 }],
      },
      {
        id: 'skip-diet',
        label: 'Seguir como estás',
        effects: [],
      },
    ],
  },
  {
    id: 'traditional-asado-vs-diet',
    category: 'diet',
    text: 'El plantel organiza un asado y el nutricionista te pide que te cuides.',
    weight: 2,
    choices: [
      {
        id: 'strict-diet',
        label: 'Seguir la dieta estricta',
        effects: [{ target: 'physical', op: 'add', value: 2 }],
      },
      {
        id: 'join-the-asado',
        label: 'No perderte el asado con el plantel',
        effects: [{ target: 'passing', op: 'add', value: 1 }],
      },
    ],
  },
  {
    id: 'sports-scientist-hydration',
    category: 'diet',
    text: 'El club incorpora un especialista en hidratación y recuperación deportiva.',
    weight: 1,
    minAge: 22,
    choices: [
      {
        id: 'hire-specialist',
        label: 'Sumar el seguimiento del especialista',
        effects: [
          { target: 'physical', op: 'add', value: 2 },
          { target: 'marketValue', op: 'multiply', value: 1.03 },
        ],
      },
      {
        id: 'keep-your-routine',
        label: 'Seguir con tu rutina de siempre',
        effects: [],
      },
    ],
  },
  {
    id: 'weight-cut-request',
    category: 'diet',
    text: 'El cuerpo técnico te pide bajar un par de kilos para ganar velocidad.',
    weight: 1,
    choices: [
      {
        id: 'cut-weight',
        label: 'Bajar de peso como te piden',
        effects: [
          { target: 'pace', op: 'add', value: 2 },
          { target: 'physical', op: 'add', value: -1 },
        ],
      },
      {
        id: 'stay-as-you-are',
        label: 'Mantenerte como estás',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
      },
    ],
  },
  {
    id: 'off-season-diet-discipline',
    category: 'diet',
    text: 'Las vacaciones de verano son largas y la tentación de relajarte está a la vuelta de la esquina.',
    weight: 2,
    minAge: 26,
    choices: [
      {
        id: 'stay-disciplined',
        label: 'Redoblar la disciplina alimenticia en las vacaciones',
        effects: [{ target: 'physical', op: 'add', value: 2 }],
      },
      {
        id: 'relax-a-bit',
        label: 'Relajarte un poco, total después arrancás de nuevo',
        effects: [{ target: 'physical', op: 'add', value: -2 }],
      },
    ],
  },
]
