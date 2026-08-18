import { supabase } from '@/lib/supabaseClient'
import type { Position } from '@/types/player'

export interface LeaderboardEntry {
  id: string
  alias: string
  firstName: string
  surname: string
  nationality: string
  position: Position
  clubName: string
  retireAge: number
  matches: number
  goals: number
  assists: number
  peakRating: number
  peakMarketValue: number
  leagueTitles: number
  cupTitles: number
}

export type NewLeaderboardEntry = Omit<LeaderboardEntry, 'id'>

function toRow(entry: NewLeaderboardEntry) {
  return {
    alias: entry.alias,
    first_name: entry.firstName,
    surname: entry.surname,
    nationality: entry.nationality,
    position: entry.position,
    club_name: entry.clubName,
    retire_age: entry.retireAge,
    matches: entry.matches,
    goals: entry.goals,
    assists: entry.assists,
    peak_rating: entry.peakRating,
    peak_market_value: entry.peakMarketValue,
    league_titles: entry.leagueTitles,
    cup_titles: entry.cupTitles,
  }
}

function fromRow(row: ReturnType<typeof toRow> & { id: string }): LeaderboardEntry {
  return {
    id: row.id,
    alias: row.alias,
    firstName: row.first_name,
    surname: row.surname,
    nationality: row.nationality,
    position: row.position as Position,
    clubName: row.club_name,
    retireAge: row.retire_age,
    matches: row.matches,
    goals: row.goals,
    assists: row.assists,
    peakRating: row.peak_rating,
    peakMarketValue: row.peak_market_value,
    leagueTitles: row.league_titles,
    cupTitles: row.cup_titles,
  }
}

/** Sube un puntaje al ranking. Sin anti-cheat (decisión de producto): se guarda tal cual lo manda el cliente. */
export async function submitScore(entry: NewLeaderboardEntry): Promise<void> {
  const { error } = await supabase.from('leaderboard_entries').insert(toRow(entry))
  if (error) throw error
}

export async function fetchTopEntries(limit = 50): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .order('peak_rating', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map(fromRow)
}
