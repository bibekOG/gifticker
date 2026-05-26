---
name: Gifticker Editorial
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#54433e'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#87736d'
  outline-variant: '#dac1ba'
  surface-tint: '#924a31'
  primary: '#8f482f'
  on-primary: '#ffffff'
  primary-container: '#ad5f45'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59d'
  secondary: '#605e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2de'
  on-secondary-container: '#666461'
  tertiary: '#00685f'
  on-tertiary: '#ffffff'
  tertiary-container: '#0f8378'
  on-tertiary-container: '#f4fffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#75331c'
  secondary-fixed: '#e6e2de'
  secondary-fixed-dim: '#cac6c2'
  on-secondary-fixed: '#1c1b19'
  on-secondary-fixed-variant: '#484644'
  tertiary-fixed: '#94f3e6'
  tertiary-fixed-dim: '#77d7ca'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 72px
    fontWeight: '500'
    lineHeight: 80px
    letterSpacing: -1.5px
  headline-xl:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -1px
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.5px
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.3px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: 0px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono:
    fontFamily: Courier Prime
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
spacing:
  page-padding: 96px
  section-gap: 128px
  element-gap: 24px
  gutter: 32px
  margin-sm: 16px
  max-width: 1200px
---

## Brand & Style

This design system is built on a foundation of intellectual elegance and editorial precision. It evokes the feeling of a high-end literary journal or a bespoke physical archive, prioritizing clarity, white space, and a sophisticated "human-made" aesthetic.

The style is a blend of **Minimalism** and **Modern Editorial**. It leverages generous negative space (96px standard breathing room) to focus the user's attention on content. The interface feels intentional and grounded, avoiding unnecessary animations or "app-like" gimmicks in favor of a static, authoritative presence. Utility areas utilize a "Console" metaphor—shifting into a dark obsidian mode to signal a change from consumption to creation or technical configuration.

## Colors

The palette is anchored by a warm cream canvas that reduces eye strain and provides a premium, tactile feel.

- **Canvas (#faf9f5):** The primary background color. Used for all main editorial surfaces.
- **Ink (#141413):** The high-contrast text color, used for all primary reading experiences to ensure maximum legibility.
- **Coral (#cc785c):** The "Anthropic-inspired" call-to-action color. It is used sparingly for primary buttons and high-priority indicators.
- **Obsidian (#181715):** Reserved for "Utility Consoles," code blocks, or footer areas to provide a stark, functional contrast to the editorial cream.
- **Hairline (#e6dfd8):** Used for thin 1px borders to define structure without creating visual noise.

## Typography

The typography system relies on a high-contrast pairing of an authoritative serif and a functional sans-serif.

- **Headlines:** Set in Source Serif 4 (as a proxy for Tiempos/Cormorant). These must use negative letter-spacing to create a "tight" editorial look. Display sizes use the most aggressive tracking (-1.5px).
- **Body:** Set in Inter for neutral, systematic reading. Line heights are generous (1.6x) to facilitate long-form reading.
- **Utility:** Use uppercase labels for navigation and small metadata to distinguish them from the narrative flow.
- **Monospace:** Reserved for the Obsidian console areas and technical identifiers.

## Layout & Spacing

The layout philosophy is defined by **Asymmetric Composition** and intentional voids. 

- **The 96px Rule:** All primary containers must maintain a minimum of 96px padding from the viewport edges on desktop.
- **Grid:** A 12-column fluid grid is used, but content should rarely span the full width. Aligning primary text columns to 7 or 8 columns while leaving the remaining space for marginalia or asymmetrical imagery is encouraged.
- **Hairlines:** Use 1px #e6dfd8 lines to separate sections horizontally or vertically. These should often bleed into the page margins to emphasize the grid.
- **Mobile:** On mobile devices, the 96px padding scales down to 24px, and the 12-column grid collapses to a single column, maintaining the serif-led hierarchy.

## Elevation & Depth

This system avoids shadows entirely to maintain its flat, printed aesthetic. Depth is communicated through:

- **Tonal Layering:** The Obsidian (#181715) utility areas are placed "behind" or "inside" the Cream (#faf9f5) canvas, appearing as recessed windows or technical inserts.
- **Hairline Boundaries:** Subtle 1px borders define the physical limits of components like cards or input fields.
- **Contrast Shifts:** Direct interaction (hover/active) is signaled through color shifts (e.g., Coral darkening slightly) rather than lifting the element off the page.

## Shapes

To maintain the architectural and editorial rigor of the brand, a **Sharp (0px)** roundedness policy is enforced across all components.

- **Buttons & Inputs:** Hard 90-degree corners only.
- **Images:** All photography and illustrations must be contained within sharp-edged frames.
- **Consoles:** The Obsidian utility areas also follow the 0px rule, ensuring they feel like integrated modules of the layout rather than floating windows.

## Components

### Buttons
- **Primary:** Coral (#cc785c) background, White (#ffffff) text, sharp corners. No border.
- **Secondary:** Transparent background, 1px Hairline (#e6dfd8) border, Ink (#141413) text.
- **Ghost:** Ink text, no background or border, used for low-priority navigation.

### Consoles (Utility Areas)
- **Background:** Obsidian (#181715).
- **Text:** White or light-grey.
- **Usage:** Used for technical input, code snippets, or account management dashboards.

### Cards
- Defined by a 1px #e6dfd8 border.
- No shadows.
- Generous internal padding (32px or 48px).

### Inputs
- **Style:** Underline only or 1px border. 
- **Typography:** Inter 16px. 
- **Focus state:** Border color shifts to Coral (#cc785c).

### Hairline Dividers
- 1px thick.
- Horizontal dividers should often be accompanied by a small label-caps category name sitting just above the line.