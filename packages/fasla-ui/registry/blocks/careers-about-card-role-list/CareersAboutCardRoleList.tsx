"use client"

import * as React from "react"
import { CalendarDays, Play } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import {
  CareersHeader,
  CareersMetaItem,
  CareersRoleAction,
  CareersSection,
  Figures,
  type CareersLocale,
  type CareersRole,
} from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=About Card + Role List.
 *
 * On a `muted` band: a header with a Soft badge above its heading, then an
 * About us card beside a list of roles. The card is a dash and its title, a
 * line about the team, a photo with a round play button over it, and an
 * outline Learn More button. A role is its title, its place, its pay and the
 * experience it asks for, with a solid Apply Now button at the end, ruled off
 * from the next by a hairline.
 *
 * Desktop sets the card 320px wide beside the list, the photo under the text.
 * Tablet puts the card above the list at full width, the photo at its start
 * and the text and button beside it. Mobile stacks everything: the photo,
 * the text, the button, and each role over its full-width Apply Now. In
 * Arabic the card sits on the right and each Apply Now at the left edge.
 *
 * The play button calls `onPlay`; the block draws no video of its own, and
 * does not autoplay anything.
 *
 * The band is `muted`, so the lines that are usually `muted-foreground` are
 * `foreground` here: the grey falls under 4.5:1 on it.
 *
 * Content limits: a role's title up to 27 characters, with its New badge.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface CareersAboutCardRole extends CareersRole {
  /** What the role asks for, such as "3+ years". */
  experience?: React.ReactNode
}

export interface CareersAboutCardPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface CareersAboutCardRoleListCopy {
  /** The small badge above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The card's title. */
  cardTitle: React.ReactNode
  /** The card's paragraph about the team. */
  cardBody: React.ReactNode
  /** The card's outline button. */
  learnMore: string
  /** Names the play button for assistive technology. */
  playLabel: string
  /** The roles, in order. */
  roles: CareersAboutCardRole[]
  /** The label of every role's button. */
  apply: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersAboutCardRoleListCopy> = {
  en: {
    eyebrow: "We are hiring",
    heading: "Open Positions",
    description: "Join a small team building the design system that product teams ship on.",
    cardTitle: "About us",
    cardBody: "Fasla is a small, remote-first team. We give people room to do their best work and the support to grow.",
    learnMore: "Learn More",
    playLabel: "Play the team video",
    roles: [
      { id: "product-designer", title: "Product Designer", location: "Remote (US)", pay: "$120K – $150K", experience: "3+ years" },
      { id: "support-specialist", title: "Support Specialist", location: "Remote (EU)", pay: "$65K – $85K", experience: "2+ years" },
      { id: "content-editor", title: "Content Editor", location: "London, UK", pay: "$75K – $95K", experience: "4+ years" },
      { id: "data-analyst", title: "Data Analyst", location: "Remote (Worldwide)", pay: "$110K – $140K", experience: "3+ years" },
    ],
    apply: "Apply Now",
  },
  ar: {
    eyebrow: "نوظّف الآن",
    heading: "الوظائف المتاحة",
    description: "انضم إلى فريق صغير يبني نظام التصميم الذي تُطلق به فرق المنتجات أعمالها.",
    cardTitle: "من نحن",
    cardBody: "فاصلة فريق صغير يعمل عن بُعد. نمنح كل شخص مساحة ليقدّم أفضل ما عنده، ودعمًا ليتطوّر.",
    learnMore: "اعرف المزيد",
    playLabel: "تشغيل فيديو الفريق",
    roles: [
      { id: "product-designer", title: "مصمم/ة منتجات", location: "عن بُعد من الولايات المتحدة", pay: "من 120 إلى 150 ألف دولار", experience: "3 سنوات فأكثر" },
      { id: "support-specialist", title: "أخصائي/ة دعم العملاء", location: "عن بُعد من الاتحاد الأوروبي", pay: "من 65 إلى 85 ألف دولار", experience: "سنتان فأكثر" },
      { id: "content-editor", title: "محرر/ة محتوى", location: "لندن، المملكة المتحدة", pay: "من 75 إلى 95 ألف دولار", experience: "4 سنوات فأكثر" },
      { id: "data-analyst", title: "محلل/ة بيانات", location: "عن بُعد من أي مكان في العالم", pay: "من 110 إلى 140 ألف دولار", experience: "3 سنوات فأكثر" },
    ],
    apply: "قدّم الآن",
  },
}

export interface CareersAboutCardRoleListProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersAboutCardRoleListCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** The card's photo. A `background` placeholder shows without it. */
  photo?: CareersAboutCardPhoto
  /** Called when the play button is pressed. */
  onPlay?: () => void
  /** Where the Learn More button goes. Without it, the button calls `onLearnMore`. */
  learnMoreHref?: string
  /** Called when Learn More is pressed and has no `learnMoreHref`. */
  onLearnMore?: () => void
  /** Called when a role without an `href` has its Apply Now button pressed. */
  onRoleSelect?: (role: CareersRole) => void
}

export function CareersAboutCardRoleList({
  locale = "en",
  eyebrow,
  heading,
  description,
  cardTitle,
  cardBody,
  learnMore,
  playLabel,
  roles,
  apply,
  photo,
  onPlay,
  learnMoreHref,
  onLearnMore,
  onRoleSelect,
  className,
  ...props
}: CareersAboutCardRoleListProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = roles ?? copy.roles
  const learn = learnMore ?? copy.learnMore

  return (
    <CareersSection labelledBy={headingId} className={cn("bg-muted", className)} {...props}>
      <CareersHeader
        headingId={headingId}
        eyebrow={eyebrow ?? copy.eyebrow}
        eyebrowBadge
        heading={heading ?? copy.heading}
        description={description ?? copy.description}
        className="[&>p:last-child]:text-foreground"
      />

      <div className="flex flex-col gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-12">
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-4 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm [@container(min-width:40rem)]:grid-cols-[16.375rem_minmax(0,1fr)] [@container(min-width:64rem)]:w-80 [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:grid-cols-1">
          <div className="flex items-center gap-3 [@container(min-width:40rem)]:col-start-2 [@container(min-width:64rem)]:col-start-1">
            <span aria-hidden className="h-px w-4 bg-foreground" />
            <h3 className="text-sm font-medium text-foreground">{cardTitle ?? copy.cardTitle}</h3>
          </div>
          <p className="text-sm text-muted-foreground [@container(min-width:40rem)]:col-start-2 [@container(min-width:64rem)]:col-start-1">{cardBody ?? copy.cardBody}</p>
          <div className="relative order-first aspect-[3/2] w-full overflow-hidden rounded-xl bg-background [@container(min-width:40rem)]:col-start-1 [@container(min-width:40rem)]:row-span-3 [@container(min-width:40rem)]:row-start-1 [@container(min-width:40rem)]:aspect-auto [@container(min-width:40rem)]:h-44 [@container(min-width:64rem)]:order-none [@container(min-width:64rem)]:row-auto [@container(min-width:64rem)]:row-span-1 [@container(min-width:64rem)]:aspect-[3/2] [@container(min-width:64rem)]:h-auto">
            {photo ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" /> : null}
            <Button
              type="button"
              variant="default"
              size="icon-lg"
              radius="rounded"
              aria-label={playLabel ?? copy.playLabel}
              onClick={onPlay}
              className="absolute inset-0 m-auto"
            >
              <Play aria-hidden strokeWidth={1.5} className="fill-current" />
            </Button>
          </div>
          {learnMoreHref ? (
            <a
              href={learnMoreHref}
              className={buttonVariants({ variant: "outline", size: "md", className: "w-fit [@container(min-width:40rem)]:col-start-2 [@container(min-width:64rem)]:col-start-1" })}
            >
              {learn}
            </a>
          ) : (
            <Button type="button" variant="outline" size="md" onClick={onLearnMore} className="w-fit [@container(min-width:40rem)]:col-start-2 [@container(min-width:64rem)]:col-start-1">
              {learn}
            </Button>
          )}
        </div>

        <ul className="flex min-w-0 flex-1 flex-col">
          {list.map((role) => (
            <li
              key={role.id}
              className="flex flex-col gap-4 border-b border-border py-6 first:pt-0 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="text-xl font-medium text-foreground">{role.title}</h3>
                {role.location ? <p className="text-sm text-foreground">{role.location}</p> : null}
                {role.pay ? (
                  <p className="text-sm text-foreground">
                    <Figures>{role.pay}</Figures>
                  </p>
                ) : null}
                {role.experience ? (
                  <CareersMetaItem icon={CalendarDays} className="text-foreground">
                    {role.experience}
                  </CareersMetaItem>
                ) : null}
              </div>
              <CareersRoleAction role={role} label={apply ?? copy.apply} variant="default" size="md" onSelect={onRoleSelect} className="w-full shrink-0 [@container(min-width:40rem)]:w-auto" />
            </li>
          ))}
        </ul>
      </div>
    </CareersSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersAboutCardRoleListCopy = COPY
