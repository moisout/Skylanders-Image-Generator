import { fileURLToPath } from 'node:url'

const abs = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      title: 'Skylanders Image Generator',
    },
  },

  css: ['~/assets/css/main.css', '~/assets/css/generator.css'],

  routeRules: {
    '/': { redirect: '/spyro' },
  },

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
        '/spyro',
        '/giants',
        '/swapforce',
        '/trapteam',
        '/superchargers',
        '/imaginators',
        '/creators',
      ],
    },
  },
})
