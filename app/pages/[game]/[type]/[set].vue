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

const g = game!
const label =
  [...g[type as 'cards' | 'coins'].front, ...g[type as 'cards' | 'coins'].back].find(
    (s) => s.set === set,
  )?.label ?? set

useHead({ title: `${label} — CoverForge` })
</script>

<template>
  <GeneratorTool
    :game="g"
    :type="(type as 'cards' | 'coins')"
    :set="set"
    :label="label"
    :images="images!"
  />
</template>
