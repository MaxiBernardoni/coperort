import { CountryFlag } from './CountryFlag'

interface FlagChipProps {
  countryId: string
  label: string
}

/** Chip de bandera + código de país, usado en los headers de identidad. */
export function FlagChip({ countryId, label }: FlagChipProps) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-surface-alt px-2 py-[3px]">
      <CountryFlag countryId={countryId} width={16} />
      <span className="text-[11px] font-bold text-text-secondary-light">{label}</span>
    </span>
  )
}
