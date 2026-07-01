<script setup lang="ts">
// Rendered by nuxt-og-image (satori) at 1200×630 — keep to flexbox + inline styles.
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    accent?: string
    accentDark?: string
    logo?: string
  }>(),
  {
    title: 'Skylanders CoverForge',
    subtitle: 'Printable cover art for NFC cards & coins',
    accent: '#1c1a15',
    accentDark: '#000000',
    logo: '',
  },
)
</script>

<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px',
      backgroundColor: accent,
      color: '#ffffff',
      fontFamily: 'DM Sans',
    }"
  >
    <div :style="{ display: 'flex', flexDirection: 'column' }">
      <div
        :style="{
          fontSize: '26px',
          fontWeight: 500,
          letterSpacing: '5px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.82)',
          fontFamily: 'DM Sans',
        }"
      >
        Skylanders CoverForge
      </div>
      <div
        :style="{
          fontSize: '72px',
          fontWeight: 600,
          lineHeight: 1.04,
          marginTop: '28px',
          fontFamily: 'Fredoka',
        }"
      >
        {{ title }}
      </div>
      <div :style="{ fontSize: '34px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', marginTop: '22px' }">
        {{ subtitle }}
      </div>
    </div>

    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
      <div :style="{ fontSize: '24px', fontWeight: 500, color: 'rgba(255,255,255,0.78)' }">coverforge.m0.is</div>
      <img v-if="logo" :src="logo" height="128" :style="{ height: '128px' }">
    </div>
  </div>
</template>
