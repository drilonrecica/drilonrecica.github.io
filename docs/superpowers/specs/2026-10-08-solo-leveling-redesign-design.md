# Redesign drilonrecica.github.io as a Solo Leveling "System" (design spec)

> Replaces the blueprint design in `2026-09-17-portfolio-redesign-design.md`. Approved in brainstorming on 2026-10-08.

## Context
Drilon's open-source projects have strong anime identities: **igris** (Solo Leveling "System window": abyss navy, cyan glow, red plume, Chakra Petch, "Arise.") and **Scouter** (Dragon Ball HUD: black, teal lines, animation only on change). Drilon wants the homepage to share that spirit. We compared Solo Leveling, One Piece, Attack on Titan, Re:Zero, Death Note, Evangelion and Hunter x Hunter. Solo Leveling is the only one whose world maps onto the *whole* page (status window = profile, quests = case studies, skills, shadows = own projects), and it ties directly to igris.

The audience is unchanged: clients and employers equally. Rules carried over: nothing unverified is published, no client internals or criticism, commit on `master`, push only on the user's go-ahead.

## Decisions (confirmed with user)
- **Intensity:** readable first, anime underneath. A recruiter skimming for 30 s sees a sharp, dark, game-UI site with clear content; fans catch the references.
- **Metaphor:** Solo Leveling, applied consistently across the site.
- **Scope:** whole site in one system. The homepage gets the full System treatment, case studies become quest reports, `/cv` stays sober and prints cleanly, and 404 becomes a joke page.
- **Theme:** dark only. Remove the theme toggle and the light palette.
- **Copy voice:** dual labels. Plain headings carry the meaning; small System tags such as `[ QUEST LOG ]` sit above them. Body copy and nav stay plain English.
- **Palette:** shared System blue with igris, plus Drilon's own accent instead of the red plume.
- **No Rank field.** Every status field must be factual.

## Visual language
- **Tokens** (`src/styles/global.css`, `:root` only, `color-scheme: dark`):
  - From igris: `abyss #05070F` (page), `armor #0A1124` (windows), `night #0B1E46` / `deep #123A7A` (borders), `glow #3CC8FF` (System UI, links, focus), `glow-core #B8F0FF`, `snow #EAF4FF` (text), `muted #9DB0D3` (secondary text).
  - Own accent: **gate violet** (~`#8B5CF6`, tuned to pass AA where it carries text). It is used sparingly: ACTIVE/CLEARED marks, active states and the Arise moment.
  - Exposed to Tailwind through `@theme`, as today.
- **Type:**
  - Chakra Petch 600/700 for headings and System labels (woff2 + OFL copied from `../igris/site/fonts/`, self-hosted with `@font-face`).
  - A plain sans for body text (system UI stack like igris's `--sans`, named fonts only).
  - IBM Plex Mono for small metadata.
  - Remove `@fontsource/ibm-plex-sans`.
- **The System window**, one component used everywhere: an `armor` panel, a 1px `deep` border, a faint top-edge inner glow, cut corner brackets, and a title bar with the `[ TAG ]` label.
- **Background:** plain abyss with a faint gradient toward night blue at the top. The blueprint grid goes.
- **Motion:** only to mark a change.
  - On load, the hero window materialises (border draw-in, title-bar scan, Level count-up), under 1 s.
  - Windows fade in once when scrolled into view, using scroll-driven CSS with an `@supports` fallback that leaves them visible.
  - The igris card plays a one-time "Arise." flourish.
  - No loops. Everything is off under `prefers-reduced-motion`.
  - The only JS is the existing mobile nav toggle.

## Homepage (`src/pages/index.astro`)
| Tag | Heading | Content (all existing, verified data) |
|---|---|---|
| `[ STATUS ]` hero | `profile.headline` | Status sheet: Name, Class (`profile.title`), **Level** = current year − 2012 (computed at build time, labelled "years building for Android"), Guild = current employer from `experience[0]`. Intro and CTAs (Case studies · CV · Email) beside it. The `LegacyToModular` diagram leaves the hero (it stays in the DB case study). |
| `[ STATS ]` | (strip) | The 4 `profile.proof` facts as stat cells. |
| `[ QUEST LOG ]` | Selected work | `WorkCard`s with a status mark: `◆ ACTIVE` when the period is ongoing (DB), otherwise `◆ CLEARED`. |
| `[ SHADOW ARMY ]` | Open source | `projects.ts` entries; igris gets the one-time "Arise." moment. |
| `[ HUNTER RECORD ]` | Experience | `Timeline` restyled: employers as guild entries with nested client projects. |
| `[ PASSIVE SKILLS ]` / `[ SKILLS ]` | How I work / Tools I use | Principles + `stackGroups`. |
| `[ PLAYER ]` | About | Bio, languages, portrait in a window frame. |
| `[ ! ] SYSTEM MESSAGE` | Contact | "A new quest has arrived." Full email shown, an **Accept** button (mailto), profile links and the CV PDF. |

- **Nav** stays plain: Work · Experience · About · CV · Contact.
- **Footer:** `TitleBlock` is replaced by a one-line System footer with the build date.

## Other pages
- **Case study** (`src/pages/work/[slug].astro`):
  - A `[ QUEST INFO ]` window replaces the spec block (client, role, period, platform, stack, links, ACTIVE/CLEARED).
  - The prose stays in the body sans at ~68ch, with Chakra Petch headings.
  - The diagrams (`components/diagrams/*.astro`) are recoloured to glow-on-armor by swapping tokens only.
  - Navigation becomes `◂ PREVIOUS QUEST` / `NEXT QUEST ▸`.
- **`/cv`:** dark tokens and fonts on screen, no themed labels. The print stylesheet forces black on white with the plain sans.
- **`/404`:** a `[ ! ] GATE CLOSED` window, "This dungeon doesn't exist.", with a link home.
- **OG image:** regenerated as a STATUS window at 1200×630 (render a layout, then screenshot it with Playwright), replacing `public/og-image.png`.

## Code changes
- New components:
  - `SystemWindow.astro` (props: `tag`, `title`, `id`, `note?`); `SheetSection` is replaced by it.
  - `StatusWindow.astro` (hero).
  - `SystemFooter.astro`.
- Removed: `ThemeToggle.astro`, `TitleBlock.astro`, the theme bootstrap script and the light/dark blocks in `Layout.astro` / `global.css`.
- Restyled: `Nav`, `WorkCard`, `Timeline`, `Figure`, `Icon` (unchanged API), `[slug].astro`, `cv.astro`, `404.astro`.
- Data: `profile.ts`, `experience.ts`, `projects.ts` and the MDX files keep their content. The ACTIVE/CLEARED status is derived (from `experience` / `period`), not hand-written, where possible.
- No new runtime dependencies.

## Phases (one local commit on `master` each)
1. Tokens, fonts, `SystemWindow`, Layout/Nav/footer, theme toggle removed
2. Homepage
3. Case studies and diagram recolouring
4. `/cv` (print), 404, OG image
5. Accessibility, contrast and performance pass. Then the user reviews the local preview, and we **push only on the user's go-ahead**.

## Verification
- `npx astro check` and `npm run build` pass after every phase.
- `npm run preview` + Playwright: screenshots of `/`, each `/work/*`, `/cv` and `/404` at 375 / 768 / 1440 px. No horizontal scroll.
- Contrast: measure every text/background pair (especially glow, muted and violet on abyss/armor) against WCAG AA.
- Reduced-motion emulation: no animation, all content visible. Keyboard pass with a visible focus ring everywhere, and the mobile menu's Escape key and `aria-expanded` working.
- Lighthouse (chrome-devtools MCP) of 95 or higher on `/` and one case study.
- Print preview of `/cv`: black on white, clean A4.
- Content audit: no new facts introduced. Level matches 2012, and ACTIVE/CLEARED matches the periods.

## Adjustments made while planning
- `LegacyToModular` is retired rather than moved into the DB case study: that case study says the app stays a single module, so a modularisation diagram there would contradict it and depict a named client's code as a tangle.
- The Level "count-up" is a scan-line wipe; the number stays real text.
- "Arise." is scroll-linked (plays as the igris card enters the viewport) so it needs no JavaScript.

## Plume red accent (added 2026-10-08, strengthened the same day)
- **Roles:**
  - Cyan is the working System colour: frames, labels, buttons, focus rings, and links at rest.
  - Violet is Drilon's own colour: ACTIVE quests and "Arise.".
  - Red is the plume, as on igris's helm: the signature, one mark per window, interaction feedback, System reactions and alerts.
- **Tokens:**
  - `--plume #e3172b` is igris's red, for lines. It is 3.95:1 on armor, which is fine for marks.
  - `--plume-text #ff5a66` is for glyphs, at 6.17:1.
  - Both print as black.
- **Placements:**
  - The signature: a red `/` before "Drilon Reçica" in the nav, aria-hidden.
  - The bottom-right corner bracket of every window.
  - Hover underlines on nav links, text links and case-study card titles.
  - The current nav item (`aria-current="page"`, server-rendered for `/cv` and the case studies).
  - The hero's load scan line.
  - Text selection: plume background with white text, 4.75:1.
  - The `!` and a 3px left border on the alert title bars (`[ ! SYSTEM MESSAGE ]`, `[ ! GATE CLOSED ]`).
  - The 404 window as a red gate, with both corners and the glow in red.
- **Never** a fill, and never on body text, quest marks, buttons or focus rings, where red would read as an error.
