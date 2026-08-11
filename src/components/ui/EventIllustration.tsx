import type { EventCategory } from '@/types/event'

/** Tinte de fondo + ícono lineal por categoría de evento, para reemplazar la caja rayada con texto. */
const ICONS: Record<EventCategory, { tint: string; path: React.ReactNode }> = {
  training: {
    tint: '#f2984a',
    path: (
      <>
        <path d="M6 12h12M6 9v6M18 9v6M3 10v4M21 10v4" />
      </>
    ),
  },
  diet: {
    tint: '#4caf6e',
    path: (
      <>
        <path d="M12 3c-1.5 2-2 3.5-2 5a2 2 0 004 0c0-1.5-.5-3-2-5z" />
        <path d="M12 8v3M7 21c-2-2-3-5-3-8a8 8 0 0116 0c0 3-1 6-3 8" />
      </>
    ),
  },
  injury: {
    tint: '#c22b52',
    path: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
  },
  transfer: {
    tint: '#8a8d93',
    path: (
      <>
        <path d="M4 8h13M13 4l4 4-4 4" />
        <path d="M20 16H7M11 12l-4 4 4 4" />
      </>
    ),
  },
  loan: {
    tint: '#f2984a',
    path: (
      <>
        <path d="M3 12h18M3 12l5-5M3 12l5 5" strokeDasharray="2 2" />
        <rect x="15" y="7" width="6" height="10" rx="1" />
      </>
    ),
  },
  media: {
    tint: '#8a8d93',
    path: (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 11a6 6 0 0012 0M12 17v4M9 21h6" />
      </>
    ),
  },
  scandal: {
    tint: '#c22b52',
    path: (
      <>
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <circle cx="12" cy="13" r="3.5" />
        <path d="M9 7l1.5-2h3L15 7" />
      </>
    ),
  },
  personal: {
    tint: '#4caf6e',
    path: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
      </>
    ),
  },
}

interface EventIllustrationProps {
  category: EventCategory
  className?: string
}

export function EventIllustration({ category, className }: EventIllustrationProps) {
  const { tint, path } = ICONS[category]
  return (
    <span
      className={`flex aspect-video w-full items-center justify-center rounded-[10px] ${className ?? ''}`}
      style={{ background: `${tint}1f` }}
    >
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {path}
      </svg>
    </span>
  )
}
