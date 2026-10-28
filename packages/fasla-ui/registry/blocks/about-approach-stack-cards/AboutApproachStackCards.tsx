"use client"

import * as React from "react"
import { Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import { SocialIcon } from "../../ui/social-icons/social-icons"

/*
 * Figma: `About` (46368:243915), Type=Approach Stack Cards.
 *
 * Three numbered cards (story, approach, philosophy) beside a tall photo and
 * a rail of three social links, on a `muted` band. Each card is a `card`
 * panel with a hairline border and a medium shadow: a ghost numeral in the
 * `border` colour (96px, 60 on Mobile), a title and a short paragraph.
 *
 * Figma draws the cards as a deck caught mid-scroll: each one 110px (96 on
 * Mobile) below the last and covering most of it, so only the third card's
 * text shows. That deck only reads while sticky scrolling deals the cards,
 * and the house motion rule drops sticky stacking, so the cards sit in a
 * plain column here (Figma's own reduced-motion layout) and rise into place
 * one after another the first time they scroll into view.
 *
 * Desktop puts the cards, the 400×520 photo and the vertical rail in one
 * row, centred on each other. Tablet moves the photo (280 tall, filling the
 * width) and the rail into a row under the cards. Mobile stacks everything,
 * with a 220px photo and the rail turned horizontal.
 *
 * In Arabic the row runs right to left through flex order, so the cards sit
 * on the right and the rail on the far left, as Figma's RTL variants draw
 * it. The numerals stay Western digits and the photo is never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content, and `[@container(min-width:64rem)]:` its Desktop,
 * from 1024px of content. The section's own padding still follows the
 * window, since an element can't query itself.
 */

export interface AboutApproachStackCardsPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutApproachStackCardsCard {
  /** The card's title, an `h3`. */
  title: React.ReactNode
  /** The paragraph under the title. */
  description: React.ReactNode
}

export interface AboutApproachStackCardsSocial {
  /** Which mark the button shows: the platform's logo, or an envelope for `email`. */
  platform: "linkedin" | "instagram" | "email"
  href: string
  /** The link's accessible name, since the button shows only the mark. */
  label: string
}

export interface AboutApproachStackCardsCopy {
  /**
   * The section's heading, an `h2`. Figma's block has no visible heading,
   * so this one is for screen readers only.
   */
  heading: React.ReactNode
  /** The cards, in order. Each is numbered 01, 02, 03… in its corner. */
  cards: AboutApproachStackCardsCard[]
  /** The social links in the rail, from the top (the start on Mobile). The rail is hidden when empty. */
  socials: AboutApproachStackCardsSocial[]
  /** The accessible name of the rail. */
  socialsLabel: string
  /** Shown in place of the cards when `cards` is empty, and of the photo when `photos` is. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutApproachStackCardsCopy> = {
  en: {
    heading: "About us",
    cards: [
      {
        title: "Our story",
        description:
          "It started in a two-desk studio in 2019, with one stubborn belief: work software doesn't have to feel like work.",
      },
      {
        title: "Our approach",
        description:
          "We keep the process open, simple and centred on what actually ships value — small teams, short loops, honest demos.",
      },
      {
        title: "Our philosophy",
        description:
          "Good design should do more than look nice. It should tell a story, connect with the right people, and give a business the confidence to stand out.",
      },
    ],
    socials: [
      { platform: "linkedin", href: "#linkedin", label: "LinkedIn" },
      { platform: "instagram", href: "#instagram", label: "Instagram" },
      { platform: "email", href: "mailto:hello@example.com", label: "Email" },
    ],
    socialsLabel: "Follow us",
    empty: "Nothing to show yet.",
  },
  ar: {
    heading: "من نحن",
    cards: [
      {
        title: "قصتنا",
        description: "بدأت في استوديو بمكتبين عام 2019، بإيمان عنيد واحد: برمجيات العمل لا يجب أن تبدو كعمل.",
      },
      {
        title: "منهجنا",
        description: "نُبقي العملية مفتوحة وبسيطة ومركّزة على ما يحقق قيمة فعلية: فرق صغيرة، دورات قصيرة، عروض صادقة.",
      },
      {
        title: "فلسفتنا",
        description:
          "التصميم الجيد يجب أن يفعل أكثر من مجرد الظهور بشكل جميل. عليه أن يحكي قصة، ويتواصل مع الأشخاص المناسبين، ويمنح الشركة الثقة لتتميّز.",
      },
    ],
    socials: [
      { platform: "linkedin", href: "#linkedin", label: "LinkedIn" },
      { platform: "instagram", href: "#instagram", label: "Instagram" },
      { platform: "email", href: "mailto:hello@example.com", label: "البريد الإلكتروني" },
    ],
    socialsLabel: "تابعنا",
    empty: "لا يوجد ما نعرضه بعد.",
  },
}

/**
 * Figma's motion card asks for sticky stacking scrubbed by scroll; the house
 * rule replaces scroll-scrubbed effects with a one-time reveal. When the
 * cards scroll into view they rise 24px, 120ms apart, and the photo fades
 * in beside them. Runs once; skipped under prefers-reduced-motion.
 */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animations: Animation[] = []
    const reveal = () => {
      const ease = "cubic-bezier(0, 0, 0.2, 1)"
      const cards = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal-card]"))
      cards.forEach((card, index) =>
        animations.push(
          card.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], {
            duration: 500,
            delay: index * 120,
            easing: ease,
            fill: "backwards",
          })
        )
      )
      const photo = node.querySelector<HTMLElement>("[data-reveal-photo]")
      if (photo)
        animations.push(photo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: ease, fill: "backwards" }))
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        reveal()
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [root])
}

export interface AboutApproachStackCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutApproachStackCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The side photo: one slot, Figma's portrait beside the cards (400×520 on
   * Desktop, a 280px-tall band on Tablet, 220 on Mobile). Photos past the
   * first are not shown. None by default: a `muted` placeholder. An empty
   * list shows the `empty` line in its place.
   * @default none: a `muted` placeholder
   */
  photos?: AboutApproachStackCardsPhoto[]
}

export function AboutApproachStackCards({
  locale = "en",
  heading,
  cards,
  socials,
  socialsLabel,
  empty,
  photos,
  className,
  ...props
}: AboutApproachStackCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = cards ?? copy.cards
  const links = socials ?? copy.socials
  const photo = photos?.[0]
  const emptyLine = empty ?? copy.empty
  useReveal(rootRef)

  return (
    <section
      ref={rootRef}
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-muted px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <h2 id={headingId} className="sr-only">
        {heading ?? copy.heading}
      </h2>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12 [@container(min-width:40rem)]:gap-16 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-12">
        {list.length === 0 ? (
          <p className="min-w-0 flex-1 py-12 text-center text-sm text-muted-foreground">{emptyLine}</p>
        ) : (
          <ol className="flex min-w-0 flex-1 flex-col gap-4">
            {list.map((card, index) => (
              <li
                key={index}
                data-reveal-card=""
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-8 shadow-md"
              >
                <span
                  aria-hidden="true"
                  className="text-6xl font-semibold text-border [@container(min-width:40rem)]:text-8xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
                  {card.title}
                </h3>
                <p className="text-base text-muted-foreground">{card.description}</p>
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-col gap-12 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:gap-12">
          {photos && photos.length === 0 ? (
            <p className="flex-1 text-center text-sm text-muted-foreground [@container(min-width:64rem)]:w-[400px]">
              {emptyLine}
            </p>
          ) : (
            <div
              data-reveal-photo=""
              className="relative h-[220px] w-full overflow-hidden rounded-xl bg-border [@container(min-width:40rem)]:h-[280px] [@container(min-width:40rem)]:min-w-0 [@container(min-width:40rem)]:flex-1 [@container(min-width:64rem)]:h-[520px] [@container(min-width:64rem)]:w-[400px] [@container(min-width:64rem)]:flex-none"
            >
              {photo ? (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : null}
            </div>
          )}

          {links.length > 0 ? (
            <ul
              aria-label={socialsLabel ?? copy.socialsLabel}
              className="flex flex-row gap-3 [@container(min-width:40rem)]:shrink-0 [@container(min-width:40rem)]:flex-col"
            >
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    aria-label={link.label}
                    className={buttonVariants({ variant: "outline", size: "icon-sm" })}
                  >
                    {link.platform === "email" ? (
                      <Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                    ) : (
                      <SocialIcon platform={link.platform} color="current" aria-hidden="true" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
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
export const aboutApproachStackCardsCopy = COPY
