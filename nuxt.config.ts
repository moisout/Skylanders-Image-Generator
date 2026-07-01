import { fileURLToPath } from 'node:url'
import { games, slugify } from './app/data/games'

const abs = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// Every generator route, so all 90 prerender regardless of client-side gallery tabs.
const generatorRoutes = games.flatMap((g) =>
  (['cards', 'coins'] as const).flatMap((type) =>
    [...g[type].front, ...g[type].back].map((s) => `/${g.id}/${type}/${slugify(s.set)}`),
  ),
)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,

  modules: ['@nuxt/fonts', '@nuxtjs/seo'],

  site: {
    url: 'https://coverforge.m0.is',
    name: 'Skylanders CoverForge',
    description:
      'Printable cover-art sheets for Skylanders NFC cards & coins — pick a game, curate a creator’s cover set, and print a size-accurate sheet.',
  },

  // OG images render with the brand fonts (satori fetches them).
  ogImage: {
    fonts: ['Fredoka:600', 'DM+Sans:500'],
  },

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1c1a15' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  css: ['~/assets/css/main.css', '~/assets/css/generator.css'],

  nitro: {
    // Serve the untouched upstream image folders as-is at their original URLs.
    // Kept in place (not moved into public/) so `git merge upstream/main` stays clean.
    publicAssets: [
      { baseURL: '/assets', dir: abs('./assets') },
      { baseURL: '/images', dir: abs('./images') },
    ],
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        ...games.map((g) => `/${g.id}`),
        '/creators',
        ...generatorRoutes,
      ],
    },
  },
})
