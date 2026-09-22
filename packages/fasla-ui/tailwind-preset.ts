import plugin from "tailwindcss/plugin"
import type { Config } from "tailwindcss"

/**
 * Shared typography preset — the single place the Fasla type system lives.
 *
 * Every value here is read from the `Tailwind En/*` and `Tailwind AR/*` text
 * styles in the Fasla Figma file. Figma is the source of truth: nothing in this
 * file is rounded, averaged or invented. If a value looks wrong, fix the style
 * in Figma and mirror it here — never the other way round.
 *
 * Geist carries LTR, Cairo carries RTL. The two ramps are 1:1 by size and
 * deliberately not 1:1 by line-height — Cairo needs more vertical room for
 * descenders and diacritics.
 *
 * Line-height is delivered as a CSS variable per rung, so `[dir="rtl"]`
 * re-points the whole ramp at once. That is what makes every `text-*` utility
 * direction-aware without a single component knowing about it.
 */

/**
 * Line-height as Figma states it: a px value against a px size.
 *
 * It is emitted as `calc(lineHeight / fontSize)` — a unitless ratio, so it
 * stays correct when a rung is used at a responsive size, and exact, because
 * CSS does the division at full precision. Eight of these ratios are
 * non-terminating (18→26 is 1.444…), so writing them as decimals would mean
 * rounding a source-of-truth value. calc() avoids that entirely.
 *
 * `null` means Figma has the rung on AUTO — the font's own metrics, which CSS
 * spells `normal`. No rung is currently on AUTO: all 134 styles are bound, in
 * both scripts, at every size. The mechanism stays because AUTO is a legitimate
 * choice Figma can express, and a rung may return to it.
 */
const LEADING = {
  //           size          En            AR
  xs: /*        12 */ [/*    16 */ 16, /*    20 */ 20],
  sm: /*        14 */ [/*    20 */ 20, /*    24 */ 24],
  base: /*      16 */ [/*    24 */ 24, /*    28 */ 28],
  lg: /*        18 */ [/*    28 */ 28, /*    32 */ 32],
  xl: /*        20 */ [/*    28 */ 28, /*    36 */ 36],
  "2xl": /*     24 */ [/*    32 */ 32, /*    40 */ 40],
  "3xl": /*     30 */ [/*    40 */ 40, /*    50 */ 50],
  "4xl": /*     36 */ [/*    44 */ 44, /*    60 */ 60],
  "5xl": /*     48 */ [/*    58 */ 58, /*    72 */ 72],
  "6xl": /*     60 */ [/*    72 */ 72, /*    90 */ 90],
  "7xl": /*     72 */ [/*    90 */ 90, /*   108 */ 108],
  "8xl": /*     96 */ [/*   108 */ 108, /*  144 */ 144],
  "9xl": /*    128 */ [/*   144 */ 144, /*  192 */ 192],
  // `Extra/*` — two styles that sit outside the XS–9XL ramp but are part of it.
  // Weight, underline and case are left to the ordinary utilities: `Extra/Link`
  // is 400 + underline, `Extra/List Header` is 500 + uppercase. Uppercase is
  // English-only; Arabic has no uppercase and must never be given one.
  link: /*      16 */ [/*    24 */ 24, /*    24 */ 24],
  "list-header": /* 14 */ [/*  16 */ 16, /*    16 */ 16],
} as const satisfies Record<string, readonly [number | null, number | null]>

/** Figma's size scale, which Tailwind's own scale already matches 1:1. */
const SIZE_PX = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
  "8xl": 96,
  "9xl": 128,
  link: 16,
  "list-header": 14,
} as const

type Rung = keyof typeof LEADING

const rungs = Object.keys(LEADING) as Rung[]

const rem = (px: number) => `${px / 16}rem`
const cssVar = (rung: Rung) => `--leading-${rung}`

/** Exact, unitless, and never rounded — CSS divides at full precision. */
const ratio = (leadingPx: number, sizePx: number) => `calc(${leadingPx} / ${sizePx})`

/** `text-xl` resolves its leading through the variable, never a literal. */
const fontSize = Object.fromEntries(
  rungs.map((rung) => [rung, [rem(SIZE_PX[rung]), `var(${cssVar(rung)})`]])
) as Record<Rung, [string, string]>

const leadingFor = (index: 0 | 1) =>
  Object.fromEntries(
    rungs.map((rung) => {
      const px = LEADING[rung][index]
      return [cssVar(rung), px === null ? "normal" : ratio(px, SIZE_PX[rung])]
    })
  )

/**
 * Figma sets `letterSpacing` to 0% on all 134 text styles, both scripts, every
 * weight — so the ramp declares no tracking and components should set none.
 * Tailwind's stock `tracking-*` scale is left in place for the one sanctioned
 * exception, the letter-spaced eyebrow that design/DESIGN.md documents as
 * deliberately detached. Reach for it only for that.
 */

const preset = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        // Brand V2.5 §14 — product tier.
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        // Brand V2.5 §14 — the Arabic face. Geist has no Arabic coverage.
        arabic: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
      fontSize,
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": leadingFor(0),
        // Source order matters: same specificity as `:root`, so this must win by
        // coming second. `dir` is on a wrapper element, not <html>, in both apps —
        // the variables cascade down from wherever it sits.
        '[dir="rtl"]': leadingFor(1),
      })
    }),
  ],
} satisfies Config

export default preset
