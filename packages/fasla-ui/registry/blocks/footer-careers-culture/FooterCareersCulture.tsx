"use client"

import * as React from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import type { SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FooterCopyright,
  FooterDot,
  FooterLegalLinks,
  FooterLogo,
  FooterRule,
  FooterSection,
  FooterSocial,
  useFooterReveal,
  usePrefersReducedMotion,
  type FooterLink,
  type FooterLocale,
  type FooterPhoto,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Careers & Culture.
 *
 * A hiring header (title, one line and a "See all roles" button), then a split:
 * four open roles as hairline rows on one side, a photo cluster on the other
 * (one studio photo over two team photos, and a caption), a hairline, and the
 * legal bar (the logo, copyright, three legal links and four social marks).
 *
 * Desktop (Figma 1440): header in one row with the button at the end; the roles
 * 812 wide beside the 420 photo cluster, 48px apart. Tablet (768): the header
 * stacks with the button across the width; the cluster moves below the roles.
 * Mobile (360): the same stack with a 32px rhythm; the button is full width.
 *
 * Photos are props: `studio` and `team` (two). Without one the slot shows the
 * `muted` ground at the same size. Photos are never flipped in Arabic.
 *
 * Motion: a role row hovering fills with `secondary` from the inline start,
 * 0 to 100% of its width in 200ms, and its arrow slides 4px to the end (the
 * arrow is mirrored in Arabic, so the wipe and the slide start at the right
 * and go left). The role list staggers in 60ms apart with a fade and an 8px
 * rise, when it first shows. The photo cluster reveals on its own observer
 * (it sits below the roles from Tablet): each photo scales 1.04 to 1 with
 * opacity, 500ms (380ms below Tablet), cubic-bezier(.16,1,.3,1), 90ms apart.
 * Where there is no hover (touch) the row tints for 120ms while pressed.
 * Reduced motion plays neither reveal, and the row's background changes at once.
 */

export interface FooterCareersRole {
  title: string
  /** The facts under the title, drawn with a small dot between them. */
  meta: string[]
  href?: string
}

export interface FooterCareersCultureCopy {
  title: string
  sub: string
  cta: string
  /** Accessible name of the roles list. */
  rolesLabel: string
  roles: FooterCareersRole[]
  caption: string
  copyright: string
  legal: FooterLink[]
  legalLabel: string
}

const COPY: Record<FooterLocale, FooterCareersCultureCopy> = {
  en: {
    title: "We're hiring — open roles",
    sub: "Design, engineering and content roles across Example City, Sample Town and remote-first teams.",
    cta: "See all roles",
    rolesLabel: "Open roles",
    roles: [
      { title: "Senior Product Designer", meta: ["Design", "Example City", "Hybrid"] },
      { title: "Design Engineer, Components", meta: ["Engineering", "Remote (CET ±3)"] },
      { title: "Arabic Type Designer", meta: ["Design", "Sample Town", "On-site"] },
      { title: "Technical Writer, Docs", meta: ["Content", "Remote"] },
    ],
    caption: "Studio days in Example City and Sample Town — the rest of the week is yours.",
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Equal opportunity"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal links",
  },
  ar: {
    title: "نحن نوظّف: وظائف شاغرة",
    sub: "وظائف تصميم وهندسة ومحتوى في مدينة المثال وبلدة النموذج وفرق عن بُعد أولًا.",
    cta: "عرض كل الوظائف",
    rolesLabel: "الوظائف الشاغرة",
    roles: [
      { title: "مصمم منتجات أول", meta: ["التصميم", "مدينة المثال", "هجين"] },
      { title: "مهندس تصميم، المكوّنات", meta: ["الهندسة", "عن بُعد", "CET ±3"] },
      { title: "مصمم خطوط عربية", meta: ["التصميم", "بلدة النموذج", "حضوري"] },
      { title: "كاتب تقني، التوثيق", meta: ["المحتوى", "عن بُعد"] },
    ],
    caption: "أيام استوديو في مدينة المثال وبلدة النموذج، وبقية الأسبوع لك.",
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "تكافؤ الفرص"].map((label) => ({ label, href: "#" })),
    legalLabel: "روابط قانونية",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerCareersCultureCopy = COPY

export interface FooterCareersCultureProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterCareersCultureCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The large photo. Without one the slot shows the `muted` ground. */
  studio?: FooterPhoto
  /** The two small photos, in order. A missing one shows the `muted` ground. */
  team?: FooterPhoto[]
  /** The social marks, in order. */
  socials?: SocialPlatform[]
  /** Where "See all roles" goes. */
  ctaHref?: string
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "github", "instagram", "x"]

/** Latin runs (zones, numbers) keep their own order inside Arabic text. */
function Bidi({ text, active }: { text: string; active: boolean }) {
  if (!active) return <>{text}</>
  return (
    <>
      {text.split(/([A-Za-z0-9+±][A-Za-z0-9:.–@+±/ ]*[A-Za-z0-9]|[A-Za-z0-9])/).map((part, i) =>
        i % 2 ? (
          <bdi key={i} dir="ltr">
            {part}
          </bdi>
        ) : (
          part
        )
      )}
    </>
  )
}

/** One photo slot: a clip with the photo (or the `muted` ground) inside, the part that the reveal scales. */
function PhotoSlot({ photo, className }: { photo?: FooterPhoto; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg bg-muted", className)}>
      <div data-photo="" className="size-full bg-muted">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt={photo.alt} loading="lazy" className="size-full object-cover" />
        ) : null}
      </div>
    </div>
  )
}

/** Plays the cluster's own reveal once it is on screen: scale 1.04 to 1 with opacity, 90ms apart. */
function useClusterReveal(ref: React.RefObject<HTMLDivElement | null>) {
  const reduced = usePrefersReducedMotion()
  React.useEffect(() => {
    const root = ref.current
    if (!root || reduced || typeof IntersectionObserver === "undefined" || typeof root.animate !== "function") return
    const play = () => {
      const footerWidth = root.closest("footer")?.getBoundingClientRect().width ?? 0
      const duration = footerWidth >= 640 ? 500 : 380
      root.querySelectorAll<HTMLElement>("[data-photo]").forEach((el, index) => {
        el.animate(
          [
            { opacity: 0, transform: "scale(1.04)" },
            { opacity: 1, transform: "none" },
          ],
          { duration, delay: index * 90, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }
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
      { threshold: 0.25 }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [ref, reduced])
}

export function FooterCareersCulture({
  locale = "en",
  title,
  sub,
  cta,
  rolesLabel,
  roles,
  caption,
  copyright,
  legal,
  legalLabel,
  studio,
  team,
  socials = DEFAULT_SOCIALS,
  ctaHref,
  className,
  ...props
}: FooterCareersCultureProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const list = roles ?? copy.roles
  const links = legal ?? copy.legal
  const headingId = React.useId()
  const rolesRef = React.useRef<HTMLUListElement>(null)
  const clusterRef = React.useRef<HTMLDivElement>(null)
  useFooterReveal(rolesRef, { selector: "[data-role]", stagger: 60, rise: 8, duration: 300, threshold: 0.2 })
  useClusterReveal(clusterRef)
  const heading = title ?? copy.title
  const subtext = sub ?? copy.sub
  const note = caption ?? copy.caption
  const ctaLabel = cta ?? copy.cta
  return (
    <FooterSection
      labelledBy={headingId}
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-16", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      <div className="flex flex-col gap-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-10">
        <div className="flex min-w-0 flex-col gap-2 [@container(min-width:64rem)]:max-w-[640px]">
          <h2 id={headingId} className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl">
            {heading}
          </h2>
          {subtext ? <p className="text-sm text-muted-foreground">{subtext}</p> : null}
        </div>
        {ctaLabel ? (
          <a href={ctaHref ?? "#"} className={buttonVariants({ variant: "default", size: "md", className: "w-full [@container(min-width:64rem)]:w-auto" })}>{ctaLabel}</a>
        ) : null}
      </div>
      <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:gap-12">
        {list.length > 0 ? (
          <nav aria-label={rolesLabel ?? copy.rolesLabel} className="min-w-0 [@container(min-width:64rem)]:flex-1">
            <ul ref={rolesRef} className="flex flex-col">
              {list.map((role) => (
                <li key={role.title} data-role="" className="flex border-b border-border">
                  <a
                    href={role.href ?? "#"}
                    className={cn(
                      "group/row relative isolate flex min-w-0 flex-1 items-center gap-3 py-2 [@container(min-width:40rem)]:py-3 [@container(min-width:64rem)]:gap-4",
                      "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      // the wipe: a layer under the row that grows from the inline start
                      "before:absolute before:inset-y-0 before:start-0 before:-z-10 before:w-0 before:bg-secondary before:transition-[width] before:duration-200 before:ease-out before:content-[''] motion-reduce:before:transition-none",
                      "hover:before:[@container(min-width:40rem)]:w-full focus-visible:before:w-full",
                      "[@media(hover:none)]:transition-colors [@media(hover:none)]:duration-[120ms] active:[@media(hover:none)]:bg-secondary"
                    )}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-base font-medium text-foreground">{role.title}</span>
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        {role.meta.map((fact, index) => (
                          <React.Fragment key={`${fact}-${index}`}>
                            {index > 0 ? <FooterDot /> : null}
                            <span>
                              <Bidi text={fact} active={ar} />
                            </span>
                          </React.Fragment>
                        ))}
                      </span>
                    </span>
                    <ArrowUpRightIcon
                      aria-hidden="true"
                      className="size-4 shrink-0 text-foreground transition-transform duration-200 ease-out motion-reduce:transition-none rtl:-scale-x-100 group-hover/row:motion-safe:[@container(min-width:40rem)]:translate-x-1 group-hover/row:motion-safe:rtl:[@container(min-width:40rem)]:-translate-x-1"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <div ref={clusterRef} className="flex shrink-0 flex-col gap-3 [@container(min-width:64rem)]:w-[420px] [@container(min-width:64rem)]:gap-4">
          <PhotoSlot photo={studio} className="h-[200px] w-full [@container(min-width:40rem)]:h-[300px] [@container(min-width:64rem)]:h-[200px]" />
          <div className="flex gap-3 [@container(min-width:64rem)]:gap-4">
            <PhotoSlot photo={team?.[0]} className="h-[120px] flex-1 [@container(min-width:40rem)]:h-[160px] [@container(min-width:64rem)]:h-[120px]" />
            <PhotoSlot photo={team?.[1]} className="h-[120px] flex-1 [@container(min-width:40rem)]:h-[160px] [@container(min-width:64rem)]:h-[120px]" />
          </div>
          {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
        </div>
      </div>
      <FooterRule />
      <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
        <div className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterLogo className="h-6" />
          <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
          {links.length ? <FooterLegalLinks links={links} label={legalLabel ?? copy.legalLabel} /> : null}
        </div>
        {socials.length ? <FooterSocial platforms={socials} /> : null}
      </div>
    </FooterSection>
  )
}
