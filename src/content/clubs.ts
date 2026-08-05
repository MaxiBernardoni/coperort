import clubsData from './clubs.json'
import { parseClubs } from './contentSchema'
import type { Club } from '@/types/club'

/**
 * Clubes reales de las 10 confederaciones CONMEBOL (primera división completa,
 * segunda división donde la fuente de Wikipedia la documentaba limpiamente:
 * Argentina, Brasil, Chile, Uruguay) más los 5 clubes europeos originales
 * (Fase 1), sin tocar — Europa/resto de confederaciones quedan para una
 * pasada futura (Fase 3b es explícitamente incremental, ver CLAUDE.md).
 *
 * `reputation` no es un dato real-world investigado (no existe una fuente
 * pública de "puntaje de reputación" de un club) — es una heurística de
 * balance de juego: baseline por tier + boost manual para clubes de
 * reconocimiento regional/internacional alto, mismo criterio que ya se usaba
 * en el set de 13 clubes original. `parseClubs` valida la forma de los datos
 * (incluye unicidad de ids) apenas se importa este módulo.
 */
export const SAMPLE_CLUBS: Club[] = parseClubs(clubsData)

export function getClubById(id: string): Club {
  const club = SAMPLE_CLUBS.find((candidate) => candidate.id === id)
  if (!club) throw new Error(`Club desconocido: ${id}`)
  return club
}
