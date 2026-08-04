import { getClubById } from '@/content/clubs'
import type { Rng } from './rng'
import type { Club } from '@/types/club'
import type { CareerState, ClubStint, LoanState } from '@/types/career'
import type { ClubMoveCriteria } from '@/types/event'

function closeCurrentStintAndOpen(clubHistory: ClubStint[], newClubId: string, year: number): ClubStint[] {
  const closed = clubHistory.map((stint, index) =>
    index === clubHistory.length - 1 && stint.toYear === null ? { ...stint, toYear: year } : stint,
  )
  return [...closed, { clubId: newClubId, fromYear: year, toYear: null }]
}

function matchesCriteria(club: Club, currentClub: Club, criteria: ClubMoveCriteria): boolean {
  if (criteria.reputationMin !== undefined && club.reputation < criteria.reputationMin) return false
  if (criteria.reputationMax !== undefined && club.reputation > criteria.reputationMax) return false
  if (criteria.sameCountry && club.country !== currentClub.country) return false
  if (criteria.tier !== undefined && club.tier !== criteria.tier) return false
  return true
}

/**
 * Elige un club destino para un transfer/préstamo, siempre excluyendo el club actual.
 * Si el criterio no tiene candidatos, relaja en dos pasos antes de rendirse: primero
 * ignora los límites de reputación, después ignora todo menos "que no sea el club actual".
 * Solo devuelve `null` si `allClubs` no tiene ningún otro club (no ocurre con el contenido actual).
 */
export function selectClubForMove(
  currentClub: Club,
  allClubs: Club[],
  criteria: ClubMoveCriteria,
  rng: Rng,
  weight: (club: Club) => number,
): Club | null {
  const others = allClubs.filter((club) => club.id !== currentClub.id)
  if (others.length === 0) return null

  const fullMatch = others.filter((club) => matchesCriteria(club, currentClub, criteria))
  if (fullMatch.length > 0) return rng.pickWeighted(fullMatch, weight)

  const withoutReputationBounds = others.filter((club) =>
    matchesCriteria(club, currentClub, { sameCountry: criteria.sameCountry, tier: criteria.tier }),
  )
  if (withoutReputationBounds.length > 0) return rng.pickWeighted(withoutReputationBounds, weight)

  return rng.pickWeighted(others, weight)
}

export function applyTransfer(
  state: CareerState,
  club: Club,
  year: number,
): Pick<CareerState, 'currentClub' | 'clubHistory' | 'loan'> {
  return {
    currentClub: club,
    clubHistory: closeCurrentStintAndOpen(state.clubHistory, club.id, year),
    loan: null,
  }
}

export function applyLoanStart(
  state: CareerState,
  club: Club,
  year: number,
  durationSeasons: number,
): Pick<CareerState, 'currentClub' | 'clubHistory' | 'loan'> {
  const loan: LoanState = { parentClubId: state.currentClub.id, returnYear: year + durationSeasons }
  return {
    currentClub: club,
    clubHistory: closeCurrentStintAndOpen(state.clubHistory, club.id, year),
    loan,
  }
}

export function applyLoanReturn(state: CareerState, year: number): Pick<CareerState, 'currentClub' | 'clubHistory' | 'loan'> {
  if (!state.loan) throw new Error('applyLoanReturn llamado sin un préstamo activo')
  const parentClub = getClubById(state.loan.parentClubId)
  return {
    currentClub: parentClub,
    clubHistory: closeCurrentStintAndOpen(state.clubHistory, parentClub.id, year),
    loan: null,
  }
}
