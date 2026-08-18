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
- **Minijuegos pluggables vía registry** (`src/minigames/registry.ts`) — agregar un minijuego nuevo no debería requerir tocar el motor ni el resto de las pantallas. **Implementado en la Fase 4:** el motor emite un `PendingMinigame` agnóstico y consume un `MinigameResult`, sin saber qué minijuegos existen; la elección concreta la hace la UI vía `pickMinigame(seed)`. Ver la entrada de Fase 4 en Progreso para el razonamiento completo.
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
    career.ts    # CharacterCreationInput, CareerState (currentClub nullable, clubOffers, pendingEventId, pendingMinigame, loan, titles, seasonHistory), SeasonHistoryEntry, LoanState, Title (league|cup), CareerAction (CREATE_CAREER | SELECT_CLUB | ADVANCE_SEASON | RESOLVE_EVENT | RESOLVE_MINIGAME)
    minigame.ts  # MinigameResult, PendingMinigame — tipos de dominio puros, acá y no en minigames/ para que engine/ los importe sin depender de la capa de UI (Fase 4)
    motivation.ts # Motivation — enfoque de pretemporada elegible (effects reusa StatEffect; minAge/maxAge/positions filtran la oferta) (Fase 5)
  content/
    clubs.json   # 467 clubes: 10 países CONMEBOL (primera + segunda, Fase 3b Sudamérica) + 7 países europeos (Inglaterra/España/Italia con 1ª y 2ª; Alemania/Francia/Portugal/Países Bajos con 1ª — Fase 3b Europa, 2026-08-07). Generado por scripts/build_europe_clubs.py
    clubs.ts     # loader fino: valida clubs.json con parseClubs (contentSchema.ts) al importar, exporta SAMPLE_CLUBS + getClubById(id)
    countries.ts # COUNTRIES: ~195 países (ISO, nombres en español), sin colores — getCountryByName/getCountryById (integración de diseño)
    tacticalPositions.ts # TACTICAL_POSITIONS: 12 posiciones tácticas de la cancha interactiva de creación, mapeadas a Position (cosmético, integración de diseño)
    motivations.ts # MOTIVATIONS: 12 enfoques de pretemporada con tradeoffs reales + getMotivationById (Fase 5)
    contentSchema.ts # validación Zod de SeasonEvent/EventChoice/StatEffect/ClubMoveCriteria/LoanEffect/InjuryEffect, Club y Motivation — seasonEventsSchema/clubsSchema/motivationsSchema (ids únicos, minAge<=maxAge) (Fase 3a, ampliado en 5)
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
    trophyEngine.ts            # resolveCupFinal(clubs, playerClub, rng) -> rival | null + cupFinalChance(club) — la copa NO se resuelve sola, se juega (Fase 4)
    motivationSelector.ts       # selectMotivationOffers(age, position, rng, count) — 3 enfoques distintos filtrados por edad/posición, con relajación al pool completo (Fase 5)
    careerReducer.ts          # careerReducer(state, action) — único punto de entrada al motor; beginSeason() + resolveEvent() + resolveMinigame() + selectClub() internos; resolveEvent aplica transfer/loan/retorno de préstamo, lesión, título de liga, push a seasonHistory y deja MINIGAME_PENDING si hay final de copa
    __tests__/
      rng.test.ts              # determinismo, resumibilidad desde un estado capturado, rango [0,1)
      careerReducer.test.ts     # 25 tests: carrera completa hasta RETIRED, determinismo end-to-end, invariantes de stats, flujo CLUB_PENDING/SELECT_CLUB, flujo EVENT_PENDING/RESOLVE_EVENT, seasonHistory, transfer real, loan + retorno automático, injury reduce partidos, título de liga se agrega a titles (Fase 3a)
      clubTransition.test.ts    # selectClubForMove (relajación en 3 pasos, nunca elige el club actual), selectDebutClubOffers, applyTransfer, applyLoanStart, applyLoanReturn (Fase 3a)
      leagueEngine.test.ts      # resolveLeagueWinner agrupa por country+tier, ponderado por reputación, determinístico (Fase 3a)
      eventSelector.test.ts     # filtro minAge/maxAge, loan-lock (sin transfer/loan mientras hay préstamo activo), relajación de pool (Fase 3a)
      trophyEngine.test.ts      # cupFinalChance dentro de rango y escalando con reputación, rival siempre del mismo país y distinto del propio, determinismo, país de un solo club -> null (Fase 4)
      motivationSelector.test.ts # 3 ofertas distintas, filtro por edad/posición, la oferta cambia entre un pibe y un veterano, determinismo, siempre 3 aunque el filtro deje pocas (Fase 5)
  minigames/        # capa de minijuegos (Fase 4). El motor NO importa nada de acá — ver "Decisiones de producto"
    types.ts          # MinigameDefinition (id, name, description, Component) + MinigameComponentProps (seed, difficulty, opponentName, attributes, onComplete)
    registry.ts       # MINIGAMES + getMinigameById(id) + pickMinigame(seed) — agregar un minijuego es sumarlo acá y nada más
    penaltyShootout/  # 5 penales, el arquero amaga y a veces miente — mecánica de LECTURA (Fase 4)
    freeKick/         # barra de precisión que hay que frenar a tiempo — mecánica de TIMING (Fase 5)
    dribbleChallenge/ # encarar rivales y decidir cuándo cobrar — mecánica de PUSH-YOUR-LUCK (Fase 5)
    shared/           # vacía: con 3 minijuegos todavía no apareció nada genuinamente compartido
    __tests__/registry.test.ts   # ids únicos, contrato completo, getMinigameById, pickMinigame determinístico
  store/
    careerStore.ts    # useCareerStore (Zustand) — { career, dispatch, hydrate } sobre careerReducer. dispatch además guarda en Supabase tras cada acción real (Fase 6, ver esa entrada de Progreso para el detalle de la cola de guardado)
  components/        # capa de UI compartida entre pantallas (integración de diseño, no existía antes)
    icons/            # SVGs inline sin librería: SearchIcon, CheckIcon, InfoCircleIcon, StatCircleIcon, TrophyIcon, UpChevronIcon, DownChevronIcon
    ui/               # LabelValue, StatTile, AttributeBar, SegmentedControl, Button, RatingBadge, FlagChip (+ColorRoundel), PlayerIdentityHeader, StatTilesRow, EmptyState, ClubCrestBadge, ClubOfferPicker, SeasonTimelineTable, EventChoiceCard, CountryPicker, TrophyCase (Fase 4)
  features/
    characterCreation/CharacterCreationPage.tsx   # real, con el diseño integrado: 3 columnas (camiseta+identidad, buscador de país, cancha táctica), ruta "/"
    characterCreation/components/                 # JerseyPreview, PositionPitch — de uso único en esta pantalla, no van en components/ui
    preseason/PreseasonPage.tsx                   # 3 enfoques de pretemporada con sus tradeoffs a la vista, ruta "/preseason" (Fase 5)
    careerHub/CareerHubPage.tsx                   # real, con el diseño integrado: rama por career.phase (CLUB_PENDING → ClubOfferPicker; ACTIVE → botón "Avanzar temporada"), timeline de temporadas real, ruta "/hub"
    seasonEvent/SeasonEventPage.tsx               # real, con el diseño integrado: EventChoiceCard por elección (efecto cualitativo Sube/Baja/Sin cambios, no porcentajes), ruta "/event"
    minigamePlayer/MinigamePlayerPage.tsx         # real (Fase 4): resuelve el minijuego vía pickMinigame(seed) y despacha RESOLVE_MINIGAME, ruta "/minigame"
    careerSummary/CareerSummaryPage.tsx           # con el diseño integrado + vitrina de títulos + alias y submit al ranking (Fase 6), ruta "/summary"
    leaderboard/LeaderboardPage.tsx               # real (Fase 6): tabla del ranking global leída de Supabase, ruta "/leaderboard"
    rival/                                        # vacío — no es una ruta propia, se embebe en careerHub más adelante
  lib/
    supabaseClient.ts   # cliente de Supabase real, usa VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY
    labels.ts            # POSITION_LABELS, POSITION_SHORT_LABELS, FOOT_LABELS, ATTRIBUTE_LABELS, EVENT_CATEGORY_LABELS, formatCurrency — strings en español compartidos entre pantallas
    colorHash.ts          # hashColorPair(seed) — par de colores HSL determinístico (escudos de club, banderas, camisetas — sin curar color a mano por item)
    clubVisuals.ts         # clubInitials(name) — iniciales para el escudo placeholder
    eventEffects.ts         # summarizeChoiceEffect(choice) -> efecto neto SIN números (eventos: ocultarlos es parte de la tensión) + describeStatEffects(effects) -> CON números (pretemporada: es una decisión de build, sin el número no podés elegir)
    careerSession.ts        # getStoredCareerId/setStoredCareerId/clearStoredCareerId — id opaco de la carrera activa en localStorage (Fase 6)
    api/                # saveCareer/loadCareer/deleteCareer (careers.ts) + submitScore/fetchTopEntries (leaderboard.ts) — Fase 6. rivals.ts va acá en Fase 7
  hooks/
    useCareerEngine.ts    # wrapper del store: { career, createCareer, selectClub, advanceSeason, resolveEvent }
    useRestoreCareer.ts     # al montar la app, si hay careerId en localStorage intenta loadCareer y lo hidrata en el store antes de renderizar rutas (Fase 6)
  test/setup.ts     # setup de Testing Library (jest-dom) para Vitest
App.tsx             # router con las 6 rutas de arriba (4 con el diseño integrado, 2 placeholder con tema dark)
```

Las carpetas que todavía no tienen contenido real (`minigames/*`, `features/rival/`, `lib/api/`) tienen un `.gitkeep` para que git las trackee hasta la fase que las llene.

## Supabase

- Proyecto creado vía MCP: `coperort` (id `gucidoqqqkckgiahuiyd`), región `sa-east-1` (San Pablo — menor latencia para el público objetivo en Argentina/Sudamérica), tier gratuito ($0/mes). El plan gratuito pausa el proyecto por inactividad — si `get_project` devuelve `INACTIVE`, `restore_project` lo reactiva en unos segundos.
- URL y publishable key están en `.env.local` (gitignored, hay que recrearlo a mano en cada máquina nueva — no sincroniza solo — con `get_project_url`/`get_publishable_keys` vía MCP) y el esqueleto sin valores en `.env.example` (sí versionado).
- `src/lib/supabaseClient.ts` ya crea el cliente real apuntando a este proyecto.
- **Migraciones aplicadas (Fase 6, 2026-08-18): `careers` y `leaderboard_entries`.** `rivals` y `legends` quedan para Fase 7/8, cuando exista código real que las use. Sin carpeta `supabase/` local — se aplica directo al proyecto remoto vía `apply_migration` del MCP, no hay CLI de Supabase en este repo.

## Fuente de datos de clubes

**Sudamérica (los 10 países CONMEBOL) y Europa (7 países) implementadas en la Fase 3b** — ver esas entradas en Progreso para el detalle completo (fuente por país, metodología de `reputation`, conteo final). El resto de las confederaciones (CONCACAF/CAF/AFC/OFC) **todavía no** está cubierto. Método usado en ambas pasadas: Wikipedia por país (página "List of football clubs in [País]" cuando organiza por división; página de la temporada actual de la competencia cuando no). Para Europa se usaron las páginas de temporada 2025–26 de cada liga (Premier League + Championship, LaLiga + Segunda, Serie A + Serie B, Bundesliga, Ligue 1, Primeira Liga, Eredivisie). `openfootball` (GitHub, JSON sin key) se evaluó como atajo pero no se usó (da nombres de equipo desde datos de partidos, sin metadata de club).

No se pudo confirmar cómo obtiene Copero sus propios datos de clubes (su sitio está bloqueado por el filtro de red del entorno de desarrollo y no hay documentación técnica pública) — no asumir nada al respecto si se retoma este punto.

## Desviaciones respecto al boceto original del plan (motor, Fase 1)

El plan (`generic-sprouting-panda.md`) esbozaba el motor a alto nivel; al implementarlo de verdad surgieron simplificaciones deliberadas, documentadas acá para que no se lean como olvidos:

- **`rngState: number` en vez de `rngLog: number[]`.** El plan sugería loguear cada tirada individual del PRNG para poder "reproducir" una carrera. En la práctica, guardar solo el estado interno actual del mulberry32 (un único número) alcanza para el mismo objetivo — reconstruir `createRng(rngState)` continúa exactamente la misma secuencia. Un array creciente de cada tirada no agrega determinismo, solo lo haría más pesado. Si en algún momento se necesita replay forense tirada-por-tirada (ej. debugging de un bug de balance), se puede loguear ahí puntualmente.
- **`CareerAction` solo tenía `CREATE_CAREER` y `ADVANCE_SEASON` en la Fase 1** (el plan mostraba la unión completa — `RESOLVE_EVENT`, `TRIGGER_MINIGAME`, etc. — como diseño final). Se implementó a propósito solo el subset que cada fase necesita, para no tener variantes de acción sin código que las maneje. `RESOLVE_EVENT` ya se agregó en la Fase 2 (ver abajo); `TRIGGER_MINIGAME` se agrega en la Fase 4.
- ~~`ADVANCE_SEASON` resuelve el evento de la temporada automáticamente~~ — **cambiado en la Fase 2.** Ahora `ADVANCE_SEASON` solo elige el evento de la temporada (vía `selectEvent`) y deja la carrera en `phase: 'EVENT_PENDING'` con `pendingEventId` seteado, sin tocar al jugador todavía. `RESOLVE_EVENT(choiceId)` es quien aplica la elección real del usuario, el crecimiento de atributos y la performance de la temporada, y decide si pasa a `ACTIVE` o `RETIRED`. `CareerState.phase` pasó de `'ACTIVE' | 'RETIRED'` a `'ACTIVE' | 'EVENT_PENDING' | 'RETIRED'`. `ADVANCE_SEASON` dispatcheado en `EVENT_PENDING` es un no-op (igual que en `RETIRED`); `RESOLVE_EVENT` fuera de `EVENT_PENDING`, o con un `choiceId` que no existe en el evento pendiente, tira error.
- ~~`Title.type` solo tiene `'league'`~~ — **`'cup'` agregado en la Fase 4** junto con `engine/trophyEngine.ts`, siguiendo el criterio de no declarar una variante sin código que la llene. `awards` y `rival` siguen sin existir, se agregan en Fase 7/8.
- **`content/clubs.ts` sigue siendo TypeScript a mano** (~13 clubes). Pasa a `content/clubs.json` (generado desde Wikipedia, ver sección de arriba) recién en la Fase 3b, separada de 3a a pedido explícito del usuario por ser un trabajo de investigación externa con alcance abierto. `content/events.ts` sí se reestructuró en la Fase 3a a `content/events/` (un archivo por categoría). El volumen de contenido real quedó a mitad de camino en la 3a (`media.ts`/`personal.ts` con solo 2 eventos cada uno) y se completó después (2026-08-07): las 8 categorías tienen ahora ~5 eventos reales, sin TODOs pendientes.
- **Rating de debut a los 17 años puede salir bastante alto** (~65-75 en las pruebas manuales) porque `generateBaseAttributes` da un rango generoso (30-45 base + 20-35 extra en los atributos de la posición). Es una decisión de diseño válida para un juego (arranca como promesa, no como jugador genérico), no un bug — pero si en algún momento se quiere una curva de dificultad distinta, este es el lugar (`statMath.ts`). **Ver también el punto de inflación de rating en "Decisiones abiertas".**

## Flujo de fases del motor

```
CREATE_CAREER -> CLUB_PENDING --SELECT_CLUB--> ACTIVE
ACTIVE --ADVANCE_SEASON--> PRESEASON_PENDING --SELECT_MOTIVATION--> EVENT_PENDING
EVENT_PENDING --RESOLVE_EVENT--> MINIGAME_PENDING (si hubo final de copa) --RESOLVE_MINIGAME--> ACTIVE | RETIRED
                             \--> ACTIVE | RETIRED (si no hubo final)
```

Cada fase `*_PENDING` espera una acción del usuario y tiene su propia ruta en la UI (`/hub`, `/preseason`, `/event`, `/minigame`). Al agregar una fase nueva hay que tocar: el tipo `CareerPhase`, el reducer, la guarda del hub, la navegación de la pantalla anterior, y `resolvePendingPhase` en `careerReducer.test.ts` (ese último es el único punto donde los tests conocen las fases — ver Fase 5).

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

### Fase 3b — datos reales de clubes: Europa (2026-08-07)

Continuación incremental de la Fase 3b, con el mismo método y criterio que Sudamérica. Se agregaron **193 clubes europeos** (`content/clubs.json` pasó de 274 a 467 clubes) de 7 países:

- **Inglaterra, España, Italia con dos divisiones**: Premier League (20) + Championship (24), LaLiga (20) + Segunda (22), Serie A (20) + Serie B (20).
- **Alemania, Francia, Portugal, Países Bajos con primera división**: Bundesliga (18), Ligue 1 (18), Primeira Liga (18), Eredivisie (18).
- **Fuente**: páginas de Wikipedia de la temporada 2025–26 de cada competencia (traídas con WebFetch, no transcritas de memoria — los ascensos/descensos de cada liga cambian año a año).
- **Los 5 clubes europeos originales** (Real Madrid, Barcelona, Atlético Madrid, Sevilla, Manchester City) **se conservaron con su reputación curada** (97/96/85/72/95) — el script los dedup por id, no los duplica.
- **`reputation` sigue siendo heurística de balance**, no un dato investigado (no existe fuente pública): baseline por tier + boost por peso regional/internacional (elites 90-97, grandes 80-90, mid 55-75, tier 2 default ~30 con clubes históricos venidos a menos más alto, ej. Leicester 70, Sampdoria 52, Deportivo 50).
- **Ids con colisión entre países desambiguados con sufijo de país** (ej. `nacional-pt` = Nacional de Madeira vs `nacional` = Uruguay), igual que en Sudamérica, validado por la unicidad de ids del `clubsSchema`.
- **Generado por `scripts/build_europe_clubs.py`** (versionado, documenta la provenance de los datos y el mapa de reputación por club — a diferencia de Sudamérica que se transcribió a mano). El loader `content/clubs.ts` corre Zod sobre el JSON al importar, así que cualquier fila mal formada revienta apenas algo importe `@/content/clubs`.
- **2 tests adaptados** (`leagueEngine.test.ts`, `trophyEngine.test.ts`): ambos hardcodeaban que Manchester City era el único club de Inglaterra para probar el caso "liga/país de un solo club". Con Inglaterra ahora con 44 clubes reales, ese caso se prueba con un club sintético (`solo-fc`/`lonely-fc` en un país inventado "Solandia") en vez de depender de los datos reales. Esto **resuelve el riesgo de "Inglaterra tier 1 de un solo club"** que estaba anotado en Decisiones abiertas. **90/90 tests siguen pasando.**
- Verificado con sanity check (script temporal, borrado): las ofertas de debut de 40 seeds ahora incluyen países europeos (España, Italia) además de todo CONMEBOL.

### Fase 3b — 2ª división europea restante + Liga MX/MLS (2026-08-08)

Alcance elegido con el usuario (opción intermedia entre "solo Europa" y "todas las confederaciones"): completar la 2ª división de los 4 países europeos que solo tenían 1ª, más Liga MX y MLS como única cobertura de CONCACAF por ahora. CAF/AFC/OFC siguen sin tocar.

- **+122 clubes** (`clubs.json` pasó de 467 a 589): 2. Bundesliga (18), Ligue 2 (18), Liga Portugal 2 (18, incluye reservas B de Benfica/Porto/Sporting — así juega la liga real), Eerste Divisie (20, incluye equipos "Jong" sub-21), Liga MX (18), MLS (30).
- **Fuente**: Wikipedia de temporada 2025–26/2025 vía WebFetch, mismo método que las pasadas anteriores.
- **`scripts/build_more_clubs.py`** (nuevo, mismo patrón que `build_europe_clubs.py`): dedup por id, sufijo de país en colisión (`SUFFIX` con `mx`/`us` nuevos).
- `reputation` sigue siendo heurística, no dato investigado — mismo criterio (baseline por tier + boost a clubes de peso, ej. América 86, Inter Miami 72 por el efecto Messi, Schalke 04 68 pese a estar en 2ª por ser un gigante caído).
- `npm run test` (90/90), `npx tsc -b --noEmit` y `npm run lint` corren limpios — no se tocó ningún test existente, los 274+193+122 clubes conviven sin colisión de ids.

### Fase 4 — Minijuegos: registry + penaltyShootout + finales de copa (2026-08-06)

Primera fase que agrega **gameplay real** en vez de simulación automática. Plan completo en `C:\Users\49432830\.claude\plans\linked-brewing-starlight.md`.

**Decisión de arquitectura central: el motor no sabe qué minijuegos existen.** El motor es TS puro sin React (regla dura), así que no puede importar `minigames/registry.ts` (exporta componentes). Si tuviera su propia lista de ids, agregar un minijuego obligaría a tocar motor + registry — justo lo que la decisión de producto de "minijuegos pluggables" dice que no debe pasar. En su lugar el motor emite un `PendingMinigame` **agnóstico** (`{ seed, difficulty, opponentClubId }`) y consume un `MinigameResult`; **la capa de UI elige qué minijuego se juega** con `pickMinigame(seed)`. Agregar el segundo minijuego (Fase 5) es escribir el componente y sumarlo al array del registry, nada más. Esto no rompe el determinismo: el resultado del minijuego es input del usuario igual que `choiceId` en `RESOLVE_EVENT`, y la garantía siempre fue "misma seed + mismos inputs → misma carrera".

- **El minijuego interrumpe la temporada, no la reemplaza** — mismo patrón que ya usaba `EVENT_PENDING`: `RESOLVE_EVENT` aplica todo (atributos, club, performance, liga) y si el club llegó a la final deja `phase: 'MINIGAME_PENDING'` en vez de `ACTIVE`/`RETIRED`. `RESOLVE_MINIGAME(result)` otorga el título si ganó y recién ahí resuelve la fase. El chequeo de retiro queda diferido y se recalcula desde el estado ya actualizado (no hace falta guardar "la fase que hubiera tocado").
- `types/minigame.ts` (nuevo): `MinigameResult` y `PendingMinigame` viven en `src/types/` y no en `minigames/`, para que `engine/` los importe sin invertir la dependencia motor→UI.
- `engine/trophyEngine.ts` (nuevo, hermano de `leagueEngine.ts`): `resolveCupFinal(clubs, playerClub, rng)` devuelve el rival o `null`. **La copa cruza divisiones a propósito** (el rival puede ser de otro tier del mismo país) — es parte de la gracia de una copa nacional, y está cubierto por un test.
- `minigames/penaltyShootout/`: 5 penales, 3 zonas. **La elección del usuario tiene que importar de verdad**, y con RNG determinístico y sin timing no puede haber skill puro — así que el arquero *se inclina* hacia un palo antes del tiro y a veces miente. Contra arqueros de club grande (difficulty alta) el amague miente más seguido. Verificado en el navegador: leyendo el amague se saca 4/5, pateando hacia él 1/5.
- **Vitrina de trofeos real** (`components/ui/TrophyCase.tsx`): hallazgo de la exploración — `career.titles` **no se renderizaba en ningún lado** (`grep titles src/**/*.tsx` daba cero), la vitrina estaba hardcodeada a `EmptyState`. Los títulos de liga se acumulaban invisiblemente desde la Fase 3a. Ahora hub y resumen muestran contadores de ligas/copas + los títulos recientes; si no hay ninguno se mantiene el `EmptyState` de antes.
- **Rebalanceo a partir del sanity check, no a ojo:** con el rango inicial (10%-45%) una carrera en clubes grandes llegaba al **52% de las temporadas con final** (el minijuego dejaba de ser premio y se volvía rutina) y otra terminaba con **0 finales en 19 temporadas** (el jugador nunca veía la feature principal). Ajustado a 15%-30% y re-medido sobre 60 carreras: **21.8% de las temporadas, 4.1 finales por carrera, y solo 1/60 carreras sin ninguna**. Los números viejos y el porqué del cambio quedaron en el comentario de `trophyEngine.ts`.
- **16 tests nuevos** (77 en total): `trophyEngine.test.ts` (6), `minigames/__tests__/registry.test.ts` (4), y 6 extensiones a `careerReducer.test.ts` (la final deja `MINIGAME_PENDING` sin retirar todavía; ganar agrega título `'cup'` y perder no; `ADVANCE_SEASON` es no-op en la fase nueva; una final en la última temporada igual retira al resolverse; los dos casos de error). Los helpers `runFullCareer` y el loop del test de rango de rating se colgaban con la fase nueva — arreglados resolviendo la final con un resultado fijo (constante, así el test de determinismo sigue valiendo).
- Verificado en navegador de punta a punta: carrera → final de copa → **jugar los 5 penales de verdad** → ganar suma la copa a la vitrina → perder no la suma → sigue a `/hub` o `/summary` según corresponda. Sin errores de consola en ningún paso.
- `npm run test` (77/77), `npx tsc -b --noEmit` y `npm run lint` (oxlint) corren limpios.

### Fase 5 — Dos minijuegos más + pretemporada roguelike (2026-08-06)

**El contrato del registry aguantó la prueba.** La Fase 4 lo dejó planteado como test explícito ("si agregar un minijuego obliga a tocar algo más, el contrato quedó corto"): agregar `freeKick` y `dribbleChallenge` tocó **solo `src/minigames/`** — dos carpetas nuevas y una línea en el array de `MINIGAMES`. Cero cambios en el motor, cero en las pantallas.

- **Tres mecánicas deliberadamente distintas**, no variantes de lo mismo: `penaltyShootout` es **lectura** (interpretar el amague del arquero), `freeKick` es **timing** (frenar un marcador que barre una barra de precisión), `dribbleChallenge` es **push-your-luck** (encarar rivales cada vez más difíciles y decidir cuándo cobrar, sabiendo que perder la pelota te deja sin nada).
- **Los atributos del jugador ahora importan en los minijuegos.** Hueco encontrado al abrir la fase: un delantero de 90 pateaba penales exactamente igual que uno de 50, así que progresar la carrera no se sentía en el gameplay. `MinigameComponentProps` gana `attributes` — **sin tocar el motor**, porque `MinigamePlayerPage` ya tenía la carrera en mano y `PendingMinigame` sigue siendo agnóstico. Se pasan los atributos enteros y cada minijuego elige los suyos (penales → definición, tiro libre → definición/pase, gambeta → regate/ritmo), así el contrato no se amplía con cada minijuego nuevo.
- **Pretemporada roguelike** (los "comodines de motivación" del roadmap, que nunca se habían definido). Decisión del usuario: modificador pasivo **elegible entre opciones**, que es justo el "sistema RPG de pretemporada" que el brief ya citaba de El Ídolo. Flujo nuevo: `ADVANCE_SEASON` → `PRESEASON_PENDING` con 3 enfoques ofrecidos → `SELECT_MOTIVATION` aplica los efectos y recién ahí elige el evento → `EVENT_PENDING`. Mismo patrón de fases que ya usaban `CLUB_PENDING`/`MINIGAME_PENDING`.
- `content/motivations.ts`: 12 enfoques con **tradeoffs reales** (*"Obsesión con el gol"* +4 definición/−2 pase, *"Volver al potrero"* +4 regate/−2 físico), reusando `StatEffect` para no inventar maquinaria — el reducer ya sabía aplicar esa forma. Filtrados por `minAge`/`maxAge`/`positions`, así un pibe de 19 ve *"Hambre de pibe"* y un veterano de 33 ve *"Oficio de veterano"*, verificado en el sanity check.
- **Los tradeoffs de pretemporada se muestran con números exactos**, al revés que los eventos. No es una inconsistencia: en los eventos ocultar el número es parte de la tensión (`docs/design-brief.md` lo pide explícitamente), pero la pretemporada es una decisión de build — sin ver el tradeoff no podés elegir con criterio. `lib/eventEffects.ts` expone las dos funciones y el comentario explica cuál va dónde.
- **Deuda de tests saldada:** los helpers end-to-end se rompieron por tercera vez con una fase nueva (`SELECT_CLUB` en la integración de diseño, `RESOLVE_MINIGAME` en Fase 4, `SELECT_MOTIVATION` acá). Se extrajo `resolvePendingPhase(state)` como **único lugar donde los tests saben qué fases existen** — la próxima fase que agregue un paso se suma ahí y no en cinco loops distintos.
- **13 tests nuevos** (90 en total): `motivationSelector.test.ts` (6), 4 extensiones a `contentSchema.test.ts` y 3 nuevos en `careerReducer.test.ts` (la pretemporada no toca al jugador hasta que elegís; `SELECT_MOTIVATION` aplica los efectos de verdad y pasa a `EVENT_PENDING`; los tres casos de error).
- Verificado en navegador: pretemporada con los 3 enfoques y sus tradeoffs, el elegido aplicándose y quedando visible en el hub, y **los tres minijuegos jugados de punta a punta** (se recorrieron varias carreras hasta que salieran los tres). Sin errores de consola.
- `npm run test` (90/90), `npx tsc -b --noEmit` y `npm run lint` (oxlint) corren limpios.

### Fase 6 — Supabase real: persistencia de carrera + ranking global (2026-08-18)

Alcance recortado a propósito, mismo criterio que el resto del proyecto ("no declarar una variante sin código que la llene", ver Desviaciones): de las 4 tablas que el plan de arquitectura original preveía, esta pasada construye **`careers`** y **`leaderboard_entries`** — `rivals` es Fase 7 y `legends` es Fase 8, ninguna pantalla las usa todavía.

- **Esquema aplicado vía `apply_migration`** (sin carpeta `supabase/` local, el proyecto no usa CLI — ver Stack): `careers` (`id uuid pk`, `state jsonb`, `updated_at`) con policy abierta de lectura/escritura (`using (true) with check (true)` — el `id` opaco en `localStorage` es el único "auth", mismo criterio de "sin anti-cheat" ya documentado, no es un secreto de seguridad). `leaderboard_entries` con columnas planas (alias, identidad del jugador, stats finales, títulos) + `check` de rango en cada campo numérico (mismo nivel de guardrail que el resto del proyecto), policy de `select` abierta y de `insert` abierta pero **sin policy de `update`/`delete`** — un puntaje subido es inmutable a propósito, ni el autor puede editarlo o borrarlo después.
- **Persistencia de la carrera en curso**: `lib/api/careers.ts` (`saveCareer`/`loadCareer`/`deleteCareer`), `lib/careerSession.ts` (`coperort:careerId` en `localStorage`, wrapped en try/catch por si el navegador está en modo privado o sin cuota), `hooks/useRestoreCareer.ts` (al montar `App`, si hay un id guardado intenta `loadCareer` y lo hidrata en el store antes de renderizar rutas — con un estado de carga breve). `careerStore.ts#dispatch` guarda en Supabase después de cada acción real (no en los no-ops, que devuelven la misma referencia).
- **Ranking**: `lib/api/leaderboard.ts` (`submitScore`/`fetchTopEntries`, ordenado por `peak_rating desc`), `CareerSummaryPage` gana un input de alias + botón "Subir al ranking" (un solo submit por carrera, sin forma de editarlo después — por diseño), `LeaderboardPage` reescrita como tabla real (alias, club, rating pico, PJ/GLS/AST, copas).
- **Bug real encontrado y arreglado en el navegador, no solo en el sanity check habitual**: `dispatch` guardaba con `saveCareer(next)` fire-and-forget sin encolar. Verificado con un script que corría una carrera completa (17→34 años, ~50 dispatches) disparando un `saveCareer` por acción sin esperar al anterior: al refrescar la página, el estado restaurado quedó en `ACTIVE` a los 33 años en vez de `RETIRED` a los 34 — una respuesta de red de un guardado más viejo llegó *después* que la del guardado final y "ganó" la carrera de escritura, pisando el estado más reciente en la DB sin ningún error visible. Se arregló encolando los guardados (`saveQueue = saveQueue.then(() => saveCareer(next))...` en `careerStore.ts`) para que cada `saveCareer` espere a que termine el anterior antes de salir — garantiza que las escrituras lleguen a Supabase en el mismo orden en que se dispacharon. Con acciones dispachadas una por vez desde la UI real (el patrón normal de uso) la ventana de carrera es minúscula, pero encolar no tiene downside y cierra el caso por completo.
- **Gotcha de infraestructura, no de código, documentado para no volver a perder tiempo con esto**: después de `apply_migration` reportar éxito y `list_tables` confirmar el esquema, la app seguía recibiendo `PGRST205 Could not find the table in the schema cache` en cada save/load — el schema cache de PostgREST (la capa REST que usa el cliente JS) había quedado desactualizado. `NOTIFY pgrst, 'reload schema';` (la solución estándar de la doc de Supabase) no alcanzó por sí sola; hizo falta además `select pg_notification_queue_usage();` (limpia la cola de notificaciones de Postgres que a veces bloquea que PostgREST reciba la señal — ver "PostgREST not recognizing new columns, tables, views or functions" en la doc de troubleshooting de Supabase) y esperar un rato a que el servicio recogiera el reload. `execute_sql` (consulta directa a Postgres, bypassea PostgREST) fue la herramienta clave para diagnosticar esto — confirmó que la tabla sí existía en la DB mientras la API seguía devolviendo 404, aislando el problema a la capa de caché y no al esquema en sí.
- Verificado en navegador de punta a punta: creación de carrera → refresh real de página (`navigate` con `force`, no navegación de React Router) → la carrera se restaura en vez de perderse → carrera completa hasta `RETIRED` → alias + "Subir al ranking" → `/leaderboard` muestra la entrada recién subida con los datos reales. `get_advisors` (seguridad y performance) sin alertas.
- `npm run test` (90/90 — no se tocó ningún test, es aditivo), `npx tsc -b --noEmit` y `npm run lint` (oxlint, un warning preexistente en `CountryFlag.tsx` sin relación) corren limpios.

## Pendiente (TODO)

- **Fase 3b — resto de confederaciones:** Sudamérica, Europa (7 países, ambas divisiones donde aplica) y Liga MX/MLS ya están (589 clubes, ver Progreso). Falta opcionalmente CAF/AFC/OFC — mismo método, incremental, no bloqueante.
- ~~**Pasada visual**~~ — **completa (2026-08-08).** Banderas reales en SVG (`components/ui/CountryFlag.tsx`, ~26 países CONMEBOL+Europa grande, `ColorRoundel` como fallback para el resto), escudos de club con forma/patrón por hash (`ClubCrestBadge.tsx`), patrones de camiseta (`JerseyPreview.tsx`), 8 ilustraciones SVG por categoría de evento (`EventIllustration.tsx`, reemplaza la caja rayada con texto en `EventChoiceCard`), y animación en `penaltyShootout` (la pelota viaja desde los pies hasta la zona pateada, el arquero se tira al lugar real donde terminó definiendo — antes se quedaba parado en el amague inicial aunque hubiera mentido). Todo generado por código, sin assets subidos. Verificado en navegador: carrera completa con evento ilustrado + los 3 minijuegos, sin errores de consola. `npm run test` (90/90), `tsc` y lint limpios.
- **Fase 7 — Rival:** rival por arquetipo determinístico visible en el hub de carrera.
- **Fase 8 — Pulido de portfolio:** UI de recreación de carrera por seed (feature "recreá a una leyenda", documentada — no easter egg oculto), tarjeta compartible (export a canvas/imagen), logros, personalización de apariencia más profunda, pase mobile.

## Decisiones abiertas / riesgos conocidos

- Sudamérica y Europa (7 países) ya tienen datos reales (Fase 3b); CONCACAF/CAF/AFC/OFC siguen sin cubrir, y Alemania/Francia/Portugal/Países Bajos solo tienen 1ª división por ahora. No es bloqueante, se puede sumar de forma incremental.
- Sin anti-cheat: si el proyecto gana tracción real, revisar el diseño de validación server-side por replay que está esbozado en el plan (motor puro portado a una Edge Function).
- `react-router-dom` tiene una vulnerabilidad reportada (alta severidad) específica del modo RSC (React Server Components) — no aplica a este proyecto porque es una SPA client-only sin RSC. Registrado acá para no re-investigarlo cada vez que `npm audit` lo marque.
- ~~`createCareer.ts` elige el club de debut filtrando `SAMPLE_CLUBS` por `reputation < 40`...~~ — **resuelto en la integración de diseño (2026-08-05).** `createCareer.ts` ahora usa `selectDebutClubOffers` (`engine/clubTransition.ts`), que relaja al pool completo de clubes si el filtro por reputación da menos candidatos de los pedidos, y nunca llama `pickWeighted` sobre un array vacío. `engine/leagueEngine.ts#resolveLeagueWinner` sigue filtrando por `country`+`tier` y llamando `pickWeighted` directo sin fallback — con los 274 clubes de la Fase 3b esto no es un problema práctico hoy (todos los grupos CONMEBOL tienen varios clubes), pero si se agrega un país/confederación nuevo con un solo club en algún tier, revisar si conviene el mismo tipo de relajación que ya tiene `selectClubForMove`.
- ~~**Ligas de un solo club con las 13 clubes hardcodeadas** (Argentina tier 2, Inglaterra tier 1)~~ — **Argentina resuelto en la Fase 3b Sudamérica** (38 clubes reales en tier 2). **Inglaterra resuelto en la Fase 3b Europa** (44 clubes reales entre 1ª y 2ª). Ya no queda ningún país con una liga de un solo club en los datos actuales.
- **Inflación de rating: casi toda carrera termina con un jugador de 90+.** Observado en el sanity check de la Fase 5: una carrera típica va de OVR 64 a los 17 hasta **96 a los 25**, y ahí se queda. La causa principal es previa a la Fase 5 (`attributeGrowthDelta` da +2 a +5 por atributo por temporada hasta los 21 y +1 a +3 hasta los 25, sobre un debut ya generoso); los enfoques de pretemporada suman ~+1 neto por temporada encima. **No se tocó en la Fase 5 a propósito** — rebalancear la curva de crecimiento es una decisión de diseño que invalida la nota deliberada de "Desviaciones" sobre el rating de debut, y merece medirse aparte. Importa para la Fase 8 ("recreá a una leyenda"): si todos terminan en 95, el rating deja de distinguir carreras y la comparación con leyendas pierde sentido. El lugar para tocarlo es `statMath.ts`.
- ~~**Sin persistencia de la carrera en curso.**~~ — **resuelto en la Fase 6 (2026-08-18).** `careerStore.ts` guarda en Supabase tras cada dispatch real, con el id de carrera en `localStorage`; un refresh de página restaura la carrera en vez de perderla. Ver esa entrada de Progreso para el detalle de la cola de guardado (bug de orden de escritura encontrado y arreglado) y el gotcha de schema cache de PostgREST.
