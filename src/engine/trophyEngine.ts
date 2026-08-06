import { clamp } from './statMath'
import type { Rng } from './rng'
import type { Club } from '@/types/club'

/**
 * Piso y techo de probabilidad de llegar a la final de copa. Valores calibrados con el sanity
 * check de la Fase 4: con un techo de 0.45 una carrera en clubes grandes llegaba al 52% de las
 * temporadas (el minijuego dejaba de ser un premio y se volvía rutina), y con un piso de 0.10
 * había carreras enteras de 19 temporadas sin una sola final (el jugador nunca veía la feature).
 * Con 0.15-0.30: ~3-6 finales por carrera, y la chance de no jugar ninguna baja a ~4%.
 */
const MIN_FINAL_CHANCE = 0.15
const MAX_FINAL_CHANCE = 0.3

/**
 * Probabilidad de que un club llegue a la final de copa de su país, escalada por reputación:
 * un club grande llega seguido, uno chico casi nunca.
 */
export function cupFinalChance(club: Club): number {
  return clamp(MIN_FINAL_CHANCE + (club.reputation / 100) * (MAX_FINAL_CHANCE - MIN_FINAL_CHANCE), MIN_FINAL_CHANCE, MAX_FINAL_CHANCE)
}

/**
 * Decide si el club del jugador llegó a la final de copa de su país y, en ese caso, contra
 * quién. Devuelve el club rival, o `null` si no hubo final (no clasificó, o el país no tiene
 * ningún otro club con quien jugarla).
 *
 * Hermano de `leagueEngine.ts#resolveLeagueWinner`: misma forma (función pura, `rng`
 * inyectado, ponderación por reputación), pero acá el resultado no es automático — el título
 * se define jugando el minijuego, ver `careerReducer.ts`.
 *
 * A diferencia de la liga, la copa cruza divisiones: el rival puede ser de cualquier tier del
 * mismo país (un equipo de segunda puede llegar a la final, que es justamente parte de la
 * gracia de una copa nacional).
 */
export function resolveCupFinal(clubs: Club[], playerClub: Club, rng: Rng): Club | null {
  if (rng.next() >= cupFinalChance(playerClub)) return null

  const opponents = clubs.filter((club) => club.country === playerClub.country && club.id !== playerClub.id)
  if (opponents.length === 0) return null

  return rng.pickWeighted(opponents, (club) => club.reputation)
}
