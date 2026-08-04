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
- **El diseño visual (paleta, tipografía, sistema de componentes) no se decide ad-hoc en el código.** Todo lo que sea diseño va primero como prompt a `docs/design-brief.md`, pensado para pasarle a una sesión de Claude dedicada a diseño ("Claude design"), y de ahí se implementa. Las pantallas construidas hasta ahora tienen estilo mínimo/genérico a propósito — son funcionales, no son la pasada de diseño final. Ver `docs/design-brief.md`.

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
    event.ts     # StatEffect, EventChoice (+ transfer/loan/injury opcionales), ClubMoveCriteria, LoanEffect, InjuryEffect, SeasonEvent
    career.ts    # CharacterCreationInput, CareerState (pendingEventId, loan, titles), LoanState, Title, CareerAction (CREATE_CAREER | ADVANCE_SEASON | RESOLVE_EVENT)
  content/
    clubs.ts     # SAMPLE_CLUBS: ~13 clubes hardcodeados a mano (NO es content/clubs.json todavía — eso es Fase 3b); getClubById(id)
    events/      # SAMPLE_EVENTS armado desde 8 archivos por categoría + index.ts; getEventById(id). Reemplaza al viejo events.ts (Fase 3a, EN PROGRESO — ver Pendiente)
      index.ts, training.ts, diet.ts, injury.ts, transfer.ts, loan.ts, media.ts, personal.ts, scandal.ts
  engine/        # TS puro, sin imports de React/DOM/Supabase — confirmado, cero dependencias externas de UI
    rng.ts               # createRng(seed) — PRNG mulberry32, expone next/randInt/pick/pickWeighted/getState
    statMath.ts           # generateBaseAttributes, attributeGrowthDelta, deriveOverallRating, marketValueForRating, clamp, ATTRIBUTE_KEYS
    createCareer.ts        # createCareer(input, seed?) -> CareerState inicial (edad 17, phase ACTIVE, pendingEventId null, loan null, titles [])
    eventSelector.ts        # selectEvent(state, rng) — filtra por minAge/maxAge y por loan-lock (sin transfer/loan mientras `state.loan` esté activo), pickWeighted por `weight`
    seasonPerformance.ts     # simulateSeasonPerformance(player, rng, options?) -> {matches, goals, assists}; `options.matchesMultiplier` reduce partidos por lesión
    clubTransition.ts        # selectClubForMove (con relajación en 3 pasos), applyTransfer, applyLoanStart, applyLoanReturn (Fase 3a, nuevo)
    leagueEngine.ts           # resolveLeagueWinner(clubs, {country,tier}, rng) — título de liga automático, ponderado por reputación (Fase 3a, nuevo)
    careerReducer.ts          # careerReducer(state, action) — único punto de entrada al motor; beginSeason() + resolveEvent() internos; resolveEvent ahora también aplica transfer/loan/retorno de préstamo, lesión y título de liga
    __tests__/
      rng.test.ts              # determinismo, resumibilidad desde un estado capturado, rango [0,1)
      careerReducer.test.ts     # carrera completa hasta RETIRED, determinismo end-to-end, invariantes de stats, flujo EVENT_PENDING/RESOLVE_EVENT. TODAVÍA NO cubre transfer/loan/injury/titles (Fase 3a sin terminar, ver Pendiente)
  minigames/        # subcarpetas penaltyShootout/, freeKick/, dribbleChallenge/, shared/ creadas, vacías (Fase 4-5)
  store/
    careerStore.ts    # useCareerStore (Zustand) — { career, dispatch } fino sobre careerReducer, sin lógica propia
  features/
    characterCreation/CharacterCreationPage.tsx   # real: formulario de creación, ruta "/"
    careerHub/CareerHubPage.tsx                   # real: estado de la carrera en curso + botón "Avanzar temporada", ruta "/hub"
    seasonEvent/SeasonEventPage.tsx               # real: texto del evento pendiente + elección del usuario, ruta "/event"
    minigamePlayer/MinigamePlayerPage.tsx         # placeholder, ruta "/minigame"
    careerSummary/CareerSummaryPage.tsx           # liviano: stats finales al retirarse, ruta "/summary" (build completo es Fase 6)
    leaderboard/LeaderboardPage.tsx               # placeholder, ruta "/leaderboard"
    rival/                                        # vacío — no es una ruta propia, se embebe en careerHub más adelante
  lib/
    supabaseClient.ts   # cliente de Supabase real, usa VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY
    labels.ts            # POSITION_LABELS, FOOT_LABELS, ATTRIBUTE_LABELS, EVENT_CATEGORY_LABELS, formatCurrency — strings en español compartidos entre pantallas
    api/                # vacío — leaderboard.ts, rivals.ts van acá en Fase 6
  hooks/
    useCareerEngine.ts    # wrapper del store: { career, createCareer, advanceSeason, resolveEvent }
  test/setup.ts     # setup de Testing Library (jest-dom) para Vitest
App.tsx             # router con las 6 rutas de arriba (3 reales, 3 placeholder)
```

Las carpetas que todavía no tienen contenido real (`minigames/*`, `features/rival/`, `lib/api/`) tienen un `.gitkeep` para que git las trackee hasta la fase que las llene.

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
- **`CareerAction` solo tenía `CREATE_CAREER` y `ADVANCE_SEASON` en la Fase 1** (el plan mostraba la unión completa — `RESOLVE_EVENT`, `TRIGGER_MINIGAME`, etc. — como diseño final). Se implementó a propósito solo el subset que cada fase necesita, para no tener variantes de acción sin código que las maneje. `RESOLVE_EVENT` ya se agregó en la Fase 2 (ver abajo); `TRIGGER_MINIGAME` se agrega en la Fase 4.
- ~~`ADVANCE_SEASON` resuelve el evento de la temporada automáticamente~~ — **cambiado en la Fase 2.** Ahora `ADVANCE_SEASON` solo elige el evento de la temporada (vía `selectEvent`) y deja la carrera en `phase: 'EVENT_PENDING'` con `pendingEventId` seteado, sin tocar al jugador todavía. `RESOLVE_EVENT(choiceId)` es quien aplica la elección real del usuario, el crecimiento de atributos y la performance de la temporada, y decide si pasa a `ACTIVE` o `RETIRED`. `CareerState.phase` pasó de `'ACTIVE' | 'RETIRED'` a `'ACTIVE' | 'EVENT_PENDING' | 'RETIRED'`. `ADVANCE_SEASON` dispatcheado en `EVENT_PENDING` es un no-op (igual que en `RETIRED`); `RESOLVE_EVENT` fuera de `EVENT_PENDING`, o con un `choiceId` que no existe en el evento pendiente, tira error.
- **`CareerState.titles` existe desde la Fase 3a, pero `Title.type` solo tiene `'league'`.** `'cup'` se agrega recién en la Fase 4 cuando exista `engine/trophyEngine.ts` — mismo criterio que ya se usó con `CareerAction` en la Fase 1: no declarar una variante sin código que la llene. `awards` y `rival` siguen sin existir, se agregan en Fase 7/8.
- **`content/clubs.ts` sigue siendo TypeScript a mano** (~13 clubes). Pasa a `content/clubs.json` (generado desde Wikipedia, ver sección de arriba) recién en la Fase 3b, separada de 3a a pedido explícito del usuario por ser un trabajo de investigación externa con alcance abierto. `content/events.ts` sí se reestructuró en la Fase 3a a `content/events/` (un archivo por categoría), pero el volumen de contenido real quedó a mitad de camino — ver Pendiente.
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

### Fase 2 — UI de creación + hub (2026-08-04)
- **Cambio de motor primero** (ver "Desviaciones" arriba): `CareerPhase` gana `EVENT_PENDING`, `CareerState` gana `pendingEventId`, `CareerAction` gana `RESOLVE_EVENT(choiceId)`. `careerReducer.ts` separa la lógica vieja de `advanceSeason` en `beginSeason()` (elige evento, deja pendiente) y `resolveEvent()` (aplica la elección, crecimiento, performance, retiro). `content/events.ts` gana `getEventById(id)` para que tanto el motor como la UI puedan resolver el evento pendiente por id.
- `store/careerStore.ts` — `useCareerStore` (Zustand): un solo campo `career: CareerState | null` + `dispatch`, sin lógica propia más allá de invocar `careerReducer`.
- `hooks/useCareerEngine.ts` — wrapper de conveniencia sobre el store (`createCareer`, `advanceSeason`, `resolveEvent`).
- `lib/labels.ts` — traducciones al español de `Position`/`Foot`/`EventCategory`/atributos y `formatCurrency`, compartidas entre las tres pantallas nuevas para no duplicar strings.
- `CharacterCreationPage` real: formulario controlado (nombre, apellido, nacionalidad, posición, pierna hábil, número de camiseta) con validación básica en cliente, dispatcha `CREATE_CAREER` y navega a `/hub`.
- `CareerHubPage` real: identidad del jugador, rating, edad/temporada/club/valor de mercado, barras de atributos, stats acumuladas de la carrera, botón "Avanzar temporada". Ese botón dispatcha `ADVANCE_SEASON` y navega a `/event` si la carrera quedó en `EVENT_PENDING`. Guardas de ruta: sin carrera en el store → redirige a `/`; `EVENT_PENDING` → redirige a `/event`; `RETIRED` → redirige a `/summary`.
- `SeasonEventPage` real: muestra el texto y las opciones del evento pendiente (vía `getEventById`), dispatcha `RESOLVE_EVENT(choiceId)` al elegir y navega a `/summary` o `/hub` según si la carrera quedó retirada. Guardas: sin carrera → `/`; sin evento pendiente → `/hub`.
- `CareerSummaryPage` recibió un toque liviano (no el build completo de la Fase 6): muestra stats finales al retirarse y un link para empezar de nuevo, en vez de quedar como placeholder — necesario para que el flujo `/event → RETIRED` no termine en una pantalla muerta.
- **6 tests nuevos en `careerReducer.test.ts` (17 en total, todos pasando)**, cubriendo el flujo `EVENT_PENDING`/`RESOLVE_EVENT`: `ADVANCE_SEASON` deja un `pendingEventId` resoluble sin tocar al jugador; `ADVANCE_SEASON` es no-op con un evento ya pendiente; `RESOLVE_EVENT` aplica efectos y limpia `pendingEventId`; `RESOLVE_EVENT` tira error sin evento pendiente, con un `choiceId` inválido, o sin `CREATE_CAREER` previo. Los tests end-to-end existentes (carrera completa, determinismo) se adaptaron para resolver el evento de cada temporada eligiendo siempre la primera opción.
- Verificado a mano en navegador (`npm run dev`): flujo completo creación → hub → evento → hub con stats actualizadas, validación de formulario, y las guardas de ruta (navegación directa a `/event` sin carrera activa redirige a `/`, dado que todavía no hay persistencia — esperado, no es un bug).
- `npm run test`, `npx tsc -b --noEmit` y `npm run lint` (oxlint) corren limpios.

### Fase 3a — Motor: transfers/préstamos/lesiones, títulos de liga (2026-08-04, **EN PROGRESO, SIN TERMINAR** — se cortó por falta de tiempo, retomar desde acá)

Plan completo en `C:\Users\devandroid\.claude\plans\nifty-mixing-quiche.md`. El usuario pidió explícitamente separar Fase 3 en 3a (motor + contenido, sin dependencias externas) y 3b (datos reales de clubes desde Wikipedia/openfootball, investigación aparte) — ver ese plan para el razonamiento completo.

**Hecho y verificado (`npm run test`, `npx tsc -b --noEmit`, `npm run lint` corren limpios, 17/17 tests):**
- `types/event.ts`: `ClubMoveCriteria` (reputationMin/Max, sameCountry, tier), `LoanEffect` (extiende `ClubMoveCriteria` + `durationSeasons`), `InjuryEffect` (`matchesReductionPct`), y `EventChoice` gana `transfer?`/`loan?`/`injury?` opcionales — aditivo, no rompe contenido existente.
- `types/career.ts`: `LoanState { parentClubId, returnYear }`, `Title { type: 'league', season, year, clubId, country, tier }`, `CareerState.loan: LoanState | null` y `CareerState.titles: Title[]`.
- `content/clubs.ts`: `getClubById(id)` (mismo patrón que `getEventById`).
- `engine/clubTransition.ts` (nuevo): `selectClubForMove` (excluye siempre el club actual, relajación en 3 pasos si el criterio no tiene candidatos, nunca llama `pickWeighted` sobre un array vacío — ataca el riesgo ya documentado más abajo), `applyTransfer`, `applyLoanStart`, `applyLoanReturn`.
- `engine/leagueEngine.ts` (nuevo): `resolveLeagueWinner(clubs, {country, tier}, rng)` — título de liga automático cada temporada, ponderado por reputación.
- `engine/seasonPerformance.ts`: segundo parámetro opcional `options.matchesMultiplier`, backward-compatible (sin `options`, comportamiento idéntico a antes).
- `engine/eventSelector.ts`: filtro de "loan lock" — mientras `state.loan` esté activo, no elegir eventos de categoría `transfer`/`loan`.
- `engine/createCareer.ts`: inicializa `loan: null`, `titles: []`.
- `engine/careerReducer.ts`: `resolveEvent` ahora aplica, en orden, transición de club (retorno de préstamo automático si corresponde, si no transfer, si no loan-start, si no nada) → recalcular rating/marketValue → performance de la temporada (con `matchesMultiplier` si la elección tiene `injury`) → resolución de liga (agrega a `titles` si el club del jugador ganó) → chequeo de retiro.
- `content/events.ts` → `content/events/` (index.ts + un archivo por categoría), **reestructuración no rompe nada** — `@/content/events` sigue resolviendo igual para todos los imports existentes. `training.ts` y `diet.ts` recibieron el tratamiento completo de 5 eventos cada uno (contenido nuevo, en español). El resto de las categorías (`injury`, `transfer`, `media`, `personal`) solo tienen los eventos originales migrados tal cual (sin usar todavía los campos nuevos `transfer`/`loan`/`injury`). `loan.ts` y `scandal.ts` quedaron como arrays vacíos.

**SIN TERMINAR — esto es lo que falta para cerrar 3a, no es opcional, retomar en este orden:**
1. **Contenido:** el evento `transfer-offer` (en `content/events/transfer.ts`) todavía NO usa el campo `choice.transfer` — la opción de irse solo multiplica `marketValue`, no mueve de club de verdad. `minor-injury` (en `injury.ts`) tampoco usa `choice.injury.matchesReductionPct` todavía. `loan.ts` y `scandal.ts` no tienen ningún evento — la mecánica de préstamo (motor) está construida y lista pero **nunca se dispara** porque no hay contenido que la use. Sin esto, transfers/préstamos/lesiones/títulos de liga están implementados en el motor pero no son alcanzables jugando una carrera real todavía.
2. **`content/contentSchema.ts` no se creó.** El plan lo especifica en detalle (zod, `z.ZodType<T>` contra los tipos reales, con refinamientos a nivel array).
3. **Tests nuevos no se escribieron:** `clubTransition.test.ts`, `leagueEngine.test.ts`, `eventSelector.test.ts`, `content/__tests__/contentSchema.test.ts`, y las extensiones a `careerReducer.test.ts` para transfer/loan/injury/titles que lista el plan. Los 17 tests que pasan son los de antes de esta fase — **las mecánicas nuevas no tienen cobertura de tests todavía**, solo compilan y no rompen lo existente.
4. **Sanity check manual no se corrió** (el paso 4 de verificación del plan: correr una carrera con seed fija y loguear si transfers/préstamos/lesiones/títulos disparan de verdad).
5. Actualizar esta sección de `CLAUDE.md` a "Hecho" sin el disclaimer de "sin terminar" una vez que 1-4 estén cerrados.

## Pendiente (TODO)

- **Fase 3a — terminar lo de arriba** (contenido de transfer/loan/injury/scandal, `contentSchema.ts`, tests nuevos, sanity check).
- **Fase 3b — datos reales de clubes:** armar `content/clubs.json` (ver sección de fuente de datos arriba) desde Wikipedia/openfootball. Separada de 3a a pedido del usuario — es investigación externa con mucho fetching y alcance abierto (cuántos países/confederaciones cubrir), no depende de que 3a esté terminada para empezar.
- **Fase 4 — Minijuegos, primera entrada:** `minigames/types.ts` (contrato `MinigameDefinition`), `minigames/registry.ts`, primer minijuego real (`penaltyShootout`), conectado a `engine/trophyEngine.ts` para finales de copa.
- **Fase 5 — Más minijuegos:** `freeKick`, `dribbleChallenge`, sistema de comodines de motivación.
- **Fase 6 — Supabase real:** aplicar las migraciones del esquema (`careers`, `leaderboard_entries`, `rivals`, `legends` — diseño completo en el plan), `LeaderboardPage` real leyendo de Supabase, flujo de "ingresá tu alias" al retirarte.
- **Fase 7 — Rival:** rival por arquetipo determinístico visible en el hub de carrera.
- **Fase 8 — Pulido de portfolio:** UI de recreación de carrera por seed (feature "recreá a una leyenda", documentada — no easter egg oculto), tarjeta compartible (export a canvas/imagen), logros, personalización de apariencia más profunda, pase mobile.

## Decisiones abiertas / riesgos conocidos

- Cobertura de clubes fuera de Europa/Sudamérica va a quedar incompleta al principio (depende de cuánta data haya organizada en Wikipedia por país para segundas divisiones de CONCACAF/CAF/AFC más chicas). No es bloqueante, se puede sumar de forma incremental.
- Sin anti-cheat: si el proyecto gana tracción real, revisar el diseño de validación server-side por replay que está esbozado en el plan (motor puro portado a una Edge Function).
- `react-router-dom` tiene una vulnerabilidad reportada (alta severidad) específica del modo RSC (React Server Components) — no aplica a este proyecto porque es una SPA client-only sin RSC. Registrado acá para no re-investigarlo cada vez que `npm audit` lo marque.
- **`createCareer.ts` elige el club de debut filtrando `SAMPLE_CLUBS` por `reputation < 40`.** Si ese filtro alguna vez da un array vacío, `rng.pickWeighted` (`engine/rng.ts`) hace `items[items.length - 1]` sobre un array vacío y devuelve `undefined`, rompiendo la carrera sin un error claro. Hoy no pasa (hay 2 clubes con reputación <40 en el set de 13 hardcodeados), pero cuando la Fase 3b reemplace el contenido por datos reales de Wikipedia por país/confederación no hay garantía de que todos los países tengan clubes de reputación baja. Al armar `content/clubs.json`, o bien agregar un fallback al pool completo (como ya hace `eventSelector.ts` con `SAMPLE_EVENTS`, y como ya hace `clubTransition.ts#selectClubForMove` desde la Fase 3a), o asegurar que el generador de contenido siempre incluya clubes de baja reputación por país. **`engine/leagueEngine.ts#resolveLeagueWinner` (Fase 3a) tiene exactamente el mismo riesgo sin mitigar** — filtra por `country`+`tier` y llama `pickWeighted` directo, sin fallback; hoy nunca da vacío porque el grupo siempre incluye al club del jugador por construcción, pero si `resolveLeagueWinner` se llama alguna vez con un club fuera de `clubs` este supuesto se rompe. Revisar los tres puntos juntos cuando se arme `content/clubs.json` en 3b.
- **Sin persistencia de la carrera en curso.** `store/careerStore.ts` vive solo en memoria; un refresh de página o una navegación de URL completa (no vía React Router) pierde la carrera y las guardas de ruta redirigen a `/`. Es el comportamiento esperado para la Fase 2 — no hay `localStorage` ni sync con Supabase todavía (eso es Fase 6).
