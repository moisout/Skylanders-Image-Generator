<script setup lang="ts">
import manifest from '~/data/manifest.json'
import { gamesById, setCount } from '~/data/games'

const route = useRoute()
const game = gamesById[String(route.params.game)]
if (!game) {
  throw createError({ statusCode: 404, statusMessage: 'Game not found', fatal: true })
}
const g = game!

useHead({ title: `${g.title} — CoverForge` })

const man = manifest as Record<string, Record<string, Record<string, string[]>>>
const type = ref<'cards' | 'coins'>('cards')
const group = ref<'front' | 'back'>('front')
const query = ref('')

const sets = computed(() => {
  const list = g[type.value][group.value]
  const q = query.value.trim().toLowerCase()
  return q ? list.filter((s) => s.label.toLowerCase().includes(q)) : list
})

const imagesFor = (setName: string) => man[g.id]?.[type.value]?.[setName] ?? []
</script>

<template>
  <div :style="{ '--accent': g.color, '--accent-dark': g.accentDark }">
    <AppHeader />

    <!-- game context band -->
    <div class="band">
      <img :src="g.bg" alt="" class="band-bg">
      <div class="band-tint" />
      <div class="band-stripes" />
      <div class="container band-inner">
        <div>
          <NuxtLink to="/" class="band-back">← All games</NuxtLink>
          <h1>{{ g.title }}</h1>
        </div>
        <div class="band-count">{{ setCount(g) }} creator sets</div>
      </div>
    </div>

    <!-- filters -->
    <div class="container filters">
      <div class="filter-left">
        <span class="mono">Type</span>
        <div class="segmented">
          <button :class="{ active: type === 'cards' }" @click="type = 'cards'">Cards</button>
          <button :class="{ active: type === 'coins' }" @click="type = 'coins'">Coins</button>
        </div>
        <div class="divider" />
        <div class="segmented segmented--ink">
          <button :class="{ active: group === 'front' }" @click="group = 'front'">Front</button>
          <button :class="{ active: group === 'back' }" @click="group = 'back'">Back</button>
        </div>
      </div>
      <div class="search">
        <span aria-hidden="true">⌕</span>
        <input v-model="query" type="search" placeholder="Search sets…" aria-label="Search sets">
      </div>
    </div>

    <!-- set grid -->
    <div class="container">
      <div v-if="sets.length" class="set-grid">
        <SetCard
          v-for="s in sets"
          :key="s.set"
          :game="g"
          :type="type"
          :link="s"
          :images="imagesFor(s.set)"
        />
      </div>
      <div v-else class="empty">No {{ group }} {{ type }} sets for this game.</div>
    </div>

    <footer class="home-foot">
      <NuxtLink to="/creators">Image assets by the community — see creators</NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.band {
  position: relative;
  height: 128px;
  background: var(--accent);
  overflow: hidden;
}

.band-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 32%;
}

.band-tint {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--accent) 66%, transparent);
}

.band-stripes {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.07) 0 2px, transparent 2px 22px);
}

.band-inner {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.band-back {
  font: 500 12px var(--font-mono);
  color: rgba(255, 255, 255, 0.85);
}

.band-back:hover {
  color: #fff;
}

.band h1 {
  color: #fff;
  font-size: 30px;
  line-height: 1.1;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

.band-count {
  background: rgba(255, 255, 255, 0.92);
  color: var(--accent-dark);
  border-radius: 999px;
  padding: 7px 15px;
  font: 600 13px var(--font-body);
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-wrap: wrap;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.divider {
  width: 1px;
  height: 26px;
  background: var(--line-2);
}

.set-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  padding-bottom: 40px;
}

.empty {
  padding: 40px 0 60px;
  color: var(--muted);
  text-align: center;
}

.home-foot {
  text-align: center;
  padding: 26px;
  color: var(--muted);
  font-size: 14px;
}

.home-foot a:hover {
  color: var(--ink);
  text-decoration: underline;
}

@media (max-width: 1199px) {
  .set-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 720px) {
  .set-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
