#!/usr/bin/env node

import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import MarkdownIt from 'markdown-it'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const AI_RADAR_DIR = path.join(__dirname, '../src/pages/ai-radar')
const OUTPUT_HTML = path.join(__dirname, '../ai-radar-complete.html')

// Initialize markdown parser
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// Track processed files to avoid infinite loops
const processedFiles = new Set()
const articleContent = new Map()

/**
 * Extract article content from markdown file, ignoring frontmatter and headers
 */
async function extractArticleContent(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Remove frontmatter (everything between --- and ---)
    let cleanContent = content.replace(/^---[\s\S]*?---\s*/m, '')
    
    // Remove layout imports and other metadata
    cleanContent = cleanContent.replace(/^import.*$/gm, '')
    cleanContent = cleanContent.replace(/^export.*$/gm, '')
    
    // Remove data-radar divs (these are metadata, not content)
    cleanContent = cleanContent.replace(/<div\s+data-radar[^>]*\/>/g, '')
    
    // Remove empty lines at the beginning
    cleanContent = cleanContent.replace(/^\s*\n/g, '')
    
    return cleanContent.trim()
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message)
    return ''
  }
}

/**
 * Style adoption level terms consistently
 */
function styleAdoptionLevels(content) {
  // No styling for adoption level terms - return content as-is
  return content
}

/**
 * Add hyperlinks to all headings and replace internal ai-radar links
 */
function processContentLinks(content, currentFolderPath) {
  // Replace internal ai-radar links with anchor links
  content = content.replace(
    /href="\/ai-radar\/([^"]+)"/g,
    (match, linkPath) => {
      // Convert path to anchor format and remove trailing dash
      const anchor = linkPath.replace(/\//g, '-').replace(/\.mdx?$/, '').replace(/-$/, '')
      return `href="#${anchor}"`
    }
  )
  
  // Add hyperlinks to all headings (h1, h2, h3, h4, h5, h6)
  // Use a more specific regex to avoid nested replacements
  content = content.replace(
    /<(h[1-6])([^>]*)>([^<]+)<\/\1>/g,
    (match, tag, attributes, headingText) => {
      // Create unique anchor by prefixing with folder path
      let anchor = headingText
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      // Prefix with folder path to make IDs unique
      if (currentFolderPath && currentFolderPath !== '.') {
        const folderPrefix = currentFolderPath.replace(/\//g, '-')
        anchor = `${folderPrefix}-${anchor}`
      }
      
      return `<${tag}${attributes} id="${anchor}"><a href="#${anchor}" class="heading-link">${headingText}</a></${tag}>`
    }
  )
  
  return content
}

/**
 * Extract internal links from markdown content
 */
function extractInternalLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const links = []
  let match
  
  while ((match = linkRegex.exec(content)) !== null) {
    const [fullMatch, linkText, linkUrl] = match
    
    // Only process internal ai-radar links
    if (linkUrl.startsWith('/ai-radar/') || linkUrl.startsWith('ai-radar/')) {
      links.push({
        text: linkText,
        url: linkUrl,
        fullMatch
      })
    }
  }
  
  return links
}

/**
 * Resolve relative path to absolute file path
 */
function resolveLinkPath(linkUrl, currentFilePath) {
  if (linkUrl.startsWith('/ai-radar/')) {
    // Absolute path from root - remove trailing slash and try both with and without index
    const cleanUrl = linkUrl.replace(/\/$/, '')
    const basePath = path.join(__dirname, '../src/pages', cleanUrl)
    
    // Try the path as-is first
    if (fsSync.existsSync(basePath + '.mdx')) {
      return basePath + '.mdx'
    }
    if (fsSync.existsSync(basePath + '.md')) {
      return basePath + '.md'
    }
    
    // Try with index.mdx/index.md
    if (fsSync.existsSync(path.join(basePath, 'index.mdx'))) {
      return path.join(basePath, 'index.mdx')
    }
    if (fsSync.existsSync(path.join(basePath, 'index.md'))) {
      return path.join(basePath, 'index.md')
    }
    
    return null
  } else if (linkUrl.startsWith('ai-radar/')) {
    // Relative path
    const relativePath = linkUrl.replace('ai-radar/', '')
    return path.join(AI_RADAR_DIR, relativePath)
  } else if (linkUrl.startsWith('./') || linkUrl.startsWith('../')) {
    // Relative path from current file
    const currentDir = path.dirname(currentFilePath)
    return path.resolve(currentDir, linkUrl)
  }
  
  return null
}

/**
 * Process article to extract content and store it with metadata
 */
async function processArticle(filePath, fileType, folderPath) {
  if (processedFiles.has(filePath)) {
    return
  }
  
  processedFiles.add(filePath)
  console.log(`    📄 Processing: ${path.relative(AI_RADAR_DIR, filePath)} (${fileType})`)
  
  const content = await extractArticleContent(filePath)
  if (!content) return
  
  // Store the content with metadata for proper rendering
  articleContent.set(filePath, {
    content,
    type: fileType,
    folderPath,
    fileName: path.basename(filePath, path.extname(filePath))
  })
}

/**
 * Add linked content to articles
 */
async function addLinkedContent(filePath) {
  const content = articleContent.get(filePath)
  if (!content) return
  
  // Extract internal links
  const links = extractInternalLinks(content)
  if (links.length === 0) return
  
  console.log(`  Adding linked content to ${path.relative(AI_RADAR_DIR, filePath)}`)
  
  // Build the content with linked articles at the end
  let resolvedContent = content
  
  // Add linked content at the very end of the article
  for (const link of links) {
    const resolvedPath = resolveLinkPath(link.url, filePath)
    
    if (resolvedPath && await fs.access(resolvedPath).then(() => true).catch(() => false)) {
      // Check if it's a markdown file
      if (resolvedPath.endsWith('.mdx') || resolvedPath.endsWith('.md')) {
        const linkedContent = articleContent.get(resolvedPath)
        if (linkedContent) {
          // Add the linked content at the very end
          resolvedContent += `\n\n---\n\n<div class="linked-article-header"><strong>Linked Article: ${link.text}</strong></div>\n\n<div class="linked-article-content">${linkedContent}</div>\n\n---\n\n`
        }
      }
    }
  }
  
  // Update the stored content
  articleContent.set(filePath, resolvedContent)
}

/**
 * Find all markdown files organized by folder structure
 * Returns a Map where keys are folder paths and values are ordered file arrays
 */
async function findMarkdownFiles(dir) {
  const folderStructure = new Map()
  
  async function scanDirectory(currentDir, relativePath = '') {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    const folderFiles = []
    
    // First, find index.mdx
    const indexFile = entries.find(entry => 
      entry.isFile() && 
      (entry.name === 'index.mdx' || entry.name === 'index.md')
    )
    
    if (indexFile) {
      folderFiles.push({
        path: path.join(currentDir, indexFile.name),
        relativePath: path.join(relativePath, indexFile.name),
        type: 'index'
      })
    }
    
    // Then find adopt, trial, assess, hold files in order
    const order = ['adopt', 'trial', 'assess', 'hold']
    for (const fileName of order) {
      const file = entries.find(entry => 
        entry.isFile() && 
        (entry.name === `${fileName}.mdx` || entry.name === `${fileName}.md`)
      )
      
      if (file) {
        folderFiles.push({
          path: path.join(currentDir, file.name),
          relativePath: path.join(relativePath, file.name),
          type: fileName
        })
      }
    }
    
    if (folderFiles.length > 0) {
      folderStructure.set(relativePath || '.', folderFiles)
    }
    
    // Recursively scan subdirectories
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subRelativePath = path.join(relativePath, entry.name)
        await scanDirectory(path.join(currentDir, entry.name), subRelativePath)
      }
    }
  }
  
  await scanDirectory(dir)
  return folderStructure
}

/**
 * Generate HTML file from concatenated content with proper markdown parsing
 */
async function generateOutputFiles() {
  console.log('Generating HTML file...')
  
  // Combine all article content with proper folder structure and visual cues
  let allContent = ''
  let articleCount = 0
  let currentFolder = ''
  
  // Process files in the correct folder order to avoid duplicate headers
  const folderStructure = await findMarkdownFiles(AI_RADAR_DIR)
  
  for (const [folderPath, files] of folderStructure) {
    // Add folder separator if we're entering a new folder
    if (folderPath !== currentFolder) {
      if (currentFolder !== '') {
        allContent += '\n<hr class="folder-separator">\n'
      }
      currentFolder = folderPath
      
      // Add folder header
      const folderName = folderPath === '.' ? 'Main AI Radar' : folderPath.replace(/\//g, ' → ')
      const folderAnchor = folderPath === '.' ? 'main-ai-radar' : folderPath.replace(/\//g, '-')
      allContent += `\n<div class="folder-header">\n<h1 class="folder-title" id="${folderAnchor}"><a href="#${folderAnchor}" class="heading-link">${folderName}</a></h1>\n</div>\n\n`
    }
    
    // Process each file in the folder
    for (const fileInfo of files) {
      const filePath = fileInfo.path
      const storedContent = articleContent.get(filePath)
      if (!storedContent) continue
      
      // Convert the article content to HTML
      let articleHtml = md.render(storedContent.content)
      articleHtml = styleAdoptionLevels(articleHtml)
      articleHtml = processContentLinks(articleHtml, folderPath)
      
      // Skip adding headings for index files (they're redundant)
      if (fileInfo.type === 'index') {
        allContent += `\n<section class="article-section ${fileInfo.type}-section">\n\n${articleHtml}\n</section>\n\n`
      } else {
        // For adopt/trial/assess/hold files, add the heading with ID
        const fileName = path.basename(fileInfo.path, path.extname(fileInfo.path))
        const sectionId = `${folderPath === '.' ? 'main' : folderPath.replace(/\//g, '-')}-${fileName}`
        allContent += `\n<section class="article-section ${fileInfo.type}-section">\n<h3 class="sub-heading" id="${sectionId}">${fileName}</h3>\n\n${articleHtml}\n</section>\n\n`
      }
      articleCount++
    }
  }
  
  // Create the main HTML structure
  const htmlBody = `
    <div class="main-header">
      <h1>JUXT AI Technology Radar 2025</h1>
      <div class="meta-info">
        <strong>Generated on:</strong> ${new Date().toLocaleDateString()}
      </div>
    </div>
    
    ${allContent}
  `
  
  // Generate HTML file
  const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>JUXT AI Radar - Complete Documentation</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        line-height: 1.7;
        max-width: 1000px;
        margin: 0 auto;
        padding: 60px 30px;
        color: #1f2937;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        min-height: 100vh;
      }
      .container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 60px;
        border-radius: 24px;
        box-shadow: 
          0 25px 50px -12px rgba(0, 0, 0, 0.08),
          0 0 0 1px rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      h1 {
        color: #1e40af;
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 40px;
        font-size: 3em;
        font-weight: 700;
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
      }
      h2 {
        color: #1e40af;
        border-bottom: none;
        padding-bottom: 0;
        margin-top: 50px;
        margin-bottom: 25px;
        font-size: 2em;
        font-weight: 600;
        position: relative;
      }
      h2::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border-radius: 2px;
      }
      h3 {
        color: #374151;
        margin-top: 30px;
        margin-bottom: 20px;
        font-size: 1.5em;
        font-weight: 600;
      }
      h4, h5, h6 {
        color: #4b5563;
        margin-top: 25px;
        margin-bottom: 15px;
        font-weight: 500;
      }
      p {
        margin-bottom: 20px;
        text-align: left;
        color: #374151;
        font-size: 1.05em;
      }
      code {
        background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
        padding: 4px 8px;
        border-radius: 6px;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 0.9em;
        color: #1e40af;
        border: 1px solid rgba(59, 130, 246, 0.1);
      }
      pre {
        background: linear-gradient(135deg, #1e293b, #334155);
        color: #e2e8f0;
        padding: 25px;
        border-radius: 16px;
        overflow-x: auto;
        border: 1px solid rgba(59, 130, 246, 0.2);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        margin: 25px 0;
      }
      pre code {
        background: none;
        color: inherit;
        padding: 0;
        border: none;
      }
      blockquote {
        border-left: 4px solid #3b82f6;
        margin: 25px 0;
        padding: 20px 25px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
        border-radius: 0 16px 16px 0;
        color: #374151;
        position: relative;
      }
      blockquote::before {
        content: '"';
        font-size: 3em;
        color: rgba(59, 130, 246, 0.2);
        position: absolute;
        top: -10px;
        left: 15px;
        font-family: serif;
      }
      blockquote p {
        margin: 0;
      }
      a {
        color: #3b82f6;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.3s ease;
        font-weight: 500;
      }
      a:hover {
        border-bottom-color: #3b82f6;
        transform: translateY(-1px);
      }
      ul, ol {
        margin: 25px 0;
        padding-left: 30px;
      }
      li {
        margin-bottom: 12px;
        line-height: 1.6;
      }
      li strong {
        color: #1e40af;
        font-weight: 600;
      }
      strong {
        color: #1e40af;
        font-weight: 600;
      }
      em {
        color: #7c3aed;
        font-style: italic;
      }
      hr {
        border: none;
        border-top: 2px solid #e5e7eb;
        margin: 40px 0;
      }


      table {
        width: 100%;
        border-collapse: collapse;
        margin: 25px 0;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      }
      th, td {
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid rgba(59, 130, 246, 0.1);
      }
      th {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
        font-weight: 600;
        color: #1e40af;
        font-size: 1.05em;
      }
      tr:hover {
        background: rgba(59, 130, 246, 0.02);
        transform: scale(1.01);
        transition: all 0.2s ease;
      }
      .highlight {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        padding: 3px 6px;
        border-radius: 6px;
        border: 1px solid #f59e0b;
      }
      .note {
        background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        border: 1px solid #93c5fd;
        border-radius: 16px;
        padding: 20px;
        margin: 25px 0;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
      }
      .note::before {
        content: "💡 ";
        font-weight: bold;
        font-size: 1.2em;
      }
      .main-header {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        color: #1e2937;
        padding: 40px;
        border-radius: 16px;
        margin-bottom: 40px;
        border: 1px solid rgba(59, 130, 246, 0.1);
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .main-header h1 {
        color: #1e40af;
        border: none;
        margin: 0;
        padding: 0;
        font-size: 2.5em;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .main-header .meta-info {
        text-align: right;
        color: #64748b;
        font-size: 0.95em;
      }
      .main-header .meta-info strong {
        color: #475569;
        font-weight: 600;
      }

      /* Folder headers and separators */
      .folder-header {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
        padding: 30px;
        border-radius: 20px;
        margin: 40px 0 30px 0;
        border: 1px solid rgba(59, 130, 246, 0.1);
        position: relative;
        overflow: hidden;
      }
      .folder-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
      }
      .folder-title {
        color: #1e40af;
        margin: 0;
        font-size: 2.2em;
        border: none;
        padding: 0;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      .folder-separator {
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
        margin: 60px 0;
        opacity: 0.6;
      }
      
      /* Article section styling */
      .article-section {
        margin-bottom: 40px;
        padding: 25px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 16px;
        border: 1px solid rgba(59, 130, 246, 0.08);
        transition: all 0.3s ease;
      }
      .article-section:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(59, 130, 246, 0.15);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
      }
      .main-heading {
        color: #1e40af;
        border-bottom: none;
        padding-bottom: 0;
        margin-top: 0;
        margin-bottom: 25px;
        font-size: 1.8em;
        font-weight: 600;
      }
      .sub-heading {
        color: #1e40af;
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.5em;
        border-bottom: none;
        padding-bottom: 0;
        font-weight: 600;
        position: relative;
      }
      .sub-heading::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border-radius: 1px;
      }
      
      /* Make individual technology headings bigger */
      .sub-heading ~ h2,
      .sub-heading ~ h3,
      .sub-heading ~ h4,
      .sub-heading ~ h5,
      .sub-heading ~ h6 {
        font-size: 1.1em !important;
      }
      
      /* Heading links styling */
      .heading-link {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s ease;
      }
      .heading-link:hover {
        color: #3b82f6;
      }
      .heading-link::before {
        content: '#';
        opacity: 0;
        margin-right: 8px;
        color: #9ca3af;
        transition: opacity 0.2s ease;
      }
      .heading-link:hover::before {
        opacity: 1;
      }

    </style>
  </head>
  <body>
    <div class="container">
      ${htmlBody}
    </div>
  </body>
</html>`
  
  await fs.writeFile(OUTPUT_HTML, htmlContent, 'utf-8')
  console.log(`✅ HTML file generated: ${OUTPUT_HTML}`)
  console.log(`📊 Total articles processed: ${articleCount}`)
  console.log('\n💡 To convert to PDF:')
  console.log(`   - Open ${OUTPUT_HTML} in your browser and print to PDF`)
  console.log(`   - The HTML is now properly formatted with markdown parsing!`)
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting AI Radar PDF generation...')
    console.log(`📁 Scanning directory: ${AI_RADAR_DIR}`)
    
    // Find all markdown files organized by folder structure
    const folderStructure = await findMarkdownFiles(AI_RADAR_DIR)
    console.log(`📁 Found ${folderStructure.size} folders with content`)
    
    // Process files in folder order with visual cues
    console.log('\n📖 Processing articles by folder structure...')
    
    for (const [folderPath, files] of folderStructure) {
      console.log(`  📂 Processing folder: ${folderPath}`)
      
      for (const fileInfo of files) {
        await processArticle(fileInfo.path, fileInfo.type, folderPath)
      }
    }
    
    console.log(`\n📚 Processing complete. Processed ${articleContent.size} articles.`)
    
    // Generate HTML file
    await generateOutputFiles()
    
    console.log('\n🎉 All done!')
    
  } catch (error) {
    console.error('❌ Error during execution:', error)
    process.exit(1)
  }
}

// Run the script
main()
