interface IconProps {
  size?: number
  color?: string
  className?: string
}

export function TrophyIcon({ size = 24, color = '#8a8d93', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ opacity: 0.35 }}>
      <path d="M8 4h8v3a4 4 0 01-4 4 4 4 0 01-4-4V4z" stroke={color} strokeWidth="1.6" />
      <path d="M8 5H5a3 3 0 003 3M16 5h3a3 3 0 01-3 3" stroke={color} strokeWidth="1.6" />
      <path d="M12 11v4M9 19h6M10 15h4v4h-4z" stroke={color} strokeWidth="1.6" />
    </svg>
  )
}
