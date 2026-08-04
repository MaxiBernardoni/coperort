import { Navigate, useNavigate } from 'react-router-dom'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { useCareerStore } from '@/store/careerStore'
import { ATTRIBUTE_KEYS } from '@/engine/statMath'
import { ATTRIBUTE_LABELS, FOOT_LABELS, POSITION_LABELS, formatCurrency } from '@/lib/labels'

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-3 text-center dark:border-neutral-800">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  )
}

function AttributeBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-neutral-500">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div className="h-full rounded-full bg-neutral-900 dark:bg-white" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function CareerHubPage() {
  const navigate = useNavigate()
  const { career, advanceSeason } = useCareerEngine()

  if (!career) return <Navigate to="/" replace />
  if (career.phase === 'EVENT_PENDING') return <Navigate to="/event" replace />
  if (career.phase === 'RETIRED') return <Navigate to="/summary" replace />

  const { player, currentClub, stats } = career

  function handleAdvance() {
    advanceSeason()
    if (useCareerStore.getState().career?.phase === 'EVENT_PENDING') navigate('/event')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {player.identity.firstName} {player.identity.surname}
          </h1>
          <p className="text-neutral-500">
            {POSITION_LABELS[player.identity.position]} · {player.identity.nationality} · #{player.identity.jerseyNumber} ·{' '}
            {FOOT_LABELS[player.identity.dominantFoot]}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{player.overallRating}</p>
          <p className="text-sm text-neutral-500">rating</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Edad" value={player.age} />
        <StatTile label="Temporada" value={career.season} />
        <StatTile label="Club" value={currentClub.name} />
        <StatTile label="Valor de mercado" value={formatCurrency(player.marketValue)} />
      </section>

      <section className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="mb-3 font-medium">Atributos</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ATTRIBUTE_KEYS.map((key) => (
            <AttributeBar key={key} label={ATTRIBUTE_LABELS[key]} value={player.attributes[key]} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="mb-3 font-medium">Estadísticas de carrera</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <StatTile label="Partidos" value={stats.matches} />
          <StatTile label="Goles" value={stats.goals} />
          <StatTile label="Asistencias" value={stats.assists} />
        </div>
      </section>

      <button
        onClick={handleAdvance}
        className="mt-auto rounded-md bg-neutral-900 px-4 py-3 font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Avanzar temporada
      </button>
    </main>
  )
}
