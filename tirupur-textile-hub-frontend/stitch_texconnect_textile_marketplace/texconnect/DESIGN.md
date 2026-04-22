---
name: Texconnect
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#944a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd933d'
  on-secondary-container: '#693300'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#ffb783'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#713700'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.04em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 12px
---

## Brand & Style

This design system is built on the principles of **Modern Minimalism** tailored for the B2B textile industry. The visual language prioritizes utility and clarity to facilitate high-volume commerce while maintaining a sophisticated, editorial feel. 

The aesthetic focuses on extreme whitespace and a "mobile-first" architecture, ensuring that manufacturers and buyers can navigate complex inventories on the go. The tone is professional and trustworthy, utilizing a restrained color palette and precise geometric shapes to evoke the feeling of a high-end, organized showroom.

## Colors

The palette is anchored by a trustworthy **Primary Blue**, used for core actions and brand identification. The **Accent Orange** is used sparingly for high-visibility triggers, such as "Request Quote" or "New Arrival" badges, creating a warmth that contrasts with the professional blue.

The neutral foundations utilize a pure white for surfaces to maximize the "lots of whitespace" requirement, while the light gray secondary background provides a subtle distinction between the canvas and nested containers. Text colors are kept in the deep slate range rather than pure black to maintain a softer, modern appearance.

## Typography

This design system utilizes **Inter** for all typographic needs to take advantage of its exceptional legibility and systematic, utilitarian feel. The hierarchy is strictly enforced through weight and scale, ensuring that product specifications and pricing are always the primary focus.

Headline styles use a slightly tighter letter-spacing and heavier weights to create a grounded, authoritative presence. Body text is optimized with a generous line height (1.5–1.6) to ensure long product descriptions remain readable on smaller mobile screens.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** approach designed for mobile-first responsiveness. On mobile devices, a standard 2-column or 1-column layout is used with 16px side margins. As the viewport expands to desktop, the layout centers within a max-width container of 1200px.

A strict 4px/8px baseline grid is used to maintain vertical rhythm. Whitespace should be used aggressively to separate product categories and information blocks, preventing the dense "spreadsheet" feel common in B2B marketplaces. Components should prioritize internal padding (minimum 16px) to maintain the clean, airy aesthetic.

## Elevation & Depth

To achieve a modern, soft feel, this design system uses **Ambient Shadows** instead of harsh borders. Shadows are highly diffused with low opacity, creating a sense of "lifting" rather than "stacking."

- **Level 1 (Cards/Inputs):** A subtle 4px Y-offset with a 12px blur at 5% black opacity.
- **Level 2 (Hover/Active):** An 8px Y-offset with a 20px blur at 8% black opacity.
- **Level 3 (Modals/Overlays):** A 16px Y-offset with a 40px blur at 12% black opacity.

Tonal layering is used to differentiate the background (`#F5F5F5`) from the interactive surfaces (`#FFFFFF`), ensuring the user's eye is naturally drawn to the content areas.

## Shapes

The shape language is defined by a consistent **12px (0.75rem) corner radius**, which strikes a balance between professional geometry and modern approachable design. 

Large containers and product image cards utilize a larger 16px (1rem) radius to feel substantial, while smaller elements like tags and checkboxes use a 4px-6px radius to maintain precision. This consistent rounding softens the overall interface, making the professional marketplace feel more accessible and simple to use.

## Components

### Buttons
Primary buttons are solid `#2563EB` with white text and 12px rounded corners. Secondary buttons use a light gray background or a simple outline to maintain a lower visual weight. All buttons should have a minimum height of 48px on mobile to ensure tap-friendliness.

### Inputs
Fields use a white background with a subtle 1px border in a light gray and 12px rounded corners. Upon focus, the border transitions to the Primary Blue. Error states are indicated by a 1px red border and a soft red tint on the label.

### Cards
Cards are the primary vessel for product information. They feature a white background, the Level 1 Ambient Shadow, and no border. Padding inside cards is a standard 16px or 24px depending on content density.

### Chips & Tags
Textile category tags use a soft background (10% opacity of the primary or secondary color) with 12px rounding. This keeps the information legible without competing with primary call-to-action buttons.

### Textile Swatches
A specific component for this marketplace: swatches should be displayed in 12px rounded squares with a subtle inner border to define light-colored fabrics against the white background.

### Lists
Mobile lists use full-width white rows with subtle horizontal dividers (`#F5F5F5`). Each list item should have a minimum height of 64px to accommodate professional interactions.