# Skylanders CoverForge

Printable cover-art sheets for Skylanders NFC cards & coins. A community fork of the
[SkylandersNFC Image Generator](https://github.com/skylandersnfc/Skylanders-Image-Generator),
rebuilt as a statically-generated [Nuxt](https://nuxt.com) app.

Pick a game → choose a creator's cover set → curate the covers you want → print a
size-accurate sheet.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000  (auto-runs the manifest build first)
```

## Build a static site

```bash
pnpm generate     # outputs .output/public — deploy this to any static host
pnpm preview      # preview the generated site locally
```

## How it works

> Background on the pre-migration site and why the new structure is the way it is:
> see [`docs/MIGRATION.md`](docs/MIGRATION.md).


- **Image assets** live untouched under `assets/` and `images/` (kept in place so
  upstream changes merge cleanly — see below). Nitro serves them as static files
  at `/assets/...` and `/images/...` (configured in `nuxt.config.ts`).
- **`scripts/build-manifest.mjs`** scans the `assets/` folder tree and writes
  `app/data/manifest.json` (`{ game: { cards|coins: { set: [image paths] } } }`).
  It runs automatically before `dev`/`build`/`generate`. Single-image
  `Back_Covers*` sets are tiled to fill a print sheet (card backs ×9, coin backs ×70).
- **`app/data/games.ts`** is the only hand-authored data: per-game titles, colours
  (`color` + darker `accentDark`), release year, logo, background, and the human
  labels + Front/Back grouping for each cover set.
- **`app/composables/useCoverSet.ts`** turns a set's flat image list into a nested
  **category tree** + clean cover names (derived from the folder paths). Sheet maths
  (per-row / per-sheet) lives in **`app/utils/print.ts`**.

### Screens (information architecture)

- `app/pages/index.vue` — **home**, a game selector grid (`GameCard`).
- `app/pages/[game]/index.vue` — **set gallery**: Cards/Coins + Front/Back tabs +
  search, a grid of `SetCard`s (real cover thumbnails + creator credit).
- `app/pages/[game]/[type]/[set].vue` → `GeneratorTool.vue` — the **generator**:
  sidebar (paper A4/Letter, width slider, collapsible category tree) + a live
  multi-select preview grid + a sticky count / sheet-estimate / **Print** bar.
  Opens with nothing selected; print output is a bare mm-accurate grid (white page).
- `app/pages/creators.vue` — credits + community-fork note.
- `app/error.vue` — themed 404 / error page.

### Look & feel

- Design system "CoverForge": neutral warm shell + per-game accent, fonts **Fredoka**
  / **DM Sans** / **DM Mono** self-hosted via `@nuxt/fonts`. Tokens/base in
  `app/assets/css/main.css`; generator + print styles in `generator.css`.
- Brand mark / favicons in `public/` (`favicon.svg`, `favicon.ico`,
  `apple-touch-icon.png`, `icon-192/512.png`, `site.webmanifest`). Per-game logos in
  `public/games/`.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds on every push to `main` and publishes
`.output/public` via GitHub Actions (`NITRO_PRESET=github-pages` so `_nuxt`/`_fonts`
survive). In the repo: **Settings → Pages → Source: GitHub Actions**, then set the
custom domain there. `app.baseURL` is `/` (root/custom-domain deployment).

## Merging upstream image changes

Because `assets/` and `images/` are never moved or rewritten, you can pull the
upstream image assets and merge normally:

```bash
git remote add upstream https://github.com/skylandersnfc/Skylanders-Image-Generator.git
git fetch upstream
git merge upstream/main        # touches only assets/ & images/ → clean merge
pnpm generate                  # new images are picked up automatically
```

New **images** inside an existing set need no code changes. A brand-new **set**
or **game** needs a one-line entry in `app/data/games.ts` (label + grouping).
