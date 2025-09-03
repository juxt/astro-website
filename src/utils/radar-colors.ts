// AI Radar Colors - Single source of truth
export const RADAR_COLORS = {
  // Ring colors
  adopt: '#16a34a',      // green-600
  trial: '#0891b2',      // cyan-600
  assess: '#ca8a04',     // yellow-600
  hold: '#dc2626',       // red-600
  
  // Banner colors
  quadrantBanner: 'linear-gradient(to right, #16a34a, #0891b2, #ca8a04)',
  mainRadarBanner: 'linear-gradient(to right, #2563eb, red, #4f46e5)',
  
  // Fallback colors
  fallback: '#475569'    // slate-600
} as const

// Helper function to get ring color based on ring name
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
