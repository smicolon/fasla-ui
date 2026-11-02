"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { SocialIcon } from "../../ui/social-icons/social-icons"
import { FOOTER_FORM_COPY, FooterLegalLinks, FooterRule, FooterSection, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Docs Page.
 *
 * The foot of a documentation page: a "Was this page helpful?" row (Yes and No
 * outline buttons) with an "Edit this page in the repo" link at the other end,
 * a hairline, two pager cards (Previous and Next, each with a chevron, a small
 * label and the page title), and a meta row (three contributor avatars with a
 * "Last updated" line, and three links). No logo and no legal bar.
 *
 * Desktop (Figma 1440): everything is one row per band, the pager cards 632
 * wide with 16px between. Tablet (768): the same, the vote row on one line and
 * two cards side by side. Mobile (360): the vote row stacks (the prompt over
 * two full-width buttons, then the edit link), the pager cards stack with
 * Previous above Next, and the meta row stacks. On Mobile the Next card draws
 * its chevron first, as Figma does.
 *
 * Motion: pressing Yes or No makes the pressed button the Button's `default`
 * variant (its own fill change), disables both, and cross-fades the prompt to
 * the thank-you line (200ms; the line holds the prompt's room, so nothing
 * moves). A pager card's border goes `border` to `foreground` (160ms) and its
 * chevron slides 4px toward the card's outer edge (in Arabic the cards swap
 * sides and the chevrons are mirrored, so each still slides outward). On touch
 * the card tints `secondary` for 120ms while pressed and the chevron stays.
 * The edit link underlines on hover only. Reduced motion swaps the prompt at
 * once and keeps the border change.
 */

export interface FooterDocsPagerLink {
  /** "Previous" or "Next". */
  kicker: string
  title: string
  href?: string
}

export interface FooterDocsContributor {
  /** The person's name; the avatar shows its initials. */
  name: string
}

export interface FooterDocsPageCopy {
  prompt: string
  yes: string
  no: string
  /** The line the prompt becomes once a vote is in. */
  thanks: string
  editLabel: string
  pagerLabel: string
  previous: FooterDocsPagerLink
  next: FooterDocsPagerLink
  contributorsLabel: string
  contributors: FooterDocsContributor[]
  updated: string
  links: FooterLink[]
  linksLabel: string
}

const COPY: Record<FooterLocale, FooterDocsPageCopy> = {
  en: {
    prompt: "Was this page helpful?",
    yes: "Yes",
    no: "No",
    thanks: FOOTER_FORM_COPY.en.docsThanks,
    editLabel: "Edit this page in the repo",
    pagerLabel: "Previous and next pages",
    previous: { kicker: "Previous", title: "Design tokens" },
    next: { kicker: "Next", title: "Theming and dark mode" },
    contributorsLabel: "Contributors",
    contributors: [{ name: "Kai Nolan" }, { name: "Rin Marsh" }, { name: "Lee Hart" }],
    updated: "Last updated 14 August 2026 by 3 contributors",
    links: ["Report an issue", "Request a change", "Style guide"].map((label) => ({ label, href: "#" })),
    linksLabel: "About this page",
  },
  ar: {
    prompt: "هل كانت هذه الصفحة مفيدة؟",
    yes: "نعم",
    no: "لا",
    thanks: FOOTER_FORM_COPY.ar.docsThanks,
    editLabel: "حرّر هذه الصفحة في المستودع",
    pagerLabel: "الصفحة السابقة والتالية",
    previous: { kicker: "السابق", title: "رموز التصميم" },
    next: { kicker: "التالي", title: "الثيمات والوضع الداكن" },
    contributorsLabel: "المساهمون",
    contributors: [{ name: "كمال نبيل" }, { name: "رامي منير" }, { name: "ليلى حسن" }],
    updated: "آخر تحديث 14 أغسطس 2026 بواسطة 3 مساهمين",
    links: ["الإبلاغ عن مشكلة", "اطلب تعديلًا", "دليل الأسلوب"].map((label) => ({ label, href: "#" })),
    linksLabel: "حول هذه الصفحة",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerDocsPageCopy = COPY

export type FooterDocsVote = "yes" | "no"

export interface FooterDocsPageProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterDocsPageCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** Where the edit link goes. */
  editHref?: string
  /** Starts the block with a vote already in, for a story or a test. */
  defaultVote?: FooterDocsVote
  /** Called once, with the vote. */
  onVote?: (vote: FooterDocsVote) => void
}

/** Latin runs (dates, numbers) keep their own order inside Arabic text. */
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

const CARD =
  "group/card flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-card p-3 [@container(min-width:40rem)]:gap-3 [@container(min-width:40rem)]:p-4 [@container(min-width:64rem)]:p-5 " +
  "transition-[border-color,background-color] duration-[160ms] motion-reduce:transition-none [outline:none] focus-visible:border-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
  "hover:[@container(min-width:40rem)]:border-foreground [@media(hover:none)]:duration-[120ms] active:[@media(hover:none)]:bg-secondary"

export function FooterDocsPage({
  locale = "en",
  prompt,
  yes,
  no,
  thanks,
  editLabel,
  pagerLabel,
  previous,
  next,
  contributorsLabel,
  contributors,
  updated,
  links,
  linksLabel,
  editHref,
  defaultVote,
  onVote,
  className,
  ...props
}: FooterDocsPageProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const [vote, setVote] = React.useState<FooterDocsVote | undefined>(defaultVote)
  const voted = vote !== undefined
  const prev = previous ?? copy.previous
  const nxt = next ?? copy.next
  const people = contributors ?? copy.contributors
  const docLinks = links ?? copy.links
  const choose = (value: FooterDocsVote) => {
    if (voted) return
    setVote(value)
    onVote?.(value)
  }
  const updatedText = updated ?? copy.updated
  return (
    <FooterSection
      className={cn("py-8 md:py-16 lg:pb-10 lg:pt-12", className)}
      contentClassName="gap-4 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:gap-8"
      {...props}
    >
      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="grid">
          <div
            aria-hidden={voted ? true : undefined}
            className={cn(
              "col-start-1 row-start-1 flex flex-col gap-2 transition-opacity duration-200 ease-out motion-reduce:transition-none [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:gap-4",
              voted && "opacity-0"
            )}
          >
            <p className="text-sm font-medium text-foreground">{prompt ?? copy.prompt}</p>
            <div role="group" aria-label={prompt ?? copy.prompt} className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:gap-4">
              <Button type="button" size="sm" variant={vote === "yes" ? "default" : "outline"} disabled={voted} aria-pressed={vote === "yes"} onClick={() => choose("yes")} className="w-full [@container(min-width:40rem)]:w-auto">
                {yes ?? copy.yes}
              </Button>
              <Button type="button" size="sm" variant={vote === "no" ? "default" : "outline"} disabled={voted} aria-pressed={vote === "no"} onClick={() => choose("no")} className="w-full [@container(min-width:40rem)]:w-auto">
                {no ?? copy.no}
              </Button>
            </div>
          </div>
          <p
            role="status"
            className={cn(
              "pointer-events-none col-start-1 row-start-1 flex items-center text-sm font-medium text-foreground transition-opacity duration-200 ease-out motion-reduce:transition-none",
              voted ? "opacity-100" : "opacity-0"
            )}
          >
            {voted ? (thanks ?? copy.thanks) : null}
          </p>
        </div>
        <a
          href={editHref ?? "#"}
          className="relative inline-flex items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors duration-[120ms] motion-reduce:transition-none [outline:none] hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-['']"
        >
          <SocialIcon platform="github" color="negative" className="size-4 shrink-0" />
          {editLabel ?? copy.editLabel}
        </a>
      </div>
      <FooterRule />
      <nav aria-label={pagerLabel ?? copy.pagerLabel} className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:64rem)]:gap-4">
        <a href={prev.href ?? "#"} rel="prev" className={CARD}>
          <ChevronLeftIcon
            aria-hidden="true"
            className="size-[18px] shrink-0 text-foreground transition-transform duration-[160ms] motion-reduce:transition-none rtl:-scale-x-100 group-hover/card:motion-safe:[@container(min-width:40rem)]:-translate-x-1 group-hover/card:motion-safe:rtl:[@container(min-width:40rem)]:translate-x-1"
          />
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-xs text-muted-foreground">{prev.kicker}</span>
            <span className="text-base font-medium text-card-foreground">{prev.title}</span>
          </span>
        </a>
        <a href={nxt.href ?? "#"} rel="next" className={CARD}>
          <span className="flex min-w-0 flex-1 flex-col gap-1 text-start [@container(min-width:40rem)]:text-end">
            <span className="text-xs text-muted-foreground">{nxt.kicker}</span>
            <span className="text-base font-medium text-card-foreground">{nxt.title}</span>
          </span>
          <ChevronRightIcon
            aria-hidden="true"
            className="order-first size-[18px] shrink-0 text-foreground transition-transform duration-[160ms] motion-reduce:transition-none rtl:-scale-x-100 group-hover/card:motion-safe:[@container(min-width:40rem)]:translate-x-1 group-hover/card:motion-safe:rtl:[@container(min-width:40rem)]:-translate-x-1 [@container(min-width:40rem)]:order-last"
          />
        </a>
      </nav>
      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
        <div className="flex flex-wrap items-center gap-2">
          {people.length > 0 ? (
            <ul aria-label={contributorsLabel ?? copy.contributorsLabel} className="flex items-center gap-2">
              {people.map((person) => (
                <li key={person.name} className="flex">
                  <Avatar variant="initials" size="32" radius="rounded" border name={person.name} />
                </li>
              ))}
            </ul>
          ) : null}
          {updatedText ? (
            <p className="text-xs text-muted-foreground">
              <Bidi text={updatedText} active={ar} />
            </p>
          ) : null}
        </div>
        {docLinks.length ? <FooterLegalLinks links={docLinks} label={linksLabel ?? copy.linksLabel} /> : null}
      </div>
    </FooterSection>
  )
}
