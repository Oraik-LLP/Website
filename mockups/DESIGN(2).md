---
name: Cobalt Kinetic
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c6c5d8'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8f8fa1'
  outline-variant: '#454556'
  surface-tint: '#bec2ff'
  primary: '#bec2ff'
  on-primary: '#0005aa'
  primary-container: '#1a23d2'
  on-primary-container: '#a7adff'
  inverse-primary: '#3c46e9'
  secondary: '#c9c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#c8c6c5'
  on-tertiary: '#303030'
  tertiary-container: '#464646'
  on-tertiary-container: '#b6b4b3'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bec2ff'
  on-primary-fixed: '#00026c'
  on-primary-fixed-variant: '#1c25d3'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 84px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h1:
    fontFamily: Space Grotesk
    fontSize: 60px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  grid_columns: '12'
  gutter: 24px
  margin: 40px
---

## Brand & Style

This design system embodies a "Tech-noir" aesthetic, merging the aggressive performance cues of high-end gaming hardware with the sophisticated utility of professional engineering tools. It is designed for an audience that values raw power, precision, and futuristic innovation. 

The visual language utilizes **Minimalism** for layout structure but enhances it with **Glassmorphism** and **High-Contrast** accents. The emotional goal is to feel "overclocked"—vibrant, fast, and unyielding. It relies on the tension between deep, infinite blacks and razor-sharp glowing elements to create a sense of depth and technical superiority.

## Colors

The palette is anchored in absolute darkness to allow the cobalt blue accent to "perforate" the UI. 

- **Primary:** The Cobalt Blue (#1A23D2) is reserved for high-action items, status indicators, and focal points.
- **Surface Tiers:** Pure black (#000000) is the base, with Deep Charcoal (#0A0A0A) and Slate Gray (#262626) used to define depth and container boundaries.
- **Typography:** High-contrast white is the standard, while mid-range grays are used for metadata to maintain visual hierarchy.
- **Secondary Light Theme:** Specific case-study sections or "white-paper" areas may invert to a high-contrast white background with black typography, retaining the Cobalt Blue as the primary interactive bridge.

## Typography

The typography strategy pairs a technical, geometric display face with a utilitarian sans-serif for legibility.

- **Headlines:** Use Space Grotesk with tight tracking and bold weights. This provides the "wide," premium feel associated with tech-noir aesthetics.
- **Body:** Inter is used for all long-form content to ensure maximum readability against dark backgrounds. 
- **Accents:** Small-caps labels in Space Grotesk should be used for technical data points, categories, and breadcrumbs to reinforce the "instrument cluster" feel.

## Layout & Spacing

This design system uses a **fixed grid** model for desktop to maintain strict alignment and a sense of architectural intent. 

- **Grid:** A 12-column grid with generous gutters allows for technical "call-outs" and floating imagery.
- **Rhythm:** Spacing follows an 8px baseline. Use larger increments (80px+) between sections to create cinematic breathing room. 
- **Alignment:** Elements should feel "locked" to the grid. Use hard vertical lines or thin 1px borders to visually connect sections, mimicking the internal circuitry of high-performance hardware.

## Elevation & Depth

Depth is conveyed through **Glassmorphism** and **Tonal Layering** rather than traditional drop shadows.

1.  **Level 0 (Base):** Pure #000000.
2.  **Level 1 (Cards/Containers):** #0A0A0A with a 1px border of #262626.
3.  **Level 2 (Overlays):** Semi-transparent charcoal with a `backdrop-filter: blur(20px)`.
4.  **Accent Depth:** Use "inner glows" on interactive elements using the Cobalt Blue at low opacity to suggest the component is powered from within. Avoid diffused ambient shadows; keep light effects contained and purposeful.

## Shapes

The shape language is strictly **Sharp (0px)**. To reflect the high-performance tech inspiration, the system avoids rounded corners entirely. This communicates precision and industrial strength. 

Angled cuts (45-degree chamfers) can be used on decorative corners of large containers or buttons to emphasize the "stealth fighter" or "hardware" aesthetic.

## Components

- **Buttons:** Rectangular with 0px radius. Primary buttons use a solid Cobalt Blue background with white text. Secondary buttons use a transparent background with a 1px white or blue border and a subtle "glow" on hover.
- **Glass Cards:** Used for secondary content. Features a 1px border (#ffffff at 10% opacity) and a heavy background blur.
- **Inputs:** Dark backgrounds with a 1px bottom-border only. On focus, the border transitions to Cobalt Blue with a subtle outer neon glow.
- **Chips/Badges:** Monochromatic (Dark Gray) with uppercase technical font. Blue is only used for "Active" or "Live" status.
- **Imagery:** Product images should feature high-contrast lighting, preferably with rim-lighting that matches the Cobalt Blue accent.
- **Data Visualizations:** Use thin, glowing lines and "dot-matrix" patterns for graphs to maintain the tech-noir narrative.