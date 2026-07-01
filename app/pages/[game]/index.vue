<script setup lang="ts">
import { gamesById } from '~/data/games'

const route = useRoute()
const gameId = computed(() => String(route.params.game))
const game = computed(() => gamesById[gameId.value])

if (!game.value) {
  throw createError({ statusCode: 404, statusMessage: 'Game not found', fatal: true })
}

const g = game.value!

useHead({
  title: `Skylanders ${g.title} Covers`,
  htmlAttrs: { 'data-page': g.id },
})
</script>

<template>
  <div :style="{ '--game-color': g.color }">
    <header>
      <h1>Skylanders Image Generator</h1>
    </header>

    <SiteNav :active="g.id" />

    <template v-for="type in (['cards', 'coins'] as const)" :key="type">
      <h2>{{ type === 'cards' ? 'Cards' : 'Coins' }} Generator</h2>

      <template v-for="group in (['front', 'back'] as const)" :key="group">
        <template v-if="g[type][group].length">
          <h3>{{ group === 'front' ? 'Front Covers' : 'Back Covers' }}</h3>
          <NuxtLink
            v-for="link in g[type][group]"
            :key="link.set"
            class="cover-link"
            :to="`/${g.id}/${type}/${link.set}`"
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </template>
    </template>

    <footer class="footer">
      <p>
        <NuxtLink to="/creators" class="footer-link">
          All image assets have been graciously provided by the following creators.
        </NuxtLink>
      </p>
    </footer>
  </div>
</template>
