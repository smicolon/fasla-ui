"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import { Input } from "../../ui/input/input"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Footer` (46380:22515). The parts every `footer-*` block is built
 * from, one per thing the Figma set repeats: the section and its 1280px
 * column, the hairline, the brand block, the social row, a column of links,
 * the legal bar, the newsletter form and its four states, and the two small
 * hooks that carry the motion (reveal on view, reduced motion).
 *
 * STAND-INS (temporary; replace when the atom exists in the code library):
 *  - `FooterRule` stands in for the Separator atom, which the library does not
 *    have yet. It is a plain 1px line in `border`, as the other blocks draw it.
 *
 * Mobile first, and sized by the block's own width, not the window's, as the
 * Careers and Blog Cards blocks are: the section is a query container. The base
 * classes are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its
 * Tablet (768) and `[@container(min-width:64rem)]:` its Desktop (1440). The
 * section's own padding still follows the window, since an element can't query
 * itself. The page's `dir` sets the direction; nothing here takes one.
 *
 * Demo data is fixed: the year in the copyright line is the constant 2026.
 */

export type FooterLocale = "en" | "ar"

/** The year the demo copyright line shows. A constant, so the demo is the same on every render. */
export const FOOTER_YEAR = 2026

/** A photo a block takes as a prop: the file and its description in the block's language. Blocks ship none. */
export interface FooterPhoto {
  src: string
  alt: string
}

/* ---------------------------------------------------------------- copy */

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

/**
 * Words several Types share, in both languages: the link columns from
 * Figma's anatomy, the legal links, the copyright line and the brand blurb.
 * A Type with its own wording keeps it in its own copy.
 */
export const FOOTER_COMMON: Record<
  FooterLocale,
  {
    blurb: string
    copyright: string
    privacy: string
    terms: string
    cookies: string
    columns: { product: FooterColumn; resources: FooterColumn; company: FooterColumn; legal: FooterColumn }
  }
> = {
  en: {
    blurb: "The bilingual design system behind Fasla: components, tokens and patterns for teams shipping in English and Arabic.",
    copyright: `© ${FOOTER_YEAR} Fasla. All rights reserved.`,
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Preferences",
    columns: {
      product: {
        title: "Product",
        links: ["Components", "Blocks", "Templates", "Design tokens", "Design library", "Changelog"].map((label) => ({ label, href: "#" })),
      },
      resources: {
        title: "Resources",
        links: ["Documentation", "Guides", "Tutorials", "Blog", "Showcase", "Status"].map((label) => ({ label, href: "#" })),
      },
      company: {
        title: "Company",
        links: ["About", "Careers", "Customers", "Partners", "Press", "Contact"].map((label) => ({ label, href: "#" })),
      },
      legal: {
        title: "Legal",
        links: ["Privacy", "Terms", "Cookies", "Licenses", "Security", "Accessibility"].map((label) => ({ label, href: "#" })),
      },
    },
  },
  ar: {
    blurb: "نظام التصميم ثنائي اللغة وراء فاصلة: مكوّنات ورموز وأنماط للفرق التي تُطلق منتجاتها بالعربية والإنجليزية.",
    copyright: `© ${FOOTER_YEAR} فاصلة. جميع الحقوق محفوظة.`,
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    cookies: "تفضيلات ملفات تعريف الارتباط",
    columns: {
      product: {
        title: "المنتج",
        links: ["المكوّنات", "الكتل", "القوالب", "رموز التصميم", "مكتبة التصميم", "سجل التغييرات"].map((label) => ({ label, href: "#" })),
      },
      resources: {
        title: "الموارد",
        links: ["التوثيق", "الأدلة", "الدروس", "المدونة", "المعرض", "الحالة"].map((label) => ({ label, href: "#" })),
      },
      company: {
        title: "الشركة",
        links: ["من نحن", "الوظائف", "العملاء", "الشركاء", "الصحافة", "اتصل بنا"].map((label) => ({ label, href: "#" })),
      },
      legal: {
        title: "قانوني",
        links: ["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "التراخيص", "الأمان", "إمكانية الوصول"].map((label) => ({ label, href: "#" })),
      },
    },
  },
}

/** The placeholder words for the newsletter form's states, English and Arabic. */
export const FOOTER_FORM_COPY: Record<
  FooterLocale,
  { sent: string; error: string; invalid: string; ecommerceSent: string; ecommerceError: string; docsThanks: string }
> = {
  en: {
    sent: "Thanks. Check your inbox to confirm.",
    error: "That didn't go through. Try again in a moment.",
    invalid: "Enter a valid email address.",
    ecommerceSent: "You're in. Your welcome offer is on its way.",
    ecommerceError: "We couldn't sign you up. Try again.",
    docsThanks: "Thanks for the feedback.",
  },
  ar: {
    sent: "شكرًا لك. تحقق من بريدك لتأكيد الاشتراك.",
    error: "تعذّر الإرسال. حاول مرة أخرى بعد قليل.",
    invalid: "أدخل بريدًا إلكترونيًا صحيحًا.",
    ecommerceSent: "تم اشتراكك. عرض الترحيب في طريقه إليك.",
    ecommerceError: "تعذّر الاشتراك. حاول مرة أخرى.",
    docsThanks: "شكرًا على ملاحظاتك.",
  },
}

/* -------------------------------------------------------------- motion */

/** Whether the visitor asked for reduced motion. False on the server and before mount. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener?.("change", onChange)
    return () => query.removeEventListener?.("change", onChange)
  }, [])
  return reduced
}

export interface FooterRevealOptions {
  /** How much of the block must be on screen before it plays: 0 to 1. */
  threshold?: number
  /** Which children play, found inside the block. */
  selector?: string
  /** Each one's duration in ms. */
  duration?: number
  /** The gap between one child and the next in ms. */
  stagger?: number
  /** Where each starts, in px below its place. 0 for a fade. */
  rise?: number
  /** The first child's delay in ms. */
  delay?: number
  easing?: string
  /** Reduced motion: fade only for this many ms (0 plays nothing at all). */
  reducedFade?: number
}

/**
 * Plays an entrance once, when the block first reaches `threshold` of itself
 * on screen: each child matching `selector` fades in and rises, `stagger` ms
 * apart, in document order (which is reading order, so Arabic runs from the
 * right on its own). The children are drawn in place until it plays, so
 * nothing is hidden without script; the animation starts from the hidden
 * keyframe and fills backwards. Reduced motion plays a short fade, or nothing.
 */
export function useFooterReveal<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { threshold = 0.25, selector = "[data-reveal]", duration = 300, stagger = 60, rise = 12, delay = 0, easing = "ease-out", reducedFade = 0 }: FooterRevealOptions = {}
) {
  const hookReduced = usePrefersReducedMotion()
  React.useEffect(() => {
    // Read the preference straight away: the hook's state is one render behind on mount.
    const reduced = hookReduced || (typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    const root = ref.current
    if (!root || typeof IntersectionObserver === "undefined" || typeof root.animate !== "function") return
    if (reduced && reducedFade === 0) return
    const play = () => {
      root.querySelectorAll<HTMLElement>(selector).forEach((el, index) => {
        el.animate(
          reduced
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                { opacity: 0, transform: `translateY(${rise}px)` },
                { opacity: 1, transform: "none" },
              ],
          { duration: reduced ? reducedFade : duration, delay: reduced ? 0 : delay + index * stagger, easing, fill: "backwards" }
        )
      })
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          play()
        }
      },
      { threshold }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [ref, hookReduced, selector, threshold, duration, stagger, rise, delay, easing, reducedFade])
}

/* --------------------------------------------------------------- parts */

export interface FooterSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The id of the heading that names the footer, when it has one. */
  labelledBy?: string
  /** Paints the band with the inverse tokens: dark in light mode, light in dark mode. */
  inverse?: boolean
  /** Classes for the 1280px column inside the padding. */
  contentClassName?: string
  /** Layers that fill the whole band behind the column (a photo and its scrim), outside the 1280px column and the padding. */
  behind?: React.ReactNode
}

/**
 * Figma's footer frame: `theme/background` (or `background-inverse`), 80px
 * either side on Desktop, 24 on Tablet and 16 on phones, and a 1280px column.
 * Vertical padding is the Type's own (`className`).
 */
export const FooterSection = React.forwardRef<HTMLElement, FooterSectionProps>(function FooterSection(
  { labelledBy, inverse = false, className, contentClassName, behind, children, ...props },
  ref
) {
  return (
    <footer
      ref={ref}
      aria-labelledby={labelledBy}
      data-inverse={inverse ? "" : undefined}
      className={cn(
        "[container-type:inline-size] px-4 md:px-6 lg:px-20",
        inverse ? "bg-background-inverse text-foreground-inverse" : "bg-background text-foreground",
        className
      )}
      {...props}
    >
      {behind}
      <div className={cn("mx-auto flex w-full max-w-[1280px] flex-col", contentClassName)}>{children}</div>
    </footer>
  )
})

/**
 * Figma's `Separator`: a 1px line across its container. The code library has
 * no Separator yet; swap this for it once it does.
 */
export function FooterRule({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return <div role="presentation" className={cn("h-px w-full shrink-0", inverse ? "bg-foreground-inverse opacity-20" : "bg-border", className)} />
}

/** The Fasla mark, the lockup in the page's script, in `foreground` (or the inverse token on a dark band). */
export function FooterLogo({ inverse = false, className, title = "" }: { inverse?: boolean; className?: string; title?: string }) {
  // The span keeps the mark at the start of a column that stretches its children, and shrinks to it in a centred one.
  return (
    <span className="inline-flex shrink-0">
      <FaslaLogo className={cn("h-8 w-auto shrink-0", inverse && "text-foreground-inverse", className)} title={title} />
    </span>
  )
}

/** The logo with a blurb under it, then whatever follows (the social row): Figma's brand block. */
export function FooterBrand({ blurb, inverse = false, className, logoClassName, children }: { blurb?: React.ReactNode; inverse?: boolean; className?: string; logoClassName?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col items-start gap-4 [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6", className)}>
      <FooterLogo inverse={inverse} className={logoClassName} />
      {blurb ? <p className={cn("max-w-[320px] text-sm", inverse ? "text-muted-foreground-inverse" : "text-muted-foreground")}>{blurb}</p> : null}
      {children}
    </div>
  )
}

export interface FooterSocialProps extends React.HTMLAttributes<HTMLUListElement> {
  platforms: SocialPlatform[]
  /** The mark's size in px: Figma draws 16, 18, 20 (default) and 22. */
  size?: 16 | 18 | 20 | 22
  /** The mark colour: Figma's Social Icons `Color`. Negative (`muted-foreground`) by default. */
  color?: "original" | "negative" | "current"
  /** Where each goes, by platform. A platform without one links to `#`. */
  hrefs?: Partial<Record<SocialPlatform, string>>
  inverse?: boolean
}

/** The channels as a row of 20px marks, 12px apart on phones and 16px from Tablet, each a link named by its platform. */
const SOCIAL_SIZE = { 16: "size-4", 18: "size-[18px]", 20: "size-5", 22: "size-[22px]" } as const

export function FooterSocial({ platforms, size = 20, color = "negative", hrefs, inverse = false, className, ...props }: FooterSocialProps) {
  return (
    <ul className={cn("flex items-center gap-3 [@container(min-width:40rem)]:gap-4", className)} {...props}>
      {platforms.map((platform) => (
        <li key={platform} className="flex">
          <a
            href={hrefs?.[platform] ?? "#"}
            aria-label={SOCIAL_PLATFORM_NAMES[platform]}
            className={cn(
              "relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3 after:content-['']",
              inverse && "text-foreground-inverse"
            )}
          >
            <SocialIcon platform={platform} color={inverse && color === "negative" ? "current" : color} className={SOCIAL_SIZE[size]} />
          </a>
        </li>
      ))}
    </ul>
  )
}

/** A link in a footer: SM Regular in `muted-foreground`, `foreground` on hover and focus (120ms), a 44px hit area. */
export const FOOTER_LINK =
  "relative inline-flex items-center rounded-sm text-sm text-muted-foreground transition-colors duration-[120ms] motion-reduce:transition-none [outline:none] hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:text-foreground after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-['']"

/** The same on an inverse band. */
export const FOOTER_LINK_INVERSE =
  "relative inline-flex items-center rounded-sm text-sm text-muted-foreground-inverse transition-colors duration-[120ms] motion-reduce:transition-none [outline:none] hover:text-foreground-inverse focus-visible:text-foreground-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:text-foreground-inverse after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-['']"

export function FooterLinkItem({ link, inverse = false, className }: { link: FooterLink; inverse?: boolean; className?: string }) {
  return (
    <a href={link.href} className={cn(inverse ? FOOTER_LINK_INVERSE : FOOTER_LINK, className)}>
      {link.label}
    </a>
  )
}

/** A column title: Figma's `Extra/List Header` (14 over 16, Medium, uppercase in English), `foreground`. */
export function FooterColumnTitle({ children, inverse = false, as: Tag = "h3", className, ...props }: React.HTMLAttributes<HTMLElement> & { inverse?: boolean; as?: "h2" | "h3" | "h4" | "p" }) {
  return (
    <Tag className={cn("text-list-header font-medium uppercase", inverse ? "text-foreground-inverse" : "text-foreground", className)} {...props}>
      {children}
    </Tag>
  )
}

/** A title over a list of links: Figma's link column. The links are one list inside a labelled `nav`. */
export function FooterLinkColumn({ title, links, inverse = false, className, "data-reveal": reveal }: { title: React.ReactNode; links: readonly FooterLink[]; inverse?: boolean; className?: string; "data-reveal"?: boolean }) {
  const id = React.useId()
  return (
    <nav aria-labelledby={id} data-reveal={reveal ? "" : undefined} className={cn("flex min-w-0 flex-col gap-3 [@container(min-width:40rem)]:gap-4", className)}>
      <FooterColumnTitle id={id} inverse={inverse}>
        {title}
      </FooterColumnTitle>
      <ul className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`} className="flex">
            <FooterLinkItem link={link} inverse={inverse} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** The copyright line: XS Regular in `muted-foreground`. */
export function FooterCopyright({ children, inverse = false, className }: { children: React.ReactNode; inverse?: boolean; className?: string }) {
  return <p className={cn("text-xs", inverse ? "text-muted-foreground-inverse" : "text-muted-foreground", className)}>{children}</p>
}

/** A row of small legal links, XS in `muted-foreground`, wrapping on phones. */
export function FooterLegalLinks({ links, inverse = false, label, className }: { links: readonly FooterLink[]; inverse?: boolean; label?: string; className?: string }) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 [@container(min-width:40rem)]:gap-x-6">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`} className="flex">
            <FooterLinkItem link={link} inverse={inverse} className="text-xs" />
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * The legal bar: the copyright on one side and the legal links on the other,
 * in a row from Tablet and stacked on phones.
 */
export function FooterLegalBar({ copyright, links, label, inverse = false, className, children }: { copyright: React.ReactNode; links?: readonly FooterLink[]; label?: string; inverse?: boolean; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6", className)}>
      <FooterCopyright inverse={inverse}>{copyright}</FooterCopyright>
      {children}
      {links?.length ? <FooterLegalLinks links={links} inverse={inverse} label={label} /> : null}
    </div>
  )
}

/** A small dot between two facts, drawn as a span so no separator character is typed (the Arabic copy has none). */
export function FooterDot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("size-[3px] shrink-0 rounded-full bg-current opacity-60", className)} />
}

/* ------------------------------------------------------ newsletter form */

export type FooterFormStatus = "idle" | "loading" | "sent" | "error"

export interface FooterNewsletterFormProps {
  /** The email field's placeholder. */
  placeholder: string
  /** The field's accessible name. The field shows no label, as in Figma. */
  emailLabel: string
  /** The button's label. */
  submitLabel: string
  /** The line that replaces the form once it is sent. */
  sentMessage: string
  /** The line shown under the field when sending failed. */
  errorMessage: string
  /** The line shown under the field when the address isn't an address. */
  invalidMessage: string
  /** Figma's field and button size: both the same. */
  size?: "sm" | "md" | "lg"
  /** The button's look: Figma's Solid Primary by default. */
  buttonVariant?: "default" | "secondary" | "outline"
  /** Stacks the field above the button even on wide containers. Phones always stack. */
  stacked?: boolean
  /** Set to hold the form in a state, for a story or a test. */
  status?: FooterFormStatus
  /** Called with the address. Return a promise: the form is `loading` until it settles, and `error` if it throws. */
  onSubscribe?: (email: string) => void | Promise<void>
  className?: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * The email field and its button as Figma draws them, with the states Figma
 * leaves to code: pressing the button disables the field and shows the
 * button's spinner (150ms); on success the form cross-fades to one line
 * (200ms ease-out) and holds the form's height, so what is below does not
 * jump; on failure the field turns invalid and a line fades in under it
 * (160ms). Reduced motion swaps the layers at once. The browser's own submit
 * is cancelled: `onSubscribe` receives the address and the page does the rest.
 */
export function FooterNewsletterForm({
  placeholder,
  emailLabel,
  submitLabel,
  sentMessage,
  errorMessage,
  invalidMessage,
  size = "md",
  buttonVariant = "default",
  stacked = false,
  status: forced,
  onSubscribe,
  className,
}: FooterNewsletterFormProps) {
  const [state, setState] = React.useState<FooterFormStatus>("idle")
  const [invalid, setInvalid] = React.useState(false)
  const status = forced ?? state
  const messageId = React.useId()
  const sent = status === "sent"
  const failed = status === "error"
  const showMessage = invalid || failed

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "loading") return
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email") ?? "").trim()
    if (!EMAIL.test(email)) {
      setInvalid(true)
      setState("idle")
      return
    }
    setInvalid(false)
    setState("loading")
    try {
      await onSubscribe?.(email)
      setState("sent")
    } catch {
      setState("error")
    }
  }

  return (
    <div className={cn("grid", className)}>
      <form
        noValidate
        onSubmit={handleSubmit}
        aria-hidden={sent ? true : undefined}
        // `inert` is not in React 18's types, so it goes through as an attribute.
        {...(sent ? { inert: "" as unknown as boolean } : {})}
        className={cn(
          "col-start-1 row-start-1 flex flex-col gap-2 transition-opacity duration-200 ease-out motion-reduce:transition-none",
          !stacked && "[@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-start",
          sent && "pointer-events-none opacity-0"
        )}
      >
        <Input
          type="email"
          name="email"
          size={size}
          autoComplete="email"
          aria-label={emailLabel}
          placeholder={placeholder}
          disabled={status === "loading"}
          invalid={showMessage}
          aria-describedby={showMessage ? messageId : undefined}
          className="min-w-0 flex-1"
        />
        <Button type="submit" variant={buttonVariant} size={size} loading={status === "loading"} className="w-full [@container(min-width:40rem)]:w-auto">
          {submitLabel}
        </Button>
        <p
          id={messageId}
          role="alert"
          className={cn(
            "text-xs text-destructive transition-opacity duration-[160ms] motion-reduce:transition-none [@container(min-width:40rem)]:basis-full",
            showMessage ? "opacity-100" : "hidden opacity-0"
          )}
        >
          {showMessage ? (failed ? errorMessage : invalidMessage) : null}
        </p>
      </form>
      <p
        role="status"
        className={cn(
          "col-start-1 row-start-1 flex items-center text-sm text-foreground transition-opacity duration-200 ease-out motion-reduce:transition-none",
          sent ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {sent ? sentMessage : null}
      </p>
    </div>
  )
}
