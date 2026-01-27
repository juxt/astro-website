import * as d3 from 'd3'
import {
  getRadarStructureColors,
  getTooltipColors,
  getLegendIconColor,
  RADAR_COLORS
} from './radar-colors'
import { applyCollisionDetection } from './radar-collision'
export interface RadarEntry {
  label: string
  quadrant: number
  ring: number
  moved?: number
  active?: boolean
  link?: string
  id?: string
  x?: number
  y?: number
  color?: string
  segment?: any
}

export interface RadarQuadrant {
  name: string
  color: string
  link?: string
}

export interface RadarRing {
  name: string
  radius?: number
  description?: string
}

export interface RadarColors {
  background: string
  grid: string
}

export interface RadarConfig {
  svg_id?: string
  width?: number
  height?: number
  colors?: RadarColors
  print_layout?: boolean
  links_in_new_tabs?: boolean
  repo_url?: string
  legend_offset?: Array<{ x: number; y: number }>
  title_offset?: { x: number; y: number }
  footer_offset?: { x: number; y: number }
  legend_column_width?: number
  legend_line_height?: number
  scale?: number
  font_family?: string
  title?: string
  date?: string
  show_footer_legend?: boolean
  quadrants: RadarQuadrant[]
  rings: RadarRing[]
  entries: RadarEntry[]
  zoomed_quadrant?: number
  themeColors?: {
    ringTextColor: string
    mainTextColor: string
  }
}

export function radar_visualization(config: RadarConfig): void {
  config.svg_id = config.svg_id || 'radar'
  config.width = config.width || 1450
  config.height = config.height || 1050
  const structureColors = getRadarStructureColors()
  config.colors =
    'colors' in config
      ? config.colors
      : {
          background: structureColors.background,
          grid: structureColors.grid
        }
  config.print_layout = 'print_layout' in config ? config.print_layout : true
  config.links_in_new_tabs =
    'links_in_new_tabs' in config ? config.links_in_new_tabs : true
  config.repo_url = config.repo_url || '#'
  config.legend_offset = config.legend_offset || [
    { x: 450, y: 110 },
    { x: -675, y: 110 },
    { x: -675, y: -330 },
    { x: 450, y: -330 }
  ]
  config.title_offset = config.title_offset || { x: -675, y: -420 }
  config.footer_offset = config.footer_offset || { x: -155, y: 450 }
  config.legend_column_width = config.legend_column_width || 140
  config.legend_line_height = config.legend_line_height || 14
  config.show_footer_legend =
    'show_footer_legend' in config ? config.show_footer_legend : true

  // custom random number generator, to make random sequence reproducible
  // source: https://stackoverflow.com/questions/521295
  var seed = 42
  function random() {
    var x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }

  function random_between(min, max) {
    return min + random() * (max - min)
  }

  function normal_between(min, max) {
    return min + (random() + random()) * 0.5 * (max - min)
  }

  // radial_min / radial_max are multiples of PI
  const quadrants = [
    { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 },
    { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 },
    { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 },
    { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 }
  ]

  const rings = [
    { radius: 130 },
    { radius: 220 },
    { radius: 310 },
    { radius: 400 }
  ]

  function polar(cartesian) {
    var x = cartesian.x
    var y = cartesian.y
    return {
      t: Math.atan2(y, x),
      r: Math.sqrt(x * x + y * y)
    }
  }

  function cartesian(polar) {
    return {
      x: polar.r * Math.cos(polar.t),
      y: polar.r * Math.sin(polar.t)
    }
  }

  function bounded_interval(value, min, max) {
    var low = Math.min(min, max)
    var high = Math.max(min, max)
    return Math.min(Math.max(value, low), high)
  }

  function bounded_ring(polar, r_min, r_max) {
    return {
      t: polar.t,
      r: bounded_interval(polar.r, r_min, r_max)
    }
  }

  function bounded_box(point, min, max) {
    return {
      x: bounded_interval(point.x, min.x, max.x),
      y: bounded_interval(point.y, min.y, max.y)
    }
  }

  function segment(quadrant, ring) {
    var polar_min = {
      t: quadrants[quadrant].radial_min * Math.PI,
      r: ring === 0 ? 30 : rings[ring - 1].radius
    }
    var polar_max = {
      t: quadrants[quadrant].radial_max * Math.PI,
      r: rings[ring].radius
    }
    var cartesian_min = {
      x: 15 * quadrants[quadrant].factor_x,
      y: 15 * quadrants[quadrant].factor_y
    }
    var cartesian_max = {
      x: rings[3].radius * quadrants[quadrant].factor_x,
      y: rings[3].radius * quadrants[quadrant].factor_y
    }
    return {
      clipx: function (d) {
        var c = bounded_box(d, cartesian_min, cartesian_max)
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15)
        d.x = cartesian(p).x // adjust data too!
        return d.x
      },
      clipy: function (d) {
        var c = bounded_box(d, cartesian_min, cartesian_max)
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15)
        d.y = cartesian(p).y // adjust data too!
        return d.y
      },
      random: function () {
        return cartesian({
          t: random_between(polar_min.t, polar_max.t),
          r: normal_between(polar_min.r, polar_max.r)
        })
      }
    }
  }

  // position each entry randomly in its segment
  for (var i = 0; i < config.entries.length; i++) {
    var entry = config.entries[i]
    entry.segment = segment(entry.quadrant, entry.ring)
    var point = entry.segment.random()
    entry.x = point.x
    entry.y = point.y
    entry.color = config.quadrants[entry.quadrant].color
  }

  // partition entries according to segments
  var segmented = new Array(4)
  for (let quadrant = 0; quadrant < 4; quadrant++) {
    segmented[quadrant] = new Array(4)
    for (var ring = 0; ring < 4; ring++) {
      segmented[quadrant][ring] = []
    }
  }
  for (var i = 0; i < config.entries.length; i++) {
    var entry = config.entries[i]
    segmented[entry.quadrant][entry.ring].push(entry)
  }

  // assign unique sequential id to each entry
  var id = 1
  for (let quadrant of [2, 3, 1, 0]) {
    for (var ring = 0; ring < 4; ring++) {
      var entries = segmented[quadrant][ring]
      entries.sort((a, b) => (a.documentOrder || 0) - (b.documentOrder || 0))
      for (var i = 0; i < entries.length; i++) {
        entries[i].id = '' + id++
      }
    }
  }

  function translate(x, y) {
    return 'translate(' + x + ',' + y + ')'
  }

  function viewbox(quadrant) {
    return [
      Math.max(0, quadrants[quadrant].factor_x * 400) - 420,
      Math.max(0, quadrants[quadrant].factor_y * 400) - 420,
      440,
      440
    ].join(' ')
  }

  // adjust with config.scale.
  config.scale = config.scale || 1
  var scaled_width = config.width * config.scale
  var scaled_height = config.height * config.scale

  var svg = d3
    .select('svg#' + config.svg_id)
    .style('background-color', config.colors.background)
    .attr('width', scaled_width)
    .attr('height', scaled_height)

  var radar = svg.append('g')
  if ('zoomed_quadrant' in config) {
    svg.attr('viewBox', viewbox(config.zoomed_quadrant))
  } else {
    radar.attr(
      'transform',
      translate(scaled_width / 2, scaled_height / 2).concat(
        `scale(${config.scale})`
      )
    )
  }

  var grid = radar.append('g')

  // define default font-family
  config.font_family = config.font_family || 'Arial, Helvetica'

  // draw grid lines
  grid
    .append('line')
    .attr('x1', 0)
    .attr('y1', -400)
    .attr('x2', 0)
    .attr('y2', 400)
    .style('stroke', config.colors.grid)
    .style('stroke-width', 1)
  grid
    .append('line')
    .attr('x1', -400)
    .attr('y1', 0)
    .attr('x2', 400)
    .attr('y2', 0)
    .style('stroke', config.colors.grid)
    .style('stroke-width', 1)

  // Removed unused solid filter - no longer needed without bubble tooltips

  // draw rings
  for (var i = 0; i < rings.length; i++) {
    grid
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', rings[i].radius)
      .style('fill', 'none')
      .style('stroke', config.colors.grid)
      .style('stroke-width', 1)
    if (config.print_layout) {
      grid
        .append('text')
        .attr('class', 'radar-background-ring-text')
        .text(config.rings[i].name)
        .attr('y', -rings[i].radius + 62)
        .attr('text-anchor', 'middle')
        .style(
          'fill',
          config.themeColors?.ringTextColor || RADAR_COLORS.lightRingText
        )
        .style('opacity', 0.35)
        .style('font-family', config.font_family)
        .style('font-size', '42px')
        .style('font-weight', 'bold')
        .style('pointer-events', 'none')
        .style('user-select', 'none')
    }
  }

  function legend_transform(
    quadrant,
    ring,
    legendColumnWidth,
    index = null,
    previousHeight = null
  ) {
    const dx = ring < 2 ? 0 : legendColumnWidth
    let dy = index == null ? -16 : index * config.legend_line_height + 6

    if (ring % 2 === 1) {
      dy = dy + 36 + previousHeight
    }

    return translate(
      config.legend_offset[quadrant].x + dx,
      config.legend_offset[quadrant].y + dy
    )
  }

  // draw title and legend (only in print layout)
  if (config.print_layout) {
    // title
    radar
      .append('a')
      .attr('href', config.repo_url)
      .attr(
        'transform',
        translate(config.title_offset.x, config.title_offset.y)
      )
      .append('text')
      .attr('class', 'hover-underline') // add class for hover effect
      .text(config.title)
      .style('font-family', config.font_family)
      .style('font-size', '30')
      .style('font-weight', 'bold')

    // date
    radar
      .append('text')
      .attr('class', 'radar-date-text')
      .attr(
        'transform',
        translate(config.title_offset.x, config.title_offset.y + 20)
      )
      .text(config.date || '')
      .style('font-family', config.font_family)
      .style('font-size', '14')
      .style(
        'fill',
        config.themeColors?.mainTextColor || RADAR_COLORS.lightMainText
      )

    // footer (optional)
    if (config.show_footer_legend) {
      radar
        .append('text')
        .attr('class', 'radar-footer-legend')
        .attr(
          'transform',
          translate(config.footer_offset.x, config.footer_offset.y)
        )
        .text('▲ moved up     ▼ moved down     ★ new     ⬤ no change')
        .attr('xml:space', 'preserve')
        .style('font-family', config.font_family)
        .style('font-size', '12px')
        .style(
          'fill',
          config.themeColors?.mainTextColor || RADAR_COLORS.lightMainText
        )
    }

    // legend
    const legend = radar.append('g')
    for (let quadrant = 0; quadrant < 4; quadrant++) {
      // Create clickable quadrant label
      const quadrantLabel = legend
        .append('g')
        .attr(
          'transform',
          translate(
            config.legend_offset[quadrant].x,
            config.legend_offset[quadrant].y - 45
          )
        )
        .style('cursor', 'pointer')
        .on('click', () => {
          // Use the link from the quadrant data structure
          if (config.quadrants[quadrant].link) {
            window.location.href = config.quadrants[quadrant].link
          }
        })
        .on('mouseover', function () {
          d3.select(this).select('text').style('opacity', 0.7)
        })
        .on('mouseout', function () {
          d3.select(this).select('text').style('opacity', 1)
        })

      quadrantLabel
        .append('text')
        .text(config.quadrants[quadrant].name)
        .style('font-family', config.font_family)
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('fill', config.quadrants[quadrant].color)
      // Pre-calculate heights for adopt (ring 0) and assess (ring 2) sections
      let adoptHeight = 0
      let assessHeight = 0

      // Calculate adopt section height (ring 0)
      segmented[quadrant][0].forEach((entry) => {
        // Estimate height based on text wrapping
        const words = entry.label.split(' ')
        const estimatedLines = Math.ceil(
          words.join(' ').length / (config.legend_column_width / 8)
        ) // rough estimate
        adoptHeight += Math.max(1, estimatedLines) * config.legend_line_height
      })

      // Calculate assess section height (ring 2)
      segmented[quadrant][2].forEach((entry) => {
        // Estimate height based on text wrapping
        const words = entry.label.split(' ')
        const estimatedLines = Math.ceil(
          words.join(' ').length / (config.legend_column_width / 8)
        ) // rough estimate
        assessHeight += Math.max(1, estimatedLines) * config.legend_line_height
      })

      // Use the maximum height for both bottom sections, plus breathing space
      const maxTopSectionHeight = Math.max(adoptHeight, assessHeight) + 20

      let previousLegendHeight = 0
      for (let ring = 0; ring < 4; ring++) {
        if (ring % 2 === 0) {
          previousLegendHeight = 0
        } else {
          // For trial (ring 1) and hold (ring 3), use the same baseline height
          previousLegendHeight = maxTopSectionHeight
        }
        legend
          .append('text')
          .attr('class', 'radar-ring-label')
          .attr(
            'transform',
            legend_transform(
              quadrant,
              ring,
              config.legend_column_width,
              null,
              previousLegendHeight
            )
          )
          .text(config.rings[ring].name)
          .style('font-family', config.font_family)
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .style(
            'fill',
            config.themeColors?.ringTextColor || RADAR_COLORS.lightRingText
          )
        legend
          .selectAll('.legend' + quadrant + ring)
          .data(segmented[quadrant][ring])
          .enter()
          .append('a')
          .attr('href', function (d: RadarEntry, i) {
            return d.link ? d.link : '#' // stay on same page if no link was provided
          })
          // Add a target if (and only if) there is a link and we want new tabs
          .attr('target', function (d: RadarEntry, i) {
            return d.link && config.links_in_new_tabs ? '_blank' : null
          })
          .append('text')
          .attr('transform', function (d, i) {
            return legend_transform(
              quadrant,
              ring,
              config.legend_column_width,
              i,
              previousLegendHeight
            )
          })
          .attr('class', 'radar-entry-text')
          .attr('id', function (d: RadarEntry, i) {
            return 'legendItem' + d.id
          })
          .text(function (d: RadarEntry) {
            return d.id + '. ' + d.label
          })
          .style('font-family', config.font_family)
          .style('font-size', '11px')
          .style(
            'fill',
            config.themeColors?.mainTextColor || RADAR_COLORS.lightMainText
          )
          .on('mouseover', function (event, d) {
            highlightLegendItem(d)
          })
          .on('mouseout', function (event, d) {
            unhighlightLegendItem(d)
          })
          .call(wrap_text)
          .each(function () {
            const node = d3.select(this).node() as SVGTextElement
            if (node) {
              // Only accumulate height for the current section (not used for bottom alignment)
              if (ring % 2 === 0) {
                previousLegendHeight += node.getBBox().height
              }
            }
          })
      }
    }
  }

  function wrap_text(text) {
    let heightForNextElement = 0

    text.each(function () {
      const textElement = d3.select(this)
      const words = textElement.text().split(' ')
      let line = []

      // Use '|' at the end of the string so that spaces are not trimmed during rendering.
      const number = `${textElement.text().split('.')[0]}. |`
      const legendNumberText = textElement.append('tspan').text(number)
      const legendBar = textElement.append('tspan').text('|')
      const numberWidth =
        legendNumberText.node().getComputedTextLength() -
        legendBar.node().getComputedTextLength()

      textElement.text(null)

      let tspan = textElement
        .append('tspan')
        .attr('x', 0)
        .attr('y', heightForNextElement)
        .attr('dy', 0)

      for (let position = 0; position < words.length; position++) {
        line.push(words[position])
        tspan.text(line.join(' '))

        // Wrap text when it exceeds column width, but avoid wrapping single words on first line
        if (
          tspan.node().getComputedTextLength() >
            config.legend_column_width - 10 &&
          (position > 1 || line.length > 1)
        ) {
          line.pop()
          tspan.text(line.join(' '))
          line = [words[position]]

          tspan = textElement
            .append('tspan')
            .attr('x', numberWidth)
            .attr('dy', config.legend_line_height)
            .text(words[position])
        }
      }

      const node = textElement.node() as SVGTextElement
      const textBoundingBox = node
        ? node.getBBox()
        : { x: 0, y: 0, width: 0, height: 0 }
      heightForNextElement = textBoundingBox.y + textBoundingBox.height
    })
  }

  // layer for entries
  var rink = radar.append('g').attr('id', 'rink')

  // Removed unused bubble tooltip code for cleaner implementation

  function highlightLegendItem(d) {
    var legendItem = document.getElementById('legendItem' + d.id)
    if (legendItem) {
      legendItem.style.fontWeight = 'bold'
    }

    // Show tooltip for the corresponding radar circle
    showTooltip(d)
  }

  function unhighlightLegendItem(d) {
    var legendItem = document.getElementById('legendItem' + d.id)
    if (legendItem) {
      legendItem.style.fontWeight = 'normal'
    }

    // Hide tooltip
    hideTooltip()
  }

  function showTooltip(d) {
    var blipItem = document.getElementById('blip' + d.id)
    if (!blipItem) return

    // Remove any existing tooltip
    hideTooltip()

    // Get the current theme colors
    const isDarkMode = document.documentElement.classList.contains('dark')
    const tooltipColors = getTooltipColors(isDarkMode)
    const tooltipBg = tooltipColors.background
    const tooltipText = tooltipColors.text
    const tooltipBorder = tooltipColors.border

    // Create tooltip element
    var tooltip = document.createElement('div')
    tooltip.id = 'radar-tooltip'
    tooltip.textContent = d.label
    tooltip.style.cssText = `
      position: absolute;
      background: ${tooltipBg};
      color: ${tooltipText};
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid ${tooltipBorder};
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `

    // Get blip position relative to viewport and account for scroll
    var rect = blipItem.getBoundingClientRect()
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    // Position tooltip right above the circle with breathing room
    tooltip.style.left = rect.left + scrollLeft + rect.width / 2 + 'px'
    tooltip.style.top = rect.top + scrollTop - 42 + 'px' // Tooltip height (~27px) + breathing room (~15px)
    tooltip.style.transform = 'translateX(-50%)'

    document.body.appendChild(tooltip)

    // Highlight the circle slightly
    blipItem.style.opacity = '1'
    blipItem.style.filter = 'brightness(1.2)'
  }

  function hideTooltip() {
    var tooltip = document.getElementById('radar-tooltip')
    if (tooltip) {
      tooltip.remove()
    }

    // Remove highlight from all blips
    document.querySelectorAll('.blip').forEach(function (blip) {
      const element = blip as HTMLElement
      element.style.opacity = ''
      element.style.filter = ''
    })
  }

  // draw blips on radar
  var blips = rink
    .selectAll('.blip')
    .data(config.entries)
    .enter()
    .append('g')
    .attr('class', 'blip')
    .attr('id', function (d) {
      return 'blip' + d.id
    })
    .attr('transform', function (d, i) {
      return legend_transform(d.quadrant, d.ring, config.legend_column_width, i)
    })
    .on('mouseover', function (event, d) {
      highlightLegendItem(d)
    })
    .on('mouseout', function (event, d) {
      unhighlightLegendItem(d)
    })

  // configure each blip
  blips.each(function (d) {
    var blip = d3.select(this)

    // blip link
    if (Object.prototype.hasOwnProperty.call(d, 'link') && d.link) {
      const linkElement = blip.append('a').attr('xlink:href', d.link)
      blip = linkElement as any

      if (config.links_in_new_tabs) {
        blip.attr('target', '_blank')
      }
    }

    // blip shape
    if (d.moved == 1) {
      blip
        .append('path')
        .attr('d', 'M -11,5 11,5 0,-13 z') // triangle pointing up
        .style('fill', d.color)
    } else if (d.moved == -1) {
      blip
        .append('path')
        .attr('d', 'M -11,-5 11,-5 0,13 z') // triangle pointing down
        .style('fill', d.color)
    } else if (d.moved == 2) {
      blip
        .append('path')
        .attr('d', d3.symbol().type(d3.symbolStar).size(200))
        .style('fill', d.color)
    } else {
      blip.append('circle').attr('r', 12).attr('fill', d.color)
    }

    // blip text
    var blip_text = config.print_layout
      ? d.id
      : d.label.match(/[a-z]/i)?.[0] || d.label.charAt(0)
    blip
      .append('text')
      .text(blip_text)
      .attr('y', 3)
      .attr('text-anchor', 'middle')
      .style('fill', RADAR_COLORS.circleEntryText)
      .style('font-family', config.font_family)
      .style('font-size', function (d) {
        return blip_text.length > 2 ? '8px' : '9px'
      })
      .style('pointer-events', 'none')
      .style('user-select', 'none')
  })

  // make sure that blips stay inside their segment
  function ticked() {
    blips.attr('transform', function (d) {
      return translate(d.segment.clipx(d), d.segment.clipy(d))
    })
  }

  // distribute blips, while avoiding collisions
  applyCollisionDetection(config.entries, {
    radius: 18,
    strength: 0.95,
    velocityDecay: 0.19,
    onTick: ticked
  })

  // Add footer legend if enabled
  if (config.show_footer_legend !== false) {
    const legendY = 950 // Position near bottom
    const legendItemSpacing = 140 // Space between legend items
    const totalLegendWidth = legendItemSpacing * 3 + 300
    const legendStartX = 1450 / 2 - totalLegendWidth / 2

    // Get theme-aware legend color
    const isDarkMode = document.documentElement.classList.contains('dark')
    const legendColor = getLegendIconColor(isDarkMode)

    const legendGroup = radar.append('g').attr('id', 'footer-legend')

    // Circle - no change
    const noChangeGroup = legendGroup
      .append('g')
      .attr('transform', `translate(${legendStartX}, ${legendY})`)

    noChangeGroup
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 8)
      .attr('fill', legendColor)

    noChangeGroup
      .append('text')
      .attr('x', 15)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .style('fill', legendColor)
      .style('font-family', config.font_family)
      .style('font-size', '12px')
      .text('No change')

    // Triangle up - moved up
    const movedUpGroup = legendGroup
      .append('g')
      .attr(
        'transform',
        `translate(${legendStartX + legendItemSpacing + 70}, ${legendY})`
      )

    movedUpGroup
      .append('path')
      .attr('d', 'M -8,4 L 8,4 L 0,-10 Z')
      .attr('fill', legendColor)

    movedUpGroup
      .append('text')
      .attr('x', 15)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .style('fill', legendColor)
      .style('font-family', config.font_family)
      .style('font-size', '12px')
      .text('Moved up')

    // Triangle down - moved down
    const movedDownGroup = legendGroup
      .append('g')
      .attr(
        'transform',
        `translate(${legendStartX + legendItemSpacing * 2 + 140}, ${legendY})`
      )

    movedDownGroup
      .append('path')
      .attr('d', 'M -8,-4 L 8,-4 L 0,10 Z')
      .attr('fill', legendColor)

    movedDownGroup
      .append('text')
      .attr('x', 15)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .style('fill', legendColor)
      .style('font-family', config.font_family)
      .style('font-size', '12px')
      .text('Moved down')

    // Star - new entry
    const newEntryGroup = legendGroup
      .append('g')
      .attr(
        'transform',
        `translate(${legendStartX + legendItemSpacing * 3 + 225}, ${legendY})`
      )

    const legendStarPath =
      'M 0,-8 L 2.1,-2.6 L 7.6,-2.6 L 3.1,0.6 L 4.8,5.9 L 0,2.6 L -4.8,5.9 L -3.1,0.6 L -7.6,-2.6 L -2.1,-2.6 Z'

    newEntryGroup
      .append('path')
      .attr('d', legendStarPath)
      .attr('fill', legendColor)

    newEntryGroup
      .append('text')
      .attr('x', 15)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .style('fill', legendColor)
      .style('font-family', config.font_family)
      .style('font-size', '12px')
      .text('New entry')
  }
}
