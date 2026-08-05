import { ClubCrestBadge } from './ClubCrestBadge'
import type { Club } from '@/types/club'

interface ClubOfferPickerProps {
  offers: Club[]
  onSelect: (clubId: string) => void
}

const TIER_LABELS: Record<1 | 2, string> = { 1: 'Liga Profesional', 2: 'Primera Nacional' }

export function ClubOfferPicker({ offers, onSelect }: ClubOfferPickerProps) {
  return (
    <div>
      <h3 className="m-0 mb-1 text-base font-bold text-text">Oferta de cantera</h3>
      <p className="m-0 mb-3.5 text-[13px] text-text-secondary">
        Tres clubes quieren sumarte a su proyecto juvenil. Elegí dónde empieza tu carrera.
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        {offers.map((club) => (
          <button
            key={club.id}
            type="button"
            onClick={() => onSelect(club.id)}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-card border border-transparent bg-surface px-2 py-3.5 hover:border-accent"
          >
            <span className="text-[9px] font-bold tracking-[0.5px] text-text-label">FICHAR POR</span>
            <span className="text-[13px] font-bold text-text">{club.name}</span>
            <ClubCrestBadge club={club} />
            <span className="rounded-full bg-surface-raised px-2.5 py-0.5 text-[10px] font-semibold text-text-secondary-2">
              {TIER_LABELS[club.tier]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
