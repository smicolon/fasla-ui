"use client"

import * as React from "react"
import { Play } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"

/*
 * Figma: `Hero` (46552:249264), Type=Textured Dark Hero.
 *
 * A dark band under a texture photo at 45%, carrying the pitch: a light
 * first line, the headline under it, a paragraph and a "watch the tour"
 * link behind a round `chart-5` disc. A round sticker in `chart-5`, tilted,
 * announces the release; under the copy a row of tabs, then a product
 * window rising out of the band: two boards of rows, each with a status
 * badge.
 *
 * Desktop sets the copy 900px wide with the sticker at the end side, and
 * the window 40px in from the content's edges, its foot running past the
 * section's bottom edge, which crops its empty last 40px; below the band
 * the page's own background shows. Tablet keeps the boards side by side and
 * the window whole; Mobile stacks the boards and steps the type down. On
 * both the band's colour runs on under the window.
 *
 * The tabs are drawn, not working: a plain list with the first one lit, as
 * Figma draws them. The disc is a link, not a player; its play glyph is
 * decoration. The navigation row Figma draws above the copy (a "Get
 * started" button) is left out: the page's own navbar does that job.
 *
 * The band is dark and its text light in both modes, as Figma draws them:
 * a photograph does not change with the theme. In light mode that is the
 * inverse tokens; in dark mode the page's own `background` and
 * `foreground` hold the same colours, so `dark:` switches to them, as
 * Framed Full-Bleed does. Figma's paragraph and tabs are muted; here they
 * are full `foreground`, since muted text fails over the grain's bright
 * flecks. Dark `foreground` is a touch dimmer than white, so in dark mode
 * the texture drops from 45% to 40% to keep the same contrast. The sticker
 * and the disc are `chart-5` surfaces, not the photo, and keep the inverse
 * tokens Figma binds.
 *
 * In Arabic the copy, the sticker, the tabs and the boards mirror: the
 * sticker moves to the left and tilts the other way. The play glyph does not
 * flip, and numbers stay left to right. The photo is never flipped.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroTexturedDarkAction {
  label: React.ReactNode
  href: string
}

export interface HeroTexturedDarkPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroTexturedDarkRow {
  /** The row's name. */
  label: React.ReactNode
  /** Its status, on a soft badge. */
  status: React.ReactNode
  /** The badge's tone. */
  tone: "success" | "info"
}

export interface HeroTexturedDarkBoard {
  /** The board's title, an `h2`. */
  title: React.ReactNode
  /** The board's rows. Figma shows three. */
  rows: HeroTexturedDarkRow[]
}

export interface HeroTexturedDarkCopy {
  /** The headline, an `h1`: a light first line, then the main line. A line break in the string breaks the line. */
  headline: { lead: React.ReactNode; main: React.ReactNode }
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The text link behind the play disc. Hidden when null. */
  tourAction: HeroTexturedDarkAction | null
  /** The tilted round sticker. A line break in the string breaks the line. Hidden when empty. */
  sticker: React.ReactNode
  /** The tabs above the window, drawn, not working. Figma shows four. Hidden when empty. */
  tabs: React.ReactNode[]
  /** The boards in the product window. Figma shows two. */
  boards: HeroTexturedDarkBoard[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroTexturedDarkCopy> = {
  en: {
    headline: { lead: "One workspace to", main: "Plan, write and ship\nyour next release" },
    description: "Roadmaps, docs and feedback in one place, connected so nothing slips through the cracks.",
    tourAction: {
      label: (
        <>
          Watch the <bdi dir="ltr">3</bdi>-minute tour
        </>
      ),
      href: "#tour",
    },
    sticker: (
      <>
        {"NEW IN\nVERSION "}
        <bdi dir="ltr">2</bdi>
      </>
    ),
    tabs: ["Roadmap", "Docs", "Feedback", "Releases"],
    boards: [
      {
        title: "Planned",
        rows: [
          { label: "Search filters", status: "Ready", tone: "success" },
          { label: "Bulk export", status: "Ready", tone: "success" },
          { label: "Dark mode", status: "Review", tone: "info" },
        ],
      },
      {
        title: "In progress",
        rows: [
          { label: "Onboarding", status: "Ready", tone: "success" },
          { label: "Billing page", status: "Review", tone: "info" },
          { label: "Mobile app", status: "Ready", tone: "success" },
        ],
      },
    ],
  },
  ar: {
    headline: { lead: "مساحة عمل واحدة", main: "لتخطط وتكتب وتطلق\nإصدارك القادم" },
    description: "خطط الطريق والمستندات والملاحظات في مكان واحد، مترابطة حتى لا يضيع شيء.",
    tourAction: {
      label: (
        <>
          شاهد جولة في <bdi dir="ltr">3</bdi> دقائق
        </>
      ),
      href: "#tour",
    },
    sticker: (
      <>
        {"جديد في\nالإصدار "}
        <bdi dir="ltr">2</bdi>
      </>
    ),
    tabs: ["خطة الطريق", "المستندات", "الملاحظات", "الإصدارات"],
    boards: [
      {
        title: "مخطط لها",
        rows: [
          { label: "عوامل تصفية البحث", status: "جاهز", tone: "success" },
          { label: "تصدير جماعي", status: "جاهز", tone: "success" },
          { label: "الوضع الداكن", status: "مراجعة", tone: "info" },
        ],
      },
      {
        title: "قيد التنفيذ",
        rows: [
          { label: "تهيئة المستخدمين", status: "جاهز", tone: "success" },
          { label: "صفحة الفوترة", status: "مراجعة", tone: "info" },
          { label: "تطبيق الجوال", status: "جاهز", tone: "success" },
        ],
      },
    ],
  },
}

export interface HeroTexturedDarkProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroTexturedDarkCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The texture laid over the band at 45%. None by default: the band shows
   * its plain dark colour, so the copy stays readable.
   * @default none: the plain dark band
   */
  photo?: HeroTexturedDarkPhoto
  /** Which tab is drawn lit, counting from 0. Nothing switches: the tabs are drawn, not working. */
  activeTab?: number
}

export function HeroTexturedDark({
  locale = "en",
  headline,
  description,
  tourAction,
  sticker,
  tabs,
  boards,
  photo,
  activeTab = 0,
  className,
  ...props
}: HeroTexturedDarkProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const title = headline ?? copy.headline
  const tour = tourAction === undefined ? copy.tourAction : tourAction
  const badge = sticker ?? copy.sticker
  const tabList = tabs ?? copy.tabs

  // Whether the tab row overflows and scrolls: only then is it a stop for the keyboard.
  const tabsRef = React.useRef<HTMLUListElement>(null)
  const [tabsScroll, setTabsScroll] = React.useState(false)
  React.useEffect(() => {
    const list = tabsRef.current
    if (!list || typeof ResizeObserver === "undefined") return
    const check = () => setTabsScroll(list.scrollWidth > list.clientWidth + 1)
    check()
    // The row for its width, each tab for its text (a font that loads late widens it).
    const observer = new ResizeObserver(check)
    observer.observe(list)
    for (const item of Array.from(list.children)) observer.observe(item)
    return () => observer.disconnect()
  }, [tabList.length])
  const boardList = boards ?? copy.boards

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] relative isolate overflow-hidden",
        className
      )}
      {...props}
    >
      {/*
       * The section's own colour, on a layer: the band's colour on Mobile and
       * Tablet, where it runs on under the window, and the page's on Desktop,
       * below the band. A container query sizes against the container's
       * ancestors, never the container itself, so the Desktop switch cannot
       * sit on the section.
       */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-background-inverse dark:bg-background [@container(min-width:90rem)]:bg-background" />
      {/*
       * The section's colour fills the whole width; its content does not.
       * From Tablet up to Desktop the content keeps Figma's Tablet width,
       * 720px inside 24px padding, and centres, so a wide container shows
       * Figma's Tablet layout rather than a stretched one.
       */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col px-4 py-8 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:px-[120px] [@container(min-width:90rem)]:pb-0 [@container(min-width:90rem)]:pt-24">
        {/*
         * The band: the copy and the tabs, then room for the top of the
         * window, which rises into it (80px on Mobile, 168 on Tablet, 100 on
         * Desktop, as Figma's texture ends).
         */}
        <div className="relative isolate flex flex-col pb-[120px] [@container(min-width:48rem)]:pb-[216px] [@container(min-width:90rem)]:pb-[132px]">
          {/*
           * The band's colour and texture run edge to edge of the section,
           * from its top: out of the content's padding and past its sides.
           */}
          <div className="absolute inset-x-[calc(50%-50cqw)] -top-8 bottom-0 -z-10 overflow-hidden bg-background-inverse dark:bg-background [@container(min-width:48rem)]:-top-16 [@container(min-width:90rem)]:-top-24">
            {photo ? (
              <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover opacity-[0.45] dark:opacity-40" />
            ) : null}
          </div>

          <div className="relative flex flex-col items-start gap-4">
            <h1 id={headingId} className="flex max-w-[900px] flex-col gap-4 text-foreground-inverse dark:text-foreground">
              <span className="text-3xl font-light [@container(min-width:48rem)]:text-4xl">{title.lead}</span>
              <span className="whitespace-pre-line text-3xl font-semibold [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-7xl">
                {title.main}
              </span>
            </h1>
            <p className="text-pretty text-base text-foreground-inverse dark:text-foreground [@container(min-width:48rem)]:max-w-[560px] [@container(min-width:48rem)]:text-lg">
              {description ?? copy.description}
            </p>
            {tour ? (
              <a
                href={tour.href}
                className="relative inline-flex items-center gap-3 rounded-sm before:absolute before:-inset-x-1 before:-inset-y-2 text-base font-medium text-foreground-inverse [outline:none] dark:text-foreground hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-inverse focus-visible:dark:outline-foreground"
              >
                {/* Figma's disc. The play glyph is ours, and decoration: the link opens the tour, it plays nothing here. */}
                <span aria-hidden className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-chart-5 text-foreground-inverse">
                  <Play size={12} strokeWidth={1.5} absoluteStrokeWidth className="fill-current" />
                </span>
                <span className="whitespace-nowrap">{tour.label}</span>
              </a>
            ) : null}

            {/*
             * The sticker sits where Figma places it against the copy's foot:
             * at the end side, tilted 12° (the other way in Arabic). On Tablet
             * and Mobile it hangs below the copy, into the gap above the tabs.
             * On Mobile the tabs sit 72px below the copy, not 40, so the
             * sticker clears them, as Figma's Arabic Mobile variant spaces
             * them: over its edge a tab could not keep its contrast.
             */}
            {badge ? (
              <p className="absolute bottom-[-55px] end-0 flex size-[92px] rotate-12 items-center justify-center whitespace-pre-line rounded-full bg-chart-5 text-center text-xxs font-bold text-foreground-inverse [&:dir(rtl)]:-rotate-12 [@container(min-width:48rem)]:-bottom-9 [@container(min-width:48rem)]:end-[23px] [@container(min-width:48rem)]:size-[132px] [@container(min-width:48rem)]:text-sm [@container(min-width:90rem)]:bottom-2 [@container(min-width:90rem)]:end-[43px]">
                <span>{badge}</span>
              </p>
            ) : null}
          </div>

          {tabList.length > 0 ? (
            /*
             * One line, as Figma draws it: 24px apart on Mobile (12 in Arabic,
             * whose words run wider), 48 from Tablet up. Should the tabs ever
             * outgrow the row, it scrolls sideways rather than wrapping, and
             * takes keyboard focus then so the hidden tabs can be reached.
             * A scrolling box clips, so 4px of bottom padding, taken back by
             * the margin, keeps the underline in view.
             */
            <ul
              ref={tabsRef}
              tabIndex={tabsScroll ? 0 : undefined}
              className={cn(
                badge ? "mt-[72px]" : "mt-10",
                "-mb-1 flex gap-x-6 overflow-x-auto pb-1 text-base font-medium [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-inverse focus-visible:dark:outline-foreground [&:dir(rtl)]:gap-x-3 [@container(min-width:48rem)]:mt-12 [@container(min-width:48rem)]:gap-x-12 [@container(min-width:48rem)]:text-lg [@container(min-width:48rem)]:[&:dir(rtl)]:gap-x-12 [@container(min-width:90rem)]:mt-[108px]"
              )}
            >
              {tabList.map((tab, index) => (
                <li
                  key={index}
                  aria-current={index === activeTab ? "true" : undefined}
                  className={cn(
                    "shrink-0 whitespace-nowrap",
                    // Every tab is the same light colour, for contrast on the
                    // texture; the underline marks the active one.
                    index === activeTab
                      ? "text-foreground-inverse underline decoration-2 underline-offset-8 dark:text-foreground"
                      : "text-foreground-inverse dark:text-foreground"
                  )}
                >
                  {tab}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/*
         * The window rises into the band. On Desktop it sits 40px in from the
         * content's edges and runs 40px past the section's foot, which crops
         * it; that is only its empty padding, whatever the rows.
         */}
        <div className="relative -mt-20 flex flex-col gap-4 rounded-xl bg-card p-4 shadow-2xl [@container(min-width:48rem)]:-mt-[168px] [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:gap-8 [@container(min-width:48rem)]:p-8 [@container(min-width:90rem)]:-mb-10 [@container(min-width:90rem)]:-mt-[100px] [@container(min-width:90rem)]:mx-10">
          {boardList.map((board, index) => (
            <div
              key={index}
              className="flex min-w-0 flex-1 flex-col gap-3 rounded-lg bg-muted p-5 [@container(min-width:90rem)]:min-h-[256px]"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-foreground">{board.title}</h2>
                {/* Figma's "+": an add control drawn, not working. */}
                <span aria-hidden className="text-base font-medium text-info">
                  +
                </span>
              </div>
              <ul className="flex flex-col gap-3">
                {board.rows.map((row, rowIndex) => (
                  <li key={rowIndex} className="flex min-h-9 items-center justify-between gap-3 rounded-md bg-card px-3">
                    <span className="min-w-0 text-sm font-medium text-foreground">{row.label}</span>
                    <Badge variant="soft" tone={row.tone} size="sm" radius="rounded" className="shrink-0 whitespace-nowrap">
                      {row.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroTexturedDarkCopy = COPY
