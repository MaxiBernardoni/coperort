import type { SeasonEvent } from '@/types/event'

export const LOAN_EVENTS: SeasonEvent[] = [
  {
    id: 'loan-for-minutes',
    category: 'loan',
    text: 'No estás sumando minutos y en el club te sugieren salir a préstamo para agarrar rodaje.',
    weight: 2,
    minAge: 18,
    maxAge: 25,
    choices: [
      {
        id: 'accept-loan',
        label: 'Aceptar salir a préstamo',
        effects: [],
        loan: { reputationMax: 40, durationSeasons: 1 },
      },
      {
        id: 'fight-for-your-place',
        label: 'Quedarte a pelear un lugar',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
      },
    ],
  },
  {
    id: 'loan-to-sister-club',
    category: 'loan',
    text: 'El club tiene un acuerdo con un equipo afiliado y te ofrece ir a préstamo por una temporada.',
    weight: 1,
    minAge: 17,
    maxAge: 23,
    choices: [
      {
        id: 'accept-affiliate-loan',
        label: 'Ir al club afiliado',
        effects: [],
        loan: { sameCountry: true, durationSeasons: 1 },
      },
      {
        id: 'decline-stay',
        label: 'Quedarte en el plantel principal',
        effects: [],
      },
    ],
  },
  {
    id: 'loan-abroad-experience',
    category: 'loan',
    text: 'Un club del ascenso te tienta con una experiencia a préstamo para foguearte.',
    weight: 1,
    minAge: 19,
    maxAge: 26,
    choices: [
      {
        id: 'go-on-loan',
        label: 'Ir a préstamo para sumar experiencia',
        effects: [{ target: 'defending', op: 'add', value: 1 }],
        loan: { tier: 2, durationSeasons: 1 },
      },
      {
        id: 'stay-and-wait',
        label: 'Quedarte a esperar tu oportunidad',
        effects: [],
      },
    ],
  },
  {
    id: 'injury-recovery-loan',
    category: 'loan',
    text: 'Después de una lesión larga, en el club prefieren que sumes ritmo a préstamo antes de volver a pelear un lugar.',
    weight: 1,
    minAge: 21,
    choices: [
      {
        id: 'accept-recovery-loan',
        label: 'Aceptar el préstamo para agarrar ritmo',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
        loan: { reputationMax: 45, durationSeasons: 1 },
      },
      {
        id: 'push-for-first-team',
        label: 'Insistir para volver directo al primer equipo',
        effects: [{ target: 'physical', op: 'add', value: -1 }],
      },
    ],
  },
  {
    id: 'two-season-loan-deal',
    category: 'loan',
    text: 'Te ofrecen un préstamo más largo, por dos temporadas, para asentarte en otro plantel.',
    weight: 1,
    minAge: 20,
    maxAge: 28,
    choices: [
      {
        id: 'accept-two-seasons',
        label: 'Aceptar el préstamo por dos temporadas',
        effects: [],
        loan: { durationSeasons: 2 },
      },
      {
        id: 'prefer-short-term',
        label: 'Preferir no comprometerte tanto tiempo',
        effects: [],
      },
    ],
  },
]
