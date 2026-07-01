<script setup lang="ts">
import { games } from "~/data/games";

useSeoMeta({
  title: 'Printable NFC card & coin covers',
  description:
    'Printable cover-art sheets for Skylanders NFC cards and coins. Pick a game, curate a creator’s cover set, and print a size-accurate sheet.',
})
defineOgImage('CoverForge', { title: 'Printable card & coin covers' })
</script>

<template>
    <div>
        <AppHeader />

        <div class="container home">
            <div class="home-hero">
                <div class="mono">Community fork · Skylanders CoverForge</div>
                <h1>
                    Printable cover art for Skylanders NFC cards &amp; coins
                </h1>
            </div>

            <div class="home-sub mono">Choose a game</div>
            <div class="game-grid">
                <GameCard v-for="g in games" :key="g.id" :game="g" />
            </div>
        </div>

        <footer class="home-foot">
            <NuxtLink to="/creators"
                >Image assets by the community — see creators</NuxtLink
            >
        </footer>
    </div>
</template>

<style scoped>
.home {
    padding-top: 40px;
    padding-bottom: 60px;
}

.home-hero {
    max-width: 720px;
    margin-bottom: 34px;
}

.home-hero h1 {
    font-size: 44px;
    line-height: 1.03;
    letter-spacing: -0.01em;
    margin: 14px 0 0;
}

.home-hero p {
    font-size: 16px;
    color: var(--muted);
    margin: 16px 0 0;
    max-width: 620px;
}

.home-sub {
    margin-bottom: 16px;
}

.game-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
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

@media (max-width: 1023px) {
    .game-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .home-hero h1 {
        font-size: 34px;
    }
}

@media (max-width: 560px) {
    .game-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
}
</style>
