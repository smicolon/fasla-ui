"use client"

import * as React from "react"
import { Activity, ArrowRight, BookOpen, Headset, House, Search } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Error State` (42556:548), Type=Recovery Bento.
 *
 * A start-aligned 404 header over a bento of ways forward: a wide search
 * tile and the homepage on the first row, three more destinations on the
 * second. The search tile is a form that hands its query to `onSearch`; every
 * other tile is a link. Mobile first: the base classes are Figma's Mobile
 * (360), `md:` its Tablet (768) and `lg:` its Desktop (1440). Direction is
 * the page's `dir`; every side is a logical one, so the tiles mirror in
 * Arabic and each Open arrow turns to point left.
 */

export interface ErrorStateRecoveryBentoTile {
  title: React.ReactNode
  description: React.ReactNode
  href: string
  /** The glyph in the tile's badge, a lucide icon drawn at 18px. */
  icon?: React.ReactNode
}

export interface ErrorStateRecoveryBentoCopy {
  /** The small label over the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The search tile's title; it also names the field. */
  searchTitle: React.ReactNode
  /** The line under the search tile's title. */
  searchDescription: React.ReactNode
  /** The hint in the empty search field. */
  searchPlaceholder: string
  /** The link tile beside the search, usually the homepage. Hidden when null. */
  homeTile: ErrorStateRecoveryBentoTile | null
  /** The tiles on the second row, in reading order. The row is hidden when the list is empty. */
  tiles: ErrorStateRecoveryBentoTile[]
  /** The word with the arrow at the foot of each link tile. */
  openLabel: React.ReactNode
}

const glyph = "size-[18px]"

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateRecoveryBentoCopy> = {
  en: {
    eyebrow: "ERROR 404",
    heading: "Let’s find you a way forward",
    description:
      "The page you asked for is gone, but one of these will almost certainly get you where you were going.",
    searchTitle: "Search everything",
    searchDescription: "Titles, docs, reports and comments across your whole workspace.",
    searchPlaceholder: "Try “annual report”…",
    homeTile: {
      title: "Go to the homepage",
      description: "Start again from the top of Fasla.",
      href: "/",
      icon: <House strokeWidth={1.5} className={glyph} />,
    },
    tiles: [
      {
        title: "Documentation",
        description: "Guides, references and integration notes.",
        href: "#docs",
        icon: <BookOpen strokeWidth={1.5} className={glyph} />,
      },
      {
        title: "System status",
        description: "Check whether something is currently down.",
        href: "#status",
        icon: <Activity strokeWidth={1.5} className={glyph} />,
      },
      {
        title: "Talk to support",
        description: "A real person replies within the hour.",
        href: "#support",
        icon: <Headset strokeWidth={1.5} className={glyph} />,
      },
    ],
    openLabel: "Open",
  },
  ar: {
    eyebrow: (
      <>
        خطأ <bdi dir="ltr">404</bdi>
      </>
    ),
    heading: "لنجد لك طريقًا للمضي قدمًا",
    description: "الصفحة التي طلبتها لم تعد موجودة، لكن أحد هذه الخيارات سيوصلك بالتأكيد إلى وجهتك.",
    searchTitle: "ابحث في كل شيء",
    searchDescription: "العناوين والمستندات والتقارير والتعليقات في مساحة عملك بالكامل.",
    searchPlaceholder: "جرّب ”التقرير السنوي“…",
    homeTile: {
      title: "الذهاب إلى الصفحة الرئيسية",
      description: "ابدأ من جديد من أعلى فاصلة.",
      href: "/",
      icon: <House strokeWidth={1.5} className={glyph} />,
    },
    tiles: [
      {
        title: "التوثيق",
        description: "أدلة ومراجع وملاحظات تكامل.",
        href: "#docs",
        icon: <BookOpen strokeWidth={1.5} className={glyph} />,
      },
      {
        title: "حالة النظام",
        description: "تحقق مما إذا كان هناك عطل حاليًا.",
        href: "#status",
        icon: <Activity strokeWidth={1.5} className={glyph} />,
      },
      {
        title: "تحدث إلى الدعم",
        description: "شخص حقيقي يرد خلال ساعة.",
        href: "#support",
        icon: <Headset strokeWidth={1.5} className={glyph} />,
      },
    ],
    openLabel: "افتح",
  },
}

export interface ErrorStateRecoveryBentoProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateRecoveryBentoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Called with the trimmed query when the search is sent (Enter). */
  onSearch?: (query: string) => void
  /**
   * What the search field holds at first.
   * @default ""
   */
  defaultQuery?: string
}

const TILE = "flex flex-col justify-between gap-4 rounded-[14px] border border-border bg-card p-7"

/** A tile's badge, title and line. */
function TileCopy({ tile, titleId }: { tile: Pick<ErrorStateRecoveryBentoTile, "title" | "description" | "icon">; titleId?: string }) {
  return (
    <span className="flex flex-col gap-3">
      {tile.icon ? (
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-muted text-muted-foreground [&_svg]:[stroke-width:1.5]"
        >
          {tile.icon}
        </span>
      ) : null}
      <span className="flex flex-col gap-1.5">
        <span id={titleId} className="text-lg font-semibold text-foreground">
          {tile.title}
        </span>
        <span className="text-sm text-muted-foreground">{tile.description}</span>
      </span>
    </span>
  )
}

/** A tile that is a link: badge, title, line and the Open arrow. */
function LinkTile({ tile, openLabel, className }: { tile: ErrorStateRecoveryBentoTile; openLabel: React.ReactNode; className?: string }) {
  return (
    <a
      href={tile.href}
      className={cn(
        TILE,
        "group/tile [outline:none] transition-colors hover:bg-accent motion-reduce:transition-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
    >
      <TileCopy tile={tile} />
      <span aria-hidden="true" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {openLabel}
        <ArrowRight strokeWidth={1.5} className="size-3.5 shrink-0 text-muted-foreground [&:dir(rtl)]:-scale-x-100" />
      </span>
    </a>
  )
}

export function ErrorStateRecoveryBento({
  locale = "en",
  eyebrow,
  heading,
  description,
  searchTitle,
  searchDescription,
  searchPlaceholder,
  homeTile,
  tiles,
  openLabel,
  onSearch,
  defaultQuery = "",
  className,
  ...props
}: ErrorStateRecoveryBentoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const searchTitleId = React.useId()
  const [query, setQuery] = React.useState(defaultQuery)
  const label = eyebrow ?? copy.eyebrow
  const home = homeTile === undefined ? copy.homeTile : homeTile
  const list = tiles ?? copy.tiles
  const open = openLabel ?? copy.openLabel

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8">
        <header className="flex w-full flex-col gap-3 lg:max-w-[640px]">
          {label ? <p className="text-lg font-medium text-destructive">{label}</p> : null}
          <h1 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-2">
          <div className={cn(TILE, "p-[27px] md:h-[236px] md:p-7 lg:h-[268px]")}>
            <TileCopy
              titleId={searchTitleId}
              tile={{
                title: searchTitle ?? copy.searchTitle,
                description: searchDescription ?? copy.searchDescription,
                icon: <Search strokeWidth={1.5} className={glyph} />,
              }}
            />
            <form
              role="search"
              aria-labelledby={searchTitleId}
              onSubmit={(event) => {
                event.preventDefault()
                onSearch?.(query.trim())
              }}
            >
              <Input
                type="search"
                startIcon={<Search strokeWidth={1.5} aria-hidden="true" />}
                placeholder={searchPlaceholder ?? copy.searchPlaceholder}
                aria-labelledby={searchTitleId}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>
          </div>
          {home ? <LinkTile tile={home} openLabel={open} className="h-[196px] md:h-[236px] lg:h-[268px]" /> : null}
        </div>

        {list.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {list.map((tile, index) => (
              <li key={index} className="flex">
                <LinkTile tile={tile} openLabel={open} className="h-[196px] w-full md:h-[212px]" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateRecoveryBentoCopy = COPY
