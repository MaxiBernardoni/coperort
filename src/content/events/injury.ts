import type { SeasonEvent } from '@/types/event'

export const INJURY_EVENTS: SeasonEvent[] = [
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
        effects: [{ target: 'physical', op: 'add', value: -2 }],
        injury: { matchesReductionPct: 0.15 },
      },
    ],
  },
  {
    id: 'ligament-scare',
    category: 'injury',
    text: 'Un cruce brusco te deja con la rodilla hinchada.',
    weight: 1,
    minAge: 22,
    choices: [
      {
        id: 'rehab-properly',
        label: 'Hacer la rehabilitación completa',
        effects: [{ target: 'physical', op: 'add', value: 2 }],
        injury: { matchesReductionPct: 0.35 },
      },
      {
        id: 'play-through-pain',
        label: 'Volver antes de tiempo',
        effects: [{ target: 'physical', op: 'add', value: -4 }],
        injury: { matchesReductionPct: 0.05 },
      },
    ],
  },
  {
    id: 'preseason-knock',
    category: 'injury',
    text: 'Te lesionás en un amistoso de pretemporada.',
    weight: 1,
    choices: [
      {
        id: 'take-it-slow',
        label: 'Tomarte el tiempo necesario',
        effects: [],
        injury: { matchesReductionPct: 0.2 },
      },
      {
        id: 'rush-the-return',
        label: 'Apurar la vuelta para el arranque de temporada',
        effects: [{ target: 'physical', op: 'add', value: -2 }],
        injury: { matchesReductionPct: 0.05 },
      },
    ],
  },
  {
    id: 'overuse-fatigue',
    category: 'injury',
    text: 'El cuerpo médico detecta signos de sobrecarga por el calendario recargado.',
    weight: 1,
    minAge: 27,
    choices: [
      {
        id: 'request-rotation',
        label: 'Pedir descanso y rotar partidos',
        effects: [{ target: 'physical', op: 'add', value: 1 }],
        injury: { matchesReductionPct: 0.15 },
      },
      {
        id: 'keep-grinding',
        label: 'Seguir jugando todos los partidos',
        effects: [{ target: 'physical', op: 'add', value: -2 }],
      },
    ],
  },
  {
    id: 'matchday-collision',
    category: 'injury',
    text: 'Un choque fuerte en pleno partido te deja dolorido.',
    weight: 2,
    choices: [
      {
        id: 'accept-medical-timeout',
        label: 'Aceptar el tiempo de recuperación que piden los médicos',
        effects: [],
        injury: { matchesReductionPct: 0.1 },
      },
      {
        id: 'finish-the-match',
        label: 'Terminar el partido igual',
        effects: [{ target: 'physical', op: 'add', value: -1 }],
      },
    ],
  },
]
