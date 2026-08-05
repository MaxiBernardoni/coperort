import type { SeasonEvent } from '@/types/event'

export const SCANDAL_EVENTS: SeasonEvent[] = [
  {
    id: 'viral-celebration-video',
    category: 'scandal',
    text: 'Un video de tu festejo de gol se volvió viral por lo exagerado que fue.',
    weight: 1,
    minAge: 18,
    choices: [
      {
        id: 'own-it',
        label: 'Reírte y hacerte cargo',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.03 }],
      },
      {
        id: 'downplay-it',
        label: 'No darle mayor importancia',
        effects: [],
      },
    ],
  },
  {
    id: 'asado-with-rival-fans',
    category: 'scandal',
    text: 'Te sacaron una foto compartiendo un asado con hinchas del clásico rival.',
    weight: 1,
    minAge: 19,
    choices: [
      {
        id: 'explain-it-was-family',
        label: 'Explicar que eran familiares',
        effects: [],
      },
      {
        id: 'ignore-the-noise',
        label: 'Ignorar el revuelo',
        effects: [{ target: 'marketValue', op: 'multiply', value: 0.97 }],
      },
    ],
  },
  {
    id: 'social-media-slip',
    category: 'scandal',
    text: 'Publicaste algo en redes que generó polémica entre los hinchas.',
    weight: 1,
    minAge: 18,
    choices: [
      {
        id: 'delete-and-apologize',
        label: 'Borrarlo y pedir disculpas',
        effects: [{ target: 'marketValue', op: 'multiply', value: 0.98 }],
      },
      {
        id: 'stand-by-it',
        label: 'Sostener lo que dijiste',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.01 }],
      },
    ],
  },
  {
    id: 'nightclub-photo-leak',
    category: 'scandal',
    text: 'Circuló una foto tuya de joda la noche antes de un partido importante.',
    weight: 1,
    minAge: 20,
    choices: [
      {
        id: 'accept-the-fine',
        label: 'Aceptar la multa del club',
        effects: [{ target: 'physical', op: 'add', value: -1 }],
      },
      {
        id: 'deny-everything',
        label: 'Negar todo públicamente',
        effects: [{ target: 'marketValue', op: 'multiply', value: 0.95 }],
      },
    ],
  },
  {
    id: 'controversial-interview',
    category: 'scandal',
    text: 'En una entrevista soltaste una frase picante sobre el clásico rival que se hizo tema.',
    weight: 1,
    minAge: 21,
    choices: [
      {
        id: 'double-down',
        label: 'Ratificarte en lo dicho',
        effects: [{ target: 'marketValue', op: 'multiply', value: 1.05 }],
      },
      {
        id: 'clarify-your-words',
        label: 'Aclarar que te malinterpretaron',
        effects: [],
      },
    ],
  },
]
