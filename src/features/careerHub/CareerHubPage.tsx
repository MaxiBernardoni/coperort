import { Navigate, useNavigate } from 'react-router-dom'
import { AttributeBar } from '@/components/ui/AttributeBar'
import { ClubOfferPicker } from '@/components/ui/ClubOfferPicker'
import { EmptyState } from '@/components/ui/EmptyState'
import { PlayerIdentityHeader } from '@/components/ui/PlayerIdentityHeader'
import { SeasonTimelineTable } from '@/components/ui/SeasonTimelineTable'
import { StatTilesRow } from '@/components/ui/StatTilesRow'
import { TrophyIcon } from '@/components/icons/TrophyIcon'
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon'
import { getClubById } from '@/content/clubs'
import { getCountryByName } from '@/content/countries'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { useCareerStore } from '@/store/careerStore'
import { ATTRIBUTE_KEYS } from '@/engine/statMath'
import { ATTRIBUTE_LABELS, POSITION_SHORT_LABELS } from '@/lib/labels'

export function CareerHubPage() {
  const navigate = useNavigate()
  const { career, advanceSeason, selectClub } = useCareerEngine()

  if (!career) return <Navigate to="/" replace />
  if (career.phase === 'EVENT_PENDING') return <Navigate to="/event" replace />
  if (career.phase === 'RETIRED') return <Navigate to="/summary" replace />

  const { player, currentClub, stats } = career
  const country = getCountryByName(player.identity.nationality)
  const countryId = country?.id ?? 'ar'
  const countryCode = player.identity.nationality.slice(0, 3).toUpperCase()

  function handleAdvance() {
    advanceSeason()
    if (useCareerStore.getState().career?.phase === 'EVENT_PENDING') navigate('/event')
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

        {career.phase === 'CLUB_PENDING' && (
          <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
            <span>Libre — elegí un club</span>
            <InfoCircleIcon />
          </div>
        )}

        <div className="rounded-card bg-surface p-4">
          <h3 className="m-0 mb-3 text-[13px] font-bold text-text">Atributos</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ATTRIBUTE_KEYS.map((key) => (
              <AttributeBar key={key} label={ATTRIBUTE_LABELS[key]} value={player.attributes[key]} />
            ))}
          </div>
        </div>

        <StatTilesRow matches={stats.matches} goals={stats.goals} assists={stats.assists} />

        <EmptyState icon={<TrophyIcon />} label="VITRINA VACÍA" />

        {career.phase === 'CLUB_PENDING' ? (
          <ClubOfferPicker offers={career.clubOffers} onSelect={selectClub} />
        ) : (
          <button
            type="button"
            onClick={handleAdvance}
            className="mt-1 cursor-pointer rounded-card border-none bg-accent px-4 py-3.5 text-[15px] font-bold text-[#141414] hover:bg-accent-hover"
          >
            Avanzar temporada
          </button>
        )}
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
