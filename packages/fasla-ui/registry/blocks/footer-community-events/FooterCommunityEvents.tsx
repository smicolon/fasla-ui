"use client"

import * as React from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FooterColumnTitle,
  FooterCopyright,
  FooterDot,
  FooterLegalLinks,
  FooterLogo,
  FooterRule,
  FooterSection,
  FooterSocial,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Community & Events.
 *
 * A split: three upcoming events as hairline rows (a date tile, a title with
 * its facts, and a small outline "Register" button), and three community cards
 * (a social mark, a title with a line, and an arrow), a hairline, and the
 * legal bar (the logo, copyright, three legal links and five social marks).
 *
 * Desktop (Figma 1440): events 812 wide beside the 420 community column, 48px
 * apart. Tablet (768): events above, community cards below, both full width.
 * Mobile (360): the same stack; an event's Register button drops under its
 * copy.
 *
 * Motion: an event row tints `secondary` on hover (160ms); Register keeps its
 * own hover. A community card's border goes `border` to `foreground` and the
 * card lifts 2px (160ms), and its arrow slides 4px up and to the end (the
 * arrow is mirrored in Arabic, so it points up-left and slides up and left).
 * On touch the row and the card tint `secondary` for 120ms while pressed and
 * the arrow does not slide. Reduced motion keeps the colour and border change
 * and drops the lift and the slide.
 */

export interface FooterCommunityEvent {
  /** The month, as it reads on the tile. */
  month: string
  /** The day of the month. */
  day: string
  title: string
  /** The facts under the title, drawn with a small dot between them. */
  meta: string[]
  href?: string
}

export interface FooterCommunityCard {
  platform: SocialPlatform
  title: string
  /** The facts under the title, drawn with a small dot between them. */
  meta: string[]
  href?: string
}

export interface FooterCommunityEventsCopy {
  eventsLabel: string
  events: FooterCommunityEvent[]
  /** The Register button. */
  register: string
  communityLabel: string
  cards: FooterCommunityCard[]
  copyright: string
  legal: FooterLink[]
  legalLabel: string
}

const COPY: Record<FooterLocale, FooterCommunityEventsCopy> = {
  en: {
    eventsLabel: "Coming up",
    events: [
      { month: "SEP", day: "12", title: "Design tokens in production", meta: ["Online workshop", "16:00 CET"] },
      { month: "OCT", day: "03", title: "Fasla meetup — Example City", meta: ["123 Example Street", "Seats available"] },
      { month: "NOV", day: "21", title: "Arabic type on the web", meta: ["Online panel", "Free"] },
    ],
    register: "Register",
    communityLabel: "Join the community",
    cards: [
      { platform: "discord", title: "Community chat", meta: ["Members", "daily help channel"] },
      { platform: "github", title: "Repo discussions", meta: ["Roadmap, RFCs and issue triage"] },
      { platform: "medium", title: "Community blog", meta: ["Guest posts from the people using Fasla"] },
    ],
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Code of conduct"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal",
  },
  ar: {
    eventsLabel: "قريبًا",
    events: [
      { month: "سبتمبر", day: "12", title: "رموز التصميم في الإنتاج", meta: ["ورشة عمل أونلاين", "16:00 CET"] },
      { month: "أكتوبر", day: "03", title: "لقاء فاصلة، مدينة المثال", meta: ["123 شارع المثال", "المقاعد متاحة"] },
      { month: "نوفمبر", day: "21", title: "الخط العربي على الويب", meta: ["ندوة أونلاين", "مجانًا"] },
    ],
    register: "سجّل",
    communityLabel: "انضم إلى المجتمع",
    cards: [
      { platform: "discord", title: "دردشة المجتمع", meta: ["الأعضاء", "قناة مساعدة يومية"] },
      { platform: "github", title: "نقاشات المستودع", meta: ["خارطة الطريق وطلبات التعليق وفرز المشكلات"] },
      { platform: "medium", title: "مدونة المجتمع", meta: ["مقالات ضيوف من مستخدمي فاصلة"] },
    ],
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "مدونة السلوك"].map((label) => ({ label, href: "#" })),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerCommunityEventsCopy = COPY

export interface FooterCommunityEventsProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterCommunityEventsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks in the legal bar, in order. */
  socials?: SocialPlatform[]
  /** Called with the event when its Register button is pressed. */
  onRegister?: (event: FooterCommunityEvent) => void
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["discord", "github", "x", "linkedin", "youtube"]

/** Latin runs (times, zones, numbers) keep their own order inside Arabic text. */
function Bidi({ text, active }: { text: string; active: boolean }) {
  if (!active) return <>{text}</>
  return (
    <>
      {text.split(/([A-Za-z0-9+][A-Za-z0-9:.–@+/ ]*[A-Za-z0-9]|[A-Za-z0-9])/).map((part, i) =>
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

function Facts({ facts, active }: { facts: string[]; active: boolean }) {
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      {facts.map((fact, index) => (
        <React.Fragment key={`${fact}-${index}`}>
          {index > 0 ? <FooterDot /> : null}
          <span>
            <Bidi text={fact} active={active} />
          </span>
        </React.Fragment>
      ))}
    </span>
  )
}

export function FooterCommunityEvents({
  locale = "en",
  eventsLabel,
  events,
  register,
  communityLabel,
  cards,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  onRegister,
  className,
  ...props
}: FooterCommunityEventsProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const eventList = events ?? copy.events
  const cardList = cards ?? copy.cards
  const links = legal ?? copy.legal
  const eventsId = React.useId()
  const communityId = React.useId()
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-16", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      {eventList.length > 0 || cardList.length > 0 ? (
        <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:gap-12">
          {eventList.length > 0 ? (
            <nav aria-labelledby={eventsId} className="flex min-w-0 flex-col gap-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:flex-1 [@container(min-width:64rem)]:gap-5">
              <FooterColumnTitle id={eventsId} as="h2" className="text-muted-foreground">
                {eventsLabel ?? copy.eventsLabel}
              </FooterColumnTitle>
              <ul className="flex flex-col">
                {eventList.map((event) => (
                  <li
                    key={`${event.month}-${event.day}-${event.title}`}
                    className="flex flex-wrap items-center gap-3 border-b border-border py-2 transition-colors duration-[160ms] motion-reduce:transition-none [@container(min-width:40rem)]:flex-nowrap [@container(min-width:40rem)]:py-3 [@container(min-width:64rem)]:gap-4 hover:[@container(min-width:40rem)]:bg-secondary [@media(hover:none)]:duration-[120ms] active:[@media(hover:none)]:bg-secondary"
                  >
                    <div className="flex size-[52px] shrink-0 flex-col items-center justify-center rounded-md bg-secondary">
                      <span className="text-xs font-medium text-muted-foreground">{event.month}</span>
                      <span className="text-lg font-semibold text-secondary-foreground">{event.day}</span>
                    </div>
                    <div className="flex min-w-0 basis-[calc(100%-4rem)] flex-col gap-1 [@container(min-width:40rem)]:flex-1 [@container(min-width:40rem)]:basis-0">
                      <span className="text-base font-medium text-foreground">{event.title}</span>
                      <Facts facts={event.meta} active={ar} />
                    </div>
                    <Button variant="outline" size="xs" aria-label={`${register ?? copy.register}: ${event.title}`} onClick={() => onRegister?.(event)}>
                      {register ?? copy.register}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {cardList.length > 0 ? (
            <nav aria-labelledby={communityId} className="flex min-w-0 flex-col gap-3 [@container(min-width:64rem)]:w-[420px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:gap-4">
              <FooterColumnTitle id={communityId} as="h2" className="text-muted-foreground">
                {communityLabel ?? copy.communityLabel}
              </FooterColumnTitle>
              <ul className="flex flex-col gap-3 [@container(min-width:64rem)]:gap-4">
                {cardList.map((card) => (
                  <li key={card.title} className="flex">
                    <a
                      href={card.href ?? "#"}
                      className={cn(
                        "group/card flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-card p-3 [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:p-4",
                        "transition-[border-color,transform,background-color] duration-[160ms] motion-reduce:transition-none",
                        "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:border-foreground",
                        "hover:[@container(min-width:40rem)]:border-foreground hover:motion-safe:[@container(min-width:40rem)]:-translate-y-0.5",
                        "[@media(hover:none)]:duration-[120ms] active:[@media(hover:none)]:bg-secondary"
                      )}
                    >
                      <SocialIcon platform={card.platform} color="negative" className="size-6 shrink-0" />
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-sm font-semibold text-card-foreground">{card.title}</span>
                        <Facts facts={card.meta} active={ar} />
                      </span>
                      <ArrowUpRightIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-foreground transition-transform duration-[160ms] motion-reduce:transition-none rtl:-scale-x-100 group-hover/card:motion-safe:[@container(min-width:40rem)]:-translate-y-1 group-hover/card:motion-safe:[@container(min-width:40rem)]:translate-x-1 group-hover/card:motion-safe:rtl:[@container(min-width:40rem)]:-translate-x-1"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      ) : null}
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
