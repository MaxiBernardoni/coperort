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

- React 18 + TypeScript + Vite
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
  types/            # vacío todavía — tipos centrales van acá en Fase 1
  content/          # vacío todavía — JSON data-driven (eventos, clubes, leyendas) va acá en Fase 3
  engine/           # vacío todavía salvo __tests__/sanity.test.ts (verifica que Vitest anda)
  minigames/        # subcarpetas penaltyShootout/, freeKick/, dribbleChallenge/, shared/ creadas, vacías
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

Las carpetas vacías tienen un `.gitkeep` para que git las trackee hasta que tengan contenido real.

## Supabase

- Proyecto creado vía MCP: `coperort` (id `gucidoqqqkckgiahuiyd`), región `sa-east-1` (San Pablo — menor latencia para el público objetivo en Argentina/Sudamérica), tier gratuito ($0/mes).
- URL y publishable key están en `.env.local` (gitignored) y el esqueleto sin valores en `.env.example` (sí versionado).
- `src/lib/supabaseClient.ts` ya crea el cliente real apuntando a este proyecto.
- **Todavía no se aplicó ninguna migración / no hay tablas creadas.** El esquema completo (`careers`, `leaderboard_entries`, `rivals`, `legends`) está diseñado en el plan pero se aplica recién en la Fase 6, siguiendo el orden de construcción — no tiene sentido tener tablas antes de que el motor exista.

## Fuente de datos de clubes (todavía no implementado)

Decisión tomada (ver plan para el detalle completo de alternativas evaluadas): usar las listas de Wikipedia por confederación ("List of top-division football clubs in [UEFA/CONMEBOL/CONCACAF/CAF/AFC] countries" + listas de segunda división de UEFA/AFC + páginas país por país para segunda división en Sudamérica/CONCACAF/CAF) como fuente principal para `content/clubs.json`, priorizando Sudamérica y Europa primero. `openfootball` (GitHub, JSON sin key) como atajo para bootstrapear ligas europeas grandes ya estructuradas. Esto se hace en la Fase 3. **No se descargó ni procesó nada todavía.**

No se pudo confirmar cómo obtiene Copero sus propios datos de clubes (su sitio está bloqueado por el filtro de red del entorno de desarrollo y no hay documentación técnica pública) — no asumir nada al respecto si se retoma este punto.

## Progreso (Hecho)

### Fase 0 — Scaffold (2026-08-04)
- Proyecto Vite + React 19 + TypeScript scaffoldeado (`npm create vite@latest -- --template react-ts`), limpiado del boilerplate default (`App.css`, assets de ejemplo, landing page default).
- Tailwind v4 configurado vía plugin de Vite (sin config file separado).
- Vitest configurado (`environment: jsdom`, alias `@/`, setup de Testing Library) — verificado con un test de humo en `src/engine/__tests__/sanity.test.ts`.
- Estructura completa de carpetas creada según la arquitectura del plan.
- React Router armado en `App.tsx` con 6 rutas placeholder (una por pantalla del plan, sin lógica todavía).
- Proyecto de Supabase provisionado vía MCP (`coperort`, `sa-east-1`, plan gratuito) y cliente wireado en `src/lib/supabaseClient.ts`. Sin tablas todavía (eso es Fase 6).
- Git inicializado, `.gitignore` ampliado para cubrir `.env*` explícitamente además de `*.local`.
- `npm run test` y `npx tsc -b --noEmit` corren limpios, sin errores ni warnings.

## Pendiente (TODO)

Todo lo que sigue está sin empezar. Orden según el plan (`generic-sprouting-panda.md`):

- **Fase 1 — Núcleo del motor:** tipos centrales (`src/types/*`), `engine/rng.ts` (PRNG con seed, mulberry32), `engine/createCareer.ts`, `engine/statMath.ts`, `engine/careerReducer.ts` (solo `CREATE_CAREER` + `ADVANCE_SEASON` por ahora), eventos mínimos hardcodeados para poder testear. Objetivo: una carrera completa corre hasta el retiro desde un test, de forma determinística dado un seed.
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
