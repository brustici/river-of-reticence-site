# riverofreticence.com

Static site for *River of Reticence*, a novel by Geri Miller. Built with [Astro](https://astro.build).

## Editing content

Nearly everything lives in `src/data/site.ts`: blurb, buy links, excerpt, reviews, author bio, newsletter URL, contact email.
Anything set to `null` (or an empty list) is hidden or shown as "coming soon".

- Cover: `src/assets/cover.jpg` (front cover; `cover-full.jpg` includes the spine)
- Social share image: `public/og-cover.jpg`
- Styles: `src/styles/global.css`

## Commands

| Command           | Action                                   |
| ----------------- | ---------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Dev server at `localhost:4321`           |
| `npm run build`   | Build the static site to `./dist/`       |
| `npm run preview` | Preview the build locally                |

Deploy: any static host. Build command `npm run build`, output directory `dist`, Node 22+.
