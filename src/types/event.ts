import type { PlayerAttributes } from './player'

export type EventCategory = 'training' | 'transfer' | 'loan' | 'injury' | 'diet' | 'scandal' | 'media' | 'personal'

export interface StatEffect {
  target: keyof PlayerAttributes | 'marketValue'
  op: 'add' | 'multiply'
  value: number
}

export interface EventChoice {
  id: string
  label: string
  effects: StatEffect[]
}

export interface SeasonEvent {
  id: string
  category: EventCategory
  minAge?: number
  maxAge?: number
  text: string
  choices: EventChoice[]
  /** peso relativo para la selección aleatoria ponderada */
  weight: number
}
