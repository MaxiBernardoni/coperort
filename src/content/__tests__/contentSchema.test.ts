import { describe, expect, it } from 'vitest'
import { clubsSchema, motivationsSchema, seasonEventsSchema } from '../contentSchema'
import { SAMPLE_CLUBS } from '../clubs'
import { SAMPLE_EVENTS } from '../events'
import { MOTIVATIONS } from '../motivations'

describe('contentSchema', () => {
  it('SAMPLE_EVENTS es válido contra seasonEventsSchema', () => {
    expect(() => seasonEventsSchema.parse(SAMPLE_EVENTS)).not.toThrow()
  })

  it('SAMPLE_CLUBS es válido contra clubsSchema', () => {
    expect(() => clubsSchema.parse(SAMPLE_CLUBS)).not.toThrow()
  })

  it('rechaza eventos con ids duplicados en el array', () => {
    const [first] = SAMPLE_EVENTS
    expect(() => seasonEventsSchema.parse([first, first])).toThrow()
  })

  it('rechaza clubes con ids duplicados en el array', () => {
    const [first] = SAMPLE_CLUBS
    expect(() => clubsSchema.parse([first, first])).toThrow()
  })

  it('rechaza un evento con minAge mayor que maxAge', () => {
    const invalid = { ...SAMPLE_EVENTS[0], minAge: 30, maxAge: 20 }
    expect(() => seasonEventsSchema.parse([invalid])).toThrow()
  })

  it('rechaza un evento con choices de ids duplicados', () => {
    const [first] = SAMPLE_EVENTS
    const invalid = { ...first, choices: [first.choices[0], first.choices[0]] }
    expect(() => seasonEventsSchema.parse([invalid])).toThrow()
  })

  it('rechaza un evento sin choices', () => {
    const invalid = { ...SAMPLE_EVENTS[0], choices: [] }
    expect(() => seasonEventsSchema.parse([invalid])).toThrow()
  })

  it('rechaza una category desconocida', () => {
    const invalid = { ...SAMPLE_EVENTS[0], category: 'not-a-real-category' }
    expect(() => seasonEventsSchema.parse([invalid])).toThrow()
  })

  it('rechaza un club con reputation fuera de [1,100]', () => {
    const invalid = { ...SAMPLE_CLUBS[0], reputation: 150 }
    expect(() => clubsSchema.parse([invalid])).toThrow()
  })

  it('rechaza un club con tier inválido', () => {
    const invalid = { ...SAMPLE_CLUBS[0], tier: 3 }
    expect(() => clubsSchema.parse([invalid])).toThrow()
  })

  it('MOTIVATIONS es válido contra motivationsSchema', () => {
    expect(() => motivationsSchema.parse(MOTIVATIONS)).not.toThrow()
  })

  it('rechaza motivaciones con ids duplicados', () => {
    const [first] = MOTIVATIONS
    expect(() => motivationsSchema.parse([first, first])).toThrow()
  })

  it('rechaza una motivación con minAge mayor que maxAge', () => {
    const invalid = { ...MOTIVATIONS[0], minAge: 32, maxAge: 20 }
    expect(() => motivationsSchema.parse([invalid])).toThrow()
  })

  it('rechaza una motivación sin efectos o con una posición inválida', () => {
    expect(() => motivationsSchema.parse([{ ...MOTIVATIONS[0], effects: [] }])).toThrow()
    expect(() => motivationsSchema.parse([{ ...MOTIVATIONS[0], positions: ['SW'] }])).toThrow()
  })
})
