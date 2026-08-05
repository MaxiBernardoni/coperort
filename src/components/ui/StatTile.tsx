import type { ReactNode } from 'react'

interface StatTileProps {
  icon?: ReactNode
  value: ReactNode
  label: string
  variant?: 'default' | 'gradient'
}

export function StatTile({ icon, value, label, variant = 'default' }: StatTileProps) {
  const isGradient = variant === 'gradient'
  return (
    <div
      className={`rounded-card p-3.5 text-center sm:p-4 ${isGradient ? '' : 'bg-surface'}`}
      style={isGradient ? { background: 'linear-gradient(160deg, #f7a35c, #e8792a)' } : undefined}
    >
      {icon && <div className="mx-auto mb-1.5 flex justify-center">{icon}</div>}
      <p className={`m-0 font-display text-xl font-extrabold ${isGradient ? 'text-[#1c1000]' : 'text-text'}`}>{value}</p>
      <p className={`mt-0.5 mb-0 text-[10px] font-bold tracking-[1px] ${isGradient ? 'text-[#3a1f00]' : 'text-text-label'}`}>
        {label}
      </p>
    </div>
  )
}
