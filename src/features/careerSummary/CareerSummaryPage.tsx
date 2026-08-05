import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatTile } from '@/components/ui/StatTile'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { formatCurrency } from '@/lib/labels'

export function CareerSummaryPage() {
  const navigate = useNavigate()
  const { career } = useCareerEngine()

  if (!career) return <Navigate to="/" replace />
  if (career.phase !== 'RETIRED') return <Navigate to="/hub" replace />

  const { player, stats } = career

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

      <Button variant="ghost" className="mt-2" onClick={() => navigate('/')}>
        Empezar una nueva carrera
      </Button>
    </main>
  )
}
