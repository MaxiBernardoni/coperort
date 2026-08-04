# coperort — simulador de carrera de futbolista (mejorado)

> Este archivo es el punto de entrada de contexto para cualquier sesión de Claude Code que trabaje en este repo. Se actualiza al cerrar cada fase de desarrollo. Si estás retomando el proyecto, leé esto antes de tocar código.

## Qué es esto

Un juego web de simulación de carrera de futbolista, inspirado en dos juegos virales argentinos investigados a fondo antes de empezar a construir:

- **Copero: Convertite en Leyenda** (copero.com.ar) — creación de jugador rica, progresión narrativa por decisiones cada 2 años, resumen final compartible.
- **El Ídolo** (potrerofutbol.ar) — +300 eventos aleatorios, sistema RPG de pretemporada, rival fijo, finales de torneo resueltas con minijuegos interactivos, ranking global.

Este proyecto combina y mejora ambos: prioriza (1) minijuegos interactivos para instancias de torneo y (2) competencia social (ranking global + rival), sobre una base de creación de personaje más profunda y contenido data-driven fácil de expandir.

**Contexto:** proyecto personal / de portfolio, sin deadline ni consigna externa. El plan completo de diseño y arquitectura (aprobado por el usuario) vive en `C:\Users\devandroid\.claude\plans\generic-sprouting-panda.md` — este `CLAUDE.md` es el resumen vivo y actualizado de ese plan a medida que se construye; ante cualquier duda de detalle no cubierta acá, ese archivo tiene el razonamiento completo.

## Decisiones de producto (por qué están así)

- **Sin autenticación / sin cuentas.** Se juega sin login (cero fricción, como los originales). Al subir un puntaje al ranking solo se pide un alias de texto libre, sin cuenta real. Decisión explícita del usuario.
- **Sin anti-cheat por ahora.** El puntaje se guarda tal cual lo manda el cliente, con únicamente guardrails básicos (`check` constraints de rango en la DB). Decisión explícita del usuario para no sobre-invertir en esto en una v1 de portfolio; se puede endurecer después (ver plan, sección de riesgos, para el diseño de validación por replay si algún día hace falta).
- **Motor de simulación puro, sin dependencias de React/DOM/Supabase** (`src/engine/**`). Esto es lo que permite testear el motor con Vitest de forma aislada y es la base técnica que haría posible un anti-cheat por replay más adelante sin reescribir nada — aunque hoy no se está construyendo esa parte.
- **Minijuegos pluggables vía registry** (`src/minigames/registry.ts`) — agregar un minijuego nuevo no debería requerir tocar el motor ni el resto de las pantallas.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (vía `@tailwindcss/vite`, sin `tailwind.config.js` — todo el theming vive en CSS con `@import "tailwindcss"` en `src/index.css`)
- Zustand (estado de carrera, wrapper fino sobre un reducer puro)
- React Router v7 (`BrowserRouter`)
- Zod (validación de contenido data-driven — todavía no implementado, ver Pendiente)
- Vitest + Testing Library + jsdom
- Supabase (Postgres) — sin Supabase Auth

Alias de import: `@/` apunta a `src/` (configurado en `vite.config.ts` y `tsconfig.app.json`).

## Estructura de carpetas (real, no solo planeada)

```
src/
  types/
    player.ts    # Position, Foot, PlayerIdentity, PlayerAttributes, PlayerState
    club.ts      # Club
    event.ts     # StatEffect, EventChoice, SeasonEvent (sin EventRequirement todavía — no hizo falta)
    career.ts    # CharacterCreationInput, CareerState, CareerAction (solo CREATE_CAREER | ADVANCE_SEASON por ahora)
  content/
    clubs.ts     # SAMPLE_CLUBS: ~13 clubes hardcodeados a mano (NO es content/clubs.json todavía — eso es Fase 3)
    events.ts    # SAMPLE_EVENTS: ~8 eventos narrativos hardcodeados a mano, cubren edad 17-38
  engine/        # TS puro, sin imports de React/DOM/Supabase — confirmado, cero dependencias externas de UI
    rng.ts               # createRng(seed) — PRNG mulberry32, expone next/randInt/pick/pickWeighted/getState
    statMath.ts           # generateBaseAttributes, attributeGrowthDelta, deriveOverallRating, marketValueForRating, clamp, ATTRIBUTE_KEYS
    createCareer.ts        # createCareer(input, seed?) -> CareerState inicial (edad 17)
    eventSelector.ts        # selectEvent(state, rng) — filtra por minAge/maxAge, pickWeighted por `weight`
    seasonPerformance.ts     # simulateSeasonPerformance(player, rng) -> {matches, goals, assists} de la temporada
    careerReducer.ts          # careerReducer(state, action) — único punto de entrada al motor
    __tests__/
      rng.test.ts              # determinismo, resumibilidad desde un estado capturado, rango [0,1)
      careerReducer.test.ts     # carrera completa hasta RETIRED, determinismo end-to-end, invariantes de stats
  minigames/        # subcarpetas penaltyShootout/, freeKick/, dribbleChallenge/, shared/ creadas, vacías (Fase 4-5)
  store/            # vacío todavía — careerStore.ts (Zustand) va acá en Fase 2
  features/
    characterCreation/CharacterCreationPage.tsx   # placeholder, ruta "/"
    careerHub/CareerHubPage.tsx                   # placeholder, ruta "/hub"
    seasonEvent/SeasonEventPage.tsx               # placeholder, ruta "/event"
    minigamePlayer/MinigamePlayerPage.tsx         # placeholder, ruta "/minigame"
    careerSummary/CareerSummaryPage.tsx           # placeholder, ruta "/summary"
    leaderboard/LeaderboardPage.tsx               # placeholder, ruta "/leaderboard"
    rival/                                        # vacío — no es una ruta propia, se embebe en careerHub más adelante
  lib/
    supabaseClient.ts   # cliente de Supabase real, usa VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY
    api/                # vacío — leaderboard.ts, rivals.ts van acá en Fase 6
  hooks/            # vacío todavía — useCareerEngine.ts va acá en Fase 2
  test/setup.ts     # setup de Testing Library (jest-dom) para Vitest
App.tsx             # router con las 6 rutas de arriba, todas placeholder
```

Las carpetas que todavía no tienen contenido real (`minigames/*`, `store/`, `features/rival/`, `hooks/`, `lib/api/`) tienen un `.gitkeep` para que git las trackee hasta la fase que las llene.

## Supabase

- Proyecto creado vía MCP: `coperort` (id `gucidoqqqkckgiahuiyd`), región `sa-east-1` (San Pablo — menor latencia para el público objetivo en Argentina/Sudamérica), tier gratuito ($0/mes).
- URL y publishable key están en `.env.local` (gitignored) y el esqueleto sin valores en `.env.example` (sí versionado).
- `src/lib/supabaseClient.ts` ya crea el cliente real apuntando a este proyecto.
- **Todavía no se aplicó ninguna migración / no hay tablas creadas.** El esquema completo (`careers`, `leaderboard_entries`, `rivals`, `legends`) está diseñado en el plan pero se aplica recién en la Fase 6, siguiendo el orden de construcción — no tiene sentido tener tablas antes de que el motor exista.

## Fuente de datos de clubes (todavía no implementado)

Decisión tomada (ver plan para el detalle completo de alternativas evaluadas): usar las listas de Wikipedia por confederación ("List of top-division football clubs in [UEFA/CONMEBOL/CONCACAF/CAF/AFC] countries" + listas de segunda división de UEFA/AFC + páginas país por país para segunda división en Sudamérica/CONCACAF/CAF) como fuente principal para `content/clubs.json`, priorizando Sudamérica y Europa primero. `openfootball` (GitHub, JSON sin key) como atajo para bootstrapear ligas europeas grandes ya estructuradas. Esto se hace en la Fase 3. **No se descargó ni procesó nada todavía.**

No se pudo confirmar cómo obtiene Copero sus propios datos de clubes (su sitio está bloqueado por el filtro de red del entorno de desarrollo y no hay documentación técnica pública) — no asumir nada al respecto si se retoma este punto.

## Desviaciones respecto al boceto original del plan (motor, Fase 1)

El plan (`generic-sprouting-panda.md`) esbozaba el motor a alto nivel; al implementarlo de verdad surgieron simplificaciones deliberadas, documentadas acá para que no se lean como olvidos:

- **`rngState: number` en vez de `rngLog: number[]`.** El plan sugería loguear cada tirada individual del PRNG para poder "reproducir" una carrera. En la práctica, guardar solo el estado interno actual del mulberry32 (un único número) alcanza para el mismo objetivo — reconstruir `createRng(rngState)` continúa exactamente la misma secuencia. Un array creciente de cada tirada no agrega determinismo, solo lo haría más pesado. Si en algún momento se necesita replay forense tirada-por-tirada (ej. debugging de un bug de balance), se puede loguear ahí puntualmente.
- **`CareerAction` solo tiene `CREATE_CAREER` y `ADVANCE_SEASON`.** El plan mostraba la unión completa (`RESOLVE_EVENT`, `TRIGGER_MINIGAME`, etc.) como el diseño final. Se implementó a propósito solo el subset que la Fase 1 necesita — el resto se agrega cuando la Fase 2/4/5 realmente los necesite, para no tener variantes de acción sin ningún código que las maneje.
- **`ADVANCE_SEASON` resuelve el evento de la temporada automáticamente** (elige una choice al azar vía `rng.pick`), no lo deja pendiente para que la UI decida. Es correcto para la Fase 1 (no hay UI todavía, el objetivo es que una carrera corra sola de punta a punta). En la Fase 2, cuando haya una pantalla de evento real, esto cambia: `ADVANCE_SEASON` va a dejar el evento en un estado pendiente (`phase: 'EVENT_PENDING'`) y un nuevo `RESOLVE_EVENT(choiceId)` va a aplicar la elección real del usuario. **Este es el cambio más importante a tener en cuenta al empezar la Fase 2** — hoy `CareerState.phase` es solo `'ACTIVE' | 'RETIRED'`, va a crecer.
- **`CareerState` no tiene `titles`, `awards` ni `rival` todavía.** Nada los llena hasta que exista `trophyEngine` (Fase 4) y el sistema de rival (Fase 7) — se agregan en esas fases, no antes, para no tener campos muertos.
- **`content/clubs.ts` y `content/events.ts` son TypeScript a mano, no JSON.** Un set mínimo (~13 clubes, ~8 eventos) solo para poder correr y testear el motor. La Fase 3 los reemplaza por `content/clubs.json` (generado desde Wikipedia, ver sección de arriba) + `content/contentSchema.ts` (zod) + un volumen real de eventos.
- **Rating de debut a los 17 años puede salir bastante alto** (~65-75 en las pruebas manuales) porque `generateBaseAttributes` da un rango generoso (30-45 base + 20-35 extra en los atributos de la posición). Es una decisión de diseño válida para un juego (arranca como promesa, no como jugador genérico), no un bug — pero si en algún momento se quiere una curva de dificultad distinta, este es el lugar (`statMath.ts`).

## Progreso (Hecho)

### Fase 0 — Scaffold (2026-08-04)
- Proyecto Vite + React 19 + TypeScript scaffoldeado (`npm create vite@latest -- --template react-ts`), limpiado del boilerplate default (`App.css`, assets de ejemplo, landing page default).
- Tailwind v4 configurado vía plugin de Vite (sin config file separado).
- Vitest configurado (`environment: jsdom`, alias `@/`, setup de Testing Library) — verificado con un test de humo (después reemplazado por la cobertura real de la Fase 1).
- Estructura completa de carpetas creada según la arquitectura del plan.
- React Router armado en `App.tsx` con 6 rutas placeholder (una por pantalla del plan, sin lógica todavía).
- Proyecto de Supabase provisionado vía MCP (`coperort`, `sa-east-1`, plan gratuito) y cliente wireado en `src/lib/supabaseClient.ts`. Sin tablas todavía (eso es Fase 6).
- Git inicializado, `.gitignore` ampliado para cubrir `.env*` explícitamente además de `*.local`.
- `npm run test` y `npx tsc -b --noEmit` corren limpios, sin errores ni warnings.
- Verificado en navegador (`npm run dev`, puerto 5173): las 6 rutas placeholder cargan sin errores de consola, Tailwind aplica estilos correctamente (confirmado con `getComputedStyle`), título de la página corregido a "Coperort" (venía del template como "scaffold_tmp"). Config de preview guardada en `.claude/launch.json` (`coperort-dev`) para levantar el server de dev en futuras sesiones.

### Fase 1 — Núcleo del motor (2026-08-04)
- Tipos centrales en `src/types/` (ver estructura de carpetas arriba).
- `engine/rng.ts` — PRNG mulberry32 determinístico, con tests de determinismo y resumibilidad.
- `engine/statMath.ts` — generación de atributos base por posición, curva de crecimiento por edad (fuerte hasta 21, estable hasta 25, meseta 26-32, declive después — consistente con lo investigado sobre Copero/El Ídolo), rating derivado con pesos por posición (cap 99), valor de mercado.
- `content/clubs.ts` + `content/events.ts` — set mínimo hardcodeado (ver "Desviaciones" arriba).
- `engine/createCareer.ts`, `engine/eventSelector.ts`, `engine/seasonPerformance.ts`, `engine/careerReducer.ts` — el loop completo: crear carrera → avanzar temporada (evento auto-resuelto + crecimiento + performance del año) → retiro cuando la edad llega a `retirementAge` (aleatorio entre 34-38, fijado al crear la carrera).
- **11 tests en Vitest, todos pasando**, cubriendo: una carrera completa corre de los 17 a `retirementAge` sin intervención manual; el rating se mantiene siempre en [1,99]; stats acumuladas son plausibles (goles > 0 para un delantero); **la misma seed produce una carrera idéntica byte a byte** (excepto el `id`, que usa `crypto.randomUUID()`); seeds distintas producen carreras distintas; `ADVANCE_SEASON` sin `CREATE_CAREER` previo tira error; la carrera es un no-op una vez retirada.
- Sanity check manual (script temporal, después borrado): una carrera de ejemplo con seed fija muestra progresión de rating/goles/valor de mercado coherente temporada a temporada — revisado a ojo, no solo verificado por los tests automáticos.
- `npm run test`, `npx tsc -b --noEmit` y `npm run lint` (oxlint) corren limpios.

## Pendiente (TODO)

Todo lo que sigue está sin empezar. Orden según el plan (`generic-sprouting-panda.md`):

- **Fase 2 — UI de creación + hub:** conectar el motor a React vía `store/careerStore.ts` (Zustand) y `hooks/useCareerEngine.ts`. Reemplazar los placeholders de `CharacterCreationPage` y `CareerHubPage` por UI real.
- **Fase 3 — Contenido:** armar `content/clubs.json` (ver sección de fuente de datos arriba), volumen real de eventos narrativos, `content/contentSchema.ts` (validación con zod), transfers/préstamos/lesiones, resolución automática de títulos de liga (sin minijuego todavía).
- **Fase 4 — Minijuegos, primera entrada:** `minigames/types.ts` (contrato `MinigameDefinition`), `minigames/registry.ts`, primer minijuego real (`penaltyShootout`), conectado a `engine/trophyEngine.ts` para finales de copa.
- **Fase 5 — Más minijuegos:** `freeKick`, `dribbleChallenge`, sistema de comodines de motivación.
- **Fase 6 — Supabase real:** aplicar las migraciones del esquema (`careers`, `leaderboard_entries`, `rivals`, `legends` — diseño completo en el plan), `LeaderboardPage` real leyendo de Supabase, flujo de "ingresá tu alias" al retirarte.
- **Fase 7 — Rival:** rival por arquetipo determinístico visible en el hub de carrera.
- **Fase 8 — Pulido de portfolio:** UI de recreación de carrera por seed (feature "recreá a una leyenda", documentada — no easter egg oculto), tarjeta compartible (export a canvas/imagen), logros, personalización de apariencia más profunda, pase mobile.

## Decisiones abiertas / riesgos conocidos

- Cobertura de clubes fuera de Europa/Sudamérica va a quedar incompleta al principio (depende de cuánta data haya organizada en Wikipedia por país para segundas divisiones de CONCACAF/CAF/AFC más chicas). No es bloqueante, se puede sumar de forma incremental.
- Sin anti-cheat: si el proyecto gana tracción real, revisar el diseño de validación server-side por replay que está esbozado en el plan (motor puro portado a una Edge Function).
- `react-router-dom` tiene una vulnerabilidad reportada (alta severidad) específica del modo RSC (React Server Components) — no aplica a este proyecto porque es una SPA client-only sin RSC. Registrado acá para no re-investigarlo cada vez que `npm audit` lo marque.
