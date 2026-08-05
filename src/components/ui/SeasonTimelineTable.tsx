import type { SeasonHistoryEntry } from '@/types/career'

interface SeasonTimelineTableProps {
  seasonHistory: SeasonHistoryEntry[]
  currentAge: number
  retirementAge: number
  debutAge?: number
  getClubLabel: (clubId: string) => string
}

interface Row {
  age: number
  club: string
  ovr: string | number
  pj: string | number
  gls: string | number
  ast: string | number
  isCurrent: boolean
  isResolved: boolean
}

export function SeasonTimelineTable({
  seasonHistory,
  currentAge,
  retirementAge,
  debutAge = 17,
  getClubLabel,
}: SeasonTimelineTableProps) {
  const rows: Row[] = []
  const byAge = new Map(seasonHistory.map((entry) => [entry.age, entry]))

  for (let age = debutAge; age <= retirementAge; age++) {
    const entry = byAge.get(age)
    const isCurrent = age === currentAge
    if (entry) {
      rows.push({
        age,
        club: getClubLabel(entry.clubId),
        ovr: entry.overallRating,
        pj: entry.matches,
        gls: entry.goals,
        ast: entry.assists,
        isCurrent,
        isResolved: true,
      })
    } else {
      rows.push({ age, club: '—', ovr: '—', pj: '—', gls: '—', ast: '—', isCurrent, isResolved: false })
    }
  }

  return (
    <div className="rounded-[14px] bg-surface-deep p-[18px]">
      <div className="grid grid-cols-[0.6fr_1.4fr_0.7fr_0.7fr_0.7fr_0.7fr] gap-1 px-2 pb-2.5">
        <span className="text-[10px] font-bold tracking-[1px] text-text-muted">EDAD</span>
        <span className="text-[10px] font-bold tracking-[1px] text-text-muted">CLUB</span>
        <span className="text-center text-[10px] font-bold tracking-[1px] text-text-muted">OVR</span>
        <span className="text-center text-[10px] font-bold tracking-[1px] text-text-muted">PJ</span>
        <span className="text-center text-[10px] font-bold tracking-[1px] text-text-muted">GLS</span>
        <span className="text-center text-[10px] font-bold tracking-[1px] text-text-muted">AST</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.age}
          className="grid grid-cols-[0.6fr_1.4fr_0.7fr_0.7fr_0.7fr_0.7fr] items-center gap-1 rounded-lg px-2 py-2.5"
          style={row.isCurrent ? { background: 'rgba(242,152,74,0.12)' } : undefined}
        >
          <span className={`text-[13px] font-bold ${row.isCurrent ? 'text-text' : 'text-text-muted-2'}`}>{row.age}</span>
          <span className={`text-xs ${row.isCurrent ? 'text-text-secondary-light' : 'text-text-disabled'}`}>{row.club}</span>
          {row.isResolved ? (
            <span
              className="w-fit rounded-full px-2 py-0.5 text-center text-[11px] font-extrabold"
              style={{ background: row.isCurrent ? '#f2984a' : '#232428', color: row.isCurrent ? '#1c1000' : '#cfd1d6' }}
            >
              {row.ovr}
            </span>
          ) : (
            <span className={`text-center text-xs ${row.isCurrent ? 'text-text' : 'text-text-disabled'}`}>{row.ovr}</span>
          )}
          <span className={`text-center text-xs ${row.isCurrent ? 'text-text-secondary-light' : 'text-text-disabled'}`}>
            {row.pj}
          </span>
          <span className={`text-center text-xs ${row.isCurrent ? 'text-text-secondary-light' : 'text-text-disabled'}`}>
            {row.gls}
          </span>
          <span className={`text-center text-xs ${row.isCurrent ? 'text-text-secondary-light' : 'text-text-disabled'}`}>
            {row.ast}
          </span>
        </div>
      ))}
    </div>
  )
}
