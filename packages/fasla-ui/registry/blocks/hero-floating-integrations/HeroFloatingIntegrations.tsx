"use client"

import * as React from "react"
import { FileText, Mail, MessageSquare, Mic, Video, type LucideIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Floating Integrations Hero.
 *
 * A centred proposition on a soft glow: an eyebrow chip, the headline, a
 * paragraph, two buttons and a reassurance line, then a strip of customer
 * wordmarks set as text. Around it float the product's pieces, each tilted:
 * five integration tiles (a microphone, a document, a chat, a video and a
 * mail glyph), a source-library card, a quote-to-insight card, a workflow
 * card and a repository card. The glow is Figma's ellipse, a radial
 * gradient from `secondary` at its centre to `background` at its rim.
 *
 * Desktop scatters the tiles and the four cards around the copy, each turned
 * as Figma turns it. Tablet drops the tiles and the workflow and repository
 * cards and sets the other two, upright, side by side under the wordmarks.
 * Mobile shows only the tiles, upright in one row above the copy, at 49px,
 * stacks the buttons at full width and steps the type down.
 *
 * The cards are pictures of the product, not controls: plain text, no links
 * or buttons. The tiles' glyphs are decoration and hidden from assistive
 * tech. The navigation row Figma draws above the copy (a wordmark, links,
 * "Log in" and "Start free") is left out: the page's own navbar does that
 * job, so every Desktop place below is Figma's less its 100px.
 *
 * In Arabic the copy, the tiles and the cards mirror: the source library
 * moves to the right, the insight card to the left, and every turn
 * reverses. Numbers stay left to right. No photos: the block draws nothing
 * but text, tokens and atoms.
 *
 * Each floating piece's Desktop place is Figma's: its centre as a share of
 * the 1440px content's width and in px from its top, and its turn, held in
 * the piece's own `--hero-fi-*` variables. The pieces are placed from the
 * inline start, so the same numbers draw the mirrored layout in Arabic.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the width its places are measured on.
 * Narrower, the cards would crowd the copy, so Tablet's layout covers 768
 * to 1439.
 */

export interface HeroFloatingIntegrationsAction {
  label: React.ReactNode
  href: string
}

export interface HeroFloatingIntegrationsSources {
  /** The small capitals at the card's top. */
  overline: React.ReactNode
  /** The card's title, an `h2`. */
  title: React.ReactNode
  /** The connected sources, one row each. Figma shows four. */
  items: React.ReactNode[]
  /** The sync line at the card's foot, after a dot. */
  status: React.ReactNode
}

export interface HeroFloatingIntegrationsInsight {
  /** The small capitals at the card's top. */
  overline: React.ReactNode
  /** The customer's words, a `blockquote`. Include the quotation marks. */
  quote: React.ReactNode
  /** The research tags under the quote. Figma shows two. */
  tags: React.ReactNode[]
  /** The line at the card's foot. Wrap times and numbers in `<bdi dir="ltr">`. */
  meta: React.ReactNode
}

export interface HeroFloatingIntegrationsWorkflow {
  /** The card's title, an `h2`, beside the chat glyph. */
  title: React.ReactNode
  /** The line under it. */
  detail: React.ReactNode
}

export interface HeroFloatingIntegrationsRepository {
  /** The card's title, an `h2`. */
  title: React.ReactNode
  /** The status at the title's end. */
  status: React.ReactNode
  /** The line under it. Wrap numbers in `<bdi dir="ltr">`. */
  detail: React.ReactNode
}

export interface HeroFloatingIntegrationsCopy {
  /** The chip above the headline. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroFloatingIntegrationsAction
  /** The secondary button beside it. Hidden when null. */
  secondaryAction: HeroFloatingIntegrationsAction | null
  /** The line under the buttons. */
  note: React.ReactNode
  /** The caption over the wordmarks. */
  trustCaption: React.ReactNode
  /** The customer wordmarks, set as text. Figma shows three. Hidden when empty. */
  brands: React.ReactNode[]
  /** The source-library card. Desktop and Tablet. */
  sources: HeroFloatingIntegrationsSources
  /** The quote-to-insight card. Desktop and Tablet. */
  insight: HeroFloatingIntegrationsInsight
  /** The workflow card. Desktop only. */
  workflow: HeroFloatingIntegrationsWorkflow
  /** The repository card. Desktop only. */
  repository: HeroFloatingIntegrationsRepository
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroFloatingIntegrationsCopy> = {
  en: {
    eyebrow: "EVERY CONVERSATION. ONE CLEAR PICTURE.",
    headline: "Understand your users,\nwithout the busywork.",
    description: "Bring interviews, surveys and support tickets together, and turn what people say into what you build next.",
    primaryAction: { label: "Start free", href: "#start" },
    secondaryAction: { label: "Explore integrations", href: "#integrations" },
    note: "Set up in minutes. No credit card needed.",
    trustCaption: "TEAMS THAT LISTEN CLOSELY",
    brands: ["Halcyn", "Nuvra", "Marloe"],
    sources: {
      overline: "YOUR SOURCES",
      title: "Everything in one place.",
      items: ["Customer interviews", "Q3 product feedback", "NPS responses", "Support conversations"],
      status: "Synced just now",
    },
    insight: {
      overline: "QUOTE → INSIGHT",
      quote: "“I just want to find answers faster, without digging.”",
      tags: ["# search", "# speed"],
      meta: (
        <>
          Customer interview · <bdi dir="ltr">2m</bdi> ago
        </>
      ),
    },
    workflow: {
      title: "Insight sent to the product team",
      detail: "Keep everyone close to the people you build for.",
    },
    repository: {
      title: "Product discovery",
      status: "Live",
      detail: (
        <>
          <bdi dir="ltr">24</bdi> insights · <bdi dir="ltr">8</bdi> contributors · One source of truth
        </>
      ),
    },
  },
  ar: {
    eyebrow: "كل محادثة، في صورة واحدة واضحة.",
    headline: "افهم مستخدميك\nمن دون عناء.",
    description: "اجمع المقابلات والاستبيانات وتذاكر الدعم، وحوّل ما يقوله الناس إلى ما ستبنيه بعد ذلك.",
    primaryAction: { label: "ابدأ مجانًا", href: "#start" },
    secondaryAction: { label: "استكشف التكاملات", href: "#integrations" },
    note: "الإعداد في دقائق، ولا حاجة إلى بطاقة ائتمان.",
    trustCaption: "فرق تُحسن الإصغاء",
    brands: ["سراج", "وهج", "أفق"],
    sources: {
      overline: "مصادرك",
      title: "كل شيء في مكان واحد.",
      items: ["مقابلات العملاء", "ملاحظات المنتج للربع الثالث", "ردود مؤشر الرضا", "محادثات الدعم"],
      status: "تمت المزامنة الآن",
    },
    insight: {
      overline: "اقتباس ← رؤية",
      quote: "«أريد أن أجد الإجابات أسرع، من دون بحث طويل.»",
      tags: ["# البحث", "# السرعة"],
      meta: "مقابلة عميل، قبل دقيقتين",
    },
    workflow: {
      title: "أُرسلت الرؤية إلى فريق المنتج",
      detail: "اجعل الجميع قريبين ممن تبني لهم.",
    },
    repository: {
      title: "استكشاف المنتج",
      status: "مباشر",
      detail: (
        <>
          <bdi dir="ltr">24</bdi> رؤية، و<bdi dir="ltr">8</bdi> مساهمين، ومصدر واحد للحقيقة
        </>
      ),
    },
  },
}

type Place = { x: number; y: number; turn: number }

/**
 * Each floating piece's Desktop place: `x` its centre as a percentage of the
 * content's width, `y` its centre in px from the content's top, and `turn`
 * its rotation in degrees (Figma's, with CSS's sign: positive is clockwise).
 */
const PLACES = {
  sources: { x: 11.403, y: 330, turn: -9 },
  insight: { x: 89.931, y: 335, turn: 9 },
  workflow: { x: 18.056, y: 641, turn: 5 },
  repository: { x: 83.222, y: 653, turn: -6 },
} satisfies Record<string, Place>

/** The five integration tiles, in Figma's order, each with its glyph and Desktop place. */
const TILES: { icon: LucideIcon; place: Place }[] = [
  { icon: Mic, place: { x: 19.479, y: 94, turn: -12 } },
  { icon: FileText, place: { x: 80.917, y: 117, turn: 13 } },
  { icon: MessageSquare, place: { x: 20.701, y: 511, turn: 9 } },
  { icon: Video, place: { x: 78.438, y: 517, turn: -12 } },
  { icon: Mail, place: { x: 9.167, y: 500, turn: -11 } },
]

/** A place as the piece's custom properties. */
function placeVars(place: Place): React.CSSProperties {
  return {
    "--hero-fi-x": `${place.x}%`,
    "--hero-fi-y": `${place.y}px`,
    "--hero-fi-turn": `${place.turn}deg`,
  } as React.CSSProperties
}

/**
 * Desktop only: taken out of flow and placed by its centre, from the inline
 * start, and turned; the turn reverses in Arabic. Each piece adds its own
 * width and a negative start margin of half of it.
 */
const FLOAT =
  "[@container(min-width:90rem)]:absolute [@container(min-width:90rem)]:start-[var(--hero-fi-x)] [@container(min-width:90rem)]:top-[var(--hero-fi-y)] [@container(min-width:90rem)]:-translate-y-1/2 [@container(min-width:90rem)]:rotate-[var(--hero-fi-turn)] [@container(min-width:90rem)]:[&:dir(rtl)]:rotate-[calc(var(--hero-fi-turn)*-1)]"

/** A floating card: Figma's card, border and two drop shadows (Tailwind's `shadow-md`). */
const CARD = "rounded-2xl border border-border bg-card shadow-md"

export interface HeroFloatingIntegrationsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroFloatingIntegrationsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function HeroFloatingIntegrations({
  locale = "en",
  eyebrow,
  headline,
  description,
  primaryAction,
  secondaryAction,
  note,
  trustCaption,
  brands,
  sources,
  insight,
  workflow,
  repository,
  className,
  ...props
}: HeroFloatingIntegrationsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const marks = brands ?? copy.brands
  const library = sources ?? copy.sources
  const quote = insight ?? copy.insight
  const flow = workflow ?? copy.workflow
  const repo = repository ?? copy.repository

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] relative isolate overflow-hidden bg-background", className)}
      {...props}
    >
      {/*
       * The section's colour fills the whole width; its content does not.
       * From Tablet up to Desktop the content keeps Figma's Tablet width,
       * 720px inside 24px padding, and centres, so a wide container shows
       * Figma's Tablet layout rather than a stretched one.
       */}
      <div className="relative mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col items-center gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-[152px] [@container(min-width:90rem)]:px-20 [@container(min-width:90rem)]:pb-[103px] [@container(min-width:90rem)]:pt-[101px]">
        {/*
         * The atmospheric field: Figma's ellipse, centred, from `secondary`
         * to `background` at its rim. It starts 12px above the tiles on
         * Mobile, 52px above the copy on Tablet and 50px above it on Desktop.
         */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-5 -z-10 mx-auto h-[420px] w-[340px] rounded-full [background-image:radial-gradient(closest-side,var(--secondary),var(--background))] [@container(min-width:48rem)]:top-3 [@container(min-width:48rem)]:h-[520px] [@container(min-width:48rem)]:w-[640px] [@container(min-width:90rem)]:top-[151px] [@container(min-width:90rem)]:h-[620px] [@container(min-width:90rem)]:w-[828px]"
        />

        {/*
         * The integration tiles: one row above the copy on Mobile, none on
         * Tablet, scattered around the copy on Desktop, where the row gives
         * up its box and each tile floats.
         */}
        <div aria-hidden className="flex gap-3 [@container(min-width:48rem)]:hidden [@container(min-width:90rem)]:contents">
          {TILES.map(({ icon: Icon, place }, index) => (
            <div
              key={index}
              style={placeVars(place)}
              className={cn(
                "flex size-[49px] shrink-0 items-center justify-center rounded-[11px] border border-border bg-card shadow-md [@container(min-width:90rem)]:-ms-[35px] [@container(min-width:90rem)]:size-[70px] [@container(min-width:90rem)]:rounded-2xl",
                FLOAT
              )}
            >
              <Icon size={24} strokeWidth={1.5} absoluteStrokeWidth className="size-[17px] text-foreground [@container(min-width:90rem)]:size-6" />
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col items-center gap-[25px] text-center [@container(min-width:90rem)]:max-w-[840px]">
          <p className="whitespace-nowrap rounded-[var(--radius-md)] border border-border bg-secondary px-[13px] py-1.5 text-xxs font-medium text-muted-foreground">
            {eyebrow ?? copy.eyebrow}
          </p>
          <h1
            id={headingId}
            className="whitespace-pre-line text-3xl font-bold text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl"
          >
            {headline ?? copy.headline}
          </h1>
          <p className="text-balance text-lg text-muted-foreground [@container(min-width:48rem)]:text-xl [@container(min-width:90rem)]:max-w-[595px]">
            {description ?? copy.description}
          </p>
          <div className="flex w-full flex-col items-center gap-3 pt-1.5 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row">
            <a href={primary.href} className={buttonVariants({ size: "lg", radius: "rounded", className: "w-full [@container(min-width:48rem)]:w-auto" })}>
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                className={buttonVariants({
                  variant: "secondary",
                  size: "lg",
                  radius: "rounded",
                  className: "w-full ring-1 ring-inset ring-border [@container(min-width:48rem)]:w-auto",
                })}
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
          <p className="text-balance text-sm text-muted-foreground">{note ?? copy.note}</p>
        </div>

        <div className="flex w-full flex-col items-center gap-[22px] text-center [@container(min-width:90rem)]:w-auto">
          <p className="text-xxs font-medium text-muted-foreground">{trustCaption ?? copy.trustCaption}</p>
          {marks.length > 0 ? (
            <ul className="flex flex-wrap justify-center gap-x-[35px] gap-y-2 text-base font-semibold text-muted-foreground [@container(min-width:48rem)]:text-lg">
              {marks.map((mark, index) => (
                <li key={index} className="whitespace-nowrap">
                  {mark}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/*
         * The cards: none on Mobile, two side by side on Tablet, and on
         * Desktop the row gives up its box and all four float.
         */}
        <div className="hidden w-full grid-cols-2 items-start gap-6 text-start [@container(min-width:48rem)]:grid [@container(min-width:90rem)]:contents">
          <div
            style={placeVars(PLACES.sources)}
            className={cn(
              CARD,
              "flex flex-col gap-[17px] p-5 [@container(min-width:90rem)]:-ms-[112px] [@container(min-width:90rem)]:w-[224px]",
              FLOAT
            )}
          >
            <p className="text-xxs font-medium text-muted-foreground">{library.overline}</p>
            <h2 className="text-lg font-medium text-foreground [@container(min-width:90rem)]:whitespace-nowrap">{library.title}</h2>
            <ul className="flex flex-col gap-[17px]">
              {library.items.map((item, index) => (
                <li key={index} className="flex items-center gap-2.5">
                  <span aria-hidden className="h-[26px] w-[22px] shrink-0 rounded-[5px] bg-secondary" />
                  <span className="min-w-0 text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xxs text-muted-foreground">
              <span aria-hidden>● </span>
              {library.status}
            </p>
          </div>

          <div
            style={placeVars(PLACES.insight)}
            className={cn(
              CARD,
              "flex flex-col gap-[13px] p-5 [@container(min-width:90rem)]:-ms-[114px] [@container(min-width:90rem)]:w-[228px]",
              FLOAT
            )}
          >
            <p className="text-xxs font-medium text-muted-foreground">{quote.overline}</p>
            <blockquote className="text-pretty text-lg font-medium text-foreground">{quote.quote}</blockquote>
            {quote.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-[5px] text-xxs text-muted-foreground">
                {quote.tags.map((tag, index) => (
                  <li key={index} className="whitespace-nowrap">
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="text-xxs text-muted-foreground">{quote.meta}</p>
          </div>

          <div
            style={placeVars(PLACES.workflow)}
            className={cn(
              CARD,
              "hidden items-start gap-[13px] p-[18px] [@container(min-width:90rem)]:-ms-[146px] [@container(min-width:90rem)]:flex [@container(min-width:90rem)]:w-[292px]",
              FLOAT
            )}
          >
            <MessageSquare aria-hidden size={24} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-foreground" />
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 className="text-sm font-medium text-foreground">{flow.title}</h2>
              <p className="text-xxs text-muted-foreground">{flow.detail}</p>
            </div>
          </div>

          <div
            style={placeVars(PLACES.repository)}
            className={cn(
              "rounded-xl border border-border bg-card shadow-md",
              "hidden flex-col gap-2.5 p-[18px] [@container(min-width:90rem)]:-ms-[150px] [@container(min-width:90rem)]:flex [@container(min-width:90rem)]:w-[300px]",
              FLOAT
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-medium text-foreground">{repo.title}</h2>
              <span className="whitespace-nowrap text-xxs text-muted-foreground">{repo.status}</span>
            </div>
            <p className="text-xxs text-muted-foreground">{repo.detail}</p>
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
export const heroFloatingIntegrationsCopy = COPY
