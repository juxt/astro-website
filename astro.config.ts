import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import { h } from 'hastscript'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import inspectUrls from '@jsdevtools/rehype-url-inspector'

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    preact(),
    sitemap({
      filter: (page) => {
        // Exclude any pages we don't want in the sitemap, like search pages
        return !page.includes('?')
      }
    })
  ],
  site: 'https://juxt.pro/',
  markdown: {
    shikiConfig: {
      theme: 'css-variables'
    },
    remarkPlugins: [remarkMath, remarkGfm],
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
      [
        inspectUrls,
        {
          selectors: ['a[href]'],
          inspectEach: (url) => {
            // Ignore hash links
            if (url.node.properties.href.startsWith('#')) {
              return
            }
            var href = new URL(url.node.properties.href, 'https://juxt.pro/')
            // Add target blank to external links
            if (href.host !== 'juxt.pro') {
              url.node.properties.target = '_blank'
              url.node.properties.rel = 'noopener noreferrer'
            }
          }
        }
      ]
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
