import * as d3 from 'd3';

/**
 * Applies collision detection to radar entries to prevent overlapping
 * @param entries - Array of entries with x, y coordinates
 * @param options - Collision configuration options
 */
export function applyCollisionDetection(
  entries: Array<{ x?: number; y?: number }>,
  options: {
    radius?: number;
    strength?: number;
    velocityDecay?: number;
    onTick?: () => void;
  } = {}
) {
  const {
    radius = 18,
    strength = 0.95,
    velocityDecay = 0.19,
    onTick
  } = options;

  // Apply D3 force simulation for collision detection
  d3.forceSimulation()
    .nodes(entries as d3.SimulationNodeDatum[])
    .velocityDecay(velocityDecay)
    .force("collision", d3.forceCollide().radius(radius).strength(strength))
    .on("tick", onTick || (() => {}));
}
