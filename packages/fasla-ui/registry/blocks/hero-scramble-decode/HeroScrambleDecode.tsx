"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Scramble Decode Hero.
 *
 * A security pitch on a `primary` band: a headline whose last word is lit
 * in `success`, a line of ciphertext under it, faint and as large, a
 * paragraph, a decode meter (a thin track, its fill in `success`, and a
 * "decoded 100%" label) and two buttons. At the end side a field of
 * scattered glyphs, letters, digits and symbols at 6% to 23%, stands still.
 *
 * The headline decodes once, when the block first comes into view: every
 * glyph starts scrambled, then they resolve to the real words from the start
 * of the line to its end while the meter runs from 0% to 100% and its label
 * reads "decoding". Figma draws that run part-way, at 58%; at rest the
 * headline is decoded, the meter full and the label "decoded". The line of
 * ciphertext is the message's encrypted form and stays as it is. The `h1`
 * always holds the real words, so screen readers and search engines read
 * them; the scrambling glyphs are an overlay hidden from assistive
 * technology, and the real words are only made transparent under it while
 * the run lasts. Under `prefers-reduced-motion: reduce`, and in the server's
 * HTML, the headline is simply decoded. The glyph field never moves.
 *
 * Desktop sets the copy at the start side, 110px in, with the glyph field
 * (380 × 620) 80px in from the end edge. Tablet stacks the lines 48px apart
 * and shrinks the field to 70%, at 60%, behind the headline's end. Mobile
 * drops the field, sets the headline at 24px and the buttons full width, one
 * over the other.
 *
 * In Arabic the copy reads from the right and the field moves to the left,
 * its columns mirrored. The scramble draws from the same Latin glyphs Figma
 * uses and resolves to the Arabic headline. The ciphertext and the
 * percentage stay left to right.
 *
 * The band is `primary` and its text `primary-foreground`, the tokens Figma
 * binds. In dark mode `primary` turns light, and the lit word's `success`
 * green fails on it, so the band stays dark there: `background`, with
 * `foreground` text.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroScrambleDecodeAction {
  label: React.ReactNode
  href: string
}

export interface HeroScrambleDecodeCopy {
  /**
   * The headline, an `h1`, set in capitals: its first words, then the word
   * lit in `success`. Plain strings, so the scramble can take them apart.
   */
  headline: { lead: string; accent: string }
  /** The faint line of ciphertext under the headline. Decoration, hidden from assistive technology. Hidden when empty. */
  cipher: string
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The meter's label while the headline decodes, before its percentage. */
  decodingLabel: React.ReactNode
  /** The meter's label once it has, and at rest. */
  decodedLabel: React.ReactNode
  /** The light button. */
  primaryAction: HeroScrambleDecodeAction
  /** The ghost button beside it. Hidden when null. */
  secondaryAction: HeroScrambleDecodeAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroScrambleDecodeCopy> = {
  en: {
    headline: { lead: "Encrypted by", accent: "default" },
    cipher: "X9#K2 QW8@ VN4$ L7",
    description: "Zero-knowledge storage for teams that keep secrets for a living. Keys never leave your device.",
    decodingLabel: "decoding",
    decodedLabel: "decoded",
    primaryAction: { label: "Create a vault", href: "#signup" },
    secondaryAction: { label: "Read the whitepaper", href: "#whitepaper" },
  },
  ar: {
    headline: { lead: "مشفّر", accent: "افتراضيًا" },
    cipher: "X9#K2 QW8@ VN4$ L7",
    description: "تخزين بلا اطلاع للفرق التي تحفظ الأسرار مهنةً. لا تغادر المفاتيح جهازك أبدًا.",
    decodingLabel: "فك التشفير",
    decodedLabel: "تم فك التشفير",
    primaryAction: { label: "أنشئ خزنة", href: "#signup" },
    secondaryAction: { label: "اقرأ الورقة البيضاء", href: "#whitepaper" },
  },
}

/*
 * The decode's timing, built from the house motion presets
 * (src/motion/presets.ts: fast 120ms, slow 260ms, standard easing).
 */
/** How often the unresolved glyphs re-roll: half the `fast` step. */
const SHUFFLE_MS = 60
/** How long every glyph stays scrambled before the first resolves: the `slow` step. */
const HOLD_MS = 260
/** How long the glyphs take to resolve, first to last: eight `slow` steps. */
const RESOLVE_MS = 2080
/** How much of the block must be on screen to start the run. */
const THRESHOLD = 0.3

/** The glyphs the scramble draws from: Figma's, Latin in both languages. */
const SCRAMBLE = "0123456789ABCDEF#$%&@"

/** The glyph field's characters, in Figma's order, column by column. */
const RAIN = "05AF&49E%38D$27C@16B#"
/** Figma's field: six columns of fourteen glyphs. */
const RAIN_COLUMNS = 6
const RAIN_ROWS = 14
/**
 * Each column's two opacities, alternating down it, as Figma sets them.
 * Written out whole so Tailwind finds every class.
 */
const RAIN_TONES: [string, string][] = [
  ["text-primary-foreground/[0.06] dark:text-foreground/[0.06]", "text-primary-foreground/[0.17] dark:text-foreground/[0.17]"],
  ["text-primary-foreground/[0.09] dark:text-foreground/[0.09]", "text-primary-foreground/[0.2] dark:text-foreground/[0.2]"],
  ["text-primary-foreground/[0.13] dark:text-foreground/[0.13]", "text-primary-foreground/[0.23] dark:text-foreground/[0.23]"],
  ["text-primary-foreground/[0.17] dark:text-foreground/[0.17]", "text-primary-foreground/[0.06] dark:text-foreground/[0.06]"],
  ["text-primary-foreground/[0.2] dark:text-foreground/[0.2]", "text-primary-foreground/[0.09] dark:text-foreground/[0.09]"],
  ["text-primary-foreground/[0.23] dark:text-foreground/[0.23]", "text-primary-foreground/[0.13] dark:text-foreground/[0.13]"],
]

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {}
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/**
 * Whether the visitor asks for reduced motion. False on the server and while
 * hydrating, so both renders agree, then the setting as it is and as it
 * changes.
 */
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToReducedMotion,
    () => typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}

/** The slice of Intl.Segmenter used here, typed locally: older TypeScript libs lack it. */
type GraphemeSegmenter = new (
  locale: undefined,
  options: { granularity: "grapheme" }
) => { segment(text: string): Iterable<{ segment: string }> }

/** Splits into user-perceived characters, so an Arabic mark stays with its letter. */
function splitGraphemes(text: string): string[] {
  const Segmenter = (Intl as unknown as { Segmenter?: GraphemeSegmenter }).Segmenter
  if (Segmenter) {
    const segmenter = new Segmenter(undefined, { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), (part) => part.segment)
  }
  return text.match(new RegExp("\\P{M}\\p{M}*|\\p{M}+", "gu")) ?? []
}

/** One frame of the run: the headline's two parts as they show, and the meter. */
interface DecodeFrame {
  lead: string
  accent: string
  percent: number
}

/**
 * Scrambles `parts`, leaving the first `resolved` glyphs (spaces not counted)
 * as they are. Spaces stay spaces, so the words keep their shape.
 */
function scramble(parts: string[][], resolved: number): string[] {
  let index = 0
  return parts.map((part) =>
    part
      .map((glyph) => {
        if (/^\s+$/.test(glyph)) return glyph
        index += 1
        return index <= resolved ? glyph : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      })
      .join("")
  )
}

export interface HeroScrambleDecodeProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroScrambleDecodeCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function HeroScrambleDecode({
  locale = "en",
  headline,
  cipher,
  description,
  decodingLabel,
  decodedLabel,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: HeroScrambleDecodeProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const sectionRef = React.useRef<HTMLElement>(null)
  const played = React.useRef(false)
  const reduced = usePrefersReducedMotion()
  const [frame, setFrame] = React.useState<DecodeFrame | null>(null)
  const title = headline ?? copy.headline
  const ciphertext = cipher ?? copy.cipher
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const { lead, accent } = title

  // The run, once, when the block first comes into view. The server's HTML
  // and every render outside the run show the decoded headline.
  React.useEffect(() => {
    const section = sectionRef.current
    if (!section || reduced || played.current || typeof IntersectionObserver !== "function") return
    const parts = [splitGraphemes(lead), splitGraphemes(accent)]
    const total = parts.flat().filter((glyph) => !/^\s+$/.test(glyph)).length
    let timer: ReturnType<typeof setInterval> | undefined

    const tick = (began: number) => {
      const elapsed = performance.now() - began
      if (elapsed >= HOLD_MS + RESOLVE_MS) {
        clearInterval(timer)
        setFrame(null)
        return
      }
      const share = Math.max(0, elapsed - HOLD_MS) / RESOLVE_MS
      const [shownLead = "", shownAccent = ""] = scramble(parts, Math.floor(share * total))
      setFrame({ lead: shownLead, accent: shownAccent, percent: Math.round(share * 100) })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        played.current = true
        const began = performance.now()
        tick(began)
        timer = setInterval(() => tick(began), SHUFFLE_MS)
      },
      { threshold: THRESHOLD }
    )
    observer.observe(section)
    return () => {
      observer.disconnect()
      clearInterval(timer)
      setFrame(null)
    }
  }, [lead, accent, reduced])

  // Reduced motion turned on mid-run ends it at once.
  const run = reduced ? null : frame
  const percent = run ? run.percent : 100

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] overflow-hidden bg-primary dark:bg-background", className)}
      {...props}
    >
      {/*
       * The section's colour fills the whole width; its content does not.
       * From Tablet up to Desktop the content keeps Figma's Tablet width,
       * 720px inside 24px padding, and centres, so a wide container shows
       * Figma's Tablet layout rather than a stretched one.
       */}
      <div className="relative mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-0 [@container(min-width:90rem)]:pe-20 [@container(min-width:90rem)]:ps-[110px] [@container(min-width:90rem)]:pb-[178px] [@container(min-width:90rem)]:pt-[230px]">
        {/*
         * The glyph field: decoration, and still. Six columns of fourteen in
         * 62 × 44 cells. On Tablet it shrinks to 70% from its top end corner
         * and fades to 60%, behind the headline; Mobile has none.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute end-6 top-10 hidden h-[620px] w-[380px] origin-top-right scale-[0.7] select-none grid-flow-col grid-cols-[repeat(6,62px)] grid-rows-[repeat(14,44px)] p-2.5 text-base opacity-60 [&:dir(rtl)]:origin-top-left [@container(min-width:48rem)]:grid [@container(min-width:90rem)]:end-20 [@container(min-width:90rem)]:top-[90px] [@container(min-width:90rem)]:scale-100 [@container(min-width:90rem)]:opacity-100"
        >
          {Array.from({ length: RAIN_COLUMNS * RAIN_ROWS }, (_, index) => (
            <span key={index} className={RAIN_TONES[Math.floor(index / RAIN_ROWS)]?.[(index % RAIN_ROWS) % 2]}>
              {RAIN[index % RAIN.length]}
            </span>
          ))}
        </div>

        <h1
          id={headingId}
          className="relative text-2xl font-semibold uppercase text-primary-foreground dark:text-foreground [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:max-w-[854px] [@container(min-width:90rem)]:text-7xl"
        >
          {/* The real words: always here, only transparent while the overlay scrambles. */}
          <span className={cn(run && "opacity-0")}>
            {lead ? <>{lead} </> : null}
            <span className="text-success">{accent}</span>
          </span>
          {run ? (
            <span aria-hidden="true" className="absolute inset-0">
              {lead ? <>{run.lead} </> : null}
              <span className="text-success">{run.accent}</span>
            </span>
          ) : null}
        </h1>

        {ciphertext ? (
          <p
            aria-hidden="true"
            className="relative text-2xl font-semibold text-primary-foreground/[0.28] dark:text-foreground/[0.28] [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:mt-2.5 [@container(min-width:90rem)]:max-w-[854px] [@container(min-width:90rem)]:text-7xl"
          >
            <bdi dir="ltr">{ciphertext}</bdi>
          </p>
        ) : null}

        <div className="relative flex flex-col gap-5 [@container(min-width:90rem)]:mt-[50px] [@container(min-width:90rem)]:max-w-[640px]">
          <p className="text-pretty text-base text-primary-foreground dark:text-foreground [@container(min-width:48rem)]:text-lg">
            {description ?? copy.description}
          </p>

          {/* The decode meter: full at rest, running with the headline while it decodes. */}
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-primary-foreground/25 dark:bg-foreground/25 [@container(min-width:48rem)]:w-[400px] [@container(min-width:48rem)]:flex-none"
            >
              <div
                className="h-full rounded-full bg-success transition-[width] duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="whitespace-nowrap text-xs font-medium text-primary-foreground/80 dark:text-foreground/80">
              {run ? (decodingLabel ?? copy.decodingLabel) : (decodedLabel ?? copy.decodedLabel)}{" "}
              <bdi dir="ltr">{percent}%</bdi>
            </p>
          </div>

          <div className="flex flex-col gap-3 [@container(min-width:48rem)]:flex-row">
            <a
              href={primary.href}
              className={buttonVariants({ variant: "secondary", size: "lg", className: "after:ring-primary-foreground dark:after:ring-foreground" })}
            >
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                // Figma sets the ghost label in `primary-foreground` to read on
                // the band; the hover tint and the focus ring follow it.
                className={buttonVariants({
                  variant: "ghost",
                  tone: "secondary",
                  size: "lg",
                  className:
                    "text-primary-foreground after:ring-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/10 dark:text-foreground dark:after:ring-foreground hover:dark:bg-foreground/10 active:dark:bg-foreground/10",
                })}
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroScrambleDecodeCopy = COPY
