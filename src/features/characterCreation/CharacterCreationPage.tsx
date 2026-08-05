import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JerseyPreview } from './components/JerseyPreview'
import { PositionPitch } from './components/PositionPitch'
import { CountryPicker } from '@/components/ui/CountryPicker'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { COUNTRIES } from '@/content/countries'
import { TACTICAL_POSITIONS } from '@/content/tacticalPositions'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { FOOT_LABELS, POSITION_LABELS } from '@/lib/labels'
import type { Foot } from '@/types/player'

const FEET: { value: Foot; label: string }[] = [
  { value: 'left', label: FOOT_LABELS.left },
  { value: 'right', label: FOOT_LABELS.right },
]

export function CharacterCreationPage() {
  const navigate = useNavigate()
  const { createCareer } = useCareerEngine()

  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [countryId, setCountryId] = useState('ar')
  const [countrySearch, setCountrySearch] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState(10)
  const [dominantFoot, setDominantFoot] = useState<Foot>('right')
  const [tacticalId, setTacticalId] = useState('DC')
  const [error, setError] = useState<string | null>(null)

  const country = COUNTRIES.find((candidate) => candidate.id === countryId)
  const tacticalPosition = TACTICAL_POSITIONS.find((position) => position.id === tacticalId) ?? TACTICAL_POSITIONS[0]

  function handleSubmit() {
    if (!firstName.trim() || !surname.trim() || !country) {
      setError('Completá nombre, apellido y nacionalidad.')
      return
    }
    if (!Number.isInteger(jerseyNumber) || jerseyNumber < 1 || jerseyNumber > 99) {
      setError('El número de camiseta tiene que ser un entero entre 1 y 99.')
      return
    }

    createCareer({
      firstName: firstName.trim(),
      surname: surname.trim(),
      nationality: country.name,
      jerseyNumber,
      dominantFoot,
      position: tacticalPosition.base,
    })
    navigate('/hub')
  }

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10">
      <h1 className="m-0 mb-1 text-center font-display text-[32px] font-bold text-text">Creación de jugador</h1>
      <p className="m-0 mb-8 text-center text-sm text-text-secondary">Vas a debutar a los 17 años. Elegí bien.</p>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.3fr_1fr]">
        <section className="flex flex-col items-center gap-5">
          <h2 className="m-0 text-[15px] font-semibold text-text">Identidad</h2>
          <JerseyPreview countryId={countryId} surname={surname || 'Apellido'} jerseyNumber={jerseyNumber} />

          <div className="flex w-full max-w-[280px] gap-3">
            <label className="flex-1 rounded-xl bg-surface-alt px-3.5 py-2.5">
              <span className="mb-1 block text-[10px] font-bold tracking-[1.2px] text-text-label">APELLIDO</span>
              <input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Apellido"
                maxLength={30}
                className="w-full border-none bg-transparent p-0 font-display text-xl font-bold text-text outline-none"
              />
            </label>
            <label className="flex-1 rounded-xl bg-surface-alt px-3.5 py-2.5">
              <span className="mb-1 block text-[10px] font-bold tracking-[1.2px] text-text-label">NÚMERO</span>
              <input
                type="number"
                min={1}
                max={99}
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(Number(e.target.value))}
                className="w-full border-none bg-transparent p-0 font-display text-xl font-bold text-text outline-none"
              />
            </label>
          </div>

          <div className="w-full max-w-[280px]">
            <p className="m-0 mb-1.5 text-[10px] font-bold tracking-[1.2px] text-text-label">PIERNA HÁBIL</p>
            <SegmentedControl options={FEET} value={dominantFoot} onChange={(v) => setDominantFoot(v as Foot)} />
          </div>

          <label className="flex w-full max-w-[280px] flex-col gap-1">
            <span className="text-[10px] font-bold tracking-[1.2px] text-text-label">NOMBRE</span>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombre"
              maxLength={30}
              className="rounded-[10px] border-none bg-surface-alt px-3 py-2.5 text-sm text-text outline-none"
            />
          </label>
        </section>

        <section className="flex flex-col gap-3.5">
          <h2 className="m-0 text-center text-[15px] font-semibold text-text">Nacionalidad</h2>
          <CountryPicker
            countries={COUNTRIES}
            search={countrySearch}
            onSearchChange={setCountrySearch}
            selectedId={countryId}
            onSelect={setCountryId}
          />
        </section>

        <section className="flex flex-col items-center gap-3.5">
          <h2 className="m-0 text-[15px] font-semibold text-text">Posición</h2>
          <PositionPitch selectedId={tacticalId} onSelect={setTacticalId} />
          <p className="m-0 text-center text-xs text-text-secondary">
            Posición base: <strong className="text-text">{POSITION_LABELS[tacticalPosition.base]}</strong>
          </p>
        </section>
      </div>

      {error && <p className="mt-4 text-center text-sm text-position">{error}</p>}

      <div className="mt-9 flex justify-center">
        <button
          type="button"
          onClick={handleSubmit}
          className="cursor-pointer rounded-card border-none bg-accent px-12 py-3.5 text-base font-bold text-[#141414] hover:bg-accent-hover"
        >
          Empezar carrera
        </button>
      </div>
    </main>
  )
}
