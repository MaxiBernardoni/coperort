import type { SeasonEvent } from '@/types/event'

export const PERSONAL_EVENTS: SeasonEvent[] = [
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
  {
    id: 'family-move-abroad',
    category: 'personal',
    text: 'Tu familia duda si mudarse con vos ahora que jugás lejos de casa.',
    weight: 2,
    minAge: 20,
    choices: [
      {
        id: 'bring-family',
        label: 'Que se muden con vos',
        effects: [{ target: 'passing', op: 'add', value: 1 }],
      },
      {
        id: 'go-it-alone',
        label: 'Arreglártelas solo por ahora',
        effects: [{ target: 'marketValue', op: 'multiply', value: 0.98 }],
      },
    ],
  },
  {
    id: 'hometown-academy',
    category: 'personal',
    text: 'El club de tu barrio te pide una mano para poner en pie su escuelita de fútbol.',
    weight: 1,
    minAge: 26,
    choices: [
      {
        id: 'fund-the-academy',
        label: 'Bancar la escuelita',
        effects: [{ target: 'marketValue', op: 'multiply', value: 0.97 }],
      },
      {
        id: 'lend-your-name',
        label: 'Prestar tu nombre nada más',
        effects: [],
      },
    ],
  },
  {
    id: 'language-barrier',
    category: 'personal',
    text: 'En el nuevo país te cuesta entenderte con el grupo por el idioma.',
    weight: 2,
    minAge: 19,
    maxAge: 30,
    choices: [
      {
        id: 'study-the-language',
        label: 'Ponerte a estudiar el idioma en serio',
        effects: [{ target: 'passing', op: 'add', value: 2 }],
      },
      {
        id: 'lean-on-teammates',
        label: 'Apoyarte en un par de compañeros que traducen',
        effects: [{ target: 'dribbling', op: 'add', value: 1 }],
      },
    ],
  },
]
