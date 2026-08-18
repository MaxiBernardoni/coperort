import { supabase } from '@/lib/supabaseClient'
import type { CareerState } from '@/types/career'

/** Guarda (upsert) el estado completo de la carrera. Fire-and-forget desde el store: si falla, se pierde persistencia esa vez, no rompe el juego. */
export async function saveCareer(state: CareerState): Promise<void> {
  const { error } = await supabase.from('careers').upsert({ id: state.id, state, updated_at: new Date().toISOString() })
  if (error) throw error
}

/** Devuelve el estado guardado, o `null` si no existe (id inválido, fila borrada, etc). */
export async function loadCareer(id: string): Promise<CareerState | null> {
  const { data, error } = await supabase.from('careers').select('state').eq('id', id).maybeSingle()
  if (error) throw error
  return (data?.state as CareerState | undefined) ?? null
}

export async function deleteCareer(id: string): Promise<void> {
  const { error } = await supabase.from('careers').delete().eq('id', id)
  if (error) throw error
}
