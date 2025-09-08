// AI Radar Colors - Single source of truth for all radar visualizations
const baseColors = {
  // === QUADRANT COLORS ===
  platforms: '#F09758',           // green-600
  tools: '#CA4527',              // cyan-600
  languagesFrameworks: '#E8AA41', // yellow-600
  techniques: '#F26A24',          // red-600
  
  // === RADAR STRUCTURE COLORS ===
  // Grid and background colors
  radarBackground: '#ffffff',     // white
  radarGrid: '#7a8397',          // grid lines (used in both light and dark mode)
  
  
  // === TEXT COLORS ===
  // Light mode text colors
  lightRingText: '#6b7280',      // gray-500 - for ring labels
  lightMainText: '#374151',      // gray-700 - for main text/entries
  
  // Dark mode text colors  
  darkRingText: '#9ca3af',       // gray-400 - for ring labels
  darkMainText: '#d1d5db',       // gray-300 - for main text/entries
  
  // === TOOLTIP COLORS ===
  // Light mode tooltip
  lightTooltipBg: '#f9fafb',     // gray-50
  lightTooltipText: '#374151',   // gray-700
  lightTooltipBorder: '#d1d5db', // gray-300
  
  // Dark mode tooltip
  darkTooltipBg: '#374151',      // gray-700
  darkTooltipText: '#f9fafb',    // gray-50
  darkTooltipBorder: '#6b7280',  // gray-500
  
  // === ENTRY COLORS ===
  circleEntryText: '#ffffff'     // white text on colored circles
} as const

export const RADAR_COLORS = {
  ...baseColors,
  
  // === BANNER GRADIENTS ===
  mainRadarBanner: `linear-gradient(to right, ${baseColors.platforms}, ${baseColors.tools}, ${baseColors.languagesFrameworks}, ${baseColors.techniques})`,
  
  // === THEME-AWARE COLOR GETTERS ===
  // These will be used by helper functions
} as const

// Helper function to get quadrant color based on quadrant name
export function getQuadrantColor(quadrantName: string): string {
  switch (quadrantName.toLowerCase()) {
    case 'platforms':
      return RADAR_COLORS.platforms
    case 'tools':
      return RADAR_COLORS.tools
    case 'languages & frameworks':
    case 'languages-frameworks':
    case 'languagesframeworks':
      return RADAR_COLORS.languagesFrameworks
    case 'techniques':
      return RADAR_COLORS.techniques
    default:
      throw new Error(`Unknown quadrant name: ${quadrantName}`)
  }
}

// Helper function to get quadrant color from path (for banner logic)
export function getQuadrantColorFromPath(pathname: string): string {
  const pathWithoutPrefix = pathname.replace(/^\/ai-radar\//, '')
  const pathParts = pathWithoutPrefix.split('/')
  
  if (pathParts.length >= 1) {
    const quadrantName = pathParts[0]
    return getQuadrantColor(quadrantName)
  }
  
  throw new Error(`Cannot determine quadrant from path: ${pathname}`)
}


// Theme-aware color helpers (simplified - only used server-side)
export function getThemeColors(isDarkMode: boolean) {
  return {
    ringTextColor: isDarkMode ? RADAR_COLORS.darkRingText : RADAR_COLORS.lightRingText,
    mainTextColor: isDarkMode ? RADAR_COLORS.darkMainText : RADAR_COLORS.lightMainText
  }
}

export function getTooltipColors(isDarkMode: boolean) {
  return {
    background: isDarkMode ? RADAR_COLORS.darkTooltipBg : RADAR_COLORS.lightTooltipBg,
    text: isDarkMode ? RADAR_COLORS.darkTooltipText : RADAR_COLORS.lightTooltipText,
    border: isDarkMode ? RADAR_COLORS.darkTooltipBorder : RADAR_COLORS.lightTooltipBorder
  }
}

export function getRadarStructureColors() {
  return {
    background: RADAR_COLORS.radarBackground,
    grid: RADAR_COLORS.radarGrid
  }
}


