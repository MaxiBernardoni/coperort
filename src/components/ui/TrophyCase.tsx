import { TrophyIcon } from '@/components/icons/TrophyIcon'
import { EmptyState } from './EmptyState'
import type { Title } from '@/types/career'

interface TrophyCaseProps {
  titles: Title[]
  getClubLabel: (clubId: string) => string
  /** cuántos títulos recientes listar debajo de los contadores */
  recentCount?: number
}

const TYPE_LABELS: Record<Title['type'], string> = { league: 'Liga', cup: 'Copa' }

export function TrophyCase({ titles, getClubLabel, recentCount = 4 }: TrophyCaseProps) {
  if (titles.length === 0) return <EmptyState icon={<TrophyIcon opacity={0.35} />} label="VITRINA VACÍA" />

  const leagues = titles.filter((title) => title.type === 'league').length
  const cups = titles.filter((title) => title.type === 'cup').length
  const recent = [...titles].reverse().slice(0, recentCount)

  return (
    <div className="rounded-card bg-surface p-4">
      <h3 className="m-0 mb-3 text-[13px] font-bold text-text">Vitrina</h3>

      <div className="mb-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-[10px] bg-surface-alt p-3 text-center">
          <p className="m-0 font-display text-xl font-extrabold text-text">{leagues}</p>
          <p className="mt-0.5 mb-0 text-[10px] font-bold tracking-[1px] text-text-label">LIGAS</p>
        </div>
        <div className="rounded-[10px] bg-surface-alt p-3 text-center">
          <p className="m-0 font-display text-xl font-extrabold" style={{ color: '#f2984a' }}>
            {cups}
          </p>
          <p className="mt-0.5 mb-0 text-[10px] font-bold tracking-[1px] text-text-label">COPAS</p>
        </div>
      </div>

      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {recent.map((title) => (
          <li key={`${title.type}-${title.year}-${title.clubId}`} className="flex items-center gap-2 text-xs">
            <TrophyIcon size={14} color={title.type === 'cup' ? '#f2984a' : '#8a8d93'} />
            <span className="text-text-secondary-light">
              {title.year} · {TYPE_LABELS[title.type]}
            </span>
            <span className="truncate text-text-secondary">{getClubLabel(title.clubId)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
