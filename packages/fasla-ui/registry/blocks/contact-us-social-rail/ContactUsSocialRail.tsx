"use client"

import * as React from "react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { ContactUsSection, splitCopy, useReveal, type ContactUsLocale } from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Social Rail.
 *
 * A header, a grid of eight social tiles and a footer, in a 1248px column on
 * the page's own ground, 48px apart. The header is the eyebrow "SAY HELLO"
 * (14px, `foreground`), a headline that IS the email address, and a line. The
 * headline is 60px / 72 on Desktop, 48px / 58 on Tablet and 24px / 44 on
 * Mobile (Arabic leads at 90, 72 and 60). Each tile is `card` with a 1px
 * `border`, 10px corners and 24px of padding: the platform's mark (Social Icons
 * atom, Original colours, 24px) and a trailing arrow-up-right, then the
 * platform's name (16px, semibold) and its handle (14px, `muted-foreground`).
 * The grid is four across on Desktop, two across on Tablet and one across on
 * Mobile (Figma's Mobile frame stacks the eight tiles; its motion note says
 * two-up: the frame wins, and `grid-cols-1` is the one class to change). The
 * footer holds "Or drop us a letter" over the postal address, and a Copy email
 * Button (Outline, Secondary, md): at the end of the row on Desktop and Tablet,
 * full width under the address on Mobile.
 *
 * Real: the headline is a button that copies `email` to the clipboard
 * (`navigator.clipboard`, with a fallback for browsers without it; nothing is
 * claimed when neither works), and so is the footer's button. Each tile is a
 * link to its `href`. Static: the handles, which are data (`socialLinks`).
 * Social marks are brand artwork and never mirror; the arrows do, and slide
 * along the reading direction.
 *
 * Motion: clicking either copy control swaps the headline's text for a "Copied"
 * label for 1.6s, a check scaling in from 0.6, then it crossfades back (an
 * aria-live region says it too). Hovering a tile (160ms, motion-safe) slides
 * its arrow 4px and crossfades the mark from the Original to the Negative
 * (monochrome) set. The brand-colour wash of Figma's motion card is not built,
 * by decision. The tiles rise 12px on a 50ms stagger on first view. Reduced
 * motion: the copy state swaps without the check animation, and a tile's hover
 * changes nothing that moves or fades.
 *
 * Content limits: the email up to 24 characters (it scales down so the address
 * never breaks mid-string), the line up to 110, a name up to 14, a handle up
 * to 20, the address up to 90.
 */

export interface ContactUsSocialRailLink {
  /** Which brand's mark. */
  platform: SocialPlatform
  /** The name beside the mark, as the brand is written in the design. */
  name: string
  /** The handle or path, set as one left-to-right run. */
  handle: string
  /** Where the tile goes. */
  href: string
}

export interface ContactUsSocialRailCopy {
  /** The small line above the headline. */
  eyebrow: string
  /** The line under the headline. */
  description: string
  /** Names the headline button for assistive technology, before the address: "Copy hello@fasla.com". */
  copyLabel: string
  /** Said in the headline and on the footer button once the address is copied. */
  copiedLabel: string
  /** The footer's small line above the address. */
  letter: string
  /** The postal address. */
  address: string
  /** The footer button's label. */
  copyEmail: string
}

/** Figma's copy, English and Arabic. The Arabic address uses commas where the English uses dots, and Western digits. */
const COPY: Record<ContactUsLocale, ContactUsSocialRailCopy> = {
  en: {
    eyebrow: "SAY HELLO",
    description: "The inbox is read by the whole studio. For anything faster, we are on every network below.",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    letter: "Or drop us a letter",
    address: "Fasla Studio · Level 12, Boulevard Plaza Tower 1 · Downtown Dubai · UAE",
    copyEmail: "Copy email",
  },
  ar: {
    eyebrow: "سلّم علينا",
    description: "يقرأ الاستوديو بأكمله هذا البريد. وللتواصل الأسرع، نحن على كل الشبكات أدناه.",
    copyLabel: "انسخ",
    copiedLabel: "تم النسخ",
    letter: "أو أرسل لنا رسالة بريدية",
    address: "استوديو فاصلة، الطابق 12، برج بوليفارد بلازا 1، وسط مدينة دبي، الإمارات",
    copyEmail: "انسخ البريد",
  },
}

const SOCIAL_LINKS: ContactUsSocialRailLink[] = [
  { platform: "linkedin", name: "LinkedIn", handle: "/company/fasla", href: "https://www.linkedin.com/company/fasla" },
  { platform: "x", name: "X (Twitter)", handle: "@fasladesign", href: "https://x.com/fasladesign" },
  { platform: "instagram", name: "Instagram", handle: "@fasla.design", href: "https://www.instagram.com/fasla.design" },
  { platform: "dribbble", name: "Dribbble", handle: "/fasla", href: "https://dribbble.com/fasla" },
  { platform: "github", name: "Github", handle: "/fasla", href: "https://github.com/fasla" },
  { platform: "youtube", name: "YouTube", handle: "@fasla", href: "https://www.youtube.com/@fasla" },
  { platform: "threads", name: "Threads", handle: "@fasla.design", href: "https://www.threads.net/@fasla.design" },
  { platform: "medium", name: "Medium", handle: "/fasla", href: "https://medium.com/fasla" },
]

export interface ContactUsSocialRailProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onCopy">, Partial<ContactUsSocialRailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /** The address the headline shows and both copy controls put on the clipboard. */
  email?: string
  /** The tiles, in reading order. Eight fill Figma's two rows of four. */
  socialLinks?: ContactUsSocialRailLink[]
  /** Called with the address after it was copied. */
  onCopy?: (email: string) => void
}

const COPIED_MS = 1600

/** Writes `text` to the clipboard. Resolves to whether it worked. */
async function writeClipboard(text: string) {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* falls through to the older route */
  }
  try {
    if (typeof document === "undefined" || typeof document.execCommand !== "function") return false
    const field = document.createElement("textarea")
    field.value = text
    field.setAttribute("readonly", "")
    field.style.cssText = "position:fixed;top:0;opacity:0;pointer-events:none"
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand("copy")
    field.remove()
    return ok
  } catch {
    return false
  }
}

/** The copy action both controls share: `copied` is true for 1.6s after a copy that worked. */
function useCopyEmail(email: string, onCopy?: (email: string) => void) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])
  const copy = React.useCallback(async () => {
    if (!(await writeClipboard(email))) return
    setCopied(true)
    onCopy?.(email)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_MS)
  }, [email, onCopy])
  return [copied, copy] as const
}

const EASE = "ease-[cubic-bezier(0.2,0,0,1)]"

export function ContactUsSocialRail({ locale = "en", ...given }: ContactUsSocialRailProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { email = "hello@fasla.com", socialLinks = SOCIAL_LINKS, onCopy, className, ...html } = rest
  const emailId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const [copied, copyEmail] = useCopyEmail(email, onCopy)

  return (
    <ContactUsSection labelledBy={emailId} className={className} {...html}>
      <header className="flex w-full flex-col items-start gap-5">
        <p className="text-sm font-semibold leading-5 text-foreground rtl:leading-6">{copy.eyebrow}</p>
        <h2 className="w-full text-2xl font-semibold leading-[2.75rem] text-foreground rtl:leading-[3.75rem] [@container(min-width:40rem)]:text-5xl [@container(min-width:40rem)]:leading-[3.625rem] [@container(min-width:40rem)]:rtl:leading-[4.5rem] [@container(min-width:64rem)]:text-6xl [@container(min-width:64rem)]:leading-[4.5rem] [@container(min-width:64rem)]:rtl:leading-[5.625rem]">
          <button
            type="button"
            onClick={copyEmail}
            aria-label={`${copy.copyLabel} ${email}`}
            className={cn(
              "relative inline-grid max-w-full cursor-pointer rounded-md text-start font-[inherit] text-[length:inherit] leading-[inherit] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "[&>*]:col-start-1 [&>*]:row-start-1"
            )}
          >
            <bdi
              dir="ltr"
              id={emailId}
              className={cn("min-w-0 break-all motion-safe:transition-opacity motion-safe:duration-[180ms]", EASE, copied ? "opacity-0" : "opacity-100")}
            >
              {email}
            </bdi>
            <span aria-hidden className={cn("flex items-center gap-[0.25em] motion-safe:transition-opacity motion-safe:duration-[180ms]", EASE, copied ? "opacity-100" : "opacity-0")}>
              <Check
                strokeWidth={1.5}
                className={cn("size-[0.8em] shrink-0 motion-safe:transition-transform motion-safe:duration-[180ms]", EASE, copied ? "scale-100" : "motion-safe:scale-[0.6]")}
              />
              {copy.copiedLabel}
            </span>
          </button>
        </h2>
        <p className="text-base leading-6 text-muted-foreground rtl:leading-7 [@container(min-width:40rem)]:text-lg [@container(min-width:40rem)]:leading-7 [@container(min-width:40rem)]:rtl:leading-8">{copy.description}</p>
      </header>

      <div ref={reveal} className="grid grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4">
        {socialLinks.map((link, index) => (
          <a
            key={link.platform + link.handle}
            href={link.href}
            data-reveal="rise"
            data-reveal-delay={index * 50}
            className="group/tile flex min-w-0 flex-col gap-4 rounded-[10px] border border-border bg-card p-6 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="relative size-6 shrink-0">
                <SocialIcon
                  platform={link.platform}
                  color="original"
                  className={cn("absolute inset-0 motion-safe:transition-opacity motion-safe:duration-[160ms] group-hover/tile:motion-safe:opacity-0 group-focus-visible/tile:motion-safe:opacity-0", EASE)}
                />
                <SocialIcon
                  platform={link.platform}
                  color="negative"
                  className={cn("absolute inset-0 opacity-0 motion-safe:transition-opacity motion-safe:duration-[160ms] group-hover/tile:motion-safe:opacity-100 group-focus-visible/tile:motion-safe:opacity-100", EASE)}
                />
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex shrink-0 motion-safe:transition-transform motion-safe:duration-[160ms] group-hover/tile:motion-safe:translate-x-1 group-focus-visible/tile:motion-safe:translate-x-1 rtl:group-hover/tile:motion-safe:-translate-x-1 rtl:group-focus-visible/tile:motion-safe:-translate-x-1",
                  EASE
                )}
              >
                <ArrowUpRight strokeWidth={1.5} className="size-4 text-muted-foreground rtl:-scale-x-100" />
              </span>
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-base font-semibold leading-6 text-foreground rtl:leading-7">{link.name}</span>
              <span className="block truncate text-start text-sm leading-5 text-muted-foreground rtl:leading-6">
                <bdi dir="ltr" className="inline-block [unicode-bidi:isolate]">{link.handle}</bdi>
              </span>
            </span>
          </a>
        ))}
      </div>

      <footer className="flex flex-col items-start gap-8 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-xs font-semibold leading-4 text-muted-foreground rtl:leading-5">{copy.letter}</p>
          <p className="text-sm font-medium leading-5 text-foreground rtl:leading-6">{copy.address}</p>
        </div>
        <Button type="button" variant="outline" size="md" onClick={copyEmail} className="w-full shrink-0 [@container(min-width:40rem)]:w-auto">
          {copied ? copy.copiedLabel : copy.copyEmail}
          {copied ? <Check aria-hidden strokeWidth={1.5} /> : <Copy aria-hidden strokeWidth={1.5} />}
        </Button>
      </footer>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${copy.copiedLabel} ${email}` : ""}
      </span>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsSocialRailCopy = COPY
