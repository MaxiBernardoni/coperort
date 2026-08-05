interface AttributeBarProps {
  label: string
  value: number
}

function barColor(value: number): string {
  if (value >= 70) return '#4caf6e'
  if (value >= 45) return '#f2984a'
  return '#c22b52'
}

export function AttributeBar({ label, value }: AttributeBarProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <span className="text-[10px] font-bold tracking-[1px] text-text-label">{label}</span>
        <span className="text-[11px] font-bold text-text">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border-strong">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: barColor(value) }} />
      </div>
    </div>
  )
}
