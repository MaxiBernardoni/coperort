import { useMemo, useState } from 'react'
import { createRng } from '@/engine/rng'
import { clamp } from '@/engine/statMath'
import type { MinigameComponentProps } from '../types'

const MAX_DEFENDERS = 6
/** rivales superados necesarios para que el remate valga la copa */
const BEATEN_TO_WIN = 3

/**
 * Chance de superar al defensor `index` (0-based). El regate y el ritmo del jugador suben la
 * base; cada defensor encarado la baja, así seguir siempre es cada vez más arriesgado.
 */
function beatChance(dribbling: number, pace: number, difficulty: number, index: number): number {
  const skill = (dribbling * 0.65 + pace * 0.35) / 100
  return clamp(0.85 * skill - (difficulty / 100) * 0.15 - index * 0.12, 0.08, 0.9)
}

type Status = 'running' | 'lost' | 'banked'

export function DribbleChallenge({ seed, difficulty, opponentName, attributes, onComplete }: MinigameComponentProps) {
  // Tiradas precomputadas desde la seed: el azar es del motor, la decisión de seguir es del usuario.
  const rolls = useMemo(() => {
    const rng = createRng(seed)
    return Array.from({ length: MAX_DEFENDERS }, () => rng.next())
  }, [seed])

  const [beaten, setBeaten] = useState(0)
  const [status, setStatus] = useState<Status>('running')

  const nextChance = beatChance(attributes.dribbling, attributes.pace, difficulty, beaten)
  const atLimit = beaten >= MAX_DEFENDERS

  function dribble() {
    if (status !== 'running' || atLimit) return
    if (rolls[beaten] < nextChance) setBeaten(beaten + 1)
    else setStatus('lost')
  }

  function shoot() {
    if (status !== 'running') return
    setStatus('banked')
  }

  const finished = status !== 'running'
  const score = status === 'lost' ? 0 : beaten
  const won = score >= BEATEN_TO_WIN

  return (
    <div className="flex w-full max-w-[520px] flex-col gap-5">
      <header className="text-center">
        <p className="m-0 mb-1 text-[10px] font-bold tracking-[1.2px] text-text-label">FINAL DE COPA</p>
        <h1 className="m-0 font-display text-[30px] font-bold text-text">vs {opponentName}</h1>
        <p className="m-0 mt-1 text-[13px] text-text-secondary">
          Encará y gambeteá. Superá {BEATEN_TO_WIN} rivales y rematá — pero si perdés la pelota, te vas sin nada.
        </p>
      </header>

      <div
        className="relative flex items-end justify-center gap-3 overflow-hidden rounded-[14px] p-5"
        style={{ aspectRatio: '16 / 9', background: 'linear-gradient(180deg, #1c6b3b, #155631)' }}
      >
        <div className="absolute top-4 right-4 left-4 bottom-4 rounded-[4px] border-2 border-white/25" />
        {Array.from({ length: MAX_DEFENDERS }, (_, index) => {
          const passed = index < beaten
          const isNext = index === beaten && !finished
          return (
            <span
              key={index}
              className="relative z-10 rounded-[10px] transition-all duration-200"
              style={{
                width: 28,
                height: passed ? 34 : 52,
                background: passed ? 'rgba(255,255,255,0.2)' : isNext ? '#c22b52' : 'rgba(0,0,0,0.45)',
                opacity: passed ? 0.5 : 1,
              }}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-card bg-surface p-3">
          <p className="m-0 font-display text-xl font-extrabold text-text">{beaten}</p>
          <p className="mt-0.5 mb-0 text-[10px] font-bold tracking-[1px] text-text-label">RIVALES SUPERADOS</p>
        </div>
        <div className="rounded-card bg-surface p-3">
          <p className="m-0 font-display text-xl font-extrabold" style={{ color: '#f2984a' }}>
            {finished ? '—' : `${Math.round(nextChance * 100)}%`}
          </p>
          <p className="mt-0.5 mb-0 text-[10px] font-bold tracking-[1px] text-text-label">CHANCE DEL PRÓXIMO</p>
        </div>
      </div>

      {!finished && (
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={dribble}
            disabled={atLimit}
            className="flex-1 cursor-pointer rounded-card border-none bg-accent px-6 py-3.5 text-[15px] font-bold text-[#141414] hover:bg-accent-hover disabled:cursor-default disabled:opacity-40"
          >
            {atLimit ? 'No queda nadie' : 'Encarar otro'}
          </button>
          <button
            type="button"
            onClick={shoot}
            className="flex-1 cursor-pointer rounded-card border border-border-strong bg-transparent px-6 py-3.5 text-[15px] font-bold text-text hover:border-accent"
          >
            Rematar ({beaten})
          </button>
        </div>
      )}

      {finished && (
        <div className="flex flex-col items-center gap-3 rounded-card bg-surface p-5 text-center">
          <p className="m-0 font-display text-[32px] font-extrabold" style={{ color: won ? '#4caf6e' : '#c22b52' }}>
            {status === 'lost' ? 'PERDISTE LA PELOTA' : `${score} RIVALES`}
          </p>
          <p className="m-0 text-sm text-text-secondary">
            {won ? '¡Campeón! Levantaste la copa.' : 'No alcanzó: se escapó la copa.'}
          </p>
          <button
            type="button"
            onClick={() => onComplete({ won, score, maxScore: MAX_DEFENDERS })}
            className="cursor-pointer rounded-card border-none bg-accent px-8 py-3 text-[15px] font-bold text-[#141414] hover:bg-accent-hover"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  )
}
