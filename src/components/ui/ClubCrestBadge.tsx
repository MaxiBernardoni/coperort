import { clubInitials } from '@/lib/clubVisuals'
import { hashColorPair, hashPick, hashString } from '@/lib/colorHash'
import type { Club } from '@/types/club'

/**
 * Escudos generados, no reales: los de los clubes de verdad son marcas registradas y esto es
 * un repo público. Forma, patrón y colores salen del hash del id, así el escudo de un club es
 * siempre el mismo pero no hay que curar nada a mano para 274 clubes.
 */
const SHAPES = ['shield', 'round', 'crest'] as const
const PATTERNS = ['halves', 'stripes', 'sash', 'band', 'solid'] as const

type Shape = (typeof SHAPES)[number]
type Pattern = (typeof PATTERNS)[number]

/** Contorno del escudo en un viewBox 0 0 100 110. */
const SHAPE_PATHS: Record<Shape, string> = {
  shield: 'M8 6 H92 V58 C92 84 72 98 50 106 C28 98 8 84 8 58 Z',
  round: 'M50 4 C76 4 96 25 96 52 C96 82 74 100 50 106 C26 100 4 82 4 52 C4 25 24 4 50 4 Z',
  crest: 'M10 4 H90 V70 L50 106 L10 70 Z',
}

function PatternFill({ pattern, color2 }: { pattern: Pattern; color2: string }) {
  switch (pattern) {
    case 'halves':
      return <rect x="50" width="50" height="110" fill={color2} />
    case 'stripes':
      return (
        <>
          {[14, 42, 70].map((x) => (
            <rect key={x} x={x} width="16" height="110" fill={color2} />
          ))}
        </>
      )
    case 'sash':
      return <path d="M0 92 L92 0 H100 V22 L22 110 H0 Z" fill={color2} />
    case 'band':
      return <rect y="40" width="100" height="26" fill={color2} />
    case 'solid':
      return null
  }
}

interface ClubCrestBadgeProps {
  club: Club
  size?: number
}

export function ClubCrestBadge({ club, size = 52 }: ClubCrestBadgeProps) {
  const { color1, color2 } = hashColorPair(club.id)
  const shape = hashPick(club.id, SHAPES)
  // se desplaza la seed para que forma y patrón no queden correlacionados
  const pattern = hashPick(`${club.id}-pattern`, PATTERNS)
  const clipId = `crest-${hashString(club.id)}-${shape}`

  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110" aria-hidden="true" className="flex-shrink-0">
      <defs>
        <clipPath id={clipId}>
          <path d={SHAPE_PATHS[shape]} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect width="100" height="110" fill={color1} />
        <PatternFill pattern={pattern} color2={color2} />
        <rect width="100" height="55" fill="#fff" opacity="0.08" />
      </g>

      <path d={SHAPE_PATHS[shape]} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="4" />

      <text
        x="50"
        y="62"
        textAnchor="middle"
        fill="#fff"
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="800"
        fontSize="38"
        style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.35)', strokeWidth: 5 }}
      >
        {clubInitials(club.name)}
      </text>
    </svg>
  )
}
