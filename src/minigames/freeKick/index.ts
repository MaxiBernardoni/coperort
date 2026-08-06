import { FreeKick } from './FreeKick'
import type { MinigameDefinition } from '../types'

export const freeKick: MinigameDefinition = {
  id: 'free-kick',
  name: 'Tiros libres',
  description: 'Tres tiros libres. Frená el marcador en la zona buena y clavala en el ángulo.',
  Component: FreeKick,
}
