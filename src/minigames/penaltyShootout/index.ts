import { PenaltyShootout } from './PenaltyShootout'
import type { MinigameDefinition } from '../types'

export const penaltyShootout: MinigameDefinition = {
  id: 'penalty-shootout',
  name: 'Definición por penales',
  description: 'Cinco penales para definir la final. Leé el amague del arquero y elegí el palo.',
  Component: PenaltyShootout,
}
