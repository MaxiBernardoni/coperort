/**
 * Resultado de un minijuego, tal como lo consume el motor. Es un tipo de dominio puro
 * (sin React) a propósito: vive acá y no en `minigames/`, para que `engine/` pueda
 * importarlo sin romper la regla de que el motor no depende de la capa de UI.
 */
export interface MinigameResult {
  won: boolean
  score: number
  maxScore: number
}

/**
 * Contexto que el motor entrega para jugar una instancia de minijuego. Es deliberadamente
 * agnóstico de *qué* minijuego se juega — esa decisión es de la capa de UI (ver
 * `minigames/registry.ts`), así que agregar un minijuego nuevo no obliga a tocar el motor.
 */
export interface PendingMinigame {
  /** semilla determinística para que el minijuego sea reproducible desde la carrera */
  seed: number
  /** 1-100, derivada de la reputación del rival de la final */
  difficulty: number
  /** club rival de la final de copa */
  opponentClubId: string
}
