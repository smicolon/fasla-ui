"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import {
  SocialProofAuthor,
  SocialProofHeader,
  SocialProofQuote,
  SocialProofSection,
  SocialProofStars,
  toColumns,
  useCanDrift,
  useColumnCount,
  useDrift,
  useRevealOnce,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Vertical Column Wall.
 *
 * A centred header over a wall of twelve short quotes in columns, set at
 * different heights inside a fixed stage that crops the cards at its top and
 * bottom edge by design. Desktop shows three columns of four, the columns
 * raised 70, 20 and 110px; Tablet two columns of six, the cards dealt into
 * them in turn; phones one column in a 520px stage, which shows the first few.
 *
 * Motion (Figma's ⚡ Motion note): the columns drift vertically on their own
 * and loop without a seam: the outer columns climb and the middle one falls
 * (on Tablet the first column climbs and the second falls; on phones the one
 * column climbs), each loop about 45, 52 and 48 seconds, linear. Every column
 * holds its cards twice, the repeat hidden from assistive technology and out
 * of the Tab order, so the wrap is invisible. It runs only while the wall is
 * in the viewport, pauses while the pointer is over it or focus is inside it,
 * and stands still with reduced motion. The first time the wall enters the
 * viewport the cards also fade in once, 60ms apart (fadeIn with the stagger
 * preset, 180ms each); with reduced motion they fade in together, opacity
 * only, in 120ms. The stage still crops the cards at its top and bottom edge.
 * In RTL the column order mirrors and the vertical directions do not change.
 */

export interface SocialProofVerticalColumnWallItem {
  /** One or two lines: up to about 63 characters in English, 68 in Arabic. */
  quote: React.ReactNode
  author: SocialProofPerson
}

export interface SocialProofVerticalColumnWallCopy {
  heading: React.ReactNode
  description: React.ReactNode
  /** The cards, in reading order. Twelve: the stage's crop is set for twelve. */
  items: SocialProofVerticalColumnWallItem[]
}

const p = (id: string, name: string, role: string): SocialProofPerson => ({ id, name, role })

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofVerticalColumnWallCopy> = {
  en: {
    heading: "What teams tell us",
    description: "Notes from customers, in their own words.",
    items: [
      { quote: "“Rolled out across four product lines in one sprint.”", author: p("sami-naji", "Sami Naji", "Product Lead, Nimbus Labs") },
      { quote: "“Even legal liked the docs. I checked twice.”", author: p("tariq-zaki", "Tariq Zaki", "Head of Product, Marlow HR") },
      { quote: "“Handoff is finally boring — the highest compliment I have.”", author: p("rashed-al-amri", "Rashed Al-Amri", "Design Ops, Willow & Co") },
      { quote: "“We deleted forty thousand lines of UI code.”", author: p("bader-al-ghamdi", "Bader Al-Ghamdi", "CTO, Beacon Analytics") },
      { quote: "“Eleven days for a full rebrand across three surfaces.”", author: p("fahad-salem", "Fahad Salem", "Brand Director, Arvenna Bank") },
      { quote: "“The grid means the same thing in Figma and prod.”", author: p("khalid-saad", "Khalid Saad", "Frontend Lead, Atlas Freight") },
      { quote: "“Investors asked who did our rebrand. It was Tuesday.”", author: p("ziad-karam", "Ziad Karam", "CEO, Quillfield") },
      { quote: "“UI-debt items quietly vanished from our retros.”", author: p("omar-haddad", "Omar Haddad", "VP Engineering, Cobalt Systems") },
      { quote: "“Contrast ratios stopped being a conversation entirely.”", author: p("majed-nouri", "Majed Nouri", "COO, Arcadia Health") },
      { quote: "“Accessible by default, themable in an afternoon.”", author: p("hani-jaber", "Hani Jaber", "Staff Engineer, Clearfen") },
      { quote: "“Our dashboards finally match our brand energy.”", author: p("yousef-amin", "Yousef Amin", "Co-founder, Halcyon Games") },
      { quote: "“Slots where you want slots, variants where you want variants.”", author: p("adel-qasim", "Adel Qasim", "Head of Design, Forma Studio") },
    ],
  },
  ar: {
    heading: "ما تقوله الفرق عنّا",
    description: "كلمات من عملائنا كما كتبوها.",
    items: [
      { quote: "«أطلقناها في أربعة خطوط منتجات في سبرنت واحد.»", author: p("sami-naji", "سامي ناجي", "قائد المنتج، نيمبوس لابس") },
      { quote: "«حتى الفريق القانوني أعجبه التوثيق، وتأكدت من ذلك مرتين.»", author: p("tariq-zaki", "طارق زكي", "رئيس المنتج، مارلو إتش آر") },
      { quote: "«صار تسليم التصاميم للمطورين روتينيًا أخيرًا، وهذا أكبر مديح عندي.»", author: p("rashed-al-amri", "راشد العمري", "عمليات التصميم، ويلو آند كو") },
      { quote: "«حذفنا أربعين ألف سطر من شيفرة الواجهات.»", author: p("bader-al-ghamdi", "بدر الغامدي", "الرئيس التقني، بيكون أناليتكس") },
      { quote: "«أعدنا بناء هويتنا كاملة على ثلاث منصات في أحد عشر يومًا.»", author: p("fahad-salem", "فهد سالم", "مدير العلامة التجارية، بنك أرفينا") },
      { quote: "«للشبكة المعنى نفسه في Figma وفي المنتج المنشور.»", author: p("khalid-saad", "خالد سعد", "قائد الواجهات الأمامية، أطلس فريت") },
      { quote: "«سأل المستثمرون عمّن صمّم هويتنا الجديدة. أنجزناها في يوم عمل عادي.»", author: p("ziad-karam", "زياد كرم", "الرئيس التنفيذي، كويلفيلد") },
      { quote: "«اختفت بنود الدَّين التقني للواجهات من اجتماعات المراجعة بهدوء.»", author: p("omar-haddad", "عمر حداد", "نائب رئيس الهندسة، كوبالت سيستمز") },
      { quote: "«لم تعد نسب التباين موضوع نقاش على الإطلاق.»", author: p("majed-nouri", "ماجد نوري", "الرئيس التنفيذي للعمليات، أركاديا هيلث") },
      { quote: "«إمكانية الوصول مدمجة من البداية، وتغيير السمات في نصف يوم.»", author: p("hani-jaber", "هاني جابر", "مهندس أول، كليرفين") },
      { quote: "«لوحاتنا تطابق أخيرًا روح علامتنا.»", author: p("yousef-amin", "يوسف أمين", "شريك مؤسس، هالسيون غيمز") },
      { quote: "«مواضع حيث تحتاج المواضع، وأنماط حيث تحتاج الأنماط.»", author: p("adel-qasim", "عادل قاسم", "رئيس التصميم، فورما ستوديو") },
    ],
  },
}

/** How far each column is raised inside the stage, per column count, as Figma sets them. */
const RAISE: Record<number, string[]> = {
  1: ["-mt-[40px]"],
  2: ["-mt-[70px]", "-mt-[20px]"],
  3: ["-mt-[70px]", "-mt-[20px]", "-mt-[110px]"],
}

export interface SocialProofVerticalColumnWallProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofVerticalColumnWallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatars show initials. */
  photos?: SocialProofPhotos
}

/** A loop's length in seconds, per column, by how many columns there are: 45, 52 and 48 on Desktop. */
const LOOP_SECONDS: Record<number, number[]> = { 1: [48], 2: [45, 52], 3: [45, 52, 48] }
/** The gap between a column's cards, `gap-5`, which the loop's distance includes. */
const CARD_GAP = 20

export function SocialProofVerticalColumnWall({
  locale = "en",
  heading,
  description,
  items,
  photos,
  className,
  ...props
}: SocialProofVerticalColumnWallProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const [stageRef, columnCount] = useColumnCount<HTMLDivElement>()
  const revealRef = useRevealOnce<HTMLDivElement>()
  const columns = toColumns(list.map((item, index) => ({ item, index })), columnCount)
  const canDrift = useCanDrift()
  const driftRef = useDrift<HTMLDivElement>(
    (root) =>
      Array.from(root.querySelectorAll<HTMLElement>("[data-drift]")).flatMap((column, columnIndex) => {
        const first = column.firstElementChild as HTMLElement | null
        if (!first || typeof column.animate !== "function") return []
        // One copy's height and the gap before the repeat: moving that far puts the repeat where the first copy began.
        const distance = first.offsetHeight + CARD_GAP
        return [
          column.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-distance}px)` }], {
            duration: (LOOP_SECONDS[columnCount]?.[columnIndex] ?? 48) * 1000,
            iterations: Infinity,
            easing: "linear",
            // The middle column (the second of two or three) runs the other way.
            direction: columnCount > 1 && columnIndex === 1 ? "reverse" : "normal",
          }),
        ]
      }),
    [columnCount, canDrift]
  )

  return (
    <SocialProofSection
      labelledBy={headingId}
      className={cn("lg:px-24", className)}
      contentClassName="max-w-[1248px] gap-10"
      {...props}
    >
      <SocialProofHeader
        headingId={headingId}
        heading={heading ?? copy.heading}
        description={description === undefined ? copy.description : description}
        className="gap-3"
      />
      <div ref={driftRef} className="w-full">
        <div ref={revealRef} className="w-full">
          <div ref={stageRef} className="flex h-[520px] w-full gap-6 overflow-hidden [@container(min-width:40rem)]:h-[560px]">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} data-drift="" className={cn("flex min-w-0 flex-1 flex-col gap-5", RAISE[columns.length]?.[columnIndex])}>
                {[false, ...(canDrift ? [true] : [])].map((repeat) => (
                  <ul
                    key={String(repeat)}
                    // The repeat is only there for the loop: hidden from assistive technology and out of the Tab order.
                    aria-hidden={repeat || undefined}
                    ref={repeat ? (el) => el?.setAttribute("inert", "") : undefined}
                    className="m-0 flex list-none flex-col gap-5 p-0"
                  >
                    {column.map(({ item, index }) => (
                      <li
                        key={index}
                        {...(repeat ? {} : { "data-reveal": "" })}
                        className="rounded-lg bg-card p-5 ring-1 ring-inset ring-border forced-colors:border"
                      >
                        <figure className="m-0 flex flex-col gap-3">
                          <SocialProofStars locale={locale} />
                          <SocialProofQuote quote={item.quote} className="text-sm text-foreground" />
                          <SocialProofAuthor person={item.author} photos={photos} gap="2.5" avatarClassName="size-7" />
                        </figure>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofVerticalColumnWallCopy = COPY
