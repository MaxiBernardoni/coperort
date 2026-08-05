import { DownChevronIcon } from '@/components/icons/DownChevronIcon'
import { UpChevronIcon } from '@/components/icons/UpChevronIcon'
import type { EffectDirection } from '@/lib/eventEffects'

interface EventChoiceCardProps {
  label: string
  categoryLabel: string
  effect: { direction: EffectDirection; label: string }
  onSelect: () => void
}

export function EventChoiceCard({ label, categoryLabel, effect, onSelect }: EventChoiceCardProps) {
  const pillStyle =
    effect.direction === 'up'
      ? { background: 'rgba(76,175,110,0.14)', color: '#4caf6e' }
      : effect.direction === 'down'
        ? { background: 'rgba(194,43,82,0.14)', color: '#c22b52' }
        : { background: 'rgba(138,141,147,0.14)', color: '#8a8d93' }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex cursor-pointer flex-col gap-2.5 rounded-[14px] border border-border-strong bg-surface p-4 text-left hover:border-accent"
    >
      <span className="text-sm font-bold text-text">{label}</span>
      <span
        className="flex aspect-video w-full items-center justify-center rounded-[10px] px-2 text-center font-mono text-[10px] text-text-muted"
        style={{
          background:
            'repeating-linear-gradient(135deg, #1e1f23, #1e1f23 10px, #232428 10px, #232428 20px)',
        }}
      >
        {categoryLabel}
      </span>
      <span
        className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1"
        style={{ background: pillStyle.background }}
      >
        {effect.direction === 'up' && <UpChevronIcon />}
        {effect.direction === 'down' && <DownChevronIcon />}
        <span className="text-xs font-bold" style={{ color: pillStyle.color }}>
          {effect.label}
        </span>
      </span>
    </button>
  )
}
