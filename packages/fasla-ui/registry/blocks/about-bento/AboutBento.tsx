"use client"

import * as React from "react"
import { Quote, Star } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"

/*
 * Figma: `About` (46368:243915), Type=Bento.
 *
 * Five tiles in two rows. The first row pairs the statement tile (a quote
 * mark, the heading, a paragraph and a footer line with "SINCE 2019" and a
 * "HIRING NOW" dot) with the metrics tile: three figures on `primary`, at a
 * fixed 420px. The second row is the capabilities tile (team tags as outline
 * Badges), a culture photo and a testimonial tile (five stars, the quote, an
 * initials Avatar, a name and a role), in Figma's 520 : 300 : 380 widths.
 * The card tiles sit on `card` with a `border` stroke and the `xs` shadow;
 * every tile has the `xl` radius.
 *
 * Tablet keeps the first row (the metrics tile narrows to 300) and gives the
 * capabilities tile a row of its own, with the photo and the testimonial
 * sharing a third row. The heading drops from 30px to 24. Mobile stacks the
 * five tiles in reading order, the photo 200px tall and the figures 30px.
 *
 * In Arabic the rows run right to left: the metrics tile and the
 * testimonial take the start side's opposite, as Figma's RTL variants draw
 * them, all through flex and grid order. The quote mark turns 180° as
 * Figma's does. The photo is never flipped.
 *
 * Motion: the tiles fade up 16px with an 80ms stagger, once, when the block
 * scrolls into view; the figures count up from 0 when the metrics tile is
 * half in view (99.9 counts its decimal). A tile lifts 4px with a deeper
 * shadow on hover, on pointers that hover. Nothing loops: the "HIRING NOW"
 * dot is still. Under reduced motion the final state shows at once.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutBentoPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutBentoMetric {
  /**
   * The figure, as it should read when the count ends, such as "8,200+" or
   * "99.9%". Its number counts up from 0; the text around it stays.
   */
  value: string
  /** The line under the figure. */
  label: React.ReactNode
}

export interface AboutBentoTestimonial {
  /** The quote, with its quotation marks. */
  quote: React.ReactNode
  /** Who said it. Also the source of the avatar's initials. */
  name: string
  /** Their role and company. */
  role: React.ReactNode
  /** A photo for the avatar. Initials when missing. */
  avatar?: string
  /** Stars out of five. @default 5 */
  rating?: number
}

export interface AboutBentoCopy {
  /** The statement, the section's heading, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under the statement. */
  description: React.ReactNode
  /** The quiet line at the start of the statement's footer. Hidden when empty. */
  since: React.ReactNode
  /** The highlighted status at the end of the footer, after its dot. Hidden when null. */
  hiring: React.ReactNode | null
  /** The label at the top of the metrics tile. */
  metricsLabel: React.ReactNode
  /** The figures. Figma draws three. */
  metrics: AboutBentoMetric[]
  /** The label at the top of the capabilities tile. */
  capabilitiesLabel: React.ReactNode
  /** The team tags, shown as outline Badges. */
  capabilities: React.ReactNode[]
  /** The testimonial tile. Hidden when null. */
  testimonial: AboutBentoTestimonial | null
  /** The stars' accessible name, from the rating. */
  ratingLabel: (rating: number) => string
  /** Shown in place of a list (figures, tags) or the photo when it is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutBentoCopy> = {
  en: {
    heading: "We make teams stop and ask: how was work this easy?",
    description:
      "That reaction is the whole job. Strategy, design, and engineering under one roof — for teams that refuse to feel busy.",
    since: "SINCE 2019",
    hiring: "HIRING NOW",
    metricsLabel: "BY THE NUMBERS",
    metrics: [
      { value: "8,200+", label: "teams run on our tools" },
      { value: "12", label: "countries, one office dog" },
      { value: "99.9%", label: "uptime, calm included" },
    ],
    capabilitiesLabel: "WHAT WE DO",
    capabilities: ["Product design", "Engineering", "Research", "Security", "Support", "Motion"],
    testimonial: {
      quote:
        "“I'd put off our team hub for years because nothing felt like us. They nailed our voice — not a designer's idea of it.”",
      name: "Dana Whitfield",
      role: "COO, FIELDNOTE",
    },
    ratingLabel: (rating) => `Rated ${rating} out of 5`,
    empty: "Nothing to show yet.",
  },
  ar: {
    heading: "نجعل الفرق تتوقف وتسأل: كيف كان العمل بهذه السهولة؟",
    description:
      "هذا التفاعل هو جوهر عملنا. الاستراتيجية والتصميم والهندسة تحت سقف واحد، لفرق ترفض الشعور بالانشغال.",
    since: "منذ 2019",
    hiring: "نوظّف الآن",
    metricsLabel: "بالأرقام",
    metrics: [
      { value: "8,200+", label: "فريق يعمل على أدواتنا" },
      { value: "12", label: "دولة، وكلب مكتب واحد" },
      { value: "99.9%", label: "وقت تشغيل، والهدوء مشمول" },
    ],
    capabilitiesLabel: "ما نقوم به",
    capabilities: ["تصميم المنتجات", "الهندسة", "البحث", "الأمان", "الدعم", "الحركة"],
    testimonial: {
      quote: "«أجّلت مركز الفريق لسنوات لأنه لا شيء كان يشبهنا. لقد أتقنوا صوتنا، لا فكرة مصمم عنه.»",
      name: "دانا ويتفيلد",
      role: "مديرة العمليات، فيلدنوت",
    },
    ratingLabel: (rating) => `التقييم ${rating} من 5`,
    empty: "لا يوجد ما يُعرض بعد.",
  },
}

/** A card tile: Figma's `card` fill, `border` stroke, `xl` radius and `xs` shadow. */
const CARD = "rounded-xl border border-border bg-card p-8 shadow-xs"
/** The hover lift, on pointers that hover only. */
const LIFT =
  "transition-[transform,box-shadow] duration-150 ease-out motion-reduce:transition-none hover:[@media(pointer:fine)]:-translate-y-1 hover:[@media(pointer:fine)]:shadow-md"

const FIGURE = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(\D*)$/

/** Splits "8,200+" into the text before the number, the number and the text after it. */
function parseFigure(text: string) {
  const match = FIGURE.exec(text)
  if (!match) return null
  const digits = match[2]!.replace(/,/g, "")
  return {
    prefix: match[1]!,
    value: Number(digits),
    decimals: digits.includes(".") ? digits.split(".")[1]!.length : 0,
    suffix: match[3]!,
  }
}

type Figure = NonNullable<ReturnType<typeof parseFigure>>

/** Western digits with grouping commas, in both languages, as Figma writes them. */
function formatFigure(figure: Figure, value: number) {
  const digits = value.toLocaleString("en-US", {
    minimumFractionDigits: figure.decimals,
    maximumFractionDigits: figure.decimals,
  })
  return figure.prefix + digits + figure.suffix
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Counts every `[data-count]` inside `scope` up from 0 over 1.2s, ease-out,
 * once, when half of `scope` is in view. The visible figure is
 * `aria-hidden`; the real value sits beside it for screen readers, and is
 * put back if the block unmounts mid-count.
 */
function useCountUp(scope: React.RefObject<HTMLElement | null>, key: string) {
  React.useLayoutEffect(() => {
    const node = scope.current
    if (!node || typeof IntersectionObserver === "undefined" || reducedMotion()) return
    const figures = Array.from(node.querySelectorAll<HTMLElement>("[data-count]")).flatMap((element) => {
      const figure = parseFigure(element.dataset.count ?? "")
      return figure ? [{ element, figure }] : []
    })
    if (figures.length === 0) return
    figures.forEach(({ element, figure }) => (element.textContent = formatFigure(figure, 0)))
    let frame = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1200)
        const eased = 1 - Math.pow(1 - t, 3)
        figures.forEach(({ element, figure }) => (element.textContent = formatFigure(figure, figure.value * eased)))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        run()
      },
      { threshold: 0.5 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      figures.forEach(({ element }) => (element.textContent = element.dataset.count ?? ""))
    }
  }, [scope, key])
}

/** Fades the `[data-reveal]` tiles up 16px, 80ms apart in reading order, once, when the block scrolls into view. */
function useReveal(scope: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = scope.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (reducedMotion()) return
    const animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]")).forEach((tile, index) =>
          animations.push(
            tile.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], {
              duration: 500,
              delay: index * 80,
              easing: "cubic-bezier(0, 0, 0.2, 1)",
              fill: "backwards",
            })
          )
        )
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [scope])
}

export interface AboutBentoProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutBentoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The culture photo, the one slot: the tile between the capabilities and
   * the testimonial. Photos past the first are not shown. None by default:
   * a `muted` placeholder. An empty list shows the `empty` line in the tile.
   * @default none: a `muted` placeholder
   */
  photos?: AboutBentoPhoto[]
}

export function AboutBento({
  locale = "en",
  heading,
  description,
  since,
  hiring,
  metricsLabel,
  metrics,
  capabilitiesLabel,
  capabilities,
  testimonial,
  ratingLabel,
  empty,
  photos,
  className,
  ...props
}: AboutBentoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const root = React.useRef<HTMLDivElement>(null)
  const metricsTile = React.useRef<HTMLDivElement>(null)
  const footerSince = since ?? copy.since
  const footerHiring = hiring === undefined ? copy.hiring : hiring
  const figures = metrics ?? copy.metrics
  const tags = capabilities ?? copy.capabilities
  const quote = testimonial === undefined ? copy.testimonial : testimonial
  const emptyLine = empty ?? copy.empty
  const photo = photos?.[0]
  const rating = Math.max(0, Math.min(5, Math.round(quote?.rating ?? 5)))

  useReveal(root)
  useCountUp(metricsTile, figures.map((figure) => figure.value).join("|"))

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div ref={root} className="mx-auto flex w-full max-w-[1248px] flex-col gap-6">
        <div className="grid gap-6 [@container(min-width:40rem)]:grid-cols-[1fr_300px] [@container(min-width:64rem)]:grid-cols-[804fr_420fr]">
          <div data-reveal="" className={cn("flex flex-col gap-4", CARD, LIFT)}>
            <Quote size={28} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0 text-primary [&:dir(rtl)]:rotate-180" />
            <h2
              id={headingId}
              className="text-2xl font-semibold text-foreground [@container(min-width:64rem)]:text-3xl"
            >
              {heading ?? copy.heading}
            </h2>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
            {footerSince || footerHiring ? (
              <p className="flex items-center gap-2 text-xs">
                <span className="min-w-0 flex-1 text-muted-foreground">{footerSince}</span>
                {footerHiring ? (
                  <>
                    <span aria-hidden className="size-2 shrink-0 rounded-full bg-primary" />
                    <span className="font-medium text-primary">{footerHiring}</span>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>

          <div
            ref={metricsTile}
            data-reveal=""
            className={cn("flex flex-col gap-5 rounded-xl bg-primary p-8 text-primary-foreground", LIFT)}
          >
            <p className="text-xs font-medium">{metricsLabel ?? copy.metricsLabel}</p>
            {figures.length === 0 ? (
              <p className="text-sm">{emptyLine}</p>
            ) : (
              <dl className="flex flex-col gap-5">
                {figures.map((figure, index) => (
                  <div key={index} className="flex flex-col-reverse gap-1">
                    <dt className="text-sm">{figure.label}</dt>
                    <dd className="text-3xl font-semibold tabular-nums [@container(min-width:40rem)]:text-4xl">
                      <span aria-hidden="true" dir="ltr" data-count={figure.value}>
                        {figure.value}
                      </span>
                      <span className="sr-only">{figure.value}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        <div className="grid gap-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-[520fr_300fr_380fr]">
          <div
            data-reveal=""
            className={cn(
              "flex flex-col gap-4 [@container(min-width:40rem)]:col-span-2 [@container(min-width:64rem)]:col-span-1",
              CARD,
              LIFT
            )}
          >
            <p className="text-xs font-medium text-muted-foreground">{capabilitiesLabel ?? copy.capabilitiesLabel}</p>
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">{emptyLine}</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <li key={index}>
                    <Badge variant="outline" tone="secondary" size="sm" radius="rounded">
                      {tag}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            data-reveal=""
            className={cn(
              "relative flex h-[200px] items-center justify-center overflow-hidden rounded-xl bg-muted p-8 [@container(min-width:40rem)]:h-auto [@container(min-width:40rem)]:min-h-[208px]",
              LIFT
            )}
          >
            {photo ? (
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
            ) : photos && photos.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">{emptyLine}</p>
            ) : null}
          </div>

          {quote ? (
            <figure data-reveal="" className={cn("flex flex-col gap-4", CARD, LIFT)}>
              {rating > 0 ? (
                <div role="img" aria-label={(ratingLabel ?? copy.ratingLabel)(rating)} className="flex gap-1">
                  {Array.from({ length: rating }, (_, index) => (
                    <Star key={index} size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="text-primary" />
                  ))}
                </div>
              ) : null}
              <blockquote className="text-sm text-foreground">{quote.quote}</blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar
                  aria-hidden="true"
                  variant={quote.avatar ? "image" : "initials"}
                  src={quote.avatar}
                  name={quote.name}
                  size="32"
                  radius="rounded"
                  border
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium text-foreground">{quote.name}</span>
                  <span className="text-xs text-muted-foreground">{quote.role}</span>
                </span>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutBentoCopy = COPY
