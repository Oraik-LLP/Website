---
name: High-Performance Tactical Light
colors:
  surface: '#fbf8ff'
  surface-dim: '#dbd8e6'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#efecfa'
  surface-container-high: '#e9e7f4'
  surface-container-highest: '#e3e1ee'
  on-surface: '#1a1b24'
  on-surface-variant: '#454556'
  inverse-surface: '#2f303a'
  inverse-on-surface: '#f1effd'
  outline: '#767687'
  outline-variant: '#c6c5d8'
  surface-tint: '#3c46e9'
  primary: '#0004a7'
  on-primary: '#ffffff'
  primary-container: '#1a23d2'
  on-primary-container: '#a7adff'
  inverse-primary: '#bec2ff'
  secondary: '#5d5f5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#636564'
  tertiary: '#630a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#8c1300'
  on-tertiary-container: '#ff9883'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bec2ff'
  on-primary-fixed: '#00026c'
  on-primary-fixed-variant: '#1c25d3'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#ffb4a5'
  on-tertiary-fixed: '#3e0400'
  on-tertiary-fixed-variant: '#8e1401'
  background: '#fbf8ff'
  on-background: '#1a1b24'
  surface-variant: '#e3e1ee'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-readout:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin: 24px
---

## Brand & Style

This design system is engineered for operational precision, merging high-stakes business utility with the aesthetics of a technical cyberdeck. The brand personality is authoritative yet transparent, designed to evoke a sense of "Information Sovereignty." 

The style is **Modern Minimalist with Brutalist influences**, utilizing sharp edges, high-contrast ratios, and hairline-thin structural elements to convey speed and technical accuracy. It avoids decorative fluff in favor of functional density, making it ideal for data-heavy environments where legibility and rapid information processing are paramount.

## Colors

The palette is anchored by the **Cobalt Blue (#1A23D2)**, representing the "active signal" or primary action state. This is contrasted against a stark **Crisp White (#FFFFFF)** canvas and **Very Light Gray (#F8F9FA)** for secondary surface differentiation. 

**Deep Charcoal (#121414)** is reserved for all primary text and critical UI indicators, ensuring a high-contrast ratio that exceeds accessibility standards. Secondary data points and "tactical" UI elements (like grids and coordinates) utilize varying opacities of charcoal or subtle cobalt strokes to maintain a clear visual hierarchy without cluttering the workspace.

## Typography

**Space Grotesk** is the sole typeface, chosen for its technical apertures and sharp terminals which reflect the cyberdeck inspiration. 

- **Headlines:** Use Bold weights with tight letter-spacing to create a sense of urgency and impact.
- **Body:** Regular weight with generous line-height for maximum readability during long sessions.
- **Data Readouts:** To mimic a monospaced aesthetic using Space Grotesk, use the "Label-mono" or "Data-readout" styles, which employ uppercase transformations and increased letter-spacing. These should be used for status indicators, coordinates, and system logs.

## Layout & Spacing

The design system utilizes a **12-column Fixed Grid** for desktop and a fluid single-column for mobile. A strict **4px baseline grid** governs all vertical rhythm to ensure technical alignment.

Layouts should favor high-density information display. Use 1px hairline borders in `#E5E7EB` or `rgba(26, 35, 210, 0.1)` to separate content zones instead of wide gutters. Margins are kept tight to maximize the "screen real estate" feel of a tactical terminal.

## Elevation & Depth

This design system rejects soft shadows in favor of **Tonal Layering and Tactical Outlines**. Depth is communicated through:

1.  **Surface Tiers:** Background levels shift from `#FFFFFF` (Level 0) to `#F8F9FA` (Level 1) to define nested containers.
2.  **Stroke Hierarchy:** Primary containers are defined by 1px solid Deep Charcoal or Cobalt borders. 
3.  **The "Inset" Effect:** Interactive areas like input fields should feel "recessed" into the surface using a subtle 1px inner stroke, while active panels are "overlayed" using a sharp 2px offset "drop-block" (a solid black stroke offset by 2px) rather than a blur.

## Shapes

The shape language is strictly **Sharp (0px radius)**. Every button, card, input field, and modal must utilize 90-degree angles. This reinforces the technical, high-performance nature of the system. 

To break the rigidity, use "clipped corners" (45-degree chamfers) on primary action buttons or decorative UI accents to lean further into the cyberdeck aesthetic.

## Components

- **Buttons:** Sharp-edged boxes with high-contrast fills. Primary buttons use the Cobalt Blue background with White text. Secondary buttons use a Deep Charcoal 1px border with Cobalt text.
- **Cyberdeck Indicators:** Use "crosshair" icons in the corners of cards or small monospaced "01/02/03" index numbers to denote list items.
- **Hairline Grids:** Backgrounds for dashboard sections should feature a faint 16px or 32px square grid pattern in `#F1F1F1` to ground the elements.
- **Input Fields:** No background fill; only a bottom border (2px) in Deep Charcoal. On focus, the border turns Cobalt Blue with a small "focus indicator" (a 4x4px blue square) appearing in the top-right corner.
- **Chips/Status:** Small, sharp rectangles with a 1px border. For "Active" status, use a solid Cobalt dot next to the text.
- **Tactical Lists:** Rows separated by 1px hairlines. Hover states should trigger a full-row background shift to `#F8F9FA` and a Cobalt blue "marker" on the far left edge (2px width).