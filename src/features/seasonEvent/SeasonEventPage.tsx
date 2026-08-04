import { Navigate, useNavigate } from 'react-router-dom'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { useCareerStore } from '@/store/careerStore'
import { getEventById } from '@/content/events'
import { EVENT_CATEGORY_LABELS } from '@/lib/labels'

export function SeasonEventPage() {
  const navigate = useNavigate()
  const { career, resolveEvent } = useCareerEngine()

  if (!career) return <Navigate to="/" replace />
  if (career.phase !== 'EVENT_PENDING' || !career.pendingEventId) return <Navigate to="/hub" replace />

  const event = getEventById(career.pendingEventId)

  function handleChoice(choiceId: string) {
    resolveEvent(choiceId)
    const updated = useCareerStore.getState().career
    navigate(updated?.phase === 'RETIRED' ? '/summary' : '/hub')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-lg rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
          {EVENT_CATEGORY_LABELS[event.category]} · temporada {career.season}
        </p>
        <p className="mb-6 text-lg">{event.text}</p>
        <div className="flex flex-col gap-3">
          {event.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice.id)}
              className="rounded-md border border-neutral-300 px-4 py-3 text-left transition hover:border-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:border-white dark:hover:bg-neutral-900"
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
