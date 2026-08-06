import { Navigate, useNavigate } from 'react-router-dom'
import { getClubById } from '@/content/clubs'
import { useCareerEngine } from '@/hooks/useCareerEngine'
import { useCareerStore } from '@/store/careerStore'
import { pickMinigame } from '@/minigames/registry'
import type { MinigameResult } from '@/types/minigame'

export function MinigamePlayerPage() {
  const navigate = useNavigate()
  const { career, resolveMinigame } = useCareerEngine()

  if (!career) return <Navigate to="/" replace />
  if (career.phase !== 'MINIGAME_PENDING' || !career.pendingMinigame) return <Navigate to="/hub" replace />

  const { seed, difficulty, opponentClubId } = career.pendingMinigame
  const minigame = pickMinigame(seed)
  const { Component } = minigame

  function handleComplete(result: MinigameResult) {
    resolveMinigame(result)
    const updated = useCareerStore.getState().career
    navigate(updated?.phase === 'RETIRED' ? '/summary' : '/hub')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <Component
        key={seed}
        seed={seed}
        difficulty={difficulty}
        opponentName={getClubById(opponentClubId).name}
        attributes={career.player.attributes}
        onComplete={handleComplete}
      />
    </main>
  )
}
