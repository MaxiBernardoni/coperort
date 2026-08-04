# Prompt de diseño — coperort

> Este documento es un prompt autocontenido pensado para pasarle a una sesión de Claude enfocada en diseño ("Claude design"). No asume que quien lo lea tiene contexto previo de la conversación donde se armó — todo lo necesario está acá. Se actualiza a medida que el proyecto agrega pantallas nuevas que necesiten diseño; no es un documento de una sola vez.
>
> Contexto técnico completo del proyecto (motor, decisiones de producto, estado de cada fase): `CLAUDE.md` en la raíz del repo.

## Tu tarea

Diseñar la identidad visual y las pantallas de **coperort**, un juego web de simulación de carrera de futbolista. Hoy las pantallas existen y funcionan (React + TypeScript + Tailwind CSS v4), pero tienen un estilo mínimo y genérico — bordes neutros, sin paleta, sin tipografía propia, sin ningún elemento que lo haga sentir un juego de fútbol. Necesitan una pasada de diseño real: paleta de color, tipografía, sistema de componentes (cards, botones, barras de atributos, inputs) y la aplicación de todo eso a cada pantalla.

**No** se está pidiendo tocar la lógica de negocio ni el estado (eso ya está resuelto en `src/engine/`, `src/store/`, `src/hooks/`) — el pedido es puramente visual/UX sobre las pantallas y componentes existentes, más los lineamientos para las pantallas que todavía no se construyeron.

## Qué es el juego

Simulación de carrera de futbolista, inspirada en dos juegos virales argentinos:

- **Copero: Convertite en Leyenda** (copero.com.ar) — creación de jugador rica, progresión narrativa por decisiones cada cierta cantidad de años, resumen final compartible.
- **El Ídolo** (potrerofutbol.ar) — +300 eventos aleatorios, sistema RPG de pretemporada, rival fijo, finales de torneo resueltas con minijuegos interactivos, ranking global.

coperort combina y mejora ambos: prioriza minijuegos interactivos para instancias de torneo y competencia social (ranking global + rival), sobre una base de creación de personaje más profunda. No tenemos capturas ni análisis visual detallado de esos dos juegos disponibles en este momento — no asumas su paleta o tipografía específica, pero sí su espíritu: **cultura futbolera argentina/sudamericana, informal, pasional, de potrero.** No es un juego corporativo ni una simulación tipo FIFA Manager seria — es más cercano a un juego viral de WhatsApp/Instagram que a un simulador serio.

## Público objetivo

Jugadores casuales, mayormente jóvenes, mayormente en Argentina/Sudamérica, mayormente en celular (aunque hoy se juega en desktop en desarrollo — pensar mobile-first es lo correcto). Sesiones cortas, ganas de compartir resultados con amigos.

## Referencia visual concreta (el estilo objetivo)

El usuario compartió dos capturas de un juego de referencia (mismo género — creación de jugador + hub de carrera de fútbol) como el estilo que quiere para coperort. Como este documento es texto y las capturas no viajan con él, acá va la descripción detallada de ambas para que el diseño pueda ejecutarse sin verlas directamente. **Tratar esto como la referencia visual primaria del proyecto, por encima de cualquier otra suposición de estilo hecha en secciones anteriores de este documento.**

**Estética general:**
- Tema oscuro comprometido — fondo casi negro (no gris oscuro tipo "dark mode de sistema", sino un negro profundo, casi puro), no un tema claro con inversión. Esto probablemente signifique **dark-first o directamente dark-only** para este proyecto, en vez del "funciona en light y dark" asumido más abajo — decidilo como parte del entregable, pero el default fuerte de la referencia es oscuro.
- Texto blanco de alto contraste para títulos y datos importantes; textos secundarios en gris claro/medio.
- Cards y contenedores con esquinas redondeadas (radio moderado, ni muy sutil ni tipo "burbuja"), bordes muy sutiles o directamente sin borde (se separan por diferencia de tono de fondo, no por líneas).
- Metáfora visual central: la **tarjeta de jugador estilo FIFA Ultimate Team** — rating grande en un badge de color, bandera del país, posición como pill de color.
- Paleta de acento: **naranja/ámbar** para el rating principal (badge "OVR"), **rojo/rosa** para el badge de posición+número, **verde** para la cancha/campo de juego. Estos tres acentos conviven sobre el fondo negro.
- Tipografía: sans-serif geométrica/condensada para números grandes (rating, valores), bien legible en tamaños chicos para las etiquetas en mayúscula (labels tipo "EDAD", "VALOR", "PJ" van en caps, tracking amplio, tamaño chico, color gris apagado — un patrón que se repite en toda la interfaz: **label chico en mayúsculas arriba, valor grande y bold abajo**).

**Captura 1 — Creación de jugador, layout de 3 columnas:**
- **Columna izquierda ("Identidad"):** una camiseta de fútbol ilustrada (no foto, gráfico limpio con sombra suave) con el nombre del jugador y el número estampados atrás, como si fuera la casaca real que va a usar. Debajo de la camiseta, dos mini-tarjetas lado a lado con el patrón label-arriba/valor-abajo para "Apellido" y "Número". Debajo, un selector de pierna hábil como **segmented control** (dos opciones en una píldora, la opción activa tiene fondo blanco sólido y texto oscuro, la inactiva es transparente con texto blanco).
- **Columna central ("Nacionalidad"):** un buscador de país con ícono de lupa y placeholder "Buscar país", debajo una lista en grilla de 2 columnas de países con **bandera (ícono redondeado) + nombre**, scrolleable. El país seleccionado tiene un borde resaltado y un check a la derecha.
- **Columna derecha ("Posición"):** una **cancha de fútbol ilustrada de arriba hacia abajo** (verde, con líneas de cancha — círculo central, área) con las posiciones de una formación (ej. 4-3-3) puestas como pills chicos sobre la cancha en el lugar táctico correspondiente (POR abajo/arquero, línea de DFC/LI/LD, línea de MCD, línea de MI/MC/MD, MCO, EI/ED, DC arriba) — elegís la posición tocando directamente el lugar en la cancha, no un dropdown de texto.

**Captura 2 — Hub de carrera / selección de club, layout de 2 columnas:**
- **Columna izquierda:** arriba, la tarjeta de jugador — badge cuadrado redondeado grande con el **rating (OVR)** en número grande sobre fondo de color (naranja en el rating visto, probablemente el color cambia según el rango del rating tipo escalera de tiers — bronce/plata/oro/naranja como en los juegos FIFA), al lado la bandera del país y un pill rojo/rosa con posición + número (ej. "#10 DC"), debajo el estado del jugador ("Libre" = sin club todavía, con un ícono de info), y a la derecha de todo eso, alineado a la derecha, "EDAD" y "VALOR" con el mismo patrón label/valor. Debajo, una fila de 3 stats (partidos jugados, goles, asistencias) cada uno con un ícono chico + número grande + label chico. Debajo, una sección de "vitrina de trofeos" con estado vacío ilustrado (ícono de trofeo apagado + texto "VITRINA VACÍA") — un buen detalle de empty state a replicar en otras secciones vacías del juego. Más abajo, la sección de **oferta de clubes**: texto de contexto ("Tres clubes quieren sumarte a su proyecto juvenil. Elegí dónde empieza tu carrera.") y tarjetas de club una al lado de la otra, cada una con: label chico "Fichar por [Nombre]", el **escudo del club** como imagen central, y debajo el nombre de la liga/categoría del club como badge (ej. "Liga Profesional", "Primera Nacional").
- **Columna derecha:** una **tabla/timeline vertical de toda la carrera**, con columnas EDAD / CLUB / OVR / PJ / GLS / AST, una fila por checkpoint de edad (se ve cada 2 años: 16, 18, 20, 22...36). La fila de la edad actual está resaltada con fondo propio y el rating en un pill naranja; las filas futuras aparecen atenuadas/grises como placeholder de lo que todavía no pasó. Da la sensación de "ver toda la carrera de un vistazo, completándose a medida que jugás".

**Qué de esto es directamente aplicable hoy vs. qué implica trabajo adicional fuera del diseño puro:**
- El sistema de color (negro + naranja + rojo/rosa + verde), la tipografía, el patrón label/valor, el segmented control, la búsqueda de país con banderas, y el rediseño de la tarjeta de jugador en el hub → aplicables directamente sobre las pantallas y datos que ya existen.
- La cancha interactiva para elegir posición → aplicable (position ya es un campo simple: GK/DEF/MID/FWD), aunque probablemente haya que simplificar la formación de la referencia (que muestra ~10 sub-posiciones tácticas) a las 4 posiciones que maneja el motor hoy, o decidir si vale la pena que el motor distinga sub-posiciones más adelante — **eso es una decisión de producto, no de diseño, dejarla marcada como pregunta abierta en el entregable, no resolverla por tu cuenta**.
- El timeline de carrera completa (columna derecha de la captura 2) es el más lindo de los patrones pero **hoy el motor no guarda ese historial por temporada** — `CareerState.stats` es acumulado (un total, no un desglose por edad) y `eventLog` solo guarda `{season, eventId, choiceId}`, sin overall/club/stats de cada temporada. Documentar este patrón como el objetivo de diseño para el hub está bien, pero implementarlo tal cual requiere que el motor empiece a loguear un snapshot por temporada — anotalo como dependencia para que quede claro que no es solo un cambio visual.
- Los escudos de clubes reales como imagen — hoy no hay ningún asset de club (`content/clubs.ts` es solo texto: id/nombre/país/tier/reputación, sin imagen). Si el diseño depende de escudos reales, hay que decidir cómo se consiguen (¿se generan? ¿se ilustran genéricos por las iniciales del club, tipo un avatar con las primeras letras, mientras no haya arte real?).

## Stack técnico y restricciones para el diseño

- **React 19 + TypeScript + Vite.** Componentes funcionales, sin librería de componentes UI (no hay Material UI, Chakra, shadcn, etc. instalado).
- **Tailwind CSS v4** vía `@tailwindcss/vite` — **no hay `tailwind.config.js`**. Todo el theming (colores custom, fuentes, radios, etc.) vive como CSS puro con `@theme` dentro de `src/index.css`, que hoy solo tiene:
  ```css
  @import "tailwindcss";

  :root {
    color-scheme: light dark;
  }

  body {
    margin: 0;
    font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
  }
  ```
  Cualquier propuesta de paleta/tipografía debería traducirse a variables `@theme` en este archivo (o a clases utilitarias de Tailwind directamente en los componentes) — no a un `tailwind.config.js` nuevo, ese approach ya se descartó al scaffoldear.
- **Hoy el CSS declara `color-scheme: light dark`**, pero la referencia visual (ver sección de arriba) es un tema oscuro comprometido. Definir en el entregable si el juego pasa a ser dark-only (más simple, más fiel a la referencia) o si mantiene un tema claro equivalente — si es lo segundo, el tema claro no está definido en ningún lado todavía, hay que diseñarlo desde cero, no solo invertir el oscuro.
- **Sin librería de iconos instalada todavía.** Si el diseño pide iconos, hay que elegir una librería (ej. lucide-react, que es liviana y common con Tailwind) o usar SVGs inline — decidilo como parte del entregable.
- **Sin imágenes/assets propios todavía** (ni escudos de clubes, ni ilustraciones, ni avatares de jugador). Si el diseño depende de arte, hay que decidir si se genera, se ilustra con CSS/SVG, o se deja como placeholder documentado.
- Los componentes actuales usan clases de Tailwind inline directamente en el JSX (no hay capa de componentes de diseño reutilizables tipo `<Button>`, `<Card>`) — está bien proponer extraer esos si el sistema de diseño lo justifica, pero no es obligatorio.

## Pantallas que ya existen y funcionan (necesitan la pasada de diseño)

Todas montadas vía React Router en `src/App.tsx`. El diseño se aplica sobre datos reales del motor, no mockeados — los campos que se listan abajo son literalmente los que hay disponibles en cada pantalla hoy.

### 1. Creación de jugador — `/` — `src/features/characterCreation/CharacterCreationPage.tsx`
Formulario de alta de un jugador de 17 años. Campos: nombre, apellido, nacionalidad (texto libre), posición (arquero/defensor/mediocampista/delantero), pierna hábil (derecha/izquierda/ambidiestro), número de camiseta (1-99). Botón "Empezar carrera". Es la primera pantalla que ve cualquier usuario — tiene que transmitir de entrada el tono del juego.

### 2. Hub de carrera — `/hub` — `src/features/careerHub/CareerHubPage.tsx`
La pantalla central del loop de juego, a la que se vuelve todas las temporadas. Muestra:
- Identidad: nombre completo, posición, nacionalidad, número de camiseta, pierna hábil.
- Rating general (1-99, como un FIFA card).
- Edad, número de temporada, club actual, valor de mercado.
- Los 7 atributos del jugador (ritmo, definición, pase, regate, defensa, físico, atajada), cada uno 1-99 — hoy son barras simples.
- Estadísticas acumuladas de la carrera: partidos, goles, asistencias.
- Botón "Avanzar temporada" (la acción principal, se usa una vez por temporada).

Esta es probablemente la pantalla que más beneficio saca de un buen diseño — es donde el jugador pasa más tiempo. Pensar en algo con lenguaje visual de "tarjeta de jugador de fútbol" (rating grande, escudo del club, barras de atributos) le queda natural al género.

### 3. Evento de temporada — `/event` — `src/features/seasonEvent/SeasonEventPage.tsx`
Aparece una vez por temporada, entre avanzar temporada y volver al hub. Muestra el texto de un evento narrativo (categoría: entrenamiento, transferencia, préstamo, lesión, alimentación, escándalo, prensa, personal) y 2 opciones para elegir, cada una con consecuencias distintas en los atributos o el valor de mercado. Es una decisión narrativa tipo "elegí tu propia aventura" — el diseño debería transmitir que la elección importa (sin revelar los números exactos del efecto, eso es intencional, es parte de la tensión del juego).

### 4. Resumen de carrera — `/summary` — `src/features/careerSummary/CareerSummaryPage.tsx`
Se llega acá cuando el jugador se retira (edad ≥ retirementAge, 34-38). Hoy muestra edad de retiro, partidos/goles/asistencias totales, rating pico, valor de mercado pico, y un link para empezar de nuevo. **Ojo:** esta pantalla todavía es un build parcial — el diseño final completo (comparación con leyendas reales, tarjeta compartible exportable a imagen, envío de alias a un ranking) es una fase posterior del proyecto (ver más abajo). Para esta ronda de diseño, tratarla como la pantalla de cierre de una carrera, sin el flujo de ranking todavía.

## Pantallas que todavía no existen (para que el sistema de diseño las contemple, no para diseñarlas al detalle todavía)

No hace falta maquetarlas pixel-perfect ahora, pero el sistema de diseño (paleta, tipografía, componentes base) debería poder estirarse a esto sin reinventarse:

- **Minijuegos interactivos** (penales, tiros libres, gambeta) — pantallas de juego en tiempo real, más dinámicas que el resto, probablemente necesiten su propio lenguaje visual dentro del mismo sistema.
- **Leaderboard / ranking global** — tabla de puntajes con alias de usuario.
- **Rival** — un jugador rival con su propia progresión, visible embebido en el hub.
- **Tarjeta compartible** — export a imagen del resumen final de carrera, pensada para compartir en redes/WhatsApp.

## Qué se espera como entregable

1. **Sistema de diseño base**, siguiendo la referencia visual descripta arriba: paleta de color (negro + naranja/ámbar + rojo/rosa + verde como punto de partida, decidir si hay tema claro o es dark-only), tipografía (family + escala, con el patrón label-caps-chico/valor-grande-bold), radios/espaciados, y cómo se traduce todo eso a `@theme` en `src/index.css` o a utilidades de Tailwind.
2. **Componentes reutilizables** que se repiten entre pantallas: tarjeta/stat tile con el patrón label/valor, barra de atributo, botón primario/secundario, segmented control (como el de pierna hábil), card de evento con sus opciones, badge de rating por tier de color, empty state (como "vitrina vacía").
3. **Aplicación a las 4 pantallas existentes** (creación, hub, evento, resumen) con el contenido real descripto arriba — no lorem ipsum. Para creación y hub, tomar como objetivo explícito los layouts de las dos capturas de referencia (3 columnas con camiseta+búsqueda de país+cancha interactiva; tarjeta de jugador+stats+ofertas de club+timeline de carrera), adaptados a los datos y campos que realmente expone el motor hoy.
4. Una nota sobre cómo debería escalar el sistema a las pantallas futuras (minijuegos, leaderboard, rival, tarjeta compartible), aunque no se maqueten todavía.
5. Una lista explícita de qué del diseño propuesto requiere trabajo fuera de lo puramente visual (cambios de datos/motor, assets que no existen) para que no se pierda en la implementación — ver los puntos marcados en "Referencia visual concreta" como piso mínimo de esa lista.

## Qué evitar

- No proponer una librería de componentes pesada (Material UI, Ant Design, etc.) — no está instalada y agregarla es una decisión de arquitectura que excede el pedido de diseño.
- No asumir assets que no existen (escudos reales de clubes, fotos de jugadores) sin dejarlo explícitamente como pendiente/placeholder.
- No perder de vista mobile — el público objetivo juega principalmente desde el celular.
