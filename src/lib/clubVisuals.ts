/** Iniciales para el escudo placeholder de un club (ej. "Racing Club" -> "RC"). */
export function clubInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean)
  const initials = words.map((word) => word[0]).join('').toUpperCase()
  return (initials || name).slice(0, 3)
}
