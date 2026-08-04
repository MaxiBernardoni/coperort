import type { SeasonEvent } from '@/types/event'

export const TRAINING_EVENTS: SeasonEvent[] = [
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
    id: 'fitness-camp',
    category: 'training',
    text: 'El club te manda a un campus de pretemporada en el interior, lejos de todo.',
    weight: 2,
    maxAge: 22,
    choices: [
      {
        id: 'push-hard',
        label: 'Exigirte al máximo en cada sesión',
        effects: [
          { target: 'physical', op: 'add', value: 3 },
          { target: 'pace', op: 'add', value: 1 },
        ],
      },
      {
        id: 'gradual-build',
        label: 'Ir de a poco para no quemarte',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
      },
    ],
  },
  {
    id: 'tactical-video-sessions',
    category: 'training',
    text: 'El analista del club te ofrece sesiones extra de video para estudiar rivales.',
    weight: 2,
    choices: [
      {
        id: 'study-rivals',
        label: 'Estudiar cada rival a fondo',
        effects: [
          { target: 'passing', op: 'add', value: 2 },
          { target: 'defending', op: 'add', value: 1 },
        ],
      },
      {
        id: 'trust-instinct',
        label: 'Confiar en tu instinto dentro de la cancha',
        effects: [{ target: 'dribbling', op: 'add', value: 2 }],
      },
    ],
  },
  {
    id: 'youth-coach-drills',
    category: 'training',
    text: 'Un preparador que trabaja con las inferiores te ofrece rutinas extra por tu cuenta.',
    weight: 2,
    maxAge: 22,
    choices: [
      {
        id: 'extra-drills',
        label: 'Sumar entrenamiento extra por tu cuenta',
        effects: [
          { target: 'physical', op: 'add', value: 2 },
          { target: 'dribbling', op: 'add', value: 1 },
        ],
      },
      {
        id: 'avoid-overload',
        label: 'Descansar y no sobrecargarte',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
      },
    ],
  },
  {
    id: 'preseason-friendly-tour',
    category: 'training',
    text: 'El club arma una gira de amistosos de pretemporada y te da minutos importantes.',
    weight: 2,
    choices: [
      {
        id: 'show-your-level',
        label: 'Pedir la pelota y mostrarte a la altura',
        effects: [
          { target: 'shooting', op: 'add', value: 2 },
          { target: 'marketValue', op: 'multiply', value: 1.05 },
        ],
      },
      {
        id: 'play-it-safe',
        label: 'Jugar tranquilo, sin arriesgar de más',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
      },
    ],
  },
]
