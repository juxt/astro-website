# WeasyPrint Print PDF Lessons Learned

This document captures hard-won lessons from implementing print-ready PDFs with bleed areas and printer's marks using WeasyPrint. Many of these findings were counterintuitive and took significant experimentation to discover.

## The Core Problem

We needed PDFs with:
- 3mm bleed area on all sides
- Crop marks and registration marks (printer's marks)
- Colored backgrounds that extend fully into the bleed area
- Printer's marks that remain visible (not covered by content)

## Key Insight #1: @page Backgrounds vs Element Backgrounds

**This is the most important lesson.**

- **@page backgrounds** render *underneath* printer's marks - marks remain visible
- **Element backgrounds** render *on top of* printer's marks - marks get covered

If you need a background to extend into the bleed AND keep marks visible, you MUST use @page backgrounds (via `background-color` or `background-image`), not element backgrounds.

```css
/* GOOD: Marks will be visible */
@page cover {
  background-color: #dbefef;
}
.cover-page {
  background: transparent !important;
}

/* BAD: Marks will be covered */
.cover-page {
  background: #dbefef;
  margin: -3mm; /* extending into bleed */
}
```

## Key Insight #2: Coordinate System Offset

**@page gradients and element positioning use different coordinate systems.**

We discovered empirically that there's approximately a **20mm offset** between them. When we set both a gradient stop and an element's `top` position to 53mm, they didn't align - they overlapped by about 20mm.

The working solution:
- Gradient stops at **29mm** (in @page coordinate system)
- Element positioned at **49mm** (in element coordinate system)
- These visually align with a small intentional gap

**Lesson:** Don't assume the same mm value will produce the same visual position in @page backgrounds vs element positioning. Test empirically and adjust.

## Key Insight #3: Percentages vs Absolute Units in @page Gradients

Early on, we believed percentages were *required* for @page backgrounds to extend into the bleed area. This turned out to be partially true but nuanced:

- **Percentages work** and scale with the page (including bleed)
- **Absolute units (mm) also work** for gradient stops
- The key is using `background-size: 100% 100%` to ensure the gradient covers the full area

```css
/* Both of these work for extending into bleed */
@page {
  /* Percentage approach */
  background-image: linear-gradient(to right, #ea580c 0%, #ea580c 11%, #fff 11%);

  /* Absolute unit approach */
  background-image: linear-gradient(to bottom, #E8AA41 0mm, #E8AA41 29mm, transparent 29mm);

  background-size: 100% 100%;
}
```

## Key Insight #4: Element-Based Bleed Extension

Elements CAN extend into the bleed area using negative margins:

```css
.element {
  margin-left: -23mm; /* 20mm margin + 3mm bleed */
  width: 108mm;       /* original 105mm + 3mm extension */
}
```

**But remember:** This will cover printer's marks where the element overlaps them. Only use this approach for elements that don't overlap with where marks appear (e.g., a grey box below the top marks area).

## Key Insight #5: The page: Property and Selector Specificity

When assigning named pages via CSS, watch your selectors carefully:

```html
<section class="category-cover-page techniques">
```

```css
/* WRONG: Looks for .category-cover-page INSIDE .techniques */
.techniques .category-cover-page {
  page: my-page;
}

/* RIGHT: Both classes on same element */
.category-cover-page.techniques {
  page: my-page;
}
```

## Key Insight #6: Fixed Heights for Consistent Layout

Variable content length (e.g., different description text) causes subsequent content to shift vertically. This created problems where content "rode up" into header areas on pages with shorter descriptions.

**Solution:** Use fixed heights on container elements:

```css
.category-cover-header {
  height: 48mm;        /* Fixed height regardless of content */
  overflow: visible;   /* Allow content to overflow if needed */
}
```

This ensures content below the header always starts at the same vertical position.

## Key Insight #7: Separating Background Color from Content Positioning

The breakthrough solution separated two concerns:

1. **@page gradient** controls the visible background color (29mm)
2. **Element height** controls where content flows (48mm)

These don't need to match! The gradient provides color for the header area, while the element height pushes content down to the correct position.

```css
@page category-cover {
  background-image: linear-gradient(to bottom, #color 0mm, #color 29mm, transparent 29mm);
}

.category-cover-header {
  background: transparent !important;  /* Let @page show through */
  height: 48mm;                        /* But take up more space for layout */
}
```

## Key Insight #8: Multiple @page Rules for Different Sections

Each section that needs different styling requires its own @page rule:

```css
@page cover { /* ... */ }
@page thank-you { /* ... */ }
@page category-cover-languages { /* ... */ }
@page category-cover-techniques { /* ... */ }
/* etc. */
```

Assign pages to elements:
```css
.cover-page { page: cover; }
.thank-you-page { page: thank-you; }
.category-cover-page.languages-frameworks { page: category-cover-languages; }
```

## Key Insight #9: The Grey Box Solution

For elements that need to:
- Extend into the bleed on one side (left)
- NOT cover printer's marks
- Align with other page elements (footer)

We used a hybrid approach:
- Element-based positioning with negative margins for bleed extension
- Positioned below the area where top marks appear
- Height calculated to align with footer

```css
.category-absolute-left-split {
  margin-left: -23mm !important;  /* Extend into left bleed */
  width: 108mm !important;        /* Original + bleed extension */
  top: 49mm !important;           /* Below header/marks area */
  height: 234mm !important;       /* Calculated to align with footer */
}
```

## What We Wish We'd Known From the Start

1. **Test @page backgrounds first** - Before trying to extend elements into bleed, check if an @page background can achieve the same visual result. It's simpler and keeps marks visible.

2. **The coordinate systems differ** - Don't expect mm values to match between @page and element positioning. Plan for empirical adjustment.

3. **Separate color from layout** - The background color height and the element height that controls content flow can (and often should) be different values.

4. **Named pages need correct selectors** - Double-check whether classes are on the same element or parent/child before writing selectors.

5. **Fixed heights solve variable content** - If content length varies and causes layout shifts, fix the container height.

6. **WeasyPrint's marks are outside the bleed** - Printer's marks are rendered in the area beyond the bleed. Content in the bleed area is fine; content extending past the bleed covers marks.

## Quick Reference: Print Override Pattern

```css
/* Base: Add bleed and marks to all pages */
@page {
  bleed: 3mm;
  marks: crop cross;
}

/* For full-bleed solid color backgrounds */
@page my-page {
  bleed: 3mm;
  marks: crop cross;
  background-color: #color;
}
.my-element {
  page: my-page;
  background: transparent !important;
}

/* For partial backgrounds (e.g., colored header band) */
@page my-page {
  bleed: 3mm;
  marks: crop cross;
  background-image: linear-gradient(to bottom, #color 0mm, #color 29mm, transparent 29mm);
  background-size: 100% 100%;
}
.my-header {
  background: transparent !important;
  height: 48mm;  /* Controls content flow, independent of gradient */
}

/* For elements extending into bleed (where marks coverage is acceptable) */
.my-element {
  margin-left: -23mm;  /* 20mm margin + 3mm bleed */
  width: calc(original-width + 3mm);
}
```

## Files Reference

- `templates/print-overrides.css` - All print-specific CSS overrides
- `templates/styles.css` - Base styles (screen and print)
- `generate.py` - Python script with `--print` flag for print mode
