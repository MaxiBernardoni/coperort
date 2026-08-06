import { Navigate, useNavigate } from 'react-router-dom'
import { EventChoiceCard } from '@/components/ui/EventChoiceCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { PlayerIdentityHeader } from '@/components/ui/PlayerIdentityHeader'
import { SeasonTimelineTable } from '@/components/ui/SeasonTimelineTable'
import { StatTilesRow } from '@/components/ui/StatTilesRow'
import { TrophyIcon } from '@/components/icons/TrophyIcon'
import { getClubById } from '@/content/clubs'
import { getCountryByName } from '@/content/countries'
import { getEventById } from '@/content/events'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { useCareerStore } from '@/store/careerStore'
import { summarizeChoiceEffect } from '@/lib/eventEffects'
import { EVENT_CATEGORY_LABELS, POSITION_SHORT_LABELS } from '@/lib/labels'

export function SeasonEventPage() {
  const navigate = useNavigate()
  const { career, resolveEvent } = useCareerEngine()

  if (!career) return <Navigate to="/" replace />
  if (career.phase !== 'EVENT_PENDING' || !career.pendingEventId) return <Navigate to="/hub" replace />

  const { player, currentClub, stats } = career
  const event = getEventById(career.pendingEventId)
  const country = getCountryByName(player.identity.nationality)
  const countryId = country?.id ?? 'ar'
  const countryCode = player.identity.nationality.slice(0, 3).toUpperCase()

  function handleChoice(choiceId: string) {
    resolveEvent(choiceId)
    const updated = useCareerStore.getState().career
    if (updated?.phase === 'MINIGAME_PENDING') return navigate('/minigame')
    navigate(updated?.phase === 'RETIRED' ? '/summary' : '/hub')
  }

  return (
    <main className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-7 px-6 py-8 lg:grid-cols-[1.15fr_1fr]">
      <div className="flex flex-col gap-[22px]">
        <PlayerIdentityHeader
          overallRating={player.overallRating}
          countryId={countryId}
          countryCode={countryCode}
          jerseyNumber={player.identity.jerseyNumber}
          positionShort={POSITION_SHORT_LABELS[player.identity.position]}
          age={player.age}
          marketValue={player.marketValue}
          clubName={currentClub?.name}
        />

        <StatTilesRow matches={stats.matches} goals={stats.goals} assists={stats.assists} />

        <EmptyState icon={<TrophyIcon />} label="VITRINA VACÍA" />

        <div>
          <h3 className="m-0 mb-1 text-base font-bold text-text">{EVENT_CATEGORY_LABELS[event.category]}</h3>
          <p className="m-0 mb-3.5 text-[13px] text-text-secondary">{event.text}</p>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {event.choices.map((choice) => (
              <EventChoiceCard
                key={choice.id}
                label={choice.label}
                categoryLabel={EVENT_CATEGORY_LABELS[event.category]}
                effect={summarizeChoiceEffect(choice)}
                onSelect={() => handleChoice(choice.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <SeasonTimelineTable
        seasonHistory={career.seasonHistory}
        currentAge={player.age}
        retirementAge={career.retirementAge}
        getClubLabel={(clubId) => getClubById(clubId).name}
      />
    </main>
  )
}
