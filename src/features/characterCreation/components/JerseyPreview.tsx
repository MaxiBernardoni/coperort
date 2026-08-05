import { hashColorPair } from '@/lib/colorHash'

interface JerseyPreviewProps {
  countryId: string
  surname: string
  jerseyNumber: number
}

export function JerseyPreview({ countryId, surname, jerseyNumber }: JerseyPreviewProps) {
  const { color1, color2 } = hashColorPair(countryId)

  return (
    <div className="relative h-[250px] w-[210px]">
      <div
        className="absolute top-[30px] left-[35px] h-[190px] w-[140px] rounded-t-[28px] rounded-b-[16px]"
        style={{
          background: `repeating-linear-gradient(90deg, ${color1} 0px, ${color1} 17px, ${color2} 17px, ${color2} 34px)`,
          boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
        }}
      />
      <div
        className="absolute top-[38px] left-[8px] h-[70px] w-[48px] rounded-2xl"
        style={{ background: color1, transform: 'rotate(-18deg)', boxShadow: '0 8px 16px rgba(0,0,0,0.4)' }}
      />
      <div
        className="absolute top-[38px] right-[8px] h-[70px] w-[48px] rounded-2xl"
        style={{ background: color1, transform: 'rotate(18deg)', boxShadow: '0 8px 16px rgba(0,0,0,0.4)' }}
      />
      <div
        className="absolute top-[26px] left-1/2 h-4 w-[46px] -translate-x-1/2"
        style={{ background: color2, clipPath: 'polygon(0 0, 100% 0, 70% 100%, 30% 100%)' }}
      />
      <p
        className="absolute top-[88px] left-1/2 m-0 -translate-x-1/2 font-display text-[15px] font-bold tracking-[1px] text-white"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
      >
        {surname.toUpperCase()}
      </p>
      <p
        className="absolute top-[110px] left-1/2 m-0 -translate-x-1/2 font-display text-[56px] font-extrabold text-white"
        style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}
      >
        {jerseyNumber}
      </p>
    </div>
  )
}
