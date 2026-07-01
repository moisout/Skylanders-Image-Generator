<script setup lang="ts">
import type { Game } from '~/data/games'
import type { SetLink } from '~/data/games'

const props = defineProps<{
  game: Game
  type: 'cards' | 'coins'
  link: SetLink
  images: string[]
}>()

const encode = (rel: string) => rel.split('/').map(encodeURIComponent).join('/')
const base = `/assets/${props.game.dir}/${props.type}/${props.link.set}`

const unique = [...new Set(props.images)]
const count = unique.length
const thumbs = unique.slice(0, 3).map((rel) => `${base}/${encode(rel)}`)

const styleTag = props.link.label.match(/\(([^)]+)\)/)?.[1] ?? ''
const creator = props.link.label.match(/^(.*?)['’]s\b/)?.[1] ?? ''

// Stable colour dot for the creator avatar.
function avatarColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return `hsl(${h} 52% 55%)`
}
</script>

<template>
  <NuxtLink
    :to="`/${game.id}/${type}/${link.set}`"
    class="set-card"
    :style="{ '--accent': game.color, '--accent-dark': game.accentDark }"
    :class="{ coins: type === 'coins' }"
  >
    <div class="set-cover">
      <div class="fan">
        <div v-for="(t, n) in thumbs" :key="n" class="fan-item" :class="`i${n}`">
          <img :src="t" alt="" loading="lazy">
        </div>
      </div>
      <div class="set-count">{{ count }}</div>
      <div v-if="styleTag" class="set-tag">{{ styleTag }}</div>
    </div>
    <div class="set-body">
      <div class="set-name">{{ link.label }}</div>
      <div v-if="creator" class="set-creator">
        <span class="set-avatar" :style="{ background: avatarColor(creator) }" />
        {{ creator }}
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.set-card {
  display: block;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  overflow: hidden;
  box-shadow: var(--sh-sm);
  transition: transform 0.15s, box-shadow 0.15s;
}

.set-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sh-card);
}

.set-cover {
  position: relative;
  height: 150px;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  overflow: hidden;
}

.fan {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0;
}

/* Cards bleed slightly past the bottom edge and clip against .set-cover. */
.fan-item {
  width: 88px;
  height: 138px;
  margin-bottom: -16px;
  border-radius: 7px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.32);
  z-index: 1;
}

.fan-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* middle card sits on top; sides tuck behind it */
.fan-item.i1 {
  z-index: 3;
}

.fan-item.i0 {
  width: 74px;
  height: 116px;
  transform: rotate(-8deg);
  transform-origin: bottom right;
  margin-right: -22px;
}

.fan-item.i2 {
  width: 74px;
  height: 116px;
  transform: rotate(8deg);
  transform-origin: bottom left;
  margin-left: -22px;
}

.set-card.coins .fan-item {
  width: 96px;
  height: 96px;
  margin-bottom: -14px;
  border-radius: 999px;
  transform: none;
}

.set-card.coins .fan-item.i0 {
  width: 82px;
  height: 82px;
  margin-right: -30px;
  transform: none;
}

.set-card.coins .fan-item.i2 {
  width: 82px;
  height: 82px;
  margin-left: -30px;
  transform: none;
}

.set-card.coins .fan-item img {
  object-fit: contain;
}

.set-count {
  position: absolute;
  right: 10px;
  top: 10px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  border-radius: 999px;
  padding: 3px 9px;
  font: 600 11px var(--font-mono);
}

.set-tag {
  position: absolute;
  left: 10px;
  top: 10px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--accent-dark);
  border-radius: 999px;
  padding: 3px 9px;
  font: 600 11px var(--font-body);
}

.set-body {
  padding: 12px 13px 14px;
}

.set-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14.5px;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.set-creator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--muted);
}

.set-avatar {
  width: 19px;
  height: 19px;
  border-radius: 999px;
  flex: none;
}
</style>
