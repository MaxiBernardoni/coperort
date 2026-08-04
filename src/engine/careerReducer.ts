import { createCareer } from './createCareer'
import { selectEvent } from './eventSelector'
import { createRng } from './rng'
import { simulateSeasonPerformance } from './seasonPerformance'
import { ATTRIBUTE_KEYS, attributeGrowthDelta, clamp, deriveOverallRating, marketValueForRating } from './statMath'
import type { PlayerAttributes } from '@/types/player'
import type { CareerAction, CareerPhase, CareerState } from '@/types/career'
import type { EventChoice, StatEffect } from '@/types/event'

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

function advanceSeason(state: CareerState): CareerState {
  const rng = createRng(state.rngState)

  const event = selectEvent(state, rng)
  const choice: EventChoice = rng.pick(event.choices)
  const newAge = state.player.age + 1

  let attributes = applyAttributeEffects(state.player.attributes, choice.effects)
  for (const key of ATTRIBUTE_KEYS) {
    attributes[key] = clamp(attributes[key] + attributeGrowthDelta(newAge, rng), 1, 99)
  }

  const overallRating = deriveOverallRating(attributes, state.player.identity.position)
  const baselineMarketValue = marketValueForRating(overallRating, newAge)
  const marketValue = Math.round(baselineMarketValue * marketValueMultiplierFromEffects(choice.effects))

  const performance = simulateSeasonPerformance(
    { ...state.player, attributes, age: newAge, overallRating, marketValue },
    rng,
  )

  const phase: CareerPhase = newAge >= state.retirementAge ? 'RETIRED' : 'ACTIVE'

  return {
    ...state,
    rngState: rng.getState(),
    player: { ...state.player, attributes, age: newAge, overallRating, marketValue },
    season: state.season + 1,
    year: state.year + 1,
    phase,
    stats: {
      matches: state.stats.matches + performance.matches,
      goals: state.stats.goals + performance.goals,
      assists: state.stats.assists + performance.assists,
      peakRating: Math.max(state.stats.peakRating, overallRating),
      peakMarketValue: Math.max(state.stats.peakMarketValue, marketValue),
    },
    eventLog: [...state.eventLog, { season: state.season, eventId: event.id, choiceId: choice.id }],
  }
}

export function careerReducer(state: CareerState | null, action: CareerAction): CareerState {
  switch (action.type) {
    case 'CREATE_CAREER':
      return createCareer(action.input, action.seed)
    case 'ADVANCE_SEASON':
      if (!state) throw new Error('No hay una carrera en curso: despachá CREATE_CAREER primero')
      if (state.phase === 'RETIRED') return state
      return advanceSeason(state)
  }
}
