interface SegmentedControlOption {
  value: string
  label: string
}

interface SegmentedControlProps {
  options: SegmentedControlOption[]
  value: string
  onChange: (value: string) => void
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="flex rounded-full bg-surface-alt p-1">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-full px-0 py-2 text-[13px] font-bold transition ${
              selected ? 'bg-white text-black' : 'bg-transparent text-text-secondary-light'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
