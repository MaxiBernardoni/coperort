import { useMemo, useState } from 'react'
import { createRng } from '@/engine/rng'
import { clamp } from '@/engine/statMath'
import type { MinigameComponentProps } from '../types'

const SHOTS = 5
const GOALS_TO_WIN = 3

const ZONES = ['left', 'center', 'right'] as const
type Zone = (typeof ZONES)[number]

const ZONE_LABELS: Record<Zone, string> = {
  left: 'Izquierda',
  center: 'Centro',
  right: 'Derecha',
}

/**
 * Probabilidad de que el amague del arquero sea sincero. Un arquero de club grande
 * (difficulty alta) miente más seguido, así que leerlo vale menos.
 */
function honestLeanChance(difficulty: number): number {
  return clamp(0.85 - (difficulty / 100) * 0.45, 0.4, 0.85)
}

interface Round {
  lean: Zone
  honest: boolean
  bluffPick: number
}

interface ShotOutcome {
  playerZone: Zone
  keeperZone: Zone
  scored: boolean
}

function otherZones(zone: Zone): Zone[] {
  return ZONES.filter((candidate) => candidate !== zone)
}

/**
 * Cuando el arquero amaga en falso tiene dos palos para elegir. Con buena definición el
 * remate es más difícil de adivinar, así que sube la chance de que agarre el equivocado:
 * 50% con definición 0 (moneda al aire) hasta 80% con definición 99.
 */
function keeperEvadeChance(shooting: number): number {
  return 0.5 + (shooting / 100) * 0.3
}

export function PenaltyShootout({ seed, difficulty, opponentName, attributes, onComplete }: MinigameComponentProps) {
  // Todo el azar sale de la seed del motor, precomputado: el minijuego es reproducible.
  const rounds = useMemo<Round[]>(() => {
    const rng = createRng(seed)
    const honestChance = honestLeanChance(difficulty)
    return Array.from({ length: SHOTS }, () => ({
      lean: ZONES[rng.randInt(0, 2)],
      honest: rng.next() < honestChance,
      bluffPick: rng.next(),
    }))
  }, [seed, difficulty])

  const [outcomes, setOutcomes] = useState<ShotOutcome[]>([])
  const [lastShot, setLastShot] = useState<ShotOutcome | null>(null)

  const shotIndex = outcomes.length
  const finished = shotIndex >= SHOTS
  const score = outcomes.filter((outcome) => outcome.scored).length
  const round = finished ? null : rounds[shotIndex]

  function shoot(playerZone: Zone) {
    if (!round || lastShot) return

    const bluffOptions = otherZones(round.lean)
    const playerBluffIndex = bluffOptions.indexOf(playerZone)
    // Si pateaste al palo del amague no hay nada que esquivar: o el arquero fue sincero (atajó)
    // o se tiró a cualquiera de los otros dos (gol). La definición solo pesa cuando amagó en falso.
    const bluffZone =
      playerBluffIndex === -1
        ? bluffOptions[round.bluffPick < 0.5 ? 0 : 1]
        : bluffOptions[round.bluffPick < keeperEvadeChance(attributes.shooting) ? 1 - playerBluffIndex : playerBluffIndex]

    const keeperZone = round.honest ? round.lean : bluffZone
    const outcome: ShotOutcome = { playerZone, keeperZone, scored: keeperZone !== playerZone }

    setOutcomes([...outcomes, outcome])
    setLastShot(outcome)
  }

  function finishShot() {
    setLastShot(null)
  }

  const won = score >= GOALS_TO_WIN

  return (
    <div className="flex w-full max-w-[520px] flex-col gap-5">
      <header className="text-center">
        <p className="m-0 mb-1 text-[10px] font-bold tracking-[1.2px] text-text-label">FINAL DE COPA</p>
        <h1 className="m-0 font-display text-[30px] font-bold text-text">vs {opponentName}</h1>
        <p className="m-0 mt-1 text-[13px] text-text-secondary">
          Definición por penales — meté {GOALS_TO_WIN} de {SHOTS} para levantar la copa.
        </p>
      </header>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: SHOTS }, (_, index) => {
          const outcome = outcomes[index]
          const background = !outcome ? 'var(--color-border-strong)' : outcome.scored ? '#4caf6e' : '#c22b52'
          return (
            <span
              key={index}
              className="h-2.5 w-9 rounded-full"
              style={{ background }}
              aria-label={!outcome ? 'penal pendiente' : outcome.scored ? 'gol' : 'atajado'}
            />
          )
        })}
      </div>

      <div
        className="relative flex flex-col justify-end overflow-hidden rounded-[14px] p-4"
        style={{ aspectRatio: '16 / 10', background: 'linear-gradient(180deg, #1c6b3b, #155631)' }}
      >
        <div className="absolute top-4 right-4 left-4 h-[58%] rounded-[4px] border-4 border-white/80" />

        {!finished && round && (
          <div
            className="absolute top-[30%] h-14 w-12 rounded-[10px] transition-all duration-200"
            style={{
              background: '#f2984a',
              left: round.lean === 'left' ? '18%' : round.lean === 'center' ? 'calc(50% - 24px)' : 'auto',
              right: round.lean === 'right' ? '18%' : 'auto',
              transform: lastShot ? 'scale(1.1)' : 'none',
            }}
            aria-label={`el arquero se inclina hacia ${ZONE_LABELS[round.lean].toLowerCase()}`}
          />
        )}

        <div className="relative z-10 grid grid-cols-3 gap-2">
          {ZONES.map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => shoot(zone)}
              disabled={finished || lastShot !== null}
              className="cursor-pointer rounded-[10px] border-none bg-black/40 px-2 py-2.5 text-xs font-bold text-white transition hover:bg-black/60 disabled:cursor-default disabled:opacity-40"
            >
              {ZONE_LABELS[zone]}
            </button>
          ))}
        </div>
      </div>

      {!finished && round && !lastShot && (
        <p className="m-0 text-center text-[13px] text-text-secondary">
          El arquero se inclina hacia <strong className="text-accent">{ZONE_LABELS[round.lean].toLowerCase()}</strong>. Elegí
          dónde patear — ojo que a veces amaga.
        </p>
      )}

      {lastShot && (
        <div className="flex flex-col items-center gap-2">
          <p
            className="m-0 font-display text-2xl font-extrabold"
            style={{ color: lastShot.scored ? '#4caf6e' : '#c22b52' }}
          >
            {lastShot.scored ? '¡GOL!' : '¡ATAJÓ!'}
          </p>
          <p className="m-0 text-xs text-text-secondary">
            Pateaste a {ZONE_LABELS[lastShot.playerZone].toLowerCase()}, el arquero voló a{' '}
            {ZONE_LABELS[lastShot.keeperZone].toLowerCase()}.
          </p>
          {outcomes.length < SHOTS && (
            <button
              type="button"
              onClick={finishShot}
              className="cursor-pointer rounded-card border border-border-strong bg-transparent px-6 py-2 text-sm font-bold text-text hover:border-accent"
            >
              Siguiente penal
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
            {won ? '¡Campeón! Levantaste la copa.' : 'Se escapó la copa por penales.'}
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
