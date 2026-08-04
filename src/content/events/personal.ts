import type { SeasonEvent } from '@/types/event'

/** TODO (Fase 3a, sin terminar): expandir a ~5 eventos. Ver CLAUDE.md, sección "Fase 3a". */
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
]
