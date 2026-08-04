import type { Club } from '@/types/club'

/**
 * Set mínimo de clubes para poder correr y testear el motor. Se reemplaza en
 * la Fase 3 por `content/clubs.json`, generado a partir de las listas de
 * Wikipedia por confederación (ver CLAUDE.md).
 */
export const SAMPLE_CLUBS: Club[] = [
  { id: 'ca-tigre', name: 'Club Atlético Tigre', country: 'Argentina', tier: 2, reputation: 30 },
  { id: 'cd-riestra', name: 'Deportivo Riestra', country: 'Argentina', tier: 1, reputation: 35 },
  { id: 'ca-independiente', name: 'Independiente', country: 'Argentina', tier: 1, reputation: 55 },
  { id: 'racing-club', name: 'Racing Club', country: 'Argentina', tier: 1, reputation: 58 },
  { id: 'river-plate', name: 'River Plate', country: 'Argentina', tier: 1, reputation: 75 },
  { id: 'boca-juniors', name: 'Boca Juniors', country: 'Argentina', tier: 1, reputation: 78 },
  { id: 'gremio', name: 'Grêmio', country: 'Brasil', tier: 1, reputation: 65 },
  { id: 'sao-paulo', name: 'São Paulo FC', country: 'Brasil', tier: 1, reputation: 68 },
  { id: 'sevilla', name: 'Sevilla FC', country: 'España', tier: 1, reputation: 72 },
  { id: 'atletico-madrid', name: 'Atlético de Madrid', country: 'España', tier: 1, reputation: 85 },
  { id: 'real-madrid', name: 'Real Madrid', country: 'España', tier: 1, reputation: 97 },
  { id: 'barcelona', name: 'FC Barcelona', country: 'España', tier: 1, reputation: 96 },
  { id: 'manchester-city', name: 'Manchester City', country: 'Inglaterra', tier: 1, reputation: 95 },
]

export function getClubById(id: string): Club {
  const club = SAMPLE_CLUBS.find((candidate) => candidate.id === id)
  if (!club) throw new Error(`Club desconocido: ${id}`)
  return club
}
