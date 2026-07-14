---
name: SmartBudget
description: A personal finance tracker with real-time budget control, flat and quietly confident.
colors:
  growth-green: "oklch(0.8506 0.2199 152.5506)"
  growth-green-dark: "oklch(0.4365 0.1044 156.7556)"
  ink-on-green: "oklch(0.2626 0.0147 166.4589)"
  ink-on-green-dark: "oklch(0.9213 0.0135 167.1556)"
  surface: "oklch(0.9911 0 0)"
  surface-dark: "oklch(0.1822 0 0)"
  ink: "oklch(0.2046 0 0)"
  ink-dark: "oklch(0.9288 0.0126 255.5078)"
  quiet-gray: "oklch(0.9461 0 0)"
  quiet-gray-dark: "oklch(0.2393 0 0)"
  hairline: "oklch(0.9037 0 0)"
  hairline-dark: "oklch(0.2809 0 0)"
  alert-red: "oklch(0.5523 0.1927 32.7272)"
  chart-blue: "oklch(0.6231 0.188 259.8145)"
  chart-violet: "oklch(0.6056 0.2189 292.7172)"
  chart-gold: "oklch(0.7686 0.1647 70.0804)"
  chart-teal: "oklch(0.6959 0.1491 162.4796)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 4vw + 1.75rem, 5.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 2.5vw + 1.5rem, 3rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.025em"
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.growth-green}"
    textColor: "{colors.ink-on-green}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "{colors.growth-green}"
    textColor: "{colors.ink-on-green}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "16px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "4px 10px"
    height: "32px"
  badge-primary:
    backgroundColor: "{colors.growth-green}"
    textColor: "{colors.ink-on-green}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "20px"
---

# Design System: SmartBudget

## 1. Overview

**Creative North Star: "Quiet Confidence"**

SmartBudget's product surface doesn't perform difficulty. Surfaces are flat and near-silent — a near-white canvas, near-black text, a single hairline ring standing in for borders — so that the one color the system permits itself, a fresh mint growth-green, reads as a genuine signal rather than decoration. The system earns trust by getting out of the way: no gradients, no ambient shadows on resting surfaces, no competing accents. Depth is reserved for things that are actually elevated off the page (menus, dialogs, sheets); everything else sits flat against the canvas.

This rejects the generic-fintech look explicitly — no navy-and-gold, no corporate stock-photo chrome, no manufactured urgency. It also rejects card-on-card nesting and gratuitous elevation: a card is a hairline ring, not a drop shadow, and it never contains another card.

**Key Characteristics:**
- One accent, used deliberately: growth-green marks primary actions, positive state, and brand identity — nowhere else.
- Flat by default: cards, inputs, and buttons rest without shadow; only floating layers (dialog, popover, sheet, dropdown, select) cast one.
- Small, quiet type: no display-scale text exists yet in the product register; the largest heading in the current app is a 1.5rem page title.
- Tight, consistent radius scale: 8px for interactive controls, 12px for containers.
- A deliberate display role now exists: Bricolage Grotesque carries hero and section headlines wherever the brand register needs one, layered on top of the system-sans body the product register already used.

## 2. Colors

A near-monochrome neutral base (pure gray, zero chroma) with exactly one saturated color let through the door.

### Primary
- **Growth Green** (`oklch(0.8506 0.2199 152.5506)` / dark: `oklch(0.4365 0.1044 156.7556)`): the only saturated color in the system. Used for primary buttons, the active nav indicator, the primary badge, chart series 1, focus rings, and the page-load progress bar. Its ink counterpart, **Ink on Green** (`oklch(0.2626 0.0147 166.4589)` / dark: `oklch(0.9213 0.0135 167.1556)`), is the only text color ever placed on top of it.

### Neutral
- **Surface** (`oklch(0.9911 0 0)` / dark: `oklch(0.1822 0 0)`): page and card background. Pure neutral — zero chroma, no warm or cool tint.
- **Ink** (`oklch(0.2046 0 0)` / dark: `oklch(0.9288 0.0126 255.5078)`): primary text.
- **Quiet Gray** (`oklch(0.9461 0 0)` / dark: `oklch(0.2393 0 0)`): muted surfaces — secondary buttons, hover states, disabled fills.
- **Hairline** (`oklch(0.9037 0 0)` / dark: `oklch(0.2809 0 0)`): the single border/ring token used everywhere a divider or card edge is needed.
- **Alert Red** (`oklch(0.5523 0.1927 32.7272)`): destructive actions and error states only.

### Chart palette (secondary roles, data contexts only)
- **Chart Blue** `oklch(0.6231 0.188 259.8145)`, **Chart Violet** `oklch(0.6056 0.2189 292.7172)`, **Chart Gold** `oklch(0.7686 0.1647 70.0804)`, **Chart Teal** `oklch(0.6959 0.1491 162.4796)`: reserved for chart series 2-5 in Recharts visualizations. Never used for UI chrome, buttons, or badges — that would dilute Growth Green's exclusivity as the brand signal.

### Named Rules
**The One Signal Rule.** Growth Green is the only saturated color allowed outside chart contexts. If a second accent color feels necessary anywhere in the UI, the answer is a neutral (Quiet Gray) or an opacity of the existing ink, not a new hue.

## 3. Typography

**Display Font:** Bricolage Grotesque (via `next/font/google`, `--font-heading`, `font-display: swap`) — an expressive grotesk, distinct from the Inter/Space-Grotesk reflex, chosen for the "modern and energetic, not generic fintech" brand personality in PRODUCT.md. Wired as the `font-heading` Tailwind utility, so it now also carries every shadcn Title role (Card, Dialog, Sheet, Drawer) across the whole product, not just the landing page — the utility class existed already but had no token behind it until now.
**Body/UI Font:** system sans stack — `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Unchanged: body copy stays on the fast, neutral system stack in both registers.
**Mono Font:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` (defined as a token; not yet used in a visible UI role).

**Character:** The pairing is a deliberate contrast: an expressive, slightly quirky display face for headlines against a neutral, invisible system-sans body — display type carries brand voice, body type carries information and stays out of the way.

### Hierarchy
- **Display** (600, `clamp(2.75rem, 4vw + 1.75rem, 5.5rem)`, 1.05 line-height, -0.03em tracking): hero headlines on brand-register surfaces (the landing page). `text-balance` applied.
- **Headline** (600, `clamp(2rem, 2.5vw + 1.5rem, 3rem)`, 1.15 line-height, -0.02em tracking): section-level headings on brand-register surfaces.
- **Title** (700, 1.5rem, 1.3 line-height): page-level headings in the product register (e.g. the Plans page title), and the shadcn Title role (Card/Dialog/Sheet/Drawer) everywhere, now rendered in Bricolage Grotesque instead of falling back silently to the body stack.
- **Body** (400, 0.875rem, 1.5 line-height, +0.025em tracking): default UI text, form labels, card content. Global `letter-spacing: var(--tracking-normal)` (0.025em) is applied at the body level.
- **Label** (500, 0.75rem, 1.4 line-height): badges, chips, small metadata.

### Named Rules
**The One Display Family Rule.** Bricolage Grotesque is the only display face in the system, used for Display and Headline roles on brand surfaces and for the Title role everywhere. Don't introduce a second display family for a future surface; extend weight/size within this one instead.

## 4. Elevation

Flat by default, with elevation used structurally rather than ambiently: resting surfaces (cards, inputs, buttons) carry no shadow at all, only the 1px Hairline ring. Shadows exist solely to signal that something has left the page's plane — dialogs, sheets, popovers, dropdowns, select menus, and tooltips.

### Shadow Vocabulary
- **Ambient hairline** (no shadow; `ring-1 ring-foreground/10`): the default state for every card. This is a ring, not a shadow — it reads as a printed rule, not a lifted surface.
- **Overlay** (`box-shadow: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)`, scaling up to `--shadow-2xl` for the largest surfaces): used only by components that render in a portal above the page (dialog, sheet, popover, dropdown-menu, select).

### Named Rules
**The Floating-Only Rule.** If a component renders inline in the document flow, it does not get a shadow — a Hairline ring is the ceiling. Shadows are earned exclusively by leaving the page's stacking context.

## 5. Components

### Buttons
- **Shape:** 8px radius (`rounded-lg`), 32px height at default size, tight 10px horizontal padding.
- **Primary:** Growth Green background, Ink-on-Green text; hover drops to 80% opacity rather than shifting hue.
- **Outline / Secondary / Ghost:** transparent or Quiet Gray backgrounds with Hairline borders; hover fills with Quiet Gray.
- **Destructive:** Alert Red at 10% background opacity with full-opacity Alert Red text — a tint, never a solid red fill, so it reads as a warning rather than an alarm.
- **Hover / Focus:** no transform on hover; a 1px downward press (`translate-y-px`) on active, and a 3px Growth-Green-tinted focus ring (`ring-ring/50`) on keyboard focus.

### Badges / Chips
- **Style:** pill-shaped (`rounded-4xl`, effectively fully rounded), 20px height, 8px horizontal padding, 0.75rem label text.
- **State:** default variant is solid Growth Green; secondary/outline/ghost variants follow the same neutral logic as buttons.

### Cards / Containers
- **Corner Style:** 12px radius (`rounded-xl`) — one step larger than interactive controls, so containers read as a level above the controls they hold.
- **Background:** Surface color, no gradient, no tint.
- **Shadow Strategy:** none at rest (see Elevation) — a single Hairline ring (`ring-1 ring-foreground/10`) stands in for a border.
- **Border:** none beyond the ring; a card footer gets a top hairline divider and a Quiet-Gray-tinted background instead of a shadow to separate it from content.
- **Internal Padding:** 16px (px-4), tightening to 12px in the compact `size="sm"` variant.

### Inputs / Fields
- **Style:** transparent background, Hairline border, 8px radius, 32px height.
- **Focus:** border shifts to Ring color plus a 3px Growth-Green-tinted focus ring — no glow, no scale change.
- **Error / Disabled:** invalid state uses Alert Red border and ring; disabled drops to 50% opacity with a Quiet-Gray fill.

### Navigation
Not yet built for the landing page (no public nav exists). The authenticated app nav uses the Sidebar primitive with Quiet Gray hover/active fills and a Growth Green active-state accent — that vocabulary (flat, one accent, no shadow) is the reference point for any new public header/nav built for the landing page.

## 6. Do's and Don'ts

### Do:
- **Do** keep Growth Green as the only saturated UI color; everything else is neutral or a chart-only hue.
- **Do** use a Hairline ring (`ring-1 ring-foreground/10`), not a shadow, for any surface that rests in the page's normal flow.
- **Do** reserve real box-shadows for components that render in a portal above the page (dialogs, sheets, popovers, menus).
- **Do** keep the 8px/12px radius relationship: controls at 8px, containers one step up at 12px.
- **Do** use the Display/Headline Bricolage Grotesque roles for any new brand-register surface's headings; don't scale up Title or introduce a second display face.

### Don't:
- **Don't** build a generic-fintech look: no navy-and-gold palette, no corporate stock photography, no enterprise-dashboard chrome (per PRODUCT.md's anti-reference).
- **Don't** add a second saturated accent color outside chart contexts to "add warmth" or "add energy" — Growth Green carries all of the brand's color weight by design.
- **Don't** nest cards inside cards, or add a shadow to a resting card to make it feel "lifted."
- **Don't** use `border-left` or `border-right` as a colored accent stripe on cards or callouts.
- **Don't** use `background-clip: text` gradient text for emphasis — weight and size carry emphasis in this system.
