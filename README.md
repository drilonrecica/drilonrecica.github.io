# Drilon Reçica - Portfolio

Personal site of a senior mobile engineer: a landing page, three case studies and a printable CV, styled as a dark Solo Leveling "System" interface.

## Tech Stack

-   **Framework**: [Astro](https://astro.build/) (v7) - static output, no UI framework. The only shipped JavaScript is Astro's view-transition router plus a few lines for the mobile menu and the CV print button.
-   **Content**: MDX content collection for case studies, typed data files for everything else.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) with design tokens as CSS custom properties; one dark "System" palette shared with igris.
-   **Fonts**: Chakra Petch (self-hosted, OFL, in `public/fonts`) for headings and System labels; IBM Plex Mono via Fontsource; system sans for body text.
-   **Deployment**: GitHub Actions + GitHub Pages.

## Project Structure

```bash
/src
  /assets            # Images processed by Astro (portrait)
  /components        # Nav, SystemWindow, StatusWindow, SystemFooter, Timeline, WorkCard, Figure, Icon
    /diagrams        # Inline SVG diagrams (hero and case studies)
  /content/work      # Case studies (MDX)
  /data
    profile.ts       # Name, headline, bio, links, proof facts, education
    experience.ts    # Employers, projects, dates, tools - feeds the home page AND /cv
    work.ts          # Case-study query (drafts are dev-only)
  /layouts
    Layout.astro     # HTML shell, SEO, JSON-LD
  /pages
    index.astro      # Home
    work/[slug].astro
    cv.astro         # Web CV with print stylesheet
    404.astro
  /styles
    global.css       # Tokens, base styles, components, diagram classes, print rules
  content.config.ts  # Schema for the work collection
/public              # CV PDF, favicons, OG image, robots.txt
/docs                # Design spec for the redesign
```

## Getting Started

```bash
npm install
npm run dev        # http://localhost:4321
npx astro check    # type-check
npm run build      # production build into dist/
npm run build && npm test   # checks the built site, the token contrast and the System helpers
```

## Updating Content

-   **Roles, dates, projects, tools**: edit `src/data/experience.ts`. The home timeline and `/cv` both read from it, so they cannot drift apart.
-   **Headline, bio, links, proof facts**: edit `src/data/profile.ts`.
-   **Case studies**: add or edit an `.mdx` file in `src/content/work/`. Set `draft: true` to keep one out of production builds while you write; drafts still show in `npm run dev`.
-   **CV PDF**: replace `public/Drilon_Recica_CV.pdf`.
-   **OG image**: replace `public/og-image.png` (1200x630).

## Deployment

Pushing to `master` deploys to GitHub Pages through `.github/workflows/deploy.yml`. In the repository settings, **Pages > Source** must be set to **GitHub Actions**.

## Quality bar

-   Lighthouse: 100 accessibility, 100 best practices, 100 SEO.
-   WCAG AA contrast (checked by `npm test`), visible keyboard focus, skip link, reduced-motion support.
-   Responsive from 320px up; `/cv` prints cleanly to A4.
