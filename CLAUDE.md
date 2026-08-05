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
- **El diseño visual (paleta, tipografía, sistema de componentes) no se decide ad-hoc en el código.** Todo lo que sea diseño va primero como prompt a `docs/design-brief.md`, pensado para pasarle a una sesión de Claude dedicada a diseño ("Claude design"), y de ahí se implementa. **Ya se corrió esa sesión y se integró el resultado** (ver "Integración de diseño" en Progreso) — las 4 pantallas reales tienen ahora el sistema visual definitivo (dark-only, paleta negro/naranja/rosa/verde, Inter + Barlow Condensed). El handoff original (bundle HTML/CSS/JS de Claude Design) vive fuera del repo, en `Downloads\Diseño de cuatro pantallas interactivas-handoff\`, no en `docs/` — se usó una sola vez como especificación pixel-a-pixel y no hace falta para trabajar en el código de acá en adelante.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (vía `@tailwindcss/vite`, sin `tailwind.config.js` — todo el theming vive en CSS con `@import "tailwindcss"` en `src/index.css`)
- Zustand (estado de carrera, wrapper fino sobre un reducer puro)
- React Router v7 (`BrowserRouter`)
- Zod (validación de contenido data-driven — `content/contentSchema.ts`, ver Fase 3a)
- Vitest + Testing Library + jsdom
- Supabase (Postgres) — sin Supabase Auth

Alias de import: `@/` apunta a `src/` (configurado en `vite.config.ts` y `tsconfig.app.json`).

Fuentes: Google Fonts `Inter` (400-800) + `Barlow Condensed` (600-800), cargadas vía `<link>` en `index.html` (no `@import` en CSS, por performance). Tema dark-only — no hay versión clara, `color-scheme: dark` en `src/index.css`.

## Estructura de carpetas (real, no solo planeada)

```
src/
  types/
    player.ts    # Position, Foot, PlayerIdentity, PlayerAttributes, PlayerState
    club.ts      # Club
    event.ts     # StatEffect, EventChoice (+ transfer/loan/injury opcionales), ClubMoveCriteria, LoanEffect, InjuryEffect, SeasonEvent
    career.ts    # CharacterCreationInput, CareerState (currentClub nullable, clubOffers, pendingEventId, loan, titles, seasonHistory), SeasonHistoryEntry, LoanState, Title, CareerAction (CREATE_CAREER | SELECT_CLUB | ADVANCE_SEASON | RESOLVE_EVENT)
  content/
    clubs.json   # 274 clubes: 10 países CONMEBOL (primera + segunda división donde la fuente era limpia) + 5 clubes europeos originales sin tocar (Fase 3b)
    clubs.ts     # loader fino: valida clubs.json con parseClubs (contentSchema.ts) al importar, exporta SAMPLE_CLUBS + getClubById(id)
    countries.ts # COUNTRIES: ~195 países (ISO, nombres en español), sin colores — getCountryByName/getCountryById (integración de diseño)
    tacticalPositions.ts # TACTICAL_POSITIONS: 12 posiciones tácticas de la cancha interactiva de creación, mapeadas a Position (cosmético, integración de diseño)
    contentSchema.ts # validación Zod de SeasonEvent/EventChoice/StatEffect/ClubMoveCriteria/LoanEffect/InjuryEffect y Club — seasonEventsSchema/clubsSchema (ids únicos, minAge<=maxAge) (Fase 3a)
    events/      # SAMPLE_EVENTS armado desde 8 archivos por categoría + index.ts; getEventById(id). Las 8 categorías tienen contenido real (Fase 3a)
      index.ts, training.ts, diet.ts, injury.ts, transfer.ts, loan.ts, media.ts, personal.ts, scandal.ts
    __tests__/
      contentSchema.test.ts # SAMPLE_EVENTS/SAMPLE_CLUBS reales validan contra el schema, más casos inválidos (ids duplicados, minAge>maxAge, category/tier/reputation fuera de rango)
  engine/        # TS puro, sin imports de React/DOM/Supabase — confirmado, cero dependencias externas de UI
    rng.ts               # createRng(seed) — PRNG mulberry32, expone next/randInt/pick/pickWeighted/getState
    statMath.ts           # generateBaseAttributes, attributeGrowthDelta, deriveOverallRating, marketValueForRating, clamp, ATTRIBUTE_KEYS
    createCareer.ts        # createCareer(input, seed?) -> CareerState inicial (edad 17, phase CLUB_PENDING, currentClub null, clubOffers, pendingEventId null, loan null, titles [], seasonHistory [])
    eventSelector.ts        # selectEvent(state, rng) — filtra por minAge/maxAge y por loan-lock (sin transfer/loan mientras `state.loan` esté activo), pickWeighted por `weight`
    seasonPerformance.ts     # simulateSeasonPerformance(player, rng, options?) -> {matches, goals, assists}; `options.matchesMultiplier` reduce partidos por lesión
    clubTransition.ts        # selectClubForMove (con relajación en 3 pasos), selectDebutClubOffers (integración de diseño — hasta N clubes distintos ponderados, con la misma relajación), applyTransfer, applyLoanStart, applyLoanReturn (Fase 3a)
    leagueEngine.ts           # resolveLeagueWinner(clubs, {country,tier}, rng) — título de liga automático, ponderado por reputación (Fase 3a, nuevo)
    careerReducer.ts          # careerReducer(state, action) — único punto de entrada al motor; beginSeason() + resolveEvent() + selectClub() internos; resolveEvent aplica transfer/loan/retorno de préstamo, lesión, título de liga y push a seasonHistory
    __tests__/
      rng.test.ts              # determinismo, resumibilidad desde un estado capturado, rango [0,1)
      careerReducer.test.ts     # 25 tests: carrera completa hasta RETIRED, determinismo end-to-end, invariantes de stats, flujo CLUB_PENDING/SELECT_CLUB, flujo EVENT_PENDING/RESOLVE_EVENT, seasonHistory, transfer real, loan + retorno automático, injury reduce partidos, título de liga se agrega a titles (Fase 3a)
      clubTransition.test.ts    # selectClubForMove (relajación en 3 pasos, nunca elige el club actual), selectDebutClubOffers, applyTransfer, applyLoanStart, applyLoanReturn (Fase 3a)
      leagueEngine.test.ts      # resolveLeagueWinner agrupa por country+tier, ponderado por reputación, determinístico (Fase 3a)
      eventSelector.test.ts     # filtro minAge/maxAge, loan-lock (sin transfer/loan mientras hay préstamo activo), relajación de pool (Fase 3a)
  minigames/        # subcarpetas penaltyShootout/, freeKick/, dribbleChallenge/, shared/ creadas, vacías (Fase 4-5)
  store/
    careerStore.ts    # useCareerStore (Zustand) — { career, dispatch } fino sobre careerReducer, sin lógica propia
  components/        # capa de UI compartida entre pantallas (integración de diseño, no existía antes)
    icons/            # SVGs inline sin librería: SearchIcon, CheckIcon, InfoCircleIcon, StatCircleIcon, TrophyIcon, UpChevronIcon, DownChevronIcon
    ui/               # LabelValue, StatTile, AttributeBar, SegmentedControl, Button, RatingBadge, FlagChip (+ColorRoundel), PlayerIdentityHeader, StatTilesRow, EmptyState, ClubCrestBadge, ClubOfferPicker, SeasonTimelineTable, EventChoiceCard, CountryPicker
  features/
    characterCreation/CharacterCreationPage.tsx   # real, con el diseño integrado: 3 columnas (camiseta+identidad, buscador de país, cancha táctica), ruta "/"
    characterCreation/components/                 # JerseyPreview, PositionPitch — de uso único en esta pantalla, no van en components/ui
    careerHub/CareerHubPage.tsx                   # real, con el diseño integrado: rama por career.phase (CLUB_PENDING → ClubOfferPicker; ACTIVE → botón "Avanzar temporada"), timeline de temporadas real, ruta "/hub"
    seasonEvent/SeasonEventPage.tsx               # real, con el diseño integrado: EventChoiceCard por elección (efecto cualitativo Sube/Baja/Sin cambios, no porcentajes), ruta "/event"
    minigamePlayer/MinigamePlayerPage.tsx         # placeholder con tema dark aplicado (paso liviano), ruta "/minigame"
    careerSummary/CareerSummaryPage.tsx           # con el diseño integrado, ruta "/summary" (build completo con ranking es Fase 6)
    leaderboard/LeaderboardPage.tsx               # placeholder con tema dark aplicado (paso liviano), ruta "/leaderboard"
    rival/                                        # vacío — no es una ruta propia, se embebe en careerHub más adelante
  lib/
    supabaseClient.ts   # cliente de Supabase real, usa VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY
    labels.ts            # POSITION_LABELS, POSITION_SHORT_LABELS, FOOT_LABELS, ATTRIBUTE_LABELS, EVENT_CATEGORY_LABELS, formatCurrency — strings en español compartidos entre pantallas
    colorHash.ts          # hashColorPair(seed) — par de colores HSL determinístico (escudos de club, banderas, camisetas — sin curar color a mano por item)
    clubVisuals.ts         # clubInitials(name) — iniciales para el escudo placeholder
    eventEffects.ts         # summarizeChoiceEffect(choice) -> {direction, label} — resume el efecto neto de una elección sin revelar números exactos
    api/                # vacío — leaderboard.ts, rivals.ts van acá en Fase 6
  hooks/
    useCareerEngine.ts    # wrapper del store: { career, createCareer, selectClub, advanceSeason, resolveEvent }
  test/setup.ts     # setup de Testing Library (jest-dom) para Vitest
App.tsx             # router con las 6 rutas de arriba (4 con el diseño integrado, 2 placeholder con tema dark)
```

Las carpetas que todavía no tienen contenido real (`minigames/*`, `features/rival/`, `lib/api/`) tienen un `.gitkeep` para que git las trackee hasta la fase que las llene.

## Supabase

- Proyecto creado vía MCP: `coperort` (id `gucidoqqqkckgiahuiyd`), región `sa-east-1` (San Pablo — menor latencia para el público objetivo en Argentina/Sudamérica), tier gratuito ($0/mes).
- URL y publishable key están en `.env.local` (gitignored) y el esqueleto sin valores en `.env.example` (sí versionado).
- `src/lib/supabaseClient.ts` ya crea el cliente real apuntando a este proyecto.
- **Todavía no se aplicó ninguna migración / no hay tablas creadas.** El esquema completo (`careers`, `leaderboard_entries`, `rivals`, `legends`) está diseñado en el plan pero se aplica recién en la Fase 6, siguiendo el orden de construcción — no tiene sentido tener tablas antes de que el motor exista.

## Fuente de datos de clubes

**Sudamérica (los 10 países CONMEBOL) implementada en la Fase 3b** — ver esa entrada en Progreso para el detalle completo (fuente por país, metodología de `reputation`, conteo final). Europa y el resto de las confederaciones (CONCACAF/CAF/AFC/OFC) **todavía no** — siguen con los 5 clubes hardcodeados originales (Sevilla, Atlético Madrid, Real Madrid, Barcelona, Manchester City). `openfootball` (GitHub, JSON sin key) se evaluó como atajo para bootstrapear ligas europeas grandes ya estructuradas pero no se usó en esta pasada (da nombres de equipo desde datos de partidos, sin metadata de club) — si se retoma Europa, evaluar de nuevo si conviene o si alcanza con el mismo método Wikipedia-por-país ya probado.

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

### Integración de diseño (Claude Design) — hecha antes de retomar Fase 3a (2026-08-05)

El usuario corrió una sesión de Claude Design (claude.ai/design) con el prompt de `docs/design-brief.md` y entregó un handoff bundle (HTML/CSS/JS, `coperort.dc.html`, fuera del repo en `Downloads\Diseño de cuatro pantallas interactivas-handoff\`) con la especificación pixel-a-pixel de las 4 pantallas reales. Por decisión explícita del usuario esto se implementó **antes** de retomar Fase 3a (que sigue sin terminar, ver abajo, sin cambios de esta pasada). Plan de implementación completo en `C:\Users\49432830\.claude\plans\linked-brewing-starlight.md`.

El handoff era un prototipo, no código a portar literalmente — se recreó pixel a pixel en React + Tailwind v4 real. Tres puntos donde el mockup implicaba más que un repintado se resolvieron como cambios de producto/motor reales (decisión explícita del usuario, no interpretación libre):

1. **Selector de club de debut real.** `createCareer.ts` ya no auto-asigna club — la carrera arranca en `phase: 'CLUB_PENDING'` con `currentClub: null` y `clubOffers` (hasta 3 clubes distintos, ponderados por reputación vía `selectDebutClubOffers` en `clubTransition.ts`, con relajación al pool completo si hay menos de 3 candidatos con reputación <40 — esto además arregla el riesgo de `pickWeighted` sobre array vacío que estaba anotado más abajo para el viejo `createCareer.ts`). Nueva acción `SELECT_CLUB(clubId)` en el reducer asigna el club elegido y pasa a `ACTIVE`.
2. **Timeline de carrera con datos reales**, no mockeados. `CareerState.seasonHistory: SeasonHistoryEntry[]` (edad, club, rating, PJ/GLS/AST de esa temporada), poblado por `resolveEvent()` en cada `RESOLVE_EVENT`. `SeasonTimelineTable` (Hub y Evento) lo renderiza fila por edad desde 17 hasta `retirementAge`, con guiones en las que todavía no se jugaron.
3. **Selector de nacionalidad** pasó de texto libre a una grilla buscable de `content/countries.ts` (~195 países ISO, nombres en español) con banderas-placeholder de 2 colores derivadas en runtime (`hashColorPair`, no curadas a mano). El mockup solo traía 21 países hardcodeados — se amplió a cobertura completa por decisión del usuario.

Dos desviaciones deliberadas respecto al pixel-parity del mockup, porque este inventaba datos que el motor real no tiene: las píldoras de efecto de cada elección de evento muestran un solo indicador cualitativo ("Sube"/"Baja"/"Sin cambios", derivado del signo neto de `choice.effects` vía `lib/eventEffects.ts#summarizeChoiceEffect`) en vez de las dos píldoras con porcentajes fabricados del mockup — no hay modelo de probabilidad real en el motor determinístico. Y la píldora de posición en Hub/Evento usa el código corto de la `Position` real (`POR`/`DEF`/`MED`/`DEL`, `lib/labels.ts#POSITION_SHORT_LABELS`), no el código táctico de 12 vías — ese grid (`content/tacticalPositions.ts`) es solo el mecanismo de UX de la pantalla de creación para elegir la `Position` real, nunca se persiste.

Se construyó además la primera capa de componentes de UI compartidos (`src/components/icons/`, `src/components/ui/`, ver estructura de carpetas arriba) — antes de esto cada pantalla inlineaba sus propias clases de Tailwind sin abstracción (`StatTile`/`AttributeBar` vivían duplicados dentro de `CareerHubPage.tsx`).

**8 tests nuevos en `careerReducer.test.ts` (25 en total, todos pasando)** cubriendo `CLUB_PENDING`/`SELECT_CLUB` (ofertas distintas, no-op de `ADVANCE_SEASON` en esta fase, selección válida, los tres casos de error) y `seasonHistory` (una entrada por temporada resuelta que coincide con `stats`, invariante `seasonHistory.length === eventLog.length` en una carrera completa, cross-check de partidos acumulados). El helper `runFullCareer` de los tests end-to-end existentes ahora despacha `SELECT_CLUB` con la primera oferta antes de arrancar el loop de temporadas.

Verificado en navegador (`npm run dev`, puerto 5173, sin errores de consola en ningún paso): flujo completo creación (con búsqueda de país y cancha táctica funcionando) → hub en `CLUB_PENDING` con las ofertas de club → selección de club → `ACTIVE` con el club elegido → avanzar temporada → evento con las píldoras de efecto → hub con el timeline mostrando la temporada recién jugada con datos reales → repetido hasta retiro (edad 35, dentro de 34-38) → resumen con stats coherentes → reinicio a `/`. `/minigame` y `/leaderboard` (paso liviano, sin rediseño estructural) cargan con el tema dark aplicado, sin errores.

`npm run test` (25/25), `npx tsc -b --noEmit` y `npm run lint` (oxlint) corren limpios. `node_modules` no estaba instalado al empezar esta sesión — se corrió `npm install` (147 paquetes; las 2 vulnerabilidades de severidad alta que reporta `npm audit` son la de `react-router-dom`/RSC ya registrada abajo como no aplicable, confirmado).

### Fase 3a — Motor: transfers/préstamos/lesiones, títulos de liga (motor 2026-08-04, contenido+tests+cierre 2026-08-05)

Plan original en `C:\Users\devandroid\.claude\plans\nifty-mixing-quiche.md` (no accesible desde esta máquina, ver nota de multi-entorno en CLAUDE.md). Terminada después de la integración de diseño, por decisión explícita del usuario de hacer el diseño primero.

**Motor (2026-08-04):**
- `types/event.ts`: `ClubMoveCriteria` (reputationMin/Max, sameCountry, tier), `LoanEffect` (extiende `ClubMoveCriteria` + `durationSeasons`), `InjuryEffect` (`matchesReductionPct`), y `EventChoice` gana `transfer?`/`loan?`/`injury?` opcionales — aditivo, no rompe contenido existente.
- `types/career.ts`: `LoanState { parentClubId, returnYear }`, `Title { type: 'league', season, year, clubId, country, tier }`, `CareerState.loan: LoanState | null` y `CareerState.titles: Title[]`.
- `engine/clubTransition.ts` (nuevo): `selectClubForMove` (excluye siempre el club actual, relajación en 3 pasos si el criterio no tiene candidatos, nunca llama `pickWeighted` sobre un array vacío), `applyTransfer`, `applyLoanStart`, `applyLoanReturn`.
- `engine/leagueEngine.ts` (nuevo): `resolveLeagueWinner(clubs, {country, tier}, rng)` — título de liga automático cada temporada, ponderado por reputación.
- `engine/seasonPerformance.ts`: segundo parámetro opcional `options.matchesMultiplier`, backward-compatible.
- `engine/eventSelector.ts`: filtro de "loan lock" — mientras `state.loan` esté activo, no elegir eventos de categoría `transfer`/`loan`.
- `engine/careerReducer.ts`: `resolveEvent` aplica, en orden, transición de club (retorno de préstamo automático si corresponde, si no transfer, si no loan-start, si no nada) → recalcular rating/marketValue → performance de la temporada (con `matchesMultiplier` si la elección tiene `injury`) → resolución de liga (agrega a `titles` si el club del jugador ganó) → chequeo de retiro.
- `content/events.ts` → `content/events/` (index.ts + un archivo por categoría), reestructuración sin romper imports existentes.

**Contenido, schema, tests y cierre (2026-08-05):**
- `content/events/transfer.ts` ampliado a 5 eventos: `transfer-offer` (ahora usa `choice.transfer: {reputationMin: 60}` de verdad), más `foreign-suitor`, `release-clause-triggered`, `relegation-release`, `boyhood-club-calls` (este último usa `sameCountry: true` para la vuelta al club de la infancia).
- `content/events/injury.ts` ampliado a 5 eventos: `minor-injury` (ahora usa `choice.injury.matchesReductionPct`), más `ligament-scare`, `preseason-knock`, `overuse-fatigue`, `matchday-collision` — cada uno con la elección "arriesgada" perdiendo menos partidos pero con mayor penalty de atributo, y la elección "prudente" al revés.
- `content/events/loan.ts`: 5 eventos nuevos (antes vacío) usando `choice.loan` con distintos criterios (`reputationMax`, `sameCountry`, `tier`, `durationSeasons` de 1 y 2 temporadas) — dispara la mecánica de préstamo que ya estaba construida en el motor.
- `content/events/scandal.ts`: 5 eventos nuevos (antes vacío), tono liviano/potrero (video viral, asado con hinchas rivales, posteo en redes, foto de joda, entrevista picante) — sin temas sensibles, efectos mayormente sobre `marketValue`.
- `content/contentSchema.ts` (nuevo): validación Zod (`z.ZodType<T>` contra los tipos reales de `types/event.ts` y `types/club.ts`) — `seasonEventsSchema`/`clubsSchema`, con refinamiento a nivel array de ids únicos (`superRefine`), y a nivel evento de `minAge<=maxAge` y choices con ids únicos dentro del evento. `parseSeasonEvents` queda como función de conveniencia sin invocar todavía (`content/events/` sigue siendo TS a mano); `parseClubs` sí se conectó en tiempo de carga real en la Fase 3b (ver abajo) apenas `content/clubs.ts` pasó a tener datos generados en vez de un puñado hardcodeado a mano.
- **36 tests nuevos** repartidos en `clubTransition.test.ts` (13), `leagueEngine.test.ts` (4), `eventSelector.test.ts` (5), `content/__tests__/contentSchema.test.ts` (10) y 4 extensiones a `careerReducer.test.ts` (transfer real mueve de club y extiende `clubHistory`; loan real + retorno automático al año exacto de `returnYear`; injury reduce partidos jugados esa temporada vs. una elección equivalente sin lesión; título de liga se agrega a `titles` cuando el club del jugador gana). **61 tests en total, todos pasando.**
- Sanity check manual (script temporal en `engine/__tests__/_sanityCheck.test.ts`, después borrado): 5 carreras completas con seeds fijas (100-104), logueando cada vez que dispara transfer/loan-start/loan-return/injury/title. Confirmado con datos reales: transfers mueven de club y respetan el criterio (ej. `push-for-move` siempre a un club con reputación ≥60); préstamos de 1 y 2 temporadas vuelven exactamente en el año esperado; lesiones bajan partidos jugados esa temporada. **Hallazgo no-bug, ya anotado en "Decisiones abiertas":** con las 13 clubes hardcodeadas, Argentina tier 2 y Inglaterra tier 1 tienen un solo club cada uno (Tigre y Manchester City respectivamente), así que un jugador en esos clubes gana la liga *todas* las temporadas — comportamiento correcto del motor (grupo de un club siempre se gana a sí mismo, ya cubierto por `leagueEngine.test.ts`), pero un desbalance de contenido a tener en cuenta al armar `content/clubs.json` en la Fase 3b.
- `npm run test` (61/61), `npx tsc -b --noEmit` y `npm run lint` (oxlint) corren limpios. Verificado también en navegador: carrera completa de punta a punta con el contenido nuevo cargado, sin errores de consola.

### Fase 3b — datos reales de clubes: Sudamérica (2026-08-05)

Alcance elegido por decisión propia (se le preguntó al usuario, no contestó — se siguió con la opción marcada como recomendada, ver plan `linked-brewing-starlight.md`): los 10 países CONMEBOL completos, Europa/resto de confederaciones sin tocar todavía (ver "Fuente de datos de clubes" arriba).

- **274 clubes en `content/clubs.json`** (antes 13): Argentina 66 (28 Primera División + 38 Primera B Nacional), Brasil 40 (20 Série A + 20 Série B), Chile 32 (16 Primera + 16 Ascenso), Uruguay 33 (16 Primera + 17 Segunda), Paraguay 12, Bolivia 16, Perú 19, Ecuador 16, Colombia 20, Venezuela 15, más los 5 clubes europeos originales (Sevilla, Atlético Madrid, Real Madrid, Barcelona, Manchester City) **sin modificar**.
- **Fuente adaptativa por país**, confirmada con fetches de prueba antes de transcribir: la página de Wikipedia "List of football clubs in [País]" cuando está organizada por división (Argentina, Chile, Uruguay, Paraguay); la página de la competencia de temporada actual cuando la lista general organiza por otro criterio en vez de división (Brasil la organiza por estado — se usó "2026 Campeonato Brasileiro Série A/B" en su lugar; mismo caso para Bolivia, que solo separaba "activos"/"desaparecidos" — se usó la página del "FBF División Profesional").
- **`reputation` es una heurística de balance de juego, no un dato investigado** (no existe una fuente pública de "puntaje de reputación" de club): baseline por tier (~35-55 tier1, ~15-30 tier2) + boost manual para clubes de reconocimiento regional/internacional (River/Boca/Peñarol/Nacional/Colo-Colo/Flamengo/Palmeiras en el techo del rango, ~85-95), mismo criterio que ya se usaba en el set de 13 clubes original — ahora documentado explícitamente en el comentario de `content/clubs.ts`.
- **`content/clubs.ts` reescrito como loader**: `import clubsData from './clubs.json'` + `export const SAMPLE_CLUBS = parseClubs(clubsData)` (Zod de la Fase 3a) — cualquier fila mal formada revienta apenas algo importe `@/content/clubs`, no en silencio. Se mantuvo el nombre `SAMPLE_CLUBS` (no se renombró pese a que ya no es "sample", para no tocar los ~10 archivos que lo importan solo por estética) y la firma de `getClubById`.
- `tsconfig.app.json`: se activó `resolveJsonModule` (necesario para que `tsc -b` tipe el import de `clubs.json`; Vite ya lo soportaba en runtime sin esto).
- **Ids con colisión entre países se disambiguaron con sufijo** (ej. `river-plate` = Argentina, `river-plate-uy` = Uruguay, `river-plate-py` = Paraguay; mismo patrón para `racing`/`racing-uy`/`racing-cordoba`, `nacional`/`nacional-py`, `libertad`/`libertad-ec`, `universidad-catolica`/`universidad-catolica-ec`, `huracan`/`huracan-uy`), validado automáticamente por la unicidad de ids que ya exige `clubsSchema`.
- **3 tests de `clubTransition.test.ts` (Fase 3a) rotos por el swap de datos** — hardcodeaban `getClubById('ca-tigre')`, el club placeholder que dejó de existir. Arreglados apuntando a `getClubById('tigre')` (el club real que lo reemplazó, ahora tier 1 en vez de tier 2) — las aserciones ya eran lo bastante generales como para no necesitar más cambios. Resto de la suite (`leagueEngine.test.ts`, `careerReducer.test.ts`) pasó sin tocar, tal como se anticipó en el plan: los 5 clubes europeos que esos tests usan (`manchester-city`, `real-madrid`, `sevilla`) quedaron intactos a propósito.
- **Efecto colateral que resuelve el hallazgo de la Fase 3a**: la liga de un solo club en Argentina tier 2 (antes solo Tigre) ya no existe — ahora tiene 38 clubes reales. Inglaterra tier 1 sigue siendo un caso de un solo club (Manchester City) porque Europa no se tocó en esta pasada; se resuelve cuando se haga la Fase 3b de Europa.
- Sanity check manual (mismo patrón, script temporal borrado después): ofertas de debut de varias seeds ahora salen de todo el pool real (~270 clubes) en vez de las 2 originales — confirmado con ejemplos reales de Argentina, Chile, Brasil, Uruguay, Ecuador, Bolivia, Perú, Colombia, Venezuela apareciendo como ofertas.
- `npm run test` (61/61 — los mismos 61 de la Fase 3a, con el fix de 3 tests), `npx tsc -b --noEmit` y `npm run lint` (oxlint) corren limpios. Verificado en navegador: creación → hub con 3 ofertas de club reales de países distintos → un par de temporadas con timeline real, sin errores de consola.
- **Pendiente explícitamente para más adelante** (no es un olvido, es alcance incremental a propósito): Europa (más allá de los 5 clubes actuales) y el resto de las confederaciones (CONCACAF/CAF/AFC/OFC) quedan afuera de esta pasada.

## Pendiente (TODO)

- **Fase 3b — Europa y resto de confederaciones:** Sudamérica ya está (ver Progreso). Falta ampliar `content/clubs.json` a Europa (más allá de los 5 clubes actuales) y opcionalmente CONCACAF/CAF/AFC/OFC — mismo método (Wikipedia por país, adaptando a página de temporada si la lista general no organiza por división), incremental, no bloqueante.
- **Fase 4 — Minijuegos, primera entrada:** `minigames/types.ts` (contrato `MinigameDefinition`), `minigames/registry.ts`, primer minijuego real (`penaltyShootout`), conectado a `engine/trophyEngine.ts` para finales de copa.
- **Fase 5 — Más minijuegos:** `freeKick`, `dribbleChallenge`, sistema de comodines de motivación.
- **Fase 6 — Supabase real:** aplicar las migraciones del esquema (`careers`, `leaderboard_entries`, `rivals`, `legends` — diseño completo en el plan), `LeaderboardPage` real leyendo de Supabase, flujo de "ingresá tu alias" al retirarte.
- **Fase 7 — Rival:** rival por arquetipo determinístico visible en el hub de carrera.
- **Fase 8 — Pulido de portfolio:** UI de recreación de carrera por seed (feature "recreá a una leyenda", documentada — no easter egg oculto), tarjeta compartible (export a canvas/imagen), logros, personalización de apariencia más profunda, pase mobile.

## Decisiones abiertas / riesgos conocidos

- Sudamérica ya tiene datos reales completos (Fase 3b); Europa (más allá de los 5 clubes actuales) y CONCACAF/CAF/AFC/OFC siguen sin cubrir — depende de cuánta data haya organizada en Wikipedia por país para sus segundas divisiones. No es bloqueante, se puede sumar de forma incremental.
- Sin anti-cheat: si el proyecto gana tracción real, revisar el diseño de validación server-side por replay que está esbozado en el plan (motor puro portado a una Edge Function).
- `react-router-dom` tiene una vulnerabilidad reportada (alta severidad) específica del modo RSC (React Server Components) — no aplica a este proyecto porque es una SPA client-only sin RSC. Registrado acá para no re-investigarlo cada vez que `npm audit` lo marque.
- ~~`createCareer.ts` elige el club de debut filtrando `SAMPLE_CLUBS` por `reputation < 40`...~~ — **resuelto en la integración de diseño (2026-08-05).** `createCareer.ts` ahora usa `selectDebutClubOffers` (`engine/clubTransition.ts`), que relaja al pool completo de clubes si el filtro por reputación da menos candidatos de los pedidos, y nunca llama `pickWeighted` sobre un array vacío. `engine/leagueEngine.ts#resolveLeagueWinner` sigue filtrando por `country`+`tier` y llamando `pickWeighted` directo sin fallback — con los 274 clubes de la Fase 3b esto no es un problema práctico hoy (todos los grupos CONMEBOL tienen varios clubes), pero si se agrega un país/confederación nuevo con un solo club en algún tier, revisar si conviene el mismo tipo de relajación que ya tiene `selectClubForMove`.
- ~~**Ligas de un solo club con las 13 clubes hardcodeadas** (Argentina tier 2, Inglaterra tier 1)~~ — **Argentina resuelto en la Fase 3b** (38 clubes reales en tier 2). **Inglaterra tier 1 (Manchester City) sigue siendo de un solo club** porque Europa no se tocó en esta pasada — se resuelve cuando se amplíe `content/clubs.json` a Europa.
- **Sin persistencia de la carrera en curso.** `store/careerStore.ts` vive solo en memoria; un refresh de página o una navegación de URL completa (no vía React Router) pierde la carrera y las guardas de ruta redirigen a `/`. Es el comportamiento esperado para la Fase 2 — no hay `localStorage` ni sync con Supabase todavía (eso es Fase 6).
