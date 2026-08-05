interface IconProps {
  size?: number
  color?: string
  className?: string
}

export function SearchIcon({ size = 16, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
