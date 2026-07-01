<script setup lang="ts">
import manifest from '~/data/manifest.json'
import { gamesById, setBySlug } from '~/data/games'

const route = useRoute()
const gameId = String(route.params.game)
const type = String(route.params.type)
const slug = String(route.params.set) // URL slug, e.g. "mr-shadow"

const game = gamesById[gameId]
const isType = type === 'cards' || type === 'coins'
const link = game && isType ? setBySlug(game, type, slug) : undefined
const images = link
  ? (manifest as Record<string, Record<string, Record<string, string[]>>>)?.[gameId]?.[type]?.[
      link.set
    ]
  : undefined

if (!game || !isType || !link || !images) {
  throw createError({ statusCode: 404, statusMessage: 'Generator not found', fatal: true })
}

const g = game!
const set = link!.set // real folder name (source of truth for /assets + manifest)
const label = link!.label

const typeName = type === 'coins' ? 'Coins' : 'Cards'
useSeoMeta({
  title: `${label} — Skylanders ${g.title} ${typeName}`,
  description: `Print ${label} — size-accurate Skylanders ${g.title} ${type} covers for your NFC ${type === 'coins' ? 'coins' : 'cards'}.`,
})
defineOgImage('CoverForge', {
  title: label,
  subtitle: `Skylanders ${g.title} · ${typeName}`,
  accent: g.color,
  accentDark: g.accentDark,
  logo: g.logo,
})
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
