"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Carousel, CarouselContent, CarouselDots, CarouselItem, useCarousel } from "../../ui/carousel/carousel"
import { Reveal, TeamHeader, TeamLinkArrow, TeamPortrait, TeamSection, type TeamLocale, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Team Carousel (named Member Carousel here:
 * code names do not carry the block name).
 *
 * A header (eyebrow and heading, with the previous and next arrow buttons at
 * the end of the line), a rail of five portrait cards and the dots beneath it.
 * Each card is a `secondary` panel: the name and role with a link arrow above,
 * the portrait below. The rail is the Carousel atom: swipe, drag, the arrows
 * and the arrow keys step it one card at a time, 320ms ease-out is the atom's
 * own smooth scroll, and reduced motion is honoured by its CSS. Cards are
 * Figma's 280px wide with 24px between, so the peek is what is left over:
 * about 4.5 cards on Desktop, 2.4 on Tablet, 1.15 on Mobile. Nothing autoplays
 * and nothing follows the scroll position.
 *
 * Desktop and Tablet put the two arrows at the end of the header; on Mobile
 * they sit under the copy. The dots are the atom's: one for each view the
 * track can reach, so a wide viewport that already shows most cards has fewer
 * dots than cards (Figma draws four).
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet.
 */

export interface TeamMemberCarouselPerson extends TeamPerson {
  /** Makes the whole card a link, as the arrow in its corner promises. */
  href?: string
}

export interface TeamMemberCarouselCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The five people, in reading order. */
  people: TeamMemberCarouselPerson[]
  /** The accessible names of the two arrow buttons and of the carousel. */
  labels: { previous: string; next: string; carousel: string }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<TeamLocale, TeamMemberCarouselCopy> = {
  en: {
    eyebrow: "DESIGN",
    heading: "The people who draw the system",
    people: [
      { name: "Omar Nasser", role: "Head of Product" },
      { name: "Lukas Berg", role: "Design Systems Lead" },
      { name: "Elena Novak", role: "Staff Product Designer" },
      { name: "Sofia Marchetti", role: "Brand Designer" },
      { name: "Hana Kobayashi", role: "Motion Designer" },
    ],
    labels: { previous: "Previous member", next: "Next member", carousel: "Team members" },
  },
  ar: {
    eyebrow: "التصميم",
    heading: "الفريق الذي يرسم النظام",
    people: [
      { name: "عمر ناصر", role: "رئيس المنتج" },
      { name: "لوكاس بيرغ", role: "قائد أنظمة التصميم" },
      { name: "إيلينا نوفاك", role: "مصمِّمة منتجات أولى" },
      { name: "صوفيا ماركيتي", role: "مصمِّمة هوية" },
      { name: "هانا كوباياشي", role: "مصمِّمة حركة" },
    ],
    labels: { previous: "العضو السابق", next: "العضو التالي", carousel: "أعضاء الفريق" },
  },
}

export interface TeamMemberCarouselProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<TeamMemberCarouselCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: TeamLocale
}

/** The two arrow buttons. They read the carousel, so they live inside it. */
function Controls({ labels }: { labels: TeamMemberCarouselCopy["labels"] }) {
  const { activeIndex, lastIndex, scrollTo } = useCarousel()
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="outline"
        tone="secondary"
        size="icon-md"
        radius="rounded"
        aria-label={labels.previous}
        disabled={activeIndex <= 0}
        onClick={() => scrollTo(activeIndex - 1)}
      >
        <ArrowLeft aria-hidden className="rtl:-scale-x-100" />
      </Button>
      <Button
        variant="outline"
        tone="secondary"
        size="icon-md"
        radius="rounded"
        aria-label={labels.next}
        disabled={activeIndex >= lastIndex}
        onClick={() => scrollTo(activeIndex + 1)}
      >
        <ArrowRight aria-hidden className="rtl:-scale-x-100" />
      </Button>
    </div>
  )
}

function MemberCard({ person }: { person: TeamMemberCarouselPerson }) {
  const Tag = person.href ? "a" : "div"
  return (
    <Tag
      {...(person.href ? { href: person.href } : {})}
      className={cn(
        "group/card flex w-full flex-col gap-4 rounded-xl bg-secondary p-4 text-start",
        "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:motion-safe:-translate-y-1 focus-within:motion-safe:-translate-y-1"
      )}
    >
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-base font-medium text-foreground">{person.name}</span>
          <span className="text-sm text-muted-foreground">{person.role}</span>
        </div>
        <TeamLinkArrow className="mt-0.5 size-[18px] text-muted-foreground" />
      </div>
      <TeamPortrait person={person} className="aspect-[248/300] w-full rounded-lg" />
    </Tag>
  )
}

/** A header with two arrow buttons, a rail of portrait cards and the dots. */
export function TeamMemberCarousel({ locale = "en", eyebrow, heading, people, labels, className, ...props }: TeamMemberCarouselProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = (people ?? copy.people).slice(0, 5)
  const names = labels ?? copy.labels

  return (
    <TeamSection labelledBy={headingId} className={className} contentClassName="gap-0" {...props}>
      <Carousel aria-label={names.carousel} className="flex flex-col gap-16">
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-end [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8">
          <TeamHeader
            headingId={headingId}
            eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow}
            heading={heading ?? copy.heading}
            className="min-w-0 flex-1"
          />
          {list.length > 0 ? <Controls labels={names} /> : null}
        </div>
        {list.length > 0 ? (
          <>
            {/* The track is a scroller: the vertical padding gives a lifted card room to rise. */}
            <CarouselContent className="-my-1 gap-6 py-1">
              {list.map((person, index) => (
                <CarouselItem key={index} className="w-[280px] basis-auto">
                  <Reveal index={index + 3} className="h-full">
                    <MemberCard person={person} />
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselDots className="pt-4" />
          </>
        ) : null}
      </Carousel>
    </TeamSection>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const teamMemberCarouselCopy = COPY
