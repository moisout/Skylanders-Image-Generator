<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Game } from '~/data/games'

const props = defineProps<{
  game: Game
  type: 'cards' | 'coins'
  set: string
  images: string[]
}>()

// === Constants (ported 1:1 from scripts/generator_cards.js / generator_coins.js) ===
const isCoins = props.type === 'coins'
const pxPerMm = isCoins ? 7 : 3.2
const CARD_RATIO = 3.375 / 2.125
const DEFAULT_WIDTH = isCoins ? 26 : 54
const sizeLabel = isCoins ? 'NFC Coin Size:' : 'NFC Card Width:'
const imgClass = isCoins ? 'coin' : 'card'

// === Reactive state ===
const paperType = ref<'A4' | 'Letter'>('A4')
const sizeInput = ref(`${DEFAULT_WIDTH} mm`)
const generated = ref(false)
const activeWidthMm = ref(DEFAULT_WIDTH)
const activeSafeMm = ref(190)
const kept = ref<number[]>([])

// === Helpers (ported) ===
function parseWidth(input: string): number {
  const str = input.trim().toLowerCase()
  if (str.endsWith('cm')) return parseFloat(str) * 10 || NaN
  if (str.endsWith('mm')) return parseFloat(str) || NaN
  return parseFloat(str) || NaN
}

function encodePath(rel: string): string {
  return rel.split('/').map(encodeURIComponent).join('/')
}

function srcFor(i: number): string {
  return `/assets/${props.game.dir}/${props.type}/${props.set}/${encodePath(props.images[i]!)}`
}

// === Derived layout ===
const heightMm = computed(() => (isCoins ? activeWidthMm.value : activeWidthMm.value * CARD_RATIO))
const perRow = computed(() => Math.max(1, Math.floor(activeSafeMm.value / activeWidthMm.value)))
const previewW = computed(() => activeWidthMm.value * pxPerMm)
const previewH = computed(() => heightMm.value * pxPerMm)

const printRows = computed(() => {
  const rows: number[][] = []
  kept.value.forEach((idx, pos) => {
    if (pos % perRow.value === 0) rows.push([])
    rows[rows.length - 1]!.push(idx)
  })
  return rows
})

// === Actions ===
function generate() {
  const safe = paperType.value === 'Letter' ? 195 : 190
  let w = parseWidth(sizeInput.value)
  if (!w || w <= 0) {
    alert('Invalid width. Resetting to default value.')
    w = DEFAULT_WIDTH
    sizeInput.value = `${DEFAULT_WIDTH} mm`
  }
  activeWidthMm.value = w
  activeSafeMm.value = safe
  kept.value = props.images.map((_, i) => i)
  generated.value = true
}

function removeImage(i: number) {
  kept.value = kept.value.filter((x) => x !== i)
}

function printSheet() {
  window.print()
}
</script>

<template>
  <div class="generator-page">
    <!-- Start form -->
    <div v-if="!generated" id="start_form">
      <form @submit.prevent>
        <div>
          <label for="paperType"><b>Paper Type:</b></label>
          <select id="paperType" v-model="paperType">
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
          </select>
          <input type="button" value="Generate" class="btn-blue" @click="generate">
        </div>
        <div>
          <label for="sizeInput"><b>{{ sizeLabel }}</b></label>
          <input id="sizeInput" v-model="sizeInput" type="text">
        </div>
      </form>

      <div>A4 and Letter are auto-scaled with a margin reserved for safe printing.</div>

      <div class="previews">
        <div class="preview" style="text-align:center;">
          <b>A4 Example (297 × 210 mm)</b><br>
          <img src="/images/sample.jpg" alt="A4 Preview">
        </div>
      </div>
    </div>

    <!-- Generated images -->
    <div v-else id="images">
      <div id="info" style="text-align:center;">
        <input type="button" value="Print" class="btn-blue" @click="printSheet">
      </div>
      <div id="instructions" style="text-align:center;">
        Click an image to <span class="highlight">remove</span> it.<br>
        When <span class="highlight">done</span>, press <span class="highlight">Print</span>.
      </div>

      <div id="preview-area">
        <img
          v-for="i in kept"
          :key="`prev-${i}`"
          :class="imgClass"
          :src="srcFor(i)"
          :style="{ width: `${previewW}px`, height: `${previewH}px` }"
          @click="removeImage(i)"
        >
      </div>

      <div id="print-area" :style="{ '--safe-width': `${activeSafeMm}mm` }">
        <div v-for="(row, r) in printRows" :key="`row-${r}`" class="print-row">
          <img
            v-for="i in row"
            :key="`print-${i}`"
            :class="imgClass"
            :src="srcFor(i)"
            :style="{ '--w-mm': `${activeWidthMm}mm`, '--h-mm': `${heightMm}mm` }"
          >
        </div>
      </div>
    </div>
  </div>
</template>
