# [Skylanders Image Generator](https://skylandersnfc.github.io/Skylanders-Image-Generator/)

A Skylanders Image Generator that lets you create printable cover images for your NFC cards and coins.

Built as a statically-generated [Nuxt](https://nuxt.com) app.

# [<img src="images/preview.webp">](https://skylandersnfc.github.io/Skylanders-Image-Generator/)

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
- **`app/data/games.ts`** is the only hand-authored data: per-game titles, colours,
  backgrounds, and the human labels + Front/Back grouping for each cover set.
- **Pages**: `app/pages/[game]/index.vue` (landing), a single
  `app/pages/[game]/[type]/[set].vue` that replaces the old 90 generator HTML
  files, and `app/pages/creators.vue`. `/` redirects to `/spyro`.

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
