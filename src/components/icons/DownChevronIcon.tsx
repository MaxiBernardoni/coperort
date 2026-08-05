interface IconProps {
  size?: number
  color?: string
  className?: string
}

export function DownChevronIcon({ size = 12, color = '#c22b52', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 8l6 8 4-5 6 9" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
