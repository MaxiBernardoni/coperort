import type { ReactNode } from 'react'
import { hashColorPair } from '@/lib/colorHash'

/**
 * Banderas dibujadas a mano en SVG sobre un viewBox 3x2 común, para los países que el juego
 * usa de verdad: los 10 de CONMEBOL (donde están todos los clubes) más las ligas europeas
 * grandes. El resto de los ~195 países de `content/countries.ts` cae al roundel de dos colores
 * derivado del hash — es un placeholder honesto, no una bandera equivocada.
 *
 * Las que llevan escudo o sol (Argentina, Uruguay, Paraguay, México...) lo resuelven con una
 * forma simple: a 14-22px de ancho el detalle real no se distingue y solo agrega peso.
 */
const FLAGS: Record<string, ReactNode> = {
  ar: (
    <>
      <rect width="3" height="2" fill="#74acdf" />
      <rect y="0.667" width="3" height="0.666" fill="#fff" />
      <circle cx="1.5" cy="1" r="0.22" fill="#f6b40e" />
    </>
  ),
  br: (
    <>
      <rect width="3" height="2" fill="#009c3b" />
      <path d="M1.5 0.25 L2.75 1 L1.5 1.75 L0.25 1 Z" fill="#ffdf00" />
      <circle cx="1.5" cy="1" r="0.42" fill="#002776" />
    </>
  ),
  uy: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect y="0.44" width="3" height="0.22" fill="#0038a8" />
      <rect y="0.89" width="3" height="0.22" fill="#0038a8" />
      <rect y="1.33" width="3" height="0.22" fill="#0038a8" />
      <rect y="1.78" width="3" height="0.22" fill="#0038a8" />
      <rect width="1.2" height="1.11" fill="#fff" />
      <circle cx="0.6" cy="0.55" r="0.28" fill="#f6b40e" />
    </>
  ),
  py: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect width="3" height="0.667" fill="#d52b1e" />
      <rect y="1.333" width="3" height="0.667" fill="#0038a8" />
      <circle cx="1.5" cy="1" r="0.2" fill="#f6b40e" />
    </>
  ),
  cl: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect y="1" width="3" height="1" fill="#d52b1e" />
      <rect width="1" height="1" fill="#0039a6" />
      <path d="M0.5 0.28 L0.6 0.58 L0.9 0.58 L0.66 0.76 L0.75 1.05 L0.5 0.87 L0.25 1.05 L0.34 0.76 L0.1 0.58 L0.4 0.58 Z" fill="#fff" />
    </>
  ),
  bo: (
    <>
      <rect width="3" height="2" fill="#d52b1e" />
      <rect y="0.667" width="3" height="0.667" fill="#f9e300" />
      <rect y="1.333" width="3" height="0.667" fill="#007a33" />
    </>
  ),
  pe: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#d91023" />
      <rect x="2" width="1" height="2" fill="#d91023" />
    </>
  ),
  ec: (
    <>
      <rect width="3" height="2" fill="#ffdd00" />
      <rect y="1" width="3" height="0.5" fill="#034ea2" />
      <rect y="1.5" width="3" height="0.5" fill="#ed1c24" />
      <circle cx="1.5" cy="1" r="0.26" fill="#f6b40e" stroke="#034ea2" strokeWidth="0.05" />
    </>
  ),
  co: (
    <>
      <rect width="3" height="2" fill="#fcd116" />
      <rect y="1" width="3" height="0.5" fill="#003893" />
      <rect y="1.5" width="3" height="0.5" fill="#ce1126" />
    </>
  ),
  ve: (
    <>
      <rect width="3" height="2" fill="#cf142b" />
      <rect width="3" height="1.333" fill="#00247d" />
      <rect width="3" height="0.667" fill="#fc0" />
      <circle cx="1.5" cy="1.05" r="0.06" fill="#fff" />
      <circle cx="1.15" cy="1.13" r="0.06" fill="#fff" />
      <circle cx="1.85" cy="1.13" r="0.06" fill="#fff" />
    </>
  ),

  es: (
    <>
      <rect width="3" height="2" fill="#aa151b" />
      <rect y="0.5" width="3" height="1" fill="#f1bf00" />
    </>
  ),
  it: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#009246" />
      <rect x="2" width="1" height="2" fill="#ce2b37" />
    </>
  ),
  fr: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#002395" />
      <rect x="2" width="1" height="2" fill="#ed2939" />
    </>
  ),
  de: (
    <>
      <rect width="3" height="2" fill="#000" />
      <rect y="0.667" width="3" height="0.667" fill="#dd0000" />
      <rect y="1.333" width="3" height="0.667" fill="#ffce00" />
    </>
  ),
  pt: (
    <>
      <rect width="3" height="2" fill="#da291c" />
      <rect width="1.2" height="2" fill="#046a38" />
      <circle cx="1.2" cy="1" r="0.32" fill="#ffe900" stroke="#da291c" strokeWidth="0.06" />
    </>
  ),
  nl: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect width="3" height="0.667" fill="#ae1c28" />
      <rect y="1.333" width="3" height="0.667" fill="#21468b" />
    </>
  ),
  be: (
    <>
      <rect width="3" height="2" fill="#fdda24" />
      <rect width="1" height="2" fill="#000" />
      <rect x="2" width="1" height="2" fill="#ef3340" />
    </>
  ),
  gb: (
    <>
      <rect width="3" height="2" fill="#012169" />
      <path d="M0 0 L3 2 M3 0 L0 2" stroke="#fff" strokeWidth="0.4" />
      <path d="M0 0 L3 2 M3 0 L0 2" stroke="#c8102e" strokeWidth="0.2" />
      <path d="M1.5 0 V2 M0 1 H3" stroke="#fff" strokeWidth="0.66" />
      <path d="M1.5 0 V2 M0 1 H3" stroke="#c8102e" strokeWidth="0.4" />
    </>
  ),
  hr: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect width="3" height="0.667" fill="#ff0000" />
      <rect y="1.333" width="3" height="0.667" fill="#171796" />
    </>
  ),
  pl: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect y="1" width="3" height="1" fill="#dc143c" />
    </>
  ),
  dk: (
    <>
      <rect width="3" height="2" fill="#c8102e" />
      <path d="M1.05 0 V2 M0 0.9 H3" stroke="#fff" strokeWidth="0.34" />
    </>
  ),
  se: (
    <>
      <rect width="3" height="2" fill="#006aa7" />
      <path d="M1.05 0 V2 M0 0.9 H3" stroke="#fecc00" strokeWidth="0.34" />
    </>
  ),
  no: (
    <>
      <rect width="3" height="2" fill="#ba0c2f" />
      <path d="M1.05 0 V2 M0 0.9 H3" stroke="#fff" strokeWidth="0.5" />
      <path d="M1.05 0 V2 M0 0.9 H3" stroke="#00205b" strokeWidth="0.26" />
    </>
  ),
  ch: (
    <>
      <rect width="3" height="2" fill="#d52b1e" />
      <path d="M1.5 0.5 V1.5 M1 1 H2" stroke="#fff" strokeWidth="0.26" />
    </>
  ),
  at: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect width="3" height="0.667" fill="#ed2939" />
      <rect y="1.333" width="3" height="0.667" fill="#ed2939" />
    </>
  ),
  gr: (
    <>
      <rect width="3" height="2" fill="#fff" />
      {[0, 2, 4, 6, 8].map((index) => (
        <rect key={index} y={index * 0.222} width="3" height="0.222" fill="#0d5eaf" />
      ))}
      <rect width="1.24" height="1.11" fill="#0d5eaf" />
      <path d="M0.5 0 V1.11 M0 0.44 H1.24" stroke="#fff" strokeWidth="0.222" />
    </>
  ),
  mx: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#006847" />
      <rect x="2" width="1" height="2" fill="#ce1126" />
      <circle cx="1.5" cy="1" r="0.22" fill="#8c9157" />
    </>
  ),
  us: (
    <>
      <rect width="3" height="2" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((index) => (
        <rect key={index} y={index * 0.1538} width="3" height="0.1538" fill="#b31942" />
      ))}
      <rect width="1.2" height="1.077" fill="#0a3161" />
    </>
  ),
}

export function hasRealFlag(countryId: string): boolean {
  return countryId in FLAGS
}

interface CountryFlagProps {
  countryId: string
  width?: number
  rounded?: 'sm' | 'full'
  className?: string
}

/** Bandera real si el país está cubierto; si no, el roundel de dos colores del hash. */
export function CountryFlag({ countryId, width = 14, rounded = 'sm', className }: CountryFlagProps) {
  const isCircle = rounded === 'full'
  const height = isCircle ? width : Math.round((width / 3) * 2)
  const flag = FLAGS[countryId]

  if (!flag) {
    const { color1, color2 } = hashColorPair(countryId)
    return (
      <span
        className={`inline-block flex-shrink-0 overflow-hidden ${isCircle ? 'rounded-full' : 'rounded-sm'} ${className ?? ''}`}
        style={{ width, height, background: color1 }}
      >
        <span className="block h-1/2 w-full" style={{ background: color2 }} />
      </span>
    )
  }

  return (
    <svg
      viewBox="0 0 3 2"
      width={width}
      height={height}
      preserveAspectRatio={isCircle ? 'xMidYMid slice' : 'none'}
      className={`inline-block flex-shrink-0 ${isCircle ? 'rounded-full' : 'rounded-sm'} ${className ?? ''}`}
      style={{ objectFit: 'cover' }}
      aria-hidden="true"
    >
      {flag}
    </svg>
  )
}
