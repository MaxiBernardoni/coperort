import { useCareerStore } from '@/store/careerStore'
import type { CharacterCreationInput } from '@/types/career'
import type { MinigameResult } from '@/types/minigame'

export function useCareerEngine() {
  const career = useCareerStore((store) => store.career)
  const dispatch = useCareerStore((store) => store.dispatch)

  return {
    career,
    createCareer: (input: CharacterCreationInput, seed?: number) => dispatch({ type: 'CREATE_CAREER', input, seed }),
    selectClub: (clubId: string) => dispatch({ type: 'SELECT_CLUB', clubId }),
    advanceSeason: () => dispatch({ type: 'ADVANCE_SEASON' }),
    resolveEvent: (choiceId: string) => dispatch({ type: 'RESOLVE_EVENT', choiceId }),
    resolveMinigame: (result: MinigameResult) => dispatch({ type: 'RESOLVE_MINIGAME', result }),
  }
}
