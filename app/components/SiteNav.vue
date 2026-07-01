<script setup lang="ts">
import { games } from '~/data/games'

defineProps<{ active?: string }>()
</script>

<template>
  <ul>
    <li v-for="g in games" :key="g.id">
      <NuxtLink :to="`/${g.id}`" :class="{ active: g.id === active }">{{ g.title }}</NuxtLink>
    </li>
  </ul>
</template>
