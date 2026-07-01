# Design request: Skylanders Image Generator — high-fidelity visual mockup

Produce **high-fidelity visual mockups (rendered images)** of the screens below,
plus a concise **design spec** (tokens + component states) so a developer can build
them exactly. This is a design-only task — the code is implemented separately from
your mockups. Prioritize the **Generator** and **set-discovery** screens.

## The product (context)
A free static web app for Skylanders collectors to generate **printable sheets of
cover art** for NFC cards and coins. Users pick a cover style, choose a physical
print size, curate which covers they want, and print a sheet where every cover is
laid out at exact millimetre size. No backend, no login. Artwork is pre-made image
files from community creators. It's a community fork of the original SkylandersNFC
generator.

## Users
Non-technical Skylanders fans on desktop, tablet, and phone. They want to find a
good-looking set, get the print size right, and print quickly.

## Content model (drives the whole UI)
- **6 games**, each with an accent color + full-bleed background:
  Spyro `#0aa808` · Giants `#FB7600` · Swap Force `#1888c8` ·
  Trap Team `#FE0000` · SuperChargers `#99722D` · Imaginators `#570E77`.
- Each game → **Cards** and **Coins** → **Front Covers** and **Back Covers**.
- Under those: **creator sets** (~90 total), labelled like "Mr Shadow's Covers
  (Favorite)", "Sobersu's Covers (Logo)", "Mirakel's Round Covers (Clean)".
- Each set holds many cover images in nested categories: Figures, Magic Items,
  Sidekicks, Legendaries/Variants, Traps, etc. A set has 1 to 150+ images.
- Cards use a trading-card aspect ratio (~1 : 1.59); coins are square/round.

See the **Appendix** for real set names and a real category tree to populate the
mockups with authentic labels.

## Core features to represent in the mockups
- Size controls: **paper** (A4 / Letter) and **physical width** (mm/cm; card default
  54 mm, coin default 26 mm), with a to-scale size reference.
- **Live preview** of covers (no "Generate" button — updates instantly).
- **Curation**: multi-select with select-all / clear-all; filter by the set's
  categories; per-cover selected/removed state.
- **Feedback**: count of selected covers + estimated sheet count.
- **Print** action (on paper only the mm-accurate grid prints).
- Visual **set discovery**: browse sets as a thumbnail gallery, filter by
  game/type/front-back, optional search.

## Fixing today's problems (design goals)
Replace a clunky "set options → click Generate → then see results" flow and long
text-link menus with: instant live preview, a visual set gallery, strong in-set
curation (categories + multi-select), and clear count/sheet feedback. Modernize and
declutter while keeping the Skylanders identity (per-game colors + background art).

## Screens to mock up (desktop AND mobile for each)
1. **Home / game selector** — pick one of 6 games; entry to browsing.
2. **Set gallery** — thumbnails of creator sets for a chosen game/type, with
   front/back and filter controls, each card showing label + creator credit.
3. **Generator** (primary) — size/paper controls + size reference, live cover
   preview grid, category filter sidebar/bar, multi-select curation, a selection
   summary (count + sheets) and a prominent Print button. Show cover tiles in both
   selected and deselected states.
4. **Creators / credits** — contributor cards (round avatar, name, thank-you note)
   and a short "community fork, thanks to SkylandersNFC" note.

## Constraints to respect in the visuals
- Static site aesthetic; no dashboard/enterprise vibe — playful but clean, fits a
  gaming/collector hobby.
- Must gracefully show **large sets (100+ tiles)** and support lazy-loaded thumbnails.
- Print fidelity matters: include a small mockup/callout of the **print output** = a
  bare mm-accurate grid of covers, no app chrome.
- Responsive and accessible (readable contrast, clear focus/selected states).

## Deliverables (what to hand back)
1. **Rendered mockup images** for each screen above (desktop + mobile).
2. A **design spec** an engineer can implement from, including:
   - Color tokens (neutrals + the 6 game accents above; how accent is applied
     per game), typography scale, spacing scale, corner radius, elevation/shadows.
   - Component specs with states: game card, set/gallery card, cover tile
     (default / hover / selected / removed), size + paper controls, category filter,
     selection/print bar, contributor card.
   - Notes on responsive behavior (grid columns per breakpoint) and the print layout.

Keep it implementation-ready: consistent tokens, real-looking labels from the content
model, and clearly annotated states.

---

## Appendix — real example data (use these exact labels in the mockups)

### The 6 games (accent color)
| Game | Accent |
| --- | --- |
| Spyro's Adventure | `#0aa808` (green) |
| Giants | `#FB7600` (orange) |
| Swap Force | `#1888c8` (blue) |
| Trap Team | `#FE0000` (red) |
| SuperChargers | `#99722D` (gold/brown) |
| Imaginators | `#570E77` (purple) |

### Real creator-set names (for the Set Gallery)
Front card covers (Spyro): "Mr Shadow's Covers (Favorite)", "Sobersu's Covers
(Logo)", "Sobersu's Covers (Stats)", "Adri-Dani's Covers (Clean)", "Adrian's Covers
(Pokemon)".
Back card covers: "Card Back Covers (Logo)", "Card Back Covers (Poster)".
Front coin covers: "Mirakel's Round Covers (Clean)", "Mirakel's Round Covers (Logo)",
"Sobersu's Round Covers (Clean)", "Sobersu's Round Covers (Close)", "Cha0s's Round
Covers (Chase)".
Other games add sets like "Dim's Villains Covers (Logo)" (Trap Team), "AlexDTI's
Covers (Stats)", "LenLen's Covers (Logo)", "IndominusRex's Covers (Clean)",
"Cha0s's Variant Covers" (Imaginators).

### Real in-set category tree — "Spyro's Adventure -> Cards -> Mr Shadow's Covers (Favorite)" (54 covers)
Use this exact structure for the Generator's category filter and grouped preview:

```
1) Figures                              [32]   e.g. Bash, Boomer, Camo, Cynder, Spyro, Stealth Elf ...
2) Magic Items
   1) Adventure Packs                   [4]    Darklight Crypt, Dragon's Peak, Empire of Ice, Pirate Seas
   2) Battle Arena                      [1]    Volcanic Vault
   3) Magic Items                       [8]    Anvil Rain, Ghost Swords, Healing Elixir, Hidden Treasure ...
3) Sidekicks                            [4]    Gill Runt, Terrabite, Trigger Snappy, Whisper Elf
4) In-Game Variants
   1) Variants                          [1]    Dark Spyro
   2) Legendaries                       [4]    Legendary Bash, Legendary Chop Chop, Legendary Spyro ...
```

Cover file names read like "Mr Shadow's Bash", "Mr Shadow's Legendary Spyro" — i.e.
`<Creator>'s <Character/Item>`. Bigger sets (e.g. Trap Team's "Sobersu's Covers
(Logo)") reach ~140 covers and add a "Traps -> Crystal Traps / Trappable Villains"
branch, so design the category filter to handle deep, numbered, collapsible groups.

### Sizing facts for the size controls / print callout
- Paper: A4 (usable width 190 mm) or Letter (usable 195 mm); rest is safe margin.
- Card width default 54 mm, aspect ratio 3.375 : 2.125 (~1 : 1.588).
- Coin width default 26 mm, square bounding box (round art).
- Covers per row = floor(usable width / cover width) — e.g. 54 mm cards on A4 -> 3/row.
- Back covers are one design tiled to fill a sheet (cards ~9x, coins ~70x).
