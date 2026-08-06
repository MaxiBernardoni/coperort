import { z } from 'zod'
import type { Club } from '@/types/club'
import type { ClubMoveCriteria, EventChoice, InjuryEffect, LoanEffect, SeasonEvent, StatEffect } from '@/types/event'
import type { Motivation } from '@/types/motivation'
import type { PlayerAttributes, Position } from '@/types/player'

const attributeKeySchema: z.ZodType<keyof PlayerAttributes> = z.enum([
  'pace',
  'shooting',
  'passing',
  'dribbling',
  'defending',
  'physical',
  'goalkeeping',
])

const statEffectSchema: z.ZodType<StatEffect> = z.object({
  target: z.union([attributeKeySchema, z.literal('marketValue')]),
  op: z.enum(['add', 'multiply']),
  value: z.number(),
})

const clubMoveCriteriaSchema: z.ZodType<ClubMoveCriteria> = z.object({
  reputationMin: z.number().min(1).max(100).optional(),
  reputationMax: z.number().min(1).max(100).optional(),
  sameCountry: z.boolean().optional(),
  tier: z.union([z.literal(1), z.literal(2)]).optional(),
})

const loanEffectSchema: z.ZodType<LoanEffect> = z.object({
  reputationMin: z.number().min(1).max(100).optional(),
  reputationMax: z.number().min(1).max(100).optional(),
  sameCountry: z.boolean().optional(),
  tier: z.union([z.literal(1), z.literal(2)]).optional(),
  durationSeasons: z.number().int().positive().optional(),
})

const injuryEffectSchema: z.ZodType<InjuryEffect> = z.object({
  matchesReductionPct: z.number().min(0).max(1),
})

const eventChoiceSchema: z.ZodType<EventChoice> = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  effects: z.array(statEffectSchema),
  transfer: clubMoveCriteriaSchema.optional(),
  loan: loanEffectSchema.optional(),
  injury: injuryEffectSchema.optional(),
})

const seasonEventSchema: z.ZodType<SeasonEvent> = z
  .object({
    id: z.string().min(1),
    category: z.enum(['training', 'transfer', 'loan', 'injury', 'diet', 'scandal', 'media', 'personal']),
    minAge: z.number().int().positive().optional(),
    maxAge: z.number().int().positive().optional(),
    text: z.string().min(1),
    choices: z.array(eventChoiceSchema).min(1),
    weight: z.number().positive(),
  })
  .refine((event) => event.minAge === undefined || event.maxAge === undefined || event.minAge <= event.maxAge, {
    message: 'minAge no puede ser mayor que maxAge',
    path: ['minAge'],
  })
  .refine((event) => new Set(event.choices.map((choice) => choice.id)).size === event.choices.length, {
    message: 'los ids de choices deben ser únicos dentro del evento',
    path: ['choices'],
  })

const positionSchema: z.ZodType<Position> = z.enum(['GK', 'DEF', 'MID', 'FWD'])

const motivationSchema: z.ZodType<Motivation> = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    effects: z.array(statEffectSchema).min(1),
    minAge: z.number().int().positive().optional(),
    maxAge: z.number().int().positive().optional(),
    positions: z.array(positionSchema).min(1).optional(),
  })
  .refine(
    (motivation) => motivation.minAge === undefined || motivation.maxAge === undefined || motivation.minAge <= motivation.maxAge,
    { message: 'minAge no puede ser mayor que maxAge', path: ['minAge'] },
  )

const clubSchema: z.ZodType<Club> = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  country: z.string().min(1),
  tier: z.union([z.literal(1), z.literal(2)]),
  reputation: z.number().min(1).max(100),
})

function uniqueIdsRefinement<T extends { id: string }>(items: T[], ctx: z.RefinementCtx): void {
  const seen = new Set<string>()
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `id duplicado: "${item.id}"`, path: [index, 'id'] })
    }
    seen.add(item.id)
  })
}

export const seasonEventsSchema = z.array(seasonEventSchema).superRefine(uniqueIdsRefinement)
export const clubsSchema = z.array(clubSchema).superRefine(uniqueIdsRefinement)
export const motivationsSchema = z.array(motivationSchema).superRefine(uniqueIdsRefinement)

export function parseSeasonEvents(events: unknown): SeasonEvent[] {
  return seasonEventsSchema.parse(events)
}

export function parseClubs(clubs: unknown): Club[] {
  return clubsSchema.parse(clubs)
}

export function parseMotivations(motivations: unknown): Motivation[] {
  return motivationsSchema.parse(motivations)
}
