"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_LINK,
  FooterColumnTitle,
  FooterLegalBar,
  FooterLogo,
  FooterRule,
  FooterSection,
  usePrefersReducedMotion,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Big-Type Link Stack.
 *
 * Five rows of big links, each a Light label and an up-right arrow with a
 * hairline under it, beside a column of facts (logo, Studio, Get in touch,
 * Working hours, five social marks), then a hairline and the legal bar. A
 * hairline sits on the block's top edge.
 *
 * Row labels are 5XL (48px) on Desktop and 3XL (30px) on Tablet and Mobile, as the
 * Figma frames draw them (the chip says 4XL on Tablet; the frame renders 30px) (arrows 28 / 28 / 20). Desktop
 * puts the rows (860) beside the facts (340); Tablet and Mobile stack them.
 *
 * Motion (Figma chip): hover (and keyboard focus, the same) slides the label
 * and the arrow 8px toward the end side (6px on Tablet) while the arrow goes
 * .6 to 1 opacity and the row's hairline thickens 1 to 2px, 220ms
 * cubic-bezier(.2,.8,.2,1). On Mobile hover gives way to active:: the row
 * tints `secondary` for 120ms. The rows reveal on scroll with a bottom-up clip,
 * 420ms, 70ms apart (50ms on Mobile). Reduced motion: colour change only.
 */

export interface FooterBigTypeLinkStackCopy {
  /** The big rows. */
  rows: FooterLink[]
  /** The accessible name of the big rows. */
  navLabel: string
  /** The facts column: three titled groups of lines. A line that is an email or a URL is a link. */
  studio: { title: string; lines: string[] }
  contact: { title: string; lines: string[] }
  hours: { title: string; lines: string[] }
  /** The copyright line. */
  copyright: string
  /** The legal links. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterBigTypeLinkStackCopy> = {
  en: {
    rows: links(["Product", "Documentation", "Pricing", "Company", "Contact"]),
    navLabel: "Footer",
    studio: { title: "Studio", lines: ["123 Example Street", "12345 Example City"] },
    contact: { title: "Get in touch", lines: ["you@company.com", "company.com/contact"] },
    hours: { title: "Working hours", lines: ["Monday – Friday", "09:00 – 18:00 CET"] },
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: links(["Privacy", "Terms", "Cookies", "Accessibility"]),
    legalLabel: "Legal links",
  },
  ar: {
    rows: links(["المنتج", "التوثيق", "الأسعار", "الشركة", "اتصل بنا"]),
    navLabel: "التذييل",
    studio: { title: "الاستوديو", lines: ["123 شارع المثال", "12345 مدينة المثال"] },
    contact: { title: "تواصل معنا", lines: ["you@company.com", "company.com/contact"] },
    hours: { title: "ساعات العمل", lines: ["الاثنين – الجمعة", "09:00 – 18:00 CET"] },
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: links(["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "إمكانية الوصول"]),
    legalLabel: "روابط قانونية",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerBigTypeLinkStackCopy = COPY

export interface FooterBigTypeLinkStackProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterBigTypeLinkStackCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "dribbble", "figma"]

/** Wraps digit runs (and a time or a URL) in a left-to-right island, so Arabic text keeps them intact. */
function Bidi({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d[\d:\s–]*\d(?: CET)?|\d+)/).map((part, index) =>
        index % 2 ? (
          <bdi key={index} dir="ltr">
            {part}
          </bdi>
        ) : (
          part
        )
      )}
    </>
  )
}

const EASE = "cubic-bezier(.2,.8,.2,1)"

/** The rows' hover, as one set of classes: only where there is a real hover, only from Tablet, mirrored in Arabic. Mobile gets `active:` instead. */
const LABEL_MOVE =
  "group-hover:[@container(min-width:40rem)]:translate-x-[6px] group-focus-visible:[@container(min-width:40rem)]:translate-x-[6px] group-hover:[@container(min-width:64rem)]:translate-x-2 group-focus-visible:[@container(min-width:64rem)]:translate-x-2 " +
  "group-hover:rtl:[@container(min-width:40rem)]:-translate-x-[6px] group-focus-visible:rtl:[@container(min-width:40rem)]:-translate-x-[6px] group-hover:rtl:[@container(min-width:64rem)]:-translate-x-2 group-focus-visible:rtl:[@container(min-width:64rem)]:-translate-x-2"

const ARROW_FADE = "group-hover:[@container(min-width:40rem)]:opacity-100 group-focus-visible:opacity-100"

/** Whether reduced motion is asked for right now, read at the moment an effect starts so the first run is already right. */
const motionReduced = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** The bottom-up clip each row plays when the stack scrolls into view. */
function useRowReveal(ref: React.RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion()
  React.useEffect(() => {
    const root = ref.current
    if (reduced || motionReduced() || !root || typeof IntersectionObserver === "undefined" || typeof root.animate !== "function") return
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-row]"))
    if (!rows.length) return
    const stagger = root.clientWidth > 0 && root.clientWidth < 640 ? 50 : 70
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          rows.forEach((row, index) =>
            row.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 420, delay: index * stagger, easing: EASE, fill: "backwards" })
          )
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [ref, reduced])
}

function FactLine({ line }: { line: string }) {
  if (/@/.test(line)) {
    return (
      <a href={`mailto:${line}`} className={cn(FOOTER_LINK, "w-fit")}>
        <bdi dir="ltr">{line}</bdi>
      </a>
    )
  }
  if (/^[\w-]+\.[\w.-]+\/\S*$/.test(line)) {
    return (
      <a href="#" className={cn(FOOTER_LINK, "w-fit")}>
        <bdi dir="ltr">{line}</bdi>
      </a>
    )
  }
  return (
    <p className="text-sm text-muted-foreground">
      <Bidi text={line} />
    </p>
  )
}

function FactGroup({ group }: { group: { title: string; lines: string[] } }) {
  if (!group.lines.length) return null
  return (
    <div className="flex flex-col gap-1">
      <FooterColumnTitle as="h3">{group.title}</FooterColumnTitle>
      {group.lines.map((line) => (
        <FactLine key={line} line={line} />
      ))}
    </div>
  )
}

export function FooterBigTypeLinkStack({
  locale = "en",
  rows,
  navLabel,
  studio,
  contact,
  hours,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  className,
  ...props
}: FooterBigTypeLinkStackProps) {
  const copy = COPY[locale]
  const ref = React.useRef<HTMLElement>(null)
  useRowReveal(ref)
  const items = rows ?? copy.rows
  const groups = [studio ?? copy.studio, contact ?? copy.contact, hours ?? copy.hours]
  return (
    <FooterSection
      ref={ref}
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-20", className)}
      contentClassName="gap-8 [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:gap-16"
      {...props}
    >
      <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-20">
        {items.length ? (
          <nav aria-label={navLabel ?? copy.navLabel} className="min-w-0 flex-1">
            <ul className="flex flex-col">
              {items.map((link) => (
                <li key={`${link.label}-${link.href}`} data-row="" className="flex">
                  <a
                    href={link.href}
                    className={cn(
                      "group relative flex w-full items-center justify-between py-3 [@container(min-width:64rem)]:py-4",
                      "rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      "text-foreground transition-colors duration-[120ms] active:bg-secondary active:[@container(min-width:40rem)]:bg-transparent motion-reduce:transition-none",
                      // The hairline under the row: 1px, and 2px on hover or focus.
                      "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-bottom after:bg-border after:transition-transform after:duration-[220ms] after:ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:after:transition-none",
                      "hover:after:[@container(min-width:40rem)]:scale-y-[2] focus-visible:after:scale-y-[2]"
                    )}
                  >
                    <span
                      className={cn(
                        "text-3xl font-light transition-transform duration-[220ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none [@container(min-width:64rem)]:text-5xl",
                        LABEL_MOVE
                      )}
                    >
                      {link.label}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className={cn(
                        "size-5 shrink-0 opacity-60 transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none rtl:-scale-x-100 [@container(min-width:40rem)]:size-7",
                        ARROW_FADE,
                        LABEL_MOVE
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:w-[340px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:gap-8">
          <FooterLogo className="h-[30px]" />
          {groups.map((group) => (
            <FactGroup key={group.title} group={group} />
          ))}
          {socials.length ? (
            <ul className="flex items-center gap-3 [@container(min-width:64rem)]:gap-4">
              {socials.map((platform) => (
                <li key={platform} className="flex">
                  <a
                    href="#"
                    aria-label={SOCIAL_PLATFORM_NAMES[platform]}
                    className="relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3 after:content-['']"
                  >
                    <SocialIcon platform={platform} color="negative" className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-4 [@container(min-width:40rem)]:gap-6">
        <FooterRule />
        <FooterLegalBar copyright={<Bidi text={copyright ?? copy.copyright} />} links={legal ?? copy.legal} label={legalLabel ?? copy.legalLabel} />
      </div>
    </FooterSection>
  )
}
