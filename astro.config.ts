import fs from 'node:fs'
import path from 'node:path'
import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import { h } from 'hastscript'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'

// netlify - build vars https://docs.netlify.com/build/configure-builds/environment-variables/
const PRODUCTION_SITE_URL = 'https://juxt.pro'

function getSiteUrl() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4321'
  }
  if (process.env.CONTEXT === 'deploy-preview') {
    return process.env.DEPLOY_URL
  }

  if (process.env.CONTEXT === 'production') {
    // https://juxt.pro
    return process.env.URL
  }

  return PRODUCTION_SITE_URL
}

// Build a set of draft career page slugs to exclude from the sitemap
const draftCareerSlugs = new Set<string>()
const careersDir = path.resolve('src/pages/careers')
if (fs.existsSync(careersDir)) {
  for (const file of fs.readdirSync(careersDir)) {
    if (file.endsWith('.md') || file.endsWith('.mdx')) {
      const content = fs.readFileSync(path.join(careersDir, file), 'utf-8')
      if (/^draft:\s*true/m.test(content)) {
        const slug = file.replace(/\.mdx?$/, '')
        draftCareerSlugs.add(`/careers/${slug}/`)
      }
    }
  }
}

// Inline rehype plugin: add target="_blank" to external links
function rehypeExternalLinks() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'a' && node.properties?.href) {
        const href = node.properties.href
        if (typeof href === 'string' && !href.startsWith('#')) {
          try {
            const url = new URL(href, PRODUCTION_SITE_URL)
            if (url.host !== 'juxt.pro') {
              node.properties.target = '_blank'
              node.properties.rel = 'noopener noreferrer'
            }
          } catch {}
        }
      }
      if (node.children) node.children.forEach(visit)
    }
    visit(tree)
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    preact(),
    sitemap({
      filter: (page) => {
        if (page.includes('?')) return false
        // Exclude draft career pages
        const url = new URL(page)
        if (draftCareerSlugs.has(url.pathname)) return false
        return true
      }
    })
  ],
  site: getSiteUrl(),
  markdown: {
    shikiConfig: {
      theme: 'css-variables'
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeSlug,
      rehypeKatex,
      rehypeAutolinkHeadings,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: {
            ariaHidden: true,
            tabIndex: -1,
            class: 'slug-a'
          },
          // Add svg for heading links
          content: () => [
            h(
              'svg',
              {
                class: 'slug-svg',
                viewBox: '0 0 16 16',
                version: '1.1',
                width: '1.5rem',
                height: '1.5rem'
              },
              [
                h('path', {
                  fillRule: 'evenodd',
                  d: 'M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'
                })
              ]
            )
          ]
        }
      ],
      rehypeExternalLinks
    ]
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js']
      }
    }
  }
})
