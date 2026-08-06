import { describe, expect, it } from 'vitest'
import { selectMotivationOffers } from '../motivationSelector'
import { createRng } from '../rng'
import { MOTIVATIONS } from '@/content/motivations'

describe('selectMotivationOffers', () => {
  it('ofrece 3 enfoques distintos, todos del catálogo', () => {
    const offers = selectMotivationOffers(24, 'FWD', createRng(1))

    expect(offers).toHaveLength(3)
    expect(new Set(offers.map((motivation) => motivation.id)).size).toBe(3)
    for (const offer of offers) expect(MOTIVATIONS).toContain(offer)
  })

  it('respeta minAge/maxAge del contenido', () => {
    const rng = createRng(2)
    for (let i = 0; i < 40; i++) {
      for (const offer of selectMotivationOffers(19, 'FWD', rng)) {
        if (offer.minAge !== undefined) expect(19).toBeGreaterThanOrEqual(offer.minAge)
        if (offer.maxAge !== undefined) expect(19).toBeLessThanOrEqual(offer.maxAge)
      }
    }
  })

  it('no ofrece enfoques de otra posición', () => {
    const rng = createRng(3)
    for (let i = 0; i < 40; i++) {
      for (const offer of selectMotivationOffers(25, 'FWD', rng)) {
        if (offer.positions) expect(offer.positions).toContain('FWD')
      }
    }
  })

  it('la oferta cambia con la edad: un pibe y un veterano no ven lo mismo', () => {
    const young = new Set<string>()
    const veteran = new Set<string>()
    const rngYoung = createRng(4)
    const rngVeteran = createRng(4)

    for (let i = 0; i < 30; i++) {
      selectMotivationOffers(19, 'MID', rngYoung).forEach((offer) => young.add(offer.id))
      selectMotivationOffers(33, 'MID', rngVeteran).forEach((offer) => veteran.add(offer.id))
    }

    expect(young.has('youth-hunger')).toBe(true)
    expect(young.has('veteran-craft')).toBe(false)
    expect(veteran.has('veteran-craft')).toBe(true)
    expect(veteran.has('youth-hunger')).toBe(false)
  })

  it('es determinístico: la misma seed produce la misma oferta', () => {
    const first = selectMotivationOffers(24, 'DEF', createRng(99)).map((offer) => offer.id)
    const second = selectMotivationOffers(24, 'DEF', createRng(99)).map((offer) => offer.id)
    expect(first).toEqual(second)
  })

  it('siempre devuelve la cantidad pedida aunque el filtro deje pocos candidatos', () => {
    // un arquero de 17 filtra casi todo (los enfoques por edad y los de otras posiciones)
    const offers = selectMotivationOffers(17, 'GK', createRng(5))
    expect(offers).toHaveLength(3)
    expect(new Set(offers.map((offer) => offer.id)).size).toBe(3)
  })
})
