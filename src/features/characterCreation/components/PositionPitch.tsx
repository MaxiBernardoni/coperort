import { TACTICAL_POSITIONS } from '@/content/tacticalPositions'

interface PositionPitchProps {
  selectedId: string
  onSelect: (tacticalId: string) => void
}

export function PositionPitch({ selectedId, onSelect }: PositionPitchProps) {
  return (
    <div
      className="relative w-full max-w-[260px] overflow-hidden rounded-[14px]"
      style={{ aspectRatio: '260 / 340', background: 'linear-gradient(180deg, #1c6b3b, #155631)' }}
    >
      <div className="absolute top-1.5 right-1.5 bottom-1.5 left-1.5 rounded-[4px] border-2 border-white/35" />
      <div className="absolute top-1/2 right-1.5 left-1.5 h-0.5 bg-white/35" />
      <div className="absolute top-1/2 left-1/2 h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/35" />
      <div className="absolute bottom-1.5 left-1/2 h-11 w-[90px] -translate-x-1/2 border-2 border-t-0 border-white/35" />
      <div className="absolute top-1.5 left-1/2 h-11 w-[90px] -translate-x-1/2 border-2 border-b-0 border-white/35" />
      {TACTICAL_POSITIONS.map((position) => {
        const selected = position.id === selectedId
        return (
          <button
            key={position.id}
            type="button"
            onClick={() => onSelect(position.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1.5 text-[10px] font-bold whitespace-nowrap"
            style={{
              top: `${position.top}%`,
              left: `${position.left}%`,
              background: selected ? '#f2984a' : 'rgba(0,0,0,0.35)',
              color: selected ? '#141414' : '#fff',
            }}
          >
            {position.id}
          </button>
        )
      })}
    </div>
  )
}
