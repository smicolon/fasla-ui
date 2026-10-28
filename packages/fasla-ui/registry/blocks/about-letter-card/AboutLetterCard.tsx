"use client"

import * as React from "react"
import { Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import { SocialIcon } from "../../ui/social-icons/social-icons"

/*
 * Figma: `About` (46368:243915), Type=Letter Card.
 *
 * A founder's letter on a tilted sheet. On a `muted` band, a header (eyebrow,
 * heading, subheading) sits over a `card` sheet with an extra-large shadow,
 * turned 1.5° clockwise (Figma stores −1.5°). The sheet holds the letter: a
 * greeting, an introduction whose second half is muted, three paragraphs, a
 * hand-drawn signature, and an action row (the "Let's talk" button, then a
 * small "LET'S CONNECT" label over three social buttons, both bottom-aligned).
 * Beside the letter, bottom-aligned, is a 360×440 portrait.
 *
 * Tablet stacks the portrait under the letter, filling the sheet's width at
 * 360 tall, with 40px padding and a 1° tilt. Mobile does the same at 260
 * tall, with 24px padding and a 0.75° tilt.
 *
 * In Arabic the sheet mirrors through flex order (the portrait moves to the
 * left) and the tilt turns the other way, as Figma's RTL variants draw it.
 * The signature is a drawing, not text, so it never mirrors, and neither
 * does the photo.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content, and `[@container(min-width:64rem)]:` its Desktop,
 * from 1024px of content. The section's own padding still follows the
 * window, since an element can't query itself.
 */

export interface AboutLetterCardPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutLetterCardAction {
  label: React.ReactNode
  href: string
}

export interface AboutLetterCardSocial {
  /** Which mark the button shows: the platform's logo, or an envelope for `email`. */
  platform: "linkedin" | "instagram" | "email"
  href: string
  /** The link's accessible name, since the button shows only the mark. */
  label: string
}

export interface AboutLetterCardCopy {
  /** The short label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  subheading: React.ReactNode
  /** The letter's opening word, set large. */
  greeting: React.ReactNode
  /** The introduction's first half: who is writing. */
  introduction: React.ReactNode
  /** The introduction's second half, muted: their role. Follows `introduction` on the same line. */
  introductionRole: React.ReactNode
  /** The letter's paragraphs, in order. Figma has three. */
  paragraphs: React.ReactNode[]
  /** The solid button in the action row. Hidden when null. */
  action: AboutLetterCardAction | null
  /** The small label over the social buttons. It also names their list. */
  connectLabel: React.ReactNode
  /** The social buttons, from the start. The group is hidden when empty. */
  socials: AboutLetterCardSocial[]
  /** Shown in place of the portrait when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutLetterCardCopy> = {
  en: {
    eyebrow: "ABOUT",
    heading: "Who you will work with",
    subheading: "Meet the person who answers your first email.",
    greeting: "Hello",
    introduction: "I'm Layla Haddad",
    introductionRole: ", founder of Fasla",
    paragraphs: [
      "I started Fasla because too many good teams were losing their days to noisy software. The ideas were fine. The tools around them were not.",
      "Before this I spent twelve years designing products for schools, clinics and small public offices. I learned that the best software is the kind people forget they are using, because it simply works.",
      "Today a small team and I do that same work for a handful of clients at a time. You will always talk to the people doing the work, never to a layer in between.",
    ],
    action: { label: "Let's talk", href: "#contact" },
    connectLabel: "LET'S CONNECT",
    socials: [
      { platform: "linkedin", href: "#linkedin", label: "LinkedIn" },
      { platform: "instagram", href: "#instagram", label: "Instagram" },
      { platform: "email", href: "mailto:hello@example.com", label: "Email" },
    ],
    empty: "No photo yet.",
  },
  ar: {
    eyebrow: "من نحن",
    heading: "مع من ستعمل",
    subheading: "تعرّف إلى الشخص الذي يرد على رسالتك الأولى.",
    greeting: "مرحبًا",
    introduction: "أنا ليلى حداد، ",
    introductionRole: "مؤسِّسة فاصلة",
    paragraphs: [
      "أسست فاصلة لأن كثيرًا من الفرق الجيدة كانت تخسر أيامها أمام برمجيات مزدحمة بالضجيج. كانت الأفكار سليمة، أما الأدوات من حولها فلم تكن كذلك.",
      "قبل ذلك أمضيت 12 عامًا في تصميم منتجات للمدارس والعيادات والمكاتب الحكومية الصغيرة، وتعلمت أن أفضل البرمجيات هي التي ينسى الناس أنهم يستخدمونها لأنها تعمل ببساطة.",
      "اليوم أؤدي العمل نفسه مع فريق صغير لعدد محدود من العملاء في كل مرة. ستتحدث دائمًا مع من ينجزون العمل، لا مع وسطاء بيننا.",
    ],
    action: { label: "لنتحدث", href: "#contact" },
    connectLabel: "لنتواصل",
    socials: [
      { platform: "linkedin", href: "#linkedin", label: "LinkedIn" },
      { platform: "instagram", href: "#instagram", label: "Instagram" },
      { platform: "email", href: "mailto:hello@example.com", label: "البريد الإلكتروني" },
    ],
    empty: "لا توجد صورة بعد.",
  },
}

/**
 * Figma's `Signature` vector, 194×36, drawn with a 2px round stroke in the
 * text colour. Its path is Figma's own; it is never mirrored.
 */
function DrawnSignature() {
  return (
    <svg
      aria-hidden="true"
      width={194}
      height={36}
      viewBox="0 0 194 36"
      fill="none"
      className="shrink-0 overflow-visible text-foreground"
    >
      <path
        data-signature-path=""
        d="M 0 36 C 12 2 24 -6 28 14 C 31 32 16 44 38 22 C 54 6 56 38 74 20 C 86 8 94 26 108 16 C 122 6 130 14 148 8 L 194 0"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** The sheet's tilt: 0.75° on Mobile, 1° on Tablet, 1.5° on Desktop, turned the other way in RTL. */
const TILT = [
  "rotate-[0.75deg] [&:dir(rtl)]:rotate-[-0.75deg]",
  "[@container(min-width:40rem)]:rotate-[1deg] [@container(min-width:40rem)]:[&:dir(rtl)]:rotate-[-1deg]",
  "[@container(min-width:64rem)]:rotate-[1.5deg] [@container(min-width:64rem)]:[&:dir(rtl)]:rotate-[-1.5deg]",
].join(" ")

/**
 * Figma's motion: when the sheet scrolls into view it rises 24px and turns
 * from flat to its tilt with an ease-out settle (500ms); the greeting, introduction
 * and paragraphs fade in one by one, 80ms apart; then the signature draws
 * itself along its own stroke over 900ms, and the portrait fades in, settling
 * from 104%. Runs once; skipped under prefers-reduced-motion, which leaves
 * the sheet tilted and the signature drawn.
 */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const sheet = node.querySelector<HTMLElement>("[data-reveal-sheet]")
    if (!sheet) return
    const animations: Animation[] = []
    const reveal = () => {
      const ease = "cubic-bezier(0, 0, 0.2, 1)"
      const tilt = getComputedStyle(sheet).transform
      const matrix = tilt && tilt !== "none" ? new DOMMatrixReadOnly(tilt) : null
      const angle = matrix ? (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI : 0
      animations.push(
        sheet.animate(
          [
            { opacity: 0, transform: "translateY(24px) rotate(0deg)" },
            { opacity: 1, transform: `translateY(0px) rotate(${angle}deg)` },
          ],
          // An exponential ease-out: fast, then a long settle with no overshoot.
          { duration: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }
        )
      )
      const lines = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal-line]"))
      lines.forEach((line, index) =>
        animations.push(
          line.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 400,
            delay: 200 + index * 80,
            easing: ease,
            fill: "backwards",
          })
        )
      )
      const afterLines = 200 + lines.length * 80 + 200
      const path = node.querySelector<SVGPathElement>("[data-signature-path]")
      if (path && typeof path.getTotalLength === "function") {
        const length = path.getTotalLength()
        animations.push(
          path.animate(
            [
              { strokeDasharray: `${length}`, strokeDashoffset: `${length}` },
              { strokeDasharray: `${length}`, strokeDashoffset: "0" },
            ],
            { duration: 900, delay: afterLines, easing: "ease-in-out", fill: "backwards" }
          )
        )
      }
      const portrait = node.querySelector<HTMLElement>("[data-reveal-portrait]")
      if (portrait)
        animations.push(
          portrait.animate([{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "none" }], {
            duration: 600,
            delay: afterLines,
            easing: ease,
            fill: "backwards",
          })
        )
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        reveal()
      },
      { threshold: 0.2 }
    )
    observer.observe(sheet)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [root])
}

export interface AboutLetterCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutLetterCardCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The portrait: one slot, beside the letter on Desktop (360×440) and under
   * it on Tablet (360 tall) and Mobile (260 tall). Photos past the first are
   * not shown. None by default: a `muted` placeholder. An empty list shows
   * the `empty` line in its place.
   * @default none: a `muted` placeholder
   */
  photos?: AboutLetterCardPhoto[]
  /**
   * The signature under the letter. Figma's hand-drawn line by default; pass
   * your own SVG (it draws itself if its path carries `data-signature-path`),
   * or `null` to hide it.
   */
  signature?: React.ReactNode
}

export function AboutLetterCard({
  locale = "en",
  eyebrow,
  heading,
  subheading,
  greeting,
  introduction,
  introductionRole,
  paragraphs,
  action,
  connectLabel,
  socials,
  empty,
  photos,
  signature,
  className,
  ...props
}: AboutLetterCardProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const connectId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const label = eyebrow ?? copy.eyebrow
  const sub = subheading ?? copy.subheading
  const button = action === undefined ? copy.action : action
  const links = socials ?? copy.socials
  const photo = photos?.[0]
  const mark = signature === undefined ? <DrawnSignature /> : signature
  useReveal(rootRef)

  return (
    <section
      ref={rootRef}
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-muted px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10">
        <div className="flex flex-col gap-2">
          {label ? <p className="text-xs font-medium text-muted-foreground">{label}</p> : null}
          <h2
            id={headingId}
            className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
          >
            {heading ?? copy.heading}
          </h2>
          {sub ? <p className="text-base text-muted-foreground">{sub}</p> : null}
        </div>

        <div
          data-reveal-sheet=""
          className={cn(
            "flex w-full flex-col gap-8 rounded-md bg-card p-6 shadow-xl",
            "[@container(min-width:40rem)]:gap-10 [@container(min-width:40rem)]:p-10",
            "[@container(min-width:64rem)]:mx-auto [@container(min-width:64rem)]:max-w-[1200px] [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:gap-16 [@container(min-width:64rem)]:p-16",
            TILT
          )}
        >
          <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
            <p
              data-reveal-line=""
              className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
            >
              {greeting ?? copy.greeting}
            </p>
            <p data-reveal-line="" className="text-base font-medium text-foreground [@container(min-width:40rem)]:text-lg">
              {introduction ?? copy.introduction}
              <span className="text-muted-foreground">{introductionRole ?? copy.introductionRole}</span>
            </p>
            {(paragraphs ?? copy.paragraphs).map((paragraph, index) => (
              <p key={index} data-reveal-line="" className="text-base text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {mark}
            <div className="flex flex-wrap items-end gap-6 [@container(min-width:40rem)]:gap-8">
              {button ? (
                <a href={button.href} className={buttonVariants()}>
                  {button.label}
                </a>
              ) : null}
              {links.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <p id={connectId} className="text-xs font-medium text-muted-foreground">
                    {connectLabel ?? copy.connectLabel}
                  </p>
                  <ul aria-labelledby={connectId} className="flex gap-2">
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
                </div>
              ) : null}
            </div>
          </div>

          {photos && photos.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground [@container(min-width:64rem)]:w-[360px] [@container(min-width:64rem)]:shrink-0">
              {empty ?? copy.empty}
            </p>
          ) : (
            <div
              data-reveal-portrait=""
              className="relative h-[260px] w-full overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:h-[360px] [@container(min-width:64rem)]:h-[440px] [@container(min-width:64rem)]:w-[360px] [@container(min-width:64rem)]:shrink-0"
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
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutLetterCardCopy = COPY
