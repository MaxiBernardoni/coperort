import { FlagChip } from './FlagChip'
import { LabelValue } from './LabelValue'
import { RatingBadge } from './RatingBadge'
import { formatCurrency } from '@/lib/labels'

interface PlayerIdentityHeaderProps {
  overallRating: number
  countryId: string
  countryCode: string
  jerseyNumber: number
  positionShort: string
  age: number
  marketValue: number
  clubName?: string
}

export function PlayerIdentityHeader({
  overallRating,
  countryId,
  countryCode,
  jerseyNumber,
  positionShort,
  age,
  marketValue,
  clubName,
}: PlayerIdentityHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2.5">
        <RatingBadge rating={overallRating} />
        <div className="flex flex-col gap-1.5">
          <FlagChip countryId={countryId} label={countryCode} />
          <span className="w-fit rounded-full bg-position px-2.5 py-0.5 text-xs font-bold text-white">
            #{jerseyNumber} {positionShort}
          </span>
        </div>
        {clubName && <p className="m-0 ml-1.5 text-[15px] font-bold text-text">{clubName}</p>}
      </div>
      <div className="flex gap-5">
        <LabelValue label="EDAD" value={age} align="right" />
        <LabelValue label="VALOR" value={formatCurrency(marketValue)} align="right" />
      </div>
    </div>
  )
}
