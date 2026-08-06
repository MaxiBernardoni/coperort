import { Navigate, useNavigate } from 'react-router-dom'
import { getMotivationById } from '@/content/motivations'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { useCareerStore } from '@/store/careerStore'
import { describeStatEffects } from '@/lib/eventEffects'

export function PreseasonPage() {
  const navigate = useNavigate()
  const { career, selectMotivation } = useCareerEngine()

  if (!career) return <Navigate to="/" replace />
  if (career.phase !== 'PRESEASON_PENDING' || career.motivationOffers.length === 0) {
    return <Navigate to="/hub" replace />
  }

  const offers = career.motivationOffers.map(getMotivationById)

  function handleSelect(motivationId: string) {
    selectMotivation(motivationId)
    const updated = useCareerStore.getState().career
    navigate(updated?.phase === 'EVENT_PENDING' ? '/event' : '/hub')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[900px] flex-col justify-center px-6 py-10">
      <header className="mb-8 text-center">
        <p className="m-0 mb-1 text-[10px] font-bold tracking-[1.2px] text-text-label">PRETEMPORADA</p>
        <h1 className="m-0 font-display text-[30px] font-bold text-text">¿En qué te vas a enfocar?</h1>
        <p className="m-0 mt-1 text-[13px] text-text-secondary">
          Temporada {career.season} · {career.player.age} años. Elegí un enfoque: te va a acompañar toda la temporada.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {offers.map((motivation) => (
          <button
            key={motivation.id}
            type="button"
            onClick={() => handleSelect(motivation.id)}
            className="flex cursor-pointer flex-col gap-3 rounded-[14px] border border-border-strong bg-surface p-4 text-left transition hover:border-accent"
          >
            <span className="font-display text-lg font-bold text-text">{motivation.name}</span>
            <span className="flex-1 text-xs leading-relaxed text-text-secondary">{motivation.description}</span>
            <span className="flex flex-wrap gap-1.5">
              {describeStatEffects(motivation.effects).map((effect) => (
                <span
                  key={effect.label}
                  className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                  style={{
                    background: effect.positive ? 'rgba(76,175,110,0.14)' : 'rgba(194,43,82,0.14)',
                    color: effect.positive ? '#4caf6e' : '#c22b52',
                  }}
                >
                  {effect.label}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </main>
  )
}
