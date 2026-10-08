# Solo Leveling Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the blueprint look of drilonrecica.github.io with a dark Solo Leveling "System" identity (status window, quests, shadows), keeping every fact and the page structure intact.

**Architecture:** Astro 7 static site, Tailwind 4 with tokens as CSS custom properties in `src/styles/global.css`. One new surface (`.window`) and one new section component (`SystemWindow.astro`) carry the theme. Pure helpers in `src/lib/system.ts` derive Level and quest status from existing data. Motion is CSS-only and lives entirely inside `prefers-reduced-motion: no-preference`.

**Tech Stack:** Astro 7.3, Tailwind CSS 4 (`@tailwindcss/vite`), MDX, Node 24 built-in test runner (`node --test`, native TypeScript stripping), Playwright MCP for visual checks.

**Spec:** `docs/superpowers/specs/2026-10-08-solo-leveling-redesign-design.md`

## Global Constraints

- Dark only: `color-scheme: dark`; no theme toggle, no light palette, no `localStorage` theme script.
- Tokens (exact): `abyss #05070f`, `armor #0a1124`, `night #0b1e46`, `deep #123a7a`, `glow #3cc8ff`, `glow-core #b8f0ff`, `snow #eaf4ff`, `muted #9db0d3`, `gate #a78bfa` (gate violet, tuned up from ~`#8B5CF6` so it passes AA as text).
- Fonts: Chakra Petch 600/700 (self-hosted from `../igris/site/fonts/`, with OFL) for headings and System labels; a named system sans stack for body text; IBM Plex Mono for metadata. `@fontsource/ibm-plex-sans` is removed.
- Copy voice: dual labels. Plain headings carry the meaning; System tags (`[ QUEST LOG ]`) sit above. Nav and body copy stay plain English.
- No Rank field. No new facts: every number and status is derived from existing data (`profile.ts`, `experience.ts`, `projects.ts`, MDX frontmatter).
- No client internals or criticism in copy or diagrams (see the memory rule).
- No new runtime dependencies. The only JS is Astro's router, the mobile nav toggle and the existing `/cv` print button.
- Git: commit each task locally on `master`; **never push** without the user's explicit go-ahead.
- All commands from the repo root: `/home/drilonrecica/Code/Drilon/drilonrecica.github.io`.

## Review Focus

1. **Reduced motion.** With `prefers-reduced-motion: reduce`, every window, the hero and "Arise." must be fully visible with no animation. Owned by Task 5 (Playwright check) and Task 2 (all motion CSS sits inside `no-preference`).
2. **Browsers without scroll-driven animations** (older Firefox/Safari): `.reveal` and `.arise` must never start hidden. Owned by Task 2 (test: no `animation-timeline` outside an `@supports` block).
3. **Year boundary for Level.** Level = build year − 2012, so it must be 14 in 2026 and 15 from 1 Jan 2027 (after the next deploy). Owned by Task 1 (unit test).
4. **375 px screens.** Long values (email, "Senior Mobile Engineer", stack lists, quest titles) must not cause horizontal scroll. Owned by Tasks 5, 6 and 7 (Playwright `scrollWidth` check).
5. **Printing `/cv` from a dark site.** Print must come out black on white with no dark backgrounds. Owned by Task 7 (dist test for print token overrides, plus a Playwright print-media screenshot).

## Deliberate adjustments to the spec (flag to user at handoff)

- **`LegacyToModular` is retired, not moved into the DB case study.** That case study says the app "stays a single module", while the diagram shows a split into feature/core modules. Placing it there would contradict the text and depict a named client's code as a tangle.
- **Level "count-up" becomes a scan-line wipe.** The number stays real text in the HTML (copyable, screen-reader exact, correct without CSS).
- **"Arise." is scroll-linked**, not strictly one-time: it plays as the igris card scrolls into view, and needs no JS.

## File map

| File | Responsibility |
|---|---|
| `src/lib/system.ts` (new) | `levelSince`, `questStatus`: pure derivations |
| `tests/system.test.mjs` (new) | Unit tests for `system.ts` |
| `tests/contrast.test.mjs` (new) | WCAG AA check of token pairs, read from `global.css` |
| `tests/dist.mjs` (new) | Helpers that read built HTML/CSS from `dist/` |
| `tests/site.test.mjs` (new) | Assertions on the built site, grown task by task |
| `src/styles/global.css` | Tokens, fonts, `.window`/`.panel`/`.tag`/`.mark`/`.btn`, motion, print, diagram colours |
| `public/fonts/*` (new) | Chakra Petch woff2 + OFL |
| `src/layouts/Layout.astro` | Shell without the theme script; uses `SystemFooter` |
| `src/components/SystemFooter.astro` (new) | One-line System footer (replaces `TitleBlock.astro`) |
| `src/components/SystemWindow.astro` (new) | Section as a System window with a dual label (replaces `SheetSection.astro`) |
| `src/components/StatusWindow.astro` (new) | Hero status sheet |
| `src/components/{Nav,WorkCard,Timeline,Figure}.astro` | Restyled |
| `src/pages/{index,cv,404}.astro`, `src/pages/work/[slug].astro` | Restyled pages |
| `src/data/profile.ts` | Adds `androidSince: 2012` |
| `src/data/projects.ts` | Adds `arise?: boolean` (true for igris) |
| Deleted | `ThemeToggle.astro`, `TitleBlock.astro`, `SheetSection.astro`, `diagrams/LegacyToModular.astro` |

---

### Task 1: Test harness and System helpers

**Files:**
- Create: `src/lib/system.ts`, `tests/system.test.mjs`
- Modify: `package.json` (scripts), `docs/superpowers/specs/2026-10-08-solo-leveling-redesign-design.md` (record the three adjustments)

**Interfaces:**
- Produces: `levelSince(startYear: number, now?: Date): number`; `type QuestStatus = 'active' | 'cleared'`; `questStatus(period: string): QuestStatus`. npm script `test` runs `node --test 'tests/**/*.test.mjs'`.

- [ ] **Step 1: Add the test script.** In `package.json` `"scripts"`, add after `"astro": "astro"`:

```json
    "astro": "astro",
    "test": "node --test 'tests/**/*.test.mjs'"
```

- [ ] **Step 2: Write the failing test** `tests/system.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levelSince, questStatus } from '../src/lib/system.ts';

test('level counts whole years since the start year', () => {
	assert.equal(levelSince(2012, new Date(2026, 9, 8)), 14);
	assert.equal(levelSince(2012, new Date(2026, 11, 31)), 14);
	assert.equal(levelSince(2012, new Date(2027, 0, 1)), 15);
});

test('ongoing periods are active, finished ones cleared', () => {
	assert.equal(questStatus('Nov 2023 – Present'), 'active');
	assert.equal(questStatus('2020 – now'), 'active');
	assert.equal(questStatus('2023 – 2024'), 'cleared');
	assert.equal(questStatus('2015 – 2020'), 'cleared');
	assert.equal(questStatus('Nov 2019 – Nov 2020'), 'cleared');
});
```

- [ ] **Step 3: Run it to verify it fails.** Run: `npm test`. Expected: FAIL with `Cannot find module` for `src/lib/system.ts`.

- [ ] **Step 4: Implement** `src/lib/system.ts`:

```ts
/** Whole years since `startYear`, shown as "Level" on the status window. */
export function levelSince(startYear: number, now: Date = new Date()): number {
	return now.getFullYear() - startYear;
}

export type QuestStatus = 'active' | 'cleared';

/** A period such as "Nov 2023 – Present" is still running; any other period is finished. */
export function questStatus(period: string): QuestStatus {
	return /\b(present|now)\b/i.test(period) ? 'active' : 'cleared';
}
```

- [ ] **Step 5: Run the tests.** Run: `npm test`. Expected: 2 tests pass.

- [ ] **Step 6: Record the spec adjustments.** Append to the end of `docs/superpowers/specs/2026-10-08-solo-leveling-redesign-design.md`:

```markdown

## Adjustments made while planning
- `LegacyToModular` is retired rather than moved into the DB case study: that case study says the app stays a single module, so a modularisation diagram there would contradict it and depict a named client's code as a tangle.
- The Level "count-up" is a scan-line wipe; the number stays real text.
- "Arise." is scroll-linked (plays as the igris card enters the viewport) so it needs no JavaScript.
```

- [ ] **Step 7: Commit.**

```bash
rtk git add package.json src/lib/system.ts tests/system.test.mjs docs/superpowers/specs/2026-10-08-solo-leveling-redesign-design.md
rtk git commit -m "Add System helpers for level and quest status, with tests"
```

---

### Task 2: Design-system foundation (tokens, fonts, layout, nav, footer)

**Files:**
- Create: `tests/contrast.test.mjs`, `tests/dist.mjs`, `tests/site.test.mjs`, `src/components/SystemFooter.astro`, `public/fonts/` (3 files)
- Rewrite: `src/styles/global.css`
- Modify: `src/layouts/Layout.astro`, `src/components/Nav.astro`, `src/pages/index.astro`, `src/pages/cv.astro`, `src/pages/404.astro`, `src/pages/work/[slug].astro`, plus a mechanical class rename across `src/components`, `src/pages`, `src/content`
- Delete: `src/components/ThemeToggle.astro`, `src/components/TitleBlock.astro`
- Modify: `package.json` / `package-lock.json` (remove `@fontsource/ibm-plex-sans`)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: Tailwind colours `abyss armor night deep glow glow-core snow muted gate`; fonts `font-sans font-display font-mono`; CSS classes `.sheet .note .tag .mark .mark-active .mark-cleared .link .btn .btn-primary .window .window-bar .panel .reveal .arise .prose-sheet`, `.dg-*`; keyframes `materialise scan rise arise` (plus `draw appear`, kept until Task 4); `tests/dist.mjs` exports `page(path)`, `css()`, `stripAtRule(text, name)`. `Layout` no longer takes a `sheet` prop.

- [ ] **Step 1: Write the dist helpers** `tests/dist.mjs`:

```js
import { readFileSync, readdirSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);

/** Built HTML for a route such as '/', '/cv' or '/404'. Run `npm run build` first. */
export function page(path) {
	const file = path === '/' ? 'index.html' : path === '/404' ? '404.html' : `${path.replace(/^\//, '')}/index.html`;
	return readFileSync(new URL(file, dist), 'utf8');
}

/** All built CSS: bundled files plus any stylesheet Astro inlined into the home page. */
export function css() {
	const dir = new URL('_astro/', dist);
	const files = readdirSync(dir).filter((name) => name.endsWith('.css'));
	const inlined = [...page('/').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
	return [...files.map((name) => readFileSync(new URL(name, dir), 'utf8')), ...inlined].join('\n');
}

/** `text` with every `@name … { … }` block removed, braces matched. */
export function stripAtRule(text, name) {
	let out = '';
	let i = 0;
	while (i < text.length) {
		const start = text.indexOf(name, i);
		if (start === -1) return out + text.slice(i);
		out += text.slice(i, start);
		let j = text.indexOf('{', start);
		let depth = 1;
		while (depth > 0 && ++j < text.length) {
			if (text[j] === '{') depth++;
			else if (text[j] === '}') depth--;
		}
		i = j + 1;
	}
	return out;
}
```

- [ ] **Step 2: Write the failing contrast test** `tests/contrast.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
// The first top-level :root block holds the tokens; the print block later overrides them.
const root = source.match(/:root\s*{([^}]*)}/)[1];
const tokens = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map((m) => [m[1], m[2]]));

function luminance(hex) {
	const [r, g, b] = [1, 3, 5]
		.map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
		.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background]: every pair that carries text on the site.
const pairs = [
	['snow', 'abyss'], ['snow', 'armor'], ['snow', 'night'],
	['muted', 'abyss'], ['muted', 'armor'],
	['glow', 'abyss'], ['glow', 'armor'],
	['glow-core', 'armor'],
	['gate', 'abyss'], ['gate', 'armor'],
	['abyss', 'glow'], ['abyss', 'glow-core'],
];

for (const [fg, bg] of pairs) {
	test(`${fg} on ${bg} meets WCAG AA (4.5:1)`, () => {
		assert.ok(tokens[fg] && tokens[bg], `missing token --${fg} or --${bg}`);
		const ratio = contrast(tokens[fg], tokens[bg]);
		assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
	});
}
```

- [ ] **Step 3: Write the failing site test** `tests/site.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { page, css, stripAtRule } from './dist.mjs';

test('dark only: no theme toggle and no stored-theme script', () => {
	const html = page('/');
	assert.doesNotMatch(html, /theme-toggle/);
	assert.doesNotMatch(html, /localStorage/);
	assert.match(css(), /color-scheme:\s*dark/);
});

test('Chakra Petch is self-hosted and IBM Plex Sans is gone', () => {
	assert.ok(existsSync(new URL('../dist/fonts/chakra-petch-latin-700-normal.woff2', import.meta.url)));
	assert.ok(existsSync(new URL('../dist/fonts/OFL.txt', import.meta.url)));
	assert.match(css(), /Chakra Petch/);
	assert.doesNotMatch(css(), /IBM Plex Sans/);
});

test('System tag brackets survive the CSS build (alt-text content syntax)', () => {
	assert.match(css(), /content:\s*"\[ "\s*\/\s*""/);
});

test('footer is the System line, not the drawing title block', () => {
	const html = page('/');
	assert.match(html, /Build \d{4}-\d{2}-\d{2}/);
	assert.doesNotMatch(html, /Drawn by/);
});

test('scroll-driven animation only exists behind @supports, so content is never stuck hidden', () => {
	const all = css();
	assert.match(all, /animation-timeline/);
	assert.doesNotMatch(stripAtRule(all, '@supports'), /animation-timeline/);
});
```

- [ ] **Step 4: Run to verify failure.** Run: `npm run build && npm test`. Expected: contrast tests FAIL with `missing token --snow …`; site tests FAIL on `theme-toggle`, fonts and `Build`.

- [ ] **Step 5: Copy the fonts.**

```bash
mkdir -p public/fonts
cp ../igris/site/fonts/chakra-petch-latin-600-normal.woff2 ../igris/site/fonts/chakra-petch-latin-700-normal.woff2 ../igris/site/fonts/OFL.txt public/fonts/
```

- [ ] **Step 6: Rewrite `src/styles/global.css`** with exactly:

```css
@import "tailwindcss";

@font-face {
  font-family: "Chakra Petch";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/chakra-petch-latin-600-normal.woff2") format("woff2");
}

@font-face {
  font-family: "Chakra Petch";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/chakra-petch-latin-700-normal.woff2") format("woff2");
}

/* System tokens shared with igris (../igris/site/style.css). Gate violet is this site's own accent. */
:root {
  color-scheme: dark;
  --abyss: #05070f;
  --armor: #0a1124;
  --night: #0b1e46;
  --deep: #123a7a;
  --glow: #3cc8ff;
  --glow-core: #b8f0ff;
  --snow: #eaf4ff;
  --muted: #9db0d3;
  --gate: #a78bfa;
}

@theme inline {
  /* Named UI fonts rather than system-ui, which maps to a monospace font on some Linux setups. */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
  --font-display: "Chakra Petch", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --color-abyss: var(--abyss);
  --color-armor: var(--armor);
  --color-night: var(--night);
  --color-deep: var(--deep);
  --color-glow: var(--glow);
  --color-glow-core: var(--glow-core);
  --color-snow: var(--snow);
  --color-muted: var(--muted);
  --color-gate: var(--gate);
}

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
  }

  body {
    @apply bg-abyss text-snow font-sans antialiased;
    /* Faint light from a gate above the page. */
    background-image: linear-gradient(180deg, rgb(11 30 70 / 0.6), transparent 40rem);
    background-repeat: no-repeat;
    font-size: 1.0625rem;
    line-height: 1.65;
  }

  ::selection {
    background: var(--gate);
    color: var(--abyss);
  }

  :focus-visible {
    outline: 2px solid var(--glow);
    outline-offset: 3px;
  }

  h1,
  h2,
  h3 {
    @apply font-display font-bold text-snow;
    letter-spacing: -0.01em;
    line-height: 1.15;
    text-wrap: balance;
  }

  h3 {
    @apply font-semibold;
  }

  p {
    text-wrap: pretty;
  }

  a {
    text-underline-offset: 0.2em;
  }
}

@layer components {
  .sheet {
    @apply mx-auto w-full max-w-6xl px-5 sm:px-8;
  }

  .note {
    @apply font-mono text-[0.8125rem] leading-snug text-muted;
  }

  /* System label, rendered as [ LABEL ]; the brackets are hidden from screen readers. */
  .tag {
    @apply font-display text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-glow;
  }

  .tag::before {
    content: "[ " / "";
  }

  .tag::after {
    content: " ]" / "";
  }

  /* Quest status: violet while a quest runs, System blue once it is cleared. */
  .mark {
    @apply font-display text-[0.75rem] font-semibold uppercase tracking-[0.16em];
  }

  .mark-active {
    color: var(--gate);
  }

  .mark-cleared {
    color: var(--glow);
  }

  .arise {
    @apply font-display text-[0.75rem] font-semibold uppercase text-gate;
    letter-spacing: 0.2em;
  }

  .link {
    @apply text-glow underline decoration-1 hover:text-glow-core hover:decoration-2;
  }

  .btn {
    @apply inline-flex items-center gap-2 border border-glow/50 px-5 py-2.5 font-display text-base font-semibold text-snow no-underline transition-colors;
  }

  .btn:hover {
    background: var(--night);
    border-color: var(--glow);
  }

  .btn-primary {
    background: var(--glow);
    border-color: var(--glow);
    color: var(--abyss);
  }

  .btn-primary:hover {
    background: var(--glow-core);
    border-color: var(--glow-core);
    color: var(--abyss);
  }

  /* System window: the one recurring surface. Corner brackets mark it as System UI. */
  .window {
    position: relative;
    border: 1px solid var(--deep);
    background: var(--armor);
    box-shadow:
      inset 0 1px 0 rgb(60 200 255 / 0.35),
      0 0 32px -16px rgb(60 200 255 / 0.5);
  }

  .window::before,
  .window::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 0 solid var(--glow);
    pointer-events: none;
  }

  .window::before {
    top: -1px;
    left: -1px;
    border-top-width: 2px;
    border-left-width: 2px;
  }

  .window::after {
    bottom: -1px;
    right: -1px;
    border-bottom-width: 2px;
    border-right-width: 2px;
  }

  .window-bar {
    @apply border-b border-deep px-5 py-2.5 sm:px-6;
    background: linear-gradient(90deg, rgb(60 200 255 / 0.08), transparent 60%);
  }

  /* Inner surface for cards that sit inside a window. */
  .panel {
    position: relative;
    border: 1px solid var(--deep);
    background: rgb(5 7 15 / 0.6);
  }

  /* Long-form case-study text. */
  .prose-sheet {
    max-width: 68ch;
  }

  .prose-sheet > * + * {
    margin-top: 1.25em;
  }

  .prose-sheet h2 {
    @apply text-2xl;
    margin-top: 2.5em;
    padding-top: 1em;
    border-top: 1px solid var(--deep);
  }

  .prose-sheet > h2:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: 0;
  }

  .prose-sheet pre {
    padding: 1rem 1.25rem;
    overflow-x: auto;
    font-size: 0.8125rem;
    line-height: 1.6;
    border: 1px solid var(--deep);
    background: var(--abyss);
  }

  .prose-sheet ul {
    list-style: square;
    padding-left: 1.25em;
  }

  .prose-sheet li + li {
    margin-top: 0.4em;
  }

  .prose-sheet a {
    @apply text-glow underline decoration-1 hover:text-glow-core hover:decoration-2;
  }
}

/* Kept for diagrams/LegacyToModular.astro until Task 4 removes it. */
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes appear {
  to {
    opacity: 1;
  }
}

@keyframes materialise {
  from {
    clip-path: inset(-2px -2px 100% -2px);
  }
  to {
    clip-path: inset(-2px);
  }
}

@keyframes scan {
  from {
    top: 0;
    opacity: 1;
  }
  to {
    top: 100%;
    opacity: 0;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    translate: 0 1.5rem;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes arise {
  from {
    opacity: 0;
    letter-spacing: 0.6em;
  }
  to {
    opacity: 1;
    letter-spacing: 0.2em;
  }
}

/* Motion only marks a change, and only for people who have not asked for less. */
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: rise linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }

    .arise {
      animation: arise linear both;
      animation-timeline: view();
      animation-range: entry 30% cover 45%;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* /cv prints as a plain black-on-white A4 document. */
@media print {
  @page {
    size: A4;
    margin: 14mm;
  }

  :root {
    color-scheme: light;
    --abyss: #fff;
    --armor: #fff;
    --night: #fff;
    --deep: #999;
    --glow: #000;
    --glow-core: #000;
    --snow: #000;
    --muted: #333;
    --gate: #000;
  }

  body {
    background: #fff;
    font-size: 10pt;
    line-height: 1.45;
  }

  .window {
    box-shadow: none;
  }

  .cv {
    padding: 0;
    max-width: none;
  }

  .cv .job {
    break-inside: avoid;
  }

  .cv a {
    text-decoration: none;
  }
}

/* Shared vocabulary for case-study diagrams (inline SVG). */
.dg {
  display: block;
  width: 100%;
  height: auto;
  font-family: var(--font-mono);
  font-size: 11px;
}

.dg-node {
  fill: var(--armor);
  stroke: var(--glow);
  stroke-width: 1;
}

.dg-zone {
  fill: none;
  stroke: var(--muted);
  stroke-width: 0.75;
  stroke-dasharray: 4 3;
}

.dg-flow {
  fill: none;
  stroke: var(--glow);
  stroke-width: 1.25;
}

.dg-markup {
  fill: none;
  stroke: var(--gate);
  stroke-width: 1.5;
}

.dg-label {
  fill: var(--snow);
}

.dg-soft {
  fill: var(--muted);
  font-size: 10px;
}
```

- [ ] **Step 7: Mechanically rename old token classes** in every other source file (order matters: `ink-soft` before `ink`, `paper-raised` before `paper`):

```bash
grep -rlE 'paper|ink|rule|markup|framed|var\(--line\)' src/components src/pages src/content src/layouts \
| xargs sed -i -E \
  -e 's/paper-raised/armor/g' \
  -e 's/\bbg-paper\b/bg-abyss/g' -e 's/\btext-paper\b/text-abyss/g' \
  -e 's/text-ink-soft/text-muted/g' -e 's/\btext-ink\b/text-snow/g' \
  -e 's/\bborder-ink\b/border-glow/g' -e 's/\bbg-ink\b/bg-glow/g' \
  -e 's/border-rule/border-deep/g' -e 's/bg-rule/bg-deep/g' \
  -e 's/decoration-markup/decoration-glow/g' -e 's/text-markup/text-gate/g' \
  -e 's/var\(--ink-soft\)/var(--muted)/g' -e 's/var\(--ink\)/var(--snow)/g' \
  -e 's/var\(--paper\)/var(--abyss)/g' -e 's/var\(--line\)/var(--glow)/g' \
  -e 's/var\(--rule\)/var(--deep)/g' -e 's/var\(--markup\)/var(--gate)/g' \
  -e 's/\bframed\b/window/g'
```

Then confirm nothing old remains. Run: `grep -rnE '(bg|text|border|decoration)-(paper|ink|rule|markup|line)\b|var\(--(paper|ink|line|rule|markup|grid)' src`. Expected: no output.

- [ ] **Step 8: Create `src/components/SystemFooter.astro`:**

```astro
---
import { profile } from '../data/profile';

const build = new Date().toISOString().slice(0, 10);
---

<footer class="mt-24 border-t border-deep print:hidden">
	<div class="sheet flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-8">
		<p class="tag">System · Build {build}</p>
		<p class="note">© {new Date().getFullYear()} {profile.name}. Built with Astro, no tracking.</p>
	</div>
</footer>
```

- [ ] **Step 9: Update `src/layouts/Layout.astro`.**
  - Replace the four font imports with only `import '@fontsource/ibm-plex-mono/400.css';`.
  - Replace `import TitleBlock from '../components/TitleBlock.astro';` with `import SystemFooter from '../components/SystemFooter.astro';`.
  - In `Props`, delete the `sheet` field and its comment, and change the destructuring to `const { title, description = profile.description } = Astro.props;`.
  - Delete the whole `<!-- Apply a stored theme … -->` comment and its `<script is:inline>…</script>` block.
  - Change the skip link's focus classes to `focus:bg-glow focus:px-4 focus:py-2 focus:text-abyss`. After Step 7 they read `focus:bg-glow … focus:text-abyss`; verify that.
  - Replace `<TitleBlock sheet={sheet} />` with `<SystemFooter />`.

- [ ] **Step 10: Remove `sheet=` from page callers.**

```bash
sed -i -E 's/ sheet=("[^"]*"|\{[^}]*\})//' src/pages/index.astro src/pages/cv.astro src/pages/404.astro src/pages/work/\[slug\].astro
```

In `src/pages/work/[slug].astro`, also delete the line `sheet: \`Work ${index + 1}/${work.length}\`,` inside `getStaticPaths`, and change `const { entry, sheet, previous, next } = Astro.props;` to `const { entry, previous, next } = Astro.props;`.

- [ ] **Step 11: Update `src/components/Nav.astro`.**
  - Delete `import ThemeToggle from './ThemeToggle.astro';` and the `<ThemeToggle />` line.
  - Change the brand link class from `font-medium no-underline` to `font-display font-semibold tracking-wide no-underline`.

- [ ] **Step 12: Delete the retired components and the Plex Sans package.**

```bash
rm src/components/ThemeToggle.astro src/components/TitleBlock.astro
npm uninstall @fontsource/ibm-plex-sans
```

- [ ] **Step 13: Verify.** Run: `npx astro check && npm run build && npm test`. Expected: 0 errors, and all tests pass (system 2, contrast 12, site 5).

- [ ] **Step 14: Commit.**

```bash
rtk git add -A src public/fonts tests package.json package-lock.json
rtk git commit -m "Replace blueprint tokens with the dark System palette and Chakra Petch"
```

---

### Task 3: SystemWindow sections with dual labels

**Files:**
- Create: `src/components/SystemWindow.astro`
- Modify: `src/pages/index.astro`, `tests/site.test.mjs`
- Delete: `src/components/SheetSection.astro`

**Interfaces:**
- Consumes: `.window`, `.window-bar`, `.tag`, `.reveal` (Task 2).
- Produces: `<SystemWindow id tag title note?>` with a default slot. It renders `<section id aria-labelledby="{id}-title">`, a `<p class="window-bar tag">{tag}</p>` and an `<h2 id="{id}-title">{title}</h2>`.

- [ ] **Step 1: Add the failing test** to `tests/site.test.mjs`:

```js
test('home sections are System windows with dual labels', () => {
	const html = page('/');
	const tags = [...html.matchAll(/class="window-bar tag"[^>]*>([^<]+)</g)].map((m) => m[1].trim());
	for (const tag of ['Quest log', 'Shadow army', 'Hunter record', 'Passive skills', 'Player', '! System message']) {
		assert.ok(tags.includes(tag), `missing [ ${tag} ] window, found: ${tags.join(', ')}`);
	}
	for (const heading of ['Selected work', 'Open source', 'Experience', 'How I work', 'About', 'Contact']) {
		assert.match(html, new RegExp(`<h2[^>]*>${heading}</h2>`));
	}
});
```

- [ ] **Step 2: Run to verify failure.** Run: `npm run build && npm test`. Expected: FAIL with `missing [ Quest log ] window`.

- [ ] **Step 3: Create `src/components/SystemWindow.astro`:**

```astro
---
interface Props {
	id: string;
	/** System label for the title bar, e.g. "Quest log"; shown as [ QUEST LOG ]. */
	tag: string;
	/** Plain heading that carries the meaning for every visitor. */
	title: string;
	/** Margin annotation under the heading. */
	note?: string;
}

const { id, tag, title, note } = Astro.props;
---

<section id={id} aria-labelledby={`${id}-title`} class="py-10 md:py-14">
	<div class="sheet">
		<div class="window reveal">
			<p class="window-bar tag">{tag}</p>
			<div class="grid gap-8 p-5 sm:p-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-12">
				<header>
					<h2 id={`${id}-title`} class="text-2xl">{title}</h2>
					{note && <p class="note mt-3 max-w-[22ch]">{note}</p>}
				</header>
				<div>
					<slot />
				</div>
			</div>
		</div>
	</div>
</section>
```

- [ ] **Step 4: Swap the sections in `src/pages/index.astro`.** Replace the import `SheetSection` with `import SystemWindow from '../components/SystemWindow.astro';`. Replace every `<SheetSection` / `</SheetSection>` with `<SystemWindow` / `</SystemWindow>` and add a `tag` attribute per section:

| `id` | add `tag=` |
|---|---|
| `work` | `"Quest log"` |
| `open-source` | `"Shadow army"` |
| `experience` | `"Hunter record"` |
| `approach` | `"Passive skills"` |
| `about` | `"Player"` |
| `contact` | `"! System message"` |

Keep every `title` and `note` unchanged. Then `rm src/components/SheetSection.astro`.

- [ ] **Step 5: Verify.** Run: `npx astro check && npm run build && npm test`. Expected: all pass.

- [ ] **Step 6: Commit.**

```bash
rtk git add -A src tests
rtk git commit -m "Render home sections as System windows with dual labels"
```

---

### Task 4: STATUS hero and STATS strip

**Files:**
- Create: `src/components/StatusWindow.astro`
- Modify: `src/data/profile.ts`, `src/pages/index.astro`, `src/styles/global.css`, `tests/site.test.mjs`
- Delete: `src/components/diagrams/LegacyToModular.astro`

**Interfaces:**
- Consumes: `levelSince` (Task 1); `.window`, `.window-bar`, `.tag`, keyframes `materialise` and `scan` (Task 2); `experience[0].company`.
- Produces: `profile.androidSince: number` (2012); `<StatusWindow />` with no props, reused by Task 8.

- [ ] **Step 1: Add the failing test** to `tests/site.test.mjs`:

```js
test('hero is a STATUS window with a factual level and no rank', () => {
	const html = page('/');
	const level = new Date().getFullYear() - 2012;
	assert.match(html, /class="window-bar tag"[^>]*>Status</);
	assert.match(html, new RegExp(`>${level}</span>`));
	assert.match(html, /years building for Android, since 2012/);
	assert.match(html, />AppDev GmbH</);
	assert.doesNotMatch(html, />Rank</);
	assert.match(html, /class="window-bar tag"[^>]*>Stats</);
	assert.doesNotMatch(html, /ltm-title/);
});
```

- [ ] **Step 2: Run to verify failure.** Run: `npm run build && npm test`. Expected: FAIL on the `Status` tag.

- [ ] **Step 3: Add the start year to `src/data/profile.ts`.** After `title: "Senior Mobile Engineer",` add:

```ts
	/** First year building for Android; the status window's Level counts from here. */
	androidSince: 2012,
```

- [ ] **Step 4: Create `src/components/StatusWindow.astro`:**

```astro
---
import { profile } from '../data/profile';
import { experience } from '../data/experience';
import { levelSince } from '../lib/system';

const rows = [
	{ label: 'Name', value: profile.name },
	{ label: 'Class', value: profile.title },
	{
		label: 'Level',
		value: String(levelSince(profile.androidSince)),
		hint: `years building for Android, since ${profile.androidSince}`,
	},
	{ label: 'Guild', value: experience[0].company },
];
---

<div class="window status">
	<span class="scan" aria-hidden="true"></span>
	<p class="window-bar tag">Status</p>
	<dl class="divide-y divide-deep px-5 sm:px-6">
		{
			rows.map((row) => (
				<div class="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-4 py-3">
					<dt class="tag text-muted">{row.label}</dt>
					<dd>
						{/* Value on one line: tests match `>14</span>`, so no whitespace inside the span. */}
						<span class={row.hint ? 'font-display text-4xl font-bold text-glow-core' : 'font-display text-lg font-semibold'}>{row.value}</span>
						{row.hint && <span class="note mt-1 block">{row.hint}</span>}
					</dd>
				</div>
			))
		}
	</dl>
</div>

<style>
	.scan {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		height: 2px;
		background: var(--glow);
		box-shadow: 0 0 12px var(--glow);
		opacity: 0;
		pointer-events: none;
	}

	/* The window materialises once on load: it unrolls downwards behind a scan line. */
	@media (prefers-reduced-motion: no-preference) {
		.status {
			animation: materialise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		}

		.scan {
			animation: scan 0.8s ease-out both;
		}
	}
</style>
```

No `overflow-hidden`: it would clip the corner brackets that sit at `-1px`. The scan line spans `left: 0; right: 0` and fades to `opacity: 0` as it reaches `top: 100%`, so nothing spills out.

- [ ] **Step 5: Replace the hero and the track-record strip in `src/pages/index.astro`.**
  - Remove the imports of `LegacyToModular`, then add `import StatusWindow from '../components/StatusWindow.astro';`.
  - Replace everything from `<section class="sheet grid items-center` through the closing `</section>` of `aria-label="Track record"` with:

```astro
	<section class="sheet grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
		<div>
			<h1 class="text-4xl sm:text-5xl lg:text-[3.5rem]">{profile.headline}</h1>
			<p class="mt-6 max-w-[58ch] text-lg text-muted">{profile.intro}</p>
			<div class="mt-8 flex flex-wrap gap-3">
				{work.length > 0 && <a href="#work" class="btn btn-primary">Read case studies</a>}
				<a href="/cv" class={work.length > 0 ? 'btn' : 'btn btn-primary'}>View CV</a>
				<a href={`mailto:${profile.email}`} class="btn">
					<Icon name="email" /> Email me
				</a>
			</div>
		</div>
		<StatusWindow />
	</section>

	<section aria-label="Track record" class="sheet">
		<div class="window reveal">
			<p class="window-bar tag">Stats</p>
			<dl class="grid grid-cols-2 gap-px bg-deep lg:grid-cols-4">
				{
					profile.proof.map((fact) => (
						<div class="flex flex-col-reverse justify-end bg-armor px-5 py-6 sm:px-6">
							<dt class="note mt-2">{fact.label}</dt>
							<dd class="font-display text-3xl font-bold text-glow-core">{fact.value}</dd>
						</div>
					))
				}
			</dl>
		</div>
	</section>
```

- [ ] **Step 6: Retire the blueprint diagram.**
  - Delete the file: `rm src/components/diagrams/LegacyToModular.astro`.
  - In `src/styles/global.css`, delete the comment `/* Kept for diagrams/LegacyToModular.astro until Task 4 removes it. */` and the `@keyframes draw` and `@keyframes appear` blocks.
  - Run: `grep -rnE 'LegacyToModular|animation:[^;]*(draw|appear)' src`. Expected: no output.

- [ ] **Step 7: Verify.**
  - Run: `npx astro check && npm run build && npm test`. Expected: all pass.
  - Then look at the hero: `npm run preview -- --port 4329` and, with Playwright MCP, navigate to `http://localhost:4329/` at 1440×900 and take a screenshot to `.playwright-mcp/hero.png`. Check that the status window sits right of the headline, the corner brackets are visible, and Level reads `14`.
  - Stop the preview with `npx astro preview stop`.

- [ ] **Step 8: Commit.**

```bash
rtk git add -A src tests
rtk git commit -m "Add STATUS hero with a computed level and a STATS strip"
```

---

### Task 5: Quest log, Shadow army, Hunter record, skills, Player and System message

**Files:**
- Modify: `src/components/WorkCard.astro`, `src/components/Timeline.astro`, `src/data/projects.ts`, `src/pages/index.astro`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: `questStatus` (Task 1); `.panel`, `.mark*`, `.arise`, `.tag` (Task 2); `SystemWindow` (Task 3).
- Produces: `OpenSourceProject.arise?: boolean`.

- [ ] **Step 1: Add the failing tests** to `tests/site.test.mjs`:

```js
test('quest cards carry a status mark derived from their period', () => {
	const html = page('/');
	const marks = [...html.matchAll(/class="mark mark-(active|cleared)"/g)].map((m) => m[1]);
	assert.equal(marks.length, 3, 'one mark per published case study');
	// Deutsche Bahn ("Nov 2023 – Present") is the only running quest today.
	assert.equal(marks.filter((m) => m === 'active').length, 1);
});

test('igris carries the Arise flourish, hidden from screen readers', () => {
	const html = page('/');
	const arise = [...html.matchAll(/<span[^>]*class="arise[^"]*"[^>]*>/g)];
	assert.equal(arise.length, 1);
	assert.match(arise[0][0], /aria-hidden="true"/);
});

test('contact is a System message with an Accept mailto', () => {
	const html = page('/');
	assert.match(html, /A new quest has arrived\./);
	assert.match(html, /<a href="mailto:drilonrecica\.dev@gmail\.com" class="btn btn-primary[^"]*">Accept/);
});
```

- [ ] **Step 2: Run to verify failure.** Run: `npm run build && npm test`. Expected: the 3 new tests FAIL.

- [ ] **Step 3: Rewrite `src/components/WorkCard.astro`:**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { questStatus } from '../lib/system';

interface Props {
	entry: CollectionEntry<'work'>;
}

const { entry } = Astro.props;
const { title, client, period, summary, stack, draft } = entry.data;
const status = questStatus(period);
---

<article class="panel group flex flex-col p-6">
	<p class={`mark mark-${status}`}>
		<span aria-hidden="true">◆ </span>{status === 'active' ? 'Active' : 'Cleared'}
	</p>
	<p class="note mt-3">{client}, {period}</p>
	<h3 class="mt-3 text-xl">
		<a href={`/work/${entry.id}`} class="no-underline after:absolute after:inset-0 group-hover:text-glow-core group-hover:underline decoration-glow">
			{title}
		</a>
	</h3>
	<p class="mt-3 text-muted">{summary}</p>
	<p class="note mt-auto pt-6">{stack.join(' / ')}</p>
	{draft && <p class="note mt-2 text-gate">Draft, hidden in production</p>}
</article>
```

- [ ] **Step 4: Restyle the Hunter record in `src/components/Timeline.astro`.**
  - Change `<div class="period note" aria-hidden="true">` to `<div class="period tag" aria-hidden="true">`.
  - Replace the `.extent` rule in its `<style>` with:

```css
	/* A glowing track between start and end year. */
	.extent {
		flex: 1;
		width: 2px;
		min-height: 3rem;
		background: linear-gradient(var(--glow), rgb(60 200 255 / 0.1));
		box-shadow: 0 0 8px rgb(60 200 255 / 0.5);
	}
```

  - Change the comment `<!-- Dimension line: the period is measured in the margin. -->` to `<!-- The period runs down a glowing track in the margin. -->`.
  - Also remove the `.tag` bracket pseudo-elements for this vertical label by adding to the same `<style>`:

```css
	.period::before,
	.period::after {
		content: none;
	}
```

- [ ] **Step 5: Add the Arise flag in `src/data/projects.ts`.**
  - In the interface, after `status?: string;` add:

```ts
	/** Plays the "Arise." flourish: igris is the shadow this site's owner raised. */
	arise?: boolean;
```

  - In the igris entry, after `status: "Released",` add `arise: true,`.

- [ ] **Step 6: Update the section bodies in `src/pages/index.astro`.**

  **Selected work:** keep the WorkCard grid as is.

  **Open source:** replace the `<ul class="border-t border-deep">` list with:

```astro
		<ul class="grid gap-4">
			{
				openSource.map((project) => (
					<li class="panel p-5 sm:p-6">
						<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<h3 class="text-lg">{project.name}</h3>
							{project.status && <span class="note">{project.status}</span>}
							{project.arise && <span class="arise ml-auto" aria-hidden="true">Arise.</span>}
						</div>
						<p class="mt-2 max-w-[68ch] text-muted">{project.summary}</p>
						<div class="mt-3 flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
							<p class="note">{project.stack.join(' / ')}</p>
							<ul class="flex flex-wrap gap-x-6 gap-y-2">
								{project.links.map((link) => (
									<li>
										<a href={link.href} target="_blank" rel="noopener noreferrer" class="link inline-flex items-center gap-2">
											<Icon name={link.icon} /> {link.label}
											<span class="sr-only">for {project.name} (opens in a new tab)</span>
										</a>
									</li>
								))}
							</ul>
						</div>
					</li>
				))
			}
		</ul>
```

  **How I work:** replace the principle item markup with:

```astro
					<div>
						<p class="tag text-muted">Passive skill</p>
						<h3 class="mt-2 text-lg">{principle.title}</h3>
						<p class="mt-2 text-muted">{principle.body}</p>
					</div>
```

  Then replace `<h3 class="mt-16 text-lg">Tools I use</h3>` with:

```astro
		<p class="tag mt-16">Skills</p>
		<h3 class="mt-2 text-lg">Tools I use</h3>
```

  **About:** change the portrait `<figure class="window m-0 …">` class prefix `window` to `panel`. Keep the rest unchanged.

  **Contact:** replace the whole body (everything between `<SystemWindow id="contact" …>` and `</SystemWindow>`) with:

```astro
		<p class="font-display text-xl font-semibold text-glow-core">A new quest has arrived.</p>
		<p class="mt-2 text-muted">Projects, roles or questions: write to me directly.</p>
		<p class="mt-6 text-2xl sm:text-3xl">
			<a href={`mailto:${profile.email}`} class="link break-all">{profile.email}</a>
		</p>
		<a href={`mailto:${profile.email}`} class="btn btn-primary mt-6">Accept<span class="sr-only"> and write an email</span></a>
		<ul class="mt-8 flex flex-wrap gap-x-8 gap-y-3">
			{
				profile.links.map((link) => (
					<li>
						<a href={link.href} target="_blank" rel="noopener noreferrer" class="link inline-flex items-center gap-2">
							<Icon name={link.icon} /> {link.label}
							<span class="sr-only">(opens in a new tab)</span>
						</a>
					</li>
				))
			}
			<li>
				<a href={profile.cvPdf} class="link inline-flex items-center gap-2">
					<Icon name="download" /> CV as PDF
				</a>
			</li>
		</ul>
```

- [ ] **Step 7: Run the tests.** Run: `npx astro check && npm run build && npm test`. Expected: all pass.

- [ ] **Step 8: Visual, overflow and reduced-motion checks.**
  - Start `npm run preview -- --port 4329`.
  - With Playwright MCP, take full-page screenshots of `/` at 375×800, 768×1024 and 1440×900 into `.playwright-mcp/home-<width>.png`, and look at each one.
  - At each width, evaluate `() => document.documentElement.scrollWidth <= window.innerWidth`. Expected: `true`.
  - Then call `browser_emulate_media` with reduced motion `reduce`, reload, and evaluate:

```js
() => [...document.querySelectorAll('.window, .arise')].every((el) => getComputedStyle(el).opacity === '1' && getComputedStyle(el).animationName === 'none')
```

  Expected: `true`. If any check fails, fix it before committing. Stop the preview with `npx astro preview stop`.

- [ ] **Step 9: Commit.**

```bash
rtk git add -A src tests
rtk git commit -m "Theme the home sections as quests, shadows, record, skills and a System message"
```

---

### Task 6: Case studies as quest reports

**Files:**
- Modify: `src/pages/work/[slug].astro`, `src/components/Figure.astro`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: `questStatus` (Task 1); `.window`, `.window-bar`, `.tag`, `.mark*` (Task 2).

- [ ] **Step 1: Add the failing test** to `tests/site.test.mjs`:

```js
for (const slug of ['deutsche-bahn', 'qisara', 'security-library']) {
	test(`/work/${slug} is a quest report`, () => {
		const html = page(`/work/${slug}`);
		assert.match(html, /class="window-bar tag"[^>]*>Quest info</);
		assert.match(html, /class="mark mark-(active|cleared)[^"]*"/);
		assert.match(html, /(Previous|Next) quest/);
	});
}

test('figures sit in System windows', () => {
	assert.match(page('/work/qisara'), /<figure class="window[^"]*"/);
});
```

- [ ] **Step 2: Run to verify failure.** Run: `npm run build && npm test`. Expected: FAIL on `Quest info`.

- [ ] **Step 3: Rewrite `src/pages/work/[slug].astro`:**

```astro
---
import { render } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Icon from '../../components/Icon.astro';
import { profile } from '../../data/profile';
import { getWork } from '../../data/work';
import { questStatus } from '../../lib/system';

export async function getStaticPaths() {
	const work = await getWork();
	return work.map((entry, index) => ({
		params: { slug: entry.id },
		props: { entry, previous: work[index - 1], next: work[index + 1] },
	}));
}

const { entry, previous, next } = Astro.props;
const { Content } = await render(entry);
const { data } = entry;
const status = questStatus(data.period);

const spec = [
	{ label: 'Client', value: data.client },
	{ label: 'Role', value: data.role },
	{ label: 'Period', value: data.period },
	{ label: 'Team', value: data.team },
	{ label: 'Platform', value: data.platform },
	{ label: 'Stack', value: data.stack.join(', ') },
].filter((row) => row.value);
---

<Layout title={`${data.title} | ${profile.name}`} description={data.summary}>
	<article class="sheet py-12 md:py-20">
		<a href="/#work" class="note link"><span aria-hidden="true">◂ </span>Back to selected work</a>
		<p class={`mark mark-${status} mt-8`}>
			<span aria-hidden="true">◆ </span>{status === 'active' ? 'Active quest' : 'Quest cleared'}
		</p>
		<h1 class="mt-3 max-w-[22ch] text-4xl sm:text-5xl">{data.title}</h1>
		<p class="mt-5 max-w-[60ch] text-lg text-muted">{data.summary}</p>

		<div class="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
			<div class="prose-sheet">
				<Content />
			</div>

			<aside class="window self-start lg:order-last max-lg:order-first" aria-label="Project details">
				<p class="window-bar tag">Quest info</p>
				<div class="p-5">
					<dl class="space-y-4">
						{
							spec.map((row) => (
								<div>
									<dt class="note">{row.label}</dt>
									<dd class="text-[0.9375rem]">{row.value}</dd>
								</div>
							))
						}
					</dl>
					{
						data.links.length > 0 && (
							<ul class="mt-5 space-y-2 border-t border-deep pt-4">
								{data.links.map((link) => (
									<li>
										<a href={link.href} target="_blank" rel="noopener noreferrer" class="link inline-flex items-center gap-1.5 text-[0.9375rem]">
											{link.label} <Icon name="external" size={14} />
											<span class="sr-only">(opens in a new tab)</span>
										</a>
									</li>
								))}
							</ul>
						)
					}
				</div>
			</aside>
		</div>

		<nav class="mt-20 grid gap-6 border-t border-deep pt-8 sm:grid-cols-2" aria-label="More case studies">
			<div>
				{
					previous && (
						<>
							<p class="tag"><span aria-hidden="true">◂ </span>Previous quest</p>
							<a href={`/work/${previous.id}`} class="link mt-1 inline-block text-lg">{previous.data.title}</a>
						</>
					)
				}
			</div>
			<div class="sm:text-right">
				{
					next && (
						<>
							<p class="tag">Next quest<span aria-hidden="true"> ▸</span></p>
							<a href={`/work/${next.id}`} class="link mt-1 inline-block text-lg">{next.data.title}</a>
						</>
					)
				}
			</div>
		</nav>
	</article>
</Layout>
```

- [ ] **Step 4: Rewrite `src/components/Figure.astro`:**

```astro
---
interface Props {
	number: number;
	caption: string;
}

const { number, caption } = Astro.props;
---

<figure class="window mx-0 my-8">
	<!-- The caption below repeats the figure number for assistive tech. -->
	<p class="window-bar tag" aria-hidden="true">Fig. {number}</p>
	<div class="p-4 sm:p-6">
		<div class="overflow-x-auto">
			<div class="min-w-[32rem]">
				<slot />
			</div>
		</div>
		<figcaption class="note mt-3">Fig. {number}: {caption}</figcaption>
	</div>
</figure>
```

- [ ] **Step 5: Verify.**
  - Run: `npx astro check && npm run build && npm test`. Expected: all pass.
  - Preview, then use Playwright to screenshot `/work/deutsche-bahn` and `/work/qisara` at 375 and 1440 wide. Check the diagram reads clearly as glow on armor, the Quest info window and the prev/next labels look right, and `scrollWidth <= innerWidth` at 375.
  - Stop the preview.

- [ ] **Step 6: Commit.**

```bash
rtk git add -A src tests
rtk git commit -m "Turn case studies into quest reports with a Quest info window"
```

---

### Task 7: `/cv` (screen and print) and the 404 gate

**Files:**
- Modify: `src/pages/cv.astro`, `src/pages/404.astro`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: tokens and the print block (Task 2), `.window`, `.window-bar`, `.tag`.

- [ ] **Step 1: Add the failing tests** to `tests/site.test.mjs`:

```js
test('/cv stays sober: no System labels on the CV itself', () => {
	const html = page('/cv');
	const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
	assert.doesNotMatch(main, /class="(window-bar )?tag"/);
	assert.doesNotMatch(main, /mark-(active|cleared)/);
});

test('print turns the dark palette into black on white', () => {
	const print = css().match(/@media print\s*{[\s\S]*?:root\s*{([^}]*)}/);
	assert.ok(print, 'print block with :root overrides');
	assert.match(print[1], /--abyss:\s*#fff/);
	assert.match(print[1], /--snow:\s*#000/);
});

test('404 is a closed gate', () => {
	const html = page('/404');
	assert.match(html, /class="window-bar tag"[^>]*>! Gate closed</);
	assert.match(html, /This dungeon doesn(&#39;|')t exist\./);
});
```

- [ ] **Step 2: Run to verify failure.** Run: `npm run build && npm test`. Expected: the 404 test FAILS. The CV and print tests may already pass, since Task 2 wrote the print block; that is fine, as they pin the behaviour.

- [ ] **Step 3: Check `/cv` on screen.** After Task 2's rename, `cv.astro` uses `border-glow`, `text-muted` and the new `.btn`. Make only this change: the header rule `border-b border-glow pb-6` becomes `border-b border-deep pb-6`, so the CV stays calm. No themed labels are added.

- [ ] **Step 4: Rewrite `src/pages/404.astro`:**

```astro
---
import Layout from '../layouts/Layout.astro';
import { profile } from '../data/profile';
---

<Layout title={`Page not found | ${profile.name}`}>
	<section class="sheet py-24 md:py-32">
		<div class="window max-w-2xl">
			<p class="window-bar tag">! Gate closed</p>
			<div class="p-6 sm:p-8">
				<p class="note">Error 404</p>
				<h1 class="mt-4 text-4xl sm:text-5xl">This dungeon doesn't exist.</h1>
				<p class="mt-5 max-w-[55ch] text-lg text-muted">
					The page you followed a link to does not exist, or it has moved.
				</p>
				<a href="/" class="btn btn-primary mt-8">Return to the home page</a>
			</div>
		</div>
	</section>
</Layout>
```

- [ ] **Step 5: Verify.**
  - Run: `npx astro check && npm run build && npm test`. Expected: all pass.
  - Preview, then use Playwright to screenshot `/cv` and `/404` at 375 and 1440, and check `scrollWidth <= innerWidth` at 375.
  - Then call `browser_emulate_media` with media `print`, reload `/cv` and take a full-page screenshot. Expected: a white background, black text, no nav and no footer.
  - Stop the preview.

- [ ] **Step 6: Commit.**

```bash
rtk git add -A src tests
rtk git commit -m "Restyle the CV for the dark site and turn 404 into a closed gate"
```

---

### Task 8: OG image as a STATUS window

**Files:**
- Create temporarily, then delete: `src/pages/og.astro`
- Replace: `public/og-image.png`

**Interfaces:**
- Consumes: `<StatusWindow />` (Task 4), `profile.headline`.

- [ ] **Step 1: Create the temporary page `src/pages/og.astro`:**

```astro
---
import '../styles/global.css';
import '@fontsource/ibm-plex-mono/400.css';
import StatusWindow from '../components/StatusWindow.astro';
import { profile } from '../data/profile';
---

<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>OG image</title>
	</head>
	<body style="margin:0;width:1200px;height:630px;overflow:hidden">
		<div class="grid h-[630px] w-[1200px] grid-cols-[minmax(0,1fr)_26rem] items-center gap-12 px-16">
			<div>
				<p class="tag">{profile.name}</p>
				<p class="mt-5 font-display text-5xl leading-tight font-bold">{profile.headline}</p>
				<p class="note mt-6 text-base">drilonrecica.github.io</p>
			</div>
			<StatusWindow />
		</div>
	</body>
</html>
```

- [ ] **Step 2: Render and capture.**
  - Run `npm run dev -- --port 4330` in the background.
  - With Playwright MCP: resize to 1200×630, `browser_emulate_media` reduced motion `reduce`, navigate to `http://localhost:4330/og`, and wait for fonts with evaluate `() => document.fonts.ready.then(() => true)`.
  - `browser_take_screenshot` with `filename: "public/og-image.png"`, `type: "png"`, `scale: "css"`.
  - Read the PNG back and check it: headline left, STATUS window right, nothing clipped.

- [ ] **Step 3: Remove the temporary page and verify.** Stop the dev server, then:

```bash
rm src/pages/og.astro
npx astro check && npm run build && npm test
python3 -c "import struct;d=open('public/og-image.png','rb').read(24);print(struct.unpack('>II',d[16:24]))"
```

Expected: checks pass, and it prints `(1200, 630)`.

- [ ] **Step 4: Commit.**

```bash
rtk git add public/og-image.png
rtk git commit -m "Regenerate the social preview as a STATUS window"
```

---

### Task 9: Final pass (docs, accessibility, performance)

**Files:**
- Modify: `README.md`; any file that the checks below show needs a fix.

- [ ] **Step 1: Update `README.md`** to match the new site. Replace these lines:
  - line 7 → `-   **Framework**: [Astro](https://astro.build/) (v7) - static output, no UI framework. The only shipped JavaScript is Astro's view-transition router plus a few lines for the mobile menu and the CV print button.`
  - line 9 → `-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) with design tokens as CSS custom properties; one dark "System" palette shared with igris.`
  - line 10 → `-   **Fonts**: Chakra Petch (self-hosted, OFL, in \`public/fonts\`) for headings and System labels; IBM Plex Mono via Fontsource; system sans for body text.`
  - line 18 → `  /components        # Nav, SystemWindow, StatusWindow, SystemFooter, Timeline, WorkCard, Figure, Icon`
  - line 26 → `    Layout.astro     # HTML shell, SEO, JSON-LD`
  - line 63 → `-   WCAG AA contrast (checked by \`npm test\`), visible keyboard focus, skip link, reduced-motion support.`

  Also add a "Tests" line wherever the README lists commands: `npm run build && npm test` checks the built site, the token contrast and the System helpers.

- [ ] **Step 2: Search for blueprint leftovers.** Run: `grep -rniE 'blueprint|drawing|title block|sheet [0-9]|theme-toggle|data-theme|ibm plex sans' src README.md`. Expected: no output, apart from the `.sheet` layout class (a container name, so it's fine to keep).

- [ ] **Step 3: Full test run.** Run: `npx astro check && npm run build && npm test`. Expected: 0 errors, all tests pass.

- [ ] **Step 4: Keyboard pass** on the preview at 1440 and 375, with Playwright `browser_press_key` Tab. The skip link appears first. Every link and button shows the glow focus ring, including inside windows and over `.panel` cards. On mobile, the menu opens with the toggle, closes with Escape, and `aria-expanded` follows.

- [ ] **Step 5: Lighthouse.** Use the chrome-devtools MCP `lighthouse_audit` on `http://localhost:4329/` and `http://localhost:4329/work/deutsche-bahn`. Expected: Performance, Accessibility, Best Practices and SEO all ≥ 95. Fix anything below that, re-run, then stop the preview.

- [ ] **Step 6: Content audit.** Compare the built home page with `src/data/*` and the MDX:
  - Level = current year − 2012.
  - Guild = AppDev GmbH.
  - Only DB is ACTIVE.
  - No Rank.
  - No new numbers anywhere.

- [ ] **Step 7: Commit, then stop for review.**

```bash
rtk git add -A README.md src
rtk git commit -m "Update README for the System redesign and fix final review findings"
```

Show the user the local preview and the commit list (`rtk git log --oneline origin/master..master`). **Do not push**: pushing `master` deploys the live site, and needs the user's explicit go-ahead.
