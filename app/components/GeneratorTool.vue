<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Game } from '~/data/games'
import type { CatNode } from '~/composables/useCoverSet'

const props = defineProps<{
  game: Game
  type: 'cards' | 'coins'
  set: string
  label: string
  images: string[]
}>()

const isCoins = props.type === 'coins'
const coverSet = useCoverSet(props.images, { dir: props.game.dir, type: props.type, set: props.set })

const accentStyle = {
  '--accent': props.game.color,
  '--accent-dark': props.game.accentDark,
}
const typeLabel = isCoins ? 'Coins' : 'Cards'

// ===== controls =====
const wMin = isCoins ? 15 : 30
const wMax = isCoins ? 45 : 90
const paper = ref<'A4' | 'Letter'>('A4')
const widthMm = ref(isCoins ? 26 : 54)

function stepWidth(d: number) {
  widthMm.value = Math.min(wMax, Math.max(wMin, widthMm.value + d))
}

// ===== selection (empty by default — pick up) =====
const selected = ref<Set<number>>(new Set())

function mutate(fn: (s: Set<number>) => void) {
  const s = new Set(selected.value)
  fn(s)
  selected.value = s
}
const isSelected = (i: number) => selected.value.has(i)
function toggleCover(i: number) {
  mutate((s) => (s.has(i) ? s.delete(i) : s.add(i)))
}
function selectIds(ids: number[]) {
  mutate((s) => ids.forEach((id) => s.add(id)))
}
function clearIds(ids: number[]) {
  mutate((s) => ids.forEach((id) => s.delete(id)))
}
function selectAllGlobal() {
  selected.value = new Set(coverSet.covers.map((c) => c.i))
}
function clearGlobal() {
  selected.value = new Set()
}
function toggleCategory(node: CatNode) {
  const all = node.coverIds.every((id) => selected.value.has(id))
  all ? clearIds(node.coverIds) : selectIds(node.coverIds)
}
function catState(node: CatNode): 'on' | 'some' | 'none' {
  let n = 0
  for (const id of node.coverIds) if (selected.value.has(id)) n++
  return n === 0 ? 'none' : n === node.coverIds.length ? 'on' : 'some'
}

// ===== category tree (sidebar) =====
const allKeys: string[] = []
;(function collect(nodes: CatNode[], parent: string) {
  for (const node of nodes) {
    const key = parent ? `${parent}/${node.label}` : node.label
    if (node.children.length) {
      allKeys.push(key)
      collect(node.children, key)
    }
  }
})(coverSet.tree, '')
const expanded = ref<Set<string>>(new Set(allKeys))
function toggleExpand(key: string) {
  mutateExpand(key)
}
function mutateExpand(key: string) {
  const s = new Set(expanded.value)
  s.has(key) ? s.delete(key) : s.add(key)
  expanded.value = s
}

interface Row {
  key: string
  node: CatNode
  depth: number
  hasChildren: boolean
  expanded: boolean
  top: string
  state: 'on' | 'some' | 'none'
}
const catRows = computed(() => {
  const out: Row[] = []
  const walk = (nodes: CatNode[], depth: number, parent: string, top: string) => {
    for (const node of nodes) {
      const key = parent ? `${parent}/${node.label}` : node.label
      const topLabel = depth === 0 ? node.label : top
      const hasChildren = node.children.length > 0
      const isExp = expanded.value.has(key)
      out.push({ key, node, depth, hasChildren, expanded: isExp, top: topLabel, state: catState(node) })
      if (hasChildren && isExp) walk(node.children, depth + 1, key, topLabel)
    }
  }
  walk(coverSet.tree, 0, '', '')
  return out
})

// ===== preview sections (per top-level category) =====
const sections = computed(() =>
  coverSet.tree.map((node) => ({
    label: node.label,
    ids: node.coverIds,
    covers: node.coverIds.map((id) => coverSet.covers[id]!),
  })),
)

// section scroll targets
const sectionEls: Record<string, HTMLElement | null> = {}
function registerSection(label: string, el: unknown) {
  sectionEls[label] = (el as HTMLElement) ?? null
}
function scrollToCat(top: string) {
  sectionEls[top]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ===== derived counts / sheet math =====
const selectedCount = computed(() => selected.value.size)
const printCount = computed(() => {
  let n = 0
  for (const c of coverSet.covers) if (selected.value.has(c.i)) n += c.copies
  return n
})
const sm = computed(() =>
  sheetMath({ paper: paper.value, type: props.type, widthMm: widthMm.value, count: printCount.value }),
)
const widthLabel = computed(() => `${widthMm.value} mm`)
const sheetWord = computed(() => (sm.value.sheets === 1 ? 'sheet' : 'sheets'))

// ===== print =====
const printRows = computed(() => {
  const cells: { src: string }[] = []
  for (const c of coverSet.covers) {
    if (selected.value.has(c.i)) for (let k = 0; k < c.copies; k++) cells.push(c)
  }
  const per = sm.value.perRow
  const rows: { src: string }[][] = []
  for (let i = 0; i < cells.length; i += per) rows.push(cells.slice(i, i + per))
  return rows
})
function printSheet() {
  window.print()
}
</script>

<template>
  <div class="gen" :class="{ 'is-coins': isCoins }" :style="accentStyle">
    <div class="screen-only">
      <!-- topbar -->
      <div class="gen-topbar">
        <div class="gen-crumb">
          <NuxtLink to="/" class="cf-brand">
            <img src="/favicon.svg" alt="" class="cf-logo" width="24" height="24">
            <span class="cf-lockup">
              <span class="cf-lead">Skylanders</span>
              <span class="cf-wordmark">CoverForge</span>
            </span>
          </NuxtLink>
          <span class="sep">/</span>
          <NuxtLink :to="`/${game.id}`" class="gen-game"><span class="dot" />{{ game.title }}</NuxtLink>
          <span class="gen-setname">{{ label }}</span>
        </div>
        <div class="gen-meta">{{ typeLabel }} · {{ coverSet.total }} covers</div>
      </div>

      <div class="gen-body">
        <!-- sidebar -->
        <aside class="gen-side">
          <div class="gen-side-inner">
          <div class="side-group">
            <div class="side-label">Print size</div>
            <div class="side-sub">Paper</div>
            <div class="segmented" style="width: 100%">
              <button style="flex: 1" :class="{ active: paper === 'A4' }" :aria-pressed="paper === 'A4'" @click="paper = 'A4'">A4</button>
              <button style="flex: 1" :class="{ active: paper === 'Letter' }" :aria-pressed="paper === 'Letter'" @click="paper = 'Letter'">Letter</button>
            </div>
            <div class="side-sub" style="display: flex; justify-content: space-between; align-items: center">
              <span>{{ isCoins ? 'Coin width' : 'Card width' }}</span>
              <span class="width-val">{{ widthLabel }}</span>
            </div>
            <div class="width-row">
              <button class="step-btn" aria-label="decrease" @click="stepWidth(-1)">−</button>
              <input
                class="width-range"
                type="range"
                :min="wMin"
                :max="wMax"
                step="1"
                v-model.number="widthMm"
                :aria-label="`${isCoins ? 'Coin' : 'Card'} width in millimetres`"
                :aria-valuetext="widthLabel"
              >
              <button class="step-btn" aria-label="increase" @click="stepWidth(1)">+</button>
            </div>
          </div>

          <div class="side-group">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px">
              <div class="side-label">Categories</div>
              <div class="cat-count">{{ coverSet.total }} covers</div>
            </div>
            <div
              v-for="row in catRows"
              :key="row.key"
              class="cat-row"
              :style="{ paddingLeft: `${row.depth * 16}px` }"
            >
              <button
                v-if="row.hasChildren"
                class="cat-caret"
                :aria-label="row.expanded ? `Collapse ${row.node.label}` : `Expand ${row.node.label}`"
                @click.stop="toggleExpand(row.key)"
              >
                {{ row.expanded ? '▾' : '▸' }}
              </button>
              <span v-else class="cat-caret" />
              <button
                class="cat-box"
                :class="row.state"
                role="checkbox"
                :aria-checked="row.state === 'on' ? 'true' : row.state === 'some' ? 'mixed' : 'false'"
                :aria-label="`Select all covers in ${row.node.label}`"
                @click.stop="toggleCategory(row.node)"
              >
                {{ row.state === 'on' ? '✓' : row.state === 'some' ? '–' : '' }}
              </button>
              <button class="cat-name" @click="scrollToCat(row.top)">{{ row.node.label }}</button>
              <span class="cat-count">{{ row.node.coverIds.length }}</span>
            </div>
          </div>
          </div>
        </aside>

        <!-- preview -->
        <main class="gen-main">
          <div class="gen-toolbar">
            <div class="title">
              <h3>All covers</h3>
              <span class="cat-count">{{ selectedCount }} of {{ coverSet.total }} selected</span>
            </div>
            <div style="display: flex; gap: 9px">
              <button class="btn" @click="selectAllGlobal">Select all</button>
              <button class="btn" @click="clearGlobal">Clear all</button>
            </div>
          </div>

          <section
            v-for="sec in sections"
            :key="sec.label"
            :ref="(el) => registerSection(sec.label, el)"
            class="cat-section"
            style="scroll-margin-top: 70px"
          >
            <div class="cat-section-head">
              <h3>{{ sec.label }} <span class="cat-count" style="margin-left: 4px">{{ sec.covers.length }}</span></h3>
              <div style="display: flex; gap: 8px">
                <button class="btn" @click="selectIds(sec.ids)">Select</button>
                <button class="btn" @click="clearIds(sec.ids)">Clear</button>
              </div>
            </div>
            <div class="grid">
              <div
                v-for="c in sec.covers"
                :key="c.i"
                class="tile"
                :class="{ sel: isSelected(c.i) }"
                :title="c.name"
                role="checkbox"
                :aria-checked="isSelected(c.i)"
                :aria-label="c.name"
                tabindex="0"
                @click="toggleCover(c.i)"
                @keydown.enter.prevent="toggleCover(c.i)"
                @keydown.space.prevent="toggleCover(c.i)"
              >
                <div class="tile-thumb">
                  <img :src="c.src" :alt="c.name" loading="lazy">
                  <div v-if="c.copies > 1" class="tile-copies">×{{ c.copies }}</div>
                </div>
                <div v-if="isSelected(c.i)" class="tile-check">✓</div>
                <div class="tile-cap">{{ c.name }}</div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <!-- sticky selection bar -->
      <div class="gen-bar">
        <div class="gen-bar-left">
          <div><span class="count">{{ selectedCount }}</span> <span style="font-size: 14px; color: var(--muted)"> covers selected</span></div>
          <div class="sep" />
          <div style="font-size: 14px; color: var(--ink-2)">
            ≈ <b>{{ sm.sheets }}</b> {{ sheetWord }} · {{ widthLabel }} on {{ paper }}
            <span v-if="printCount !== selectedCount" style="color: var(--muted-2)"> · prints {{ printCount }}</span>
          </div>
        </div>
        <div class="gen-bar-right">
          <button class="btn-primary" :disabled="selectedCount === 0" @click="printSheet">Print sheet →</button>
        </div>
      </div>
    </div>

    <!-- print output: only the mm-accurate grid of selected covers -->
    <div class="print-only">
      <div class="print-grid">
        <div v-for="(row, r) in printRows" :key="r" class="print-row">
          <div
            v-for="(cell, ci) in row"
            :key="ci"
            class="print-cell"
            :style="{ '--w-mm': `${sm.coverW}mm`, '--h-mm': `${sm.coverH}mm` }"
          >
            <img :src="cell.src" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
