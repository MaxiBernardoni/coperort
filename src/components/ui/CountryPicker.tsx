import { CheckIcon } from '@/components/icons/CheckIcon'
import { SearchIcon } from '@/components/icons/SearchIcon'
import { ColorRoundel } from './FlagChip'
import type { Country } from '@/content/countries'

interface CountryPickerProps {
  countries: Country[]
  search: string
  onSearchChange: (value: string) => void
  selectedId: string
  onSelect: (countryId: string) => void
}

export function CountryPicker({ countries, search, onSearchChange, selectedId, onSelect }: CountryPickerProps) {
  const filtered = countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative">
        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-text-muted-2">
          <SearchIcon />
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar país"
          className="w-full rounded-card border-none bg-surface-alt py-3 pr-3 pl-10 text-sm text-text outline-none"
        />
      </div>
      <div className="grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto pr-1">
        {filtered.map((country) => {
          const selected = country.id === selectedId
          return (
            <button
              key={country.id}
              type="button"
              onClick={() => onSelect(country.id)}
              className={`flex items-center gap-2.5 rounded-[10px] border px-2.5 py-2 text-left text-[13px] ${
                selected ? 'border-accent bg-surface-raised' : 'border-transparent bg-transparent'
              } text-text-secondary-light-2`}
            >
              <ColorRoundel seed={country.id} size={22} rounded="full" />
              <span className="flex-1">{country.name}</span>
              {selected && <CheckIcon />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
