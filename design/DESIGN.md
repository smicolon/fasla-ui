---
version: alpha
name: Fasla
description: >-
  Fasla (فاصلة) is a bilingual design system in which Arabic is not a
  localisation layer but a first-class direction: every atom carries a Direction
  property, the Cairo type ramp is a 1:1 twin of the Geist ramp, and an RTL
  variant is considered part of the component rather than a downstream port. The
  visual language itself is deliberately quiet — a near-monochrome neutral
  surface built on shadcn/ui semantics where accent, muted and secondary all
  resolve to the same grey, so hierarchy is carried by weight, spacing and
  inversion rather than by colour. Everything is variable-bound in both themes,
  which is what lets a single set of tokens carry two directions and two modes
  without a second design.
colors:
  background: "#ffffff"
  foreground: "#0a0a0a"
  background-inverse: "#0a0a0a"
  foreground-inverse: "#ffffff"
  primary: "#0a0a0a"
  primary-foreground: "#fafafa"
  secondary: "#f5f5f5"
  secondary-foreground: "#171717"
  accent: "#f5f5f5"
  accent-foreground: "#171717"
  muted: "#f5f5f5"
  muted-foreground: "#737373"
  card: "#ffffff"
  card-foreground: "#0a0a0a"
  popover: "#ffffff"
  popover-foreground: "#0a0a0a"
  border: "#e5e5e5"
  input: "#e5e5e5"
  ring: "#a3a3a3"
  destructive: "#dc2626"
  success: "#16a34a"
  warning: "#d97706"
  info: "#0284c7"
  chart-1: "#ea580c"
  chart-2: "#0d9488"
  chart-3: "#164e63"
  chart-4: "#fbbf24"
  chart-5: "#f59e0b"
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.3em
  heading:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: 600
    lineHeight: 44px
  subheading:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
  body:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  small:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  eyebrow:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.08em
  body-ar:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  heading-ar:
    fontFamily: Cairo
    fontSize: 36px
    fontWeight: 600
    lineHeight: 54px
rounded:
  none: 0px
  xs: 2px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  2xl: 16px
  3xl: 24px
  4xl: 32px
  pill: 9999px
spacing:
  px: 1px
  0.5: 2px
  1: 4px
  1.5: 6px
  2: 8px
  2.5: 10px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
  20: 80px
  24: 96px
components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    height: 40px
    padding: "{spacing.2} {spacing.4}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    height: 40px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
  button-disabled:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    height: 40px
    padding: "{spacing.2} {spacing.3}"
  input-focused:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.md}"
  input-destructive:
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
  badge:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.sm}"
    padding: "{spacing.0.5} {spacing.2}"
  badge-pill:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.pill}"
  alert:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.4}"
  separator:
    backgroundColor: "{colors.border}"
    height: 1px
  tooltip:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.md}"
    padding: "{spacing.1.5} {spacing.2}"
  modal:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
---

# Fasla — Design System

## Overview

Fasla is a Tailwind- and shadcn/ui-derived component library maintained as a Figma file
(`yGEQmCZOvs7KptsYUdB0Xg`), built to ship the same product in English and Arabic without designing it
twice. It was previously called SMI-UI / smicolon; the current name is **Fasla**, written **فاصلة** in
Arabic content.

Three decisions define the system and everything else follows from them.

**Direction is a component property, not a file.** Almost every atom carries `Direction = LTR / RTL`
on the same component set. An Arabic screen is assembled from the same instances as an English one,
with one property flipped. This is the system's signature and the thing most worth protecting — see
[Do's and Don'ts](#dos-and-donts).

**Two themes, one set of bindings.** All colour lives in the `☾  Mode` collection, which has exactly
two modes, `⚪️ Light` (default) and `🌑 Dark`. Nothing is painted with a raw value, so flipping the mode
is both a feature and the cheapest possible audit: any element whose colour does not change is an
unbound fill.

**The palette is deliberately quiet.** `{colors.accent}`, `{colors.muted}` and `{colors.secondary}` all
resolve to the same neutral. The system does not have a brand hue doing hierarchical work; contrast
comes from weight, spacing, and inversion to `{colors.background-inverse}`. Designers arriving from a
more colourful system consistently mis-read this — see [Known Gaps](#known-gaps).

**Scale.** 5 variable collections / 923 variables · 134 text styles · 81 effect styles · 158 component
sets across the 44 atom pages (71 product atoms plus an 87-set low-fidelity wireframe library).

---

## Colors

Colour is defined in two layers. The `💨 Tailwind` collection (456 variables, single `Default` mode)
holds the primitives: the full 23-family Tailwind ramp at 11 steps each, 244 colours in total, which
nothing in a design should reference directly. The `☾  Mode` collection (137 variables, Light + Dark)
holds the semantic layer, and that is the only layer components bind to. A third collection,
`🌈 Themes` (306 variables), stores the concrete light and dark values plus decomposed shadow parts
that the semantic layer aliases into.

Every token below is listed as **Light → Dark**.

### Brand & accent

The system has no saturated brand colour. `{colors.primary}` is near-black `#0a0a0a → #fafafa`: in
Light it reads as "ink", in Dark as "paper". It inverts rather than shifting hue, which is what lets
one token serve as the primary action colour in both themes.

- `theme/primary` `#0a0a0a → #fafafa` — primary action fills, strong emphasis
- `theme/primary-foreground` `#fafafa → #a3a3a3` — label on a primary fill
- `theme/accent` `#f5f5f5 → #262626` — hover/active wash on interactive rows
- `theme/accent-foreground` `#171717 → #fafafa`
- `theme/secondary` `#f5f5f5 → #262626` — secondary button and chip fills
- `theme/secondary-foreground` `#171717 → #fafafa`

The saturated end of the system is the chart ramp, and it is the only place genuine hue is available:
`theme/chart-1` `#ea580c → #c2410c` (orange), `chart-2` `#0d9488 → #14b8a6` (teal), `chart-3`
`#164e63 → #f59e0b` (deep cyan → amber), `chart-4` `#fbbf24 → #a855f7`, `chart-5` `#f59e0b → #f43f5e`.
Note that `chart-3`, `chart-4` and `chart-5` change hue between modes, not just lightness — they are
tuned per theme for legibility on their own ground, so a design that relies on a specific chart hue
must be checked in both.

### Surface

- `theme/background` `#ffffff → #0a0a0a` — the page
- `theme/card` `#ffffff → #171717` — raised surfaces. Identical to background in Light and separated
  only by `{colors.border}`; genuinely lighter than background in Dark. A card that reads clearly in
  Dark can disappear in Light without its border.
- `theme/popover` `#ffffff → #0a0a0a` — menus, dropdowns, tooltip grounds
- `theme/muted` `#f5f5f5 → #262626` — inert wells, skeleton grounds, disabled fills
- `theme/sidebar` `#fafafa → #171717` — the one surface that is *not* the same as background in Light,
  giving app chrome a hairline of separation without a border
- `theme/background-inverse` `#0a0a0a → #ffffff` — the deliberate dark band. It inverts with the theme,
  so an "inverse" section is dark in Light mode and light in Dark mode. There is no always-dark token.

### Text

- `theme/foreground` `#0a0a0a → #fafafa` — body and headings
- `theme/muted-foreground` `#737373 → #d4d4d4` — supporting copy, captions, placeholders
- `theme/foreground-inverse` `#ffffff → #0a0a0a` — text on `{colors.background-inverse}`
- `theme/muted-foreground-inverse` `#d4d4d4 → #737373` — supporting copy on an inverse band; the
  correct token for eyebrows there, because `theme/primary` is near-black and vanishes
- `theme/card-foreground`, `theme/popover-foreground`, `theme/sidebar-foreground` `#404040 → #fafafa`
- `theme/accent-foreground`, `theme/secondary-foreground` `#171717 → #fafafa`

### Hairlines & borders

- `theme/border` `#e5e5e5 → #3f3f46` — every 1px rule, card edge and divider
- `theme/input` `#e5e5e5 → #ffffff a0.15` — field borders. In Dark this becomes a translucent white
  rather than a solid, so fields read as cut into the surface instead of drawn on it.
- `theme/ring` `#a3a3a3 → #737373` — focus ring, paired with the `shadow ring` effect style
- `theme/sidebar-border` `#e5e5e5 → #404040` — sidebar edges, a step lighter than `theme/border` in
  Dark so app chrome separates without a hard line

### Semantic

Each status colour ships with a paired foreground for text placed on top of it.

- `theme/destructive` `#dc2626 → #f87171` · `destructive-foreground` `#ffffff → #000000`
- `theme/success` `#16a34a → #4ade80` · `success-foreground` `#f8fafc → #0a0a0a`
- `theme/warning` `#d97706 → #fbbf24` · `warning-foreground` `#f8fafc → #0a0a0a`
- `theme/info` `#0284c7 → #7dd3fc` · `info-foreground` `#f8fafc → #0a0a0a`

Status colours **lighten** in Dark rather than inverting, because they must stay recognisably red /
green / amber / blue in both themes.

### Alpha ramps

`opacity/{role}/{5,10,20,30,40,50,60}` gives seven translucency steps for each of `primary`,
`secondary`, `accent`, `neutral`, `destructive`, `success`, `warning` and `info` — 56 tokens. Use these
for soft-variant fills and tinted washes instead of setting node opacity, which fades any icon or
label inside the same layer.

`custom/*` covers the remaining special cases: `custom/backdrop-overlay` `#3c3a40 a0.60 → a0.80` for
modal scrims, `custom/shadow` `#000000 a0.10 → a0.30`, `custom/black` and `custom/white` (both of which
**invert**, so "black" means "the ink colour", not the colour black), `custom/transparent`,
`custom/input-dark` and `custom/background-input-30`.

`shadow/{default,primary,secondary,accent,destructive,success,warning,info}` supplies the shadow
*colours* that the effect styles consume.

---

## Typography

Two ramps of 67 styles each, XS → 9XL crossed with Light / Regular / Medium / Semi Bold / Bold.
**Geist** carries LTR through `Tailwind En/*`; **Cairo** carries RTL through `Tailwind AR/*`. The two
are 1:1 by *size*, so swapping a style across the language boundary is a name substitution and never a
redesign — that symmetry is what makes the `Direction` property viable at all.

They are deliberately **not** 1:1 by line-height. Cairo needs more vertical room than Geist for
descenders and diacritics, so each ramp is leaded for its own font.

### The line-height ladder

Line-height is not named after the type size. It is a shared numeric ladder,
`typography/line-height/L-0` … `L-15` in the `💨 Tailwind` collection, which both ramps draw from:

| | | | | |
|---|---|---|---|---|
| `L-0` 16 | `L-0,5` 18 | `L-1` 20 | `L-1,5` 22 | `L-2` 24 |
| `L-2,5` 26 | `L-3` 28 | `L-3,5` 30 | `L-4` 32 | `L-4,5` 34 |
| `L-5` 36 | `L-5,5` 38 | `L-6` 40 | `L-6,5` 42 | `L-7` 44 |
| `L-7,5` 46 | `L-8` 48 | `L-8,5` 50 | `L-9` 52 | `L-9,5` 54 |
| `L-10` 56 | `L-10,5` 58 | `L-11` 60 | `L-11,5` 62 | `L-12` 64 |
| `L-13` 72 | `L-13,5` 90 | `L-14` 108 | `L-14,5` 144 | `L-15` 192 |

Two-pixel steps from 16 to 64, then a display run of 72 / 90 / 108 / 144 / 192. Decoupling the rung
from the size name is what lets English and Arabic sit at different leading while still binding to one
set of tokens — a size-named ramp could only ever serve one language.

### The two ramps

| Style | Size | En line-height (rung) | ratio | AR line-height (rung) | ratio | Role |
|---|---|---|---|---|---|---|
| `XS` | 12 | 16 (`L-0`) | 1.33 | 20 (`L-1`) | 1.67 | eyebrows, captions, badge labels |
| `SM` | 14 | 20 (`L-1`) | 1.43 | 24 (`L-2`) | 1.71 | UI default — buttons, inputs, cells, menu items |
| `Base` | 16 | 24 (`L-2`) | 1.50 | 28 (`L-3`) | 1.75 | body copy |
| `LG` | 18 | 28 (`L-3`) | 1.56 | 32 (`L-4`) | 1.78 | lead paragraphs |
| `XL` | 20 | 28 (`L-3`) | 1.40 | 36 (`L-5`) | 1.80 | small headings |
| `2XL` | 24 | 32 (`L-4`) | 1.33 | 40 (`L-6`) | 1.67 | section subheadings |
| `3XL` | 30 | 40 (`L-6`) | 1.33 | 50 (`L-8,5`) | 1.67 | section headings |
| `4XL` | 36 | 44 (`L-7`) | 1.22 | 60 (`L-11`) | 1.67 | block headings |
| `5XL` | 48 | 58 (`L-10,5`) | 1.21 | 72 (`L-13`) | 1.50 | display |
| `6XL` | 60 | 72 (`L-13`) | 1.20 | 90 (`L-13,5`) | 1.50 | display |
| `7XL` | 72 | 90 (`L-13,5`) | 1.25 | 108 (`L-14`) | 1.50 | display |
| `8XL` | 96 | 108 (`L-14`) | 1.13 | 144 (`L-14,5`) | 1.50 | oversized editorial |
| `9XL` | 128 | 144 (`L-14,5`) | 1.13 | 192 (`L-15`) | 1.50 | oversized numerals |

**Arabic runs in three bands**, not one flat ratio. Reading copy (`XS`–`XL`) climbs monotonically
from 1.67 to a peak of 1.80 — 1.67, 1.71, 1.75, 1.78, 1.80, with no step out of order; headings
(`2XL`–`4XL`) then drop to a flat 1.67; display (`5XL`–`9XL`) to a flat 1.50. The ratio falls as the
type grows, which is the standard typographic move, but Arabic starts far looser than English and
stays looser at every comparable size — Cairo needs the room for descenders and diacritics, and
Arabic body copy wraps sooner because it runs longer than English.

Every band lands on the `L-*` ladder exactly, with no midpoint rounding anywhere: the reading band
uses 20 / 24 / 28 / 32 / 36 and the heading band 40 / 50 / 60. Reading copy from `SM` up sits inside
the 1.7–1.8 range the brand book asks for, which it did not before.

Both ramps are now **fully bound at every size**, display included. Nothing in either script is left
on `AUTO`.

**English loosens, then tightens.** It is a hump, not a curve: 1.33 at `XS` rising to a peak of 1.56
at `LG`, then falling away through 1.22 at `4XL` to 1.13 at `9XL`. Only the descent is the standard
typographic move of letting long-form text breathe and pulling headlines in; below `LG` the ramp runs
the other way. Three irregularities sit inside it — `LG` and `XL` share the same 28px line-height at
different sizes, which is what makes the 1.56 → 1.40 drop so abrupt; `2XL` and `3XL` are both exactly
1.33; and `7XL` rises to 1.25 between `6XL` at 1.20 and `8XL` at 1.13, the one place the descent
reverses.

Two extras sit outside the ramp, identical in both scripts: `Extra/Link` (16/24, Regular, underlined)
and `Extra/List Header` (14/16, Medium, uppercase). Uppercase is English-only — Arabic has no
uppercase, and the Arabic style carries `textCase: UPPER` only as a duplication artefact.

### Font family

Family is tokenised per direction and mirrored across both collections. `💨 Tailwind` holds
`typography/font-family/LTR/{font-family-default, -dark, -gourmet}` and an identical `RTL/*` trio;
`☾  Mode` exposes them as `font family/LTR/font-family` (Geist) and `font family/RTL/font-family`
(Cairo). Every `Tailwind En/*` style binds `fontFamily` to `LTR/font-family-default`, every
`Tailwind AR/*` style to `RTL/font-family-default`. Changing the Arabic face for the whole system is a
one-variable edit.

**House usage.** Eyebrow = `XS/Medium`, uppercase, 8% tracking, on `{colors.primary}` — but on an
inverse band on `{colors.muted-foreground-inverse}`. Heading = `4XL`–`5XL/Semi Bold` on
`{colors.foreground}`. Body = `Base/Regular` on `{colors.muted-foreground}`.

**Arabic has no uppercase.** An uppercase Latin block becomes normal-case Arabic at the same density;
do not compensate with weight or tracking.

**Never set `textCase = UPPER` or a direct `letterSpacing` on a styled text node** — either override
clears `textStyleId` and silently detaches the token. Type the characters in uppercase literally. The
one sanctioned exception is the letter-spaced eyebrow, which is documented as detached but still holds
all four font variable bindings.

**Never hard-code a line-height.** Bind to a rung. An Arabic block set to an English rung will look
correct in Figma at one line and crowd the moment the copy wraps — Arabic runs longer than English in
body copy, so it wraps sooner.

### Note on font substitutes

Geist and Cairo are both open-source, so no substitution is normally needed. If a rendering context
lacks them: replace Geist with **Inter** (near-identical metrics; reduce letter-spacing by roughly
0.01em at `4XL` and above, as Inter runs slightly wider in display sizes) and Cairo with **IBM Plex
Sans Arabic** or **Noto Sans Arabic**, adding about 4% line-height because both sit lower on the
baseline than Cairo and will crowd the 28px leading at `Base`. The file also contains a legacy
`Almarai/*` style set that is **not** the Arabic ramp — it predates the current system and must not be
used.

---

## Layout

**Base unit: 4px.** The `spacing/*` ramp is the Tailwind scale — `px` 1, `0,5` 2, `1` 4, `1,5` 6, `2` 8,
`2,5` 10, `3` 12, `3,5` 14, then every 4 to `12` (48), then 56, 64, 80, 96, 112, 128, 144, 160, 176,
192, 208, 224, 240, 256, 288, 320, 384 — 35 steps. Note the comma decimal in Figma names (`spacing/1,5`,
not `spacing/1.5`). Parallel `width/w-*` and `height/h-*` ramps mirror the same 35 values.

Every padding and every `itemSpacing` binds to this ramp. No raw numbers.

**Section rhythm constant: 96px** (`spacing/24`) — the vertical padding of a marketing block and the
default gap between major sections, stepping to 64 at Tablet and 32 at Mobile.

**Marketing block geometry.** Root frame 1440 wide × hug tall with `clipsContent` on; 96 padding all
sides; content container therefore 1248; root section gap 48 (`spacing/12`, 32 or 80 where the design
calls for it); root fill `{colors.background}`. A component set frame is the variant + 80 = 1520 wide,
with the variant at x=40, y=40. Separators in this pattern are a 1px fill-width frame filled
`{colors.border}` — the Separator component is not used there.

**Dashboard geometry.** A 1440 × 864 `Dashboard` frame: 256 sidebar, 1184 container, 72 top nav, 24
content padding, giving a usable content area of 1136 × 744.

**Text fills, it does not hug.** Any text in a vertical or fill-width container is set to `FILL` so it
wraps to its container. `HUG` is reserved for inline labels inside hug rows — badges, buttons, counters.

---

## Elevation & Depth

81 effect styles, organised as three families.

**Drop shadows** run a 7-step ramp — `2xs, xs, sm, md, lg, xl, 2xl` — repeated for each shadow colour
(`default`, `primary`, `secondary`, `accent`, `Info`, `success`, `warning`, `error`). The geometry is
the Tailwind elevation curve: `2xs` is a single 0-blur 1px offset hairline; `sm` and above are
two-layer shadows pairing a tight contact shadow with a wider ambient one (`lg` = 6px blur at 4px
offset spread −4, plus 15px blur at 10px offset spread −3); `2xl` is a single dramatic 50px blur at
25px offset, spread −12.

**Dark shadows** (`Dark/shadow/default/*`) are a reduced 6-step set that drops the second layer,
because a two-layer shadow on a dark ground reads as smudge rather than lift.

**Blur** comes in two forms with the same 8-step scale (`none, sm, blur, md, lg, xl, 2xl, 3xl` =
0/4/8/12/16/24/40/64): `Light/blur/*` is a background blur for glass surfaces, `Light/layer-blur/*` a
layer blur for the element itself. `card-bg-blur` is a named 8px background blur for card glass.

**`shadow ring`** is a 0-blur, 0-offset, 3px-spread shadow — the focus ring, used with `{colors.ring}`.

**Partial opacity does not composite reliably in this file's render paths.** A scrim frame over a photo
can export fully opaque at `1` and invisible at `0.45`, in both the plugin export and the cloud render;
paint-level opacity behaves the same way. Where a scrim is needed, put the tint on its own sibling
layer with `node.opacity` and keep icons and text out of that layer, or choose an already-dark photo.

---

## Shapes

Radius lives in `☾  Mode` (not in `💨 Tailwind`, despite the Tailwind-style names) and is identical
across Light and Dark: `none` 0, `xs` 2, `sm` 6, `md` 8, `lg` 10, `xl` 14, `2xl` 16, `3xl` 24, `4xl` 32,
`rounded` 9999.

`{rounded.md}` (8) is the system default for controls; `{rounded.lg}` (10) for cards, modals and
popovers; `{rounded.pill}` for pills, avatars and status dots. All four corners must be bound
individually — a partially bound radius is a defect.

Most atoms expose the choice as a `Radius` variant property with values `Standard` / `Rounded` (Button,
Icon Button, Badge, Avatar, Input, Select, Steps, Tooltip) or `Square` / `Rounded` (Pagination), so the
decision is made per instance rather than by overriding a corner.

Borders are 1px by default, from `borders/width/*` (0, 1, 2, 4, 8), always coloured `{colors.border}`
or `{colors.input}`.

---

## Components

44 atom pages, from `⚛️ Component Atoms ↴` through `Drawer`. 71 product component sets plus one
standalone component, and a separate 87-set wireframe library. Page status is encoded in the page name:
🟢 done, 🟡 in progress, 🔴 not started; `Y` / `H` / `Y/H` marks the owner.

**Almost every set carries `Direction = LTR / RTL`.** The exceptions are noted below and are all
either sub-parts consumed by a parent that handles direction (`Carousel Item`, `Otp Input Item`,
`Modifier / Indicator`) or purely decorative (the Avatar illustration sets).

### Actions

| Component | Variants | Properties |
|---|---|---|
| ` Button` `307:333` | **960** | `Type` Solid/Soft/Outline/Ghost · `Style` primary/secondary/destructive · `Size` xs/sm/md/lg · `State` Enabled/Hover/Clicked/Focus/Disabled · `Radius` Standard/Fully · `Direction` · text props `¶ label` (LTR) and `label ¶` (RTL) · Left/Right icon booleans + swaps |
| `Icon Button` `3615:13506` | 480 | same axes minus label; `Icon` instance swap |
| `Toggle` `15088:228441` | 96 | `Type` Ghost/Outline · `state` Default/hover/Focus/Disabled/Pressed · `Size` sm/md/lg · `Text` On/Off · `Icon` |
| `Toggle Group` `15095:16190` | 16 | `Variant` ×8 — Icon, Icon with text, Fix Outline text, Default text with/without Outline, With Avatar, Rounded, Alignment options |

The Button set is the largest object in the system at 960 variants, and the reason the `Direction`
property must never be renamed: every instance in every block would drop its overrides.

Two Button quirks that recur: its RTL variant does **not** physically swap the Left/Right icon slots —
mirror by toggling the booleans and setting the mirrored glyph. And `Solid`/`primary` on a
`{colors.background-inverse}` band is invisible, because both are near-black in Light; use
`Outline`/`secondary` there.

### Form & input

| Component | Variants | Properties |
|---|---|---|
| `Default Input` `414:12784` | 160 | `Size` xs/sm/md/lg · `Filled` · `State` Default/Focus/Success/Destructive/Disabled · `Radius` · label / top / bottom-label booleans · prefix + suffix icon · LTR + RTL placeholder props |
| `Select Input` `3884:6936` | 192 | as Input plus `Multi Select`, `Show Badges`, `Show Text` |
| `Textarea` `3928:2374` | 20 | `State` ×5 · `Filled` · LTR/RTL text + placeholder props |
| `Input Number` `39043:1432` | 100 | `Variant` Default / Vertically Stacked / Horizontally Stacked / Horizontal Stretched / Mini · `State` ×5 |
| `Check Box` `3830:2149` | 60 | `Type` Default/Layout · `State` Unchecked/Checked/Indeterminate/Disabled Uncheck/Disabled Checked · `Size Default` sm/md/lg |
| `Radio` `3830:58457` | 48 | `Type` Default/Layout · `State` Unchecked/Checked · `Size Default` · `Disabled` |
| `Switch` `3853:15460` | 144 | `Type` Control First/Label First · `State` ×4 · `Sizes` · `ON` · `Style` Outline/Solid |
| `Slider` `40500:60632` | 42 | `Style` Half-Full/Empty/Full/Double slider · `size` · `state` Default/focus · `Direction` LTR/RTL/**Both** |
| `OTP Input` `40465:54984` | 8 | `Type` Digits only / Simple / With Separator / With Spacing (+ `Otp Input Item` `15097:22526`) |
| `Date Picker` `15113:5466` | 48 | `State` Default/Hover/Focus · `Size` xs–lg · `Variants` Inactive/Active |
| `Combobox` `14855:46197` | 28 | `Type` Default/Avatar/timezone/Multiselect/Dropdown/Reponsive/Form · `Open` |

`Default Input` has a well-known trap: `Icon (Prefix)` is the **instance-swap** and `Prefix-icon` is
the **boolean** — the opposite of what the names suggest. Read `componentPropertyDefinitions` before
setting either. Select's label layer is named `Title`, not `Label`, and its `- Top Right label`
defaults to true.

### Display & feedback

| Component | Variants | Properties |
|---|---|---|
| `Badge` `326:2134` | 432 | `Type` Solid/Soft/Outline · `Style` Primary/Secondary/Info/Success/Warning/Destructive · `Size` sm/md/lg · `Radius` · `Stats` Default/Focus · Icon / Closable / Avatar |
| `Alert` `15226:58727` | 30 | `Variants` Default/Info/Success/Warning/Destructive · `Type` Outline/Solid/Soft · actions, close, title, subtitle, avatar |
| `Tooltip` `15139:15897` | 120 | `Style` ×6 · `Position` Top/Bottom/Left/Right/None · `Radius` · LTR + RTL content and sub-text props |
| `Progress` `3831:2727` | 126 | `sizes` sm/md/lg · `Percentage` 0–100% in 5% steps (21 values) · `Show Percentage` |
| `Avatar` `323:321` | 24 | `Style` Image/Initials/Icon · `Radius` · `Border` · `Status Indicator` |
| `Rating` `363:7242` | 48 | `Size` · `Filled` · `Type` Star/Heart · `Colors` Primary/Amber/Red |
| `Modifier / Indicator` `323:390` | 4 | `Type` Online/Away/Busy/Offline — no Direction |
| `Skeleton` `15120:8056` | 4 | `State` Default/card/text · `Direction` LTR/Both/RTL |
| `Separator` `14860:69243` | standalone | a 292×0 line; no properties |
| `Sonnar` `40227:10979` | 2 | toast — icon / button / subtitle booleans |
| `Timeline` `15783:326560` | 6 | `Variants` Basic / with icon / Centered |

`Avatar` is backed by four illustration sets that compose its Image style: `Head and hair style` (18
types, including four hijab options), `Clothes` (16), `Female hair bangs` (4) and `Accessories` (6).
These are artwork, carry no `Direction`, and are the one place in the system where the neutral palette
is deliberately set aside.

### Navigation & disclosure

| Component | Variants | Properties |
|---|---|---|
| `Navbar` `4103:4910` | 34 | `Type` ×17 — Default, With Dropdown, With Icon Indicator & Avatar, With Centered Logo, With search input, With CTA Button, With Submenu, multiple action, Rounded, extended at top, Small navbar, Rounded small navbar, … |
| `Tabs Component` `39913:32645` | 210 | `Tabs` 2–8 · `Active Tab` 1–8 · `Style` Boxed/Borderd/Lifted (+ `Tabs / Tab item` `408:8904`, 78 variants, `State` ×5) |
| `Breadcrumbs` `3771:68266` | 32 | `Style` Default/Custom Separator/With Badge/Outline Badge · `Count` 2/3/4/+4 |
| `Pagination Variants` `400:6808` | 48 | `size` xs–lg · `Variants` Default/Solid/Outlined · `Shape` Square/Rounded |
| `Accordion` `15217:41213` | 16 | `Variants` ×8 — Split, plus minus icon, Avatar, Outline, Table, Multi-level, icons, Default |
| `Accordion Item` `324:856` | 4 | `Opened` · Avatar · Title Icon (+ `Heading Font`, `Body Font`, `Icon Size` sizing sets, SM/MD/LG) |
| `Side Bar` `40503:333` | 2 | with `Side Bar Inside Item` `40492:58601`, 12 variants, `State` Default/Hover/Selected · `Sub-item` |
| `Dropdown` `3969:51446` | 20 | `Variant` ×10 — with Switch / Avatar / Action / icon, Checkboxes, Radio Group, Advanced, Basic, Avatar Heading, Mini icon |
| `Menubar` `40217:11937` | 2 | with `Menu bar content` `40217:11726`, 10 variants (Edit / More / Profile / files / view containers) |
| `Context Menu` `40191:68792` | 4 | `Size` Lg/Sm (+ `Context Menu Design` `40191:68742`) |
| `Steps / Step item` `405:7832` | 48 | `Status` Done/Current/Upcoming · `Orientation` Horizontal/Vertical · `Radius` · `Has tail` |
| `Steps Horizontal` `3793:70328` / `Steps Vertical` `3793:70403` | 4 each | `Radius` |

`Steps Horizontal` is fixed at five steps and its children cannot be removed — compose a custom step
count from `Steps / Step item` instead. In its horizontal-with-tail form it shows numbers only, so step
captions need their own row beneath.

`Accordion Item` ships its own 1px bottom divider; never add separator frames between rows or the line
doubles.

### Overlay & container

| Component | Variants | Properties |
|---|---|---|
| `Modal` `38975:3887` | 6 | `Size` L/XL/2XL · `Show Footer` · a `Slot` that accepts children on instances |
| `Modal Header` `38975:3913` | 4 | `Type` Default/Back · description, close, LTR + RTL title and description props |
| `Footer Actions` `38975:3834` | 8 | `Actions` Primary/Danger · `Horizontal` · secondary and third action booleans |
| `Alert Dialog` `15455:53947` | 8 | `Align` Edge/Center · `Destructive` · additional-content slot |
| `Popover` `4007:13806` | 2 | `Sub-title` |
| `Drawer` `15043:262710` | 8 | `Stats` Top/Bottom/Left/Right |
| `Command Menu` `39712:171` | 2 | direction only |
| `Carousel` `40600:96155` | 18 | `No. of items` 2/3/4 · `Active Item` 1–4 — these are the stepper dots |
| `Content Carousel` `15769:74332` | 6 | `Type` Single box / Two boxes / Three boxes, three content slots |

The Modal component is a dialog card. A lightbox is a different pattern and is built bespoke on
`{colors.background-inverse}` — that call was made deliberately and should not be "corrected" back to
Modal.

### Data

| Component | Variants | Properties |
|---|---|---|
| `Table` `39981:1576` | 4 | `Pinned Columns` |
| `Table Cell` `39961:4559` | 30 | `Type` ×15 — Header label, Header More, Header Checkbox, Text, Status, Date & Time, Progress Bar, Icon CTA, Checkbox Default/Selected, Swap, CTA … plus 21 booleans for badges, actions, filters and row states |
| `Bulk Actions Bar` `40652:5959` | 2 | direction only |
| `Standard Calendar` `15117:6294` | 16 | `Variants` ×8 — Basic, Date Form, date range picker, With dropdowns, long range, with time labels, rounded elements, With labels |
| `Calendar View` `40500:62496` | 6 | `View` Day/Week/Month |
| `Calendar Header` `40500:62423` | 10 | `Type` Day/Date/Current Date/Empty/Date & Year |
| `Calendar Cell` `40500:63031` | 14 | `Type` Time-Left / Cell / Month Date Current / Month Date · `Hover` |
| `Time and Days` `42278:36791` | 4 | `Type` Time/Days |

`Table Cell` is the most property-dense object in the system: 15 types crossed with 21 booleans. Treat
its `Type` as the primary axis and the booleans as per-instance switches.

### Wireframe library

`✦ 🟢 H | Components Skeleton` holds **87 low-fidelity component sets**, each with only a `Direction`
property and two variants — `button`, `card`, `navbar`, `modal`, `data-table`, `tree-view`, `apex-charts`
and so on. These are layout placeholders for wireframing, not shippable UI. Do not instance them into a
finished screen.

### Referenced from outside the atoms range

Two sets used constantly in block work live on other pages: **`Social Icons`** `40334:57763` (`Platform`
× `Color`) on the Icons page `3637:6775`, which is the only sanctioned source of third-party brand
marks; and the **`Fasla Logo`** set `41668:149234`, which has its own `Direction` property and swaps to
the فاصلة lockup.

---

## Do's and Don'ts

**Do bind every visual property to a token.** Fills and strokes to `theme/*` via
`setBoundVariableForPaint`; padding and gaps to `spacing/*`; all four corners to `border radius/*`;
type to a text style; shadows to an effect style. A raw value where a token exists is a defect, not a
shortcut.

**Do keep components on `inherit` for `☾  Mode`.** Light is the default and what every component must
show; never pin a page, frame or component to Dark with an explicit mode. Pinning to Light is equally
wrong — it destroys the ability to preview the dark theme, which is the entire purpose of a two-mode
collection.

**Do check every block in both modes.** Because all colour is bound, flipping the mode is a free audit:
anything whose colour does not change is unbound. This is the cheapest check in the system and it
catches what the eye misses in a single theme.

**Do preserve the Direction property — this is the signature element.** Never rename it, never
substitute a second component set for the Arabic version, never build a separate "AR" file, and never
mirror a component by hand when it already has an RTL variant. If a new atom is added to the system, it
ships with `Direction` from the start. Everything downstream — blocks, screens, documentation — assumes
one component serves both directions, and an atom without it silently breaks that guarantee.

**Do use `{colors.background-inverse}` for a genuinely bold band**, paired with
`{colors.foreground-inverse}` and `{colors.muted-foreground-inverse}`. Because it inverts with the
theme, the band stays correct in both modes.

**Don't use `{colors.primary}` on an inverse band.** Both are near-black in Light, so a Solid/primary
Button on a `{colors.background-inverse}` section is invisible. Use `Outline`/`secondary`.

**Don't reach for `{colors.accent}`, `{colors.muted}` or `{colors.secondary}` to create contrast** —
all three resolve to the same neutral. A "colour block" built from them reads as a tonal block. Use
`{colors.chart-1}`–`{colors.chart-5}` for genuine hue, or invert.

**Don't apply a direct override to a styled text node.** `textCase`, `letterSpacing` and similar
overrides clear `textStyleId` and detach the token silently. Audit with
`findAll(n => n.type === 'TEXT' && !n.textStyleId)` before shipping.

**Don't take a brand mark from anywhere but the Social Icons set** — not the loose single-colour decoy
glyphs that share its page, not a lookalike from the general icon set, not a redrawn vector. If a
platform is missing, stop and ask for it to be added rather than substituting.

**Don't set node opacity to tint a layer that contains an icon or label** — the whole layer fades. Put
the tint on its own sibling layer, or use an `opacity/*` token on the fill.

**Don't rebuild by hand what already exists as a component.** Check the inventory above before drawing
a stepper, a table cell, a carousel dot or a progress bar.

---

## Responsive Behavior

Three breakpoints, driven by the `💻 Responsive` collection (`VariableCollectionId:9118:18734`) whose
modes are `🖥️ Web`, `💻 Tablet` and `📱 Mobile`. Nine live variables resolve per mode:

| Variable | Web | Tablet | Mobile |
|---|---|---|---|
| `block-width` | 1440 | 768 | 360 |
| `screen-size` | 1280 (`breakpoints/xl`) | 768 (`md`) | 360 (`xs`) |
| `block-horizontal-padding` | 96 (`spacing/24`) | 64 (`spacing/16`) | 32 (`spacing/8`) |
| `vertical-padding` | 96 | 64 | 32 |
| `horizontal-padding` | 32 (`spacing/8`) | 24 (`spacing/6`) | 16 (`spacing/4`) |
| `section-spacing` | 96 | 64 | 48 (`spacing/12`) |
| `font-size` | 36 (`4xl`) | 30 (`3xl`) | 24 (`2xl`) |
| `line-hight` | 40 (`L-6`) | 36 (`L-5`) | 32 (`L-4`) |
| `button-size` | lg | lg | lg |

Resulting content widths after block padding: **Desktop 1248 · Tablet 640 · Mobile 296**.

Because width and padding are bound, calling `setExplicitVariableModeForCollection` on a cloned variant
reflows it correctly for free. The real work of a breakpoint pass is overflow and restructuring, not
resizing.

**Text styles override the `font-size` variable.** A `Tailwind En/*` style carries its own font-size
binding, so binding `font-size` on top of it is a no-op and headings do **not** auto-step. Step the
*style* explicitly instead — one notch down at Tablet for `4XL` and above, two notches at Mobile for
`5XL` and above and one for `2XL`–`4XL` — which keeps the type fully token-bound.

Naming caution: on block component sets the `Breakpoint` variant values are **`Desktop` / `Tablet` /
`Mobile`**, while the collection names the first mode `🖥️ Web`. A mode and a variant value are
different things; the mismatch is deliberate and settled.

**Every breakpoint is designed explicitly**, even where it is visually identical to Desktop. An
unstated breakpoint is not a decision.

`button-size` is `lg` at all three breakpoints — that is intentional for touch targets, not an
oversight.

---

## Iteration Guide

**Adding a colour.** It goes in `☾  Mode` with values for both modes, aliased to a `💨 Tailwind`
primitive rather than typed as a hex. Give it a semantic name describing its role, not its appearance —
`theme/warning`, never `theme/amber`. If it will sit on an inverse band, add the `-inverse` partner at
the same time.

**Adding a size to an atom.** Extend the existing `Size` axis (`xs/sm/md/lg`) rather than creating a
parallel property; every variant in a set must declare the same property keys or Figma rejects it.
Then re-run the documentation pass for that component so the spec sheet matches.

**Adding a new atom.** It ships with `Direction = LTR / RTL` from the first commit, uses the `SM` text
style as its default UI size, `{rounded.md}` as its default radius, and binds every padding to
`spacing/*`. Add it to the correct `⚛️ Component Atoms` page with the `✦ {status} {owner} | {Name}`
naming convention.

**Never rename a variant property after instances exist** — the instances drop their overrides. Get the
axis name right the first time.

**Deprecating.** Prefix the token with `❌` rather than deleting it, which is how
`💻 Responsive/❌ Boolean`, `❌ Number` and `❌ avatar-carusal` are handled. Never bind new work to a
`❌` token.

**Order of work for a block family**: build desktop LTR → add Tablet and Mobile → add RTL → document.
Each is its own pass, and the later passes attach to the existing component set rather than rebuilding
it.

---

## Known Gaps

Honest list of what this document does not cover and what the system does not yet resolve.

- **No monospace type style exists.** Terminal, code and log UI currently uses
  `Tailwind En/SM/Regular`, which is a stopgap, not a decision.
- **`Button` Solid/primary is unreadable in Dark mode** — near-white fill with a light-grey label,
  because `theme/primary-foreground` resolves to `#a3a3a3` in Dark rather than a true dark ink. Known
  and reported; it needs a token fix at the source, not per-instance patches.
- **`html.to.design`** (53 variables) is a leftover import collection and a cleanup candidate. Nothing
  should bind to it.
- **Colour and effect *styles* cannot be read through the REST API** in this setup, as
  `FIGMA_ACCESS_TOKEN` is not configured. They are readable through the plugin bridge only.
- **Motion is documented outside the component**, in `⚡ Motion — {Type}` chips beside each block, not
  as tokens. There is no duration, easing or delay scale in the variable layer.
- **Accessibility has not been formally audited.** Contrast pairs are inherited from the shadcn
  defaults rather than measured. Two ratios are known: `{colors.muted-foreground}` on
  `{colors.muted}` measures **4.35:1**, just under the WCAG AA 4.5:1 threshold — acceptable for
  disabled controls, which are exempt, but not for the placeholder and caption text that also use
  this pair. The two contrast traps described above suggest a full audit would find more.
- **Icon sizing is not tokenised** — icons are sized per component rather than from a shared ramp.
- **Legacy names remain in the file.** 111 occurrences of `SMI UI` survive on two dashboard pages in
  layer names and body copy, including one half-finished rename that broke a sentence. These are known
  and deliberately not swept.
- **Only the 44 atom pages are described here.** Block-level component sets (Hero, Features, Gallery,
  Banners, Error State, Authentications, Billing & Payments) have their own conventions and are not
  documented in this file.

---

*Generated 2026-09-06 from the live Fasla Figma file (`yGEQmCZOvs7KptsYUdB0Xg`) — variables, styles and
component property definitions read directly, plus the design decisions recorded in
[INSTRUCTIONS.md](INSTRUCTIONS.md) and [FIGMA.md](FIGMA.md). Lint with
`npx @google/design.md lint DESIGN.md`.*
