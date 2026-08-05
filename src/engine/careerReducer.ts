import { applyLoanReturn, applyLoanStart, applyTransfer, selectClubForMove } from './clubTransition'
import { createCareer } from './createCareer'
import { selectEvent } from './eventSelector'
import { resolveLeagueWinner } from './leagueEngine'
import { createRng } from './rng'
import { simulateSeasonPerformance } from './seasonPerformance'
import { ATTRIBUTE_KEYS, attributeGrowthDelta, clamp, deriveOverallRating, marketValueForRating } from './statMath'
import { SAMPLE_CLUBS } from '@/content/clubs'
import { getEventById } from '@/content/events'
import type { Rng } from './rng'
import type { PlayerAttributes } from '@/types/player'
import type { CareerAction, CareerPhase, CareerState, SeasonHistoryEntry, Title } from '@/types/career'
import type { EventChoice, StatEffect } from '@/types/event'

function applyClubTransition(
  state: CareerState,
  choice: EventChoice,
  newYear: number,
  rng: Rng,
): Pick<CareerState, 'currentClub' | 'clubHistory' | 'loan'> {
  // no-null: solo se llama desde resolveEvent, alcanzable únicamente después de SELECT_CLUB
  const currentClub = state.currentClub!
  const unchanged = { currentClub, clubHistory: state.clubHistory, loan: state.loan }

  if (state.loan && newYear >= state.loan.returnYear) {
    return applyLoanReturn(state, newYear)
  }
  if (choice.transfer) {
    const club = selectClubForMove(currentClub, SAMPLE_CLUBS, choice.transfer, rng, (c) => c.reputation)
    return club ? applyTransfer(state, club, newYear) : unchanged
  }
  if (choice.loan) {
    const club = selectClubForMove(currentClub, SAMPLE_CLUBS, choice.loan, rng, (c) => 100 - c.reputation)
    return club ? applyLoanStart(state, club, newYear, choice.loan.durationSeasons ?? 1) : unchanged
  }
  return unchanged
}

function applyAttributeEffects(attributes: PlayerAttributes, effects: StatEffect[]): PlayerAttributes {
  const next = { ...attributes }
  for (const effect of effects) {
    if (effect.target === 'marketValue') continue
    const key = effect.target
    const raw = effect.op === 'add' ? next[key] + effect.value : next[key] * effect.value
    next[key] = clamp(raw, 1, 99)
  }
  return next
}

function marketValueMultiplierFromEffects(effects: StatEffect[]): number {
  return effects
    .filter((effect) => effect.target === 'marketValue' && effect.op === 'multiply')
    .reduce((multiplier, effect) => multiplier * effect.value, 1)
}

/** Elige el evento de la temporada y lo deja pendiente de que la UI resuelva una elección. */
function beginSeason(state: CareerState): CareerState {
  const rng = createRng(state.rngState)
  const event = selectEvent(state, rng)

  return {
    ...state,
    rngState: rng.getState(),
    phase: 'EVENT_PENDING',
    pendingEventId: event.id,
  }
}

/** Aplica la elección del usuario para el evento pendiente y cierra la temporada. */
function resolveEvent(state: CareerState, choiceId: string): CareerState {
  if (!state.pendingEventId) throw new Error('No hay ningún evento pendiente para resolver')
  const event = getEventById(state.pendingEventId)
  const choice = event.choices.find((candidate) => candidate.id === choiceId)
  if (!choice) throw new Error(`Elección desconocida "${choiceId}" para el evento "${event.id}"`)

  const rng = createRng(state.rngState)
  const newAge = state.player.age + 1
  const newYear = state.year + 1

  let attributes = applyAttributeEffects(state.player.attributes, choice.effects)
  for (const key of ATTRIBUTE_KEYS) {
    attributes[key] = clamp(attributes[key] + attributeGrowthDelta(newAge, rng), 1, 99)
  }

  const overallRating = deriveOverallRating(attributes, state.player.identity.position)
  const baselineMarketValue = marketValueForRating(overallRating, newAge)
  const marketValue = Math.round(baselineMarketValue * marketValueMultiplierFromEffects(choice.effects))

  const clubTransition = applyClubTransition(state, choice, newYear, rng)
  // no-null: applyClubTransition siempre devuelve un club (invariante de fase ACTIVE)
  const currentClub = clubTransition.currentClub!

  const performance = simulateSeasonPerformance(
    { ...state.player, attributes, age: newAge, overallRating, marketValue },
    rng,
    { matchesMultiplier: choice.injury ? 1 - choice.injury.matchesReductionPct : undefined },
  )

  const leagueWinner = resolveLeagueWinner(SAMPLE_CLUBS, { country: currentClub.country, tier: currentClub.tier }, rng)
  const wonLeague = leagueWinner.id === currentClub.id
  const titles: Title[] = wonLeague
    ? [
        ...state.titles,
        {
          type: 'league',
          season: state.season,
          year: newYear,
          clubId: currentClub.id,
          country: currentClub.country,
          tier: currentClub.tier,
        },
      ]
    : state.titles

  const seasonHistoryEntry: SeasonHistoryEntry = {
    season: state.season,
    year: newYear,
    age: newAge,
    clubId: currentClub.id,
    overallRating,
    matches: performance.matches,
    goals: performance.goals,
    assists: performance.assists,
  }

  const phase: CareerPhase = newAge >= state.retirementAge ? 'RETIRED' : 'ACTIVE'

  return {
    ...state,
    ...clubTransition,
    rngState: rng.getState(),
    player: { ...state.player, attributes, age: newAge, overallRating, marketValue },
    season: state.season + 1,
    year: newYear,
    phase,
    pendingEventId: null,
    stats: {
      matches: state.stats.matches + performance.matches,
      goals: state.stats.goals + performance.goals,
      assists: state.stats.assists + performance.assists,
      peakRating: Math.max(state.stats.peakRating, overallRating),
      peakMarketValue: Math.max(state.stats.peakMarketValue, marketValue),
    },
    titles,
    eventLog: [...state.eventLog, { season: state.season, eventId: event.id, choiceId: choice.id }],
    seasonHistory: [...state.seasonHistory, seasonHistoryEntry],
  }
}

function selectClub(state: CareerState, clubId: string): CareerState {
  if (state.phase !== 'CLUB_PENDING') throw new Error('No hay ninguna oferta de club pendiente')
  const club = state.clubOffers.find((candidate) => candidate.id === clubId)
  if (!club) throw new Error(`Oferta de club desconocida "${clubId}"`)

  return {
    ...state,
    currentClub: club,
    clubHistory: [{ clubId: club.id, fromYear: state.year, toYear: null }],
    clubOffers: [],
    phase: 'ACTIVE',
  }
}

export function careerReducer(state: CareerState | null, action: CareerAction): CareerState {
  switch (action.type) {
    case 'CREATE_CAREER':
      return createCareer(action.input, action.seed)
    case 'SELECT_CLUB':
      if (!state) throw new Error('No hay una carrera en curso: despachá CREATE_CAREER primero')
      return selectClub(state, action.clubId)
    case 'ADVANCE_SEASON':
      if (!state) throw new Error('No hay una carrera en curso: despachá CREATE_CAREER primero')
      if (state.phase !== 'ACTIVE') return state
      return beginSeason(state)
    case 'RESOLVE_EVENT':
      if (!state) throw new Error('No hay una carrera en curso: despachá CREATE_CAREER primero')
      if (state.phase !== 'EVENT_PENDING') throw new Error('No hay ningún evento pendiente para resolver')
      return resolveEvent(state, action.choiceId)
  }
}
