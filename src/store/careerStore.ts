import { create } from 'zustand'
import { careerReducer } from '@/engine/careerReducer'
import type { CareerAction, CareerState } from '@/types/career'

interface CareerStore {
  career: CareerState | null
  dispatch: (action: CareerAction) => void
}

export const useCareerStore = create<CareerStore>((set) => ({
  career: null,
  dispatch: (action) => set((store) => ({ career: careerReducer(store.career, action) })),
}))
