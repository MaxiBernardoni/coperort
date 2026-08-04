export type Position = 'GK' | 'DEF' | 'MID' | 'FWD'
export type Foot = 'left' | 'right' | 'both'

export interface PlayerIdentity {
  firstName: string
  surname: string
  nationality: string
  jerseyNumber: number
  dominantFoot: Foot
  position: Position
}

export interface PlayerAttributes {
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  goalkeeping: number
}

export interface PlayerState {
  identity: PlayerIdentity
  attributes: PlayerAttributes
  age: number
  overallRating: number
  marketValue: number
}
