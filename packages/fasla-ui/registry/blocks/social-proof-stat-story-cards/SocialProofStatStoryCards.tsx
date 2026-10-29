"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import { Avatar } from "../../ui/avatar/avatar"
import { CarouselDots } from "../../ui/carousel/carousel"
import {
  Isolated,
  SocialProofHeader,
  SocialProofQuote,
  SocialProofSection,
  stepKeys,
  useStepper,
  useSwipeStep,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Stat-Story Cards.
 *
 * A centred header over three story cards, each tinted: the author (Avatar
 * at 44px, name, role and company), the quote beside a large figure with its
 * label, and a `Read the full story` outline button. Three dots under the
 * cards page between three sets of three. Desktop sets the cards three
 * across, the quote and figure side by side; Tablet and Mobile stack them,
 * the figure under the quote.
 *
 * Motion (Figma's ⚡ Motion note): the dots page between the sets. Manual
 * only, no autoplay. On select the outgoing cards fade out (180ms) and the
 * new cards slide up 10px with a fade (slideUp), 60ms apart (stagger). The
 * active dot stretches to a pill. Keyboard: the arrow keys, Home and End move
 * between dots. Reduced motion: opacity only, 120ms. In RTL the first page is
 * the rightmost dot.
 *
 * Figma shows the first set. The other two are the stat stories the same
 * people give elsewhere in the set: Bader Al-Ghamdi's, Majed Nouri's and
 * Fahad Salem's on the second, and Bader's, Majed's and Omar Haddad's on the
 * third, so Bader and Majed appear on both.
 */

export interface SocialProofStatStory {
  author: SocialProofPerson
  /** Up to 154 characters in English, 136 in Arabic. */
  quote: React.ReactNode
  /** Up to 5 characters in English, 9 in Arabic: `41%`, `30h`, `2.1×`. */
  stat: string
  /** Up to 60 characters in English, 56 in Arabic. */
  statLabel: React.ReactNode
}

export interface SocialProofStatStoryCardsCopy {
  /** Up to 46 characters in English, 40 in Arabic. */
  heading: React.ReactNode
  /** Up to 128 characters in English, 125 in Arabic. */
  description: React.ReactNode
  /** Up to 25 characters in English, 26 in Arabic. */
  link: React.ReactNode
  /** Names the dots for assistive tech. */
  label: string
  /** The sets, in order: three of three stories. */
  pages: SocialProofStatStory[][]
}

const p = (id: string, name: string, role: string): SocialProofPerson => ({ id, name, role })

const COPY: Record<SocialProofLocale, SocialProofStatStoryCardsCopy> = {
  en: {
    heading: "Trusted by top performers",
    description: "Stories with the receipts attached.",
    link: "Read the full story",
    label: "Story sets",
    pages: [
      [
        { author: p("ziad-karam", "Ziad Karam", "CEO · Quillfield"), quote: "“I underestimated how much slow UI was costing us until the numbers came in.”", stat: "41%", statLabel: "faster weekly release cadence" },
        { author: p("omar-haddad", "Omar Haddad", "VP Engineering · Cobalt Systems"), quote: "“We set a gold standard for what shared components should feel like.”", stat: "30h", statLabel: "saved per engineer, per quarter" },
        { author: p("adel-qasim", "Adel Qasim", "Head of Design · Forma Studio"), quote: "“The system carries our brand better than our old brand book did.”", stat: "20%", statLabel: "lift in trial-to-paid conversion" },
      ],
      [
        { author: p("bader-al-ghamdi", "Bader Al-Ghamdi", "CTO · Beacon Analytics"), quote: "“We deleted forty thousand lines of UI code.”", stat: "2.1×", statLabel: "faster dashboard delivery" },
        { author: p("majed-nouri", "Majed Nouri", "COO · Arcadia Health"), quote: "“Contrast ratios stopped being a conversation entirely.”", stat: "3.4×", statLabel: "faster clinical screen reviews" },
        { author: p("fahad-salem", "Fahad Salem", "Brand Director · Arvenna Bank"), quote: "“Every audit finding used to be a design debate. Now it's a token change.”", stat: "99%", statLabel: "of screens pass brand review on the first try" },
      ],
      [
        { author: p("bader-al-ghamdi", "Bader Al-Ghamdi", "CTO · Beacon Analytics"), quote: "“Set-up took one morning, and the library works straight inside our tools with no add-ons.”", stat: "28%", statLabel: "increase in activation rate" },
        { author: p("majed-nouri", "Majed Nouri", "COO · Arcadia Health"), quote: "“Because every screen flows through one system, our patient tools adapt to what each clinic actually needs.”", stat: "97%", statLabel: "accessibility audit pass rate" },
        { author: p("omar-haddad", "Omar Haddad", "VP Engineering · Cobalt Systems"), quote: "“I feel genuinely confident shipping UI without a design review in the loop.”", stat: "6×", statLabel: "faster brand theming since switching" },
      ],
    ],
  },
  ar: {
    heading: "تثق بها الفرق الأعلى أداءً",
    description: "قصص تدعمها الأرقام.",
    link: "اقرأ القصة كاملة",
    label: "مجموعات القصص",
    pages: [
      [
        { author: p("ziad-karam", "زياد كرم", "الرئيس التنفيذي، كويلفيلد"), quote: "«لم أدرك كم كلّفتنا الواجهات البطيئة حتى رأيت الأرقام.»", stat: "41%", statLabel: "أسرع في وتيرة الإصدارات الأسبوعية" },
        { author: p("omar-haddad", "عمر حداد", "نائب رئيس الهندسة، كوبالت سيستمز"), quote: "«وضعنا معيارًا ذهبيًا لما ينبغي أن تكون عليه المكوّنات المشتركة.»", stat: "30 ساعة", statLabel: "يوفّرها كل مهندس في الربع" },
        { author: p("adel-qasim", "عادل قاسم", "رئيس التصميم، فورما ستوديو"), quote: "«يعبّر النظام عن علامتنا أفضل مما كان يفعل دليلها القديم.»", stat: "20%", statLabel: "زيادة في التحويل إلى اشتراك مدفوع" },
      ],
      [
        { author: p("bader-al-ghamdi", "بدر الغامدي", "الرئيس التقني، بيكون أناليتكس"), quote: "«حذفنا أربعين ألف سطر من شيفرة الواجهات.»", stat: "2.1×", statLabel: "أسرع في تسليم لوحات المعلومات" },
        { author: p("majed-nouri", "ماجد نوري", "الرئيس التنفيذي للعمليات، أركاديا هيلث"), quote: "«لم تعد نسب التباين موضوع نقاش على الإطلاق.»", stat: "3.4×", statLabel: "أسرع في مراجعة الشاشات السريرية" },
        { author: p("fahad-salem", "فهد سالم", "مدير العلامة التجارية، بنك أرفينا"), quote: "«كانت كل ملاحظة تدقيق تفتح نقاشًا في التصميم، والآن يكفيها تعديل رمز واحد.»", stat: "99%", statLabel: "من الشاشات تجتاز مراجعة العلامة من أول محاولة" },
      ],
      [
        { author: p("bader-al-ghamdi", "بدر الغامدي", "الرئيس التقني، بيكون أناليتكس"), quote: "«أنهينا الإعداد في صباح واحد، وتعمل المكتبة مباشرة ضمن أدواتنا دون أي إضافات.»", stat: "28%", statLabel: "زيادة في معدل التفعيل" },
        { author: p("majed-nouri", "ماجد نوري", "الرئيس التنفيذي للعمليات، أركاديا هيلث"), quote: "«لأن كل شاشة تمر عبر نظام واحد، تتكيّف أدوات المرضى لدينا مع ما تحتاجه كل عيادة فعلًا.»", stat: "97%", statLabel: "معدل اجتياز تدقيق إمكانية الوصول" },
        { author: p("omar-haddad", "عمر حداد", "نائب رئيس الهندسة، كوبالت سيستمز"), quote: "«أُطلق الواجهات بثقة تامة دون انتظار مراجعة التصميم.»", stat: "6×", statLabel: "أسرع في تطبيق سمات العلامة منذ الانتقال" },
      ],
    ],
  },
}

/** The three tints, in card order: `info`, `destructive`, `warning`, as Figma sets them. */
const TINTS = ["bg-info/10", "bg-destructive/10", "bg-warning/10"]

export interface SocialProofStatStoryCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofStatStoryCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatars show initials. */
  photos?: SocialProofPhotos
  /** The set shown, from 0, to control the dots. */
  index?: number
  /** Called when a dot, a key or a swipe changes the set. */
  onIndexChange?: (index: number) => void
  /** Where the buttons go. The same for every story. */
  href?: string
}

export function SocialProofStatStoryCards({
  locale = "en",
  heading,
  description,
  link,
  label,
  pages,
  photos,
  index: indexProp,
  onIndexChange,
  href = "#",
  className,
  ...props
}: SocialProofStatStoryCardsProps) {
  const copy = COPY[locale]
  const list = pages ?? copy.pages
  const headingId = React.useId()
  const dots = React.useRef<HTMLDivElement>(null)
  const focusDot = React.useRef(false)
  const { ref, index, go } = useStepper<HTMLDivElement>({ count: list.length, index: indexProp, onIndexChange, stagger: true })
  const swipe = useSwipeStep((delta) => go(index + delta))
  React.useEffect(() => {
    if (!focusDot.current) return
    focusDot.current = false
    dots.current?.querySelectorAll("button")[index]?.focus()
  }, [index])
  const select = (next: number) => {
    focusDot.current = true
    go(next)
  }
  const stories = list[index]
  if (!stories) return null

  return (
    <SocialProofSection labelledBy={headingId} className={className} contentClassName="gap-10" {...props}>
      <SocialProofHeader headingId={headingId} heading={heading ?? copy.heading} description={description ?? copy.description} headingSize="3xl" descriptionSize="base" />
      <div ref={ref} aria-live="polite" className="flex w-full flex-col gap-6 [@container(min-width:64rem)]:flex-row" {...swipe}>
        {stories.map((story, i) => (
          <article
            key={`${index}-${i}`}
            data-step-item="slide"
            className={cn("flex min-w-0 flex-1 flex-col justify-between gap-5 rounded-xl p-6 [@container(min-width:64rem)]:p-8", TINTS[i % TINTS.length])}
          >
            <figure className="m-0 flex flex-col gap-5">
              <figcaption className="flex items-center gap-3">
                <Avatar aria-hidden size="32" radius="rounded" src={photos?.[story.author.id]} name={story.author.name} className="size-11 shrink-0" />
                <div className="flex min-w-0 flex-col">
                  <cite className="text-sm font-medium not-italic text-foreground">{story.author.name}</cite>
                  <span className="text-xs text-muted-foreground">
                    <Isolated>{story.author.role}</Isolated>
                  </span>
                </div>
              </figcaption>
              <div className="flex flex-col gap-5 [@container(min-width:64rem)]:flex-row">
                <SocialProofQuote quote={story.quote} className="min-w-0 flex-1 text-base text-foreground" />
                <p className="flex shrink-0 flex-col gap-1 [@container(min-width:64rem)]:w-[120px]">
                  <span className="text-4xl font-semibold text-foreground">
                    <Isolated>{story.stat}</Isolated>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <Isolated>{story.statLabel}</Isolated>
                  </span>
                </p>
              </div>
            </figure>
            <a href={href} className={buttonVariants({ variant: "outline", tone: "primary", size: "sm", radius: "rounded", className: "self-start" })}>
              {link ?? copy.link}
            </a>
          </article>
        ))}
      </div>
      <div ref={dots} role="group" aria-label={label ?? copy.label} onKeyDown={stepKeys(index, list.length, select)}>
        <CarouselDots count={list.length} activeIndex={index} onActiveIndexChange={go} label={(i, count) => (locale === "ar" ? `المجموعة ${i + 1} من ${count}` : `Set ${i + 1} of ${count}`)} />
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofStatStoryCardsCopy = COPY
