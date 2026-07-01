<script setup lang="ts">
import manifest from '~/data/manifest.json'
import { gamesById } from '~/data/games'

const route = useRoute()
const gameId = String(route.params.game)
const type = String(route.params.type)
const set = String(route.params.set)

const game = gamesById[gameId]
const images = (manifest as Record<string, Record<string, Record<string, string[]>>>)
  ?.[gameId]?.[type]?.[set]

if (!game || (type !== 'cards' && type !== 'coins') || !images) {
  throw createError({ statusCode: 404, statusMessage: 'Generator not found', fatal: true })
}

useHead({
  title: `${type === 'coins' ? 'Coins' : 'Cards'} Generator`,
})
</script>

<template>
  <GeneratorTool
    :game="game!"
    :type="(type as 'cards' | 'coins')"
    :set="set"
    :images="images!"
  />
</template>
