import { hashColorPair } from '@/lib/colorHash'

interface ColorRoundelProps {
  seed: string
  size?: number
  rounded?: 'sm' | 'full'
}

/** Roundel de 2 colores placeholder (no bandera real) derivado determinísticamente de un id. */
export function ColorRoundel({ seed, size = 14, rounded = 'sm' }: ColorRoundelProps) {
  const { color1, color2 } = hashColorPair(seed)
  return (
    <span
      className={`inline-block flex-shrink-0 overflow-hidden ${rounded === 'full' ? 'rounded-full' : 'rounded-sm'}`}
      style={{ width: size, height: size * (rounded === 'full' ? 1 : 0.7), background: color1 }}
    >
      <span className="block h-1/2 w-full" style={{ background: color2 }} />
    </span>
  )
}

interface FlagChipProps {
  countryId: string
  label: string
}

/** Chip de bandera-placeholder + código de país, usado en headers de identidad. */
export function FlagChip({ countryId, label }: FlagChipProps) {
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-md bg-surface-alt px-2 py-[3px]">
      <ColorRoundel seed={countryId} size={14} rounded="sm" />
      <span className="text-[11px] font-bold text-text-secondary-light">{label}</span>
    </span>
  )
}
