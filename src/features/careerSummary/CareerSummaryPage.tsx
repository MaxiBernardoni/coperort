import { Link, Navigate } from 'react-router-dom'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { formatCurrency } from '@/lib/labels'

export function CareerSummaryPage() {
  const { career } = useCareerEngine()

  if (!career) return <Navigate to="/" replace />
  if (career.phase !== 'RETIRED') return <Navigate to="/hub" replace />

  const { player, stats } = career

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-semibold">Fin de la carrera</h1>
      <p className="text-neutral-500">
        {player.identity.firstName} {player.identity.surname} se retiró a los {player.age} años.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
          <p className="text-lg font-semibold">{stats.matches}</p>
          <p className="text-xs text-neutral-500">Partidos</p>
        </div>
        <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
          <p className="text-lg font-semibold">{stats.goals}</p>
          <p className="text-xs text-neutral-500">Goles</p>
        </div>
        <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
          <p className="text-lg font-semibold">{stats.assists}</p>
          <p className="text-xs text-neutral-500">Asistencias</p>
        </div>
        <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
          <p className="text-lg font-semibold">{stats.peakRating}</p>
          <p className="text-xs text-neutral-500">Rating pico</p>
        </div>
      </div>

      <p className="text-neutral-500">Valor de mercado en su mejor momento: {formatCurrency(stats.peakMarketValue)}</p>

      <Link to="/" className="mt-4 underline">
        Empezar una nueva carrera
      </Link>
    </main>
  )
}
