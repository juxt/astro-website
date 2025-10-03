const baseColors = {
  // === QUADRANT COLORS ===
  platforms: '#F09758',           
  tools: '#CA4527',              
  languagesFrameworks: '#E8AA41',
  techniques: '#F26A24',         
  
  // === RADAR STRUCTURE COLORS ===
  radarBackground: '#ffffff',    
  radarGrid: '#7a8397',         
  
  
  // === TEXT COLORS ===
  lightRingText: '#6b7280',      
  lightMainText: '#374151',      
  
  darkRingText: '#9ca3af',       
  darkMainText: '#d1d5db',      
  
  // === TOOLTIP COLORS ===
  lightTooltipBg: '#f9fafb',    
  lightTooltipText: '#374151',  
  lightTooltipBorder: '#d1d5db', 
  
  darkTooltipBg: '#374151',     
  darkTooltipText: '#f9fafb',   
  darkTooltipBorder: '#6b7280', 
  
  // === ENTRY COLORS ===
  circleEntryText: '#ffffff'     
} as const

export const RADAR_COLORS = {
  ...baseColors,
  
  // === BANNER GRADIENT ===
  mainRadarBanner: `linear-gradient(to right, ${baseColors.platforms}, ${baseColors.tools}, ${baseColors.languagesFrameworks}, ${baseColors.techniques})`,

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


