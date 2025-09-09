import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { RADAR_COLORS, getQuadrantColor } from './radar-colors'

// Function to recursively find all markdown files in a directory
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = []

  try {
    const items = readdirSync(dir)

    for (const item of items) {
      const fullPath = join(dir, item)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...findMarkdownFiles(fullPath))
      } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.warn(`Could not read directory ${dir}:`, error)
  }

  return files
}

// Function to generate base URL from file path
function generateBaseUrl(filePath: string): string {
  const relativePath = filePath.replace(
    join(process.cwd(), 'src/pages/ai-radar/'),
    ''
  )
  const pathWithoutExt = relativePath.replace(/\.(mdx|md)$/, '')
  return `/ai-radar/${pathWithoutExt}`
}

// Simple slugify function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Convert quadrant label to quadrant number (0,1,2,3 counting clockwise from bottom right)
function getQuadrantForSegment(quadrant: string): number {
  switch (quadrant) {
    case 'techniques':
      return 3 // Top Right
    case 'languages-frameworks':
      return 2 // Top Left
    case 'tools':
      return 1 // Bottom Left
    case 'platforms':
      return 0 // Bottom Right
    default:
      throw new Error(`Invalid quadrant: ${quadrant}`)
  }
}

// Convert ring label to ring number (0,1,2,3 starting from inside)
function getRingForAdoptionLevel(ring: string): number {
  switch (ring) {
    case 'adopt':
      return 0 // INNER
    case 'trial':
      return 1 // SECOND
    case 'assess':
      return 2 // THIRD
    case 'hold':
      return 3 // OUTER
    default:
      throw new Error(`Invalid ring: ${ring}`)
  }
}

// Convert change string to numeric value for Zalando radar
function getMovedValue(change: string | number | undefined): number {
  if (typeof change === 'number') return change
  if (typeof change === 'string') {
    switch (change.toLowerCase()) {
      case 'up':
        return 1
      case 'down':
        return -1
      case 'new':
        return 2
      default:
        return 0
    }
  }
  return 0 // Default to no change
}

// Infer quadrant from file path by reading parent article
function inferQuadrantFromFilePath(filePath: string): string {
  const pathParts = filePath.split('/')
  const segmentIndex = pathParts.findIndex((part) =>
    ['techniques', 'languages-frameworks', 'tools', 'platforms'].includes(part)
  )

  if (segmentIndex === -1) return 'techniques' // fallback

  const segment = pathParts[segmentIndex]

  // Read the parent article to get the title
  const parentArticlePath = join(
    process.cwd(),
    'src/pages/ai-radar',
    segment,
    'index.mdx'
  )

  try {
    const parentContent = readFileSync(parentArticlePath, 'utf-8')
    const titleMatch = parentContent.match(/title:\s*['"]([^'"]+)['"]/)

    if (titleMatch) {
      const title = titleMatch[1]

      // Map title to quadrant
      if (title.includes('Techniques')) return 'techniques'
      if (title.includes('Languages') || title.includes('Frameworks'))
        return 'languages-frameworks'
      if (title.includes('Tools')) return 'tools'
      if (title.includes('Platforms')) return 'platforms'
    }
  } catch (error) {
    console.warn(`Failed to read parent article for ${filePath}:`, error)
  }

  // Fallback to segment name
  return segment
}

// Parse radar entries from markdown content using data-label and data-ring attributes
function parseRadarFromMarkdown(
  content: string,
  baseUrl: string,
  filePath: string
) {
  const entries: any[] = []

  // Find all divs with data-radar attribute and data-label/data-ring attributes
  const radarDivRegex =
    /<div\s+data-radar\s+data-label=['"]([^'"]+)['"]\s+data-ring=['"]([^'"]+)['"](?:\s+data-change=['"]([^'"]+)['"])?\s*\/>/g
  let radarMatch

  // Store all matches with their positions to sort them by order of appearance
  const matches = []

  while ((radarMatch = radarDivRegex.exec(content)) !== null) {
    matches.push({ match: radarMatch, index: radarMatch.index })
  }

  // Sort matches by their position in the document to maintain order
  matches.sort((a, b) => a.index - b.index)

  // Process matches in order of appearance
  for (const { match } of matches) {
    const label = match[1]
    const ring = match[2]
    const change = match[3] // Optional change attribute
    const metaIndex = match.index

    // Find the next heading after this metadata div
    const contentAfterMeta = content.substring(metaIndex)
    const headingMatch = contentAfterMeta.match(/\n## (.+)$/m)

    if (!headingMatch) {
      console.warn('No heading found after radar div')
      continue
    }

    const sectionName = headingMatch[1].trim()

    // Skip the main title section if it exists
    if (
      sectionName.toLowerCase().includes('adopt') ||
      sectionName.toLowerCase().includes('trial') ||
      sectionName.toLowerCase().includes('assess') ||
      sectionName.toLowerCase().includes('hold')
    ) {
      continue
    }

    // Infer quadrant from file structure
    const quadrant = inferQuadrantFromFilePath(filePath)

    // Convert to radar format
    const entry = {
      label: label || sectionName,
      quadrant: getQuadrantForSegment(quadrant),
      ring: getRingForAdoptionLevel(ring),
      moved: getMovedValue(change), // Map string values to numeric
      link: `${baseUrl}#${slugify(sectionName)}`,
      active: true
    }

    entries.push(entry)
  }

  return entries
}

// Main function to extract all radar data
export function extractAllRadarData() {
  const aiRadarDir = join(process.cwd(), 'src/pages/ai-radar')
  const allMarkdownFiles = findMarkdownFiles(aiRadarDir).sort() // Sort files for predictable order
  const allEntries: any[] = []

  console.log(
    `Found ${allMarkdownFiles.length} markdown files in ai-radar directory`
  )

  for (const filePath of allMarkdownFiles) {
    try {
      // Read the file content
      const content = readFileSync(filePath, 'utf-8')

      // Generate base URL for this file
      const baseUrl = generateBaseUrl(filePath)

      // Parse the markdown content to extract radar entries
      const entries = parseRadarFromMarkdown(content, baseUrl, filePath)

      if (entries.length > 0) {
        allEntries.push(...entries)
      }
    } catch (error) {
      console.warn(`Failed to process file ${filePath}:`, error)
    }
  }

  console.log(`Total radar entries collected: ${allEntries.length}`)

  return {
    quadrants: [
      {
        name: 'Platforms',
        link: '/ai-radar/platforms',
        color: RADAR_COLORS.platforms
      },
      { name: 'Tools', link: '/ai-radar/tools', color: RADAR_COLORS.tools },
      {
        name: 'Languages & Frameworks',
        link: '/ai-radar/languages-frameworks',
        color: RADAR_COLORS.languagesFrameworks
      },
      {
        name: 'Techniques',
        link: '/ai-radar/techniques',
        color: RADAR_COLORS.techniques
      }
    ],
    rings: [
      { name: 'ADOPT' },
      { name: 'TRIAL' },
      { name: 'ASSESS' },
      { name: 'HOLD' }
    ],
    entries: allEntries
  }
}

// Function to filter data for a specific quadrant
export function extractQuadrantData(quadrantName: string) {
  const allData = extractAllRadarData()

  // Map quadrant names to numbers for filtering
  const quadrantNumber = getQuadrantForSegment(quadrantName)

  // Filter entries for this quadrant
  const quadrantEntries = allData.entries.filter(
    (entry) => entry.quadrant === quadrantNumber
  )

  // Re-assign sequential IDs for single quadrant display
  const entriesWithIds = quadrantEntries.map((entry, index) => ({
    ...entry,
    id: index + 1
  }))

  // Get quadrant display name
  const quadrantDisplayName =
    quadrantName === 'languages-frameworks'
      ? 'Languages & Frameworks'
      : quadrantName.charAt(0).toUpperCase() + quadrantName.slice(1)

  return {
    quadrantName: quadrantDisplayName,
    quadrantColor: getQuadrantColor(quadrantName),
    rings: [
      { name: 'Adopt' },
      { name: 'Trial' },
      { name: 'Assess' },
      { name: 'Hold' }
    ],
    entries: entriesWithIds
  }
}
