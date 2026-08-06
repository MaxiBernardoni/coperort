import { DribbleChallenge } from './DribbleChallenge'
import type { MinigameDefinition } from '../types'

export const dribbleChallenge: MinigameDefinition = {
  id: 'dribble-challenge',
  name: 'Gambeta',
  description: 'Encará rivales de a uno. Cada uno que superás suma, pero si perdés la pelota te vas sin nada.',
  Component: DribbleChallenge,
}
