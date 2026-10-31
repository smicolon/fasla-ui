"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Perforated Photo Strip.
 *
 * A `muted` section with a centred header (an eyebrow with a globe mark, a 48px
 * heading and a line under it), a strip of ten postage stamps and three
 * columns. A stamp is a 164 × 214 `card` frame with 12px of padding around a
 * 140 × 190 photo and a perforated edge, cut with a CSS mask of scallops. The
 * columns are an 18px title over a 14px line.
 *
 * The strip scrolls sideways and snaps stamp by stamp: drag it with a mouse,
 * swipe it, or focus it and use the arrow keys. A stamp lifts 4px on hover.
 * The columns sit three across on Desktop and stack on Tablet and Mobile.
 *
 * Content limits: the heading up to 50 characters, a column's title up to 32
 * and its line up to 110. The other limits are in the block's documentation page.
 */

export interface FeaturesPerforatedColumn {
  /** Keys the column. */
  id: string
  /** The column's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
}

export interface FeaturesPerforatedPhotoStripCopy {
  /** The line beside the globe mark. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The columns under the strip, in order. */
  columns: FeaturesPerforatedColumn[]
  /** Names the scrolling strip for assistive technology. */
  stripLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesPerforatedPhotoStripCopy> = {
  en: {
    eyebrow: "Works in every region",
    heading: "Built for teams that work everywhere.",
    description: "Your customers are in one country. Your team is in another. Your suppliers are somewhere else entirely. Fasla gives you a shared workspace across all of them, wherever you are based.",
    stripLabel: "Photos from around the world",
    columns: [
      { id: "region", title: "One workspace, every region", description: "Run revenue, payroll and day-to-day operations in the currency and language your business works in." },
      { id: "tools", title: "Grow without extra tools", description: "Manage accounts, approvals and reporting from one place so you can scale without adding another subscription." },
      { id: "borders", title: "Borderless by default", description: "Pay suppliers, collect from customers and run payroll across borders without a local team in every country." },
    ],
  },
  ar: {
    eyebrow: "تعمل في كل منطقة",
    heading: "مصممة للفرق التي تعمل في كل مكان.",
    description: "عملاؤك في بلد وفريقك في بلد آخر وموردوك في مكان مختلف تمامًا. تمنحك فاصلة مساحة عمل مشتركة تجمعهم جميعًا، أينما كان مقرك.",
    stripLabel: "صور من أنحاء العالم",
    columns: [
      { id: "region", title: "مساحة عمل واحدة لكل منطقة", description: "أدِر الإيرادات والرواتب والعمليات اليومية بالعملة واللغة اللتين يعمل بهما نشاطك." },
      { id: "tools", title: "انمُ دون أدوات إضافية", description: "أدِر الحسابات والموافقات والتقارير من مكان واحد لتتوسع دون إضافة اشتراك آخر." },
      { id: "borders", title: "بلا حدود منذ البداية", description: "ادفع للموردين وحصّل من العملاء وأدِر الرواتب عبر الحدود دون فريق محلي في كل بلد." },
    ],
  },
}

/** The ten stamps hold ten photos; a stamp left without one stays a `muted` placeholder. */
const STAMPS = 10

/** Stamp width plus the 20px between stamps: how far an arrow key moves the strip. */
const STEP = 184

/**
 * A scalloped edge: a 20px row of 4px bites along each side, joined by
 * intersecting four masks, one per edge.
 */
const SCALLOP_BITE = "transparent 97%, black"
const SCALLOP: React.CSSProperties = {
  WebkitMaskImage: [
    `radial-gradient(circle 4px at 10px 0, ${SCALLOP_BITE})`,
    `radial-gradient(circle 4px at 10px 100%, ${SCALLOP_BITE})`,
    `radial-gradient(circle 4px at 0 10px, ${SCALLOP_BITE})`,
    `radial-gradient(circle 4px at 100% 10px, ${SCALLOP_BITE})`,
  ].join(", "),
  WebkitMaskSize: "20px 100%, 20px 100%, 100% 20px, 100% 20px",
  WebkitMaskRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
  WebkitMaskComposite: "source-in",
  maskImage: [
    `radial-gradient(circle 4px at 10px 0, ${SCALLOP_BITE})`,
    `radial-gradient(circle 4px at 10px 100%, ${SCALLOP_BITE})`,
    `radial-gradient(circle 4px at 0 10px, ${SCALLOP_BITE})`,
    `radial-gradient(circle 4px at 100% 10px, ${SCALLOP_BITE})`,
  ].join(", "),
  maskSize: "20px 100%, 20px 100%, 100% 20px, 100% 20px",
  maskRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
  maskComposite: "intersect",
}

export interface FeaturesPerforatedPhotoStripProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesPerforatedPhotoStripCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** Up to ten photos, one per stamp. A `muted` placeholder shows for any left out. */
  photos?: FeaturesPhoto[]
}

export function FeaturesPerforatedPhotoStrip({ locale = "en", eyebrow, heading, description, columns, stripLabel, photos, className, ...props }: FeaturesPerforatedPhotoStripProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = columns ?? copy.columns
  const strip = React.useRef<HTMLUListElement>(null)
  const drag = React.useRef<{ x: number; left: number } | null>(null)
  const [dragging, setDragging] = React.useState(false)

  const scrollBySteps = (steps: number) => {
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    strip.current?.scrollBy({ left: steps * STEP, behavior: reduced ? "auto" : "smooth" })
  }

  return (
    <FeaturesSection labelledBy={headingId} className={cn("bg-muted", className)} {...props}>
      <header className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-4 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-foreground">
          <Globe size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
          {eyebrow ?? copy.eyebrow}
        </p>
        <h2 id={headingId} className="max-w-[760px] text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-5xl">
          {heading ?? copy.heading}
        </h2>
        <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
      </header>

      <ul
        ref={strip}
        role="list"
        tabIndex={0}
        aria-label={stripLabel ?? copy.stripLabel}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault()
            scrollBySteps(1)
          } else if (event.key === "ArrowLeft") {
            event.preventDefault()
            scrollBySteps(-1)
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || !strip.current) return
          drag.current = { x: event.clientX, left: strip.current.scrollLeft }
          setDragging(true)
          strip.current.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!drag.current || !strip.current) return
          strip.current.scrollLeft = drag.current.left - (event.clientX - drag.current.x)
        }}
        onPointerUp={() => {
          drag.current = null
          setDragging(false)
        }}
        onPointerCancel={() => {
          drag.current = null
          setDragging(false)
        }}
        onLostPointerCapture={() => {
          drag.current = null
          setDragging(false)
        }}
        className={cn(
          "-mx-8 flex scroll-px-8 gap-5 overflow-x-auto overscroll-x-contain px-8 py-2 [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden [@container(min-width:48rem)]:-mx-16 [@container(min-width:48rem)]:scroll-px-16 [@container(min-width:48rem)]:px-16 [@container(min-width:72rem)]:-mx-24 [@container(min-width:72rem)]:scroll-px-24 [@container(min-width:72rem)]:px-24",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          dragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"
        )}
      >
        {Array.from({ length: STAMPS }, (_, index) => (
          <li
            key={index}
            style={SCALLOP}
            className="w-[164px] shrink-0 snap-start bg-card p-3 motion-safe:transition-transform motion-safe:duration-200 hover:motion-safe:-translate-y-1"
          >
            <FeaturesPhotoSlot photo={photos?.[index]} className="h-[190px] w-[140px]" imageClassName="pointer-events-none select-none" />
          </li>
        ))}
      </ul>

      {list.length > 0 ? (
        <ul role="list" className="grid grid-cols-1 gap-8 [@container(min-width:72rem)]:grid-cols-3 [@container(min-width:72rem)]:gap-12">
          {list.map((column) => (
            <li key={column.id} className="flex min-w-0 flex-col gap-3 text-center">
              <h3 className="text-lg font-semibold text-foreground">{column.title}</h3>
              <p className="text-sm text-muted-foreground">{column.description}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresPerforatedPhotoStripCopy = COPY
