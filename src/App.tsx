import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CharacterCreationPage } from '@/features/characterCreation/CharacterCreationPage'
import { CareerHubPage } from '@/features/careerHub/CareerHubPage'
import { SeasonEventPage } from '@/features/seasonEvent/SeasonEventPage'
import { MinigamePlayerPage } from '@/features/minigamePlayer/MinigamePlayerPage'
import { CareerSummaryPage } from '@/features/careerSummary/CareerSummaryPage'
import { LeaderboardPage } from '@/features/leaderboard/LeaderboardPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharacterCreationPage />} />
        <Route path="/hub" element={<CareerHubPage />} />
        <Route path="/event" element={<SeasonEventPage />} />
        <Route path="/minigame" element={<MinigamePlayerPage />} />
        <Route path="/summary" element={<CareerSummaryPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
