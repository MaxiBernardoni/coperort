const STORAGE_KEY = 'coperort:careerId'

/** El proyecto es explícitamente sin cuentas: este id opaco en localStorage es el único
 * "login" — identifica qué fila de `careers` es la tuya, no autentica nada. */
export function getStoredCareerId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredCareerId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // localStorage puede fallar (modo privado, cuota) — sin persistencia esa sesión, no rompe el juego.
  }
}

export function clearStoredCareerId(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ver arriba
  }
}
