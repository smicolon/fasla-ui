"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Editorial Arch Hero.
 *
 * A studio introduction set like a magazine page: a three-line headline whose
 * middle line is light and muted, one portrait under an arched top, a column
 * of four figures, and a row of four short promises along the bottom.
 *
 * Desktop puts the copy, the arch (440 × 664) and the figures side by side,
 * the figures aligned to the end edge, and the promises in one row split by
 * thin lines. Tablet stacks the copy over the arch, with the figures beside
 * the arch, aligned to its foot, and the promises in two columns. Mobile
 * stacks everything: the arch at full width, the figures two by two and the
 * buttons full width.
 *
 * In Arabic the columns mirror: the copy sits on the right and the figures
 * on the left. Numbers stay left to right. The portrait is never flipped.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container and everything inside, its padding included, follows it. Mobile
 * is the base; `[@container(min-width:48rem)]:` is Figma's Tablet (768) and
 * `[@container(min-width:90rem)]:` its Desktop, from 1440px, the width Figma
 * draws it at. Narrower, the arch crowds the figures, so Tablet's layout
 * covers 768 to 1439.
 */

export interface HeroEditorialArchAction {
  label: React.ReactNode
  href: string
}

export interface HeroEditorialArchPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroEditorialArchStat {
  /** The figure. Shown left to right in either language. */
  value: React.ReactNode
  label: React.ReactNode
}

export interface HeroEditorialArchFeature {
  title: React.ReactNode
  description: React.ReactNode
}

export interface HeroEditorialArchCopy {
  /** The line above the headline. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`, in its three lines: the middle one is set light and muted. */
  headline: { start: React.ReactNode; accent: React.ReactNode; end: React.ReactNode }
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroEditorialArchAction
  /** The ghost button beside it. Hidden when null. */
  secondaryAction: HeroEditorialArchAction | null
  /** The figures beside the portrait. Figma shows four. */
  stats: HeroEditorialArchStat[]
  /** The promises along the bottom. Figma shows four. */
  features: HeroEditorialArchFeature[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroEditorialArchCopy> = {
  en: {
    eyebrow: "Maren Studio — Brand and product design",
    headline: { start: "Brands", accent: "that feel", end: "inevitable." },
    description: "We shape identities, products and campaigns for teams who want to be remembered, not just noticed.",
    primaryAction: { label: "Start a project", href: "#contact" },
    secondaryAction: { label: "See our work", href: "#work" },
    stats: [
      { value: "120+", label: "Brands launched" },
      { value: "14", label: "Years in practice" },
      { value: "9", label: "Design awards" },
      { value: "3", label: "Studios, one team" },
    ],
    features: [
      { title: "STRATEGY FIRST", description: "Every project starts with the question behind the brief." },
      { title: "IDENTITY SYSTEMS", description: "Logos, type and colour that grow with you." },
      { title: "DIGITAL PRODUCTS", description: "Sites and apps designed and built in-house." },
      { title: "LONG-TERM CARE", description: "We stay on after launch to keep things sharp." },
    ],
  },
  ar: {
    eyebrow: "استوديو لمسة، لتصميم العلامات والمنتجات",
    headline: { start: "علامات", accent: "تبقى", end: "في الذاكرة." },
    description: "نصمم الهويات والمنتجات والحملات لفرق تريد أن تُعرف، لا أن تُرى فقط.",
    primaryAction: { label: "ابدأ مشروعًا", href: "#contact" },
    secondaryAction: { label: "شاهد أعمالنا", href: "#work" },
    stats: [
      { value: "120+", label: "علامة أطلقناها" },
      { value: "14", label: "عامًا من الخبرة" },
      { value: "9", label: "جوائز تصميم" },
      { value: "3", label: "استوديوهات وفريق واحد" },
    ],
    features: [
      { title: "الاستراتيجية أولًا", description: "يبدأ كل مشروع بالسؤال الكامن خلف المطلوب." },
      { title: "أنظمة الهوية", description: "شعارات وخطوط وألوان تنمو معك." },
      { title: "المنتجات الرقمية", description: "مواقع وتطبيقات نصممها ونبنيها بأيدينا." },
      { title: "رعاية مستمرة", description: "نبقى معك بعد الإطلاق لنحافظ على كل شيء في أفضل حال." },
    ],
  },
}

export interface HeroEditorialArchProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroEditorialArchCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The portrait under the arch. None by default: the arch shows the
   * `background` colour in its place.
   * @default none: a `background` placeholder
   */
  photo?: HeroEditorialArchPhoto
}

export function HeroEditorialArch({
  locale = "en",
  eyebrow,
  headline,
  description,
  primaryAction,
  secondaryAction,
  stats,
  features,
  photo,
  className,
  ...props
}: HeroEditorialArchProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const lines = headline ?? copy.headline
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const figures = stats ?? copy.stats
  const promises = features ?? copy.features

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-muted", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-6 [@container(min-width:90rem)]:px-20 [@container(min-width:90rem)]:pb-12 [@container(min-width:90rem)]:pt-24">
        <div className="flex flex-col gap-10 [@container(min-width:48rem)]:gap-12 [@container(min-width:90rem)]:grid [@container(min-width:90rem)]:grid-cols-[29rem_27.5rem_minmax(0,1fr)] [@container(min-width:90rem)]:items-start [@container(min-width:90rem)]:gap-x-4">
          <div className="flex flex-col gap-8 [@container(min-width:90rem)]:pt-8">
            {label ? <p className="text-sm font-medium text-muted-foreground">{label}</p> : null}
            <h1 id={headingId} className="flex flex-col text-4xl font-semibold text-foreground [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-7xl">
              <span>{lines.start}</span>
              <span className="font-light text-muted-foreground">{lines.accent}</span>
              <span>{lines.end}</span>
            </h1>
            <p className="text-pretty text-base text-muted-foreground [@container(min-width:48rem)]:text-lg">{description ?? copy.description}</p>
            {/* Figma spaces the buttons 40px further down than the rest of the column. */}
            <div className="mt-10 flex flex-col gap-3 [@container(min-width:48rem)]:flex-row">
              <a href={primary.href} className={buttonVariants({ size: "lg", radius: "rounded" })}>
                {primary.label}
              </a>
              {secondary ? (
                <a href={secondary.href} className={buttonVariants({ variant: "ghost", tone: "primary", size: "lg", radius: "rounded" })}>
                  {secondary.label}
                </a>
              ) : null}
            </div>
          </div>

          {/* `contents` on Desktop lets the arch and the figures take their own grid columns. */}
          <div className="flex flex-col gap-8 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-end [@container(min-width:90rem)]:contents">
            <div className="relative h-[400px] shrink-0 overflow-hidden rounded-t-full bg-background [@container(min-width:48rem)]:h-[480px] [@container(min-width:48rem)]:w-[360px] [@container(min-width:90rem)]:h-[664px] [@container(min-width:90rem)]:w-[440px]">
              {photo ? (
                <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
              ) : null}
            </div>

            <dl className="grid min-w-0 flex-1 grid-cols-2 gap-6 [@container(min-width:48rem)]:flex [@container(min-width:48rem)]:flex-col [@container(min-width:48rem)]:gap-8 [@container(min-width:90rem)]:w-60 [@container(min-width:90rem)]:flex-none [@container(min-width:90rem)]:justify-self-end [@container(min-width:90rem)]:pt-16 [@container(min-width:90rem)]:text-end">
              {figures.map((stat, index) => (
                <div key={index} className="flex flex-col-reverse gap-1">
                  <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                  <dd className="text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-4xl">
                    <bdi dir="ltr">{stat.value}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <ul className="grid gap-8 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:48rem)]:gap-x-8 [@container(min-width:48rem)]:gap-y-6 [@container(min-width:90rem)]:grid-cols-4 [@container(min-width:90rem)]:gap-x-16">
          {promises.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex min-w-0 flex-col gap-2",
                // A plain 1px line, centred in the gap, where Figma draws its
                // Separator. Swap in Separator once it is built.
                index > 0 &&
                  "[@container(min-width:90rem)]:relative [@container(min-width:90rem)]:before:absolute [@container(min-width:90rem)]:before:-start-8 [@container(min-width:90rem)]:before:top-0 [@container(min-width:90rem)]:before:h-14 [@container(min-width:90rem)]:before:w-px [@container(min-width:90rem)]:before:bg-border"
              )}
            >
              <p className="text-sm font-semibold text-foreground">{feature.title}</p>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroEditorialArchCopy = COPY
