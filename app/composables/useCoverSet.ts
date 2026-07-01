// Turns a flat manifest set (array of relative image paths) into a curated,
// category-grouped structure the generator UI can render.
//
// Derivation rules (see docs/MIGRATION.md for the data shape):
//   - path = "1) Figures/Mr Shadow's Bash.jpg"
//     -> catPath ["Figures"] (numeric "N) " prefix stripped for display)
//     -> name "Bash" (extension + leading "<creator>'s " possessive stripped)
//   - Identical repeated paths (the tiled Back_Covers* sets) collapse to ONE cover
//     carrying `copies` (e.g. 70), so the UI shows a single tile that prints a full
//     sheet rather than 70 identical tiles.

export interface Cover {
  /** Stable id = index into the deduped cover list; also the selection key. */
  i: number
  name: string
  catPath: string[]
  src: string
  /** How many physical tiles this cover prints (1 normally, N for tiled backs). */
  copies: number
}

export interface CatNode {
  label: string
  depth: number
  /** Cover ids under this node (recursive). */
  coverIds: number[]
  children: CatNode[]
}

export interface CoverSet {
  covers: Cover[]
  tree: CatNode[]
  /** Total distinct covers. */
  total: number
}

export interface CoverSetOpts {
  dir: string
  type: string
  set: string
}

function encodePath(rel: string): string {
  return rel.split('/').map(encodeURIComponent).join('/')
}

function stripPrefix(seg: string): string {
  // Drop a leading "N) " ordering prefix used in the asset folders.
  return seg.replace(/^\d+\)\s*/, '')
}

function displayName(filename: string): string {
  let s = filename.replace(/\.[^.]+$/, '') // extension
  s = s.replace(/^.*?['’]s\s+/, '') // leading "<creator>'s " possessive
  s = s.trim()
  if (!s) s = filename.replace(/\.[^.]+$/, '')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function useCoverSet(images: string[], opts: CoverSetOpts): CoverSet {
  const base = `/assets/${opts.dir}/${opts.type}/${opts.set}`

  // Dedupe identical paths, counting copies (tiled back covers).
  const byPath = new Map<string, Cover>()
  for (const rel of images) {
    const existing = byPath.get(rel)
    if (existing) {
      existing.copies++
      continue
    }
    const parts = rel.split('/')
    const filename = parts.pop() as string
    byPath.set(rel, {
      i: byPath.size,
      name: displayName(filename),
      catPath: parts.map(stripPrefix),
      src: `${base}/${encodePath(rel)}`,
      copies: 1,
    })
  }
  const covers = [...byPath.values()]

  // Build the nested category tree, accumulating cover ids at every ancestor.
  const tree: CatNode[] = []
  for (const cover of covers) {
    const path = cover.catPath.length ? cover.catPath : ['Covers']
    let level = tree
    let depth = 0
    for (const label of path) {
      let node = level.find((n) => n.label === label)
      if (!node) {
        node = { label, depth, coverIds: [], children: [] }
        level.push(node)
      }
      node.coverIds.push(cover.i)
      level = node.children
      depth++
    }
  }

  return { covers, tree, total: covers.length }
}
