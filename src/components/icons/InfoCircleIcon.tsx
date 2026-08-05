interface IconProps {
  size?: number
  color?: string
  className?: string
}

export function InfoCircleIcon({ size = 13, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <line x1="12" y1="11" x2="12" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill={color} />
    </svg>
  )
}
