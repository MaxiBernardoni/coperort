import { ATTRIBUTE_LABELS } from './labels'
import type { EventChoice, StatEffect } from '@/types/event'

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

/**
 * Describe efectos con números exactos ("+4 Definición", "−2 Pase"). A diferencia de los
 * eventos —donde ocultar el número es parte de la tensión, ver docs/design-brief.md— la
 * pretemporada es una decisión de build: si no ves el tradeoff no podés elegir con criterio.
 */
export function describeStatEffects(effects: StatEffect[]): { label: string; positive: boolean }[] {
  return effects.map((effect) => {
    const positive = effect.op === 'add' ? effect.value > 0 : effect.value > 1

    if (effect.target === 'marketValue') {
      const pct = Math.round(Math.abs(effect.value - 1) * 100)
      return { label: `${positive ? '+' : '−'}${pct}% Valor`, positive }
    }

    const amount = Math.abs(effect.value)
    return { label: `${positive ? '+' : '−'}${amount} ${ATTRIBUTE_LABELS[effect.target]}`, positive }
  })
}
