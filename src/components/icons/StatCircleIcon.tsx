interface IconProps {
  size?: number
  color: string
  className?: string
}

export function StatCircleIcon({ size = 16, color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    </svg>
  )
}
