import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { FOOT_LABELS, POSITION_LABELS } from '@/lib/labels'
import type { Foot, Position } from '@/types/player'

const POSITIONS = Object.keys(POSITION_LABELS) as Position[]
const FEET = Object.keys(FOOT_LABELS) as Foot[]

const inputClass =
  'rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white'

export function CharacterCreationPage() {
  const navigate = useNavigate()
  const { createCareer } = useCareerEngine()

  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [nationality, setNationality] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState(10)
  const [dominantFoot, setDominantFoot] = useState<Foot>('right')
  const [position, setPosition] = useState<Position>('FWD')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!firstName.trim() || !surname.trim() || !nationality.trim()) {
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
      nationality: nationality.trim(),
      jerseyNumber,
      dominantFoot,
      position,
    })
    navigate('/hub')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-center text-3xl font-semibold">Creación de jugador</h1>
        <p className="mb-6 text-center text-neutral-500">Vas a debutar a los 17 años. Elegí bien.</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
        >
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Nombre
              <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={30} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Apellido
              <input className={inputClass} value={surname} onChange={(e) => setSurname(e.target.value)} maxLength={30} />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            Nacionalidad
            <input className={inputClass} value={nationality} onChange={(e) => setNationality(e.target.value)} maxLength={40} />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Posición
              <select className={inputClass} value={position} onChange={(e) => setPosition(e.target.value as Position)}>
                {POSITIONS.map((value) => (
                  <option key={value} value={value}>
                    {POSITION_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Pierna hábil
              <select className={inputClass} value={dominantFoot} onChange={(e) => setDominantFoot(e.target.value as Foot)}>
                {FEET.map((value) => (
                  <option key={value} value={value}>
                    {FOOT_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            Número de camiseta
            <input
              type="number"
              min={1}
              max={99}
              className={inputClass}
              value={jerseyNumber}
              onChange={(e) => setJerseyNumber(Number(e.target.value))}
            />
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="mt-2 rounded-md bg-neutral-900 px-4 py-2 font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Empezar carrera
          </button>
        </form>
      </div>
    </main>
  )
}
