"use client"

import * as React from "react"
import { ArrowUpRight, CalendarDays, GraduationCap, Globe, Heart, Laptop, Plane } from "lucide-react"
import { buttonVariants, Button } from "../../ui/button/button"
import { CareersHeader, CareersSection, Figures, type CareersLocale } from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=Perks & Benefits.
 *
 * A header (an eyebrow line, the heading, a line under it), then a photo
 * beside six perks, and a footer with a note and an outline See open roles
 * button. A perk is a 32px `muted` square holding a 16px Lucide mark, its
 * title and a line on it.
 *
 * Desktop sets a 460 × 432 photo at the start and the perks two across at the
 * end. Tablet puts the photo above the perks at full width, still two across.
 * Mobile is one column. The footer's note and button share a row on Desktop
 * and Tablet and stack on Mobile. In Arabic the photo sits on the right.
 *
 * The block says what it offers and where to read more; it holds no state.
 *
 * Content limits: a perk's title up to 28 characters and its line up to 100.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface CareersPerk {
  /** Keys the perk. */
  id: string
  /** The perk's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
  /** The Lucide mark before it. */
  icon?: React.ElementType
}

export interface CareersPerksBenefitsCopy {
  /** The small line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The perks, in order. */
  perks: CareersPerk[]
  /** The note in the footer. */
  note: React.ReactNode
  /** The footer button's label. */
  seeRoles: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersPerksBenefitsCopy> = {
  en: {
    eyebrow: "Working at Fasla",
    heading: "Why people stay",
    description: "We would rather be honest about a short list than generous with a long one. These apply to everyone, from day one.",
    perks: [
      { id: "four-day-week", icon: CalendarDays, title: "A four-day week", description: "Thirty-two hours, full pay. Not a pilot. It is how we have worked since 2024." },
      { id: "remote-first", icon: Globe, title: "Remote-first, genuinely", description: "Work from anywhere in ±3 hours of CET. We fly everyone in one week a quarter." },
      { id: "learning", icon: GraduationCap, title: "€2,000 to learn", description: "Yearly, no approval needed. Conferences, courses, books, a coach: your call." },
      { id: "health", icon: Heart, title: "Health cover for family", description: "Private cover for you, a partner, and children, in every country we hire in." },
      { id: "time-off", icon: Plane, title: "Six weeks off", description: "Plus public holidays, and a two-week minimum we actually enforce." },
      { id: "hardware", icon: Laptop, title: "Hardware you choose", description: "Any laptop, any OS, replaced every three years. Home-office budget on top." },
    ],
    note: "Full policy details are in the handbook, which we share before your first interview.",
    seeRoles: "See open roles",
  },
  ar: {
    eyebrow: "العمل في فاصلة",
    heading: "لماذا يبقى الناس",
    description: "نفضّل الصدق بقائمة قصيرة على الكرم بقائمة طويلة. هذه تنطبق على الجميع، من اليوم الأول.",
    perks: [
      { id: "four-day-week", icon: CalendarDays, title: "أسبوع من أربعة أيام", description: "اثنتان وثلاثون ساعة بأجر كامل. ليست تجربة، فهكذا نعمل منذ 2024." },
      { id: "remote-first", icon: Globe, title: "العمل عن بُعد أولاً، فعلاً", description: "اعمل من أي مكان في نطاق ±3 ساعات من توقيت وسط أوروبا. نجمع الجميع أسبوعًا كل ربع." },
      { id: "learning", icon: GraduationCap, title: "2,000 يورو للتعلّم", description: "سنويًا، بلا موافقات. مؤتمرات ودورات وكتب ومدرّب: القرار لك." },
      { id: "health", icon: Heart, title: "تأمين صحي للعائلة", description: "تأمين خاص لك ولشريكك وأطفالك، في كل بلد نوظّف فيه." },
      { id: "time-off", icon: Plane, title: "ستة أسابيع إجازة", description: "بالإضافة إلى العطل الرسمية، وحد أدنى أسبوعين نلتزم به فعلاً." },
      { id: "hardware", icon: Laptop, title: "أجهزة من اختيارك", description: "أي حاسوب، أي نظام تشغيل، يُستبدل كل ثلاث سنوات. وميزانية مكتب منزلي إضافية." },
    ],
    note: "تفاصيل السياسة الكاملة في الدليل، الذي نشاركه قبل مقابلتك الأولى.",
    seeRoles: "عرض الوظائف المتاحة",
  },
}

export interface CareersPerksBenefitsPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface CareersPerksBenefitsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersPerksBenefitsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** The photo beside the perks. A `muted` placeholder shows without it. */
  photo?: CareersPerksBenefitsPhoto
  /** Where the footer button goes. Without it, the button calls `onSeeRoles`. */
  seeRolesHref?: string
  /** Called when the footer button is pressed and has no `seeRolesHref`. */
  onSeeRoles?: () => void
}

export function CareersPerksBenefits({
  locale = "en",
  eyebrow,
  heading,
  description,
  perks,
  note,
  seeRoles,
  photo,
  seeRolesHref,
  onSeeRoles,
  className,
  ...props
}: CareersPerksBenefitsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = perks ?? copy.perks
  const label = seeRoles ?? copy.seeRoles
  const arrow = <ArrowUpRight aria-hidden strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />

  return (
    <CareersSection labelledBy={headingId} className={className} {...props}>
      <CareersHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} />

      <div className="flex flex-col gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-12">
        <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-muted [@container(min-width:40rem)]:h-60 [@container(min-width:64rem)]:h-[27rem] [@container(min-width:64rem)]:w-[28.75rem] [@container(min-width:64rem)]:shrink-0">
          {photo ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" /> : null}
        </div>
        <ul className="grid min-w-0 flex-1 grid-cols-1 gap-x-8 gap-y-8 [@container(min-width:40rem)]:grid-cols-2">
          {list.map((perk) => {
            const Icon = perk.icon
            return (
              <li key={perk.id} className="flex flex-col items-start gap-4">
                {Icon ? (
                  <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Icon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                  </span>
                ) : null}
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    <Figures>{perk.title}</Figures>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <Figures>{perk.description}</Figures>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8">
        <p className="text-sm text-muted-foreground">{note ?? copy.note}</p>
        {seeRolesHref ? (
          <a href={seeRolesHref} className={buttonVariants({ variant: "outline", size: "md", className: "shrink-0 self-start" })}>
            <span>{label}</span>
            {arrow}
          </a>
        ) : (
          <Button type="button" variant="outline" size="md" onClick={onSeeRoles} className="shrink-0 self-start">
            <span>{label}</span>
            {arrow}
          </Button>
        )}
      </div>
    </CareersSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersPerksBenefitsCopy = COPY
