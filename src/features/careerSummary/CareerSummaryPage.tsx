import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { RivalCard } from '@/components/ui/RivalCard'
import { StatTile } from '@/components/ui/StatTile'
import { TrophyCase } from '@/components/ui/TrophyCase'
import { getClubById } from '@/content/clubs'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { submitScore } from '@/lib/api/leaderboard'
import { clearStoredCareerId } from '@/lib/careerSession'
import { formatCurrency } from '@/lib/labels'

export function CareerSummaryPage() {
  const navigate = useNavigate()
  const { career } = useCareerEngine()
  const [alias, setAlias] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  if (!career) return <Navigate to="/" replace />
  if (career.phase !== 'RETIRED') return <Navigate to="/hub" replace />

  const { player, stats, titles, currentClub } = career

  async function handleSubmitScore() {
    if (!alias.trim() || !currentClub) return
    setStatus('saving')
    try {
      await submitScore({
        alias: alias.trim().slice(0, 24),
        firstName: player.identity.firstName,
        surname: player.identity.surname,
        nationality: player.identity.nationality,
        position: player.identity.position,
        clubName: currentClub.name,
        retireAge: player.age,
        matches: stats.matches,
        goals: stats.goals,
        assists: stats.assists,
        peakRating: stats.peakRating,
        peakMarketValue: stats.peakMarketValue,
        leagueTitles: titles.filter((title) => title.type === 'league').length,
        cupTitles: titles.filter((title) => title.type === 'cup').length,
      })
      setStatus('done')
    } catch (error) {
      console.error('No se pudo subir el puntaje', error)
      setStatus('error')
    }
  }

  function handleRestart() {
    clearStoredCareerId()
    navigate('/')
  }

  return (
    <main className="flex flex-col items-center gap-[22px] px-6 py-16 text-center">
      <h1 className="m-0 font-display text-[30px] font-bold text-text">Fin de la carrera</h1>
      <p className="m-0 text-sm text-text-secondary">
        {player.identity.firstName} {player.identity.surname} se retiró a los {player.age} años.
      </p>

      <div className="grid w-full max-w-[520px] grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile value={stats.matches} label="PARTIDOS" />
        <StatTile value={stats.goals} label="GOLES" />
        <StatTile value={stats.assists} label="ASISTENCIAS" />
        <StatTile value={stats.peakRating} label="RATING PICO" variant="gradient" />
      </div>

      <p className="m-0 text-[13px] text-text-secondary">
        Valor de mercado en su mejor momento: <strong className="text-text">{formatCurrency(stats.peakMarketValue)}</strong>
      </p>

      <div className="w-full max-w-[520px] text-left">
        <TrophyCase titles={career.titles} getClubLabel={(clubId) => getClubById(clubId).name} recentCount={6} />
      </div>

      <div className="w-full max-w-[520px] text-left">
        <RivalCard rival={career.rival} playerRating={stats.peakRating} />
      </div>

      <div className="flex w-full max-w-[360px] flex-col gap-2.5 rounded-card bg-surface p-4">
        <p className="m-0 text-[13px] font-bold text-text">Subí tu carrera al ranking global</p>
        {status === 'done' ? (
          <p className="m-0 text-sm text-positive">¡Listo! Ya figurás en el ranking.</p>
        ) : (
          <>
            <input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Tu alias"
              maxLength={24}
              className="rounded-[10px] border-none bg-surface-alt px-3 py-2.5 text-sm text-text outline-none"
            />
            <Button
              variant="primary"
              className="!px-4 !py-2.5"
              disabled={!alias.trim() || status === 'saving'}
              onClick={handleSubmitScore}
            >
              {status === 'saving' ? 'Subiendo...' : 'Subir al ranking'}
            </Button>
            {status === 'error' && <p className="m-0 text-xs text-position">No se pudo subir, probá de nuevo.</p>}
          </>
        )}
      </div>

      <Button variant="ghost" className="mt-2" onClick={handleRestart}>
        Empezar una nueva carrera
      </Button>
    </main>
  )
}
