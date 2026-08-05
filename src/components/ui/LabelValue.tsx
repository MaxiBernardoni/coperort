import type { ReactNode } from 'react'

interface LabelValueProps {
  label: string
  value: ReactNode
  align?: 'left' | 'right'
  size?: 'sm' | 'lg'
}

export function LabelValue({ label, value, align = 'left', size = 'lg' }: LabelValueProps) {
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <p className="m-0 mb-0.5 text-[10px] font-bold tracking-[1.2px] text-text-label">{label}</p>
      <p className={`m-0 font-display font-extrabold text-text ${size === 'lg' ? 'text-[22px]' : 'text-base'}`}>{value}</p>
    </div>
  )
}
