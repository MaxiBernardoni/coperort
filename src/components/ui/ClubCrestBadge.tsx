import { clubInitials } from '@/lib/clubVisuals'
import { hashColorPair } from '@/lib/colorHash'
import type { Club } from '@/types/club'

interface ClubCrestBadgeProps {
  club: Club
  size?: number
}

export function ClubCrestBadge({ club, size = 52 }: ClubCrestBadgeProps) {
  const { color1 } = hashColorPair(club.id)

  return (
    <span
      className="flex items-center justify-center font-display font-extrabold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.3,
        background: color1,
        clipPath: 'polygon(50% 0%, 100% 20%, 100% 65%, 50% 100%, 0% 65%, 0% 20%)',
      }}
    >
      {clubInitials(club.name)}
    </span>
  )
}
