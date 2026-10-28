"use client"

import * as React from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Studio Mosaic Hero.
 *
 * A design studio's introduction beside a mosaic of its selected work. The
 * copy column carries an eyebrow with a dot, a three-line headline, a
 * paragraph, a solid button and a text link with an arrow, and two small
 * notes at its foot. The mosaic sets six project tiles in three staggered
 * columns: three photos and three designed tiles (a poster with a bold
 * wordmark and two geometric shapes, an editorial identity with a large
 * wordmark between a category and a caption, and a brand symbol: a disc with
 * a round cutout). A work index row with a round arrow button closes it.
 *
 * Desktop sets the copy (550px) beside the mosaic (634px). Figma places the
 * tiles by hand; here they are a grid of three columns, 230, 166 and 206
 * wide, each a stack with its own top offset, so the columns step down as
 * Figma's do. The first two columns stack from the top; the third is pinned
 * to the bottom, so a designed tile with longer copy grows upward into the
 * offset, as Figma's Arabic editorial tile does, and a taller tile than that
 * stretches every column rather than clipping. The work index sits under
 * the last two columns. Tablet stacks the copy over the mosaic at full
 * width, the columns in the same proportions. Mobile keeps the three
 * columns across its full width, with the tiles' text on the smallest steps
 * of the ramp (Figma scales the whole mosaic down there), the work index under all
 * three columns, and stacks the buttons.
 *
 * In Arabic the columns mirror: the copy sits on the right, the mosaic on
 * the left, the cutout in the brand symbol moves to the left, and the
 * arrows point left. The year stays left to right. The photos are never
 * flipped.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroStudioMosaicAction {
  label: React.ReactNode
  href: string
}

export interface HeroStudioMosaicIconAction {
  /** The button's accessible name: it shows only an arrow. */
  label: string
  href: string
}

export interface HeroStudioMosaicPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroStudioMosaicCopy {
  /** The line above the headline, after a dot. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroStudioMosaicAction
  /** The text link beside it, with an arrow. Hidden when null. */
  secondaryAction: HeroStudioMosaicAction | null
  /** The first note at the foot of the copy. A line break in the string breaks the line. */
  note: React.ReactNode
  /** The second note, after a dot. Hidden when empty. */
  availability: React.ReactNode
  /** The poster tile: its wordmark (a line break breaks the line) and caption. */
  posterProject: { title: React.ReactNode; caption: React.ReactNode }
  /** The editorial tile: its category, wordmark (a line break breaks the line) and caption. */
  editorialProject: { category: React.ReactNode; title: React.ReactNode; caption: React.ReactNode }
  /** The brand symbol tile's name, under the mark. */
  symbolProject: { title: React.ReactNode }
  /** The work index's first line. */
  workCaption: React.ReactNode
  /** The work index's second line. */
  workRange: React.ReactNode
  /** The round arrow button at the end of the work index. */
  workAction: HeroStudioMosaicIconAction
}

/** Figma's copy, English and Arabic. The arrow button's spoken name is ours: Figma only draws it. */
const COPY: Record<"en" | "ar", HeroStudioMosaicCopy> = {
  en: {
    eyebrow: "INDEPENDENT MINDS. SHARED AMBITION.",
    headline: "Good brands\nmake waves.\nLet’s make yours.",
    description: "We blend strategy, identity, and digital craft to turn ambitious businesses into brands people feel.",
    primaryAction: { label: "Start a project", href: "#contact" },
    secondaryAction: { label: "Explore our work", href: "#work" },
    note: "BASED EVERYWHERE.\nCREATING SOMETHING DIFFERENT.",
    availability: "Open for collaborations",
    posterProject: {
      title: "PLAY\nIS THE\nPROCESS.",
      caption: (
        <>
          FORM FESTIVAL — <bdi dir="ltr">2026</bdi>
        </>
      ),
    },
    editorialProject: {
      category: "CULTURE / IDENTITY",
      title: "Another\nkind of\neveryday.",
      caption: "A fresh perspective for Morrow.",
    },
    symbolProject: { title: "ORBIT STUDIO" },
    workCaption: "A FEW RECENT OBSESSIONS",
    workRange: "Brand strategy · Identity · Digital experiences",
    workAction: { label: "Explore projects", href: "#projects" },
  },
  ar: {
    eyebrow: "عقول مستقلة، وطموح مشترك.",
    headline: "العلامات الجيدة\nتصنع الأثر.\nلنصنع علامتك.",
    description: "نمزج الاستراتيجية والهوية والحرفة الرقمية لنحوّل الأعمال الطموحة إلى علامات يشعر بها الناس.",
    primaryAction: { label: "ابدأ مشروعًا", href: "#contact" },
    secondaryAction: { label: "استكشف أعمالنا", href: "#work" },
    note: "في كل مكان،\nنصنع شيئًا مختلفًا.",
    availability: "متاحون للتعاون",
    posterProject: {
      title: "اللعب\nهو\nالطريقة.",
      caption: (
        <>
          مهرجان الشكل <bdi dir="ltr">2026</bdi>
        </>
      ),
    },
    editorialProject: {
      category: "ثقافة / هوية",
      title: "نوع آخر\nمن الحياة\nاليومية.",
      caption: "رؤية جديدة لعلامة غد.",
    },
    symbolProject: { title: "استوديو مدار" },
    workCaption: "بعض شغفنا مؤخرًا",
    workRange: "استراتيجية العلامة، الهوية، التجارب الرقمية",
    workAction: { label: "استكشف المشاريع", href: "#projects" },
  },
}

/** Figma's tile corner: 22px on Desktop, 20 on Tablet, and 8 on Mobile's smaller tiles. */
const TILE = "rounded-lg [@container(min-width:48rem)]:rounded-[20px] [@container(min-width:90rem)]:rounded-[22px]"

function PhotoTile({ photo, className }: { photo?: HeroStudioMosaicPhoto; className?: string }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden bg-muted", TILE, className)}>
      {photo ? <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" /> : null}
    </div>
  )
}

export interface HeroStudioMosaicProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroStudioMosaicCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The three photo tiles, in Figma's order: the short one at the top of the
   * first column, the tall one at the foot of the second, and the one at the
   * foot of the third. None by default: each tile shows a `muted`
   * placeholder of the same size.
   * @default none: `muted` placeholders
   */
  photos?: HeroStudioMosaicPhoto[]
}

export function HeroStudioMosaic({
  locale = "en",
  eyebrow,
  headline,
  description,
  primaryAction,
  secondaryAction,
  note,
  availability,
  posterProject,
  editorialProject,
  symbolProject,
  workCaption,
  workRange,
  workAction,
  photos,
  className,
  ...props
}: HeroStudioMosaicProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const open = availability ?? copy.availability
  const poster = posterProject ?? copy.posterProject
  const editorial = editorialProject ?? copy.editorialProject
  const symbol = symbolProject ?? copy.symbolProject
  const more = workAction ?? copy.workAction

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 622px inside its padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one. The padding is
         * Figma's nested frames added up (block, shell and panel), which
         * leave more room on the start side than the end, and under the
         * mosaic the empty band Figma's mosaic frame keeps below the index.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-[26px] px-4 py-8 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:grid [@container(min-width:90rem)]:grid-cols-[550px_634px] [@container(min-width:90rem)]:items-start [@container(min-width:90rem)]:pb-[110px] [@container(min-width:90rem)]:pe-[66px] [@container(min-width:90rem)]:ps-20 [@container(min-width:90rem)]:pt-16">
        <div className="flex min-w-0 flex-col gap-[26px]">
          {label ? (
            <p className="flex items-center gap-2 text-xxs font-medium text-primary">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
              {label}
            </p>
          ) : null}
          <h1
            id={headingId}
            className="whitespace-pre-line text-3xl font-medium text-foreground [@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:text-6xl"
          >
            {headline ?? copy.headline}
          </h1>
          <p className="text-pretty text-base text-muted-foreground [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[440px]">
            {description ?? copy.description}
          </p>
          <div className="flex flex-col gap-[25px] pt-[7px] [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center">
            <a href={primary.href} className={buttonVariants({ size: "lg", radius: "rounded" })}>
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                className="relative inline-flex items-center gap-2.5 self-center rounded-sm text-base font-medium text-primary [outline:none] before:absolute before:-inset-x-1 before:-inset-y-3 hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [@container(min-width:48rem)]:self-auto"
              >
                {secondary.label}
                <ArrowRight size={24} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0 [&:dir(rtl)]:-scale-x-100" />
              </a>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 pt-[42px] [@container(min-width:48rem)]:max-w-[500px] [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-start [@container(min-width:48rem)]:justify-between [@container(min-width:48rem)]:gap-6">
            <p className="whitespace-pre-line text-xxs text-muted-foreground">{note ?? copy.note}</p>
            {open ? (
              <p className="shrink-0 text-xxs font-medium text-primary">
                <span aria-hidden>● </span>
                {open}
              </p>
            ) : null}
          </div>
        </div>

        {/*
           * The mosaic: three columns in Figma's proportions, 230 : 166 : 206,
           * each a stack of two tiles. The columns stretch to the tallest, so
           * their feet line up whatever the copy in the designed tiles.
           */}
        <div className="grid min-w-0 grid-cols-[230fr_166fr_206fr] gap-x-2 gap-y-2 [@container(min-width:48rem)]:gap-x-4 [@container(min-width:48rem)]:gap-y-5 [@container(min-width:90rem)]:gap-y-[22px]">
          <div className="flex min-w-0 flex-col gap-2 pt-3 [@container(min-width:48rem)]:gap-4 [@container(min-width:48rem)]:pt-8 [@container(min-width:90rem)]:pt-[35px]">
            <PhotoTile photo={photos?.[0]} className="h-16 [@container(min-width:48rem)]:h-[174px] [@container(min-width:90rem)]:h-[187px]" />
            {/* The poster tile. */}
            <div
              className={cn(
                "flex min-h-[106px] flex-1 flex-col gap-2 bg-primary p-2 text-primary-foreground [@container(min-width:48rem)]:min-h-[288px] [@container(min-width:48rem)]:gap-4 [@container(min-width:48rem)]:p-5 [@container(min-width:90rem)]:min-h-[310px] [@container(min-width:90rem)]:gap-[18px] [@container(min-width:90rem)]:p-[22px]",
                TILE
              )}
            >
              <p className="whitespace-pre-line break-words text-xs font-bold [@container(min-width:48rem)]:text-3xl">{poster.title}</p>
              <div aria-hidden className="flex">
                <span className="size-8 rounded-ss-full bg-background [@container(min-width:48rem)]:size-[84px] [@container(min-width:90rem)]:size-[90px]" />
                <span className="size-8 rounded-full bg-primary-foreground [@container(min-width:48rem)]:size-[84px] [@container(min-width:90rem)]:size-[90px]" />
              </div>
              <p className="text-xxs font-medium">{poster.caption}</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-2 [@container(min-width:48rem)]:gap-4">
            {/* The brand symbol tile: a disc with a round cutout towards the end side. */}
            <div
              className={cn(
                "flex min-h-[76px] shrink-0 flex-col items-center justify-center gap-2 bg-primary px-1 py-2 text-center text-primary-foreground [@container(min-width:48rem)]:min-h-[206px] [@container(min-width:48rem)]:gap-3 [@container(min-width:48rem)]:px-3 [@container(min-width:90rem)]:min-h-[222px] [@container(min-width:90rem)]:gap-3.5",
                TILE
              )}
            >
              <span aria-hidden className="relative size-9 shrink-0 rounded-full bg-primary-foreground [@container(min-width:48rem)]:size-[97px] [@container(min-width:90rem)]:size-[105px]">
                <span className="absolute start-[37.14%] top-[23.81%] size-[57.14%] rounded-full bg-primary" />
              </span>
              <p className="text-xxs font-bold">{symbol.title}</p>
            </div>
            <PhotoTile photo={photos?.[1]} className="min-h-[106px] flex-1 [@container(min-width:48rem)]:min-h-[288px] [@container(min-width:90rem)]:min-h-[310px]" />
          </div>

          {/* Pinned to the foot, so a longer editorial tile grows into the offset above it. */}
          <div className="flex min-w-0 flex-col justify-end gap-2 [@container(min-width:48rem)]:gap-4">
            <div
              className={cn(
                "flex min-h-[81px] shrink-0 flex-col gap-1 bg-background p-2 [@container(min-width:48rem)]:min-h-[219px] [@container(min-width:48rem)]:gap-2 [@container(min-width:48rem)]:p-5 [@container(min-width:90rem)]:min-h-[236px]",
                TILE
              )}
            >
              <p className="text-xxs font-medium text-muted-foreground">{editorial.category}</p>
              <p className="whitespace-pre-line break-words text-xs text-foreground [@container(min-width:48rem)]:text-4xl">{editorial.title}</p>
              {/* A plain 1px line where Figma draws its Separator. Swap in Separator once it is built. */}
              <span aria-hidden className="h-px w-4/5 shrink-0 bg-border" />
              <p className="text-xxs font-medium text-muted-foreground">{editorial.caption}</p>
            </div>
            <PhotoTile photo={photos?.[2]} className="h-[81px] [@container(min-width:48rem)]:h-[220px] [@container(min-width:90rem)]:h-[237px]" />
          </div>

          <div className="col-span-3 flex min-w-0 items-center justify-between gap-4 [@container(min-width:48rem)]:col-span-2 [@container(min-width:48rem)]:col-start-2">
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="text-xxs font-medium text-primary">{workCaption ?? copy.workCaption}</p>
              <p className="text-pretty text-xs text-muted-foreground">{workRange ?? copy.workRange}</p>
            </div>
            <a href={more.href} aria-label={more.label} className={buttonVariants({ size: "icon-lg", radius: "rounded", className: "shrink-0" })}>
              <ArrowUpRight aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
            </a>
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
export const heroStudioMosaicCopy = COPY
