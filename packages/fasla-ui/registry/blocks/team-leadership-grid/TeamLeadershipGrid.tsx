"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import { Reveal, TeamHeader, TeamPortrait, TeamSection, type TeamLocale, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Leadership Grid (Desktop LTR 41435:1079).
 *
 * Three leader cards under a header: a 300px portrait, then the name, the
 * role, a short bio and a Ghost "Read full bio" button.
 * Desktop sets the cards three to a row; Tablet two to a row, the third
 * card left alone at half width as Figma draws it (it does not stretch);
 * phones stack them. Cards in a row share the tallest one's height.
 *
 * Motion (motion card): the cards rise 12px and fade in once, 60ms apart,
 * from the start side. Hover lifts a card to `shadow-md` and nudges the
 * button's label 4px toward the end (the other way in Arabic);
 * a press scales the card to 0.99, which is what a phone gets.
 *
 * Mobile first: base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface TeamLeader extends TeamPerson {
  /** Passed to `onReadBio`, and the list key. */
  id: string
  /** The paragraph under the role. */
  bio: React.ReactNode
  /** Makes "Read full bio" a link instead of a button. */
  href?: string
}

export interface TeamLeadershipGridCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The label of every card's button. */
  readFullBio: React.ReactNode
  /** The leaders, in reading order. An empty list renders no cards. */
  people: TeamLeader[]
}

/**
 * Figma's copy, English and Arabic. Nadia Rahman's photo can't ship, so the
 * third card is Sofia Marchetti, with Nadia's bio under her own name.
 */
const COPY: Record<TeamLocale, TeamLeadershipGridCopy> = {
  en: {
    eyebrow: "LEADERSHIP",
    heading: "The people steering the system",
    description: "Fasla is built by a small group who have shipped design systems at scale before.",
    readFullBio: "Read full bio",
    people: [
      {
        id: "layla-mansour",
        name: "Layla Mansour",
        role: "Co-founder & Chief Executive",
        bio: "Layla started Fasla after a decade of watching good design systems die in handoff. She sets the product direction and still reviews every release note.",
      },
      {
        id: "karim-haddad",
        name: "Karim Haddad",
        role: "Co-founder & Chief Technology",
        bio: "Karim owns the platform that turns tokens into shipped code. Previously he led front-end infrastructure for a design tooling company.",
      },
      {
        id: "sofia-marchetti",
        name: "Sofia Marchetti",
        role: "Brand Designer",
        bio: "Sofia shapes how Fasla looks and sounds. She drew the first version of the component library's visual language and keeps its rules honest.",
      },
    ],
  },
  ar: {
    eyebrow: "القيادة",
    heading: "الفريق الذي يقود النظام",
    description: "يبني فاصلة فريق صغير سبق له إطلاق أنظمة تصميم على نطاق واسع.",
    readFullBio: "السيرة الكاملة",
    people: [
      {
        id: "layla-mansour",
        name: "ليلى منصور",
        role: "شريكة مؤسِّسة والرئيسة التنفيذية",
        bio: "أنشأت ليلى فاصلة بعد عشر سنوات من مشاهدة أنظمة تصميم جيدة تموت عند التسليم. تحدّد اتجاه المنتج ولا تزال تراجع كل ملاحظات الإصدار.",
      },
      {
        id: "karim-haddad",
        name: "كريم حداد",
        role: "شريك مؤسِّس ورئيس التقنية",
        bio: "يدير كريم المنصة التي تحوّل الرموز التصميمية إلى كود منشور. قاد سابقًا بنية الواجهات الأمامية في شركة أدوات تصميم.",
      },
      {
        id: "sofia-marchetti",
        name: "صوفيا ماركيتي",
        role: "مصمِّمة هوية",
        bio: "تصوغ صوفيا هوية فاصلة البصرية. رسمت اللغة البصرية لأول نسخة من مكتبة المكوّنات وتحافظ على صدق قواعدها.",
      },
    ],
  },
}

export interface TeamLeadershipGridProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<TeamLeadershipGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: TeamLocale
  /** Called with the leader's `id` when a button without an `href` is pressed. */
  onReadBio?: (id: string) => void
}

export function TeamLeadershipGrid({
  locale = "en",
  eyebrow,
  heading,
  description,
  readFullBio,
  people,
  onReadBio,
  className,
  ...props
}: TeamLeadershipGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = people ?? copy.people
  const label = readFullBio ?? copy.readFullBio

  return (
    <TeamSection labelledBy={headingId} className={className} {...props}>
      <TeamHeader
        headingId={headingId}
        eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow}
        heading={heading ?? copy.heading}
        description={description === undefined ? copy.description : description}
      />
      {list.length > 0 ? (
        <ul className="grid w-full grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:grid-cols-3">
          {list.map((person, index) => {
            const content = (
              <span className="inline-flex items-center gap-1.5 motion-safe:transition-transform motion-safe:duration-200 group-hover/card:translate-x-1 group-focus-within/card:translate-x-1 rtl:group-hover/card:-translate-x-1 rtl:group-focus-within/card:-translate-x-1">
                {label}
              </span>
            )
            return (
              <Reveal key={person.id} as="li" index={index} className="flex">
                <article
                  className={cn(
                    "group/card flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card",
                    "motion-safe:transition-[box-shadow,transform] motion-safe:duration-200 active:motion-safe:scale-[0.99] hover:shadow-md"
                  )}
                >
                  <TeamPortrait person={person} className="h-[18.75rem] shrink-0" />
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{person.role}</p>
                    <p className="text-sm text-muted-foreground">{person.bio}</p>
                    <div className="mt-auto pt-2">
                      {person.href ? (
                        <a href={person.href} className={buttonVariants({ variant: "ghost", tone: "primary", size: "sm" })}>
                          {content}
                        </a>
                      ) : (
                        <Button variant="ghost" tone="primary" size="sm" onClick={() => onReadBio?.(person.id)}>
                          {content}
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      ) : null}
    </TeamSection>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const teamLeadershipGridCopy = COPY
