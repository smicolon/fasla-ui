"use client"

import * as React from "react"
import { ArrowRightIcon, MailIcon, MessageCircleIcon, PhoneIcon, SearchIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Input } from "../../ui/input/input"
import { FooterLegalBar, FooterRule, FooterSection, useFooterReveal, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Support & Contact. Motion chip: 41974:3871.
 *
 * A help footer: a centred title, a search field (Default Input, lg, rounded,
 * with a search icon) and six topic links; three channel cards (live chat, email,
 * the enterprise line) each with an icon, a title, a line, its availability and
 * a link with an arrow; a hairline; a short legal bar.
 *
 * Motion (the chip): the topic links come in on first view, 40ms apart. A channel
 * card lifts on hover: its shadow goes xs to md and it rises 2px, 160ms, and the
 * arrow slides 4px towards the end of the line (mirrored in Arabic: it points
 * left and slides left). On touch, hover becomes :active elevation and the arrow
 * does not slide. Reduced motion keeps the shadow change only and plays no entrance.
 * The search field's focus ring is the Input atom's own.
 *
 * Desktop (1440) sets the title at 2XL, the field 680px wide, the cards three
 * across. Tablet (768) makes the field fill the width and the cards 2-up. Mobile
 * (360) sets the title at XL and stacks the cards. In Arabic everything mirrors
 * by the page's `dir`.
 */

export interface FooterChannel {
  /** Which icon the card shows. */
  icon: "chat" | "email" | "phone"
  title: string
  description: string
  /** When it is answered: hours, or a promise. */
  availability: string
  /** The link's label. */
  action: string
  href: string
}

export interface FooterSupportContactCopy {
  /** The title above the search field. */
  title: string
  /** The field's placeholder (it also names the field). */
  placeholder: string
  /** The help topics under the field. Hidden when empty. */
  topics: FooterLink[]
  /** The accessible name of the topics. */
  topicsLabel: string
  /** The channel cards. */
  channels: FooterChannel[]
  /** The accessible name of the channels. */
  channelsLabel: string
  /** The copyright line. */
  copyright: string
  /** The legal links. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterSupportContactCopy> = {
  en: {
    title: "How can we help?",
    placeholder: "Search the help centre — tokens, RTL, billing…",
    topics: ["Getting started", "Design tokens", "RTL & Arabic", "Billing", "API keys", "Migration"].map((label) => ({ label, href: "#" })),
    topicsLabel: "Help topics",
    channels: [
      { icon: "chat", title: "Live chat", description: "Quick first replies from our team.", availability: "Mon–Fri, 09:00–18:00 CET", action: "Start a chat", href: "#" },
      { icon: "email", title: "Email support", description: "Attach a file or a design link and we'll take a look.", availability: "Replies within one business day", action: "you@company.com", href: "mailto:you@company.com" },
      { icon: "phone", title: "Enterprise line", description: "Dedicated engineer for Scale and Enterprise plans.", availability: "24/7 for Sev-1 incidents", action: "company.com/contact", href: "#" },
    ],
    channelsLabel: "Contact channels",
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Cookies", "Status"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal",
  },
  ar: {
    title: "كيف نساعدك؟",
    placeholder: "ابحث في مركز المساعدة: الرموز، RTL، الفوترة…",
    topics: ["البداية", "رموز التصميم", "RTL والعربية", "الفوترة", "مفاتيح API", "الترحيل"].map((label) => ({ label, href: "#" })),
    topicsLabel: "مواضيع المساعدة",
    channels: [
      { icon: "chat", title: "دردشة مباشرة", description: "ردود أولى سريعة من فريقنا.", availability: "الاثنين إلى الجمعة، 09:00 إلى 18:00 CET", action: "ابدأ دردشة", href: "#" },
      { icon: "email", title: "الدعم عبر البريد", description: "أرفق ملفًا أو رابط تصميم وسنلقي نظرة.", availability: "الرد خلال يوم عمل واحد", action: "you@company.com", href: "mailto:you@company.com" },
      { icon: "phone", title: "خط المؤسسات", description: "مهندس مخصص لعملاء المؤسسات والخطط الكبرى.", availability: "24/7 لحوادث Sev-1", action: "company.com/contact", href: "#" },
    ],
    channelsLabel: "قنوات التواصل",
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "الحالة"].map((label) => ({ label, href: "#" })),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerSupportContactCopy = COPY

export interface FooterSupportContactProps extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "title">, Partial<FooterSupportContactCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
}

const ICONS = { chat: MessageCircleIcon, email: MailIcon, phone: PhoneIcon }

/** Latin and digit runs inside Arabic text keep their own direction. */
const LATIN = /([A-Za-z0-9][A-Za-z0-9@.:/+_–-]*(?:\s[A-Za-z0-9][A-Za-z0-9@.:/+_–-]*)*)/g
function bidi(text: string, on: boolean): React.ReactNode {
  if (!on) return text
  return text.split(LATIN).map((part, index) =>
    index % 2 ? (
      <bdi key={index} dir="ltr">
        {part}
      </bdi>
    ) : (
      part
    )
  )
}

export function FooterSupportContact({ locale = "en", title, placeholder, topics, topicsLabel, channels, channelsLabel, copyright, legal, legalLabel, className, ...props }: FooterSupportContactProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const ref = React.useRef<HTMLElement>(null)
  // The topic links come in 40ms apart on first view; reduced motion plays nothing.
  useFooterReveal(ref, { selector: "[data-reveal]", stagger: 40, duration: 240, rise: 8, threshold: 0.15 })
  const heading = title ?? copy.title
  const field = placeholder ?? copy.placeholder
  const topicList = topics ?? copy.topics
  const cards = channels ?? copy.channels
  return (
    <FooterSection
      ref={ref}
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-16", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      <div className="flex flex-col items-center gap-3 [@container(min-width:64rem)]:gap-4">
        {heading ? <h2 className="text-center text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl">{heading}</h2> : null}
        <Input
          type="search"
          size="lg"
          radius="rounded"
          startIcon={<SearchIcon aria-hidden="true" />}
          aria-label={field}
          placeholder={field}
          className="w-full [@container(min-width:64rem)]:max-w-[680px]"
        />
        {topicList.length ? (
          <nav aria-label={topicsLabel ?? copy.topicsLabel}>
            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:64rem)]:gap-x-5">
              {topicList.map((topic) => (
                <li key={`${topic.label}-${topic.href}`} data-reveal="" className="flex">
                  <a
                    href={topic.href}
                    className="relative inline-flex items-center rounded-sm text-sm text-muted-foreground transition-colors duration-[120ms] motion-reduce:transition-none [outline:none] hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:text-foreground after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-['']"
                  >
                    {bidi(topic.label, ar)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
      {cards.length ? (
        <ul aria-label={channelsLabel ?? copy.channelsLabel} className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-3">
          {cards.map((card) => {
            const Icon = ICONS[card.icon]
            return (
              <li key={`${card.title}-${card.href}`} className="flex">
                <div className="group/card relative flex w-full flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xs transition-[box-shadow,transform] duration-[160ms] ease-out motion-reduce:transition-none motion-reduce:transform-none [@container(min-width:40rem)]:p-5 [@container(min-width:64rem)]:p-6 hover:[@container(min-width:40rem)]:shadow-md hover:motion-safe:[@container(min-width:40rem)]:-translate-y-0.5 active:shadow-md active:motion-safe:-translate-y-0.5">
                  <div className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3">
                    <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-secondary text-secondary-foreground">
                      <Icon className="size-[18px]" />
                    </span>
                    <h3 className="text-base font-semibold text-card-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{bidi(card.description, ar)}</p>
                    <p className="text-xs text-muted-foreground">{bidi(card.availability, ar)}</p>
                  </div>
                  <a
                    href={card.href}
                    className="inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-card-foreground [outline:none] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring after:absolute after:inset-0 after:rounded-xl after:content-['']"
                  >
                    <span>{bidi(card.action, ar)}</span>
                    <span
                      aria-hidden="true"
                      className="inline-flex shrink-0 transition-transform duration-[160ms] ease-out motion-reduce:transition-none group-hover/card:motion-safe:[@container(min-width:40rem)]:translate-x-1 group-hover/card:motion-safe:rtl:[@container(min-width:40rem)]:-translate-x-1"
                    >
                      <ArrowRightIcon className="size-3.5 rtl:-scale-x-100" />
                    </span>
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
      ) : null}
      <FooterRule />
      <FooterLegalBar copyright={copyright ?? copy.copyright} links={legal ?? copy.legal} label={legalLabel ?? copy.legalLabel} />
    </FooterSection>
  )
}
