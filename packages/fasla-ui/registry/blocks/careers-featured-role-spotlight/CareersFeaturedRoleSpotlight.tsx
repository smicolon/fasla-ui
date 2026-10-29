"use client"

import * as React from "react"
import { ArrowUpRight, Share2 } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import {
  CareersRoleAction,
  CareersRule,
  CareersSection,
  Figures,
  type CareersLocale,
  type CareersRole,
} from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=Featured Role Spotlight.
 *
 * One role, given the room. On the start side: a small "Featured role" line,
 * the role's title with its team under it in `muted-foreground`, what the
 * role is, four small tiles (salary, place, commitment, team), and two
 * buttons, a solid Apply for this role and an outline Share role. On the end
 * side, a photo. Under a hairline: "Also hiring in Design" and the team's
 * other roles as two linked cards.
 *
 * Desktop sets the text beside a 480 × 520 photo, the tiles four across.
 * Tablet puts the photo under the buttons at full width, the tiles two by
 * two, the other roles two across. Mobile is the same in one column, the
 * other roles stacked. In Arabic the photo sits at the left.
 *
 * Share role really shares: it opens the device's share sheet where there is
 * one, and copies the link where there is not, then says so. Pass `onShare` to
 * do it your own way as well.
 *
 * Content limits: a role's title up to 27 characters. The other limits are in
 * the block's documentation page, which the default copy stays inside.
 */

export interface CareersFeaturedRole extends CareersRole {
  /** The team's name in the tile, such as "Design Systems". */
  team?: string
}

export interface CareersFeaturedRoleSpotlightCopy {
  /** The small line above the title. */
  eyebrow: React.ReactNode
  /** The role in the spotlight: its title, summary, pay, place, commitment, team and link. */
  featured: CareersFeaturedRole
  /** The line under the title, such as "Design Systems team". */
  teamLine: React.ReactNode
  /** The four tiles' labels: salary, place, commitment, team. */
  factLabels: [string, string, string, string]
  /** The solid button's label. */
  apply: string
  /** The outline button's label. */
  share: string
  /** Said once the link has been copied. */
  copied: string
  /** The line before the other roles, such as "Also hiring in Design". */
  alsoHiring: React.ReactNode
  /** The team's other roles. */
  others: CareersRole[]
  /** What separates a card's place from its commitment. */
  separator: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersFeaturedRoleSpotlightCopy> = {
  en: {
    eyebrow: "Featured role",
    featured: {
      id: "senior-product-designer",
      title: "Senior Product Designer",
      summary:
        "You'll own the design-system surface end to end: the token model, the component anatomy, and the documentation that makes both usable by 40 engineers. It is the most leveraged design role we have.",
      pay: "$95K–$120K",
      location: "Remote (EU)",
      commitment: "Full-time",
      team: "Design Systems",
    },
    teamLine: "Design Systems team",
    factLabels: ["Salary", "Location", "Commitment", "Team"],
    apply: "Apply for this role",
    share: "Share role",
    copied: "Link copied",
    alsoHiring: "Also hiring in Design",
    others: [
      { id: "motion-designer", title: "Motion Designer", location: "Remote", commitment: "Contract" },
      { id: "design-ops-lead", title: "Design Ops Lead", location: "Amman", commitment: "Full-time" },
    ],
    separator: " · ",
  },
  ar: {
    eyebrow: "وظيفة مميزة",
    featured: {
      id: "senior-product-designer",
      title: "مصمم/ة منتجات أول",
      summary:
        "تملّك واجهة نظام التصميم من البداية إلى النهاية: نموذج الرموز وتشريح المكوّنات والتوثيق الذي يجعل الاثنين قابلين للاستخدام من قِبل 40 مهندسًا. إنها أكثر وظائف التصميم تأثيرًا لدينا.",
      // Figma's form, 16 characters: the tile is narrow, so the pay must fit on one line (limit 19).
      pay: "95–120 ألف دولار",
      location: "عن بُعد (الاتحاد الأوروبي)",
      commitment: "دوام كامل",
      team: "أنظمة التصميم",
    },
    teamLine: "فريق أنظمة التصميم",
    factLabels: ["الراتب", "الموقع", "الالتزام", "الفريق"],
    apply: "قدّم على هذه الوظيفة",
    share: "شارك الوظيفة",
    copied: "تم نسخ الرابط",
    alsoHiring: "نوظّف أيضًا في التصميم",
    others: [
      { id: "design-ops-lead", title: "قائد/ة عمليات التصميم", location: "عمّان", commitment: "دوام كامل" },
      { id: "motion-designer", title: "مصمم/ة حركة", location: "عن بُعد", commitment: "عقد" },
    ],
    separator: "، ",
  },
}

export interface CareersFeaturedRoleSpotlightPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface CareersFeaturedRoleSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersFeaturedRoleSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** The photo beside the text. A `muted` placeholder shows without it. */
  photo?: CareersFeaturedRoleSpotlightPhoto
  /** The link Share role shares. Defaults to the page's own address. */
  shareUrl?: string
  /** Called when Share role is pressed, besides sharing. */
  onShare?: (role: CareersRole) => void
  /** Called when a role without an `href` has its button or card pressed. */
  onRoleSelect?: (role: CareersRole) => void
}

/** A tile: a small label over a value. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-border bg-card p-3 text-card-foreground">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">
        <Figures>{children}</Figures>
      </dd>
    </div>
  )
}

const CARD =
  "flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 text-start text-card-foreground transition-colors hover:bg-accent motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function CareersFeaturedRoleSpotlight({
  locale = "en",
  eyebrow,
  featured: featuredProp,
  teamLine,
  factLabels,
  apply,
  share,
  copied,
  alsoHiring,
  others,
  separator,
  photo,
  shareUrl,
  onShare,
  onRoleSelect,
  className,
  ...props
}: CareersFeaturedRoleSpotlightProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const featured = featuredProp ?? copy.featured
  const labels = factLabels ?? copy.factLabels
  const list = others ?? copy.others
  const [isCopied, setIsCopied] = React.useState(false)

  const shareRole = async () => {
    onShare?.(featured)
    const url = shareUrl ?? (typeof window === "undefined" ? "" : window.location.href)
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: typeof featured.title === "string" ? featured.title : undefined, url })
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        setIsCopied(true)
      }
    } catch {
      // Closing the share sheet rejects; nothing went wrong.
    }
  }

  return (
    <CareersSection labelledBy={headingId} className={className} {...props}>
      <div className="grid grid-cols-1 gap-8 [@container(min-width:64rem)]:grid-cols-[minmax(0,1fr)_30rem] [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-12">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <p className="text-sm font-medium text-muted-foreground">{eyebrow ?? copy.eyebrow}</p>
          <h2 id={headingId} className="max-w-[28rem] text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl">
            <span className="block">{featured.title}</span>
            <span className="block text-muted-foreground">{teamLine ?? copy.teamLine}</span>
          </h2>
          {featured.summary ? <p className="max-w-[560px] text-lg text-muted-foreground">{featured.summary}</p> : null}
          <dl className="grid w-full grid-cols-2 gap-3 [@container(min-width:64rem)]:max-w-[40rem] [@container(min-width:64rem)]:grid-cols-4">
            <Fact label={labels[0]}>{featured.pay}</Fact>
            <Fact label={labels[1]}>{featured.location}</Fact>
            <Fact label={labels[2]}>{featured.commitment}</Fact>
            <Fact label={labels[3]}>{featured.team}</Fact>
          </dl>
          <div className="flex flex-wrap items-center gap-3">
            <CareersRoleAction role={featured} label={apply ?? copy.apply} variant="default" size="md" arrow onSelect={onRoleSelect} />
            <Button type="button" variant="outline" size="md" onClick={shareRole}>
              <Share2 aria-hidden strokeWidth={1.5} />
              <span>{share ?? copy.share}</span>
            </Button>
            <p role="status" className="text-sm text-muted-foreground">
              {isCopied ? (copied ?? copy.copied) : null}
            </p>
          </div>
        </div>

        <div className="relative h-60 overflow-hidden rounded-2xl bg-muted [@container(min-width:40rem)]:h-[16.5rem] [@container(min-width:64rem)]:h-[32.5rem]">
          {photo ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" /> : null}
        </div>
      </div>

      <CareersRule />

      <div className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-10">
        <p className="shrink-0 text-sm text-muted-foreground [@container(min-width:64rem)]:w-40">{alsoHiring ?? copy.alsoHiring}</p>
        <ul className="grid min-w-0 flex-1 grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2">
          {list.map((other) => {
            const body = (
              <>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">{other.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {[other.location, other.commitment].filter(Boolean).join(separator ?? copy.separator)}
                  </span>
                </span>
                <ArrowUpRight aria-hidden strokeWidth={1.5} className={cn("size-4 shrink-0 text-muted-foreground [&:dir(rtl)]:-scale-x-100")} />
              </>
            )
            return (
              <li key={other.id}>
                {other.href ? (
                  <a href={other.href} className={CARD}>
                    {body}
                  </a>
                ) : (
                  <button type="button" onClick={() => onRoleSelect?.(other)} className={CARD}>
                    {body}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </CareersSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersFeaturedRoleSpotlightCopy = COPY
