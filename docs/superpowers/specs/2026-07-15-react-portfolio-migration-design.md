# Migración a React + Vite — Paula Labs (primer proyecto en React)

## Contexto y objetivo

El sitio actual ("Paula Labs — Field Notebook") es una página de una sola vista construida con React 18 cargado por CDN y Babel Standalone transpilando JSX en el navegador, sin bundler, sin `package.json`, sin control de versiones. Funciona pero no refleja cómo se construyen proyectos React reales, y como página de CV/portafolio tiene costo de carga innecesario (React + ReactDOM + Babel completos descargados y transpilados en cada visita).

Este es, además, el primer proyecto en React de la autora, quien tiene 3 años de experiencia profesional en Angular + TypeScript. El objetivo doble del proyecto es:

1. Migrar el sitio a una base técnica estándar (Vite + React + TypeScript), manteniendo el diseño y contenido visual actuales.
2. Usar la migración como vehículo de aprendizaje real de React, contrastando cada concepto nuevo con su equivalente en Angular cuando ayude.

**Fuera de alcance:** rediseño visual o de contenido — el diseño/copy actual (secciones, estilos, tono "field notebook") se conserva, salvo por la incorporación de español en las secciones que hoy solo existen en inglés (ver más abajo).

## Modo de colaboración

Mixto: los conceptos nuevos de React (Context API, custom hooks, patrón "props down / callback up", testing con React Testing Library) se trabajan en modo guiado — la autora escribe el código, se revisa y explica el porqué. El trabajo puramente mecánico (scaffold de Vite, configuración de TypeScript, git, SSH, workflow de deploy) lo ejecuta el asistente directamente.

## 1. Setup y tooling

- **Scaffold:** Vite con template `react-ts`, dentro del directorio actual del proyecto.
- **Gestión de paquetes:** npm.
- **Testing:** Vitest + React Testing Library, agregados al scaffold.
- **Control de versiones:** repo git local, con identidad configurada **a nivel de repo** (no global, para no interferir con la configuración de trabajo existente en la máquina):
  - `user.name`: Maria Paula Vargas
  - `user.email`: mariapvargast@gmail.com
- **SSH:** key dedicada para la cuenta personal de GitHub (`~/.ssh/id_ed25519_personal`), con alias de host `github-personal` en `~/.ssh/config`, para no interferir con la key de trabajo existente en la máquina. El remoto de este repo se conecta como `git@github-personal:<usuario>/paula-labs.git`.
- **Deploy:** GitHub Pages, vía GitHub Actions (build + deploy automático en cada push a `main`). `vite.config.ts` configurado con el `base` correcto para Pages.

## 2. Estructura de carpetas

```
src/
  components/
    StatusBar.tsx
    Rail.tsx
    SiteNav.tsx
    Hero.tsx
    Operator.tsx
    Systems.tsx
    System.tsx
    viz/
      VizBlueprint.tsx
      VizArch.tsx
      VizSchema.tsx
      VizPaint.tsx
    Workbench.tsx
    Log.tsx
    Transmission.tsx
  context/
    LangContext.tsx
  hooks/
    useLang.ts
    useActiveSection.ts
  data/
    sections.ts
    heroCopy.ts
    operatorCopy.ts
    systems.ts
    stack.ts
    commits.ts
  App.tsx
  main.tsx
  styles.css
```

Se elimina el patrón de registro global (`window.Hero = Hero`, etc.) propio del setup sin bundler, en favor de imports/exports de ES modules — cada componente importa explícitamente lo que necesita.

## 3. Contenido bilingüe (EN/ES)

Alcance ampliado respecto al sitio actual: **todas** las secciones son bilingües, no solo `SiteNav` y `Hero`. Cada archivo en `data/` sigue el mismo patrón que ya usa `HERO_COPY` hoy: un objeto `{ en: {...}, es: {...} }`, y cada componente que hoy es estático (`Operator`, `Systems`, `Workbench`, `Log`, `Transmission`) pasa a consumir `useLang()` para elegir el idioma activo.

Las traducciones al español de las secciones hoy solo-en-inglés las redacta el asistente (adaptación natural, no traducción literal) y las revisa/ajusta la autora antes de darlas por definitivas — particularmente en `Operator`, por ser contenido biográfico en primera persona.

**Mejora dirigida incluida:** los ids/labels de las 6 secciones (`entry`, `operator`, `systems`, `stack`, `logbook`, `transmit`) están hoy duplicados a mano en tres lugares (`SECTIONS` en `app.jsx`, `NAV_LINKS` en `nav.jsx`, índice del colofón en `transmission.jsx`). Se unifican en un único `data/sections.ts` tipado, consumido por `Rail`, `SiteNav` y el colofón de `Transmission`. No cambia nada visualmente; solo evita que las tres listas se desincronicen a futuro.

## 4. Estado y flujo de datos

- **Idioma activo:** estado en `App.tsx` (`useState` + persistencia en `localStorage`, igual que hoy), expuesto a través de `LangContext` / `useLang()` a cualquier componente que lo necesite.
- **Sección activa (scroll):** gestionada por el custom hook `useActiveSection` (encapsula el `IntersectionObserver` que hoy vive inline en `app.jsx`), expuesta como prop simple a `StatusBar`, `Rail` y `SiteNav` — sin necesidad de Context, por ser un solo nivel de props.
- **Sistema expandido (`Systems`):** estado local (`useState`) dentro de `Systems.tsx`, con patrón props-down/callback-up hacia `System.tsx` (equivalente a `@Input`/`@Output` en Angular) para abrir/cerrar cada tarjeta.

## 5. Testing

Vitest + React Testing Library, cubriendo comportamiento, no exhaustivo:
- El toggle de idioma cambia el texto renderizado (`SiteNav`, y al menos una sección más allá de Hero).
- Abrir un `System` muestra su detalle expandido y cierra cualquier otro previamente abierto.
- `useActiveSection` marca como activa la sección visible (test del hook o de integración en `App`).

Los tests de cada componente se escriben junto con ese componente, no al final.

## 6. Secuencia de construcción

Cada paso termina con un deploy funcionando en GitHub Pages:

1. Scaffold (Vite + TS + React + Vitest), git, SSH, workflow de deploy — *mecánico*
2. `LangContext` + `useLang` + `data/sections.ts` unificado → deploy 1 (toggle EN/ES funcionando sobre página vacía) — *concepto nuevo: Context API*
3. `App` shell + `StatusBar` + `Rail` + `useActiveSection` → deploy 2 — *concepto nuevo: custom hooks, `useEffect` con cleanup*
4. `SiteNav` bilingüe → deploy 3
5. `Hero` + `data/heroCopy.ts` → deploy 4 — refuerza `useState`/`useEffect` (reloj)
6. `Operator` + traducción ES → deploy 5 — primer componente de solo presentación
7. `Systems` + `System` + visualizaciones + traducción ES → deploy 6 — *concepto nuevo: estado local + props down/callback up* + primeros tests con Testing Library
8. `Workbench` + traducción ES → deploy 7
9. `Log` + traducción ES → deploy 8
10. `Transmission` + traducción ES → deploy 9 — sitio completo

## Criterios de éxito

- El sitio migrado es visualmente idéntico al actual en inglés, y completamente funcional también en español (incluyendo las secciones antes solo-en-inglés).
- El proyecto corre con `npm run dev` (Vite) y se despliega automáticamente a GitHub Pages en cada push a `main`.
- Existe una identidad git/SSH separada de la de trabajo, funcionando en este repo.
- Hay pruebas automatizadas mínimas para el toggle de idioma, el acordeón de `Systems`, y la detección de sección activa.
- La autora puede explicar, en sus propias palabras, qué hace cada concepto nuevo introducido (Context API, custom hooks, props-down/callback-up) y cómo se compara con su equivalente en Angular.
