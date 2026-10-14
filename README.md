# riverofreticence.com

Static site for *River of Reticence*, a novel by Geri Miller. Built with [Astro](https://astro.build).

## Editing content

Nearly everything lives in `src/data/site.ts`: blurb, buy links, excerpt, reviews, author bio, newsletter URL, contact email.
Anything set to `null` (or an empty list) is hidden or shown as "coming soon".

- Author page: `src/pages/about.astro` (bio, photo and `sameAs` profile links come from `authorInfo` in `site.ts`)
- Structured data (schema.org JSON-LD): `src/data/seo.ts`
- `robots.txt`: `public/robots.txt`. Sitemap is generated at build (`@astrojs/sitemap`).
- Cover: `src/assets/cover.jpg` (front cover; `cover-full.jpg` includes the spine)
- Social share image: `public/og-cover.jpg` (1200×630); stable cover URL for structured data: `public/cover.jpg`
- Styles: `src/styles/global.css`

## Commands

| Command           | Action                                   |
| ----------------- | ---------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Dev server at `localhost:4321`           |
| `npm run build`   | Build the static site to `./dist/`       |
| `npm run preview` | Preview the build locally                |

Deploy: any static host. Build command `npm run build`, output directory `dist`, Node 22+.

## Hosting

GitHub Pages, deployed by `.github/workflows/deploy.yml` on every push to `main`.
Custom domain is set by `public/CNAME`. DNS stays at Namecheap:

| Type  | Host | Value                |
| ----- | ---- | -------------------- |
| A     | @    | 185.199.108.153      |
| A     | @    | 185.199.109.153      |
| A     | @    | 185.199.110.153      |
| A     | @    | 185.199.111.153      |
| CNAME | www  | brustici.github.io.  |
