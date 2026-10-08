# Split the two personal sites by purpose: recica.dev = professional, github.io = "the System"

## Context
Drilon owns two personal sites that now clash:
- **recica.dev** (`~/Code/Drilon/recica.dev/recica/`, Astro, deployed by Coolify) is the *flagship professional site*: a "Technical Dossier" look aimed at hiring managers and clients. It has Wohin Du Willst, Qisara and EDEKA case studies, About and a CV. Its README says it owns "professional identity… personal SEO and structured data". It has no link to github.io.
- **drilonrecica.github.io** (this repo) is, after today's Solo Leveling redesign, a *second full portfolio* for the same audience. It has two of the same case studies (Wohin Du Willst, Qisara), its own CV, and a different job title.

The facts also disagree: the title, "Adrsys" (recica.dev typo) vs "adorsys", and claims that appear only on github.io ("13+ years", "millions of users", "six months").

**Decisions (user):**
1. **Direction: split by purpose.** recica.dev stays *the* professional site. github.io becomes **"the System"**, Drilon's builder and open-source home.
2. **One title everywhere:** **"Senior Mobile & Product Engineer"** (recica.dev's).
3. **github.io keeps:**
   - the STATUS hero, reworded;
   - the Shadow army (open source), expanded as the main section;
   - the secure-storage-android story (recica.dev doesn't have it);
   - a Tools & Labs window linking to tools.recica.dev and labs.recica.dev.
4. **Old github.io URLs forward to recica.dev:** `/cv`, `/work/deutsche-bahn` and `/work/qisara` become redirect pages to their recica.dev equivalents.

Facts follow recica.dev; github.io must not contradict it.

## Part 1: drilonrecica.github.io (this repo)

### Content and structure
- **`src/data/profile.ts`**
  - `title` → "Senior Mobile & Product Engineer".
  - New `headline` and `intro` (proposed copy below; the user reviews it).
  - Remove `proof` (the Stats strip goes).
  - Drop "13+ years" from the About text; use "since 2012", as recica.dev does.
  - Add `professionalSite: "https://recica.dev/"`. `home` is already that URL; reuse it rather than duplicate.
- **Hero** (`src/pages/index.astro`): keep `StatusWindow` (Class now reads the new title, Level 14, Guild AppDev GmbH). Proposed copy:
  - h1: **"I build things in the open."** (red full stop kept)
  - intro: "Open source, side projects and experiments by a Senior Mobile & Product Engineer who has been building for Android since 2012. For my professional profile, case studies and CV, visit recica.dev."
  - CTAs: **See projects** (`#open-source`, primary) · **Professional profile ↗** (recica.dev) · **GitHub ↗**.
- **Section order:**
  1. `[ SHADOW ARMY ]` Open source, the main section, expanded.
  2. `[ QUEST LOG ]` "From the archive", with only the secure-storage-android card.
  3. `[ TOOLS & LABS ]` More things I've built.
  4. `[ PLAYER ]` About, short.
  5. `[ ! SYSTEM MESSAGE ]` Contact.
- **Shadow army, expanded** (`src/data/projects.ts`): each project gets a `highlights: string[]` field with 2–3 facts taken only from its public README. They're rendered as a short list under the summary. For example:
  - Scouter: "~150 KB APK, no dependencies", "AMOLED-friendly HUD that only animates on change", "Go aggregator with ETag polling".
  - igris: "strict model ranks per task", "runs in herdr or tmux", "waits and notifies when a decision is needed".
  - Nise & Go: "deterministic generators", "fail-closed production config", "one Go binary for API, jobs and frontend".

  Wording is drafted from the READMEs and checked against them.
- **Tools & Labs window** (new data in `projects.ts` or a small `links` array): `tools.recica.dev` ("Privacy-first browser tools for developers: everything runs locally") and `labs.recica.dev` ("Interactive experiments and product prototypes"). Both come from those apps' READMEs.
- **About:** two or three sentences, linking "Full background, experience and CV → recica.dev".
- **Contact:** keep the System message and the email. Add "Professional profile and CV: recica.dev".
- **Removed from github.io:**
  - the Stats strip, the Experience timeline (`Timeline.astro`), Passive skills and Tools I use (`stackGroups` use);
  - the Wohin Du Willst and Qisara MDX case studies (`src/content/work/deutsche-bahn.mdx`, `qisara.mdx`);
  - `/cv` (`src/pages/cv.astro` plus its print CSS);
  - `public/Drilon_Recica_CV.pdf`. It carries the "Adrsys" typo, and the CV now lives at recica.dev/cv.pdf.
  - Delete code that becomes unused (Timeline, the `stackGroups` export if unused, print-only CSS). Keep `experience.ts` only for what's still read: `experience[0].company` for Guild and worksFor.
- **Nav:** Projects (`/#open-source`) · Archive (`/#work`) · Tools (`/#tools`) · About · **recica.dev ↗**. The current-page red underline logic stays.

### Redirects for removed URLs
- New `src/pages/cv.astro`, `src/pages/work/deutsche-bahn.astro` and `src/pages/work/qisara.astro` become tiny redirect pages using a shared `src/components/Redirect.astro`. Each has:
  - `<meta http-equiv="refresh" content="0; url=…">`
  - `<link rel="canonical" href="…">`
  - a visible fallback link.
- Targets:
  - `https://recica.dev/cv/`
  - `https://recica.dev/work/wohin-du-willst/`
  - `https://recica.dev/work/qisara/`
- The `/work/[slug]` dynamic route keeps serving only `security-library`. The static redirect files take precedence for the two removed slugs, since their MDX files are deleted.
- Exclude the redirect pages from the sitemap using `@astrojs/sitemap`'s `filter` option in `astro.config.mjs`.

### SEO
- The JSON-LD stays a `ProfilePage` about `https://recica.dev/#drilon`, with `jobTitle` updated by the title change.
- The home `<title>` becomes "Drilon Reçica | Open source & side projects".
- The meta description is rewritten to match the new purpose.
- Regenerate `public/og-image.png` with the same temporary-page and Playwright method as before. The headline changes, so the image must too.

### Tests (`tests/site.test.mjs`)
- **Remove or replace** the tests for the timeline, the `/cv` page and print styling, the DB and Qisara quest reports, and the "3 marks, 1 active" count.
- **Add:**
  - the redirect pages have meta refresh and canonical to the exact recica.dev URLs, and are absent from the sitemap;
  - the home page has the new sections and tags (`Tools & labs`), and links to `https://recica.dev/`;
  - each project renders its highlights;
  - the title reads "Senior Mobile & Product Engineer" in the STATUS window and JSON-LD.
  - Re-baseline the red-mark count: the timeline "Now" is gone, so it's 4.
- Keep the contrast, motion and `@supports`, and alert tests.
- Update `README.md` (purpose, page list) and the spec doc (`docs/superpowers/specs/…`) with a short "Site purpose after the split" section.

## Part 2: recica.dev (other repo, small, careful)
That repo has **uncommitted work by the user** (`.gitignore`, `Makefile`, `film/`, `video-ideas.md`). **Do not stage or touch those.** Only add the files changed below. Read its `AGENTS.md` workflow first (inspect, tests, update docs), and run its checks via its `Makefile` or `recica/` scripts.
- **Fix the employer name:** `recica/src/lib/site-content.ts:424` "Adrsys GmbH & Co. KG" → "adorsys GmbH & Co. KG".
- **Link github.io:**
  - Add `https://drilonrecica.github.io/` to `siteConfig.socialLinks`. That feeds `sameAs` in `src/components/seo/Meta.astro:86`, and check whether it's also rendered as a visible social link.
  - Add one visible link in the Tools & Labs section: "Open source & side projects → drilonrecica.github.io".
- Optionally name the library in the experience bullet (`site-content.ts:444`): "secure-storage-android" with a link. The user decides at review; it's not done by default.
- Commit locally in recica.dev; **no push without the user's go-ahead**, since pushing deploys via Coolify.
- **User's own action:** fix the "Adrsys" typo in the CV PDF (recica.dev `public/cv.pdf`) at its source document.

## Execution
- Use subagent-driven development with tasks:
  1. github.io content and data changes;
  2. redirect pages and sitemap filter;
  3. removals and code cleanup;
  4. SEO, OG image, README and spec;
  5. the recica.dev fixes;
  6. a final review.
- Test-first where a test applies. Commit per task on each repo's `master`.
- Pushes happen only on the user's go-ahead, one per repo.

## Verification
- **github.io:**
  - `npx astro check`, `npm run build` and `npm test` all pass.
  - Preview: `/` shows the new hero, the Shadow army with highlights, the archive (one card), Tools & Labs, About and Contact.
  - `/cv`, `/work/deutsche-bahn` and `/work/qisara` land on the right recica.dev pages (checked with Playwright: navigate, then assert the final URL).
  - `/work/security-library` still renders.
  - The sitemap lists only `/` and `/work/security-library/`.
  - There's no horizontal scroll at 375 px.
  - Grep the build for "13+ years", "millions" and "six months": none.
- **recica.dev:** its own checks pass, "adorsys" is spelled correctly, and the github.io link shows in both the visible markup and the JSON-LD `sameAs`.
- **After the pushes:** both live sites work, the old github.io URLs redirect to recica.dev, and the two sites link to each other.
