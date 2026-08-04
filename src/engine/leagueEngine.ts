import type { Rng } from './rng'
import type { Club } from '@/types/club'

/**
 * Resuelve automáticamente el campeón de la liga (mismo país + misma división) a la que
 * pertenece `group`, ponderado por reputación. El club del jugador siempre queda incluido
 * en su propio grupo por construcción (se filtra sobre `clubs`, que lo contiene). Un grupo
 * de un solo club no es caso especial: `pickWeighted` igual lo devuelve.
 */
export function resolveLeagueWinner(clubs: Club[], group: { country: string; tier: 1 | 2 }, rng: Rng): Club {
  const league = clubs.filter((club) => club.country === group.country && club.tier === group.tier)
  return rng.pickWeighted(league, (club) => club.reputation)
}
