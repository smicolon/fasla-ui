"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import {
  Isolated,
  SocialProofAuthor,
  SocialProofQuote,
  SocialProofSection,
  STAGGERED_DRIFT_SPEED,
  driftDuration,
  toColumns,
  useCanDrift,
  useColumnCount,
  useDrift,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Staggered Columns.
 *
 * A header with the heading at the start and a short line at the end, over
 * six quote cards in staggered columns: the author first, then the quote, on
 * a `secondary` card. Desktop has three columns of two, the middle column set
 * 56px lower; Tablet two columns of three, the second set lower, the cards
 * dealt into them in turn; phones one column. Each column is its own stack,
 * so a longer quote pushes down only the cards under it.
 *
 * Motion (Figma's ⚡ Motion note): the columns drift continuously one way,
 * alternating by column: the first up, the second down, the third up, linear,
 * at about 40px per second (`STAGGERED_DRIFT_SPEED`) and looping without a
 * seam. Each column is its own window, as Figma's column frames are: it clips
 * what drifts past its top and bottom, and holds its cards again below (the
 * repeat, hidden from assistive technology and out of the Tab order) so the
 * wrap is invisible. At the start of a loop the layout is the resting one,
 * the middle column 56px lower. It
 * runs only while the block is in the viewport, pauses while the pointer is
 * over it or focus is inside it, and stands still with reduced motion. Tablet
 * drifts the same way; phones stack one column, which stays still. In RTL the
 * column order mirrors and the vertical directions do not change.
 */

export interface SocialProofStaggeredColumnsItem {
  /** Up to 154 characters in English, 136 in Arabic. */
  quote: React.ReactNode
  author: SocialProofPerson
}

export interface SocialProofStaggeredColumnsCopy {
  heading: React.ReactNode
  /** The line at the end of the header. Hidden when empty. */
  description: React.ReactNode
  /** The cards, in reading order. Six, as Figma lays them out. */
  items: SocialProofStaggeredColumnsItem[]
}

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofStaggeredColumnsCopy> = {
  en: {
    heading: "Word travels between teams",
    description: "Six teams, six stories — same system underneath.",
    items: [
      {
        quote: "“The theming engine paid for itself the week a client asked for white-label. We said yes in the same meeting.”",
        author: { id: "bader-al-ghamdi", name: "Bader Al-Ghamdi", role: "CTO, Beacon Analytics" },
      },
      {
        quote: "“Quillfield looks like a company three times our size. Two designers, one system, zero excuses.”",
        author: { id: "ziad-karam", name: "Ziad Karam", role: "CEO, Quillfield" },
      },
      {
        quote: "“I benchmarked the bundle before and after. Lighter, faster, and somehow prettier.”",
        author: { id: "hani-jaber", name: "Hani Jaber", role: "Staff Engineer, Clearfen" },
      },
      {
        quote: "“Our game dashboards finally match our brand. Players noticed before the press did.”",
        author: { id: "yousef-amin", name: "Yousef Amin", role: "Co-founder, Halcyon Games" },
      },
      {
        quote: "“Procurement approved it in record time. Even legal liked the docs.”",
        author: { id: "tariq-zaki", name: "Tariq Zaki", role: "Head of Product, Marlow HR" },
      },
      {
        quote: "“Every audit finding used to be a design debate. Now it's a token change.”",
        author: { id: "fahad-salem", name: "Fahad Salem", role: "Brand Director, Arvenna Bank" },
      },
    ],
  },
  ar: {
    heading: "سمعة تتناقلها الفرق",
    description: "ستة فرق وست قصص، ونظام واحد يجمعها.",
    items: [
      {
        quote: "«استردّ محرك السمات كلفته حين طلب عميل نسخة تحمل علامته، فوافقنا في الاجتماع نفسه.»",
        author: { id: "bader-al-ghamdi", name: "بدر الغامدي", role: "الرئيس التقني، بيكون أناليتكس" },
      },
      {
        quote: "«تبدو كويلفيلد شركة أكبر منا بثلاث مرات: مصممان ونظام واحد، ولا مجال للأعذار.»",
        author: { id: "ziad-karam", name: "زياد كرم", role: "الرئيس التنفيذي، كويلفيلد" },
      },
      {
        quote: "«قِست حجم الشيفرة قبل الانتقال وبعده، فصارت أخف وأسرع، وأجمل أيضًا.»",
        author: { id: "hani-jaber", name: "هاني جابر", role: "مهندس أول، كليرفين" },
      },
      {
        quote: "«صارت لوحات ألعابنا تشبه علامتنا أخيرًا، ولاحظ اللاعبون ذلك قبل الصحافة.»",
        author: { id: "yousef-amin", name: "يوسف أمين", role: "شريك مؤسس، هالسيون غيمز" },
      },
      {
        quote: "«وافق قسم المشتريات في وقت قياسي. حتى القسم القانوني أعجبه التوثيق.»",
        author: { id: "tariq-zaki", name: "طارق زكي", role: "رئيس المنتج، مارلو إتش آر" },
      },
      {
        quote: "«كانت كل ملاحظة تدقيق تفتح نقاشًا في التصميم، والآن يكفيها تعديل رمز واحد.»",
        author: { id: "fahad-salem", name: "فهد سالم", role: "مدير العلامة التجارية، بنك أرفينا" },
      },
    ],
  },
}

export interface SocialProofStaggeredColumnsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofStaggeredColumnsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatars show initials. */
  photos?: SocialProofPhotos
}

/** The gap between a column's cards, `gap-6`, which the loop's distance includes. */
const CARD_GAP = 24

export function SocialProofStaggeredColumns({
  locale = "en",
  heading,
  description,
  items,
  photos,
  className,
  ...props
}: SocialProofStaggeredColumnsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const line = description === undefined ? copy.description : description
  const [gridRef, columnCount] = useColumnCount<HTMLDivElement>()
  const columns = toColumns(list.map((item, index) => ({ item, index })), columnCount)
  const canDrift = useCanDrift() && columnCount > 1
  const driftRef = useDrift<HTMLDivElement>(
    (root) => {
      if (columnCount < 2) return []
      return Array.from(root.querySelectorAll<HTMLElement>("[data-drift]")).flatMap((column, columnIndex) => {
        const first = column.firstElementChild as HTMLElement | null
        if (!first || typeof column.animate !== "function") return []
        // One copy's height and the gap before the repeat: moving that far puts the repeat where the first copy began.
        // Measured, not `offsetHeight`, which rounds: a fraction of a pixel would show as a jump at the wrap.
        const distance = first.getBoundingClientRect().height + CARD_GAP
        return [
          column.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-distance}px)` }], {
            duration: driftDuration(distance, STAGGERED_DRIFT_SPEED),
            iterations: Infinity,
            easing: "linear",
            // The first, third... columns climb; the second, fourth... fall. Same in RTL.
            direction: columnIndex % 2 === 0 ? "normal" : "reverse",
          }),
        ]
      })
    },
    [columnCount, canDrift]
  )

  return (
    <SocialProofSection labelledBy={headingId} className={className} contentClassName="gap-12" {...props}>
      <header className="flex w-full flex-col gap-3 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:gap-12">
        <h2 id={headingId} className="min-w-0 flex-1 text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
          <Isolated>{heading ?? copy.heading}</Isolated>
        </h2>
        {line ? (
          <p className="text-base text-muted-foreground [@container(min-width:64rem)]:w-80 [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:text-end">
            <Isolated>{line}</Isolated>
          </p>
        ) : null}
      </header>
      <div ref={driftRef} className="w-full">
        <div ref={gridRef} className="flex w-full items-start gap-6">
          {columns.map((column, columnIndex) => {
            const cards = column.map(({ item, index }) => (
              <li key={index} className="rounded-xl bg-secondary p-8">
                <figure className="m-0 flex flex-col gap-5">
                  <SocialProofAuthor person={item.author} photos={photos} />
                  <SocialProofQuote quote={item.quote} className="text-base text-foreground" />
                </figure>
              </li>
            ))
            return (
              // Each column is its own window, as Figma's column frames are: it clips what drifts past its top and bottom.
              // The stagger is its margin, so it stays out of the loop's distance.
              <div key={columnIndex} className={cn("min-w-0 flex-1 overflow-hidden", columnIndex === 1 && "mt-14")}>
                <div data-drift="" className="relative">
                  <ul className="m-0 flex list-none flex-col gap-6 p-0">{cards}</ul>
                  {canDrift ? (
                    <ul
                      // The repeat is only there for the loop: hidden from assistive technology and out of the Tab order.
                      aria-hidden="true"
                      ref={(el) => el?.setAttribute("inert", "")}
                      className="absolute inset-x-0 top-full m-0 mt-6 flex list-none flex-col gap-6 p-0"
                    >
                      {cards}
                    </ul>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofStaggeredColumnsCopy = COPY
