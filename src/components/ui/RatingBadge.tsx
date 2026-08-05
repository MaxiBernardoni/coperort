interface RatingBadgeProps {
  rating: number
}

export function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <div
      className="flex h-[66px] w-[66px] flex-col items-center justify-center rounded-[14px]"
      style={{ background: 'linear-gradient(160deg, #f7a35c, #e8792a)' }}
    >
      <span className="text-[9px] font-extrabold tracking-[1px] text-[#3a1f00]">OVR</span>
      <span className="font-display text-[28px] leading-none font-extrabold text-[#1c1000]">{rating}</span>
    </div>
  )
}
