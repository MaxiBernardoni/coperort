import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  label: string
}

export function EmptyState({ icon, label }: EmptyStateProps) {
  return (
    <div className="rounded-card bg-surface p-5 text-center">
      <div className="mx-auto mb-2 flex justify-center">{icon}</div>
      <p className="m-0 text-[11px] font-bold tracking-[1.5px] text-text-muted">{label}</p>
    </div>
  )
}
