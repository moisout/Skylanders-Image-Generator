// Builds app/data/manifest.json by scanning the untouched upstream `assets/` tree.
//
// Why scan the folder instead of parsing the committed `list.txt` files?
//   - It only ever lists files that exist, so upstream data bugs (e.g. the
//     04_Trap_Team/cards/Sobersu_Logo list.txt references 46 phantom files)
//     can't produce broken images.
//   - `git merge upstream/main` stays clean: new images appear automatically
//     with no edits here, because we depend on the files, not on list.txt.
//
// The ONLY thing the old list.txt files encoded that the tree doesn't is the
// tile count for the single-image `Back_Covers*` sets, which repeat one image
// to fill a print sheet (card backs x9, coin backs x70). We reproduce that below.

import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const assetsDir = join(root, 'assets')
const outFile = join(root, 'app', 'data', 'manifest.json')

const GAME_DIR_TO_ID = {
  '01_Spyro': 'spyro',
  '02_Giants': 'giants',
  '03_Swap_Force': 'swapforce',
  '04_Trap_Team': 'trapteam',
  '05_SuperChargers': 'superchargers',
  '06_Imaginators': 'imaginators',
}

// Repeat count for the generic single-image back-cover sets (matches the old site).
const BACK_COVER_TILE = { cards: 9, coins: 70 }

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

function walkImages(dir) {
  let out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out = out.concat(walkImages(p))
    else if (/\.(jpe?g|png)$/i.test(e.name)) out.push(p)
  }
  return out
}

const manifest = {}
let totalSets = 0
let totalImages = 0

for (const [gameDir, gameId] of Object.entries(GAME_DIR_TO_ID)) {
  for (const type of ['cards', 'coins']) {
    const typeDir = join(assetsDir, gameDir, type)
    if (!existsSync(typeDir)) continue

    for (const setEnt of readdirSync(typeDir, { withFileTypes: true })) {
      if (!setEnt.isDirectory()) continue
      const setName = setEnt.name
      const setDir = join(typeDir, setName)

      let rels = walkImages(setDir)
        .map((p) => relative(setDir, p).split('\\').join('/'))
        .sort(collator.compare)

      if (rels.length === 0) continue

      // Single-image back-cover sets: tile the one image to fill a sheet.
      if (rels.length === 1 && /^Back_Covers/i.test(setName)) {
        const n = BACK_COVER_TILE[type]
        rels = Array.from({ length: n }, () => rels[0])
      }

      ;(manifest[gameId] ??= {})
      ;(manifest[gameId][type] ??= {})
      manifest[gameId][type][setName] = rels
      totalSets++
      totalImages += rels.length
    }
  }
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(manifest, null, '\t') + '\n')
console.log(`[build-manifest] ${totalSets} sets, ${totalImages} image refs -> ${relative(root, outFile)}`)
