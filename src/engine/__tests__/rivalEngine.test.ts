import { describe, expect, it } from 'vitest'
import { createRng } from '../rng'
import { advanceRival, createRival } from '../rivalEngine'
import { getRivalArchetypeById, RIVAL_ARCHETYPES } from '@/content/rivalArchetypes'
import { SAMPLE_CLUBS } from '@/content/clubs'

describe('rivalEngine', () => {
  it('createRival is deterministic for the same rng state', () => {
    const a = createRival('Argentina', SAMPLE_CLUBS, createRng(10))
    const b = createRival('Argentina', SAMPLE_CLUBS, createRng(10))
    expect(a).toEqual(b)
  })

  it('createRival produces different rivals for different seeds', () => {
    const a = createRival('Argentina', SAMPLE_CLUBS, createRng(1))
    const b = createRival('Argentina', SAMPLE_CLUBS, createRng(2))
    expect(a).not.toEqual(b)
  })

  it('createRival keeps the rating in [1,99] and assigns a valid archetype/club', () => {
    for (let seed = 0; seed < 20; seed++) {
      const rival = createRival('Brasil', SAMPLE_CLUBS, createRng(seed))
      expect(rival.overallRating).toBeGreaterThanOrEqual(1)
      expect(rival.overallRating).toBeLessThanOrEqual(99)
      expect(() => getRivalArchetypeById(rival.archetypeId)).not.toThrow()
      expect(SAMPLE_CLUBS.some((club) => club.id === rival.clubId)).toBe(true)
    }
  })

  it('advanceRival keeps the rating within [1,99] across many seasons', () => {
    let rival = createRival('Uruguay', SAMPLE_CLUBS, createRng(77))
    const rng = createRng(78)
    for (let age = 18; age <= 38; age++) {
      rival = advanceRival(rival, age, SAMPLE_CLUBS, rng)
      expect(rival.overallRating).toBeGreaterThanOrEqual(1)
      expect(rival.overallRating).toBeLessThanOrEqual(99)
    }
  })

  it('advanceRival accumulates stats and never decreases the title count', () => {
    let rival = createRival('Chile', SAMPLE_CLUBS, createRng(5))
    const rng = createRng(6)
    let previousMatches = rival.stats.matches
    let previousTitles = rival.titles

    for (let age = 18; age <= 30; age++) {
      rival = advanceRival(rival, age, SAMPLE_CLUBS, rng)
      expect(rival.stats.matches).toBeGreaterThan(previousMatches)
      expect(rival.titles).toBeGreaterThanOrEqual(previousTitles)
      previousMatches = rival.stats.matches
      previousTitles = rival.titles
    }
  })

  it('a youth-heavy archetype grows faster than a prime-heavy one at the same young age, same rng draws', () => {
    const prodigy = RIVAL_ARCHETYPES.find((a) => a.id === 'the-prodigy')!
    const lateBloomer = RIVAL_ARCHETYPES.find((a) => a.id === 'the-late-bloomer')!
    expect(prodigy.youthMultiplier).toBeGreaterThan(lateBloomer.youthMultiplier)

    const base = createRival('Paraguay', SAMPLE_CLUBS, createRng(9))
    const asProdigy = { ...base, archetypeId: prodigy.id, attributes: { ...base.attributes } }
    const asLateBloomer = { ...base, archetypeId: lateBloomer.id, attributes: { ...base.attributes } }

    const advancedProdigy = advanceRival(asProdigy, 19, SAMPLE_CLUBS, createRng(123))
    const advancedLateBloomer = advanceRival(asLateBloomer, 19, SAMPLE_CLUBS, createRng(123))

    expect(advancedProdigy.overallRating).toBeGreaterThanOrEqual(advancedLateBloomer.overallRating)
  })

  it('RIVAL_ARCHETYPES has unique ids', () => {
    const ids = RIVAL_ARCHETYPES.map((archetype) => archetype.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('getRivalArchetypeById throws for an unknown id', () => {
    expect(() => getRivalArchetypeById('not-a-real-archetype')).toThrow()
  })
})
