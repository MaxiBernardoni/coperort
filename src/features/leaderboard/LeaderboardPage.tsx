import { useEffect, useState } from 'react'
import { fetchTopEntries, type LeaderboardEntry } from '@/lib/api/leaderboard'

type Status = 'loading' | 'ready' | 'error'

export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    fetchTopEntries()
      .then((data) => {
        setEntries(data)
        setStatus('ready')
      })
      .catch((error) => {
        console.error('No se pudo cargar el ranking', error)
        setStatus('error')
      })
  }, [])

  return (
    <main className="mx-auto max-w-[900px] px-6 py-10">
      <h1 className="m-0 mb-1 text-center font-display text-[30px] font-bold text-text">Ranking global</h1>
      <p className="m-0 mb-8 text-center text-sm text-text-secondary">Las mejores carreras, ordenadas por rating pico.</p>

      {status === 'loading' && <p className="text-center text-sm text-text-secondary">Cargando...</p>}
      {status === 'error' && <p className="text-center text-sm text-position">No se pudo cargar el ranking.</p>}
      {status === 'ready' && entries.length === 0 && (
        <p className="text-center text-sm text-text-secondary">Todavía no hay ninguna carrera en el ranking.</p>
      )}

      {status === 'ready' && entries.length > 0 && (
        <div className="rounded-[14px] bg-surface-deep p-4">
          <div className="grid grid-cols-[2fr_1.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.7fr] gap-1 px-2 pb-2.5">
            {['ALIAS', 'CLUB', 'OVR', 'PJ', 'GLS', 'AST', 'COPAS'].map((label) => (
              <span key={label} className="text-[10px] font-bold tracking-[1px] text-text-muted">
                {label}
              </span>
            ))}
          </div>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="grid grid-cols-[2fr_1.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.7fr] items-center gap-1 rounded-lg px-2 py-2.5"
              style={index === 0 ? { background: 'rgba(242,152,74,0.12)' } : undefined}
            >
              <span className="truncate text-[13px] font-bold text-text-secondary-light">
                {entry.alias} <span className="text-text-label">#{index + 1}</span>
              </span>
              <span className="truncate text-xs text-text-secondary">{entry.clubName}</span>
              <span
                className="w-fit rounded-full px-2 py-0.5 text-center text-[11px] font-extrabold"
                style={{ background: index === 0 ? '#f2984a' : '#232428', color: index === 0 ? '#1c1000' : '#cfd1d6' }}
              >
                {entry.peakRating}
              </span>
              <span className="text-center text-xs text-text-secondary">{entry.matches}</span>
              <span className="text-center text-xs text-text-secondary">{entry.goals}</span>
              <span className="text-center text-xs text-text-secondary">{entry.assists}</span>
              <span className="text-center text-xs text-text-secondary">
                {entry.leagueTitles + entry.cupTitles}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
