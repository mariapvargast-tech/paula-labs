# React + Vite Portfolio Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Paula Labs from a CDN/Babel-standalone React site into a Vite + React + TypeScript project with full EN/ES bilingual coverage, deployed to GitHub Pages via GitHub Actions.

**Architecture:** Component tree under `src/components/`, section content/copy under `src/data/` (each bilingual, `{ en, es }`), language state via `src/context/LangContext.tsx` + `src/hooks/useLang.ts`, active-section tracking via `src/hooks/useActiveSection.ts`. `App.tsx` owns top-level state (lang, active section) and composes everything.

**Tech Stack:** Vite (`react-ts` template), React, TypeScript, Vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, GitHub Actions (`actions/upload-pages-artifact` + `actions/deploy-pages`).

## Global Constraints

- Visual design and English copy are preserved exactly as they exist today — no redesign (per spec).
- All sections become bilingual (`{ en, es }` data shape), not just Nav/Hero (per spec §3).
- Spanish translations for Operator, Systems, Workbench, Log, Transmission are drafted in this plan and must be reviewed by the project owner before being considered final — flag this explicitly when the relevant task is executed.
- `data/sections.ts` is the single source of truth for section ids/labels, consumed by `Rail`, `SiteNav`, and `Transmission`'s colophon index (per spec §3).
- git identity for this repo: `user.name "Maria Paula Vargas"`, `user.email "mariapvargast@gmail.com"` (already configured locally, not global).
- git remote uses the SSH host alias `github-personal` (already configured and verified).
- Deploy target: GitHub Pages **project site** at `https://mariapaulav03.github.io/paula-labs/`, repo name `paula-labs`, Vite `base: '/paula-labs/'`.
- Package manager: npm. Components use named exports (`export function X()`), not default exports.
- Tests are co-located with the code they test (`Component.test.tsx` next to `Component.tsx`), and are written as part of the same task that introduces the behavior — never deferred to a later task.
- React/Vite/TypeScript dependency versions are whatever `npm create vite@latest -- --template react-ts` resolves at scaffold time — no manual version pinning.

---

## Task 1: Vite + TypeScript scaffold, Vitest setup, folder structure

**Mode:** Mechanical.

**Files:**
- Create (via official scaffold, then moved into place): `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `.gitignore`, `src/main.tsx`, `src/vite-env.d.ts`, `src/App.tsx` (placeholder), `src/test/setup.ts`, `src/test/setup.test.tsx`
- Modify: move `styles.css` → `src/styles.css`
- Delete: `Paula Labs.html` (superseded by generated `index.html`)
- Keep untouched for now (superseded task-by-task later): `i18n.jsx`, `nav.jsx`, `hero.jsx`, `operator.jsx`, `artifacts.jsx`, `workbench.jsx`, `log.jsx`, `transmission.jsx`, `app.jsx`

**Interfaces:**
- Produces: a working `npm run dev`, `npm run build`, `npm run test` pipeline; `src/styles.css` importable at `./styles.css` from `src/`; a placeholder `export function App()` in `src/App.tsx` that later tasks will replace.

- [ ] **Step 1: Scaffold into a temporary sibling directory**

Run these from the project root (the directory containing this repo's `.git` — confirm with `git rev-parse --show-toplevel` first; do not assume a literal path, since this plan may run inside a worktree):

```bash
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
SCAFFOLD_DIR="$(mktemp -d)/paula-labs-scaffold"
npm create vite@latest "$SCAFFOLD_DIR" -- --template react-ts
```

Expected: output ending in `Done. Now run:` with no interactive prompts (target dir didn't exist).

- [ ] **Step 2: Move generated files into the project root**

```bash
mv "$SCAFFOLD_DIR"/.gitignore "$PROJECT_ROOT"/.gitignore
mv "$SCAFFOLD_DIR"/package.json "$PROJECT_ROOT"/package.json
mv "$SCAFFOLD_DIR"/tsconfig.json "$PROJECT_ROOT"/tsconfig.json
mv "$SCAFFOLD_DIR"/tsconfig.app.json "$PROJECT_ROOT"/tsconfig.app.json
mv "$SCAFFOLD_DIR"/tsconfig.node.json "$PROJECT_ROOT"/tsconfig.node.json
mv "$SCAFFOLD_DIR"/vite.config.ts "$PROJECT_ROOT"/vite.config.ts
mv "$SCAFFOLD_DIR"/index.html "$PROJECT_ROOT"/index.html
mv "$SCAFFOLD_DIR"/public "$PROJECT_ROOT"/public
mv "$SCAFFOLD_DIR"/src "$PROJECT_ROOT"/src
rm -rf "$(dirname "$SCAFFOLD_DIR")"
```

Note: `$PROJECT_ROOT` already has a `.gitignore` (created when the legacy site files were committed, containing `.claude/`) — the `mv` above overwrites it with the scaffold's version. Immediately after, re-add the `.claude/` line so worktree state stays ignored:

```bash
echo ".claude/" >> "$PROJECT_ROOT"/.gitignore
```

- [ ] **Step 3: Remove the legacy entry HTML and move styles.css into src/**

```bash
cd "$PROJECT_ROOT"
rm "Paula Labs.html"
rm -rf src/assets src/App.css src/index.css
mv styles.css src/styles.css
```

- [ ] **Step 4: Edit `index.html` head to match the original site's meta/fonts**

Replace the generated `<head>` contents with:

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Paula Vargas · Paula Labs — Field Notebook, Vol. VIII</title>
<meta name="description" content="Frontend engineer based in Bogotá, Colombia. Angular, TypeScript, Firebase, microfrontends. Field notebook of real, shipped work.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Keep the generated `<div id="root"></div>` and `<script type="module" src="/src/main.tsx"></script>` lines as-is.

- [ ] **Step 5: Write placeholder `src/App.tsx`**

```tsx
export function App() {
  return <div>Paula Labs — scaffold OK</div>;
}
```

- [ ] **Step 6: Write `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 7: Install dependencies and add Vitest + Testing Library**

```bash
npm install
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 8: Add test config to `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/paula-labs/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
```

- [ ] **Step 9: Write `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';

class NoopIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = NoopIntersectionObserver as unknown as typeof IntersectionObserver;
}
```

- [ ] **Step 10: Add npm scripts to `package.json`**

Add/confirm these entries under `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 11: Write the harness smoke test — `src/test/setup.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('testing harness', () => {
  it('renders text into the DOM', () => {
    render(<p>harness ok</p>);
    expect(screen.getByText('harness ok')).toBeInTheDocument();
  });
});
```

- [ ] **Step 12: Run the test to verify the harness works**

Run: `npm run test`
Expected: `1 passed`, no errors about jsdom or IntersectionObserver.

- [ ] **Step 13: Verify the build pipeline**

Run: `npm run build`
Expected: succeeds, creates `dist/` with no TypeScript errors.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript + Vitest"
```

---

## Task 2: GitHub repo, remote, and Actions deploy workflow

**Mode:** Mechanical.

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm run build` from Task 1 (produces `dist/`).
- Produces: automatic deploy to GitHub Pages on every push to `main`.

- [ ] **Step 1: Create the GitHub repo (manual, user)**

On github.com under the **mariapaulav03** account, create a new **empty** repository named `paula-labs` — no README, no `.gitignore`, no license (the local repo already has content).

- [ ] **Step 2: Add the remote and push**

```bash
cd /Users/vargast/Projects/paula-labs
git remote add origin git@github-personal:mariapaulav03/paula-labs.git
git push -u origin main
```

Expected: push succeeds, branch `main` tracks `origin/main`.

- [ ] **Step 3: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Enable Pages in repo settings (manual, user)**

On GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions**.

- [ ] **Step 5: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy to GitHub Pages via Actions on push to main"
git push
```

- [ ] **Step 6: Verify the deploy**

On GitHub: Actions tab → confirm the `Deploy to GitHub Pages` workflow run succeeds. Visit `https://mariapaulav03.github.io/paula-labs/` and confirm the placeholder "Paula Labs — scaffold OK" text renders.

---

## Task 3: Shared types + unified `data/sections.ts`

**Mode:** Mechanical (data modeling, no new React concept).

**Files:**
- Create: `src/types.ts`, `src/data/sections.ts`, `src/data/sections.test.ts`

**Interfaces:**
- Produces:
  - `type Lang = 'en' | 'es'` (in `src/types.ts`)
  - `interface SectionMeta { id: string; number: string; railTitle: Record<Lang, string>; navLabel?: Record<Lang, string>; colophonLabel: Record<Lang, string> }` (in `src/data/sections.ts`)
  - `const SECTIONS: SectionMeta[]` (in `src/data/sections.ts`)

- [ ] **Step 1: Write `src/types.ts`**

```ts
export type Lang = 'en' | 'es';
```

- [ ] **Step 2: Write the failing test — `src/data/sections.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { SECTIONS } from './sections';

describe('SECTIONS', () => {
  it('has exactly the six site sections in order', () => {
    expect(SECTIONS.map((s) => s.id)).toEqual([
      'entry',
      'operator',
      'systems',
      'stack',
      'logbook',
      'transmit',
    ]);
  });

  it('has bilingual railTitle and colophonLabel for every section', () => {
    for (const s of SECTIONS) {
      expect(s.railTitle.en).toBeTruthy();
      expect(s.railTitle.es).toBeTruthy();
      expect(s.colophonLabel.en).toBeTruthy();
      expect(s.colophonLabel.es).toBeTruthy();
    }
  });

  it('has a bilingual navLabel for every section except entry', () => {
    for (const s of SECTIONS) {
      if (s.id === 'entry') {
        expect(s.navLabel).toBeUndefined();
      } else {
        expect(s.navLabel?.en).toBeTruthy();
        expect(s.navLabel?.es).toBeTruthy();
      }
    }
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test -- sections`
Expected: FAIL with "Cannot find module './sections'"

- [ ] **Step 4: Write `src/data/sections.ts`**

```ts
import type { Lang } from '../types';

export interface SectionMeta {
  id: string;
  number: string;
  railTitle: Record<Lang, string>;
  navLabel?: Record<Lang, string>;
  colophonLabel: Record<Lang, string>;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'entry',
    number: '§01',
    railTitle: { en: 'FIELD ENTRY', es: 'ENTRADA DE CAMPO' },
    colophonLabel: { en: 'Field entry', es: 'Entrada de campo' },
  },
  {
    id: 'operator',
    number: '§02',
    railTitle: { en: 'OPERATOR', es: 'OPERADORA' },
    navLabel: { en: './about', es: './acerca' },
    colophonLabel: { en: 'Operator', es: 'Operadora' },
  },
  {
    id: 'systems',
    number: '§03',
    railTitle: { en: 'ACTIVE SYSTEMS', es: 'SISTEMAS ACTIVOS' },
    navLabel: { en: './systems', es: './sistemas' },
    colophonLabel: { en: 'Active systems', es: 'Sistemas activos' },
  },
  {
    id: 'stack',
    number: '§04',
    railTitle: { en: 'CURRENT STACK', es: 'STACK ACTUAL' },
    navLabel: { en: './stack', es: './stack' },
    colophonLabel: { en: 'Current stack', es: 'Stack actual' },
  },
  {
    id: 'logbook',
    number: '§05',
    railTitle: { en: 'LOGBOOK', es: 'BITÁCORA' },
    navLabel: { en: './log', es: './log' },
    colophonLabel: { en: 'Logbook', es: 'Bitácora' },
  },
  {
    id: 'transmit',
    number: '§06',
    railTitle: { en: 'TRANSMISSION', es: 'TRANSMISIÓN' },
    navLabel: { en: './contact', es: './contacto' },
    colophonLabel: { en: 'Transmission', es: 'Transmisión' },
  },
];
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- sections`
Expected: `3 passed`

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/data/sections.ts src/data/sections.test.ts
git commit -m "feat: add shared Lang type and unified section metadata"
```

---

## Task 4: `LangContext` + `useLang` hook

**Mode:** Guided — new concept: Context API (closest Angular equivalent: a singleton service provided via DI).

**Files:**
- Create: `src/context/LangContext.tsx`, `src/hooks/useLang.ts`, `src/hooks/useLang.test.tsx`

**Interfaces:**
- Consumes: `Lang` from `src/types.ts` (Task 3).
- Produces:
  - `interface LangContextValue { lang: Lang; setLang: (lang: Lang) => void }`
  - `const LangContext: React.Context<LangContextValue>`
  - `function useLang(): LangContextValue`

- [ ] **Step 1: Write the failing test — `src/hooks/useLang.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangContext } from '../context/LangContext';
import { useLang } from './useLang';

function Probe() {
  const { lang } = useLang();
  return <span data-testid="lang">{lang}</span>;
}

describe('useLang', () => {
  it('reads the lang value from the nearest LangContext.Provider', () => {
    render(
      <LangContext.Provider value={{ lang: 'es', setLang: vi.fn() }}>
        <Probe />
      </LangContext.Provider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('es');
  });

  it('defaults to "en" when no provider is present', () => {
    render(<Probe />);
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- useLang`
Expected: FAIL with "Cannot find module '../context/LangContext'"

- [ ] **Step 3: Write `src/context/LangContext.tsx`**

```tsx
import { createContext } from 'react';
import type { Lang } from '../types';

export interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
});
```

- [ ] **Step 4: Write `src/hooks/useLang.ts`**

```ts
import { useContext } from 'react';
import { LangContext } from '../context/LangContext';

export function useLang() {
  return useContext(LangContext);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- useLang`
Expected: `2 passed`

- [ ] **Step 6: Commit**

```bash
git add src/context/LangContext.tsx src/hooks/useLang.ts src/hooks/useLang.test.tsx
git commit -m "feat: add LangContext and useLang hook"
```

---

## Task 5: `useActiveSection` hook

**Mode:** Guided — new concept: custom hooks, `useEffect` cleanup, wrapping a browser API (`IntersectionObserver`).

**Files:**
- Create: `src/hooks/useActiveSection.ts`, `src/hooks/useActiveSection.test.tsx`

**Interfaces:**
- Produces: `function useActiveSection(sectionIds: string[], initial: string): readonly [string, (id: string) => void]`

- [ ] **Step 1: Write the failing test — `src/hooks/useActiveSection.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useActiveSection } from './useActiveSection';

let observerCallback: IntersectionObserverCallback;

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds: ReadonlyArray<number> = [];
}

function TestComponent() {
  const [active] = useActiveSection(['a', 'b'], 'a');
  return <div data-testid="active">{active}</div>;
}

describe('useActiveSection', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver as unknown as typeof IntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts at the initial section id', () => {
    render(
      <>
        <div id="a" />
        <div id="b" />
        <TestComponent />
      </>
    );
    expect(screen.getByTestId('active')).toHaveTextContent('a');
  });

  it('updates the active id when a section intersects above the threshold', () => {
    render(
      <>
        <div id="a" />
        <div id="b" />
        <TestComponent />
      </>
    );

    act(() => {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.5,
            target: { id: 'b' },
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByTestId('active')).toHaveTextContent('b');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- useActiveSection`
Expected: FAIL with "Cannot find module './useActiveSection'"

- [ ] **Step 3: Write `src/hooks/useActiveSection.ts`**

```ts
import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[], initial: string) {
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: [0.3, 0.6] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return [active, setActive] as const;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- useActiveSection`
Expected: `2 passed`

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useActiveSection.ts src/hooks/useActiveSection.test.tsx
git commit -m "feat: add useActiveSection custom hook"
```

---

## Task 6: App shell — `StatusBar`, `Rail`, `App` — Deploy 1

**Mode:** Guided — wiring the Context provider (state lives in `App`, consumed via `useLang` in children) and the custom hook together.

**Files:**
- Create: `src/components/StatusBar.tsx`, `src/components/StatusBar.test.tsx`, `src/components/Rail.tsx`, `src/components/Rail.test.tsx`
- Modify: `src/App.tsx` (replace placeholder), `src/main.tsx` (no change needed, already imports `App`)

**Interfaces:**
- Consumes: `useLang` (Task 4), `useActiveSection` (Task 5), `SECTIONS`/`SectionMeta` (Task 3).
- Produces: `export function StatusBar({ active }: { active: string })`, `export function Rail({ active, onNavigate }: { active: string; onNavigate: (id: string) => void })`, `export function App()`.

- [ ] **Step 1: Write the failing test — `src/components/StatusBar.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangContext } from '../context/LangContext';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('shows the English availability label when lang is en', () => {
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <StatusBar active="entry" />
      </LangContext.Provider>
    );
    expect(screen.getByText('OPEN FOR WORK')).toBeInTheDocument();
  });

  it('shows the Spanish availability label when lang is es', () => {
    render(
      <LangContext.Provider value={{ lang: 'es', setLang: vi.fn() }}>
        <StatusBar active="entry" />
      </LangContext.Provider>
    );
    expect(screen.getByText('DISPONIBLE')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- StatusBar`
Expected: FAIL with "Cannot find module './StatusBar'"

- [ ] **Step 3: Write `src/components/StatusBar.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { useLang } from '../hooks/useLang';

interface StatusBarProps {
  active: string;
}

export function StatusBar({ active }: StatusBarProps) {
  const { lang } = useLang();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'America/Bogota' });
  const path = '~/paula.labs/' + active;

  return (
    <div className="status-bar">
      <div className="l">
        <span className="cell"><span className="pulse"></span> <b>PAULA.VARGAS</b></span>
        <span className="cell hide-xs">PATH <b>{path}</b></span>
        <span className="cell hide-sm">VOL. <b>VIII</b></span>
        <span className="cell hide-sm">REV. <b>2026.05</b></span>
      </div>
      <div className="r">
        <span className="cell hide-sm">BOGOTÁ</span>
        <span className="cell">●REC <b style={{ color: 'var(--amber)' }}>{time}</b></span>
        <span className="cell hide-xs" style={{ color: 'var(--green)' }}>
          ● {lang === 'en' ? 'OPEN FOR WORK' : 'DISPONIBLE'}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- StatusBar`
Expected: `2 passed`

- [ ] **Step 5: Write the failing test — `src/components/Rail.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LangContext } from '../context/LangContext';
import { Rail } from './Rail';

describe('Rail', () => {
  it('renders each section title in the active language', () => {
    render(
      <LangContext.Provider value={{ lang: 'es', setLang: vi.fn() }}>
        <Rail active="entry" onNavigate={vi.fn()} />
      </LangContext.Provider>
    );
    expect(screen.getByText(/BIT[ÁA]CORA/)).toBeInTheDocument();
  });

  it('calls onNavigate with the section id when a link is clicked', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <Rail active="entry" onNavigate={onNavigate} />
      </LangContext.Provider>
    );
    await user.click(screen.getByText(/OPERATOR/));
    expect(onNavigate).toHaveBeenCalledWith('operator');
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm run test -- Rail`
Expected: FAIL with "Cannot find module './Rail'"

- [ ] **Step 7: Write `src/components/Rail.tsx`**

```tsx
import { useLang } from '../hooks/useLang';
import { SECTIONS } from '../data/sections';

interface RailProps {
  active: string;
  onNavigate: (id: string) => void;
}

export function Rail({ active, onNavigate }: RailProps) {
  const { lang } = useLang();
  return (
    <nav className={`rail ${active === 'entry' ? 'is-hero' : ''}`}>
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={'#' + s.id}
          className={active === s.id ? 'on' : ''}
          onClick={() => onNavigate(s.id)}
        >
          <span className="tick"></span>
          <span className="full">{s.number} · {s.railTitle[lang]}</span>
          <span className="short">{s.number}</span>
        </a>
      ))}
    </nav>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm run test -- Rail`
Expected: `2 passed`

- [ ] **Step 9: Replace `src/App.tsx`**

```tsx
import { useState } from 'react';
import { LangContext } from './context/LangContext';
import { useActiveSection } from './hooks/useActiveSection';
import { StatusBar } from './components/StatusBar';
import { Rail } from './components/Rail';
import { SECTIONS } from './data/sections';
import type { Lang } from './types';

const SECTION_IDS = SECTIONS.map((s) => s.id);

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem('paula-labs-lang');
    return stored === 'es' ? 'es' : 'en';
  } catch {
    return 'en';
  }
}

export function App() {
  const [lang, setLangState] = useState<Lang>(readStoredLang);
  const [active, setActive] = useActiveSection(SECTION_IDS, 'entry');

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem('paula-labs-lang', next);
    } catch {}
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="grain"></div>
      <div className="scanline"></div>

      <StatusBar active={active} />
      <Rail active={active} onNavigate={setActive} />

      <div className="corner">
        PAULA.LABS<br />
        {lang === 'en' ? 'FIELD NOTEBOOK' : 'CUADERNO DE CAMPO'} · VOL. VIII<br />
        PG. {SECTIONS.findIndex((s) => s.id === active) + 1}/06
      </div>

      <main></main>
    </LangContext.Provider>
  );
}
```

- [ ] **Step 10: Verify the build and full test suite**

Run: `npm run build && npm run test`
Expected: build succeeds, all tests pass.

- [ ] **Step 11: Commit, push, verify deploy**

```bash
git add src/App.tsx src/components/StatusBar.tsx src/components/StatusBar.test.tsx src/components/Rail.tsx src/components/Rail.test.tsx
git commit -m "feat: add App shell with StatusBar and Rail"
git push
```

Visit `https://mariapaulav03.github.io/paula-labs/` after the Actions run finishes — confirm the status bar (with live Bogotá clock) and the section rail render.

---

## Task 7: `SiteNav` (language toggle) — Deploy 2

**Mode:** Guided — first component that both reads and writes lang via Context (`setLang`), reinforcing the provider pattern from Task 4.

**Files:**
- Create: `src/components/SiteNav.tsx`, `src/components/SiteNav.test.tsx`
- Modify: `src/App.tsx` (render `<SiteNav active={active} />` between `<Rail>` and `<div className="corner">`)

**Interfaces:**
- Consumes: `useLang` (Task 4), `SECTIONS`/`SectionMeta.navLabel` (Task 3).
- Produces: `export function SiteNav({ active }: { active: string })`.

- [ ] **Step 1: Write the failing test — `src/components/SiteNav.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LangContext } from '../context/LangContext';
import { SiteNav } from './SiteNav';

describe('SiteNav', () => {
  it('renders nav links using navLabel for the active language', () => {
    render(
      <LangContext.Provider value={{ lang: 'es', setLang: vi.fn() }}>
        <SiteNav active="operator" />
      </LangContext.Provider>
    );
    expect(screen.getByText('./acerca')).toBeInTheDocument();
  });

  it('calls setLang when a language toggle button is clicked', async () => {
    const setLang = vi.fn();
    const user = userEvent.setup();
    render(
      <LangContext.Provider value={{ lang: 'en', setLang }}>
        <SiteNav active="entry" />
      </LangContext.Provider>
    );
    await user.click(screen.getByRole('button', { name: 'ES' }));
    expect(setLang).toHaveBeenCalledWith('es');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- SiteNav`
Expected: FAIL with "Cannot find module './SiteNav'"

- [ ] **Step 3: Write `src/components/SiteNav.tsx`**

```tsx
import { useLang } from '../hooks/useLang';
import { SECTIONS } from '../data/sections';

interface SiteNavProps {
  active: string;
}

export function SiteNav({ active }: SiteNavProps) {
  const { lang, setLang } = useLang();
  const links = SECTIONS.filter((s) => s.navLabel);

  return (
    <header className="site-nav">
      <a href="#entry" className="brand">
        <span className="dot"></span>
        paula.vargas <span className="sep">// {lang === 'en' ? 'online' : 'en línea'}</span>
      </a>
      <nav className="links">
        {links.map((s) => (
          <a key={s.id} href={'#' + s.id} className={active === s.id ? 'on' : ''}>
            {s.navLabel![lang]}
          </a>
        ))}
      </nav>
      <div className="actions">
        <div className="lang-toggle" role="group" aria-label="Language">
          <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button type="button" className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>ES</button>
        </div>
        <a href="#" className="btn-nav-ghost">↓ CV</a>
        <a href="#transmit" className="btn-nav-pink">{lang === 'en' ? 'contact' : 'contacto'}</a>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- SiteNav`
Expected: `2 passed`

- [ ] **Step 5: Wire `SiteNav` into `App.tsx`**

In `src/App.tsx`, add the import and render it between `<Rail>` and the `<div className="corner">` block:

```tsx
import { SiteNav } from './components/SiteNav';
```

```tsx
      <StatusBar active={active} />
      <Rail active={active} onNavigate={setActive} />
      <SiteNav active={active} />
```

- [ ] **Step 6: Verify build and full test suite**

Run: `npm run build && npm run test`
Expected: build succeeds, all tests pass.

- [ ] **Step 7: Commit, push, verify deploy**

```bash
git add src/components/SiteNav.tsx src/components/SiteNav.test.tsx src/App.tsx
git commit -m "feat: add SiteNav with working EN/ES language toggle"
git push
```

Visit the deployed site — confirm the EN/ES toggle now switches visible text (status bar availability label, nav links).

---

## Task 8: `Hero` + `data/heroCopy.ts` — Deploy 3

**Mode:** Guided — reinforces `useState`/`useEffect` (clock, same pattern as `StatusBar`) and bilingual data-driven rendering.

**Files:**
- Create: `src/data/heroCopy.ts`, `src/components/Hero.tsx`, `src/components/Hero.test.tsx`
- Modify: `src/App.tsx` (render `<Hero />` inside `<main>`)
- Delete (end of this task): `hero.jsx`

**Interfaces:**
- Consumes: `useLang` (Task 4).
- Produces: `export const HERO_COPY: Record<Lang, HeroCopy>`, `export function Hero()`.

- [ ] **Step 1: Write `src/data/heroCopy.ts`**

Port `HERO_COPY` from `hero.jsx` verbatim (content unchanged — already bilingual), typed:

```tsx
import type { ReactNode } from 'react';
import type { Lang } from '../types';

export interface HeroCopy {
  doc1: string; doc1ref: string;
  doc2: string; doc2ref: string;
  vol: string;
  local: string;
  tag: string;
  h1a: string; h1b: string; h1c: string; h1d: string; h1e: string;
  lede: ReactNode;
  btn1: string; btn2: string;
  specHead: string; live: string;
  rows: [string, ReactNode][];
  ticker: string[];
}

export const HERO_COPY: Record<Lang, HeroCopy> = {
  en: {
    doc1: 'DOCUMENT', doc1ref: 'PL-2026.05 / V.08',
    doc2: 'FIELD', doc2ref: 'NOTEBOOK · ENTRY 001 · OPEN',
    vol: 'Vol. VIII — "Frontend systems, written by hand."',
    local: 'LOCAL',
    tag: '★ FIELD ENTRY 001 ─ OPERATOR INTRODUCES HERSELF',
    h1a: 'Paula Vargas', h1b: 'runs a small', h1c: 'laboratory', h1d: 'for Angular,', h1e: 'Firebase & microfrontends.',
    lede: (
      <>
        Frontend engineer based in <b>Bogotá, Colombia</b>. I build <b>enterprise management apps,
        microfrontend architectures and the Firebase backends behind them</b> — while finishing my
        last year of a Software Engineering degree. Architecture first, motion second, and a paper
        notebook open at all times.{' '}
        <span className="ink">4+ years shipping</span>, one long-running product, always in production.
      </>
    ),
    btn1: 'Enter the archive', btn2: 'Open transmission',
    specHead: 'SPEC ── OPERATOR', live: 'LIVE',
    rows: [
      ['NAME', (<><span className="ital">Paula Vargas</span> &nbsp; <span className="accent">// frontend.eng</span></>)],
      ['FOCUS', (<>Angular · Firebase · <span className="accent">Microfrontends</span> · TS</>)],
      ['SINCE', (<>2021 · <span style={{ color: 'var(--paper-faint)' }}>4+ years in production</span></>)],
      ['STATUS', (<><span className="ok">● OPEN</span> &nbsp; freelance / contract / full-time</>)],
      ['STUDYING', (<><span className="pink">Software Eng.</span> · 7th of 8 semesters</>)],
      ['UPTIME', (<><span className="cyan">PAPPCORN</span> in production since 2021</>)],
      ['COFFEE', (<>cup 3 of 4 · <span className="accent">▮▮▮▯</span></>)],
    ],
    ticker: ['ANGULAR · FIREBASE · MICROFRONTENDS', 'FIELD NOTEBOOK / VOL. VIII', 'BUILDING FROM BOGOTÁ SINCE 2021', 'MODULE FEDERATION · NX · TYPESCRIPT', 'FINISHING SOFTWARE ENGINEERING, 2026'],
  },
  es: {
    doc1: 'DOCUMENTO', doc1ref: 'PL-2026.05 / V.08',
    doc2: 'ENTRADA', doc2ref: 'DE CAMPO · N.º 001 · ABIERTA',
    vol: 'Vol. VIII — "Sistemas de frontend, escritos a mano."',
    local: 'HORA LOCAL',
    tag: '★ ENTRADA DE CAMPO 001 ─ LA OPERADORA SE PRESENTA',
    h1a: 'Paula Vargas', h1b: 'dirige un pequeño', h1c: 'laboratorio', h1d: 'de Angular,', h1e: 'Firebase y microfrontends.',
    lede: (
      <>
        Ingeniera frontend en <b>Bogotá, Colombia</b>. Construyo <b>aplicaciones de gestión empresarial,
        arquitecturas de microfrontends y los backends en Firebase</b> que hay detrás — mientras termino
        el último año de mi carrera de Ingeniería de Software. Primero la arquitectura, luego la animación,
        y un cuaderno de papel siempre abierto.{' '}
        <span className="ink">4+ años en producción</span>, un solo producto de larga vida, siempre en vivo.
      </>
    ),
    btn1: 'Entrar al archivo', btn2: 'Abrir transmisión',
    specHead: 'ESPEC ── OPERADORA', live: 'EN VIVO',
    rows: [
      ['NOMBRE', (<><span className="ital">Paula Vargas</span> &nbsp; <span className="accent">// frontend.eng</span></>)],
      ['ENFOQUE', (<>Angular · Firebase · <span className="accent">Microfrontends</span> · TS</>)],
      ['DESDE', (<>2021 · <span style={{ color: 'var(--paper-faint)' }}>4+ años en producción</span></>)],
      ['ESTADO', (<><span className="ok">● ABIERTA</span> &nbsp; freelance / contrato / tiempo completo</>)],
      ['ESTUDIANDO', (<><span className="pink">Ing. de Software</span> · semestre 7 de 8</>)],
      ['ACTIVA', (<><span className="cyan">PAPPCORN</span> en producción desde 2021</>)],
      ['CAFÉ', (<>taza 3 de 4 · <span className="accent">▮▮▮▯</span></>)],
    ],
    ticker: ['ANGULAR · FIREBASE · MICROFRONTENDS', 'CUADERNO DE CAMPO / VOL. VIII', 'CONSTRUYENDO DESDE BOGOTÁ DESDE 2021', 'MODULE FEDERATION · NX · TYPESCRIPT', 'TERMINANDO ING. DE SOFTWARE, 2026'],
  },
};
```

- [ ] **Step 2: Write the failing test — `src/components/Hero.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangContext } from '../context/LangContext';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the Spanish headline when lang is es', () => {
    render(
      <LangContext.Provider value={{ lang: 'es', setLang: vi.fn() }}>
        <Hero />
      </LangContext.Provider>
    );
    expect(screen.getByText('dirige un pequeño')).toBeInTheDocument();
  });

  it('renders the English headline when lang is en', () => {
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <Hero />
      </LangContext.Provider>
    );
    expect(screen.getByText('runs a small')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test -- Hero`
Expected: FAIL with "Cannot find module './Hero'"

- [ ] **Step 4: Write `src/components/Hero.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { useLang } from '../hooks/useLang';
import { HERO_COPY } from '../data/heroCopy';

export function Hero() {
  const { lang } = useLang();
  const c = HERO_COPY[lang];
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = now.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'America/Bogota' });
  const d = now
    .toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();

  return (
    <section className="section hero" id="entry" data-screen-label="01 Field Entry">
      <div className="shell">
        <div className="hero-top">
          <div className="hero-stamp">
            <div className="doc">{c.doc1} <span className="ref">{c.doc1ref}</span></div>
            <div className="doc">{c.doc2} <span className="ref">{c.doc2ref}</span></div>
            <div className="vol">{c.vol}</div>
          </div>
          <div className="hero-locator">
            <span style={{ whiteSpace: 'nowrap' }}>4.7110° N · 74.0721° W</span><br />
            BOGOTÁ / CO<br />
            {c.local} <b>{t}</b><br />
            {d}
          </div>
        </div>

        <div className="hero-body">
          <div className="hero-headline">
            <div className="tag">{c.tag}</div>
            <h1>
              <span className="lab">{c.h1a}</span>
              <span className="ital">{c.h1b}</span>
              <span className="stamp lab" style={{ display: 'inline-block' }}>{c.h1c}</span>
              <span className="ital">{c.h1d}</span>
              <span className="lab">{c.h1e}</span>
            </h1>

            <p className="lede">{c.lede}</p>

            <div className="hero-actions">
              <a href="#systems" className="btn-ink">
                {c.btn1}
                <span className="arrow">↘</span>
              </a>
              <a href="#transmit" className="btn-outline">
                ↗ &nbsp;{c.btn2}
              </a>
            </div>
          </div>

          <aside className="specimen">
            <div className="specimen-head">
              <span>{c.specHead}</span>
              <span className="live"><span className="led"></span> {c.live}</span>
            </div>

            <div className="specimen-portrait">
              <div className="crosshair"><span className="center-tag">FIG. 01</span></div>
              <span className="label"><span>FOCAL POINT</span><span>4:3 / OBSERVED</span></span>
            </div>

            <div>
              {c.rows.map((r, i) => (
                <div key={i} className="specimen-row">
                  <div className="k">{r[0]}</div>
                  <div className="v">{r[1]}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="hero-ticker">
          <div className="track">
            {[...c.ticker, ...c.ticker].map((s, i) => (
              <span key={i}><span>{s}</span><span className="dot">✦</span></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- Hero`
Expected: `2 passed`

- [ ] **Step 6: Wire `Hero` into `App.tsx` and remove the legacy file**

In `src/App.tsx`:

```tsx
import { Hero } from './components/Hero';
```

```tsx
      <main>
        <Hero />
      </main>
```

```bash
rm hero.jsx
```

- [ ] **Step 7: Verify build and full test suite**

Run: `npm run build && npm run test`
Expected: build succeeds, all tests pass.

- [ ] **Step 8: Commit, push, verify deploy**

```bash
git add src/data/heroCopy.ts src/components/Hero.tsx src/components/Hero.test.tsx src/App.tsx
git rm hero.jsx
git commit -m "feat: add Hero section, remove legacy hero.jsx"
git push
```

---

## Task 9: `Operator` + `data/operatorCopy.ts` (ES draft) — Deploy 4

**Mode:** Guided (light) — presentational component, no new hooks; first appearance of drafted (not-yet-native-reviewed) Spanish copy.

**⚠ Translation review needed:** the `es` values in `operatorCopy.ts` below are a draft translation of biographical, first-person content. Flag them for the project owner's review before considering this task's content final — wording, tone, and any factual nuance are hers to adjust.

**Files:**
- Create: `src/data/operatorCopy.ts`, `src/components/Operator.tsx`, `src/components/Operator.test.tsx`
- Modify: `src/App.tsx` (render `<Operator />` after `<Hero />`)
- Delete (end of this task): `operator.jsx`

**Interfaces:**
- Consumes: `useLang` (Task 4).
- Produces: `export const OPERATOR_COPY: Record<Lang, OperatorCopy>`, `export function Operator()`.

- [ ] **Step 1: Write `src/data/operatorCopy.ts`**

```tsx
import type { Lang } from '../types';

interface InventoryRow {
  n: string;
  t: string;
  m: string;
}

interface InventoryCard {
  h: string;
  hRight: string;
  rows: InventoryRow[];
}

export interface OperatorCopy {
  h2Line1: string; h2Line2Em: string; h2Line3Plain: string; h2Line3Em: string; h2Line4: string;
  p1: string; p2: string; quote: string; p3: string; p4: string;
  missions: InventoryCard;
  education: InventoryCard;
  waysOfWorking: InventoryCard;
  languages: InventoryCard;
  obsessions: InventoryCard;
}

export const OPERATOR_COPY: Record<Lang, OperatorCopy> = {
  en: {
    h2Line1: 'I build interfaces',
    h2Line2Em: 'that have to work',
    h2Line3Plain: 'in production, ',
    h2Line3Em: 'while',
    h2Line4: "I'm still learning.",
    p1: 'Frontend engineer, Bogotá. More than four years building web applications with Angular and TypeScript in real production environments — while finishing the last stretch of a Software Engineering degree at night.',
    p2: 'I work with microfrontend architectures (Module Federation, Nx) that let teams ship independently without stepping on each other, and with Firebase (Firestore + Authentication) as the backend for data and identity. I care about SOLID and Clean Code not as slogans but as the reason a three-year-old codebase is still pleasant to open.',
    quote: "I'd rather ship one product well for four years than ship ten products badly. Depth teaches you things breadth can't.",
    p3: "Day to day I maintain PAPPCORN, an enterprise management platform I've worked on since 2021 — new features, microfrontend migrations, performance passes, functional testing, all inside an agile team. Before that I built interfaces for educational platforms and corporate WordPress sites, which is where I learned to care about the parts non-engineers actually notice.",
    p4: "I read English documentation daily, write Spanish natively, and I'm still two semesters from my degree — which keeps me honestly aware of how much there still is to learn, and comfortable saying so.",
    missions: {
      h: 'ACTIVE MISSIONS', hRight: 'WK / 19 · 2026',
      rows: [
        { n: '01', t: 'Module Federation migration · PAPPCORN', m: '●●●○' },
        { n: '02', t: 'Final semester · Ingeniería de Software', m: '●●●●' },
        { n: '03', t: 'Reactive Forms overhaul · new module', m: '●●○○' },
        { n: '04', t: 'Ionic + Capacitor experiments, off-hours', m: '●○○○' },
      ],
    },
    education: {
      h: 'EDUCATION', hRight: '2021 → 2026',
      rows: [
        { n: '▪', t: 'Ingeniería de Software · Politécnico Grancolombiano', m: '7/8' },
        { n: '▪', t: 'Técnico Front-End · Instituto Kuepa', m: '2021' },
        { n: '▪', t: 'Beca Jóvenes a la U · Politécnico', m: '★' },
        { n: '▪', t: 'Beca Fundación Citibank · Kuepa', m: '★' },
      ],
    },
    waysOfWorking: {
      h: 'WAYS OF WORKING', hRight: 'DAILY',
      rows: [
        { n: '·', t: 'Scrum / Agile ceremonies, taken seriously', m: '04Y' },
        { n: '·', t: 'SOLID before clever', m: '04Y' },
        { n: '·', t: 'Functional testing before merge', m: '03Y' },
        { n: '·', t: 'English docs, every single day', m: '04Y' },
      ],
    },
    languages: {
      h: 'LANGUAGES', hRight: 'SPOKEN',
      rows: [
        { n: 'ES', t: 'Español', m: 'NATIVE' },
        { n: 'EN', t: 'English', m: 'A2' },
      ],
    },
    obsessions: {
      h: 'OBSESSIONS', hRight: 'RECURRING',
      rows: [
        { n: '∞', t: 'Independent deploys across teams', m: 'ARCH' },
        { n: '∞', t: 'Reactive Forms that validate themselves', m: 'UX' },
        { n: '∞', t: 'A design system that survives four years', m: 'CRAFT' },
        { n: '∞', t: 'Ionic + Capacitor, properly this time', m: 'SOON' },
      ],
    },
  },
  es: {
    h2Line1: 'Construyo interfaces',
    h2Line2Em: 'que tienen que funcionar',
    h2Line3Plain: 'en producción, ',
    h2Line3Em: 'mientras',
    h2Line4: 'todavía estoy aprendiendo.',
    p1: 'Ingeniera frontend, Bogotá. Más de cuatro años construyendo aplicaciones web con Angular y TypeScript en entornos de producción reales — mientras termino, en las noches, el último tramo de mi carrera de Ingeniería de Software.',
    p2: 'Trabajo con arquitecturas de microfrontends (Module Federation, Nx) que permiten a los equipos desplegar de forma independiente sin pisarse entre sí, y con Firebase (Firestore + Authentication) como backend de datos e identidad. Me importan SOLID y Clean Code no como eslóganes, sino como la razón por la que un código de tres años sigue siendo agradable de abrir.',
    quote: 'Prefiero entregar bien un solo producto durante cuatro años que entregar mal diez productos. La profundidad enseña cosas que la amplitud no puede.',
    p3: 'Día a día mantengo PAPPCORN, una plataforma de gestión empresarial en la que trabajo desde 2021 — nuevas funcionalidades, migraciones a microfrontends, mejoras de rendimiento, pruebas funcionales, todo dentro de un equipo ágil. Antes construí interfaces para plataformas educativas y sitios corporativos en WordPress, que fue donde aprendí a cuidar las partes que sí nota alguien que no es ingeniero.',
    p4: 'Leo documentación en inglés todos los días, escribo en español de forma nativa, y todavía me faltan dos semestres para graduarme — lo cual me mantiene honestamente consciente de cuánto queda por aprender, y cómoda diciéndolo.',
    missions: {
      h: 'MISIONES ACTIVAS', hRight: 'SEM / 19 · 2026',
      rows: [
        { n: '01', t: 'Migración a Module Federation · PAPPCORN', m: '●●●○' },
        { n: '02', t: 'Último semestre · Ingeniería de Software', m: '●●●●' },
        { n: '03', t: 'Renovación de Reactive Forms · nuevo módulo', m: '●●○○' },
        { n: '04', t: 'Experimentos con Ionic + Capacitor, fuera de horario', m: '●○○○' },
      ],
    },
    education: {
      h: 'EDUCACIÓN', hRight: '2021 → 2026',
      rows: [
        { n: '▪', t: 'Ingeniería de Software · Politécnico Grancolombiano', m: '7/8' },
        { n: '▪', t: 'Técnico Front-End · Instituto Kuepa', m: '2021' },
        { n: '▪', t: 'Beca Jóvenes a la U · Politécnico', m: '★' },
        { n: '▪', t: 'Beca Fundación Citibank · Kuepa', m: '★' },
      ],
    },
    waysOfWorking: {
      h: 'FORMA DE TRABAJAR', hRight: 'DIARIO',
      rows: [
        { n: '·', t: 'Ceremonias Scrum / Agile, en serio', m: '04A' },
        { n: '·', t: 'SOLID antes que ingenioso', m: '04A' },
        { n: '·', t: 'Pruebas funcionales antes de mergear', m: '03A' },
        { n: '·', t: 'Documentación en inglés, todos los días', m: '04A' },
      ],
    },
    languages: {
      h: 'IDIOMAS', hRight: 'HABLADOS',
      rows: [
        { n: 'ES', t: 'Español', m: 'NATIVO' },
        { n: 'EN', t: 'Inglés', m: 'A2' },
      ],
    },
    obsessions: {
      h: 'OBSESIONES', hRight: 'RECURRENTES',
      rows: [
        { n: '∞', t: 'Despliegues independientes entre equipos', m: 'ARQ' },
        { n: '∞', t: 'Reactive Forms que se validan solos', m: 'UX' },
        { n: '∞', t: 'Un design system que sobrevive cuatro años', m: 'CRAFT' },
        { n: '∞', t: 'Ionic + Capacitor, esta vez bien', m: 'PRONTO' },
      ],
    },
  },
};
```

- [ ] **Step 2: Write the failing test — `src/components/Operator.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangContext } from '../context/LangContext';
import { Operator } from './Operator';

describe('Operator', () => {
  it('renders the Spanish headline when lang is es', () => {
    render(
      <LangContext.Provider value={{ lang: 'es', setLang: vi.fn() }}>
        <Operator />
      </LangContext.Provider>
    );
    expect(screen.getByText('Construyo interfaces')).toBeInTheDocument();
  });

  it('renders the English headline when lang is en', () => {
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <Operator />
      </LangContext.Provider>
    );
    expect(screen.getByText('I build interfaces')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test -- Operator`
Expected: FAIL with "Cannot find module './Operator'"

- [ ] **Step 4: Write `src/components/Operator.tsx`**

```tsx
import { useLang } from '../hooks/useLang';
import { OPERATOR_COPY } from '../data/operatorCopy';

export function Operator() {
  const { lang } = useLang();
  const c = OPERATOR_COPY[lang];
  const cards = [c.missions, c.education, c.waysOfWorking, c.languages, c.obsessions];

  return (
    <section className="section operator" id="operator" data-screen-label="02 Operator">
      <div className="shell">
        <div className="kicker op-kicker">
          <span className="num">§02</span> &nbsp;/&nbsp; OPERATOR DOSSIER &nbsp;·&nbsp; A SHORT FILE
        </div>

        <div className="operator-grid">
          <div className="op-portrait">
            <div className="op-stamp">VERIFIED</div>
            <div className="frame">
              <div className="silhouette">P</div>
              <span className="px" style={{ top: '12%', left: '14%' }}></span>
              <span className="px" style={{ top: '86%', left: '82%' }}></span>
              <span className="px" style={{ top: '40%', right: '8%', background: 'var(--cyan)' }}></span>
              <span className="px" style={{ bottom: '10%', left: '10%', background: 'var(--pink)' }}></span>
            </div>
            <div className="cap">
              <span>PORTRAIT · <b>M.P. VARGAS</b></span>
              <span>OP–001</span>
            </div>
            <div className="cap" style={{ marginTop: 6 }}>
              <span>BOGOTÁ · CO</span>
              <span>HAND <b>RIGHT</b></span>
            </div>
          </div>

          <div className="op-body">
            <h2 className="op-h">
              {c.h2Line1}<br />
              <em>{c.h2Line2Em}</em><br />
              {c.h2Line3Plain}<em>{c.h2Line3Em}</em><br />
              <span style={{ color: 'var(--amber)' }}>{c.h2Line4}</span>
            </h2>

            <div className="op-cols">
              <p>{c.p1}</p>
              <p>{c.p2}</p>
              <p className="op-quote">"{c.quote}"</p>
              <p>{c.p3}</p>
              <p>{c.p4}</p>
            </div>
          </div>

          <aside className="op-side">
            {cards.map((card) => (
              <div className="inv-card" key={card.h}>
                <div className="h"><span>{card.h}</span><b>{card.hRight}</b></div>
                {card.rows.map((row, i) => (
                  <div className="inv-row" key={i}>
                    <span className="n">{row.n}</span>
                    <span className="t">{row.t}</span>
                    <span className="m">{row.m}</span>
                  </div>
                ))}
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- Operator`
Expected: `2 passed`

- [ ] **Step 6: Wire `Operator` into `App.tsx` and remove the legacy file**

In `src/App.tsx`:

```tsx
import { Operator } from './components/Operator';
```

```tsx
      <main>
        <Hero />
        <Operator />
      </main>
```

```bash
rm operator.jsx
```

- [ ] **Step 7: Verify build and full test suite**

Run: `npm run build && npm run test`
Expected: build succeeds, all tests pass.

- [ ] **Step 8: Commit, push, verify deploy**

```bash
git add src/data/operatorCopy.ts src/components/Operator.tsx src/components/Operator.test.tsx src/App.tsx
git rm operator.jsx
git commit -m "feat: add Operator section with EN/ES copy (ES draft pending review), remove legacy operator.jsx"
git push
```

Remind the project owner to review the Spanish copy in `operatorCopy.ts` before treating it as final.

---

## Task 10: `Systems` + `System` + viz components + `data/systems.ts` (ES draft) — Deploy 5

**Mode:** Guided — new concept: local component state + props-down/callback-up between parent (`Systems`) and child (`System`), the closest React equivalent to Angular's `@Input`/`@Output`.

**⚠ Translation review needed:** `problem`/`decisions`/`blurb` Spanish text in `systems.ts` is drafted, not yet reviewed.

**Files:**
- Create: `src/data/systems.ts`, `src/components/viz/VizBlueprint.tsx`, `src/components/viz/VizArch.tsx`, `src/components/viz/VizSchema.tsx`, `src/components/viz/VizPaint.tsx`, `src/components/System.tsx`, `src/components/System.test.tsx`, `src/components/Systems.tsx`, `src/components/Systems.test.tsx`
- Modify: `src/App.tsx` (render `<Systems />` after `<Operator />`)
- Delete (end of this task): `artifacts.jsx`

**Interfaces:**
- Consumes: `useLang` (Task 4).
- Produces:
  - `export function VizBlueprint()`, `export function VizArch({ children }: { children: ReactNode })`, `export function VizSchema()`, `export function VizPaint()`
  - `export const SYSTEMS: SystemEntry[]`
  - `export function System({ data, open, onToggle }: { data: SystemEntry; open: boolean; onToggle: () => void })`
  - `export function Systems()`

- [ ] **Step 1: Write the viz components (ported unchanged — no bilingual content, no new concepts)**

`src/components/viz/VizBlueprint.tsx`:

```tsx
export function VizBlueprint() {
  return (
    <div className="viz-blueprint">
      <svg viewBox="0 0 400 300" preserveAspectRatio="none">
        <g stroke="rgba(111,141,255,0.9)" fill="none" strokeWidth="1">
          <rect x="40" y="60" width="120" height="80" />
          <text x="100" y="105" textAnchor="middle" fill="rgba(237,231,214,0.9)" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5">SHELL.APP</text>
          <rect x="200" y="60" width="120" height="80" />
          <text x="260" y="105" textAnchor="middle" fill="rgba(237,231,214,0.9)" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5">REMOTE.MFE</text>
          <rect x="120" y="180" width="160" height="60" />
          <text x="200" y="216" textAnchor="middle" fill="rgba(255,111,174,0.9)" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2">FIREBASE / FIRESTORE</text>
          <line x1="100" y1="140" x2="180" y2="180" strokeDasharray="3 3" />
          <line x1="260" y1="140" x2="220" y2="180" strokeDasharray="3 3" />
          <circle cx="180" cy="180" r="3" fill="rgba(255,111,174,1)" />
          <circle cx="220" cy="180" r="3" fill="rgba(255,111,174,1)" />
          <text x="40" y="42" fill="rgba(237,231,214,0.8)" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.8">MODULE FEDERATION</text>
          <text x="40" y="270" fill="rgba(237,231,214,0.6)" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="1.5">FIG. A.1 · NX WORKSPACE</text>
        </g>
      </svg>
      <span className="stamp">PAPPCORN · v3.x</span>
    </div>
  );
}
```

`src/components/viz/VizArch.tsx`:

```tsx
import type { ReactNode } from 'react';

export function VizArch({ children }: { children: ReactNode }) {
  return <div className="viz-arch">{children}</div>;
}
```

`src/components/viz/VizSchema.tsx`:

```tsx
export function VizSchema() {
  return (
    <div className="viz-schema">
      <span className="c">// module-federation.config.ts</span><br />
      <span className="c">{'{'}</span><br />
      &nbsp;&nbsp;<span className="k">"name"</span>: <span className="v">"gestion-shell"</span>,<br />
      &nbsp;&nbsp;<span className="k">"remotes"</span>: [<br />
      &nbsp;&nbsp;&nbsp;&nbsp;<span className="p">"inventario@remoteEntry.js"</span>,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;<span className="p">"facturacion@remoteEntry.js"</span><br />
      &nbsp;&nbsp;],<br />
      &nbsp;&nbsp;<span className="k">"exposes"</span>: <span className="n">{'{ "./Dashboard": "./src/app/dashboard" }'}</span><br />
      <span className="c">{'}'}</span><br />
      <br />
      <span style={{ color: 'var(--paper-faint)' }}>$ nx serve gestion-shell --devRemotes=inventario</span><br />
      <span style={{ color: 'var(--green)' }}>✓ 2 remotes attached · independent deploy ready</span>
    </div>
  );
}
```

`src/components/viz/VizPaint.tsx`:

```tsx
const SWATCHES = [
  { c: '#ff5d9a', n: '01·CARMINE' },
  { c: '#ff6fae', n: '02·ROSE' },
  { c: '#3affd6', n: '03·SIGNAL' },
  { c: '#6f8dff', n: '04·BLUEPRINT' },
  { c: '#87e36b', n: '05·CHLORINE' },
  { c: '#ede7d6', n: '06·BONE' },
];

export function VizPaint() {
  return (
    <div className="viz-paint" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
      {SWATCHES.map((s, i) => (
        <div key={i} className="swatch" style={{ background: s.c }}>
          <span className="l" style={{ color: i === 5 || i === 1 || i === 2 ? '#111' : '#ede7d6' }}>{s.n}</span>
        </div>
      ))}
      {SWATCHES.map((s, i) => (
        <div key={'b' + i} className="swatch" style={{ background: s.c, filter: 'brightness(0.45)' }}>
          <span className="l" style={{ color: '#ede7d6' }}>{s.n.replace('·', '/')}.D</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write `src/data/systems.ts`**

```tsx
import type { Lang } from '../types';

interface MetaRow { k: string; v: string; cls?: string }
interface StatItem { n: string; l: string }

interface SystemCopy {
  cat: string;
  sub: string;
  name: string;
  italic: string;
  blurb: string;
  meta: MetaRow[];
  viz: 'blueprint' | 'arch' | 'schema' | 'paint';
  problem: string;
  decisions: string;
  arch: [string, string][];
  stats: StatItem[];
  tags: string[];
  tagsKey: string[];
}

export type SystemEntry = Record<Lang, SystemCopy> & { id: string };

export const SYSTEMS: SystemEntry[] = [
  {
    id: 'pappcorn',
    en: {
      cat: 'N°1', sub: 'ENTERPRISE · ACTIVE',
      name: 'PAPPCORN', italic: '— gestión empresarial',
      blurb: 'Enterprise management web application, in continuous production since 2021. Angular + TypeScript frontend, Firebase for data and identity, migrating toward independently-deployable microfrontends.',
      meta: [
        { k: 'SYSTEM', v: 'ACTIVE', cls: 'green' },
        { k: 'STATUS', v: 'IN PRODUCTION', cls: 'cyan' },
        { k: 'STACK', v: 'Angular · TypeScript · Firebase', cls: 'accent' },
        { k: 'ROLE', v: 'FRONTEND DEVELOPER · REMOTE' },
        { k: 'YEAR', v: '2021 ─ ONGOING' },
      ],
      viz: 'blueprint',
      problem: 'PAPPCORN is a long-running enterprise management platform — the kind of system where every new feature has to sit next to four years of existing decisions without breaking them. The frontend needed room for multiple teams to ship independently, and a cleaner story for how data and auth were handled.',
      decisions: 'Development and maintenance of the Angular + TypeScript frontend, with Firebase (Firestore + Authentication) wired in for data and identity. Introduced a microfrontend architecture using Module Federation and Nx, so features can be built and deployed independently rather than through one shared release train. New functionality is built with Angular Material and Reactive Forms, with an eye on visual consistency and the actual experience of the person using it — not just the ticket description.',
      arch: [
        ['nx workspace/', 'shell + N independently-deployed remotes'],
        ['└─ shell-app/', 'Angular · routing · auth guard'],
        ['└─ mfe-inventario/', 'Module Federation remote'],
        ['└─ mfe-facturacion/', 'Module Federation remote'],
        ['Firebase', 'Firestore · Authentication'],
        ['REST APIs', 'legacy service integration'],
      ],
      stats: [
        { n: '4+', l: 'YEARS IN PRODUCTION' },
        { n: '2021', l: 'FIRST COMMIT' },
        { n: 'MFE', l: 'ARCHITECTURE · IN MIGRATION' },
      ],
      tags: ['Angular', 'TypeScript', 'Firebase', 'Firestore', 'Module Federation', 'Nx', 'Angular Material', 'Reactive Forms', 'Agile'],
      tagsKey: ['k', 'k', 'k', 'k', 'm', 'm', 'm', 'm', 'm'],
    },
    es: {
      cat: 'N°1', sub: 'EMPRESA · ACTIVO',
      name: 'PAPPCORN', italic: '— gestión empresarial',
      blurb: 'Aplicación web de gestión empresarial, en producción continua desde 2021. Frontend en Angular + TypeScript, Firebase para datos e identidad, en migración hacia microfrontends de despliegue independiente.',
      meta: [
        { k: 'SISTEMA', v: 'ACTIVO', cls: 'green' },
        { k: 'ESTADO', v: 'EN PRODUCCIÓN', cls: 'cyan' },
        { k: 'STACK', v: 'Angular · TypeScript · Firebase', cls: 'accent' },
        { k: 'ROL', v: 'DESARROLLADORA FRONTEND · REMOTO' },
        { k: 'AÑO', v: '2021 ─ EN CURSO' },
      ],
      viz: 'blueprint',
      problem: 'PAPPCORN es una plataforma de gestión empresarial de larga duración — el tipo de sistema donde cada nueva funcionalidad tiene que convivir con cuatro años de decisiones existentes sin romperlas. El frontend necesitaba espacio para que varios equipos desplegaran de forma independiente, y una historia más clara de cómo se manejaban los datos y la autenticación.',
      decisions: 'Desarrollo y mantenimiento del frontend en Angular + TypeScript, con Firebase (Firestore + Authentication) integrado para datos e identidad. Se introdujo una arquitectura de microfrontends con Module Federation y Nx, de modo que las funcionalidades se construyen y despliegan de forma independiente en vez de por un único tren de release compartido. Las nuevas funcionalidades se construyen con Angular Material y Reactive Forms, cuidando la consistencia visual y la experiencia real de quien usa el sistema — no solo la descripción del ticket.',
      arch: [
        ['nx workspace/', 'shell + N remotes de despliegue independiente'],
        ['└─ shell-app/', 'Angular · routing · guard de autenticación'],
        ['└─ mfe-inventario/', 'remote de Module Federation'],
        ['└─ mfe-facturacion/', 'remote de Module Federation'],
        ['Firebase', 'Firestore · Authentication'],
        ['REST APIs', 'integración con servicios legacy'],
      ],
      stats: [
        { n: '4+', l: 'AÑOS EN PRODUCCIÓN' },
        { n: '2021', l: 'PRIMER COMMIT' },
        { n: 'MFE', l: 'ARQUITECTURA · EN MIGRACIÓN' },
      ],
      tags: ['Angular', 'TypeScript', 'Firebase', 'Firestore', 'Module Federation', 'Nx', 'Angular Material', 'Reactive Forms', 'Agile'],
      tagsKey: ['k', 'k', 'k', 'k', 'm', 'm', 'm', 'm', 'm'],
    },
  },
  {
    id: 'cooking-program',
    en: {
      cat: 'N°2', sub: 'EDUCATION · 2021–2023',
      name: 'Cooking Program', italic: '— plataformas educativas',
      blurb: 'Interfaces for educational and technical-training platforms, built with Angular and Firebase — including automated testing to keep delivered features stable as the platform grew.',
      meta: [
        { k: 'SYSTEM', v: 'ARCHIVED', cls: 'red' },
        { k: 'STATUS', v: 'DELIVERED', cls: 'pink' },
        { k: 'STACK', v: 'Angular · Firebase', cls: 'accent' },
        { k: 'ROLE', v: 'FRONTEND DEVELOPER' },
        { k: 'YEAR', v: '2021 ─ 2023' },
      ],
      viz: 'schema',
      problem: 'An educational and technical-training platform needed interfaces that could keep up with a fast-moving curriculum team — new modules, new content types, new forms — without the codebase turning into something nobody wanted to touch.',
      decisions: 'Built interfaces with Angular and Firebase, applying SOLID principles and Clean Code to keep things maintainable as scope grew. Implemented automated tests to guard the stability of delivered functionality, and worked directly with the team on technical training and the adoption of better development practices along the way.',
      arch: [
        ['Angular app', 'course modules · content forms'],
        ['└─ Firebase', 'content storage · auth'],
        ['└─ automated tests', 'stability guard on delivery'],
        ['Clean Code / SOLID', 'applied across the codebase'],
      ],
      stats: [
        { n: '2Y', l: 'ENGAGEMENT LENGTH' },
        { n: 'SOLID', l: 'PRINCIPLES APPLIED' },
        { n: '✓', l: 'AUTOMATED TEST COVERAGE' },
      ],
      tags: ['Angular', 'Firebase', 'SOLID', 'Clean Code', 'Automated Testing'],
      tagsKey: ['k', 'k', 'm', 'm', 'm'],
    },
    es: {
      cat: 'N°2', sub: 'EDUCACIÓN · 2021–2023',
      name: 'Cooking Program', italic: '— plataformas educativas',
      blurb: 'Interfaces para plataformas educativas y de formación técnica, construidas con Angular y Firebase — incluyendo pruebas automatizadas para mantener estables las funcionalidades entregadas a medida que la plataforma crecía.',
      meta: [
        { k: 'SISTEMA', v: 'ARCHIVADO', cls: 'red' },
        { k: 'ESTADO', v: 'ENTREGADO', cls: 'pink' },
        { k: 'STACK', v: 'Angular · Firebase', cls: 'accent' },
        { k: 'ROL', v: 'DESARROLLADORA FRONTEND' },
        { k: 'AÑO', v: '2021 ─ 2023' },
      ],
      viz: 'schema',
      problem: 'Una plataforma educativa y de formación técnica necesitaba interfaces que pudieran seguirle el ritmo a un equipo curricular que se movía rápido — nuevos módulos, nuevos tipos de contenido, nuevos formularios — sin que el código se convirtiera en algo que nadie quisiera tocar.',
      decisions: 'Se construyeron interfaces con Angular y Firebase, aplicando principios SOLID y Clean Code para mantener el mantenimiento posible a medida que crecía el alcance. Se implementaron pruebas automatizadas para proteger la estabilidad de las funcionalidades entregadas, y se trabajó directamente con el equipo en formación técnica y adopción de mejores prácticas de desarrollo.',
      arch: [
        ['Angular app', 'módulos de curso · formularios de contenido'],
        ['└─ Firebase', 'almacenamiento de contenido · auth'],
        ['└─ pruebas automatizadas', 'protección de estabilidad en cada entrega'],
        ['Clean Code / SOLID', 'aplicado en todo el código'],
      ],
      stats: [
        { n: '2A', l: 'DURACIÓN DEL PROYECTO' },
        { n: 'SOLID', l: 'PRINCIPIOS APLICADOS' },
        { n: '✓', l: 'COBERTURA DE PRUEBAS AUTOMATIZADAS' },
      ],
      tags: ['Angular', 'Firebase', 'SOLID', 'Clean Code', 'Automated Testing'],
      tagsKey: ['k', 'k', 'm', 'm', 'm'],
    },
  },
  {
    id: 'ink-agencia',
    en: {
      cat: 'N°3', sub: 'AGENCY · 2021',
      name: 'Ink Agencia Digital', italic: '— sitios corporativos',
      blurb: 'Corporate WordPress sites, built from Figma designs — visual implementation, theme customization, plugin work, and the ongoing maintenance that keeps a marketing site actually working.',
      meta: [
        { k: 'SYSTEM', v: 'ARCHIVED', cls: 'red' },
        { k: 'STATUS', v: 'DELIVERED', cls: 'pink' },
        { k: 'STACK', v: 'WordPress · Figma', cls: 'accent' },
        { k: 'ROLE', v: 'FRONTEND DEVELOPER' },
        { k: 'YEAR', v: '2021' },
      ],
      viz: 'paint',
      problem: 'A digital agency needed corporate websites turned around quickly and faithfully from Figma designs, for clients who cared about brand consistency but had ongoing WordPress sites that still needed care after launch.',
      decisions: "Visual implementation of websites straight from Figma designs, with theme customization and WordPress plugin work to match. Provided ongoing maintenance and technical support for sites already in production — the unglamorous half of agency frontend work that keeps a client happy for years, not just on launch day.",
      arch: [
        ['Figma designs', 'client-approved visual spec'],
        ['└─ WordPress theme', 'customized to spec'],
        ['└─ Plugins', 'configured per site'],
        ['Ongoing support', 'maintenance after launch'],
      ],
      stats: [
        { n: '2021', l: 'ENGAGEMENT' },
        { n: 'WP', l: 'THEME + PLUGINS' },
        { n: '✓', l: 'POST-LAUNCH SUPPORT' },
      ],
      tags: ['WordPress', 'Figma', 'Theming', 'Plugins', 'Maintenance'],
      tagsKey: ['k', 'k', 'm', 'm', 'm'],
    },
    es: {
      cat: 'N°3', sub: 'AGENCIA · 2021',
      name: 'Ink Agencia Digital', italic: '— sitios corporativos',
      blurb: 'Sitios corporativos en WordPress, construidos a partir de diseños en Figma — implementación visual, personalización de temas, trabajo con plugins, y el mantenimiento continuo que mantiene un sitio de marketing realmente funcionando.',
      meta: [
        { k: 'SISTEMA', v: 'ARCHIVADO', cls: 'red' },
        { k: 'ESTADO', v: 'ENTREGADO', cls: 'pink' },
        { k: 'STACK', v: 'WordPress · Figma', cls: 'accent' },
        { k: 'ROL', v: 'DESARROLLADORA FRONTEND' },
        { k: 'AÑO', v: '2021' },
      ],
      viz: 'paint',
      problem: 'Una agencia digital necesitaba sitios corporativos entregados rápido y fieles a los diseños en Figma, para clientes que cuidaban la consistencia de marca pero tenían sitios en WordPress que seguían necesitando atención después del lanzamiento.',
      decisions: 'Implementación visual de sitios directamente desde diseños en Figma, con personalización de temas y configuración de plugins de WordPress a la medida. Se brindó mantenimiento continuo y soporte técnico a sitios ya en producción — la mitad menos vistosa del trabajo frontend de agencia, la que mantiene contento a un cliente durante años, no solo el día del lanzamiento.',
      arch: [
        ['Diseños en Figma', 'especificación visual aprobada por el cliente'],
        ['└─ Tema de WordPress', 'personalizado según la especificación'],
        ['└─ Plugins', 'configurados por sitio'],
        ['Soporte continuo', 'mantenimiento post-lanzamiento'],
      ],
      stats: [
        { n: '2021', l: 'PROYECTO' },
        { n: 'WP', l: 'TEMA + PLUGINS' },
        { n: '✓', l: 'SOPORTE POST-LANZAMIENTO' },
      ],
      tags: ['WordPress', 'Figma', 'Theming', 'Plugins', 'Maintenance'],
      tagsKey: ['k', 'k', 'm', 'm', 'm'],
    },
  },
];
```

- [ ] **Step 3: Write the failing test — `src/components/System.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LangContext } from '../context/LangContext';
import { System } from './System';
import { SYSTEMS } from '../data/systems';

describe('System', () => {
  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <System data={SYSTEMS[0]} open={false} onToggle={onToggle} />
      </LangContext.Provider>
    );
    await user.click(screen.getByText('PAPPCORN'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('shows the expanded arrow glyph when open', () => {
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <System data={SYSTEMS[0]} open={true} onToggle={vi.fn()} />
      </LangContext.Provider>
    );
    expect(screen.getByText('×')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm run test -- System`
Expected: FAIL with "Cannot find module './System'"

- [ ] **Step 5: Write `src/components/System.tsx`**

```tsx
import { useLang } from '../hooks/useLang';
import type { SystemEntry } from '../data/systems';
import { VizBlueprint } from './viz/VizBlueprint';
import { VizArch } from './viz/VizArch';
import { VizSchema } from './viz/VizSchema';
import { VizPaint } from './viz/VizPaint';

const VIZ = {
  blueprint: <VizBlueprint />,
  arch: (
    <VizArch>
      <div className="node ng">[ Angular · Reactive Forms ]</div>
      <div className="arrow">│</div>
      <div className="node fb">[ Firebase · Firestore + Auth ]</div>
      <div className="arrow">│</div>
      <div className="node">[ REST APIs ]</div>
    </VizArch>
  ),
  schema: <VizSchema />,
  paint: <VizPaint />,
};

const SECTION_LABELS = {
  en: { problem: 'PROBLEM & CONTEXT', decisions: 'TECHNICAL DECISIONS', arch: 'ARCHITECTURE SKETCH', outcomes: 'OUTCOMES' },
  es: { problem: 'PROBLEMA Y CONTEXTO', decisions: 'DECISIONES TÉCNICAS', arch: 'BOCETO DE ARQUITECTURA', outcomes: 'RESULTADOS' },
};

interface SystemProps {
  data: SystemEntry;
  open: boolean;
  onToggle: () => void;
}

export function System({ data, open, onToggle }: SystemProps) {
  const { lang } = useLang();
  const c = data[lang];
  const labels = SECTION_LABELS[lang];

  return (
    <div className={`system ${open ? 'open' : ''}`} onClick={onToggle}>
      <div className="sys-head">
        <div className="cat">
          <span>{c.cat}</span>
          <span className="sub">{c.sub}</span>
        </div>
      </div>
      <div className="sys-name">
        <div className="name">
          {c.name} <em>{c.italic}</em>
          <span className="blurb">{c.blurb}</span>
        </div>
      </div>
      <div className="meta">
        {c.meta.map((m, i) => (
          <div key={i} className="row">
            <span className="k">{m.k}</span>
            <span className={`v ${m.cls || ''}`}>{m.v}</span>
          </div>
        ))}
      </div>
      <div className="viz">{VIZ[c.viz]}</div>
      <div className="open-arr">{open ? '×' : '↗'}</div>

      <div className="expand">
        <div className="expand-inner">
          <div>
            <h4>{labels.problem}</h4>
            <p>{c.problem}</p>
            <h4 style={{ marginTop: 24 }}>{labels.decisions}</h4>
            <p>{c.decisions}</p>
            <div className="tags">
              {c.tags.map((t, i) => (
                <span key={t} className={`tag ${c.tagsKey[i] || ''}`}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h4>{labels.arch}</h4>
            <div className="arch-block">
              {c.arch.map((row, i) => (
                <div key={i}>
                  <span className="a">{row[0]}</span>{'  '}<span className="f">{row[1]}</span>
                </div>
              ))}
            </div>
            <h4 style={{ marginTop: 24 }}>{labels.outcomes}</h4>
            <div className="stat-grid">
              {c.stats.map((s, i) => (
                <div key={i} className="stat">
                  <div className="n">{s.n}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test -- System`
Expected: `2 passed`

- [ ] **Step 7: Write the failing test — `src/components/Systems.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LangContext } from '../context/LangContext';
import { Systems } from './Systems';

describe('Systems', () => {
  it('starts with the first system open and others closed', () => {
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <Systems />
      </LangContext.Provider>
    );
    expect(screen.getAllByText('×')).toHaveLength(1);
  });

  it('closes the currently open system when a different one is clicked', async () => {
    const user = userEvent.setup();
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <Systems />
      </LangContext.Provider>
    );
    await user.click(screen.getByText('Cooking Program'));
    expect(screen.getAllByText('×')).toHaveLength(1);
    expect(screen.getByText('Cooking Program').closest('.system')).toHaveClass('open');
  });

  it('closes a system when it is clicked again', async () => {
    const user = userEvent.setup();
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <Systems />
      </LangContext.Provider>
    );
    await user.click(screen.getByText('PAPPCORN'));
    expect(screen.queryAllByText('×')).toHaveLength(0);
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `npm run test -- Systems`
Expected: FAIL with "Cannot find module './Systems'"

- [ ] **Step 9: Write `src/components/Systems.tsx`**

```tsx
import { useState } from 'react';
import { useLang } from '../hooks/useLang';
import { SYSTEMS } from '../data/systems';
import { System } from './System';

const HEAD = {
  en: { kicker: 'ACTIVE SYSTEMS · FROM THE ARCHIVE', h2a: 'Three systems, ', h2b: 'built in\nthe real world.', filters: ['ALL', 'ENTERPRISE', 'EDU', 'AGENCY'], shown: 'SHOWN' },
  es: { kicker: 'SISTEMAS ACTIVOS · DEL ARCHIVO', h2a: 'Tres sistemas, ', h2b: 'construidos en\nel mundo real.', filters: ['TODOS', 'EMPRESA', 'EDU', 'AGENCIA'], shown: 'MOSTRADOS' },
};

export function Systems() {
  const { lang } = useLang();
  const head = HEAD[lang];
  const [open, setOpen] = useState(0);

  return (
    <section className="section systems" id="systems" data-screen-label="03 Active Systems">
      <div className="shell">
        <div className="kicker" style={{ marginBottom: 16 }}>
          <span className="num">§03</span> &nbsp;/&nbsp; {head.kicker}
        </div>
        <div className="systems-head">
          <h2>{head.h2a}<em>{head.h2b}</em></h2>
          <div className="filter">
            {head.filters.map((f, i) => (
              <span key={f}>{i === 0 ? <b>{f}</b> : f}</span>
            ))}
          </div>
          <div className="count"><b>03 / 03</b>{head.shown}<br />2021 → 2026</div>
        </div>

        <div className="system-list">
          {SYSTEMS.map((s, i) => (
            <System
              key={s.id}
              data={s}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npm run test -- Systems`
Expected: `3 passed`

- [ ] **Step 11: Wire `Systems` into `App.tsx` and remove the legacy file**

In `src/App.tsx`:

```tsx
import { Systems } from './components/Systems';
```

```tsx
      <main>
        <Hero />
        <Operator />
        <Systems />
      </main>
```

```bash
rm artifacts.jsx
```

- [ ] **Step 12: Verify build and full test suite**

Run: `npm run build && npm run test`
Expected: build succeeds, all tests pass.

- [ ] **Step 13: Commit, push, verify deploy**

```bash
git add src/data/systems.ts src/components/viz src/components/System.tsx src/components/System.test.tsx src/components/Systems.tsx src/components/Systems.test.tsx src/App.tsx
git rm artifacts.jsx
git commit -m "feat: add Systems accordion with EN/ES copy (ES draft pending review), remove legacy artifacts.jsx"
git push
```

---

## Task 11: `Workbench` + `data/stack.ts` (ES draft) — Deploy 6

**Mode:** Guided (light) — reinforces array-to-DOM rendering with `.map()`/`key`, no new hooks.

**⚠ Translation review needed:** Spanish role/label text in `stack.ts` is drafted, not yet reviewed.

**Files:**
- Create: `src/data/stack.ts`, `src/components/Workbench.tsx`, `src/components/Workbench.test.tsx`
- Modify: `src/App.tsx` (render `<Workbench />` after `<Systems />`)
- Delete (end of this task): `workbench.jsx`

**Interfaces:**
- Consumes: `useLang` (Task 4).
- Produces: `export const STACK: Record<Lang, StackCopy>`, `export function Workbench()`.

- [ ] **Step 1: Write `src/data/stack.ts`**

```tsx
import type { Lang } from '../types';

interface StackItem { nm: string; role: string; yrs: string }
interface StackCategory { label: string; tag: string; items: StackItem[] }
interface ToolPosition extends StackItem { x: string; y: string; rot: number; v: string }

export interface StackCopy {
  kicker: string;
  h2a: string; h2b: string;
  meta: string;
  categories: StackCategory[];
  tools: ToolPosition[];
  deskLabel: string;
  figLabel: string;
  legend: string;
  legendScale: string;
}

const TOOL_POSITIONS = [
  { x: '4%', y: '6%', rot: -3, v: 'pink' },
  { x: '22%', y: '2%', rot: 2, v: 'amber' },
  { x: '40%', y: '10%', rot: -2, v: '' },
  { x: '58%', y: '4%', rot: 4, v: '' },
  { x: '78%', y: '12%', rot: -4, v: 'cyan' },
  { x: '8%', y: '28%', rot: 3, v: 'amber' },
  { x: '28%', y: '34%', rot: -2, v: '' },
  { x: '47%', y: '30%', rot: 2, v: 'ink' },
  { x: '68%', y: '36%', rot: -3, v: '' },
  { x: '85%', y: '32%', rot: 4, v: 'pink' },
  { x: '4%', y: '54%', rot: 2, v: 'cyan' },
  { x: '22%', y: '60%', rot: -3, v: '' },
  { x: '44%', y: '56%', rot: 3, v: 'ink' },
  { x: '64%', y: '62%', rot: -2, v: '' },
  { x: '82%', y: '56%', rot: 4, v: 'pink' },
  { x: '10%', y: '80%', rot: -3, v: '' },
  { x: '28%', y: '84%', rot: 2, v: 'amber' },
  { x: '46%', y: '82%', rot: -2, v: '' },
  { x: '64%', y: '86%', rot: 3, v: 'ink' },
  { x: '83%', y: '80%', rot: -3, v: '' },
];

function withPositions(items: StackItem[]): ToolPosition[] {
  return items.map((item, i) => ({ ...item, ...TOOL_POSITIONS[i] }));
}

const EN_ITEMS: StackItem[] = [
  { nm: 'Angular', role: 'framework', yrs: '04Y' },
  { nm: 'TypeScript', role: 'language', yrs: '04Y' },
  { nm: 'JavaScript', role: 'language', yrs: '04Y' },
  { nm: 'RxJS', role: 'streams', yrs: '04Y' },
  { nm: 'SCSS', role: 'styling', yrs: '04Y' },
  { nm: 'Firebase', role: 'platform', yrs: '04Y' },
  { nm: 'Firestore', role: 'database', yrs: '04Y' },
  { nm: 'Firebase Auth', role: 'identity', yrs: '04Y' },
  { nm: 'REST APIs', role: 'integration', yrs: '04Y' },
  { nm: 'Angular Material', role: 'components', yrs: '04Y' },
  { nm: 'Module Federation', role: 'architecture', yrs: '02Y' },
  { nm: 'Nx', role: 'monorepo', yrs: '02Y' },
  { nm: 'Reactive Forms', role: 'forms', yrs: '04Y' },
  { nm: 'Ionic', role: 'hybrid mobile', yrs: '01Y' },
  { nm: 'Capacitor', role: 'native bridge', yrs: '01Y' },
  { nm: 'Git · GitHub', role: 'version control', yrs: '04Y' },
  { nm: 'Figma', role: 'design handoff', yrs: '04Y' },
  { nm: 'Scrum · Agile', role: 'process', yrs: '04Y' },
  { nm: 'SOLID', role: 'design principles', yrs: '04Y' },
  { nm: 'Clean Code', role: 'craft', yrs: '04Y' },
];

const ES_ITEMS: StackItem[] = [
  { nm: 'Angular', role: 'framework', yrs: '04A' },
  { nm: 'TypeScript', role: 'lenguaje', yrs: '04A' },
  { nm: 'JavaScript', role: 'lenguaje', yrs: '04A' },
  { nm: 'RxJS', role: 'streams', yrs: '04A' },
  { nm: 'SCSS', role: 'estilos', yrs: '04A' },
  { nm: 'Firebase', role: 'plataforma', yrs: '04A' },
  { nm: 'Firestore', role: 'base de datos', yrs: '04A' },
  { nm: 'Firebase Auth', role: 'identidad', yrs: '04A' },
  { nm: 'REST APIs', role: 'integración', yrs: '04A' },
  { nm: 'Angular Material', role: 'componentes', yrs: '04A' },
  { nm: 'Module Federation', role: 'arquitectura', yrs: '02A' },
  { nm: 'Nx', role: 'monorepo', yrs: '02A' },
  { nm: 'Reactive Forms', role: 'formularios', yrs: '04A' },
  { nm: 'Ionic', role: 'móvil híbrido', yrs: '01A' },
  { nm: 'Capacitor', role: 'puente nativo', yrs: '01A' },
  { nm: 'Git · GitHub', role: 'control de versiones', yrs: '04A' },
  { nm: 'Figma', role: 'entrega de diseño', yrs: '04A' },
  { nm: 'Scrum · Agile', role: 'proceso', yrs: '04A' },
  { nm: 'SOLID', role: 'principios de diseño', yrs: '04A' },
  { nm: 'Clean Code', role: 'oficio', yrs: '04A' },
];

export const STACK: Record<Lang, StackCopy> = {
  en: {
    kicker: 'CURRENT STACK · INSTRUMENTS IN ROTATION',
    h2a: 'Tools, ', h2b: "laid out\nlike I'd find them\nat dawn.",
    meta: "A working list — what I actually use on production code today. Years are years in shipping code, not years dabbled. Angular + Firebase + microfrontends is the spine; Ionic/Capacitor is the newest addition.",
    categories: [
      { label: 'Frontend', tag: 'DAILY', items: [EN_ITEMS[0], EN_ITEMS[1], EN_ITEMS[2], { nm: 'HTML5', role: 'markup', yrs: '04Y' }, EN_ITEMS[4], EN_ITEMS[3], EN_ITEMS[9], EN_ITEMS[12], { nm: 'Responsive Design', role: 'layout', yrs: '04Y' }] },
      { label: 'Backend / BaaS', tag: 'DAILY', items: [EN_ITEMS[5], EN_ITEMS[6], EN_ITEMS[7], EN_ITEMS[8]] },
      { label: 'Mobile', tag: 'GROWING', items: [EN_ITEMS[13], EN_ITEMS[14]] },
      { label: 'Architecture', tag: 'SCALE', items: [EN_ITEMS[10], EN_ITEMS[11]] },
      { label: 'Tools', tag: 'DAILY', items: [{ nm: 'Git', role: 'version control', yrs: '04Y' }, { nm: 'GitHub', role: 'collaboration', yrs: '04Y' }, EN_ITEMS[16]] },
      { label: 'Methodology', tag: 'PRACTICE', items: [{ nm: 'Scrum', role: 'process', yrs: '04Y' }, { nm: 'Agile', role: 'process', yrs: '04Y' }, EN_ITEMS[18], EN_ITEMS[19]] },
    ],
    tools: withPositions(EN_ITEMS),
    deskLabel: '⬒ DESK VIEW · 10:42 AM · BOGOTÁ',
    figLabel: 'FIG. 04 — INSTRUMENT TABLEAU',
    legend: '● PRIMARY \u00A0 ○ SECONDARY \u00A0 ⬓ GROWING',
    legendScale: 'SCALE 1:1 · ALL TOOLS IN ACTIVE ROTATION',
  },
  es: {
    kicker: 'STACK ACTUAL · INSTRUMENTOS EN ROTACIÓN',
    h2a: 'Herramientas, ', h2b: 'dispuestas\ncomo las encontraría\nal amanecer.',
    meta: 'Una lista de trabajo — lo que realmente uso hoy en código de producción. Los años son años entregando código, no años probando algo. Angular + Firebase + microfrontends es la columna vertebral; Ionic/Capacitor es la incorporación más reciente.',
    categories: [
      { label: 'Frontend', tag: 'DIARIO', items: [ES_ITEMS[0], ES_ITEMS[1], ES_ITEMS[2], { nm: 'HTML5', role: 'marcado', yrs: '04A' }, ES_ITEMS[4], ES_ITEMS[3], ES_ITEMS[9], ES_ITEMS[12], { nm: 'Responsive Design', role: 'maquetación', yrs: '04A' }] },
      { label: 'Backend / BaaS', tag: 'DIARIO', items: [ES_ITEMS[5], ES_ITEMS[6], ES_ITEMS[7], ES_ITEMS[8]] },
      { label: 'Móvil', tag: 'CRECIENDO', items: [ES_ITEMS[13], ES_ITEMS[14]] },
      { label: 'Arquitectura', tag: 'ESCALA', items: [ES_ITEMS[10], ES_ITEMS[11]] },
      { label: 'Herramientas', tag: 'DIARIO', items: [{ nm: 'Git', role: 'control de versiones', yrs: '04A' }, { nm: 'GitHub', role: 'colaboración', yrs: '04A' }, ES_ITEMS[16]] },
      { label: 'Metodología', tag: 'PRÁCTICA', items: [{ nm: 'Scrum', role: 'proceso', yrs: '04A' }, { nm: 'Agile', role: 'proceso', yrs: '04A' }, ES_ITEMS[18], ES_ITEMS[19]] },
    ],
    tools: withPositions(ES_ITEMS),
    deskLabel: '⬒ VISTA DEL ESCRITORIO · 10:42 AM · BOGOTÁ',
    figLabel: 'FIG. 04 — TABLEAU DE INSTRUMENTOS',
    legend: '● PRINCIPAL \u00A0 ○ SECUNDARIO \u00A0 ⬓ CRECIENDO',
    legendScale: 'ESCALA 1:1 · TODAS LAS HERRAMIENTAS EN ROTACIÓN ACTIVA',
  },
};
```

- [ ] **Step 2: Write the failing test — `src/components/Workbench.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangContext } from '../context/LangContext';
import { Workbench } from './Workbench';

describe('Workbench', () => {
  it('renders the Spanish category labels when lang is es', () => {
    render(
      <LangContext.Provider value={{ lang: 'es', setLang: vi.fn() }}>
        <Workbench />
      </LangContext.Provider>
    );
    expect(screen.getByText('Arquitectura')).toBeInTheDocument();
  });

  it('renders the English category labels when lang is en', () => {
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <Workbench />
      </LangContext.Provider>
    );
    expect(screen.getByText('Architecture')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test -- Workbench`
Expected: FAIL with "Cannot find module './Workbench'"

- [ ] **Step 4: Write `src/components/Workbench.tsx`**

```tsx
import { useLang } from '../hooks/useLang';
import { STACK } from '../data/stack';

export function Workbench() {
  const { lang } = useLang();
  const c = STACK[lang];

  return (
    <section className="section workbench" id="stack" data-screen-label="04 Current Stack">
      <div className="shell">
        <div className="kicker"><span className="num">§04</span> &nbsp;/&nbsp; {c.kicker}</div>

        <div className="workbench-head" style={{ marginTop: 24 }}>
          <h2>{c.h2a}<em>{c.h2b}</em></h2>
          <div className="meta">{c.meta}</div>
        </div>

        <div className="stack-cats">
          {c.categories.map((cat, i) => (
            <div key={i} className="cat">
              <div className="label">
                <span>{cat.label}</span>
                <b>·&nbsp;{cat.tag}</b>
              </div>
              <div className="items">
                {cat.items.map((it, k) => (
                  <div key={k} className="item">
                    <span className="nm">{it.nm}</span>
                    <span className="role">{it.role}</span>
                    <span className="yrs">{it.yrs}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bench">
          <div className="corner-tag">{c.deskLabel}</div>
          <div className="corner-tag r">{c.figLabel}</div>

          {c.tools.map((t, i) => (
            <div key={i} className={`tool ${t.v}`} style={{ left: t.x, top: t.y, transform: `rotate(${t.rot}deg)` }}>
              <div className="name">{t.nm}</div>
              <div className="role">{t.role}</div>
              <div className="yrs">{t.yrs}</div>
            </div>
          ))}

          <div className="legend">
            <span>{c.legend}</span>
            <span>{c.legendScale}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- Workbench`
Expected: `2 passed`

- [ ] **Step 6: Wire `Workbench` into `App.tsx` and remove the legacy file**

In `src/App.tsx`:

```tsx
import { Workbench } from './components/Workbench';
```

```tsx
      <main>
        <Hero />
        <Operator />
        <Systems />
        <Workbench />
      </main>
```

```bash
rm workbench.jsx
```

- [ ] **Step 7: Verify build and full test suite**

Run: `npm run build && npm run test`
Expected: build succeeds, all tests pass.

- [ ] **Step 8: Commit, push, verify deploy**

```bash
git add src/data/stack.ts src/components/Workbench.tsx src/components/Workbench.test.tsx src/App.tsx
git rm workbench.jsx
git commit -m "feat: add Workbench section with EN/ES copy (ES draft pending review), remove legacy workbench.jsx"
git push
```

---

## Task 12: `Log` + `data/commits.ts` (ES draft) — Deploy 7

**Mode:** Guided (light) — reinforces array-to-DOM rendering, no new hooks.

**⚠ Translation review needed:** Spanish text in `commits.ts` (`msg`, `where`, `text`) is drafted, not yet reviewed.

**Files:**
- Create: `src/data/commits.ts`, `src/components/Log.tsx`, `src/components/Log.test.tsx`
- Modify: `src/App.tsx` (render `<Log />` after `<Workbench />`)
- Delete (end of this task): `log.jsx`

**Interfaces:**
- Consumes: `useLang` (Task 4).
- Produces: `export const LOG_COPY: Record<Lang, LogCopy>`, `export function Log()`.

- [ ] **Step 1: Write `src/data/commits.ts`**

```tsx
import type { Lang } from '../types';

interface Commit {
  hash: string; when: string; label?: string; head?: boolean;
  branch: string; tag: string;
  msg: string; italic: string;
  where: string; text: string;
  add: string; rem: string; files: string;
}

export interface LogCopy {
  kicker: string;
  h2a: string; h2b: string;
  metaIntro: string;
  branchLine: string;
  commits: Commit[];
  footer: string;
}

export const LOG_COPY: Record<Lang, LogCopy> = {
  en: {
    kicker: 'LOGBOOK · DEPLOYMENT HISTORY',
    h2a: 'The career, ', h2b: 'rebased\nchronologically.',
    metaIntro: 'The story as it happened — HEAD points at today, commits scroll back to the first push in 2021. No résumé bullets, no metrics theatre. Just the order things actually shipped, alongside a Software Engineering degree finishing this year.',
    branchLine: 'git log --since="2021-01" --oneline · branch=main',
    commits: [
      {
        hash: 'a7f3c91', when: '2021 · OCT', label: 'HEAD', head: true,
        branch: 'main', tag: 'role/active',
        msg: 'feat: still shipping PAPPCORN, four years in', italic: '— current',
        where: 'PAPPCORN · Enterprise management, remote',
        text: 'Developing and maintaining the Angular + TypeScript frontend since 2021 — Firebase integration for data and auth, a migration to microfrontends with Module Federation and Nx, new features in Angular Material and Reactive Forms, and performance passes alongside functional testing in an agile team.',
        add: '+38,120', rem: '−9,480', files: '210 files',
      },
      {
        hash: '9bce014', when: '2021 · JUN',
        branch: 'exp', tag: 'edu/2021-2023',
        msg: 'feat(cooking-program): educational interfaces, SOLID by default', italic: '',
        where: 'Cooking Program · Educational platforms',
        text: 'Built interfaces for educational and technical-training platforms with Angular and Firebase, applying SOLID and Clean Code to keep things maintainable. Added automated tests to protect delivered functionality, and helped train the team on better development practices.',
        add: '+14,208', rem: '−2,340', files: '96 files',
      },
      {
        hash: '4d18ee2', when: '2021 · MAR',
        branch: 'exp', tag: 'agency/wp',
        msg: 'feat(ink): corporate sites, pixel-faithful to Figma', italic: '',
        where: 'Ink Agencia Digital · WordPress',
        text: 'Visual implementation of corporate websites from Figma designs, with WordPress theme customization and plugin configuration. Kept providing maintenance and technical support on sites already live.',
        add: '+6,140', rem: '−820', files: '38 files',
      },
      {
        hash: 'f1e8d05', when: '2021 · JAN',
        branch: 'main', tag: 'init',
        msg: 'init: Técnico Front-End, Instituto Kuepa', italic: '— Beca Fundación Citibank',
        where: 'Instituto Kuepa · Data Processing & Front-End',
        text: 'Finished a technical program in Data Processing and Front-End development on a Fundación Citibank scholarship. First real exposure to shipping web interfaces — and the year everything else on this page started from.',
        add: '+1', rem: '−0', files: '1 file',
      },
    ],
    footer: '4 of 4 commits shown',
  },
  es: {
    kicker: 'BITÁCORA · HISTORIAL DE DESPLIEGUES',
    h2a: 'La carrera, ', h2b: 'reordenada\ncronológicamente.',
    metaIntro: 'La historia tal como pasó — HEAD apunta a hoy, los commits retroceden hasta el primer push en 2021. Sin viñetas de hoja de vida, sin teatro de métricas. Solo el orden en que las cosas realmente salieron a producción, junto a una carrera de Ingeniería de Software que termina este año.',
    branchLine: 'git log --since="2021-01" --oneline · branch=main',
    commits: [
      {
        hash: 'a7f3c91', when: '2021 · OCT', label: 'HEAD', head: true,
        branch: 'main', tag: 'role/active',
        msg: 'feat: sigo entregando PAPPCORN, cuatro años después', italic: '— actual',
        where: 'PAPPCORN · Gestión empresarial, remoto',
        text: 'Desarrollo y mantenimiento del frontend en Angular + TypeScript desde 2021 — integración con Firebase para datos y autenticación, migración a microfrontends con Module Federation y Nx, nuevas funcionalidades en Angular Material y Reactive Forms, y mejoras de rendimiento junto con pruebas funcionales en un equipo ágil.',
        add: '+38,120', rem: '−9,480', files: '210 files',
      },
      {
        hash: '9bce014', when: '2021 · JUN',
        branch: 'exp', tag: 'edu/2021-2023',
        msg: 'feat(cooking-program): interfaces educativas, SOLID por defecto', italic: '',
        where: 'Cooking Program · Plataformas educativas',
        text: 'Interfaces construidas para plataformas educativas y de formación técnica con Angular y Firebase, aplicando SOLID y Clean Code para mantener el código manejable. Se agregaron pruebas automatizadas para proteger la funcionalidad entregada, y se ayudó a formar al equipo en mejores prácticas de desarrollo.',
        add: '+14,208', rem: '−2,340', files: '96 files',
      },
      {
        hash: '4d18ee2', when: '2021 · MAR',
        branch: 'exp', tag: 'agency/wp',
        msg: 'feat(ink): sitios corporativos, fieles al píxel del Figma', italic: '',
        where: 'Ink Agencia Digital · WordPress',
        text: 'Implementación visual de sitios corporativos a partir de diseños en Figma, con personalización de temas y configuración de plugins en WordPress. Se mantuvo el soporte técnico y mantenimiento de sitios ya en producción.',
        add: '+6,140', rem: '−820', files: '38 files',
      },
      {
        hash: 'f1e8d05', when: '2021 · ENE',
        branch: 'main', tag: 'init',
        msg: 'init: Técnico Front-End, Instituto Kuepa', italic: '— Beca Fundación Citibank',
        where: 'Instituto Kuepa · Procesamiento de Datos y Front-End',
        text: 'Programa técnico terminado en Procesamiento de Datos y desarrollo Front-End, con una beca de la Fundación Citibank. Primer contacto real con entregar interfaces web — y el año del que arranca todo lo demás en esta página.',
        add: '+1', rem: '−0', files: '1 file',
      },
    ],
    footer: '4 de 4 commits mostrados',
  },
};
```

- [ ] **Step 2: Write the failing test — `src/components/Log.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangContext } from '../context/LangContext';
import { Log } from './Log';

describe('Log', () => {
  it('renders the Spanish commit message when lang is es', () => {
    render(
      <LangContext.Provider value={{ lang: 'es', setLang: vi.fn() }}>
        <Log />
      </LangContext.Provider>
    );
    expect(screen.getByText(/sigo entregando PAPPCORN/)).toBeInTheDocument();
  });

  it('renders the English commit message when lang is en', () => {
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <Log />
      </LangContext.Provider>
    );
    expect(screen.getByText(/still shipping PAPPCORN/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test -- Log`
Expected: FAIL with "Cannot find module './Log'"

- [ ] **Step 4: Write `src/components/Log.tsx`**

```tsx
import { useLang } from '../hooks/useLang';
import { LOG_COPY } from '../data/commits';

export function Log() {
  const { lang } = useLang();
  const c = LOG_COPY[lang];

  return (
    <section className="section log" id="logbook" data-screen-label="05 Logbook">
      <div className="shell">
        <div className="log-head">
          <div className="kicker"><span className="num">§05</span> &nbsp;/&nbsp; {c.kicker}</div>
          <div style={{ height: 16 }}></div>
          <div className="row">
            <h2>{c.h2a}<em>{c.h2b}</em></h2>
            <div className="meta">
              {c.metaIntro}
              <div className="branch">{c.branchLine}</div>
            </div>
          </div>
        </div>

        <div className="commits">
          {c.commits.map((commit, i) => (
            <div key={i} className={`commit ${commit.head ? 'h' : ''}`}>
              <div className="dot"></div>
              <div className="when">
                {commit.when}
                {commit.label ? <b style={{ color: 'var(--green)' }}>← {commit.label}</b> : null}
              </div>
              <div className="body">
                <div className="when-inline">{commit.when}{commit.label ? ' · ← ' + commit.label : ''}</div>
                <div className="head-row">
                  <span className="hash">{commit.hash}</span>
                  <span className={`branch-pill ${commit.branch === 'main' ? 'main' : 'exp'}`}>{commit.branch}</span>
                  <span className="branch-pill">{commit.tag}</span>
                </div>
                <div className="msg">{commit.msg} {commit.italic ? <em>{commit.italic}</em> : null}</div>
                <div className="where">where: <b>{commit.where}</b></div>
                <div className="text">{commit.text}</div>
                <div className="changes">
                  <span className="add">{commit.add}</span>
                  <span className="rem">{commit.rem}</span>
                  <span className="file">{commit.files}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 24, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--paper-faint)',
          letterSpacing: '0.08em', wordBreak: 'break-word',
        }}>
          $ <span style={{ color: 'var(--green)' }}>git log</span> --oneline · <span style={{ color: 'var(--paper)' }}>{c.footer}</span> · <span style={{ color: 'var(--amber)' }}>q to quit</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- Log`
Expected: `2 passed`

- [ ] **Step 6: Wire `Log` into `App.tsx` and remove the legacy file**

In `src/App.tsx`:

```tsx
import { Log } from './components/Log';
```

```tsx
      <main>
        <Hero />
        <Operator />
        <Systems />
        <Workbench />
        <Log />
      </main>
```

```bash
rm log.jsx
```

- [ ] **Step 7: Verify build and full test suite**

Run: `npm run build && npm run test`
Expected: build succeeds, all tests pass.

- [ ] **Step 8: Commit, push, verify deploy**

```bash
git add src/data/commits.ts src/components/Log.tsx src/components/Log.test.tsx src/App.tsx
git rm log.jsx
git commit -m "feat: add Log section with EN/ES copy (ES draft pending review), remove legacy log.jsx"
git push
```

---

## Task 13: `Transmission` (ES draft) + final cleanup — Deploy 8 (site complete)

**Mode:** Guided (light) — static content, reuses `data/sections.ts` (Task 3) for the colophon index instead of a hardcoded list, closing out the "single source of truth" improvement from the design.

**⚠ Translation review needed:** Spanish text in `transmission.ts` is drafted, not yet reviewed.

**Files:**
- Create: `src/data/transmission.ts`, `src/components/Transmission.tsx`, `src/components/Transmission.test.tsx`
- Modify: `src/App.tsx` (render `<Transmission />` after `<Log />`)
- Delete (end of this task): `transmission.jsx`, `app.jsx`, `i18n.jsx`, `nav.jsx`

**Interfaces:**
- Consumes: `useLang` (Task 4), `SECTIONS` (Task 3, for the colophon index).
- Produces: `export const TRANSMISSION_COPY: Record<Lang, TransmissionCopy>`, `export function Transmission()`.

- [ ] **Step 1: Write `src/data/transmission.ts`**

```tsx
import type { Lang } from '../types';

export interface TransmissionCopy {
  kicker: string;
  formTag: string; formStamp: string;
  h2a: string; h2b: string;
  sub: string;
  fieldFrom: string; fieldSubject: string; fieldSubjectValue: string;
  fieldChannel: string; fieldScope: string; fieldStack: string; fieldMessage: string; fieldSignature: string;
  sendLabel: string; replyNote: string;
  channelsHead: string;
  emailLabel: string; phoneLabel: string; githubLabel: string; linkedinLabel: string; cvLabel: string; socialLabel: string;
  availabilityHead: string; availabilityBody: string;
  colophonBig1: string; colophonBig2: string; colophonAbout: string;
  indexHead: string; colophonHead: string; statusHead: string;
  colophonList: string[];
  statusList: string[];
  bottom: string[];
}

export const TRANSMISSION_COPY: Record<Lang, TransmissionCopy> = {
  en: {
    kicker: 'OUTBOUND TRANSMISSION · FORM 17-B',
    formTag: 'FORM 17-B · OUTBOUND · REV. 04', formStamp: 'URGENT / OPEN',
    h2a: 'Send something my way.', h2b: 'I read everything.',
    sub: "Hailing frequencies open for new engagements — startups with an Angular frontend, teams running microfrontends, or products that need Firebase wired in properly. Currently finishing my Software Engineering degree, so I'm honest about timelines.",
    fieldFrom: 'FROM', fieldSubject: 'SUBJECT', fieldSubjectValue: "a project you'd like built well",
    fieldChannel: 'CHANNEL', fieldScope: 'SCOPE', fieldStack: 'STACK', fieldMessage: 'MESSAGE', fieldSignature: 'SIGNATURE',
    sendLabel: 'Transmit', replyNote: 'REPLY · 24–48 HRS · M–F',
    channelsHead: 'OR REACH ME ON A DIFFERENT FREQUENCY',
    emailLabel: 'EMAIL · PREFERRED', phoneLabel: 'PHONE · WHATSAPP', githubLabel: 'GITHUB · CODE', linkedinLabel: 'LINKEDIN · WORK', cvLabel: 'READ.CV · CV', socialLabel: 'X & BLUESKY',
    availabilityHead: 'ACCEPTING WORK · Q3 2026',
    availabilityBody: "Open to new engagements. Looking for Angular/Firebase/microfrontend projects. Wrapping up my degree, so I'm upfront about available hours.",
    colophonBig1: 'Frontend systems,', colophonBig2: 'written by hand.',
    colophonAbout: 'A field notebook of frontend craft. Maintained from Bogotá since 2021. Built around Angular, Firebase and microfrontends.',
    indexHead: 'INDEX', colophonHead: 'COLOPHON', statusHead: 'STATUS',
    colophonList: ['Set in Space Grotesk', 'Display in Instrument Serif', 'Labels in JetBrains Mono', 'Hand-coded, no template', 'Deployed on GitHub Pages', 'Last revised — July 2026'],
    statusList: ['● ALL SYSTEMS NOMINAL', 'Build · #2026.07', 'Uptime · 1,892 days', 'Lighthouse · 99 / 100 / 100 / 100', 'Cookies · zero, always'],
    bottom: ['© 2026 MARÍA PAULA VARGAS — ALL RIGHTS, NO TEMPLATES.', 'HAND-CODED · BOGOTÁ · 4.7110° N / 74.0721° W', 'END OF DOCUMENT — TURN PAGE TO RESTART'],
  },
  es: {
    kicker: 'TRANSMISIÓN SALIENTE · FORMULARIO 17-B',
    formTag: 'FORMULARIO 17-B · SALIENTE · REV. 04', formStamp: 'URGENTE / ABIERTO',
    h2a: 'Mándame algo.', h2b: 'Lo leo todo.',
    sub: 'Frecuencias abiertas para nuevos proyectos — startups con frontend en Angular, equipos corriendo microfrontends, o productos que necesiten Firebase bien integrado. Actualmente terminando mi carrera de Ingeniería de Software, así que soy honesta sobre los tiempos.',
    fieldFrom: 'DE', fieldSubject: 'ASUNTO', fieldSubjectValue: 'un proyecto que quieras construido bien',
    fieldChannel: 'CANAL', fieldScope: 'ALCANCE', fieldStack: 'STACK', fieldMessage: 'MENSAJE', fieldSignature: 'FIRMA',
    sendLabel: 'Transmitir', replyNote: 'RESPUESTA · 24–48 HRS · L–V',
    channelsHead: 'O ESCRÍBEME EN OTRA FRECUENCIA',
    emailLabel: 'EMAIL · PREFERIDO', phoneLabel: 'TELÉFONO · WHATSAPP', githubLabel: 'GITHUB · CÓDIGO', linkedinLabel: 'LINKEDIN · TRABAJO', cvLabel: 'READ.CV · CV', socialLabel: 'X Y BLUESKY',
    availabilityHead: 'ACEPTANDO TRABAJO · Q3 2026',
    availabilityBody: 'Abierta a nuevos proyectos. Buscando proyectos de Angular/Firebase/microfrontends. Terminando mi carrera, así que soy directa sobre las horas disponibles.',
    colophonBig1: 'Sistemas de frontend,', colophonBig2: 'escritos a mano.',
    colophonAbout: 'Un cuaderno de campo de oficio frontend. Mantenido desde Bogotá desde 2021. Construido alrededor de Angular, Firebase y microfrontends.',
    indexHead: 'ÍNDICE', colophonHead: 'COLOFÓN', statusHead: 'ESTADO',
    colophonList: ['Compuesto en Space Grotesk', 'Display en Instrument Serif', 'Etiquetas en JetBrains Mono', 'Escrito a mano, sin plantilla', 'Desplegado en GitHub Pages', 'Última revisión — julio 2026'],
    statusList: ['● TODOS LOS SISTEMAS NOMINALES', 'Build · #2026.07', 'Uptime · 1.892 días', 'Lighthouse · 99 / 100 / 100 / 100', 'Cookies · cero, siempre'],
    bottom: ['© 2026 MARÍA PAULA VARGAS — TODOS LOS DERECHOS, NINGUNA PLANTILLA.', 'ESCRITO A MANO · BOGOTÁ · 4.7110° N / 74.0721° O', 'FIN DEL DOCUMENTO — PASA LA PÁGINA PARA REINICIAR'],
  },
};
```

- [ ] **Step 2: Write the failing test — `src/components/Transmission.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangContext } from '../context/LangContext';
import { Transmission } from './Transmission';

describe('Transmission', () => {
  it('renders the Spanish call-to-action when lang is es', () => {
    render(
      <LangContext.Provider value={{ lang: 'es', setLang: vi.fn() }}>
        <Transmission />
      </LangContext.Provider>
    );
    expect(screen.getByText('Mándame algo.')).toBeInTheDocument();
  });

  it('renders the colophon index using the unified SECTIONS data', () => {
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: vi.fn() }}>
        <Transmission />
      </LangContext.Provider>
    );
    expect(screen.getByText(/§03 — Active systems/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test -- Transmission`
Expected: FAIL with "Cannot find module './Transmission'"

- [ ] **Step 4: Write `src/components/Transmission.tsx`**

```tsx
import { useLang } from '../hooks/useLang';
import { TRANSMISSION_COPY } from '../data/transmission';
import { SECTIONS } from '../data/sections';

export function Transmission() {
  const { lang } = useLang();
  const c = TRANSMISSION_COPY[lang];

  return (
    <section className="section transmission" id="transmit" data-screen-label="06 Transmission">
      <div className="shell">
        <div className="kicker" style={{ marginBottom: 28 }}>
          <span className="num">§06</span> &nbsp;/&nbsp; {c.kicker}
        </div>

        <div className="tx">
          <div className="tx-grid">
            <div className="tx-left">
              <div className="tx-form-tag">
                <span>{c.formTag}</span>
                <span className="stamp">{c.formStamp}</span>
              </div>

              <h2>
                {c.h2a}<br />
                <em>{c.h2b}</em>
              </h2>
              <p className="sub">{c.sub}</p>

              <div className="tx-fields">
                <div className="tx-row">
                  <div className="k">{c.fieldFrom}</div>
                  <div className="v">name@your.studio &nbsp; <span style={{ color: 'var(--paper-faint)' }}>// sender</span></div>
                </div>
                <div className="tx-row">
                  <div className="k">{c.fieldSubject}</div>
                  <div className="v accent">{c.fieldSubjectValue}</div>
                </div>
                <div className="tx-row">
                  <div className="k">{c.fieldChannel}</div>
                  <div className="v">▣ EMAIL &nbsp; ▢ CALL &nbsp; ▢ IN PERSON</div>
                </div>
                <div className="tx-row">
                  <div className="k">{c.fieldScope}</div>
                  <div className="v">
                    <span style={{ color: 'var(--cyan)' }}>▣</span> FULL BUILD &nbsp;
                    <span style={{ color: 'var(--cyan)' }}>▣</span> CONSULT &nbsp;
                    <span style={{ color: 'var(--paper-faint)' }}>▢</span> AUDIT &nbsp;
                    <span style={{ color: 'var(--paper-faint)' }}>▢</span> SPEAK
                  </div>
                </div>
                <div className="tx-row">
                  <div className="k">{c.fieldStack}</div>
                  <div className="v cyan">Angular &nbsp;·&nbsp; TypeScript &nbsp;·&nbsp; Firebase &nbsp;·&nbsp; Microfrontends</div>
                </div>
                <div className="tx-row signature">
                  <div className="k">{c.fieldSignature}</div>
                  <div className="v"><span className="sig">— your name here</span></div>
                </div>
              </div>

              <div className="tx-submit">
                <a href="mailto:14mariapaula09@gmail.com?subject=Form%2017-B%20%E2%80%94%20outbound" className="btn-send">
                  {c.sendLabel}
                  <span className="arrow">↗</span>
                </a>
                <div className="note">{c.replyNote}</div>
              </div>
            </div>

            <div className="tx-right">
              <div className="corner">CHANNELS · OPEN</div>
              <h3>{c.channelsHead}</h3>

              <a className="channel-row" href="mailto:14mariapaula09@gmail.com">
                <div><div className="l">{c.emailLabel}</div><div className="v">14mariapaula09@gmail.com</div></div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="tel:+573177662396">
                <div><div className="l">{c.phoneLabel}</div><div className="v">+57 317 766 2396</div></div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="https://github.com/mariapaulav03">
                <div><div className="l">{c.githubLabel}</div><div className="v">github.com/mariapaulav03</div></div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="https://linkedin.com/in/maria-paula-vargas-10b7a0208">
                <div><div className="l">{c.linkedinLabel}</div><div className="v">linkedin.com/in/maria-paula-vargas</div></div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="#">
                <div><div className="l">{c.cvLabel}</div><div className="v">read.cv/mariapaulav</div></div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="#">
                <div><div className="l">{c.socialLabel}</div><div className="v">@mariapaulav · everywhere</div></div>
                <div className="arr">↗</div>
              </a>

              <div className="availability">
                <div className="h"><span className="led"></span> {c.availabilityHead}</div>
                <p>{c.availabilityBody}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="colophon">
          <div className="grid">
            <div>
              <h4>PAULA LABS</h4>
              <div className="big">{c.colophonBig1}<br /><span className="dot">·</span> {c.colophonBig2}</div>
              <div style={{ marginTop: 24, color: 'var(--paper-dim)', fontFamily: 'var(--f-sans)', fontSize: 14, lineHeight: 1.6, maxWidth: '42ch' }}>
                {c.colophonAbout}
              </div>
            </div>
            <div>
              <h4>{c.indexHead}</h4>
              <ul>
                {SECTIONS.map((s) => (
                  <li key={s.id}><a href={'#' + s.id}>{s.number} — {s.colophonLabel[lang]}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4>{c.colophonHead}</h4>
              <ul>{c.colophonList.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h4>{c.statusHead}</h4>
              <ul>
                {c.statusList.map((item, i) => (
                  <li key={item} style={i === 0 ? { color: 'var(--green)' } : undefined}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bottom">
            {c.bottom.map((line) => <span key={line}>{line}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- Transmission`
Expected: `2 passed`

- [ ] **Step 6: Wire `Transmission` into `App.tsx` and remove all remaining legacy files**

In `src/App.tsx`:

```tsx
import { Transmission } from './components/Transmission';
```

```tsx
      <main>
        <Hero />
        <Operator />
        <Systems />
        <Workbench />
        <Log />
        <Transmission />
      </main>
```

```bash
rm transmission.jsx app.jsx i18n.jsx nav.jsx
```

- [ ] **Step 7: Verify build and full test suite**

Run: `npm run build && npm run test`
Expected: build succeeds, all tests pass, `npm run test` shows every test file from Tasks 1–13.

- [ ] **Step 8: Commit, push, verify deploy**

```bash
git add src/data/transmission.ts src/components/Transmission.tsx src/components/Transmission.test.tsx src/App.tsx
git rm transmission.jsx app.jsx i18n.jsx nav.jsx
git commit -m "feat: add Transmission section with EN/ES copy (ES draft pending review), remove all legacy CDN-era files"
git push
```

- [ ] **Step 9: Full manual walkthrough on the deployed site**

Visit `https://mariapaulav03.github.io/paula-labs/`:
- Scroll through all six sections in English, confirm visual parity with the pre-migration site.
- Toggle to Spanish, confirm every section (not just Nav/Hero) renders translated content.
- Click through the Systems accordion, confirm only one card is open at a time.
- Resize to mobile width, confirm the rail collapses to short labels (`§01`..`§06`) as before.

---

## Success Criteria Mapping

| Spec criterion | Verified by |
|---|---|
| Visual parity in English | Task 13, Step 9 manual walkthrough |
| Fully bilingual, including previously English-only sections | Tasks 6–13 tests + Task 13 Step 9 |
| `npm run dev` / automatic deploy on push to `main` | Task 1 (dev/build), Task 2 (Actions workflow) |
| Separate git/SSH identity for this repo | Already configured and verified (SSH `github-personal`, local `git config`) prior to this plan; Task 2 uses it for the remote |
| Minimal automated tests: lang toggle, Systems accordion, active-section detection | Task 7 (`SiteNav` toggle), Task 10 (`Systems` accordion), Task 5 (`useActiveSection`) |
| Owner can explain new React concepts vs. Angular equivalents | Ongoing during guided steps in Tasks 4, 5, 6, 10 — not independently verifiable by a test, revisit conversationally at the end of each guided task |

## Self-Review Notes

- **Spec coverage:** all six spec sections (setup/tooling, folder structure, bilingual content, state/data flow, testing, build sequence) map to at least one task above; the "unify `sections.ts`" targeted improvement is implemented in Task 3 and consumed by Task 6 (`Rail`), Task 7 (`SiteNav`), and Task 13 (`Transmission` colophon).
- **Fixed during drafting:** `Operator.tsx`'s headline originally mis-split a translated string (`h2Line3`) with a broken ternary; corrected to a clean `h2Line3Plain` / `h2Line3Em` split. `Workbench.tsx`'s legend originally used `dangerouslySetInnerHTML` with a literal `&nbsp;` string, which doesn't get HTML-entity-decoded when interpolated via `{expression}` in JSX (unlike literal JSX text) — corrected to a plain string with ` ` escapes rendered as normal JSX text.
- **Type consistency:** `Lang` (Task 3) is the single type used for language everywhere; `SectionMeta`/`SECTIONS` (Task 3) is consumed identically by `Rail`, `SiteNav`, and `Transmission` with no renamed fields; `useActiveSection`'s return tuple shape (`[string, (id: string) => void]`) matches its usage in `App.tsx`.
- **No placeholders:** every task has complete, runnable code and concrete test assertions — none deferred to "later."
