import * as d3 from 'd3';
import { getRadarStructureColors, getTooltipColors, RADAR_COLORS } from './radar-colors';
import { applyCollisionDetection } from './radar-collision';

interface SingleQuadrantEntry {
  id: number;
  label: string;
  ring: number; // 0=Adopt, 1=Trial, 2=Assess, 3=Hold
  moved?: number;
  link?: string; // Link to the detailed page section
  active?: boolean;
  description?: string;
  // Properties added during positioning
  x?: number;
  y?: number;
  color?: string;
}

interface SingleQuadrantRing {
  name: string;
  radius?: number;
  description?: string;
}

interface SingleQuadrantConfig {
  svg_id?: string;
  width?: number;
  height?: number;
  colors?: {
    background: string;
    grid: string;
    inactive: string;
  };
  quadrantName: string;
  quadrantColor: string;
  rings: SingleQuadrantRing[];
  entries: SingleQuadrantEntry[];
  font_family?: string;
  scale?: number;
  
  themeColors?: {
    ringTextColor: string;
    mainTextColor: string;
  };
}

export function single_quadrant_visualization(config: SingleQuadrantConfig): void {
  // Default configuration
  config.svg_id = config.svg_id || "single-quadrant-radar";
  config.width = config.width || 800; // Optimized for quarter-circle
  config.height = config.height || 500;
  config.font_family = config.font_family || "Arial, Helvetica";
  config.scale = config.scale || 1.0;

  // Helper function to get the correct quadrant color from radar-colors.ts
  function getQuadrantColorFromName(quadrantName: string): string {
    const normalizedName = quadrantName.toLowerCase().replace(/[\s&-]/g, '');
    switch (normalizedName) {
      case 'platforms': return RADAR_COLORS.platforms;
      case 'tools': return RADAR_COLORS.tools;
      case 'languagesframeworks': return RADAR_COLORS.languagesFrameworks;
      case 'techniques': return RADAR_COLORS.techniques;
      default: return config.quadrantColor || RADAR_COLORS.platforms;
    }
  }

  const quadrantColor = getQuadrantColorFromName(config.quadrantName);
  
  const structureColors = getRadarStructureColors();
  config.colors = config.colors || {
    background: structureColors.background,
    grid: structureColors.grid,
    inactive: structureColors.inactive
  };

  // Ring configuration for quarter-circle (bigger radar)
  const rings = [
    { radius: 80 },   // Adopt
    { radius: 160 },  // Trial  
    { radius: 240 },  // Assess
    { radius: 320 }   // Hold
  ];

  // Center point for quarter-circle (positioned to leave room for labels)
  const centerX = 80;
  const centerY = config.height - 120; // Leave room for bottom labels

  // Clear any existing radar
  d3.select(`#${config.svg_id}`).selectAll("*").remove();

  // Create SVG
  const radar = d3.select(`#${config.svg_id}`)
    .attr("width", config.width)
    .attr("height", config.height);

  // Add background
  radar.append("rect")
    .attr("width", config.width)
    .attr("height", config.height)
    .style("fill", config.colors.background);

  // Random number generator for reproducible positioning
  let seed = 42;
  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function randomBetween(min: number, max: number) {
    return min + random() * (max - min);
  }

  function normalBetween(min: number, max: number) {
    return min + (random() + random()) * 0.5 * (max - min);
  }

  // Draw quarter-circle grid arcs
  const grid = radar.append("g").attr("class", "grid");
  
  rings.forEach((ring, i) => {
    // Draw quarter-circle arc using path
    const arcPath = `M ${centerX} ${centerY - ring.radius} A ${ring.radius} ${ring.radius} 0 0 1 ${centerX + ring.radius} ${centerY}`;
    
    grid.append("path")
      .attr("d", arcPath)
      .style("fill", "none")
      .style("stroke", config.colors.grid)
      .style("stroke-width", 1);
  });
  
  // Draw the two straight lines to complete the quarter-circle boundary
  grid.append("line")
    .attr("x1", centerX)
    .attr("y1", centerY - rings[rings.length - 1].radius)
    .attr("x2", centerX)
    .attr("y2", centerY)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);
    
  grid.append("line")
    .attr("x1", centerX)
    .attr("y1", centerY)
    .attr("x2", centerX + rings[rings.length - 1].radius)
    .attr("y2", centerY)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);
  
  // Add ring labels at the bottom in proper sequence
  const labelY = centerY + 40; // Position below the quarter-circle
  const totalWidth = rings[rings.length - 1].radius;
  
  config.rings.forEach((ring, i) => {
    // Position labels evenly across the bottom, aligned with their ring sections
    const sectionWidth = totalWidth / config.rings.length;
    const labelX = centerX + (i * sectionWidth) + (sectionWidth / 2);
    
    grid.append("text")
      .attr("class", "radar-background-ring-text")
      .text(ring.name.toUpperCase())
      .attr("x", labelX)
      .attr("y", labelY)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("fill", quadrantColor)
      .style("opacity", 1) // Full opacity for bottom labels
      .style("font-family", config.font_family)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .style("user-select", "none");
  });

  // Position entries randomly within their quarter-circle rings
  config.entries.forEach((entry) => {
    const ring = rings[entry.ring];
    const prevRing = entry.ring > 0 ? rings[entry.ring - 1] : { radius: 0 };
    const circleRadius = 12; // The actual circle size
    
    // Calculate safe bounds accounting for circle circumference + buffer
    const buffer = 8; // Extra buffer to ensure circles never touch edges
    const minRadius = entry.ring === 0 ? circleRadius + buffer : prevRing.radius + circleRadius + buffer;
    const maxRadius = ring.radius - circleRadius - buffer;
    
    // Calculate safe angle bounds accounting for circle circumference
    // Need to ensure the entire circle stays within the quarter-circle
    let angle, radius, x, y;
    let attempts = 0;
    
    do {
      angle = randomBetween(-Math.PI / 2 + 0.1, -0.1);
      radius = normalBetween(minRadius, maxRadius);
      x = centerX + radius * Math.cos(angle);
      y = centerY + radius * Math.sin(angle);
      attempts++;
    } while (attempts < 50 && (
      // Check if any part of the circle + buffer goes outside quarter-circle boundaries
      x - circleRadius - buffer < centerX || // Left edge past vertical line
      y + circleRadius + buffer > centerY    // Bottom edge past horizontal line
    ));
    
    entry.x = x;
    entry.y = y;
    entry.color = entry.active !== false ? quadrantColor : config.colors.inactive;
  });

  // Tooltip functions
  function showTooltip(d: SingleQuadrantEntry) {
    hideTooltip();
    
    const blipItem = document.getElementById(`single-blip${d.id}`);
    if (!blipItem) return;
    
    const isDarkMode = document.documentElement.classList.contains('dark');
    const tooltipColors = getTooltipColors(isDarkMode);
    
    const tooltip = document.createElement('div');
    tooltip.id = 'single-radar-tooltip';
    tooltip.textContent = d.label;
    tooltip.style.cssText = `
      position: absolute;
      background: ${tooltipColors.background};
      color: ${tooltipColors.text};
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid ${tooltipColors.border};
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    const rect = blipItem.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    tooltip.style.left = (rect.left + scrollLeft + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top + scrollTop - 42) + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    blipItem.style.opacity = "1";
    blipItem.style.filter = "brightness(1.2)";
  }

  function hideTooltip() {
    const tooltip = document.getElementById('single-radar-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
    
    document.querySelectorAll('.single-blip').forEach((blip) => {
      const element = blip as HTMLElement;
      element.style.opacity = "";
      element.style.filter = "";
    });
  }

  function highlightLegendItem(d: SingleQuadrantEntry) {
    const legendItem = document.getElementById(`singleLegendItem${d.id}`);
    if (legendItem) {
      legendItem.style.fontWeight = "bold";
    }
    showTooltip(d);
  }

  function unhighlightLegendItem(d: SingleQuadrantEntry) {
    const legendItem = document.getElementById(`singleLegendItem${d.id}`);
    if (legendItem) {
      legendItem.style.fontWeight = "normal";
    }
    hideTooltip();
  }

  // Draw blips
  const blips = radar.selectAll(".single-blip")
    .data(config.entries)
    .enter()
    .append("g")
    .attr("class", "single-blip")
    .attr("id", d => `single-blip${d.id}`)
    .attr("transform", d => `translate(${d.x}, ${d.y})`)
    .style("cursor", "pointer")
    .on("mouseover", (event, d) => {
      // Show tooltip for the blip
      showTooltip(d);
      // Also highlight the legend item
      const legendItem = document.getElementById(`singleLegendItem${d.id}`);
      if (legendItem) {
        legendItem.style.fontWeight = "bold";
      }
    })
    .on("mouseout", (event, d) => {
      // Hide tooltip
      hideTooltip();
      // Remove legend highlight
      const legendItem = document.getElementById(`singleLegendItem${d.id}`);
      if (legendItem) {
        legendItem.style.fontWeight = "normal";
      }
    })
    .on("click", (event, d) => {
      if (d.link) {
        window.open(d.link, '_blank');
      }
    });

  blips.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 12)
    .style("fill", d => d.color);

  // Add sequential numbers to circles
  let circleNumber = 1;
  for (let ringIndex = 0; ringIndex < 4; ringIndex++) {
    const ringEntries = config.entries.filter(entry => entry.ring === ringIndex);
    ringEntries.sort((a, b) => a.id - b.id);
    
    ringEntries.forEach(entry => {
      entry.legendNumber = circleNumber++;
    });
  }

  blips.append("text")
    .text(d => d.legendNumber || d.id) // Use sequential number if available
    .attr("x", 0)
    .attr("y", 4)
    .attr("text-anchor", "middle")
    .style("fill", RADAR_COLORS.white)
    .style("font-family", config.font_family)
    .style("font-size", "10px")
    .style("font-weight", "bold")
    .style("pointer-events", "none")
    .style("user-select", "none");

  // Draw legend (positioned to the right of the quarter-circle)
  const legendX = centerX + rings[rings.length - 1].radius + 40; // Position legend with proper spacing
  const legendY = 30;
  const legendLineHeight = 14; // Smaller line height for compact legend
  
  // Create ordered list of all entries sorted by ring (Adopt, Trial, Assess, Hold)
  const allEntries = [];
  
  // Add entries in ring order: Adopt (0), Trial (1), Assess (2), Hold (3)
  for (let ringIndex = 0; ringIndex < 4; ringIndex++) {
    const ringEntries = config.entries.filter(entry => entry.ring === ringIndex);
    ringEntries.sort((a, b) => a.id - b.id); // Sort by original ID within ring
    allEntries.push(...ringEntries);
  }

  // Draw legend as one continuous vertical list with sequential numbering
  let currentY = legendY;
  let legendNumber = 1; // Simple sequential counter

  // Draw legend for each ring in order
  for (let ringIndex = 0; ringIndex < 4; ringIndex++) {
    const ringEntries = config.entries.filter(entry => entry.ring === ringIndex);
    if (ringEntries.length === 0) continue;
    
    ringEntries.sort((a, b) => a.id - b.id); // Sort by original ID within ring

    // Ring title
    radar.append("text")
      .attr("class", "radar-ring-label")
      .text(config.rings[ringIndex].name)
      .attr("x", legendX)
      .attr("y", currentY)
      .style("fill", quadrantColor)
      .style("font-family", config.font_family)
      .style("font-size", "12px")
      .style("font-weight", "bold");

    currentY += legendLineHeight + 5; // Add space after ring title

    // Ring entries with sequential numbering
    ringEntries.forEach((entry) => {
      const legendGroup = radar.append("g")
        .attr("id", `singleLegendItem${entry.id}`)
        .style("cursor", "pointer")
        .on("mouseover", () => highlightLegendItem(entry))
        .on("mouseout", () => unhighlightLegendItem(entry))
        .on("click", () => {
          if (entry.link) {
            window.open(entry.link, '_blank');
          }
        });

      legendGroup.append("text")
        .attr("class", "radar-entry-text")
        .text(`${legendNumber}. ${entry.label}`) // Use sequential number instead of entry.id
        .attr("x", legendX)
        .attr("y", currentY)
        .style("fill", config.themeColors?.mainTextColor || RADAR_COLORS.lightMainText)
        .style("font-family", config.font_family)
        .style("font-size", "11px");

      legendNumber++; // Increment for next entry
      currentY += legendLineHeight; // Move to next line
    });

    currentY += 10; // Add space between rings
  }

  // Apply collision detection to prevent overlapping circles
  function updateBlipPositions() {
    const circleRadius = 12;
    
    // Additional safety check: constrain entries to proper boundaries after collision
    config.entries.forEach((entry) => {
      const ring = rings[entry.ring];
      const prevRing = entry.ring > 0 ? rings[entry.ring - 1] : { radius: 0 };
      
      // Calculate proper bounds accounting for circle circumference + buffer
      const buffer = 8; // Extra buffer to ensure circles never touch edges
      const minRadius = entry.ring === 0 ? circleRadius + buffer : prevRing.radius + circleRadius + buffer;
      const maxRadius = ring.radius - circleRadius - buffer;
      
      const dx = entry.x - centerX;
      const dy = entry.y - centerY;
      const currentRadius = Math.sqrt(dx * dx + dy * dy);
      
      // Clamp radius to ring bounds
      const clampedRadius = Math.max(minRadius, Math.min(maxRadius, currentRadius));
      
      // Check quarter-circle boundary constraints
      let x = centerX + clampedRadius * Math.cos(Math.atan2(dy, dx));
      let y = centerY + clampedRadius * Math.sin(Math.atan2(dy, dx));
      
      // Ensure entire circle + buffer stays within quarter-circle boundaries
      if (x - circleRadius - buffer < centerX) {
        x = centerX + circleRadius + buffer; // Move away from vertical line
      }
      if (y + circleRadius + buffer > centerY) {
        y = centerY - circleRadius - buffer; // Move away from horizontal line
      }
      
      entry.x = x;
      entry.y = y;
    });
    
    blips.attr("transform", d => `translate(${d.x}, ${d.y})`);
  }

  applyCollisionDetection(config.entries, {
    radius: 16, // Slightly smaller for single quadrant
    strength: 0.9,
    velocityDecay: 0.2,
    onTick: updateBlipPositions
  });
}
