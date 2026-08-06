import type { Motivation } from '@/types/motivation'

/**
 * Enfoques de pretemporada. Casi todos tienen un tradeoff real (subís algo, resignás otra
 * cosa) para que elegir importe — las pocas opciones sin contra dan menos a cambio.
 */
export const MOTIVATIONS: Motivation[] = [
  {
    id: 'goal-obsession',
    name: 'Obsesión con el gol',
    description: 'Toda la pretemporada rematando al arco, aunque el resto del juego quede de lado.',
    effects: [
      { target: 'shooting', op: 'add', value: 4 },
      { target: 'passing', op: 'add', value: -2 },
    ],
  },
  {
    id: 'physical-work',
    name: 'Trabajo físico extra',
    description: 'Doble turno en el gimnasio: llegás hecho un toro, pero más pesado.',
    effects: [
      { target: 'physical', op: 'add', value: 4 },
      { target: 'dribbling', op: 'add', value: -1 },
    ],
  },
  {
    id: 'back-to-the-potrero',
    name: 'Volver al potrero',
    description: 'Fútbol de barrio en la pretemporada para recuperar la gambeta de pibe.',
    effects: [
      { target: 'dribbling', op: 'add', value: 4 },
      { target: 'physical', op: 'add', value: -2 },
    ],
  },
  {
    id: 'sprint-training',
    name: 'Trabajo de velocidad',
    description: 'Series de piques cortos hasta quedar sin aire. Ganás explosión, perdés resistencia.',
    effects: [
      { target: 'pace', op: 'add', value: 4 },
      { target: 'physical', op: 'add', value: -2 },
    ],
  },
  {
    id: 'tactical-discipline',
    name: 'Disciplina táctica',
    description: 'Te ponés al servicio del equipo: más orden y salida limpia, menos búsqueda del gol.',
    effects: [
      { target: 'defending', op: 'add', value: 3 },
      { target: 'passing', op: 'add', value: 2 },
      { target: 'shooting', op: 'add', value: -2 },
    ],
  },
  {
    id: 'build-your-brand',
    name: 'Construir tu marca',
    description: 'Notas, redes y sponsors. Tu valor sube, tu preparación se resiente un poco.',
    effects: [
      { target: 'marketValue', op: 'multiply', value: 1.12 },
      { target: 'physical', op: 'add', value: -1 },
    ],
  },
  {
    id: 'dressing-room-leader',
    name: 'Líder del vestuario',
    description: 'Te hacés cargo del grupo: leés mejor el partido y ordenás a los de atrás.',
    minAge: 26,
    effects: [
      { target: 'passing', op: 'add', value: 3 },
      { target: 'defending', op: 'add', value: 1 },
    ],
  },
  {
    id: 'youth-hunger',
    name: 'Hambre de pibe',
    description: 'Sos el primero en llegar y el último en irse. A esta edad el cuerpo responde a todo.',
    maxAge: 23,
    effects: [
      { target: 'pace', op: 'add', value: 3 },
      { target: 'dribbling', op: 'add', value: 2 },
    ],
  },
  {
    id: 'veteran-craft',
    name: 'Oficio de veterano',
    description: 'Ya no corrés como antes, pero sabés dónde pararte y cuándo meter el pie.',
    minAge: 30,
    effects: [
      { target: 'passing', op: 'add', value: 3 },
      { target: 'defending', op: 'add', value: 2 },
      { target: 'pace', op: 'add', value: -2 },
    ],
  },
  {
    id: 'injury-prevention',
    name: 'Prevención de lesiones',
    description: 'Kinesiología y carga controlada para llegar entero al final de la temporada.',
    minAge: 28,
    effects: [{ target: 'physical', op: 'add', value: 3 }],
  },
  {
    id: 'goalkeeping-clinic',
    name: 'Clínica de arqueros',
    description: 'Pretemporada entera con el entrenador de arqueros: reflejos, achique y salidas.',
    positions: ['GK'],
    effects: [
      { target: 'goalkeeping', op: 'add', value: 5 },
      { target: 'pace', op: 'add', value: -1 },
    ],
  },
  {
    id: 'balanced-preparation',
    name: 'Preparación integral',
    description: 'Sin apostar a nada en particular: un poco de todo, sin resignar nada.',
    effects: [
      { target: 'physical', op: 'add', value: 2 },
      { target: 'pace', op: 'add', value: 1 },
      { target: 'passing', op: 'add', value: 1 },
      { target: 'dribbling', op: 'add', value: 1 },
    ],
  },
]

export function getMotivationById(id: string): Motivation {
  const motivation = MOTIVATIONS.find((candidate) => candidate.id === id)
  if (!motivation) throw new Error(`Motivación desconocida: ${id}`)
  return motivation
}
