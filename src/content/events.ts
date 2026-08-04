import type { SeasonEvent } from '@/types/event'

/**
 * Set mínimo de eventos narrativos para poder correr y testear el motor. Se
 * amplía en la Fase 3 con volumen real y `contentSchema.ts` (zod). Cubre
 * todo el rango de edad de una carrera (17-38) para que `ADVANCE_SEASON`
 * siempre tenga al menos un evento elegible.
 */
export const SAMPLE_EVENTS: SeasonEvent[] = [
  {
    id: 'preseason-intensity',
    category: 'training',
    text: 'El cuerpo técnico te propone dos planes de pretemporada.',
    weight: 3,
    choices: [
      {
        id: 'high-intensity',
        label: 'Entrenar con máxima intensidad',
        effects: [
          { target: 'physical', op: 'add', value: 3 },
          { target: 'pace', op: 'add', value: 2 },
        ],
      },
      {
        id: 'technical-focus',
        label: 'Enfocarte en trabajo técnico',
        effects: [
          { target: 'dribbling', op: 'add', value: 3 },
          { target: 'passing', op: 'add', value: 2 },
        ],
      },
    ],
  },
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
    id: 'veteran-mentorship',
    category: 'personal',
    text: 'Un jugador veterano del plantel se ofrece a ayudarte con la parte mental del juego.',
    weight: 2,
    minAge: 24,
    choices: [
      {
        id: 'accept-mentorship',
        label: 'Aceptar los consejos',
        effects: [{ target: 'passing', op: 'add', value: 2 }],
      },
      {
        id: 'go-alone',
        label: 'Seguir por tu cuenta',
        effects: [],
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
  {
    id: 'late-career-role',
    category: 'personal',
    text: 'El técnico te plantea un rol distinto para cuidar tu físico en el tramo final de tu carrera.',
    weight: 2,
    minAge: 31,
    choices: [
      {
        id: 'accept-rotation',
        label: 'Aceptar rotar más partidos',
        effects: [{ target: 'physical', op: 'add', value: 2 }],
      },
      {
        id: 'keep-starting',
        label: 'Insistir en ser titular fijo',
        effects: [{ target: 'physical', op: 'add', value: -2 }],
      },
    ],
  },
]
