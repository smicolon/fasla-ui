"use client"

import * as React from "react"
import { ArrowRight, Globe, Mail, MapPin } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { StatusIndicator } from "../../ui/status-indicator/status-indicator"
import {
  FOOTER_COMMON,
  FOOTER_FORM_COPY,
  FOOTER_LINK,
  FooterColumnTitle,
  FooterLegalBar,
  FooterLinkItem,
  FooterLogo,
  FooterNewsletterForm,
  FooterRule,
  FooterSection,
  useFooterReveal,
  usePrefersReducedMotion,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Bento Tile.
 *
 * The footer as a bento of `card` tiles (16 radius, 1px `border`). Column A:
 * a Brand tile (logo, blurb, Product and Company columns of three links),
 * then Newsletter (Default Input sm and Button sm, the shared newsletter form)
 * beside Status (an online Status Indicator, a line, a link with an arrow).
 * Column B: Contact (mail, globe and map-pin lines) over Social (five marks at
 * 22px). Then a hairline and the legal bar. A hairline sits on the block's top
 * edge.
 *
 * Desktop (1440) puts Column A (840) beside Column B (424), 16 apart. Tablet
 * and Mobile stack the two columns; the tile row (Newsletter, Status) is two
 * across on Tablet and one on Mobile. Tile padding is 24 / 20 / 16.
 *
 * Motion (Figma chip): the tiles enter on scroll, fading and rising 12px (8px
 * on Mobile), 300ms, 60ms apart in reading order. A tile lifts 3px and its
 * border goes `border` to `foreground` on hover in 160ms (no lift on Mobile,
 * and none under reduced motion; the border change stays). The status dot has
 * a 2px halo that scales 1 to 1.8 and fades, 2s, infinite, at every width (off
 * under reduced motion). The Subscribe button has no hover scale of its own.
 */

export interface FooterBentoTileCopy {
  /** The blurb in the Brand tile. */
  blurb: string
  /** The Brand tile's link columns. */
  columns: FooterColumn[]
  /** The Newsletter tile. */
  newsletter: { title: string; sub: string; placeholder: string; emailLabel: string; submit: string }
  /** The Status tile: its title, line and link. */
  status: { title: string; sub: string; link: string }
  /** The Contact tile: its title, then the email, the web address and the address. */
  contact: { title: string; email: string; web: string; address: string }
  /** The Social tile. */
  social: { title: string; sub: string }
  /** The copyright line. */
  copyright: string
  /** The legal links. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterBentoTileCopy> = {
  en: {
    blurb: "Components, tokens and patterns that behave the same in both directions.",
    columns: [
      { title: "Product", links: links(["Components", "Blocks", "Templates"]) },
      { title: "Company", links: links(["About", "Careers", "Contact"]) },
    ],
    newsletter: { title: "Monthly changelog", sub: "New components and breaking changes, once a month.", placeholder: "you@company.com", emailLabel: "Email address", submit: "Join" },
    status: { title: "System status", sub: "Live status of the component CDN and docs.", link: "View status history" },
    contact: { title: "Talk to the team", email: "you@company.com", web: "company.com/contact", address: "123 Example Street, Example City" },
    social: { title: "Follow along", sub: "Weekly component teardowns and RTL tips." },
    copyright: FOOTER_COMMON.en.copyright,
    legal: links(["Privacy", "Terms", "Cookies", "Accessibility"]),
    legalLabel: "Legal",
  },
  ar: {
    blurb: "مكوّنات ورموز وأنماط تتصرف بالطريقة نفسها في الاتجاهين.",
    columns: [
      { title: "المنتج", links: links(["المكوّنات", "الكتل", "القوالب"]) },
      { title: "الشركة", links: links(["من نحن", "الوظائف", "اتصل بنا"]) },
    ],
    newsletter: { title: "سجل تغييرات شهري", sub: "مكوّنات جديدة وتغييرات جذرية، مرة كل شهر.", placeholder: "you@company.com", emailLabel: "البريد الإلكتروني", submit: "انضم" },
    status: { title: "حالة النظام", sub: "الحالة المباشرة لشبكة CDN الخاصة بالمكوّنات والتوثيق.", link: "عرض سجل الحالة" },
    contact: { title: "تحدّث إلى الفريق", email: "you@company.com", web: "company.com/contact", address: "123 شارع المثال، مدينة المثال" },
    social: { title: "تابعنا", sub: "تحليلات أسبوعية للمكوّنات ونصائح RTL." },
    copyright: FOOTER_COMMON.ar.copyright,
    legal: links(["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "إمكانية الوصول"]),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerBentoTileCopy = COPY

export interface FooterBentoTileProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** Overrides for the copy: each tile's words. */
  blurb?: string
  columns?: FooterColumn[]
  newsletter?: Partial<FooterBentoTileCopy["newsletter"]>
  status?: Partial<FooterBentoTileCopy["status"]>
  contact?: Partial<FooterBentoTileCopy["contact"]>
  social?: Partial<FooterBentoTileCopy["social"]>
  copyright?: string
  legal?: FooterLink[]
  legalLabel?: string
  /** The social marks, in order. */
  socials?: SocialPlatform[]
  /** Called with the address when the Subscribe form is sent. */
  onSubscribe?: (email: string) => void | Promise<void>
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "dribbble", "youtube"]

/** Numbers inside Arabic text are Latin digits kept left to right. */
function Digits({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d+)/).map((part, index) =>
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

/** A tile: `card`, 1px `border`, 16 radius; padding 16 / 20 / 24; lifts and darkens its border on hover. */
const TILE =
  "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-[transform,border-color] duration-[160ms] motion-reduce:transition-[border-color] [@container(min-width:40rem)]:p-5 [@container(min-width:64rem)]:gap-4 [@container(min-width:64rem)]:p-6 " +
  "hover:[@container(min-width:40rem)]:border-foreground hover:motion-safe:[@container(min-width:40rem)]:-translate-y-[3px]"

function TileTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-card-foreground">{children}</h3>
}

function ContactLine({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="flex shrink-0 text-muted-foreground">
        {icon}
      </span>
      {children}
    </div>
  )
}

/** Whether reduced motion is asked for right now, read at the moment an effect starts so the first run is already right. */
const motionReduced = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** The status dot's halo: a 2px ring that grows 1 to 1.8 and fades, 2s, forever. Off under reduced motion. */
function StatusDot() {
  const reduced = usePrefersReducedMotion()
  const halo = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const el = halo.current
    if (!el || reduced || motionReduced() || typeof el.animate !== "function") return
    const animation = el.animate([{ transform: "scale(1)", opacity: 0.6 }, { transform: "scale(1.8)", opacity: 0 }], { duration: 2000, iterations: Infinity, easing: "ease-out" })
    return () => animation.cancel?.()
  }, [reduced])
  return (
    <span className="relative inline-flex shrink-0">
      {reduced ? null : <span ref={halo} aria-hidden="true" data-halo="" className="pointer-events-none absolute inset-0 rounded-full border-2 border-success opacity-0" />}
      <StatusIndicator status="online" size="8" />
    </span>
  )
}

function BentoColumn({ column }: { column: FooterColumn }) {
  const id = React.useId()
  if (!column.links.length) return null
  return (
    <nav aria-labelledby={id} className="flex min-w-0 flex-1 flex-col gap-2 [@container(min-width:40rem)]:gap-3">
      <FooterColumnTitle id={id}>{column.title}</FooterColumnTitle>
      <ul className="flex flex-col gap-2">
        {column.links.map((link) => (
          <li key={`${link.label}-${link.href}`} className="flex">
            <FooterLinkItem link={link} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function FooterBentoTile({
  locale = "en",
  blurb,
  columns,
  newsletter,
  status,
  contact,
  social,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  onSubscribe,
  className,
  ...props
}: FooterBentoTileProps) {
  const copy = COPY[locale]
  const form = FOOTER_FORM_COPY[locale]
  const ref = React.useRef<HTMLElement>(null)
  const [rise, setRise] = React.useState(12)
  React.useEffect(() => {
    const width = ref.current?.clientWidth ?? 0
    setRise(width > 0 && width < 640 ? 8 : 12)
  }, [])
  useFooterReveal(ref, { selector: "[data-reveal]", duration: 300, stagger: 60, rise })
  const text = blurb ?? copy.blurb
  const cols = columns ?? copy.columns
  const news = { ...copy.newsletter, ...newsletter }
  const stat = { ...copy.status, ...status }
  const talk = { ...copy.contact, ...contact }
  const follow = { ...copy.social, ...social }
  return (
    <FooterSection ref={ref} className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-16", className)} contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10" {...props}>
      <div className="grid gap-4 [@container(min-width:64rem)]:grid-cols-[minmax(0,1fr)_424px]">
        <div className="flex min-w-0 flex-col gap-3 [@container(min-width:64rem)]:gap-4">
          <div data-reveal="" className={TILE}>
            <div className="flex flex-col gap-5 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10">
              <div className="flex flex-col gap-2 [@container(min-width:40rem)]:w-[300px] [@container(min-width:40rem)]:shrink-0 [@container(min-width:40rem)]:gap-3">
                <FooterLogo className="h-[30px]" />
                {text ? <p className="text-sm text-muted-foreground">{text}</p> : null}
              </div>
              {cols.map((column) => (
                <BentoColumn key={column.title} column={column} />
              ))}
            </div>
          </div>
          <div className="grid gap-3 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:gap-4">
            <div data-reveal="" className={TILE}>
              <TileTitle>{news.title}</TileTitle>
              <p className="text-sm text-muted-foreground">{news.sub}</p>
              <FooterNewsletterForm
                size="sm"
                placeholder={news.placeholder}
                emailLabel={news.emailLabel}
                submitLabel={news.submit}
                sentMessage={form.sent}
                errorMessage={form.error}
                invalidMessage={form.invalid}
                onSubscribe={onSubscribe}
              />
            </div>
            <div data-reveal="" className={TILE}>
              <div className="flex items-center gap-2">
                <StatusDot />
                <TileTitle>{stat.title}</TileTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                <Digits text={stat.sub} />
              </p>
              {stat.link ? (
                <a href="#" className={cn(FOOTER_LINK, "w-fit gap-2 font-medium text-card-foreground hover:text-card-foreground focus-visible:text-card-foreground active:text-card-foreground")}>
                  {stat.link}
                  <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 rtl:-scale-x-100" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-3 [@container(min-width:64rem)]:gap-4">
          <div data-reveal="" className={TILE}>
            <TileTitle>{talk.title}</TileTitle>
            {talk.email ? (
              <ContactLine icon={<Mail className="size-4" />}>
                <a href={`mailto:${talk.email}`} className={cn(FOOTER_LINK, "min-w-0")}>
                  <bdi dir="ltr">{talk.email}</bdi>
                </a>
              </ContactLine>
            ) : null}
            {talk.web ? (
              <ContactLine icon={<Globe className="size-4" />}>
                <a href="#" className={cn(FOOTER_LINK, "min-w-0")}>
                  <bdi dir="ltr">{talk.web}</bdi>
                </a>
              </ContactLine>
            ) : null}
            {talk.address ? (
              <ContactLine icon={<MapPin className="size-4" />}>
                <p className="min-w-0 text-sm text-muted-foreground">
                  <Digits text={talk.address} />
                </p>
              </ContactLine>
            ) : null}
          </div>
          <div data-reveal="" className={TILE}>
            <TileTitle>{follow.title}</TileTitle>
            <p className="text-sm text-muted-foreground">{follow.sub}</p>
            {socials.length ? (
              <ul className="flex flex-wrap items-center gap-3 [@container(min-width:64rem)]:gap-4">
                {socials.map((platform) => (
                  <li key={platform} className="flex">
                    <a
                      href="#"
                      aria-label={SOCIAL_PLATFORM_NAMES[platform]}
                      className="relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3 after:content-['']"
                    >
                      <SocialIcon platform={platform} color="negative" className="size-[22px]" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
      <FooterRule />
      <FooterLegalBar copyright={<Digits text={copyright ?? copy.copyright} />} links={legal ?? copy.legal} label={legalLabel ?? copy.legalLabel} />
    </FooterSection>
  )
}
