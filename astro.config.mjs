import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import image from '@astrojs/image'
import preact from '@astrojs/preact'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind(), image(), preact()],
  server: { port: 3000, host: '0.0.0.0' }
})
