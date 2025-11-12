import { readFile, writeFile, readdir, mkdir, copyFile } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { unified } from 'unified'
import { forceSimulation, forceCollide } from 'd3-force'
import { RADAR_COLORS, getQuadrantColor } from '../../src/utils/radar-colors'
import { existsSync } from 'node:fs'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdx from 'remark-mdx'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]
type JsonObject = { [key: string]: JsonValue }

// Inline cover logo SVG (explicit size added for reliable PDF rendering)
const COVER_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178 32" width="36mm" height="6.5mm"><g fill="none" fill-rule="evenodd"><path fill="#4B4C4D" d="M50.3 24.68c.64 0 1.2-.06 1.69-.17.47-.12.93-.28 1.37-.48v-2.8h-1.94a.6.6 0 01-.43-.15.51.51 0 01-.16-.38V19.1h5.13v6.21a8.73 8.73 0 01-2.58 1.25c-.48.14-1 .24-1.54.3-.54.07-1.14.1-1.77.1-1.13 0-2.16-.19-3.1-.58a7.4 7.4 0 01-4.08-4.1 8.34 8.34 0 01-.58-3.16c0-1.15.2-2.22.57-3.18a7.09 7.09 0 014.13-4.1c.98-.38 2.1-.57 3.32-.57 1.26 0 2.35.19 3.28.56.92.37 1.7.85 2.34 1.45l-.83 1.3c-.17.26-.38.39-.66.39a.94.94 0 01-.52-.17l-.7-.4a6.27 6.27 0 00-3-.69c-.76 0-1.45.12-2.07.38a4.3 4.3 0 00-1.57 1.09 4.91 4.91 0 00-1 1.7c-.24.67-.35 1.42-.35 2.24a7 7 0 00.37 2.37 4.55 4.55 0 002.65 2.83c.61.25 1.3.37 2.02.37zM58.35 26.27V15.56h1.51c.26 0 .45.04.55.14.1.1.18.27.21.5l.16 1.3c.38-.66.83-1.19 1.34-1.57.52-.38 1.1-.57 1.74-.57.53 0 .96.12 1.31.36l-.33 1.94c-.03.12-.07.2-.14.26a.47.47 0 01-.28.08c-.1 0-.25-.02-.43-.07a2.76 2.76 0 00-.72-.08c-.53 0-.99.15-1.37.45-.39.3-.7.73-.98 1.3v6.67h-2.57zM66.54 26.62h2.67V15.76h-2.67v10.86zm3.07-14.03c0 .23-.04.44-.14.64s-.21.37-.37.52a1.74 1.74 0 01-2.4 0 1.79 1.79 0 01-.37-.52 1.55 1.55 0 010-1.29 1.68 1.68 0 012.23-.9 1.7 1.7 0 011.05 1.54v.01zM75.84 24.57c.54 0 1-.11 1.37-.34.38-.22.74-.53 1.07-.95v-4.8a2.54 2.54 0 00-2.08-.98c-.39 0-.74.07-1.06.22-.31.14-.58.36-.8.66-.23.3-.4.67-.51 1.13-.12.46-.18 1-.18 1.62 0 .63.05 1.16.15 1.59.1.44.25.8.43 1.07.2.27.42.47.7.6.27.11.58.18.91.18zm3.45 1.89c-.34 0-.55-.15-.66-.47l-.21-1.04a4.61 4.61 0 01-2.4 1.55 4.5 4.5 0 01-1.06.12c-.59 0-1.13-.12-1.62-.37-.48-.24-.9-.6-1.26-1.06a5.07 5.07 0 01-.82-1.72 8.58 8.58 0 01.04-4.56c.22-.68.53-1.28.93-1.78s.9-.9 1.46-1.18c.57-.27 1.2-.42 1.91-.42a3.76 3.76 0 012.68 1.06v-5.67h2.59v15.54h-1.58zM99.79 18.94c0-.85-.12-1.6-.34-2.27a4.75 4.75 0 00-.97-1.7 4.1 4.1 0 00-1.53-1.07 5.26 5.26 0 00-2.02-.37h-3v10.81h3c.75 0 1.42-.12 2.02-.37.6-.25 1.11-.6 1.53-1.07a4.7 4.7 0 00.97-1.7c.22-.67.34-1.42.34-2.26m2.92 0c0 1.12-.19 2.16-.56 3.1a7.04 7.04 0 01-4.04 4.01c-.96.38-2.02.57-3.18.57h-5.87V11.26h5.87a8.6 8.6 0 013.18.57c.95.38 1.77.9 2.46 1.58.67.68 1.2 1.49 1.58 2.42.37.95.56 1.98.56 3.1M108.49 29.47a1 1 0 01-.3.41c-.12.1-.31.15-.56.15h-1.92l2-4.33-4.32-10h2.25c.21 0 .37.04.48.14.11.1.2.21.25.34l2.28 5.6a6.44 6.44 0 01.34 1.16l.19-.6.21-.57 2.15-5.59a.76.76 0 01.7-.48h2.07l-5.82 13.77zM115.33 26.62V15.86h1.62c.34 0 .57.16.67.47l.18.85a5.58 5.58 0 011.48-1.08 4.05 4.05 0 011.91-.4 4 4 0 011.6.3c.46.2.84.47 1.15.83.31.37.55.8.7 1.3.17.5.25 1.04.25 1.64v6.85h-2.64v-6.85c0-.65-.16-1.16-.47-1.52-.3-.36-.77-.54-1.4-.54-.45 0-.88.1-1.27.3-.4.2-.78.48-1.14.83v7.78h-2.64zM130.48 24.81a2.72 2.72 0 001.35-.3c.2-.09.4-.21.58-.35.18-.15.37-.31.55-.5v-1.83c-.75 0-1.37.05-1.87.14-.5.1-.9.22-1.2.37-.31.15-.53.33-.65.53-.13.2-.2.41-.2.65 0 .46.14.8.4 1 .27.2.62.3 1.04.3zm4.99 1.64h-1.16a1.2 1.2 0 01-.57-.12c-.14-.07-.24-.22-.31-.45l-.23-.77c-.27.25-.53.47-.8.65a4.25 4.25 0 01-2.72.86c-.44 0-.86-.07-1.24-.2-.38-.12-.7-.3-.98-.55a2.57 2.57 0 01-.64-.93c-.15-.37-.23-.8-.23-1.29 0-.4.11-.81.32-1.22.21-.4.56-.76 1.06-1.08.49-.32 1.14-.6 1.96-.8a12.2 12.2 0 013.03-.32v-.64c0-.74-.15-1.28-.45-1.64-.3-.35-.74-.53-1.31-.53a3.1 3.1 0 00-1.76.49l-.56.33c-.18.1-.37.15-.57.15a.73.73 0 01-.45-.14c-.12-.09-.22-.2-.3-.34l-.47-.83a6.24 6.24 0 014.43-1.72c.62 0 1.18.1 1.67.3.49.22.9.5 1.23.88.34.37.6.81.78 1.33.18.52.27 1.08.27 1.7v6.88zM137.85 26.62V15.86h1.61c.34 0 .56.16.67.47l.17.8a5.3 5.3 0 011.28-1.03 3.62 3.62 0 011.66-.4c.7 0 1.26.18 1.7.54.45.37.78.86 1 1.47a3.4 3.4 0 011.48-1.54 4.7 4.7 0 013.62-.2c.47.18.87.45 1.19.8.32.34.56.77.73 1.27.17.5.25 1.08.25 1.73v6.85h-2.63v-6.85c0-.68-.15-1.2-.46-1.55-.3-.34-.75-.51-1.34-.51-.27 0-.52.04-.75.13a1.73 1.73 0 00-1.02 1.04c-.1.26-.15.56-.15.9v6.84h-2.65v-6.85c0-.72-.14-1.24-.44-1.57-.3-.33-.73-.5-1.3-.5-.38 0-.73.1-1.07.29-.32.18-.63.43-.92.75v7.88h-2.63zM155.26 26.62h2.67V15.76h-2.67v10.86zm3.07-14.03c0 .23-.05.44-.14.63a1.7 1.7 0 01-.92.88 1.71 1.71 0 01-2.22-.88 1.6 1.6 0 010-1.29 1.65 1.65 0 01.9-.88 1.71 1.71 0 012.38 1.54zM168.1 18.18c-.07.1-.15.18-.22.23-.08.06-.19.09-.33.09a.72.72 0 01-.4-.13 9.28 9.28 0 00-.45-.27 2.9 2.9 0 00-1.54-.4c-.47 0-.87.08-1.22.25-.34.17-.64.4-.87.72-.23.31-.4.69-.51 1.13-.12.45-.17.95-.17 1.51 0 .58.06 1.1.18 1.56.13.45.3.83.54 1.14a2.35 2.35 0 001.98.94 2.76 2.76 0 001.67-.5l.47-.33c.13-.1.27-.15.44-.15.21 0 .37.08.48.24l.76.96a4.76 4.76 0 01-2.01 1.4c-.37.15-.75.25-1.14.3-.39.06-.78.09-1.16.09a4.8 4.8 0 01-3.47-1.48 5.34 5.34 0 01-1.05-1.78c-.26-.7-.39-1.5-.39-2.39 0-.8.12-1.55.35-2.23a4.7 4.7 0 012.68-2.96 5.7 5.7 0 012.28-.42c.81 0 1.53.12 2.14.39.62.26 1.17.64 1.66 1.13l-.7.96zM177.06 18a.71.71 0 01-.22.23.57.57 0 01-.3.07.98.98 0 01-.42-.1l-.5-.24a3.27 3.27 0 00-1.53-.35c-.52 0-.93.11-1.23.33-.3.22-.45.5-.45.87 0 .23.07.42.23.58.15.16.36.3.61.43.25.11.54.23.86.32l.98.31c.34.12.67.24.99.4.32.13.6.32.86.54a2.5 2.5 0 01.84 1.93c0 .53-.1 1.02-.3 1.46-.18.44-.47.83-.84 1.15-.37.32-.83.58-1.37.76a6.01 6.01 0 01-2.98.16 6.85 6.85 0 01-1.96-.7 4.6 4.6 0 01-.74-.54l.6-1a.85.85 0 01.28-.27.86.86 0 01.87.04 4.96 4.96 0 001.2.6c.25.09.58.14.98.14.31 0 .58-.04.8-.12.23-.07.42-.17.56-.3.15-.11.26-.25.32-.41.07-.16.1-.33.1-.5a.88.88 0 00-.22-.62c-.16-.17-.36-.3-.61-.43a6.1 6.1 0 00-.87-.32c-.33-.1-.66-.2-1-.32a9.1 9.1 0 01-.99-.4 3.42 3.42 0 01-.86-.58 2.63 2.63 0 01-.61-.86 2.9 2.9 0 01-.23-1.23 3.13 3.13 0 011.05-2.34c.34-.3.78-.54 1.3-.72a5.32 5.32 0 011.79-.27c.75 0 1.44.12 2.06.37.62.25 1.13.57 1.55.98l-.6.94z"></path><path fill="#EA5B25" d="M29.23 20.47c.19 2.03.15 4.09-.14 6.1-3.29 3.75-14.64 5.6-21.85 5.07a10.18 10.18 0 01-1.78-5.1c9.16 1.73 18.96-1.07 23.77-6.07"></path><path fill="#F29100" d="M31.79 16.34C30.09 8.28 21.09.7 14.9 0c-.5.32-.91.72-1.25 1.18 3.6.33 6.74 2.74 10.35 6.6 2.8 3 4.68 7.8 5.14 12.84.18 2 .14 4.04-.14 6.02a11.19 11.19 0 002.79-10.3"></path><path fill="#0069B3" d="M21.63 22.18l-.3-.07c-1.6-.68-3.24-2.24-4.66-4.24 4.8-5.75 2.14-10.11-1.22-11a4.41 4.41 0 00-3.01.18c.95-.45 1.99-.8 3.05-.86 2.51-.13 5.14.56 6.82 3.01 2.15 3.38 1.72 9.47-.68 12.98z"></path><path fill="#A9AA00" d="M16 6.18c-.85.75-2.12 1.87-3 2.82-.21-.8-.29-1.73-.37-2.5 0-.02.01-.02.02-.02 1.35-.3 2.35-.3 3.35-.3zM5.59 26.58c-.3-3.87 1.31-8.1 3.62-11.88-.2-1.78-.26-3.56-.25-5.15C5.16 13.06.6 19.85.06 24.96c-.3 2.67.52 4.88 3.1 5.94 1.08.38 2.54.63 4.23.75a10 10 0 01-1.8-5.07"></path><path fill="#62B8E8" d="M21.54 21.85c-1.59-.67-3.2-2.21-4.6-4.2a25.15 25.15 0 01-3.78-8.26c-.2-.83-.36-1.66-.44-2.45-.23-2.26.07-4.3 1.11-5.71.34-.46.76-.86 1.27-1.18-1.88-.2-3.5.2-4.58 1.43-.82.93-1.33 2.31-1.4 4.24a42.75 42.75 0 000 9.1c.75 6.66 3.38 13.28 10.6 9.15a6.57 6.57 0 002.12-2.05l-.3-.07z"></path></g></svg>`
type SectionConfig =
  | {
      // MDX-backed section (reads ../src/pages/ai-radar/<dir>/index.mdx)
      label: string
      dir: string
      divider?: boolean
      wordsPerPage?: number // deprecated; ignored
    }
  | {
      // Raw HTML section to inject as-is
      label?: string
      htmlFile: string
    }

type Config = {
  title?: string
  cover?: {
    title?: string
    subtitle?: string
    date?: string
    logoPath?: string
    companyName?: string
  }
  // Optional HTML template path for the first (cover) page
  coverTemplatePath?: string
  // Optional template used to create a cover page for each MDX section
  categoryCoverTemplatePath?: string
  sourceRoot: string
  sections: SectionConfig[]
  pagination?: {
    pageTargetWordCount?: number
    smallSubsectionMaxWords?: number
    minWordsOnCurrentPageForLongSubsection?: number
  }
  output?: {
    radarHtmlPath?: string
    stylesHref?: string
  }
}

type MdAst = any
type MdNode = any

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function toAbsolutePath(fromDir: string, maybeRelative: string): string {
  return resolve(join(fromDir, maybeRelative))
}

async function loadConfig(projectRoot: string): Promise<Config> {
  const cfgPath = join(projectRoot, 'config.json')
  const raw = await readFile(cfgPath, 'utf8')
  const cfg = JSON.parse(raw) as Config
  assert(cfg.sourceRoot, 'config.sourceRoot is required')
  assert(cfg.sections?.length, 'config.sections must list at least one section')
  return cfg
}

function stripMdxAndAdjustHeadings(tree: MdAst): MdAst {
  // Remove frontmatter (yaml), MDX ESM imports/exports, and specific MDX JSX components
  // Then increment heading levels by 1: h1 -> h2, h2 -> h3, etc.
  const nodes: MdNode[] = []
  for (const node of tree.children as MdNode[]) {
    if (node.type === 'yaml') continue
    if (node.type === 'mdxjsEsm') continue
    if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression')
      continue
    if (
      node.type === 'mdxJsxFlowElement' ||
      node.type === 'mdxJsxTextElement'
    ) {
      // Drop known components and data-radar placeholders
      const name = node.name as string | undefined
      if (name === 'SingleQuadrantData') continue
      // Also drop <div data-radar ... />
      if (name === 'div' && Array.isArray(node.attributes)) {
        const hasDataRadar = node.attributes.some(
          (a: any) => a?.type === 'mdxJsxAttribute' && a?.name === 'data-radar'
        )
        if (hasDataRadar) continue
      }
      // Keep unknown JSX elements? For PDF we generally don't want JSX; drop by default.
      continue
    }
    if (node.type === 'heading') {
      node.depth = Math.min((node.depth ?? 1) + 1, 6)
    }
    nodes.push(node)
  }
  return { ...tree, children: nodes }
}

function extractIntroParagraph(tree: MdAst): MdNode[] {
  // Intro is content before first heading depth <=2 (after adjusted depths)
  const result: MdNode[] = []
  for (const node of tree.children as MdNode[]) {
    if (node.type === 'heading' && node.depth <= 2) break
    if (node.type === 'paragraph') result.push(node)
  }
  return result
}

type Ring = 'adopt' | 'trial' | 'assess' | 'hold'
type RingEntries = Record<Ring, Array<{ label: string; moved: number }>>

function extractRingEntries(tree: MdAst): RingEntries {
  const entries: RingEntries = { adopt: [], trial: [], assess: [], hold: [] }
  const moveMap = (v: string | null | undefined): number => {
    if (!v) return 0
    const s = v.toLowerCase()
    if (s === 'up') return 1
    if (s === 'down') return -1
    if (s === 'new') return 2
    return 0
  }
  for (const node of tree.children as MdNode[]) {
    if (
      (node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement') &&
      node.name === 'div' &&
      Array.isArray(node.attributes)
    ) {
      const attrs = node.attributes as any[]
      const hasDataRadar = attrs.some(
        (a) => a?.type === 'mdxJsxAttribute' && a?.name === 'data-radar'
      )
      if (!hasDataRadar) continue
      const ringAttr = attrs.find(
        (a) => a?.type === 'mdxJsxAttribute' && a?.name === 'data-ring'
      )
      const labelAttr = attrs.find(
        (a) => a?.type === 'mdxJsxAttribute' && a?.name === 'data-label'
      )
      const changeAttr = attrs.find(
        (a) => a?.type === 'mdxJsxAttribute' && a?.name === 'data-change'
      )
      const ringValue = (ringAttr?.value ?? '').toString().toLowerCase()
      const labelValue = (labelAttr?.value ?? '').toString()
      const moved = moveMap(
        typeof changeAttr?.value === 'string' ? changeAttr?.value : undefined
      )
      if (
        labelValue &&
        (ringValue === 'adopt' ||
          ringValue === 'trial' ||
          ringValue === 'assess' ||
          ringValue === 'hold')
      ) {
        entries[ringValue as Ring].push({ label: labelValue, moved })
      }
    }
  }
  return entries
}

type Block = {
  kind: 'categoryIntro' | 'item'
  nodes: MdNode[]
  wordCount: number
}

function countWordsFromMdNodes(nodes: MdNode[]): number {
  // Simple text extraction from mdast nodes
  let text = ''
  const pushText = (s: string) => {
    if (s) text += (text ? ' ' : '') + s
  }
  function walk(n: MdNode) {
    if (!n) return
    if (n.type === 'text') pushText(n.value as string)
    if (Array.isArray(n.children)) for (const c of n.children) walk(c)
  }
  for (const n of nodes) walk(n)
  return text.trim().split(/\s+/).filter(Boolean).length
}

type Category = { title: string; blocks: Block[] }

function buildCategories(tree: MdAst): Category[] {
  // After heading depth adjustment: category headings are depth 2 ("Adopt", etc.)
  const categories: Category[] = []
  const children: MdNode[] = tree.children ?? []
  let i = 0
  while (i < children.length) {
    const node = children[i]
    if (node.type === 'heading' && node.depth === 2) {
      // Start a category
      const catTitle = stringifyInline(node)
      const blocks: Block[] = []
      // categoryIntro: include following paragraphs until first item heading (depth 3) or next category
      const introNodes: MdNode[] = [node]
      i++
      while (i < children.length) {
        const n = children[i]
        if (n.type === 'heading' && (n.depth === 2 || n.depth === 3)) break
        introNodes.push(n)
        i++
      }
      blocks.push({
        kind: 'categoryIntro',
        nodes: introNodes,
        wordCount: countWordsFromMdNodes(introNodes)
      })
      // item blocks: h3 + content until next h3 or depth<=2
      while (i < children.length) {
        const n = children[i]
        if (n.type === 'heading' && n.depth === 2) break // next category
        if (n.type === 'heading' && n.depth === 3) {
          const itemNodes: MdNode[] = [n]
          i++
          while (i < children.length) {
            const m = children[i]
            if (m.type === 'heading' && (m.depth === 2 || m.depth === 3)) break
            itemNodes.push(m)
            i++
          }
          blocks.push({
            kind: 'item',
            nodes: itemNodes,
            wordCount: countWordsFromMdNodes(itemNodes)
          })
          continue
        }
        i++
      }
      categories.push({ title: catTitle, blocks })
      continue
    }
    i++
  }
  return categories
}

function stringifyInline(headingNode: MdNode): string {
  let s = ''
  function walk(n: MdNode) {
    if (!n) return
    if (n.type === 'text') s += n.value
    if (Array.isArray(n.children)) for (const c of n.children) walk(c)
  }
  for (const c of headingNode.children ?? []) walk(c)
  return s.trim()
}

async function renderNodesToHtml(nodes: MdNode[]): Promise<string> {
  const root: MdAst = { type: 'root', children: nodes }
  // Convert mdast -> hast
  const hast = await unified()
    .use(remarkRehype)
    .run(root as any)
  // Strip any lingering radar placeholders
  visit(
    hast as any,
    'element',
    (node: any, index: number | undefined, parent: any) => {
      if (!parent || index == null) return
      if (
        node.tagName === 'div' &&
        node.properties &&
        'data-radar' in node.properties
      ) {
        parent.children.splice(index, 1)
      }
    }
  )
  // hast -> html
  const html = unified()
    .use(rehypeStringify)
    .stringify(hast as any) as unknown as string
  return html
}

async function renderNodesToHtmlWithHeadingColor(
  nodes: MdNode[],
  headingColor: string
): Promise<string> {
  const root: MdAst = { type: 'root', children: nodes }
  const hast = await unified()
    .use(remarkRehype)
    .run(root as any)
  // Strip lingering radar placeholders and color headings inline
  visit(
    hast as any,
    'element',
    (node: any, index: number | undefined, parent: any) => {
      if (!parent || index == null) return
      if (
        node.tagName === 'div' &&
        node.properties &&
        'data-radar' in node.properties
      ) {
        parent.children.splice(index, 1)
        return
      }
      if (node.tagName === 'h2' || node.tagName === 'h3') {
        node.properties = node.properties || {}
        const existingStyle: string = node.properties.style || ''
        const styleMap: Record<string, string> = {}
        if (existingStyle) {
          existingStyle.split(';').forEach((p) => {
            const [k, v] = p.split(':')
            if (k && v) styleMap[k.trim()] = v.trim()
          })
        }
        styleMap.color = headingColor
        node.properties.style = Object.entries(styleMap)
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ')
      }
    }
  )
  const html = unified()
    .use(rehypeStringify)
    .stringify(hast as any) as unknown as string
  return html
}

function wrapContentPage(innerHtml: string, bannerHtml?: string): string {
  return `<section class="content-page">
${bannerHtml ?? ''}
${innerHtml}
</section>`
}

/** cover is always generated from a template (see buildCoverFromTemplate) */

async function buildCoverFromTemplate(
  projectRoot: string,
  templatePath: string,
  cfg: Config
): Promise<string> {
  const c = cfg.cover ?? {}
  const title = c.title ?? 'JUXT AI Radar'
  const subtitle = (
    c.subtitle ??
    "An engineer's guide to the AI landscape\nfrom JUXT's CTO & AI chapter members"
  ).replace(/\n/g, '<br>')
  const date = c.date ?? ''
  const logoSvg = COVER_LOGO_SVG
  const templateAbs = resolve(join(projectRoot, templatePath))
  const company = c.companyName ?? 'JUXT | A GRID DYNAMICS COMPANY'
  let tpl = await readFile(templateAbs, 'utf8')
  tpl = tpl
    .replaceAll('{title}', title)
    .replaceAll('{subtitle}', subtitle)
    .replaceAll('{date}', date)
    .replaceAll('{logoPath}', '') // backward-compat: now unused
    .replaceAll('{logoSvg}', logoSvg)
    .replaceAll('{companyName}', company)
  return tpl
}

function buildDividerHtml(label: string, descriptionHtml: string): string {
  // Map label to class if needed
  const className = label.toLowerCase().includes('language') ? 'languages' : '' // simple style hook
  return `<section class="section-divider ${className}">
  <h2 class="section-title">${label}</h2>
  <div class="section-description">
    ${descriptionHtml}
  </div>
</section>`
}

async function generateForSection(
  projectRoot: string,
  sourceRoot: string,
  section: SectionConfig,
  pagination: {
    pageTargetWordCount: number
    smallSubsectionMaxWords: number
    minWordsOnCurrentPageForLongSubsection: number
  },
  headingColor: string
): Promise<{ dividerHtml: string; pagesHtml: string[] }> {
  if (!('dir' in section)) {
    // For raw HTML sections this function shouldn't be called
    return { dividerHtml: '', pagesHtml: [] }
  }
  const mdxPath = resolve(
    join(projectRoot, sourceRoot, section.dir, 'index.mdx')
  )
  const raw = await readFile(mdxPath, 'utf8')

  // Build mdast
  const mdast: MdAst = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkMdx)
    .use(remarkGfm)
    .parse(raw)

  // Collect ring entries before cleaning drops mdx JSX
  const ringEntries = extractRingEntries(mdast)
  const cleaned = stripMdxAndAdjustHeadings(mdast)
  const introNodes = extractIntroParagraph(cleaned)
  const introHtml = introNodes.length
    ? await renderNodesToHtmlWithHeadingColor(introNodes, headingColor)
    : ''
  const dividerHtml = buildDividerHtml(section.label, introHtml)

  const categories = buildCategories(cleaned)

  // Page packing (no manual splitting - let the PDF engine paginate)
  const pagesHtml: string[] = []
  // Insert a simple running label once; CSS will repeat it on every page
  const runLabelHtml = `<div class="category-top-label-run" style="color: ${headingColor};">${section.label}</div>`
  let hasInsertedRunLabel = false
  // One content-page per category: Adopt, Trial, Assess, Hold
  for (const category of categories) {
    const nodesForCategory: MdNode[] = []
    for (const block of category.blocks) {
      nodesForCategory.push(...(block.nodes as MdNode[]))
    }
    const catHtml = await renderNodesToHtmlWithHeadingColor(
      nodesForCategory,
      headingColor
    )
    const pageHtml = !hasInsertedRunLabel ? runLabelHtml + catHtml : catHtml
    hasInsertedRunLabel = true
    pagesHtml.push(wrapContentPage(pageHtml))
  }

  return {
    dividerHtml,
    pagesHtml /* ringEntries returned via closure by caller if needed */
  } as any
}

async function maybeReadExtraHtml(
  projectRoot: string,
  relPath: string
): Promise<string> {
  const abs = resolve(join(projectRoot, relPath))
  const html = await readFile(abs, 'utf8')
  return html
}

function renderList(
  items: Array<{ label: string; moved: number }>,
  startNumber: number
): string {
  if (!items.length) return '<p></p>'
  let currentNumber = startNumber
  const listItems = items
    .map((x) => {
      const num = currentNumber++
      return `<div class="category-cover-list-item">${num}. ${x.label}</div>`
    })
    .join('')
  return `<div class="category-cover-list-items">${listItems}</div>`
}

function renderGlanceList(
  items: Array<{ label: string; moved: number }>,
  startNumber: number
): string {
  if (!items.length) return '<div class="glance-list"></div>'
  let currentNumber = startNumber
  return `<div class="glance-list">${items
    .map((x) => {
      const num = currentNumber++
      return `<div class="glance-item">${num}. ${x.label}</div>`
    })
    .join('')}</div>`
}

async function buildFullRadarFromTemplate(
  projectRoot: string,
  templatePath: string,
  orderedSectionLabels: string[],
  ringEntriesByLabel: Record<string, RingEntries>
): Promise<string> {
  const templateAbs = resolve(join(projectRoot, templatePath))
  const template = await readFile(templateAbs, 'utf8')
  const fullRadarSvg = generateFullRadarSvg(
    orderedSectionLabels,
    ringEntriesByLabel
  )
  return template.replaceAll('{full radar svg}', fullRadarSvg)
}

async function buildAtAGlanceFromTemplate(
  projectRoot: string,
  templatePath: string,
  orderedSectionLabels: string[],
  ringEntriesByLabel: Record<string, RingEntries>
): Promise<string> {
  const templateAbs = resolve(join(projectRoot, templatePath))
  const template = await readFile(templateAbs, 'utf8')

  // Map each known label to a simple token for placeholders
  const labelToToken = (
    label: string
  ): 'languages' | 'techniques' | 'tools' | 'platforms' => {
    const s = label.toLowerCase()
    if (s.includes('language')) return 'languages'
    if (s.includes('technique')) return 'techniques'
    if (s.includes('platform')) return 'platforms'
    return 'tools'
  }

  // Compute colors for each label
  const colors: Record<string, string> = {}
  for (const label of orderedSectionLabels) {
    try {
      colors[label] = getQuadrantColor(label)
    } catch {
      colors[label] = '#d97706'
    }
  }

  // Sequential numbering across all lists (Adopt, Trial, Assess, Hold) per section in order
  let counter = 1
  type RingKey = 'adopt' | 'trial' | 'assess' | 'hold'
  const ringOrder: RingKey[] = ['adopt', 'trial', 'assess', 'hold']

  let html = template
  for (const label of orderedSectionLabels) {
    const token = labelToToken(label)
    const color = colors[label]
    // Titles
    html = html.replaceAll(`{${token} title}`, label)
    // Inject color directly into header div that contains this label's title
    // Find the header div that immediately precedes the title we just inserted
    const titlePattern = `<h2 class="glance-category-title">${label}</h2>`
    const titleIndex = html.indexOf(titlePattern)
    if (titleIndex !== -1) {
      // Find the opening div tag before this title
      const headerDivPattern = '<div class="glance-category-header">'
      const headerStart = html.lastIndexOf(headerDivPattern, titleIndex)
      if (headerStart !== -1) {
        html =
          html.substring(0, headerStart) +
          `<div class="glance-category-header" style="background: ${color}; color: #ffffff;">` +
          html.substring(headerStart + headerDivPattern.length)
      }
    }
    // Lists with continuous numbering
    const entries = ringEntriesByLabel[label]
    for (const r of ringOrder) {
      const start = counter
      const listHtml = renderGlanceList(entries?.[r] ?? [], start)
      html = html.replaceAll(`{${token} ${r} list}`, listHtml)
      counter += entries?.[r]?.length ?? 0
    }
  }

  return html
}

async function buildCategoryCoverFromTemplate(
  projectRoot: string,
  templatePath: string,
  sectionLabel: string,
  descriptionHtml: string,
  ringEntries: RingEntries,
  startingId: number
): Promise<string> {
  const quadrantSvg = generateQuadrantSvg(sectionLabel, ringEntries, startingId)
  // Derive quadrant color for this section
  let categoryColor = '#999999'
  try {
    categoryColor = getQuadrantColor(sectionLabel)
  } catch {}
  // Compute a stable slug for variable names and data attributes
  const slug = sectionLabel
    .toLowerCase()
    .replace(/\s*&\s*/g, '-and-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const templateAbs = resolve(join(projectRoot, templatePath))
  const template = await readFile(templateAbs, 'utf8')
  // Replace placeholders; handle {adpot entries} typo and {adopt entries}
  // Inline styles for coloring (no CSS variables to avoid cross-section bleed)

  // Calculate starting numbers for each ring
  let currentId = startingId
  const adoptStart = currentId
  currentId += ringEntries.adopt.length
  const trialStart = currentId
  currentId += ringEntries.trial.length
  const assessStart = currentId
  currentId += ringEntries.assess.length
  const holdStart = currentId

  let html = template
    .replaceAll('{category name}', sectionLabel)
    .replaceAll('{category description}', descriptionHtml)
    .replaceAll('{adpot entries}', renderList(ringEntries.adopt, adoptStart))
    .replaceAll('{adopt entries}', renderList(ringEntries.adopt, adoptStart))
    .replaceAll('{trial entries}', renderList(ringEntries.trial, trialStart))
    .replaceAll('{assess entries}', renderList(ringEntries.assess, assessStart))
    .replaceAll('{hold entries}', renderList(ringEntries.hold, holdStart))
    .replaceAll('{quadrant svg}', quadrantSvg)
  // Add inline background to header
  html = html.replace(
    '<div class="category-cover-header">',
    `<div class="category-cover-header" style="background: ${categoryColor}; color: #ffffff;">`
  )
  // Color left list headings inline
  html = html.replaceAll('<h3>', `<h3 style="color: ${categoryColor}">`)
  return html
}

function generateQuadrantSvg(
  sectionLabel: string,
  ringEntries: RingEntries,
  startingId: number
): string {
  // Static SVG using a fixed logical canvas; CSS controls on-page size.
  const canvasSize = 800
  const canvasWidth = canvasSize
  const bottomExtra = 80
  const canvasHeight = canvasSize + bottomExtra
  const padding = 40
  const centerX = padding
  const centerY = canvasSize - padding
  const gridColor = '#cbd5e1'
  let quadrantColor = '#d97706'
  try {
    quadrantColor = getQuadrantColor(sectionLabel)
  } catch {}

  // Compute radii to fill the quarter within square canvas
  const maxRadius = canvasSize - 2 * padding
  const ringRadii = [
    Math.round(maxRadius * 0.25),
    Math.round(maxRadius * 0.5),
    Math.round(maxRadius * 0.75),
    Math.round(maxRadius * 1.0)
  ]
  const ringNames = ['Adopt', 'Trial', 'Assess', 'Hold']
  const circleRadius = 16
  const buffer = 10
  const separation = 8

  type Entry = {
    id: number
    label: string
    ring: number
    x: number
    y: number
    moved?: number
  }
  const entries: Entry[] = []

  // Deterministic RNG
  let seed = 42
  const rand = () => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }
  const randBetween = (min: number, max: number) => min + rand() * (max - min)
  const normalBetween = (min: number, max: number) =>
    min + (rand() + rand()) * 0.5 * (max - min)

  // Build entries with IDs starting from the provided startingId
  let nextId = startingId
  const ringOrder: Array<keyof RingEntries> = [
    'adopt',
    'trial',
    'assess',
    'hold'
  ]
  for (let r = 0; r < ringOrder.length; r++) {
    const items = ringEntries[ringOrder[r]]
    for (const item of items) {
      // Position within ring quarter-circle bounds
      const ringRadius = ringRadii[r]
      const prevRadius = r > 0 ? ringRadii[r - 1] : 0
      const minRadius =
        r === 0 ? circleRadius + buffer : prevRadius + circleRadius + buffer
      const maxRadius = ringRadius - circleRadius - buffer
      let angle = -Math.PI / 4
      let radius = (minRadius + maxRadius) / 2
      let x = centerX + radius * Math.cos(angle)
      let y = centerY + radius * Math.sin(angle)
      // Try to place within quarter with some jitter and avoid overlaps
      let attempts = 0
      do {
        angle = randBetween(-Math.PI / 2 + 0.1, -0.1)
        radius = normalBetween(minRadius, maxRadius)
        x = centerX + radius * Math.cos(angle)
        y = centerY + radius * Math.sin(angle)
        attempts++
      } while (
        attempts < 120 &&
        // keep within quarter
        (x - circleRadius - buffer < centerX ||
          y + circleRadius + buffer > centerY ||
          // avoid overlap with already placed entries
          entries.some((e) => {
            const dx = e.x - x
            const dy = e.y - y
            const minDist = circleRadius * 2 + separation
            return dx * dx + dy * dy < minDist * minDist
          }))
      )
      entries.push({
        id: nextId++,
        label: item.label,
        ring: r,
        x,
        y,
        moved: item.moved
      })
    }
  }

  // Refine positions using d3-force collision (server-side), similar to client logic
  try {
    forceSimulation(entries as any)
      .velocityDecay(0.2)
      .force(
        'collision',
        forceCollide(circleRadius + separation / 2).strength(0.9)
      )
      .tick(200)
      .stop()
  } catch {}

  // SVG header with hard-coded width for PDF; height derives from viewBox aspect
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100mm" viewBox="0 0 ${canvasWidth} ${canvasHeight}" preserveAspectRatio="xMidYMid meet">`
  // Background
  svg += `<rect width="${canvasWidth}" height="${canvasHeight}" fill="transparent"/>`

  // Grid arcs
  for (const r of ringRadii) {
    const d = `M ${centerX} ${centerY - r} A ${r} ${r} 0 0 1 ${centerX + r} ${centerY}`
    svg += `<path d="${d}" fill="none" stroke="${gridColor}" stroke-width="1.5"/>`
  }
  // Grid lines
  const outer = ringRadii[ringRadii.length - 1]
  svg += `<line x1="${centerX}" y1="${centerY - outer}" x2="${centerX}" y2="${centerY}" stroke="${gridColor}" stroke-width="1.5"/>`
  svg += `<line x1="${centerX}" y1="${centerY}" x2="${centerX + outer}" y2="${centerY}" stroke="${gridColor}" stroke-width="1.5"/>`

  // Ring labels along the bottom axis (inside the quadrant, left to right)
  {
    const totalWidth = outer
    const sectionWidth = totalWidth / ringNames.length
    // Place labels just below the quadrant horizontal axis
    const labelY = centerY + 40
    for (let i = 0; i < ringNames.length; i++) {
      const labelX = centerX + i * sectionWidth + sectionWidth / 2
      svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="central" fill="${quadrantColor}" font-family="Arial, Helvetica" font-size="28" font-weight="900">${ringNames[i].toUpperCase()}</text>`
    }
  }

  // Blips
  for (const e of entries) {
    svg += `<g class="blip" transform="translate(${e.x}, ${e.y})">`
    if (e.moved === 1) {
      // Triangle up
      const s = circleRadius + 2
      svg += `<path d="M 0 ${-s} L ${s} ${s} L ${-s} ${s} Z" fill="${quadrantColor}"/>`
    } else if (e.moved === -1) {
      // Triangle down
      const s = circleRadius + 2
      svg += `<path d="M 0 ${s} L ${s} ${-s} L ${-s} ${-s} Z" fill="${quadrantColor}"/>`
    } else if (e.moved === 2) {
      // Star for 'new'
      const outer = circleRadius + 3
      const inner = Math.max(2, circleRadius - 6)
      const points: Array<[number, number]> = []
      for (let i = 0; i < 10; i++) {
        const angle = -Math.PI / 2 + (i * Math.PI) / 5 // start at top
        const r = i % 2 === 0 ? outer : inner
        points.push([r * Math.cos(angle), r * Math.sin(angle)])
      }
      const d = `M ${points.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`
      svg += `<path d="${d}" fill="${quadrantColor}"/>`
    } else {
      // Default circle
      svg += `<circle cx="0" cy="0" r="${circleRadius}" fill="${quadrantColor}"/>`
    }
    // Shift number towards base edge for triangles so it looks optically centered
    const textY =
      e.moved === 1
        ? Math.round(circleRadius * 0.3) // up: move down towards base
        : e.moved === -1
          ? -Math.round(circleRadius * 0.3) // down: move up towards base
          : 0
    svg += `<text x="0" y="${textY}" text-anchor="middle" dominant-baseline="middle" fill="${RADAR_COLORS.circleEntryText}" font-family="Arial, Helvetica" font-size="14" font-weight="bold">${e.id}</text>`
    svg += `</g>`
  }

  // No legend; radar-only

  svg += `</svg>`
  return svg
}

function generateFullRadarSvg(
  orderedSectionLabels: string[],
  ringEntriesByLabel: Record<string, RingEntries>
): string {
  // Map section labels to quadrants (matching the main radar order)
  // Quadrant 0=Platforms (bottom-right), 1=Tools (bottom-left), 2=Languages (top-left), 3=Techniques (top-right)
  // ID assignment order follows CONFIG order: Languages (2) → Techniques (3) → Tools (1) → Platforms (0)
  const sectionToQuadrant: Record<string, number> = {}
  const quadrantOrder = [2, 3, 1, 0] // ID assignment order: Languages, Techniques, Tools, Platforms

  // Helper to match section label to quadrant
  const getQuadrantForLabel = (label: string): number | undefined => {
    const lower = label.toLowerCase()
    // Mapping from radar-data-extractor.ts (lines 49-62):
    // Quadrant 0: bottom-right (radial -0.5π to 0, factor_x: 1, factor_y: -1) = Platforms
    // Quadrant 1: bottom-left (radial -π to -0.5π, factor_x: -1, factor_y: -1) = Tools
    // Quadrant 2: top-left (radial 0.5π to π, factor_x: -1, factor_y: 1) = Languages & Frameworks
    // Quadrant 3: top-right (radial 0 to 0.5π, factor_x: 1, factor_y: 1) = Techniques
    if (lower.includes('language') || lower.includes('framework')) return 2
    if (lower.includes('technique')) return 3
    if (lower.includes('tool')) return 1
    if (lower.includes('platform')) return 0
    return undefined
  }

  for (const label of orderedSectionLabels) {
    const quadrant = getQuadrantForLabel(label)
    if (quadrant !== undefined) {
      sectionToQuadrant[label] = quadrant
    }
  }

  // Canvas setup (matching main radar dimensions)
  const canvasWidth = 1450
  const canvasHeight = 1000
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const gridColor = '#7a8397'

  // Ring radii (matching main radar)
  const rings = [
    { radius: 130, name: 'Adopt' },
    { radius: 220, name: 'Trial' },
    { radius: 310, name: 'Assess' },
    { radius: 400, name: 'Hold' }
  ]

  // Quadrant definitions (matching main radar)
  const quadrants = [
    { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 }, // 0: Languages & frameworks (top-right)
    { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 }, // 1: Techniques (top-left)
    { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 }, // 2: Tools (bottom-left)
    { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 } // 3: Platforms (bottom-right)
  ]

  // Deterministic RNG
  let seed = 42
  const rand = () => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }
  const randBetween = (min: number, max: number) => min + rand() * (max - min)
  const normalBetween = (min: number, max: number) =>
    min + (rand() + rand()) * 0.5 * (max - min)

  // Helper functions for positioning (matching main radar logic)
  const polar = (cartesian: { x: number; y: number }) => ({
    t: Math.atan2(cartesian.y, cartesian.x),
    r: Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y)
  })

  const cartesian = (polar: { t: number; r: number }) => ({
    x: polar.r * Math.cos(polar.t),
    y: polar.r * Math.sin(polar.t)
  })

  const boundedInterval = (value: number, min: number, max: number) => {
    const low = Math.min(min, max)
    const high = Math.max(min, max)
    return Math.min(Math.max(value, low), high)
  }

  const boundedRing = (
    polar: { t: number; r: number },
    rMin: number,
    rMax: number
  ) => ({
    t: polar.t,
    r: boundedInterval(polar.r, rMin, rMax)
  })

  const boundedBox = (
    point: { x: number; y: number },
    min: { x: number; y: number },
    max: { x: number; y: number }
  ) => ({
    x: boundedInterval(point.x, min.x, max.x),
    y: boundedInterval(point.y, min.y, max.y)
  })

  const segment = (quadrant: number, ring: number) => {
    const buffer = 25 // Increased buffer to keep circles away from edges
    const polarMin = {
      t: quadrants[quadrant].radial_min * Math.PI,
      r: ring === 0 ? 30 : rings[ring - 1].radius
    }
    const polarMax = {
      t: quadrants[quadrant].radial_max * Math.PI,
      r: rings[ring].radius
    }
    const cartesianMin = {
      x: buffer * quadrants[quadrant].factor_x,
      y: buffer * quadrants[quadrant].factor_y
    }
    const cartesianMax = {
      x: rings[3].radius * quadrants[quadrant].factor_x,
      y: rings[3].radius * quadrants[quadrant].factor_y
    }
    return {
      clipx: (d: { x: number; y: number }) => {
        const c = boundedBox(d, cartesianMin, cartesianMax)
        const p = boundedRing(
          polar(c),
          polarMin.r + buffer,
          polarMax.r - buffer
        )
        d.x = cartesian(p).x
        return d.x
      },
      clipy: (d: { x: number; y: number }) => {
        const c = boundedBox(d, cartesianMin, cartesianMax)
        const p = boundedRing(
          polar(c),
          polarMin.r + buffer,
          polarMax.r - buffer
        )
        d.y = cartesian(p).y
        return d.y
      },
      random: () => {
        return cartesian({
          t: randBetween(polarMin.t + 0.05, polarMax.t - 0.05), // Add angular buffer
          r: normalBetween(polarMin.r + buffer, polarMax.r - buffer)
        })
      }
    }
  }

  type Entry = {
    id: number
    label: string
    quadrant: number
    ring: number
    x: number
    y: number
    color: string
    moved?: number
    documentOrder?: number
  }

  const entries: Entry[] = []
  const ringOrder: Array<keyof RingEntries> = [
    'adopt',
    'trial',
    'assess',
    'hold'
  ]

  // Build entries from all sections, preserving document order
  // Track document order within each quadrant/ring combination
  const documentOrderMap = new Map<string, number>()
  let globalDocOrder = 0

  for (const label of orderedSectionLabels) {
    const quadrant = sectionToQuadrant[label]
    if (quadrant === undefined) continue

    const ringEntries = ringEntriesByLabel[label]
    if (!ringEntries) continue

    let quadrantColor = '#d97706'
    try {
      quadrantColor = getQuadrantColor(label)
    } catch {}

    for (let ring = 0; ring < ringOrder.length; ring++) {
      const items = ringEntries[ringOrder[ring]]
      for (const item of items) {
        const key = `${quadrant}-${ring}-${item.label}`
        documentOrderMap.set(key, globalDocOrder++)
        const seg = segment(quadrant, ring)
        const point = seg.random()
        entries.push({
          id: 0, // Will be assigned later
          label: item.label,
          quadrant,
          ring,
          x: point.x,
          y: point.y,
          color: quadrantColor,
          moved: item.moved,
          documentOrder: documentOrderMap.get(key) ?? 0
        })
      }
    }
  }

  // Refine positions using d3-force collision (match browser radar behaviour)
  try {
    forceSimulation(entries as any)
      .velocityDecay(0.19)
      .force('collision', forceCollide(18).strength(0.95))
      .tick(200)
      .stop()
  } catch {}

  // After collision, snap every blip back inside its segment using segment's clipx/clipy
  // This matches the browser radar's approach exactly
  for (const e of entries) {
    const seg = segment(e.quadrant, e.ring)
    seg.clipx(e)
    seg.clipy(e)
  }

  // Assign IDs in the same order as main radar (quadrants 2,3,1,0)
  // Sort by documentOrder to preserve MDX file order
  let nextId = 1
  for (const quadrant of quadrantOrder) {
    for (let ring = 0; ring < 4; ring++) {
      const quadrantEntries = entries.filter(
        (e) => e.quadrant === quadrant && e.ring === ring
      )
      // Sort by documentOrder to preserve original MDX order
      quadrantEntries.sort(
        (a, b) => (a.documentOrder ?? 0) - (b.documentOrder ?? 0)
      )
      for (const entry of quadrantEntries) {
        entry.id = nextId++
      }
    }
  }

  // Generate SVG with width 100% to fill container; viewBox handles aspect ratio
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 ${canvasWidth} ${canvasHeight}" preserveAspectRatio="xMidYMid meet" style="overflow: visible;">`

  // Background
  svg += `<rect width="${canvasWidth}" height="${canvasHeight}" fill="transparent"/>`

  // Transform group for centered radar
  svg += `<g transform="translate(${centerX}, ${centerY})">`

  // Grid lines
  svg += `<line x1="0" y1="-400" x2="0" y2="400" stroke="${gridColor}" stroke-width="1"/>`
  svg += `<line x1="-400" y1="0" x2="400" y2="0" stroke="${gridColor}" stroke-width="1"/>`

  // Draw rings + ring labels (ADOPT / TRIAL / ASSESS / HOLD)
  for (const ring of rings) {
    svg += `<circle cx="0" cy="0" r="${ring.radius}" fill="none" stroke="${gridColor}" stroke-width="1"/>`
    // Lighter gray (#cbd5e1) for better visibility in PDF
    svg += `<text x="0" y="${-ring.radius + 62}" text-anchor="middle" dominant-baseline="central" fill="#cbd5e1" font-family="Arial, Helvetica" font-size="36" font-weight="bold" opacity="1">${ring.name.toUpperCase()}</text>`
  }

  // Draw blips
  // Visual constants matching radar-generation.ts
  const circleRadius = 12

  for (const e of entries) {
    svg += `<g class="blip" transform="translate(${e.x}, ${e.y})">`
    if (e.moved === 1) {
      // Triangle up: M -11,5 11,5 0,-13 z
      svg += `<path d="M -11,5 L 11,5 L 0,-13 Z" fill="${e.color}"/>`
    } else if (e.moved === -1) {
      // Triangle down: M -11,-5 11,-5 0,13 z
      svg += `<path d="M -11,-5 L 11,-5 L 0,13 Z" fill="${e.color}"/>`
    } else if (e.moved === 2) {
      // Star: D3 symbolStar size 200 approximation
      const starPath =
        'M 0,-11.227 L 2.939,-3.695 L 10.676,-3.695 L 4.416,0.853 L 6.807,8.227 L 0,3.695 L -6.807,8.227 L -4.416,0.853 L -10.676,-3.695 L -2.939,-3.695 Z'
      svg += `<path d="${starPath}" fill="${e.color}"/>`
    } else {
      // Default circle
      svg += `<circle cx="0" cy="0" r="${circleRadius}" fill="${e.color}"/>`
    }

    // Number text
    const blipText = e.id.toString()
    const fontSize = blipText.length > 2 ? '8px' : '9px'
    // radar-generation.ts uses y=3 for all shapes
    svg += `<text x="0" y="3" text-anchor="middle" fill="${RADAR_COLORS.circleEntryText}" font-family="Arial, Helvetica" font-size="${fontSize}" font-weight="bold" pointer-events="none" user-select="none">${blipText}</text>`
    svg += `</g>`
  }

  // Quadrant labels at top and bottom edges of the radar
  // Spread horizontally (space-between effect) at the extremes of each quadrant
  const maxRadius = 400
  const labelOffset = 50 // Distance beyond the radar edge
  const quadrantLabels = [
    {
      quadrant: 0,
      label: 'Platforms',
      x: maxRadius - 80,
      y: maxRadius + labelOffset,
      anchor: 'middle'
    }, // bottom-right (moved left)
    {
      quadrant: 1,
      label: 'Tools',
      x: -maxRadius + 80,
      y: maxRadius + labelOffset,
      anchor: 'middle'
    }, // bottom-left (moved right)
    {
      quadrant: 2,
      label: 'Languages & Frameworks',
      x: -maxRadius + 120,
      y: -(maxRadius + labelOffset),
      anchor: 'middle'
    }, // top-left (adjusted x to prevent cutoff)
    {
      quadrant: 3,
      label: 'Techniques',
      x: maxRadius - 80,
      y: -(maxRadius + labelOffset),
      anchor: 'middle'
    } // top-right (moved left)
  ]

  for (const ql of quadrantLabels) {
    let color = '#d97706'
    try {
      // Find the section label that matches this quadrant
      for (const label of orderedSectionLabels) {
        const q = sectionToQuadrant[label]
        if (q === ql.quadrant) {
          color = getQuadrantColor(label)
          break
        }
      }
    } catch {}
    svg += `<text x="${ql.x}" y="${ql.y}" text-anchor="${ql.anchor}" dominant-baseline="middle" fill="${color}" font-family="Arial, Helvetica" font-size="24" font-weight="bold">${ql.label.toUpperCase()}</text>`
  }

  svg += `</g>` // Close transform group

  // Legend at bottom center
  const legendY = centerY + 550 // Position below the radar (moved down from 450)
  const legendItemSpacing = 140 // Space between legend items

  // Approximate text widths (icon + spacing + text):
  // "No change" ≈ 70px, "Moved up" ≈ 70px, "Moved down" ≈ 85px, "New entry" ≈ 75px
  // Total width ≈ 300px + 3 gaps of 140px = 720px
  const totalLegendWidth = legendItemSpacing * 3 + 300
  const legendStartX = centerX - totalLegendWidth / 2

  // Legend group
  svg += `<g id="legend">`

  // Circle - no change
  svg += `<g transform="translate(${legendStartX}, ${legendY})">`
  svg += `<circle cx="0" cy="0" r="8" fill="#6b7280"/>`
  svg += `<text x="15" y="0" text-anchor="start" dominant-baseline="middle" fill="#6b7280" font-family="Arial, Helvetica" font-size="12" font-weight="normal">No change</text>`
  svg += `</g>`

  // Triangle up - moved up
  svg += `<g transform="translate(${legendStartX + legendItemSpacing + 70}, ${legendY})">`
  svg += `<path d="M -8,4 L 8,4 L 0,-10 Z" fill="#6b7280"/>`
  svg += `<text x="15" y="0" text-anchor="start" dominant-baseline="middle" fill="#6b7280" font-family="Arial, Helvetica" font-size="12" font-weight="normal">Moved up</text>`
  svg += `</g>`

  // Triangle down - moved down
  svg += `<g transform="translate(${legendStartX + legendItemSpacing * 2 + 140}, ${legendY})">`
  svg += `<path d="M -8,-4 L 8,-4 L 0,10 Z" fill="#6b7280"/>`
  svg += `<text x="15" y="0" text-anchor="start" dominant-baseline="middle" fill="#6b7280" font-family="Arial, Helvetica" font-size="12" font-weight="normal">Moved down</text>`
  svg += `</g>`

  // Star - new entry
  svg += `<g transform="translate(${legendStartX + legendItemSpacing * 3 + 225}, ${legendY})">`
  const legendStarPath =
    'M 0,-8 L 2.1,-2.6 L 7.6,-2.6 L 3.1,0.6 L 4.8,5.9 L 0,2.6 L -4.8,5.9 L -3.1,0.6 L -7.6,-2.6 L -2.1,-2.6 Z'
  svg += `<path d="${legendStarPath}" fill="#6b7280"/>`
  svg += `<text x="15" y="0" text-anchor="start" dominant-baseline="middle" fill="#6b7280" font-family="Arial, Helvetica" font-size="12" font-weight="normal">New entry</text>`
  svg += `</g>`

  svg += `</g>` // Close legend group

  svg += `</svg>`
  return svg
}

async function main() {
  const projectRoot = process.cwd()
  const cfg = await loadConfig(projectRoot)
  const outPath = resolve(
    join(projectRoot, cfg.output?.radarHtmlPath ?? 'templates/radar.html')
  )
  const stylesHref = cfg.output?.stylesHref ?? 'styles.css'

  const head = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cfg.title ?? 'JUXT AI Radar'}</title>
  <link rel="stylesheet" href="${stylesHref}">
</head>
<body>
`
  const tail = `
</body>
</html>
`

  const parts: string[] = []
  // Cover (template is required)
  parts.push(
    await buildCoverFromTemplate(
      projectRoot,
      cfg.coverTemplatePath as string,
      cfg
    )
  )

  // First pass: Collect all ring entries from MDX sections
  const fromRoot = cfg.sourceRoot
  const mdxSectionLabelsInOrder: string[] = []
  const ringEntriesByLabel: Record<string, RingEntries> = {}
  for (const section of cfg.sections) {
    // Only process MDX sections (skip HTML sections for data collection)
    if ('dir' in section) {
      const mdxPath = resolve(
        join(projectRoot, fromRoot, section.dir, 'index.mdx')
      )
      const raw = await readFile(mdxPath, 'utf8')
      const mdast: MdAst = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(remarkMdx)
        .use(remarkGfm)
        .parse(raw)
      const ringEntries = extractRingEntries(mdast)
      ringEntriesByLabel[section.label] = ringEntries
      mdxSectionLabelsInOrder.push(section.label)
    }
  }

  // Build radar-at-a-glance template with all collected data (non-optional, baked in)
  const glanceTemplatePath = 'templates/_internal/radar-at-a-glance.html'
  const glanceTemplateAbs = resolve(join(projectRoot, glanceTemplatePath))
  let glanceHtml: string | null = null
  if (existsSync(glanceTemplateAbs)) {
    glanceHtml = await buildAtAGlanceFromTemplate(
      projectRoot,
      glanceTemplatePath,
      mdxSectionLabelsInOrder,
      ringEntriesByLabel
    )
  }

  // Build full radar template
  const fullRadarTemplatePath = 'templates/_internal/full-radar.html'
  const fullRadarTemplateAbs = resolve(join(projectRoot, fullRadarTemplatePath))
  let fullRadarHtml: string | null = null
  if (existsSync(fullRadarTemplateAbs)) {
    fullRadarHtml = await buildFullRadarFromTemplate(
      projectRoot,
      fullRadarTemplatePath,
      mdxSectionLabelsInOrder,
      ringEntriesByLabel
    )
  }

  // Calculate starting IDs for each section following the CONFIG SECTION ORDER
  // This matches how radar-at-a-glance numbers entries: Languages → Techniques → Tools → Platforms
  const quadrantStartingIds: Record<string, number> = {}
  let currentId = 1

  for (const label of mdxSectionLabelsInOrder) {
    quadrantStartingIds[label] = currentId
    const entries = ringEntriesByLabel[label]
    if (entries) {
      currentId += entries.adopt.length
      currentId += entries.trial.length
      currentId += entries.assess.length
      currentId += entries.hold.length
    }
  }

  // Second pass: Build pages and insert radar-at-a-glance before first category cover
  let hasInsertedGlance = false
  let hasInsertedFullRadar = false
  for (const section of cfg.sections) {
    // Raw HTML section injection support
    if ('htmlFile' in section) {
      const html = await maybeReadExtraHtml(projectRoot, section.htmlFile)
      // Clear running label inline at the start of the next wrapped page to avoid blank pages
      parts.push(
        wrapContentPage(`<div class="category-top-label-clear"></div>\n${html}`)
      )
      continue
    }

    const pagination = {
      pageTargetWordCount: cfg.pagination?.pageTargetWordCount ?? 1000,
      smallSubsectionMaxWords: cfg.pagination?.smallSubsectionMaxWords ?? 150,
      minWordsOnCurrentPageForLongSubsection:
        cfg.pagination?.minWordsOnCurrentPageForLongSubsection ?? 50
    }

    // Re-parse MDX to get content (ring entries already collected above)
    const mdxPath = resolve(
      join(projectRoot, fromRoot, section.dir, 'index.mdx')
    )
    const raw = await readFile(mdxPath, 'utf8')
    const mdast: MdAst = await unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkMdx)
      .use(remarkGfm)
      .parse(raw)
    const ringEntries = ringEntriesByLabel[section.label]
    const cleaned = stripMdxAndAdjustHeadings(mdast)
    const introNodes = extractIntroParagraph(cleaned)
    const introHtml = introNodes.length
      ? await renderNodesToHtml(introNodes)
      : ''
    // Resolve the section/quadrant color for heading styling
    let sectionColor = '#d97706'
    try {
      sectionColor = getQuadrantColor(section.label)
    } catch {}

    const { dividerHtml, pagesHtml } = await generateForSection(
      projectRoot,
      fromRoot,
      section,
      pagination,
      sectionColor
    )

    // Insert radar-at-a-glance before the first category cover
    if (glanceHtml && !hasInsertedGlance && cfg.categoryCoverTemplatePath) {
      parts.push(glanceHtml)
      hasInsertedGlance = true
      // Insert full radar page right after radar-at-a-glance
      if (fullRadarHtml && !hasInsertedFullRadar) {
        parts.push(fullRadarHtml)
        hasInsertedFullRadar = true
      }
    }

    // If a category cover template is configured, prefer it over the default divider
    if (cfg.categoryCoverTemplatePath) {
      const startingId = quadrantStartingIds[section.label] || 1
      const cover = await buildCategoryCoverFromTemplate(
        projectRoot,
        cfg.categoryCoverTemplatePath,
        section.label,
        introHtml,
        ringEntries,
        startingId
      )
      parts.push(cover)
    } else {
      if (section.divider !== false) {
        parts.push(dividerHtml)
      }
    }
    parts.push(...pagesHtml)
  }

  const html = head + parts.join('\n') + tail

  // Ensure output directory exists
  const outDir = dirname(outPath)
  await mkdir(outDir, { recursive: true })

  // Write HTML file
  await writeFile(outPath, html, 'utf8')

  // Copy styles.css to output directory
  const stylesSourcePath = resolve(join(projectRoot, 'templates', 'styles.css'))
  const stylesDestPath = join(outDir, stylesHref)
  await copyFile(stylesSourcePath, stylesDestPath)

  const sizeKb =
    (await (await import('node:fs')).promises.stat(outPath)).size / 1024
  process.stdout.write(
    `✅ Built ${outPath} (${sizeKb.toFixed(1)} KB) — ready for PDF generation\n`
  )
}

main().catch((err) => {
  console.error('❌ Error generating radar HTML:', err)
  process.exit(1)
})
