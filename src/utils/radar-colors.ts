// AI Radar Colors - Single source of truth
const baseColors = {
  // Quadrant colors
  platforms: '#16a34a',           // green-600
  tools: '#0891b2',              // cyan-600
  languagesFrameworks: '#ca8a04', // yellow-600
  techniques: '#dc2626',          // red-600
  
  // Ring colors (for backward compatibility in banners)
  adopt: '#16a34a',      // green-600
  trial: '#0891b2',      // cyan-600
  assess: '#ca8a04',     // yellow-600
  hold: '#dc2626',       // red-600
  
  // Fallback colors
  fallback: '#475569'    // slate-600
} as const

export const RADAR_COLORS = {
  ...baseColors,
  // Banner colors (using quadrant colors)
  quadrantBanner: `linear-gradient(to right, ${baseColors.platforms}, ${baseColors.tools}, ${baseColors.languagesFrameworks})`,
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
      return RADAR_COLORS.fallback
  }
}

// Helper function to get ring color based on ring name (for backward compatibility)
export function getRingColor(ringName: string): string {
  switch (ringName) {
    case 'adopt':
      return RADAR_COLORS.adopt
    case 'trial':
      return RADAR_COLORS.trial
    case 'assess':
      return RADAR_COLORS.assess
    case 'hold':
      return RADAR_COLORS.hold
    default:
      return RADAR_COLORS.fallback
  }
}
