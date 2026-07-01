# Migration: static HTML site → Nuxt SSG

This document records what the project looked like before, why it was migrated, and
the decisions (and their reasons) behind the new structure. It's written for a
future maintainer — human or AI — who needs to understand *why* things are the way
they are before changing them.

**Status:** Step 1 (faithful port) complete 2026-07-01. Step 2 (the "CoverForge" UX
redesign) complete 2026-07-02 — see [§7](#7-step-2--the-coverforge-redesign).

---

## 1. The original site (pre-migration)

A hand-written static site deployed to GitHub Pages. Structure:

```
index.html            # Spyro landing page (data-page="spyro")
giants.html           # one landing page per game (giants, swapforce,
swapforce.html         #   trapteam, superchargers, imaginators)
trapteam.html
superchargers.html
imaginators.html
creators.html         # credits page
css/
  styles.css          # site chrome: nav, footer, per-game button colours,
                      #   per-game backgrounds via html[data-page="…"]
  styles_generate.css # generator preview + @media print (mm-accurate) layout
  creators.css
scripts/
  generator_cards.js  # generator logic for cards  (pxPerMm 3.2, card ratio)
  generator_coins.js  # generator logic for coins  (pxPerMm 7,   square)
assets/
  01_Spyro/ 02_Giants/ … 06_Imaginators/
    cards/ | coins/
      <CreatorSet>/                 # e.g. Mr_Shadow, Sobersu_Logo, Back_Covers
        *_generator.html            # a page that loads the shared script + list.txt
        list.txt                    # JS: `const cards = [...]` / `const coins=[...]`
        Generate_Structure.py       # regenerates list.txt from the folder contents
        <the actual .jpg / .png images, in numbered subfolders>
images/                             # backgrounds (per game .webp), avatars, sample.jpg
```

### How a generator worked

Each of the **90** `*_generator.html` files was near-identical. It loaded
`generator_cards.js` (or `_coins.js`) plus a sibling `list.txt`. `list.txt` was not
data — it was JavaScript that defined a global `const cards = [...]` (an array of
image paths relative to that folder).

The flow: the user picked **paper type** (A4/Letter) and a **card/coin width**, clicked
**Generate**, and the script rendered two grids from the array — an on-screen preview
grid and a hidden print grid laid out in real millimetres so printed cards come out
physically correct. Clicking a preview image removed it; **Print** invoked
`window.print()`, and `@media print` rules swapped to the print grid.

### Pain points that motivated the migration

- **90 duplicated HTML files.** Every creator set was its own copy-pasted page. Adding
  a set or changing the generator meant editing many files.
- **Clunky UX.** Two-step "pick size → Generate" gate; no live updates.
- The owner wanted a maintainable base to **add their own improvements**.

---

## 2. Goal & scope

Migrate to a **Nuxt 4 statically-generated (SSG)** app so the 90 pages become one
data-driven route, then iterate.

The work was explicitly **split into two steps** (the owner's call):

1. **Step 1 — faithful port + consolidation (this migration).** Reproduce the current
   look and behaviour exactly; collapse the 90 files into one route + generated data.
   No feature changes.
2. **Step 2 — UX/visual redesign (later).** e.g. drop the "Generate" gate for a live
   preview, better selection/filtering. Deliberately *not* done yet, to keep Step 1
   behaviour-preserving and reviewable.

---

## 3. Key decisions & why

### 3.1 Keep `assets/` and `images/` exactly where they are

**Decision:** Do not move the ~4,400 image files into `public/` or restructure their
(awkward) folder names. Serve them in place via `nitro.publicAssets`
(`{ baseURL: '/assets', dir: 'assets' }`, same for `images`).

**Why:** The single most important constraint is **staying able to merge upstream
image changes** from `skylandersnfc/Skylanders-Image-Generator`. Upstream continually
adds/removes images under `assets/`. If we `git mv` 4,400 files into a new layout,
every future upstream change becomes delete-here + add-there and conflicts on every
sync, forever. Keeping the tree byte-identical to upstream makes `git merge
upstream/main` clean.

The ugly folder names (`assets/01_Spyro/cards/Mr_Shadow/…`) are **never user-facing** —
the app hides them behind clean routes and the labels in `games.ts`. So a "nicer
structure" would buy cosmetics at a high recurring cost. The clean structure lives in
the *app/data layer* instead. This decision is also one-way reversible: we can always
restructure later, but we can't recover merge-ability after restructuring — so
deferring the reorg costs nothing.

### 3.2 Derive image lists by scanning the folder tree — NOT by parsing `list.txt`

**Decision:** `scripts/build-manifest.mjs` walks `assets/` and emits
`app/data/manifest.json`. The old `list.txt` / `Generate_Structure.py` /
`*_generator.html` files are ignored (they stay on disk as upstream-owned, unused).

**Why — a data audit settled this.** We compared every `list.txt` against the files on
disk across all 90 sets:

| Finding | Result | Implication |
|---|---|---|
| Files on disk **omitted** from `list.txt` | **0 sets** | Scanning loses no content |
| `list.txt` ordering | uncurated `os.walk` order | We can sort ourselves (natural sort → `1) Figures`, `2) Magic Items`, … — arguably better) |
| `list.txt` entries **missing** on disk | 46, all in `04_Trap_Team/cards/Sobersu_Logo` | The live site shows 46 broken images there |
| Info in `list.txt` **not** in the folder tree | **only** the back-cover tile count | Must be reproduced (see 3.3) |

So a folder scan is not just viable, it's **strictly more robust**: it only ever lists
files that exist, so the Sobersu_Logo phantom-reference bug simply can't occur, and we
depend on the image files upstream ships rather than on upstream regenerating
`list.txt` correctly. (This reflects a general preference: derive from the true source,
not from a generated intermediate.)

### 3.3 Back-cover tiling is the one thing carried over from `list.txt`

**Decision:** In `build-manifest.mjs`, a single-image set whose name starts with
`Back_Covers` is repeated to fill a sheet: **card backs ×9, coin backs ×70**.

**Why:** 18 sets (all the generic `Back_Covers*` ones) have exactly one image on disk
but their `list.txt` repeated it 9× (cards) or 70× (coins) — that repeat count fills a
print page with copies of one back design. It's the only piece of information the
folder tree doesn't encode, so we reproduce the exact counts the old site used. (The
per-character back sets like `Sobersu_Back` have many unique images and just scan
normally.)

### 3.4 One hand-authored config file for the human bits

**Decision:** `app/data/games.ts` holds per-game title/colour/background and the
**labels** ("Mr Shadow's Covers (Favorite)") + **Front/Back grouping** for each set.

**Why:** Those are the only things not derivable from the folders — they lived only in
the old landing HTML. Everything else (which images, cards vs coins) comes from the
manifest. Consequence: new **images** in an existing set need no edit here; a brand-new
**set or game** needs a one-line entry.

### 3.5 Deploy at a root domain (`baseURL: '/'`)

Chosen by the owner (custom/root domain rather than the old
`/Skylanders-Image-Generator/` project path), which keeps asset URLs simple.

### 3.6 Faithful generator port

`app/components/GeneratorTool.vue` ports `generator_cards.js` / `generator_coins.js`
**1:1**: same constants (`pxPerMm` 3.2 cards / 7 coins, `CARD_RATIO = 3.375/2.125`,
defaults 54 mm / 26 mm), same A4=190 mm / Letter=195 mm safe widths, same
`parseWidth`, same `floor(safe/width)` per-row math, same click-to-remove and
`window.print()`. It keeps the **"Generate" gate** on purpose — removing it is a Step 2
concern. Logic moved from imperative `createElement` to reactive Vue state
(`paperType`, `sizeInput`, `kept` indices); paper/width are snapshotted on Generate to
match the old "re-click to re-apply" behaviour.

---

## 4. New structure

```
nuxt.config.ts          # baseURL '/', publicAssets for assets/ & images/,
                        #   prerender crawl, '/' → '/spyro' redirect
package.json            # pnpm; pre{dev,build,generate} run the manifest builder
scripts/build-manifest.mjs   # assets/ folder scan → app/data/manifest.json
public/favicon.ico
app/
  app.vue
  assets/css/
    main.css            # ported styles.css + creators.css (image urls → /images/…)
    generator.css       # ported styles_generate.css (print/preview)
  components/
    SiteNav.vue         # the 6-game nav, active state
    GeneratorTool.vue   # ported generator logic (cards & coins)
  data/
    games.ts            # hand-authored: labels, front/back grouping, colours, bg
    manifest.json       # GENERATED: { game: { cards|coins: { set: [paths] } } }
  pages/
    [game]/index.vue           # landing page (per game)
    [game]/[type]/[set].vue    # ONE generator route, replaces all 90 old files
    creators.vue
```

Routing: `[set]` is the **exact folder name** (`Mr_Shadow`, `Back_Covers_Var_1`) so it
maps 1:1 to manifest keys with no slug table. Landing pages link to every generator,
so Nuxt's prerender crawler discovers all 90; the 6 landings + `/creators` + `/` are
also seeded in `nitro.prerender.routes`.

Data flow:

```
assets/ (folder tree)
   │  scripts/build-manifest.mjs   (walk + sort + back-cover tiling)
   ▼
app/data/manifest.json  ──┐
                          ├─►  pages/[game]/[type]/[set].vue  ──►  GeneratorTool.vue
app/data/games.ts  ───────┘        (labels + theming)
```

---

## 5. Verification performed

- `pnpm generate` prerendered 197 routes; output contains all 6 landings, 90
  generators, `/creators`, `/` redirect, and copied `/assets` + `/images`.
- Served `.output/public` and fetched pages + real image URLs (including paths with
  spaces/parens/apostrophes): all **200** with correct content types; unknown
  generator routes **404**.
- Spot-checked: per-game colours & backgrounds, nav active state, card vs coin labels,
  back-cover tiling (×9 / ×70), and `Sobersu_Logo` now lists 141 real files (the 46
  phantom refs are gone).

---

## 6. Step 1 result

The faithful port shipped: one data-driven generator route, the folder-scan manifest,
mm-accurate print, upstream-merge-friendly assets. The clunky UX (per-game full-page
backgrounds, text-link menus, the "Generate" gate, click-to-remove-only) was left
intact for Step 2.

## 7. Step 2 — the "CoverForge" redesign

Implemented from a Claude Design mockup (`docs/DESIGN_BRIEF.md` was the input brief).
The §3.1–3.2 constraints are unchanged — assets stay in place, data still comes from
the folder-scan manifest, print is still mm-accurate.

- **Design system "CoverForge"**: warm neutral shell + per-game accent; fonts Fredoka
  / DM Sans / DM Mono self-hosted via `@nuxt/fonts` (tokens in `app/assets/css/main.css`).
  Gotcha: `@nuxt/fonts` only self-hosts families named in real `font-family:`
  declarations — so the base rules use literal names, not just CSS vars.
- **New IA** (replaces the landing-per-game + 90-links model): `/` **home** game
  selector → `/[game]` **set gallery** (Cards/Coins + Front/Back tabs + search) →
  `/[game]/[type]/[set]` **generator**. `/` is now the home page (the old `/`→`/spyro`
  redirect was removed).
- **Generator rework** (`GeneratorTool.vue`): no Generate gate — live throughout.
  Sidebar (paper, width slider, collapsible **category tree** from
  `useCoverSet.ts`) + multi-select preview grid (opens empty; select per-category or
  globally) + sticky count / sheet-estimate / Print bar. Sheet maths in
  `app/utils/print.ts`. Single-image `Back_Covers*` sets collapse to one `×N` tile.
- **New pieces**: `app/components/{AppHeader,GameCard,SetCard}.vue`,
  `app/error.vue` (themed 404), brand mark + favicon set in `public/`, per-game logos
  in `public/games/`, and `.github/workflows/deploy.yml` (GitHub Pages via Actions).
- **Accessibility**: cover tiles and category checkboxes are keyboard-operable
  (`role`/`aria-checked`/`tabindex` + Enter/Space); toggles use real `<button>`s with
  `aria-pressed`.

### Naming + SEO (done 2026-07-02)

- Renamed to **Skylanders CoverForge** (differentiates from other "CoverForge" sites
  and front-loads the keyword). Header shows a lockup: small "Skylanders" lead + bold
  "CoverForge" logotype.
- SEO via the **`@nuxtjs/seo`** module collection: `site` config
  (`url: https://coverforge.m0.is`), per-page `useSeoMeta` titles/descriptions (fixes
  the duplicate generator titles — now unique per game+type), auto canonical + sitemap
  (`/sitemap.xml`, 98 URLs) + robots, and dynamic per-page OG images
  (`app/components/OgImage/CoverForge.takumi.vue`, rendered by nuxt-og-image/takumi).
  Error page is `noindex`.
- **URLs are lowercase slugs** (`/spyro/cards/mr-shadow`): `slugify()` + `setBySlug()`
  in `games.ts` map the slug back to the real folder name (kept for the manifest and
  `/assets/…` paths). Cleaner + avoids case-sensitivity 404s on GitHub Pages.

### Still open (nice-to-haves)

- The manifest is imported whole into the generator route's client chunk (~4.7k path
  strings). Fine now; could be scoped per-set if bundle size matters.
