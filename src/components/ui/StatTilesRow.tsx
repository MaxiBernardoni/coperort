import { StatCircleIcon } from '@/components/icons/StatCircleIcon'
import { StatTile } from './StatTile'

interface StatTilesRowProps {
  matches: number
  goals: number
  assists: number
}

export function StatTilesRow({ matches, goals, assists }: StatTilesRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <StatTile icon={<StatCircleIcon color="#4caf6e" />} value={matches} label="PJ" />
      <StatTile icon={<StatCircleIcon color="#e8792a" />} value={goals} label="GLS" />
      <StatTile icon={<StatCircleIcon color="#c22b52" />} value={assists} label="AST" />
    </div>
  )
}
