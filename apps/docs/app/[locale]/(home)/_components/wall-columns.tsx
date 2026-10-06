"use client"

import { useRef, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils"
import { useNearView } from "./use-near-view"
import type { Platform } from "./wall-platforms"

/** One testimonial, ready to draw: who, where it was posted, and the quote. */
export type WallItem = {
  name: string
  /** The picture smicolon.com shows: a portrait (`photo`) or the company's logo (`logo`). */
  image: string
  kind: "photo" | "logo"
  who: string
  t: string
  platform?: Platform
  href?: string
  /** The badge's accessible name, e.g. "Melvin Raaj's review on clutch.co". */
  label?: string
  /** Stars out of 5, from the CMS; no row when it has none. */
  rating?: number
  /** The rating row's accessible name, e.g. "Rated 5.0 out of 5". */
  ratingLabel?: string
}

/**
 * Official marks, unchanged, as smicolon.com draws them:
 * - Clutch: the "c" with the red dot from the clutch.co logotype (#17313B /
 *   #E62415), on a white disc so the navy stays visible on dark cards.
 * - Upwork: the "Up" monogram. Its brand guide allows it only in black or
 *   white, and only black on Up Green (#14A800), so: black on green.
 */
const PLATFORMS: Record<Platform, { site: string; disc: string; mark: React.ReactNode }> = {
  clutch: {
    site: "clutch.co",
    disc: "bg-[#fff] shadow-[inset_0_0_0_1px_var(--border)]",
    mark: (
      <svg viewBox="255.3 35.25 80 80" aria-hidden="true" className="size-3.5">
        <path
          fill="#17313B"
          d="M315 91.8c-4 3.6-9.3 5.6-15.1 5.6a21.6 21.6 0 01-22.2-22.3c0-12.9 9.1-21.9 22.2-21.9 5.7 0 11.1 1.9 15.2 5.5l2.8 2.4 12.4-12.4-3.1-2.8a40.6 40.6 0 00-27.3-10.3c-23 0-39.7 16.6-39.7 39.4a39 39 0 0039.7 39.9c10.5 0 20.3-3.7 27.5-10.4l3-2.8-12.6-12.4-2.8 2.5z"
        />
        <circle cx="299.2" cy="75.3" r="13.3" fill="#E62415" />
      </svg>
    ),
  },
  upwork: {
    site: "upwork.com",
    disc: "bg-[#14A800]",
    mark: (
      <svg viewBox="0.4 -1.2 36 36" aria-hidden="true" className="size-3.5">
        <path
          fill="#000"
          d="M28.18,19.06A6.54,6.54,0,0,1,23,16c.67-5.34,2.62-7,5.2-7s4.54,2,4.54,5-2,5-4.54,5m0-13.34a7.77,7.77,0,0,0-7.9,6.08,26,26,0,0,1-1.93-5.62H12v7.9c0,2.87-1.3,5-3.85,5s-4-2.12-4-5l0-7.9H.49v7.9A8.61,8.61,0,0,0,2.6,20a7.27,7.27,0,0,0,5.54,2.35c4.41,0,7.5-3.39,7.5-8.24V8.77a25.87,25.87,0,0,0,3.66,8.05L17.34,28h3.72l1.29-7.92a11,11,0,0,0,1.36,1,8.32,8.32,0,0,0,4.14,1.28h.34A8.1,8.1,0,0,0,36.37,14a8.12,8.12,0,0,0-8.19-8.31"
        />
      </svg>
    ),
  },
}

/**
 * The star smicolon.com draws, at its size (14px, 2px apart) and in its
 * yellow (#F5A524). Stars past the rating are faded to 30%.
 */
const STAR_PATH = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"

/** Columns for the viewport: 3, then 2 at 1000px and below, then 1 at 640px and below. */
const QUERIES = ["(max-width: 640px)", "(max-width: 1000px)"] as const

/** Subscribes to the two breakpoints the column count depends on. */
function subscribe(onChange: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q))
  lists.forEach((l) => l.addEventListener("change", onChange))
  return () => lists.forEach((l) => l.removeEventListener("change", onChange))
}

/** The column count for the current viewport. */
function columnCount() {
  if (window.matchMedia(QUERIES[0]).matches) return 1
  if (window.matchMedia(QUERIES[1]).matches) return 2
  return 3
}

/**
 * A column's drift time, so every column moves at the old wall's pace (about
 * 25px a second) however long its quotes are. The height is an estimate from
 * the text length: a card's frame plus about 50 characters a line.
 */
function drift(quotes: string[]) {
  const height = quotes.reduce((sum, q) => sum + 116 + Math.ceil(q.length / 50) * 26, 0)
  return `${Math.max(30, Math.round(height / 25))}s`
}

/**
 * One testimonial: picture, name, role, the badge of the site it was posted
 * on, the quote in full, and its star rating when it has one. `copy` marks the loop's repeat, whose badge
 * leaves the Tab order.
 */
function ReviewCard({ item, copy = false }: { item: WallItem; copy?: boolean }) {
  const platform = item.platform && PLATFORMS[item.platform]
  return (
    <article className="rounded-[14px] border bg-card px-[22px] py-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        {/* As smicolon.com draws them: a photo fills the circle; a logo, often
            white, sits padded on a dark disc in both themes. Both keep a 1px
            ring so they hold their edge against the card. Decorative: the name
            is next to it. */}
        <img
          src={item.image}
          alt=""
          width={44}
          height={44}
          loading="lazy"
          decoding="async"
          className={cn("size-11 shrink-0 rounded-full border", item.kind === "logo" ? "bg-fasla-ink object-contain p-2" : "bg-muted object-cover")}
        />
        <span className="flex min-w-0 flex-1 flex-col items-start">
          <b className="w-full truncate text-[15px] font-semibold leading-[1.3]">{item.name}</b>
          <span className="text-[13px] leading-[1.3] text-muted-foreground">{item.who}</span>
        </span>
        {platform && (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            tabIndex={copy ? -1 : undefined}
            dir="ltr"
            className="inline-flex shrink-0 items-center gap-[7px] self-start rounded-full font-sans text-[13px] text-[color:var(--l-fg-2)] transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <span className={cn("grid size-[22px] place-items-center rounded-full", platform.disc)}>{platform.mark}</span>
            {platform.site}
          </a>
        )}
      </div>
      <blockquote className="text-[15px] leading-[1.6] text-[color:var(--l-fg-2)] rtl:leading-[1.8]">
        <p>{item.t}</p>
      </blockquote>
      {item.rating !== undefined && (
        <div role="img" aria-label={item.ratingLabel} className="mt-3.5 flex items-center gap-2 text-[13px] font-medium text-[color:var(--l-fg-2)]">
          <span className="inline-flex gap-0.5 text-[#F5A524]">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} viewBox="0 0 24 24" aria-hidden="true" className={cn("size-3.5", i >= Math.round(item.rating ?? 0) && "opacity-30")}>
                <path fill="currentColor" d={STAR_PATH} />
              </svg>
            ))}
          </span>
          <span dir="ltr">{item.rating.toFixed(1)}</span>
        </div>
      )}
    </article>
  )
}

/**
 * The drifting columns, holding every testimonial at every width: 3 columns,
 * then 2, then 1, newest first across. The server draws three columns with
 * each card once; in the browser the count follows the viewport and each
 * column gains its repeat, hidden from assistive technology, so the loop is
 * seamless. The repeat, and the drift, start only when the wall nears the
 * viewport, which keeps them out of the language flip's half second. The
 * page's HTML carries each quote once.
 */
export function WallColumns({ items }: { items: WallItem[] }) {
  const cols = useSyncExternalStore(subscribe, columnCount, () => 3)
  const wall = useRef<HTMLDivElement>(null)
  const mounted = useNearView(wall)

  const columns = Array.from({ length: cols }, (_, c) => items.filter((_, i) => i % cols === c))

  return (
    <div ref={wall} className={cn("l-wall grid gap-5", cols === 3 ? "grid-cols-3" : cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {columns.map((column, c) => (
        <div key={c} className={cn("flex flex-col gap-5", mounted && "l-wall-col")} style={{ "--dur": drift(column.map((item) => item.t)) } as React.CSSProperties}>
          {column.map((item) => (
            <ReviewCard key={item.name} item={item} />
          ))}
          {mounted && (
            <div aria-hidden="true" className="l-wall-dup contents">
              {column.map((item) => (
                <ReviewCard key={item.name} item={item} copy />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
