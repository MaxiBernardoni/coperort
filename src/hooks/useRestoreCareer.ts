import { useEffect, useState } from 'react'
import { loadCareer } from '@/lib/api/careers'
import { clearStoredCareerId, getStoredCareerId } from '@/lib/careerSession'
import { useCareerStore } from '@/store/careerStore'

/** Al abrir la app, si hay una carrera guardada (id en localStorage) la restaura antes de rutear. */
export function useRestoreCareer(): boolean {
  const [restoring, setRestoring] = useState(true)
  const hydrate = useCareerStore((store) => store.hydrate)

  useEffect(() => {
    const id = getStoredCareerId()
    if (!id) {
      setRestoring(false)
      return
    }

    loadCareer(id)
      .then((state) => {
        if (state) hydrate(state)
        else clearStoredCareerId()
      })
      .catch((error) => console.error('No se pudo restaurar la carrera', error))
      .finally(() => setRestoring(false))
  }, [hydrate])

  return restoring
}
