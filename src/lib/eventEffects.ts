import type { EventChoice } from '@/types/event'

export type EffectDirection = 'up' | 'down' | 'neutral'

/**
 * Resume la dirección neta de una elección sin revelar los números exactos del efecto
 * (intencional, ver docs/design-brief.md) — el motor es determinístico, no hay un modelo
 * de probabilidad real que respalde porcentajes.
 */
export function summarizeChoiceEffect(choice: EventChoice): { direction: EffectDirection; label: string } {
  let net = 0
  for (const effect of choice.effects) {
    if (effect.op === 'add') net += Math.sign(effect.value)
    else net += Math.sign(effect.value - 1)
  }

  if (net > 0) return { direction: 'up', label: 'Sube' }
  if (net < 0) return { direction: 'down', label: 'Baja' }
  return { direction: 'neutral', label: 'Sin cambios' }
}
