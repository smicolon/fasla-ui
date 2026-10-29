"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import {
  Isolated,
  SocialProofPhoto,
  SocialProofQuote,
  SocialProofSection,
  stepKeys,
  useStepper,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Persona Pillars.
 *
 * A centred heading over four tall pillars, one per part of the team, each a
 * portrait with its label under it. The selected pillar is wider and holds a
 * `primary` quote panel: the author's photo (72px), the quote and the author.
 * Desktop: 210px pillars, the selected one 500, all 460 tall. Tablet: 120 and
 * 300, 380 tall. Phones: the selected panel full width, the other three in a
 * strip of 96px pillars under it.
 *
 * The author's photo is a photo slot, not the Avatar atom, which stops at
 * 32px.
 *
 * Motion (Figma's ⚡ Motion note): selecting a pillar, by click, tap or the
 * arrow keys within the row, makes it the active one. Manual only, with no
 * width animation: the selected pillar takes its wider column at once, then
 * its quote panel crossfades in (fadeIn, 180ms) and the author slides up 10px
 * with a fade (slideUp, 180ms). Reduced motion: opacity only, 120ms. In RTL
 * the first pillar is on the right.
 *
 * Figma shows the Engineers quote, Khalid Saad's. The others are quotes the
 * people on those pillars give elsewhere in the set: Fahad Salem's from Proof
 * Bento, Tariq Zaki's from Centered Logo Spotlight and Majed Nouri's from
 * Case-Study Row.
 */

export interface SocialProofPersonaPillarsItem {
  /** The part of the team, under the pillar. Up to 20 characters in English, 18 in Arabic. */
  label: React.ReactNode
  /** Up to 290 characters in English, 284 in Arabic. */
  quote: React.ReactNode
  /** The pillar's portrait and the panel's photo are `photos[author.id]`. */
  author: SocialProofPerson
}

export interface SocialProofPersonaPillarsCopy {
  heading: React.ReactNode
  /** The pillars, in reading order. */
  items: SocialProofPersonaPillarsItem[]
}

const p = (id: string, name: string, role: string): SocialProofPerson => ({ id, name, role })

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofPersonaPillarsCopy> = {
  en: {
    heading: "Built to power your entire team",
    items: [
      {
        label: "Designers",
        quote: "“We consolidated three design tools and an entire QA checklist into one system. Fasla is the rare platform both our brand team and our engineers call theirs.”",
        author: p("fahad-salem", "Fahad Salem", "Brand Director, Arvenna Bank"),
      },
      {
        label: "Engineers",
        quote: "“Fasla is central to how we build — whether it's sprint UI reviews or big launches, its guardrails help engineers ship polished screens without waiting on design.”",
        author: p("khalid-saad", "Khalid Saad", "Frontend Lead, Atlas Freight"),
      },
      {
        label: "Product",
        quote: "“Fasla turned our design language into a growth channel. Every launch ships looking exactly like us — on the first try.”",
        author: p("tariq-zaki", "Tariq Zaki", "Head of Product, Marlow HR"),
      },
      {
        label: "Marketing",
        quote: "“Because every screen flows through one system, our patient tools adapt to what each clinic actually needs.”",
        author: p("majed-nouri", "Majed Nouri", "COO, Arcadia Health"),
      },
    ],
  },
  ar: {
    heading: "صُمّم ليخدم فريقك بأكمله",
    items: [
      {
        label: "المصممون",
        quote: "«دمجنا ثلاث أدوات تصميم وقائمة فحص جودة كاملة في نظام واحد. وفاصلة من المنصات النادرة التي يعدّها فريق العلامة والمهندسون أداتهم.»",
        author: p("fahad-salem", "فهد سالم", "مدير العلامة التجارية، بنك أرفينا"),
      },
      {
        label: "المهندسون",
        quote: "«فاصلة في صميم طريقة عملنا. ففي مراجعات الواجهات خلال كل سبرنت وفي الإطلاقات الكبرى، تساعد ضوابطها المهندسين على إطلاق شاشات متقنة دون انتظار فريق التصميم.»",
        author: p("khalid-saad", "خالد سعد", "قائد الواجهات الأمامية، أطلس فريت"),
      },
      {
        label: "المنتج",
        quote: "«جعلت فاصلة هويتنا البصرية مصدرًا للنمو، فكل إطلاق يخرج بصورتنا تمامًا من المحاولة الأولى.»",
        author: p("tariq-zaki", "طارق زكي", "رئيس المنتج، مارلو إتش آر"),
      },
      {
        label: "التسويق",
        quote: "«لأن كل شاشة تمر عبر نظام واحد، تتكيّف أدوات المرضى لدينا مع ما تحتاجه كل عيادة فعلًا.»",
        author: p("majed-nouri", "ماجد نوري", "الرئيس التنفيذي للعمليات، أركاديا هيلث"),
      },
    ],
  },
}

export interface SocialProofPersonaPillarsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofPersonaPillarsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Portrait photos by person id. Without them the pillars show their `muted` ground. */
  photos?: SocialProofPhotos
  /** The selected pillar, from 0, to control the row. */
  index?: number
  /**
   * The pillar selected first: Engineers, as Figma shows.
   * @default 1
   */
  defaultIndex?: number
  /** Called when a pillar is selected. */
  onIndexChange?: (index: number) => void
}

export function SocialProofPersonaPillars({
  locale = "en",
  heading,
  items,
  photos,
  index: indexProp,
  defaultIndex = 1,
  onIndexChange,
  className,
  ...props
}: SocialProofPersonaPillarsProps) {
  const copy = COPY[locale]
  const list = items ?? copy.items
  const headingId = React.useId()
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([])
  const focusSelected = React.useRef(false)
  const { ref, index, go } = useStepper<HTMLDivElement>({
    count: list.length,
    index: indexProp,
    defaultIndex,
    onIndexChange,
    slide: false,
    exit: false,
  })
  // After a key moves the selection, focus follows it to the selected pillar's label.
  React.useEffect(() => {
    if (!focusSelected.current) return
    focusSelected.current = false
    tabs.current[index]?.focus()
  }, [index])
  const select = (next: number) => {
    focusSelected.current = true
    go(next)
  }
  const active = list[index]
  if (!active) return null

  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  /** A pillar you can select: its portrait and its label. */
  const pillar = (item: SocialProofPersonaPillarsItem, i: number, strip: boolean) => (
    <button
      key={i}
      type="button"
      aria-pressed={false}
      tabIndex={-1}
      onClick={() => go(i)}
      className={cn(
        "flex shrink-0 flex-col items-center gap-3 rounded-xl text-sm font-medium text-foreground",
        focusRing,
        strip ? "w-24" : "w-[120px] [@container(min-width:64rem)]:w-[210px]"
      )}
    >
      <SocialProofPhoto
        src={photos?.[item.author.id]}
        className={cn("w-full rounded-xl", strip ? "h-[124px]" : "h-[380px] [@container(min-width:64rem)]:h-[460px]")}
      />
      <Isolated>{item.label}</Isolated>
    </button>
  )

  return (
    <SocialProofSection labelledBy={headingId} className={cn("lg:px-24", className)} contentClassName="max-w-[1248px] gap-12" {...props}>
      <h2 id={headingId} className="text-center text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl">
        <Isolated>{heading ?? copy.heading}</Isolated>
      </h2>
      <div
        role="group"
        aria-labelledby={headingId}
        onKeyDown={stepKeys(index, list.length, select)}
        className="flex w-full flex-col items-center gap-5 [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-start [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:gap-5"
      >
        {list.map((item, i) =>
          i === index ? (
            <div key={i} className="flex w-full flex-col items-center gap-3 [@container(min-width:40rem)]:w-[300px] [@container(min-width:64rem)]:w-[500px]">
              <div ref={ref} aria-live="polite" className="w-full">
                <figure
                  key={i}
                  data-step-item="fade"
                  className="m-0 flex min-h-[340px] w-full flex-col justify-between gap-6 rounded-xl bg-primary p-8 text-primary-foreground [@container(min-width:40rem)]:min-h-[380px] [@container(min-width:64rem)]:min-h-[460px]"
                >
                  <SocialProofPhoto src={photos?.[item.author.id]} className="size-[72px] shrink-0 rounded-lg bg-primary-foreground/10" />
                  <SocialProofQuote quote={item.quote} className="text-base" />
                  <figcaption data-step-item="slide" className="flex flex-col">
                    <cite className="text-sm font-medium not-italic">{item.author.name}</cite>
                    <span className="text-xs">
                      <Isolated>{item.author.role}</Isolated>
                    </span>
                  </figcaption>
                </figure>
              </div>
              <button
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                aria-pressed
                tabIndex={0}
                className={cn("rounded-sm text-sm font-semibold text-foreground", focusRing)}
              >
                <Isolated>{item.label}</Isolated>
              </button>
            </div>
          ) : (
            <div key={i} className="hidden [@container(min-width:40rem)]:contents">
              {pillar(item, i, false)}
            </div>
          )
        )}
        <div className="flex justify-center gap-3 [@container(min-width:40rem)]:hidden">
          {list.map((item, i) => (i === index ? null : pillar(item, i, true)))}
        </div>
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofPersonaPillarsCopy = COPY
