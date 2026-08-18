import { create } from 'zustand'
import { careerReducer } from '@/engine/careerReducer'
import { saveCareer } from '@/lib/api/careers'
import { setStoredCareerId } from '@/lib/careerSession'
import type { CareerAction, CareerState } from '@/types/career'

interface CareerStore {
  career: CareerState | null
  dispatch: (action: CareerAction) => void
  /** Carga una carrera ya persistida sin pasar por el reducer (no es el resultado de una acción). */
  hydrate: (state: CareerState) => void
}

// Cola de guardado: cada saveCareer espera a que termine el anterior antes de salir.
// Sin esto, dispatches seguidos (ej. avanzar varias temporadas rápido) pueden mandar
// requests que la red responde fuera de orden, y el último en llegar "gana" aunque
// no sea el estado más reciente — se pierde la carrera post-esa-escritura silenciosamente.
let saveQueue: Promise<void> = Promise.resolve()

export const useCareerStore = create<CareerStore>((set, get) => ({
  career: null,
  dispatch: (action) => {
    const previous = get().career
    const next = careerReducer(previous, action)
    set({ career: next })

    // No-op (ej. ADVANCE_SEASON repetido) devuelve la misma referencia: no hace falta re-guardar.
    if (next !== previous) {
      if (action.type === 'CREATE_CAREER') setStoredCareerId(next.id)
      // Fire-and-forget hacia afuera (no bloquea el dispatch): si falla, se pierde
      // persistencia esa vez, no el juego. Pero internamente encolado en orden.
      saveQueue = saveQueue
        .then(() => saveCareer(next))
        .catch((error) => console.error('No se pudo guardar la carrera', error))
    }
  },
  hydrate: (state) => set({ career: state }),
}))
