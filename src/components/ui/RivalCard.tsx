import { FlagChip } from './FlagChip'
import { getClubById } from '@/content/clubs'
import { getCountryByName } from '@/content/countries'
import { getRivalArchetypeById } from '@/content/rivalArchetypes'
import { formatCurrency, POSITION_SHORT_LABELS } from '@/lib/labels'
import type { RivalState } from '@/types/rival'

interface RivalCardProps {
  rival: RivalState
  playerRating: number
}

/** Comparación compacta contra el rival fijo de la carrera — Fase 7. */
export function RivalCard({ rival, playerRating }: RivalCardProps) {
  const archetype = getRivalArchetypeById(rival.archetypeId)
  const club = getClubById(rival.clubId)
  const country = getCountryByName(rival.nationality)
  const countryId = country?.id ?? 'ar'
  const countryCode = rival.nationality.slice(0, 3).toUpperCase()

  const diff = playerRating - rival.overallRating
  const statusLabel = diff > 0 ? 'Le llevás ventaja' : diff < 0 ? 'Te está pasando' : 'Están empatados'
  const statusColor = diff > 0 ? 'text-positive' : diff < 0 ? 'text-position' : 'text-text-secondary'

  return (
    <div className="rounded-card bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 text-[13px] font-bold text-text">Tu rival</h3>
        <span className="text-[10px] font-bold tracking-[1px] text-text-label">{archetype.name.toUpperCase()}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FlagChip countryId={countryId} label={countryCode} />
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-text">
              {rival.firstName} {rival.surname}
            </span>
            <span className="text-[11px] text-text-secondary">
              {club.name} · {POSITION_SHORT_LABELS[rival.position]}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-display text-[22px] leading-none font-extrabold text-text">{rival.overallRating}</span>
          <span className="text-[10px] font-bold tracking-[1px] text-text-label">OVR</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="text-text-secondary">{formatCurrency(rival.marketValue)}</span>
        <span className={`font-bold ${statusColor}`}>{statusLabel}</span>
      </div>
    </div>
  )
}
