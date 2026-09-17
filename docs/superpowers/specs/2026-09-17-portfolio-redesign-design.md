# Redesign drilonrecica.github.io — "Blueprint" portfolio

## Context

The current site is a single 1,100-line `src/pages/index.astro` with a generic dark/glass/gradient dev-template look. It lists facts without telling a story, has no person in it (no photo, no voice), ships React + framer-motion for fade-ins and a nav toggle, and contradicts the CV (a "1M+ downloads" claim vs. "up to 10k" for own apps; wrong Edeka/RMVGo dates; Edeka titled "Flutter Engineer" with Android tags; duplicate "MVVM" tag; wrong Stack Overflow icon).

Goal: a complete redesign that showcases Drilon to **both clients and employers equally** — a skimmable landing page plus deep case studies — with a distinctive **engineered/blueprint** identity, accurate content, and near-zero JS.

Decisions made with the user:
- Structure: one landing page + 3 case studies (**Deutsche Bahn – Wohin Du Willst**, **Qisara**, **open-source Android security library**) + web-native `/cv` + `404`.
- Aesthetic: engineered/blueprint, light + dark themes (system default, manual toggle).
- English only. Personal elements: photo + short about. **No** availability pill, **no** location/remote block.
- Content: **interview the user first** per project; nothing unverified gets published.
- Tech: Astro-native, remove React entirely, CSS motion; animated hero diagram as the final, separable phase.
- Git: commit directly on `master`, no branches. Commit per phase **locally**; push once at the end after user review (push to `master` = live deploy via `.github/workflows/deploy.yml`).

## Keep / reuse
- Astro 6 + Tailwind 4 (`@tailwindcss/vite`) setup in `astro.config.mjs`; GitHub Actions deploy workflow (unchanged).
- `src/layouts/Layout.astro` head: favicons, canonical, OG/Twitter tags — extend with per-page `description`/`image` props rather than rewrite.
- `src/styles/global.css`: keep the `:focus-visible` ring and `prefers-reduced-motion` block patterns; replace everything else.
- `public/` favicons, manifest, `Drilon_Recica_CV.pdf` (stays as the download).
- Real links from the current page (Play Store URLs, qisara.com, GitHub, LinkedIn, Stack Overflow `users/3392276`, X, email).

## Design system (blueprint)
- **Tokens** as CSS custom properties in `global.css`, exposed to Tailwind via `@theme`; light palette on `:root`, dark under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])` and again under `:root[data-theme="dark"]`.
  - Light: drafting-paper ground, navy ink, blueprint-blue linework. Dark: cyanotype navy ground, pale-blue linework. One "revision-mark" orange accent (links, focus, key marks). All text pairs WCAG AA.
- **Type**: IBM Plex Sans (text/headings) + IBM Plex Mono (labels, annotations, captions only) via `@fontsource-variable/*` / `@fontsource/*`; drop Inter + JetBrains Mono.
- **Motifs**: faint measured grid background, hairline rules, numbered sheet headers (`01 — SELECTED WORK`), corner registration marks on cards, dimension lines on the timeline, `FIG. n` captions, drawing **title block** footer (`DRAWN BY D. REÇICA · REV <build date> · SHEET n/N`).
- **Motion**: CSS only — line draw-in (`stroke-dashoffset`), settle-in reveals via scroll-driven animations with `@supports` fallback to visible; Astro View Transitions (`<ClientRouter />`) between home cards and case studies. No loops. Everything disabled under reduced motion.
- Invoke the `frontend-design` skill at the start of Phase 2 to sharpen the type scale, spacing and palette values.

## Architecture
```
src/
  content.config.ts            # `work` collection (MDX) with zod schema
  content/work/{deutsche-bahn,qisara,security-library}.mdx
  data/profile.ts              # name, tagline, bio, links, languages, proof facts
  data/experience.ts           # employers → nested projects, dates, roles, stack (feeds home + /cv)
  layouts/Layout.astro         # extended head, theme bootstrap script, Nav, TitleBlock
  layouts/WorkLayout.astro     # case-study shell: SpecBlock + prose + prev/next
  components/
    Nav.astro  ThemeToggle.astro  TitleBlock.astro  SheetSection.astro
    Hero.astro  ProofStrip.astro  WorkCard.astro  Timeline.astro
    Principle.astro  StackList.astro  About.astro  Contact.astro
    SpecBlock.astro  Figure.astro  Icon.astro   # one inline-SVG icon component (fixes SO icon)
    diagrams/LegacyToModular.astro  diagrams/<per-case-study>.astro
  pages/index.astro  pages/work/[slug].astro  pages/cv.astro  pages/404.astro
  styles/global.css  styles/print.css
```
- `work` schema: `title, client, role, period, team, platform, stack[], links[], summary, order, draft`.
- Vanilla JS only: inline theme bootstrap in `<head>` (no flash), theme toggle, mobile nav toggle (`aria-expanded`, Escape to close).
- Dependencies: **remove** `react`, `react-dom`, `@astrojs/react`, `framer-motion`, `@types/react*`, `@fontsource/inter`, `@fontsource/jetbrains-mono`; **add** `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/check`, `typescript`, Plex fontsource packages. Delete `src/components/{Navbar,ProjectTitleLink}.tsx`, `src/components/motion/*`; clean JSX settings from `tsconfig.json`. Use context7 for current Astro 6 content-collection / MDX / View Transitions APIs.

## Pages
**Home** (`/`): 1) Hero — name, positioning sentence, photo as framed "detail inset", CTAs (Case studies · CV · Email), static legacy→modular diagram. 2) Proof strip — 4 verified facts. 3) Selected work — 3 `WorkCard`s. 4) Experience timeline — per employer (AppDev 2020–present → DeenLabs 2023–2024 → Adrsys 2015–2020) with nested projects and CV-accurate dates; Edeka, RMVGo, Fymio, Ergo as compact entries. 5) How I work — 3–4 evidence-backed principles + grouped, de-duplicated stack list (replaces Expertise + tag cloud). 6) About — photo, short bio, spoken languages. 7) Contact + title-block footer.

**Case study** (`/work/<slug>`): SpecBlock → Context → Problem → Approach (SVG architecture `Figure`) → Outcome → Reflection → prev/next.

**/cv**: generated from `profile.ts` + `experience.ts`; `print.css` for clean A4 export; links to the PDF download.

**404**: blueprint "sheet not found".

**Meta**: per-page title/description, JSON-LD `Person`, sitemap, `public/robots.txt`, new blueprint `og-image.png` (render an `/og` layout and screenshot it with Playwright at 1200×630).

## Phases (one commit on `master` each, not pushed until the end)
0. **Spec** — write this design to `docs/superpowers/specs/2026-09-17-portfolio-redesign-design.md`; commit.
1. **Content interview** — ask the user focused questions per case study (team size, what was broken, decisions made, measurable outcomes, NDA limits, screenshots allowed?), plus bio, positioning sentence, proof facts, photo file, which own-app/download claim is true. Record answers in `src/data/*` and MDX drafts. Unanswered items stay `draft: true` / omitted — never invented.
2. **Foundation** — dependency swap, tokens, fonts, `Layout`, `Nav`, `ThemeToggle`, `TitleBlock`, `SheetSection`, `Icon`.
3. **Home page** — data files + all home sections; delete old components.
4. **Case studies** — collection, `WorkLayout`, `SpecBlock`, `Figure`, static diagrams, three MDX pages, View Transitions.
5. **/cv + 404 + print stylesheet**.
6. **SEO / a11y / perf pass** — meta, JSON-LD, sitemap, robots, OG image, README update; fix findings.
7. **Signature hero diagram** — animate `LegacyToModular` (scroll-driven CSS first; small vanilla JS only if needed). Separable: skip or revert without affecting the rest.
8. **User review of local preview → push `master`** (only on the user's go-ahead).

## Verification
- `npx astro check` and `npm run build` clean after every phase; confirm no React/framer chunks in `dist/`.
- `npm run preview` + Playwright MCP: screenshots of `/`, each `/work/*`, `/cv`, `/404` at 375 / 768 / 1440 px in light and dark; check no horizontal scroll, theme toggle persistence, no theme flash.
- Keyboard pass: skip link, nav, toggle, cards, focus visible everywhere; mobile menu Escape/aria state.
- Reduced-motion emulation: no animation, all content visible.
- chrome-devtools MCP Lighthouse on `/` and one case study: Performance, Accessibility, Best Practices, SEO ≥ 95; contrast AA.
- Print preview of `/cv` to PDF: fits cleanly on A4.
- Content audit: every date, title and number on the site matches `experience.ts` and the user's interview answers; no `draft` content in the build.
- After push: confirm the GitHub Actions deploy succeeds and the live site renders.
