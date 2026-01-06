# Drilon Recica - Developer Portfolio

A high-performance, accessible, and futuristic portfolio website built for a Senior Android & Flutter Engineer.

## Tech Stack

This project uses a modern, lightweight, and performant stack:

-   **Framework**: [Astro](https://astro.build/) (v5) - Zero-JS by default, islands architecture.
-   **UI Library**: [React](https://react.dev/) - Used for interactive components (Navbar, Animations).
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4 Alpha) - Utility-first styling with a custom design system.
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) - Complex orchestrations and entering transitions.
-   **Deployment**: GitHub Actions + GitHub Pages.

## Project Structure

```bash
/src
  /components
    /motion        # Framer Motion layout wrappers (Reveal, Stagger)
    Navbar.tsx     # React hydrated interaction
  /layouts
    Layout.astro   # Main HTML shell, SEO, global styles
  /pages
    index.astro    # The single-page application entry point
  /styles
    global.css     # Tailwind directives, custom utilities (glass-card, scan-line)
/public            # Static assets (CV, favicons, OG images)
```

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/drilonrecica/drilonrecica.github.io.git
    cd drilonrecica.github.io
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The site will be available at `http://localhost:4321`.

## Customization

### Updating Content
All content is statically defined in `src/pages/index.astro`. You can update:
-   **Hero Text**: Modify the `<h1>` and description.
-   **Experience Cards**: Edit the card props and content directly in the HTML.
-   **Expertise Grid**: Add or remove grid items.
-   **Links**: Update `href` attributes for CV, LinkedIn, etc.

### Updating Assets
-   **CV**: Replace `public/Drilon_Recica_CV.pdf`.
-   **OG Image**: Replace `public/og-image.png`.
-   **Favicons**: Update files in `public/`.

## Deployment

The project is configured to deploy automatically to **GitHub Pages** via **GitHub Actions**.

### Workflow
The workflow is defined in `.github/workflows/deploy.yml`:
1.  Triggers on push to `master`.
2.  Sets up Node 20.
3.  Installs dependencies (`npm ci`).
4.  Builds the site (`npm run build`).
5.  Uploads the `dist/` artifact to GitHub Pages.

### Important
Ensure your repository settings are correct:
1.  Go to **Settings** > **Pages**.
2.  Set **Source** to **GitHub Actions** (NOT "Deploy from a branch").

## Performance & Accessibility highlights
-   **Lighthouse**: Target score of 100/100 across board.
-   **Reduced Motion**: `global.css` automatically disables intensive animations if the user's OS requests reduced motion.
-   **Responsive**: Fully fluid layout from 320px to 4k.
-   **SEO**: Full Open Graph and Twitter Card support.
