# Coperort

Simulador de carrera de futbolista para navegador — creás un jugador, tomás decisiones temporada a temporada, definís finales de torneo con minijuegos interactivos y competís en un ranking global.

Proyecto personal / de portfolio, inspirado en dos juegos virales argentinos investigados a fondo antes de empezar a construir: **[Copero: Convertite en Leyenda](https://www.copero.com.ar/juegos/simulador-carrera)** (creación de jugador rica, progresión narrativa) y **[El Ídolo](https://www.potrerofutbol.ar/el-idolo)** (minijuegos en las finales, rival fijo, ranking global). La idea acá es combinar y mejorar ambos.

> **¿Sos una IA / Claude Code retomando este proyecto?** Leé [`CLAUDE.md`](./CLAUDE.md) primero — tiene todo el contexto de arquitectura, decisiones de producto, progreso por fase y qué falta, pensado específicamente para vos.

## Stack

React 19 + TypeScript + Vite · Tailwind CSS v4 · Zustand · React Router · Zod · Vitest · Supabase (Postgres, sin auth)

## Estado actual

- ✅ **Fase 0** — Scaffold del proyecto, routing base, Supabase provisionado.
- ✅ **Fase 1** — Motor de simulación de carrera (puro, sin React), determinístico por seed. 11 tests en Vitest.
- ⬜ Fase 2 en adelante — ver [`CLAUDE.md`](./CLAUDE.md#pendiente-todo) para el detalle completo del roadmap.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar con las credenciales de tu proyecto Supabase
npm run dev                  # levanta el server de dev en http://localhost:5173
npm run test                 # corre la suite de Vitest
npm run lint                 # oxlint
npm run build                # type-check + build de producción
```
