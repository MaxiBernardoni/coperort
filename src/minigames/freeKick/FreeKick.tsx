import { useEffect, useMemo, useRef, useState } from 'react'
import { createRng } from '@/engine/rng'
import { clamp } from '@/engine/statMath'
import type { MinigameComponentProps } from '../types'

const SHOTS = 3
const GOALS_TO_WIN = 2
const SWEEP_MS = 1500

interface Attempt {
  /** centro de la zona verde, 0-100 */
  targetCenter: number
}

interface ShotOutcome {
  stoppedAt: number
  targetCenter: number
  halfWidth: number
  scored: boolean
}

/**
 * Ancho de la zona verde (mitad, en % de la barra). Un buen definidor tiene más margen;
 * un rival de mucha reputación (mejor barrera y arquero) se lo achica.
 */
function targetHalfWidth(shooting: number, passing: number, difficulty: number): number {
  const skill = (shooting * 0.7 + passing * 0.3) / 100
  return clamp(6 + skill * 10 - (difficulty / 100) * 5, 3.5, 16)
}

export function FreeKick({ seed, difficulty, opponentName, attributes, onComplete }: MinigameComponentProps) {
  const halfWidth = targetHalfWidth(attributes.shooting, attributes.passing, difficulty)

  const attempts = useMemo<Attempt[]>(() => {
    const rng = createRng(seed)
    // se mantiene la zona lejos de los bordes para que siempre sea alcanzable
    return Array.from({ length: SHOTS }, () => ({ targetCenter: rng.randInt(20, 80) }))
  }, [seed])

  const [outcomes, setOutcomes] = useState<ShotOutcome[]>([])
  const [lastShot, setLastShot] = useState<ShotOutcome | null>(null)
  const [marker, setMarker] = useState(0)

  const shotIndex = outcomes.length
  const finished = shotIndex >= SHOTS
  const running = !finished && !lastShot
  const attempt = finished ? null : attempts[shotIndex]

  // El marcador barre la barra de ida y vuelta hasta que el usuario lo frena.
  const startRef = useRef(0)
  useEffect(() => {
    if (!running) return
    let frame = 0
    startRef.current = performance.now()

    const tick = (now: number) => {
      const elapsed = (now - startRef.current) % (SWEEP_MS * 2)
      const progress = elapsed / SWEEP_MS
      setMarker(progress <= 1 ? progress * 100 : (2 - progress) * 100)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running, shotIndex])

  function shoot() {
    if (!attempt || lastShot) return
    const scored = Math.abs(marker - attempt.targetCenter) <= halfWidth
    const outcome: ShotOutcome = { stoppedAt: marker, targetCenter: attempt.targetCenter, halfWidth, scored }
    setOutcomes([...outcomes, outcome])
    setLastShot(outcome)
  }

  const score = outcomes.filter((outcome) => outcome.scored).length
  const won = score >= GOALS_TO_WIN
  const shown = lastShot ?? (attempt ? { targetCenter: attempt.targetCenter, halfWidth } : null)

  return (
    <div className="flex w-full max-w-[520px] flex-col gap-5">
      <header className="text-center">
        <p className="m-0 mb-1 text-[10px] font-bold tracking-[1.2px] text-text-label">FINAL DE COPA</p>
        <h1 className="m-0 font-display text-[30px] font-bold text-text">vs {opponentName}</h1>
        <p className="m-0 mt-1 text-[13px] text-text-secondary">
          Tiros libres — clavá {GOALS_TO_WIN} de {SHOTS} en el ángulo para levantar la copa.
        </p>
      </header>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: SHOTS }, (_, index) => {
          const outcome = outcomes[index]
          const background = !outcome ? 'var(--color-border-strong)' : outcome.scored ? '#4caf6e' : '#c22b52'
          return <span key={index} className="h-2.5 w-12 rounded-full" style={{ background }} />
        })}
      </div>

      <div
        className="relative flex flex-col justify-end gap-4 overflow-hidden rounded-[14px] p-4"
        style={{ aspectRatio: '16 / 10', background: 'linear-gradient(180deg, #1c6b3b, #155631)' }}
      >
        <div className="absolute top-4 right-4 left-4 h-[48%] rounded-[4px] border-4 border-white/80" />
        <div className="absolute top-[52%] left-1/2 flex -translate-x-1/2 gap-1">
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className="h-9 w-3 rounded-t-full bg-black/45" />
          ))}
        </div>

        <div className="relative z-10">
          <div className="relative h-7 overflow-hidden rounded-full bg-black/50">
            {shown && (
              <span
                className="absolute top-0 bottom-0 rounded-full"
                style={{
                  left: `${Math.max(0, shown.targetCenter - shown.halfWidth)}%`,
                  width: `${shown.halfWidth * 2}%`,
                  background: 'rgba(76,175,110,0.55)',
                }}
              />
            )}
            <span
              className="absolute top-0 bottom-0 w-1 rounded-full bg-white"
              style={{ left: `calc(${lastShot ? lastShot.stoppedAt : marker}% - 2px)` }}
            />
          </div>
          <p className="m-0 mt-2 text-center text-[11px] text-white/70">
            Frená el marcador dentro de la zona verde
          </p>
        </div>
      </div>

      {running && (
        <button
          type="button"
          onClick={shoot}
          className="cursor-pointer rounded-card border-none bg-accent px-8 py-4 text-base font-bold text-[#141414] hover:bg-accent-hover"
        >
          ¡Pegarle!
        </button>
      )}

      {lastShot && (
        <div className="flex flex-col items-center gap-2">
          <p className="m-0 font-display text-2xl font-extrabold" style={{ color: lastShot.scored ? '#4caf6e' : '#c22b52' }}>
            {lastShot.scored ? '¡AL ÁNGULO!' : 'AFUERA'}
          </p>
          {outcomes.length < SHOTS && (
            <button
              type="button"
              onClick={() => setLastShot(null)}
              className="cursor-pointer rounded-card border border-border-strong bg-transparent px-6 py-2 text-sm font-bold text-text hover:border-accent"
            >
              Siguiente tiro
            </button>
          )}
        </div>
      )}

      {finished && (
        <div className="flex flex-col items-center gap-3 rounded-card bg-surface p-5 text-center">
          <p className="m-0 font-display text-[32px] font-extrabold text-text">
            {score} / {SHOTS}
          </p>
          <p className="m-0 text-sm" style={{ color: won ? '#4caf6e' : '#c22b52' }}>
            {won ? '¡Campeón! Levantaste la copa.' : 'Se escapó la copa por poco.'}
          </p>
          <button
            type="button"
            onClick={() => onComplete({ won, score, maxScore: SHOTS })}
            className="cursor-pointer rounded-card border-none bg-accent px-8 py-3 text-[15px] font-bold text-[#141414] hover:bg-accent-hover"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  )
}
