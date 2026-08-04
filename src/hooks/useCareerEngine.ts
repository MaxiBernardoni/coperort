import { useCareerStore } from '@/store/careerStore'
import type { CharacterCreationInput } from '@/types/career'

export function useCareerEngine() {
  const career = useCareerStore((store) => store.career)
  const dispatch = useCareerStore((store) => store.dispatch)

  return {
    career,
    createCareer: (input: CharacterCreationInput, seed?: number) => dispatch({ type: 'CREATE_CAREER', input, seed }),
    advanceSeason: () => dispatch({ type: 'ADVANCE_SEASON' }),
    resolveEvent: (choiceId: string) => dispatch({ type: 'RESOLVE_EVENT', choiceId }),
  }
}
