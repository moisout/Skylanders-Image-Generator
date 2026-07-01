<script setup lang="ts">
import type { Game } from "~/data/games";
import { setCount } from "~/data/games";

const props = defineProps<{ game: Game }>();
const count = setCount(props.game);
</script>

<template>
    <NuxtLink
        :to="`/${game.id}`"
        class="game-card"
        :style="{ '--accent': game.color, '--accent-dark': game.accentDark }"
    >
        <img :src="game.bg" alt="" class="game-bg" loading="lazy" />
        <div class="game-shade" />
        <img
            :src="game.logo"
            :alt="game.title"
            class="game-logo"
            loading="lazy"
        />
        <div class="game-badge">{{ count }} sets</div>
        <div class="game-year">{{ game.year }}</div>
    </NuxtLink>
</template>

<style scoped>
.game-card {
    position: relative;
    display: block;
    height: 186px;
    border-radius: 18px;
    overflow: hidden;
    background: linear-gradient(150deg, var(--accent), var(--accent-dark));
    box-shadow: var(--sh-sm);
    transition:
        transform 0.15s,
        box-shadow 0.15s;
}

.game-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--sh-card);
}

.game-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.65;
    mix-blend-mode: overlay;
}

.game-shade {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        120% 90% at 50% 40%,
        rgba(255, 255, 255, 0.12),
        transparent 60%
    );
}

.game-logo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 24px 22px 30px;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
}

.game-badge {
    position: absolute;
    left: 16px;
    top: 14px;
    background: rgba(255, 255, 255, 0.9);
    color: var(--ink);
    border-radius: 999px;
    padding: 4px 11px;
    font: 600 11px var(--font-mono);
    z-index: 2;
}

.game-year {
    position: absolute;
    right: 16px;
    bottom: 13px;
    color: rgba(255, 255, 255, 0.9);
    font: 600 12px var(--font-mono);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
    z-index: 2;
}

@media (max-width: 640px) {
    .game-card {
        height: 138px;
    }
    .game-logo {
        padding: 18px 16px 26px;
    }
}
</style>
