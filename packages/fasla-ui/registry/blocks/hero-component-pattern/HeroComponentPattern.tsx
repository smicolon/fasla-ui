"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Component Pattern Hero.
 *
 * A wall of small tiles on a `muted` ground, each holding one Fasla atom: a
 * button, an avatar with its initials (some with the online dot) or a soft
 * status badge. Over its middle sits one card with the pitch: a product name,
 * the headline, a paragraph, two buttons and a footnote. The wall is
 * decoration: hidden from assistive technology and inert, so its buttons
 * never take focus or clicks.
 *
 * The wall is the same at every width, 72 tiles of 152 × 112 in rows of
 * nine, 24px above the block and cropped by it. Desktop centres it, as Figma
 * draws it at 1440 (24px past each side), and sets a 680px card in the
 * middle of a 900px block. Tablet starts the wall 40px before the start edge
 * and widens the card to the content width; Mobile starts it 60px before,
 * shortens the block to 720px and stacks the buttons full width.
 *
 * In Arabic the wall starts from the right, its labels translated as the RTL
 * variants show them, and the card's buttons swap sides. The initials stay
 * Latin, as Figma draws them.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroComponentPatternAction {
  label: React.ReactNode
  href: string
}

/** The words the wall's buttons carry. */
export type HeroComponentPatternButtonLabel = "continue" | "save" | "next" | "cancel" | "book" | "send"
/** The words the wall's badges carry. Each has its own tone. */
export type HeroComponentPatternBadgeLabel = "new" | "ready" | "beta" | "draft" | "live"

export interface HeroComponentPatternCopy {
  /** The product's name above the headline. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button, on the end side. */
  primaryAction: HeroComponentPatternAction
  /** The outline button before it. Hidden when null. */
  secondaryAction: HeroComponentPatternAction | null
  /** The small line under the buttons. Hidden when empty. */
  footnote: React.ReactNode
  /** The words on the wall's buttons and badges. Decoration: never read out. */
  wallLabels: Record<HeroComponentPatternButtonLabel | HeroComponentPatternBadgeLabel, string>
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroComponentPatternCopy> = {
  en: {
    eyebrow: "Gather",
    headline: "Everything your team\nuses, finally together.",
    description: "Chat, tasks and approvals in one shared space, so work moves without the back-and-forth.",
    primaryAction: { label: "Try it free", href: "#start" },
    secondaryAction: { label: "Watch a 2-min demo", href: "#demo" },
    footnote: "Works with the tools your team already uses.",
    wallLabels: {
      continue: "Continue",
      save: "Save",
      next: "Next",
      cancel: "Cancel",
      book: "Book",
      send: "Send",
      new: "New",
      ready: "Ready",
      beta: "Beta",
      draft: "Draft",
      live: "Live",
    },
  },
  ar: {
    eyebrow: "لمّة",
    headline: "كل ما يستخدمه فريقك\nأخيرًا في مكان واحد.",
    description: "المحادثات والمهام والموافقات في مساحة مشتركة واحدة، لينجز العمل من دون ذهاب وإياب.",
    primaryAction: { label: "جرّبه مجانًا", href: "#start" },
    secondaryAction: { label: "شاهد عرضًا في دقيقتين", href: "#demo" },
    footnote: "يعمل مع الأدوات التي يستخدمها فريقك بالفعل.",
    wallLabels: {
      continue: "متابعة",
      save: "حفظ",
      next: "التالي",
      cancel: "إلغاء",
      book: "احجز",
      send: "إرسال",
      new: "جديد",
      ready: "جاهز",
      beta: "تجريبي",
      draft: "مسودة",
      live: "مباشر",
    },
  },
}

/**
 * One tile's atom. Buttons are Figma's Solid, Outline and Soft in Primary and
 * Solid in Destructive, all `sm` and rounded. `online` adds the avatar's dot.
 */
type WallTile =
  | readonly ["solid" | "outline" | "soft" | "destructive", HeroComponentPatternButtonLabel]
  | readonly ["avatar"]
  | readonly ["avatar", "online"]
  | readonly ["badge", HeroComponentPatternBadgeLabel]

const BUTTON_VARIANT = { solid: "default", outline: "outline", soft: "soft", destructive: "destructive" } as const
const BADGE_TONE = { new: "success", ready: "info", beta: "warning", draft: "primary", live: "destructive" } as const
/** Figma's initials, VB. Avatar takes them from a name's first and last words. */
const AVATAR_NAME = "V B"

/** The wall's 72 tiles in Figma's order, nine to a row. */
const WALL: readonly WallTile[] = [
  ["solid", "continue"], ["avatar"], ["badge", "new"], ["outline", "save"], ["avatar", "online"], ["badge", "ready"], ["soft", "next"], ["avatar"], ["badge", "beta"],
  ["avatar"], ["badge", "draft"], ["destructive", "cancel"], ["avatar", "online"], ["badge", "live"], ["solid", "book"], ["avatar"], ["badge", "new"], ["outline", "send"],
  ["badge", "ready"], ["soft", "continue"], ["avatar", "online"], ["badge", "beta"], ["destructive", "save"], ["avatar"], ["badge", "draft"], ["solid", "next"], ["avatar", "online"],
  ["outline", "cancel"], ["avatar", "online"], ["badge", "live"], ["soft", "book"], ["avatar"], ["badge", "new"], ["destructive", "send"], ["avatar", "online"], ["badge", "ready"],
  ["avatar", "online"], ["badge", "beta"], ["solid", "continue"], ["avatar"], ["badge", "draft"], ["outline", "save"], ["avatar", "online"], ["badge", "live"], ["soft", "next"],
  ["badge", "new"], ["destructive", "cancel"], ["avatar"], ["badge", "ready"], ["solid", "book"], ["avatar", "online"], ["badge", "beta"], ["outline", "send"], ["avatar"],
  ["soft", "continue"], ["avatar"], ["badge", "draft"], ["destructive", "save"], ["avatar", "online"], ["badge", "live"], ["solid", "next"], ["avatar"], ["badge", "new"],
  ["avatar"], ["badge", "ready"], ["outline", "cancel"], ["avatar", "online"], ["badge", "beta"], ["soft", "book"], ["avatar"], ["badge", "draft"], ["destructive", "send"],
]

/** React 18 has no `inert` prop, and React 19 reads `inert=""` as false, so it is set through a ref. */
const setInert = (node: HTMLElement | null) => node?.setAttribute("inert", "")

function WallAtom({ tile, labels }: { tile: WallTile; labels: HeroComponentPatternCopy["wallLabels"] }) {
  if (tile[0] === "avatar") {
    return (
      <Avatar variant="initials" size="32" radius="rounded" name={AVATAR_NAME} status={tile[1] === "online" ? "online" : undefined} />
    )
  }
  if (tile[0] === "badge") {
    return (
      <Badge variant="soft" tone={BADGE_TONE[tile[1]]} size="md" radius="rounded">
        {labels[tile[1]]}
      </Badge>
    )
  }
  return (
    <Button type="button" tabIndex={-1} variant={BUTTON_VARIANT[tile[0]]} tone={tile[0] === "destructive" ? undefined : "primary"} size="sm" radius="rounded">
      {labels[tile[1]]}
    </Button>
  )
}

export interface HeroComponentPatternProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroComponentPatternCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function HeroComponentPattern({
  locale = "en",
  eyebrow,
  headline,
  description,
  primaryAction,
  secondaryAction,
  footnote,
  wallLabels,
  className,
  ...props
}: HeroComponentPatternProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const note = footnote ?? copy.footnote
  const labels = wallLabels ?? copy.wallLabels

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative isolate overflow-hidden [container-type:inline-size] bg-muted", className)}
      {...props}
    >
      {/*
         * The wall runs full bleed, under the content and outside its cap.
         * Figma's 1488 × 980 frame: nine 152px tiles to a row with 12px gaps,
         * 24px of slack at the end. Desktop centres it; narrower, it starts
         * 40px (Tablet) or 60px (Mobile) before the start edge, as Figma
         * places it, and the block crops the rest.
         */}
      <div
        ref={setInert}
        aria-hidden="true"
        className="pointer-events-none absolute -start-[3.75rem] -top-6 flex w-[1488px] select-none flex-wrap content-start gap-3 [@container(min-width:48rem)]:-start-10 [@container(min-width:90rem)]:start-[calc(50%-744px)]"
      >
        {WALL.map((tile, index) => (
          <div key={index} className="flex h-28 w-[152px] items-center justify-center overflow-hidden rounded-xl border bg-background">
            <WallAtom tile={tile} labels={labels} />
          </div>
        ))}
      </div>

      {/*
         * The section's colour and the wall fill the whole width; the content
         * does not. From Tablet up to Desktop the content keeps Figma's Tablet
         * width, 720px inside 24px padding, and centres, so a wide container
         * shows Figma's Tablet layout rather than a stretched one.
         */}
      <div className="relative mx-auto flex min-h-[720px] w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] items-center justify-center px-4 py-8 [@container(min-width:48rem)]:min-h-[900px] [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16">
        <div className="flex w-full flex-col items-center gap-5 rounded-3xl border bg-background p-6 text-center shadow-2xl [@container(min-width:48rem)]:p-10 [@container(min-width:90rem)]:w-[680px] [@container(min-width:90rem)]:p-12">
          {label ? (
            <p className="text-xl font-semibold text-foreground [@container(min-width:48rem)]:text-2xl">{label}</p>
          ) : null}
          <h1 id={headingId} className="whitespace-pre-line text-3xl font-medium text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl">
            {headline ?? copy.headline}
          </h1>
          <p className="text-balance text-base text-muted-foreground">{description ?? copy.description}</p>
          <div className="flex w-full flex-col gap-3 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row">
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline", tone: "primary", size: "lg", radius: "rounded" })}>
                {secondary.label}
              </a>
            ) : null}
            <a href={primary.href} className={buttonVariants({ size: "lg", radius: "rounded" })}>
              {primary.label}
            </a>
          </div>
          {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroComponentPatternCopy = COPY
