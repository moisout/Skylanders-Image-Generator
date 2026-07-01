<script setup lang="ts">
interface Creator {
  avatar: string
  alt: string
  name: string
  thanks: string
}

const creators: Creator[] = [
  { avatar: 'fruitsnack.png', alt: 'fruitsnack', name: 'Fruitsnack', thanks: 'Massive thanks for all the help with the Skylanders image assets and the ongoing support throughout the project!' },
  { avatar: 'green.png', alt: 'cha0s', name: 'Cha0s', thanks: 'Thank you for your amazing contributions on round covers for Spyro and Giants!' },
  { avatar: 'dimspace.png', alt: 'dimspace', name: 'Dim', thanks: 'Thanks for all your great help with villain covers for Trap Team!' },
  { avatar: 'mirakel.png', alt: 'mirakel', name: 'Mirakel', thanks: 'Thanks for your amazing work on round covers for all of the games!' },
  { avatar: 'mr_red_shadow.png', alt: 'mr_red_shadow', name: 'Mr Shadow', thanks: 'Thank you for creating amazing card image assets for all the games!' },
  { avatar: 'shizzy.png', alt: 'shizzy', name: 'Shizzy', thanks: 'Thanks for all your hard work on the round covers for Imaginators!' },
  { avatar: 'skylandersnfc.png', alt: 'skylandersnfc', name: 'SkylandersNFC', thanks: 'I don’t know this guy. Rumor has it he’s a quite weird.' },
  { avatar: 'yellow.png', alt: 'sobersu', name: 'Sobersu', thanks: 'Thank you for covering almost all the games with highly detailed covers for cards and coins.' },
  { avatar: 'blue.png', alt: 'Adri-Dani', name: 'Adri-Dani', thanks: 'Thanks for your fantastic work on custom artwork and covers that bring extra polish to the collection!' },
  { avatar: 'green.png', alt: 'Adrian', name: 'Adrian', thanks: 'Thanks for your creative contributions and for helping expand the collection with fresh assets!' },
  { avatar: 'grey.png', alt: 'AlexDTI', name: 'AlexDTI', thanks: 'Big thanks for your creative contributions and attention to detail on game assets!' },
  { avatar: 'red.png', alt: 'LenLen', name: 'LenLen', thanks: 'Thank you for your awesome effort in making unique, high-quality covers and images!' },
  { avatar: 'yellow.png', alt: 'Cendrillion', name: 'Cendrillion', thanks: 'Thanks for adding your artistic touch to the project and helping keep the style consistent!' },
  { avatar: 'blue.png', alt: 'IndominusRex', name: 'IndominusRex', thanks: 'Huge thanks for your impressive designs and for expanding the collection with great quality!' },
  { avatar: 'grey.png', alt: 'Mejoe', name: 'Mejoe', thanks: 'Thanks for your great work on covers and images - it’s a huge help for completing the sets!' },
]

useSeoMeta({
  title: 'Creators & credits',
  description: 'The community artists behind Skylanders CoverForge — the card and coin cover-art creators.',
})
defineOgImage('CoverForge', { title: 'Creators & credits' })
</script>

<template>
  <div>
    <AppHeader />

    <div class="cr-hero">
      <img src="/images/creators.webp" alt="" class="cr-hero-bg">
      <div class="cr-hero-fade" />
      <div class="cr-hero-inner">
        <h1>Creators &amp; Credits</h1>
        <p>Every cover and coin in Skylanders CoverForge was made by these community artists.</p>
      </div>
    </div>

    <div class="container cr-body">
      <div class="project-note">
        <p>
          Skylanders CoverForge is a fork of the
          <a
            href="https://github.com/skylandersnfc/Skylanders-Image-Generator"
            target="_blank"
            rel="noopener"
          >SkylandersNFC Image Generator</a>
          project. Huge thanks to the SkylandersNFC project and everyone behind it for creating and
          sharing the original generator and image assets that make all of this possible.
        </p>
        <p>Parts of this fork were written with AI.</p>
      </div>

      <div class="cr-grid">
        <div v-for="c in creators" :key="c.name" class="cr-card">
          <img :src="`/images/avatars/${c.avatar}`" :alt="c.alt" class="cr-avatar">
          <div>
            <div class="cr-name">{{ c.name }}</div>
            <div class="cr-thanks">{{ c.thanks }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cr-hero {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 52px 24px 30px;
}

.cr-hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}

.cr-hero-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(231, 226, 218, 0.5), rgba(231, 226, 218, 0.92) 80%, var(--bg));
}

.cr-hero-inner {
  position: relative;
}

.cr-hero h1 {
  font-size: 34px;
}

.cr-hero p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 15px;
}

.cr-body {
  padding-bottom: 60px;
}

.project-note {
  max-width: 680px;
  margin: 8px auto 30px;
  padding: 18px 22px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  box-shadow: var(--sh-sm);
  text-align: center;
  color: var(--ink-2);
  font-size: 14.5px;
  line-height: 1.55;
}

.project-note p {
  margin: 0 0 8px;
}

.project-note p:last-child {
  margin-bottom: 0;
  color: var(--muted);
}

.project-note a {
  color: var(--accent-dark, #106a9c);
  text-decoration: underline;
}

.cr-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.cr-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  box-shadow: var(--sh-sm);
  padding: 16px 18px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.cr-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sh-card);
}

.cr-avatar {
  width: 60px;
  height: 60px;
  border-radius: 999px;
  object-fit: cover;
  flex: none;
  border: 2px solid #fff;
  box-shadow: var(--sh-sm);
}

.cr-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 18px;
}

.cr-thanks {
  font-size: 13.5px;
  color: var(--muted);
  margin-top: 3px;
  line-height: 1.45;
}

@media (max-width: 720px) {
  .cr-grid {
    grid-template-columns: 1fr;
  }
}
</style>
