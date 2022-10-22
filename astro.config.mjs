import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import preact from '@astrojs/preact'
import image from '@astrojs/image'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind(), preact(), image()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  site: 'https://juxt-site-v3-main.vercel.app',
  markdown: {
    shikiConfig: {
      theme: 'css-variables'
    }
  }
})
