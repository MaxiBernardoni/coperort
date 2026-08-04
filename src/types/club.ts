export interface Club {
  id: string
  name: string
  country: string
  /** 1 = primera división, 2 = segunda división */
  tier: 1 | 2
  /** 1-100, usado para ofertas de transferencia y valor de mercado */
  reputation: number
}
