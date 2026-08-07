import type { SeasonEvent } from '@/types/event'

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
  {
    id: 'first-cover-shoot',
    category: 'media',
    text: 'Una revista deportiva te quiere en la tapa como la nueva promesa del país.',
    weight: 1,
    minAge: 18,
    maxAge: 24,
    choices: [
      {
        id: 'do-the-shoot',
        label: 'Hacer la producción de fotos',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.06 }],
      },
      {
        id: 'stay-low-profile',
        label: 'Mantener el perfil bajo',
        effects: [{ target: 'shooting', op: 'add', value: 1 }],
      },
    ],
  },
  {
    id: 'pundit-criticism',
    category: 'media',
    text: 'Un ex jugador convertido en panelista te bajó línea en la tele diciendo que estás sobrevalorado.',
    weight: 1,
    minAge: 20,
    choices: [
      {
        id: 'answer-on-pitch',
        label: 'Contestarle adentro de la cancha',
        effects: [{ target: 'shooting', op: 'add', value: 2 }],
      },
      {
        id: 'let-it-slide',
        label: 'Dejarlo pasar sin engancharte',
        effects: [],
      },
    ],
  },
  {
    id: 'documentary-offer',
    category: 'media',
    text: 'Una plataforma de streaming te propone un documental siguiendo tu temporada de cerca.',
    weight: 1,
    minAge: 25,
    choices: [
      {
        id: 'open-the-doors',
        label: 'Abrir las puertas a las cámaras',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.08 }],
      },
      {
        id: 'protect-the-locker-room',
        label: 'Cuidar la intimidad del vestuario',
        effects: [{ target: 'passing', op: 'add', value: 1 }],
      },
    ],
  },
]
