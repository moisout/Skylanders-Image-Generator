<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

useSeoMeta({
  title: is404.value ? 'Page not found' : 'Something went wrong',
  robots: 'noindex',
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="err-page" :style="{ '--accent': '#1c1a15', '--accent-dark': '#000' }">
    <AppHeader />

    <main class="err">
      <img src="/favicon.svg" alt="" class="err-logo" width="72" height="72">
      <div class="err-code">{{ error?.statusCode || 'Error' }}</div>
      <h1>{{ is404 ? 'This cover sheet doesn’t exist' : 'Something went wrong' }}</h1>
      <p>
        {{
          is404
            ? 'The page you’re looking for isn’t here — it may have moved or never existed.'
            : (error?.message || 'An unexpected error occurred while loading the page.')
        }}
      </p>
      <button class="btn-primary" @click="goHome">Back to games</button>
    </main>
  </div>
</template>

<style scoped>
.err {
  max-width: 520px;
  margin: 0 auto;
  padding: 72px 24px 96px;
  text-align: center;
}

.err-logo {
  margin-bottom: 20px;
}

.err-code {
  font: 500 13px var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--faint);
}

.err h1 {
  font-size: 30px;
  margin: 8px 0 0;
}

.err p {
  color: var(--muted);
  font-size: 15.5px;
  line-height: 1.55;
  margin: 14px 0 28px;
}
</style>
