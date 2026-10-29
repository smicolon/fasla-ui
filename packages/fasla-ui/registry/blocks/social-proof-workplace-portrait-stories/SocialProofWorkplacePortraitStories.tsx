"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Card } from "../../ui/card/card"
import {
  Isolated,
  SocialProofHeader,
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
 * Figma: `Social Proof` (46368:3361), Type=Workplace Portrait Stories.
 *
 * A centred header over four audiences, each a portrait (the Card atom's
 * image surface) with its label. The selected audience is the featured
 * story: a `primary` card with the quote and its author, a short `primary`
 * bar before its label, and the audience's benefit line under it.
 *
 * Desktop sets the four as columns: 180px portraits 400 tall, the selected
 * column widened to hold its portrait inside the quote card. Tablet sets the
 * four portraits in a row and phones two by two, the selected one marked by
 * the bar, with the quote card full width under them.
 *
 * Motion (Figma's ⚡ Motion note): selecting an audience portrait, by click,
 * tap or the arrow keys within the row, makes it the featured story. Manual
 * only, no autoplay. On Desktop the selected column becomes the featured card
 * with no width animation and its portrait, quote and attribution fade in
 * (fadeIn, 180ms); on Tablet and phones only the quote card crossfades. The
 * bar sits before the selected label, on the start side. Reduced motion:
 * opacity only, 120ms.
 *
 * Figma shows Design leads, Hamad Al-Mutairi's story. The other audiences carry
 * quotes their people give elsewhere in the set: Yousef Amin's from Dark
 * Editorial Split for Founders, Hani Jaber's from Staggered Columns for
 * Engineers and Sami Naji's from Classic Trio Grid for Product managers.
 * Only Design leads has a benefit line in Figma; the others show none.
 */

export interface SocialProofWorkplacePortraitStoriesItem {
  /** The audience. Up to 20 characters in English, 18 in Arabic. */
  label: React.ReactNode
  /** The key in `photos` for the audience's portrait. */
  photoId: string
  /** Up to 290 characters in English, 284 in Arabic. */
  quote: React.ReactNode
  author: SocialProofPerson
  /** The line under the selected audience. Hidden when empty. */
  benefit?: React.ReactNode
}

export interface SocialProofWorkplacePortraitStoriesCopy {
  /** The line above the heading. Up to 41 characters in English, 31 in Arabic. */
  eyebrow: React.ReactNode
  heading: React.ReactNode
  description: React.ReactNode
  /** The audiences, in reading order. */
  items: SocialProofWorkplacePortraitStoriesItem[]
}

const p = (id: string, name: string, role: string): SocialProofPerson => ({ id, name, role })

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofWorkplacePortraitStoriesCopy> = {
  en: {
    eyebrow: "CUSTOMER STORIES",
    heading: "One system for every team in the room",
    description: "Founders, engineers, design leads and product managers on what changed when their teams moved to Fasla.",
    items: [
      {
        label: "Founders",
        photoId: "workplace-founders",
        quote: "“Fasla set a new bar for quality — and the team hit it while shipping ahead of schedule.”",
        author: p("yousef-amin", "Yousef Amin", "Co-founder, Halcyon Games"),
      },
      {
        label: "Engineers",
        photoId: "workplace-engineers",
        quote: "“I benchmarked the bundle before and after. Lighter, faster, and somehow prettier.”",
        author: p("hani-jaber", "Hani Jaber", "Staff Engineer, Clearfen"),
      },
      {
        label: "Design leads",
        photoId: "workplace-design-leads",
        quote: "“Our designers used to lose Fridays to drift between Figma and production. Now the tokens are the source, so reviews are about ideas, not pixels. Three product teams ship from one kit, and nobody asks which button is the real one.”",
        author: p("hamad-al-mutairi", "Hamad Al-Mutairi", "Design Ops Lead, Willow & Co"),
        benefit: "Give every squad the same tokens, components and review rules, so quality grows with the team.",
      },
      {
        label: "Product managers",
        photoId: "workplace-product-managers",
        quote: "“Fasla replaced three tools the day we onboarded. Our design reviews went from hours of nitpicking to actually shipping.”",
        author: p("sami-naji", "Sami Naji", "Product Lead, Nimbus Labs"),
      },
    ],
  },
  ar: {
    eyebrow: "قصص العملاء",
    heading: "نظام واحد تعمل به كل فرق الشركة",
    description: "يروي المؤسسون والمهندسون وقادة التصميم ومديرو المنتجات ما تغيّر في عملهم بعد انتقال فرقهم إلى فاصلة.",
    items: [
      {
        label: "المؤسسون",
        photoId: "workplace-founders",
        quote: "«رفعت فاصلة سقف الجودة، وبلغه الفريق وأطلق قبل موعده.»",
        author: p("yousef-amin", "يوسف أمين", "شريك مؤسس، هالسيون غيمز"),
      },
      {
        label: "المهندسون",
        photoId: "workplace-engineers",
        quote: "«قِست حجم الشيفرة قبل الانتقال وبعده، فصارت أخف وأسرع، وأجمل أيضًا.»",
        author: p("hani-jaber", "هاني جابر", "مهندس أول، كليرفين"),
      },
      {
        label: "قادة التصميم",
        photoId: "workplace-design-leads",
        quote: "«كان مصممونا يخسرون يومًا كل أسبوع في مطابقة ملفات Figma مع ما يظهر في المنتج. اليوم صارت فاصلة المرجع الوحيد، فانصرفت المراجعات إلى الأفكار بدل البكسلات. تعمل ثلاثة فرق منتجات من مكتبة واحدة، ولم يعد أحد يسأل عن الزر المعتمد.»",
        author: p("hamad-al-mutairi", "حمد المطيري", "قائد عمليات التصميم، ويلو آند كو"),
        benefit: "امنح فرقك كلها المكوّنات نفسها وقواعد المراجعة نفسها، فتبقى الجودة ثابتة مهما كبرت.",
      },
      {
        label: "مديرو المنتجات",
        photoId: "workplace-product-managers",
        quote: "«أغنتنا فاصلة عن ثلاث أدوات من اليوم الأول، وصارت مراجعات التصميم تنتهي بالإطلاق لا بساعات من التدقيق.»",
        author: p("sami-naji", "سامي ناجي", "قائد المنتج، نيمبوس لابس"),
      },
    ],
  },
}

export interface SocialProofWorkplacePortraitStoriesProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofWorkplacePortraitStoriesCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Portrait photos by `photoId`. Without them the portraits show their `muted` ground. */
  photos?: SocialProofPhotos
  /** The selected audience, from 0, to control the row. */
  index?: number
  /**
   * The audience selected first: Design leads, as Figma shows.
   * @default 2
   */
  defaultIndex?: number
  /** Called when an audience is selected. */
  onIndexChange?: (index: number) => void
}

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/** A portrait on the Card atom's surface, as Figma's Card (Image overlays) draws it. */
function Portrait({ src, className }: { src?: string; className?: string }) {
  return (
    <Card className={cn("overflow-hidden rounded-2xl border-0 p-0 shadow-none", className)}>
      <SocialProofPhoto src={src} className="size-full" />
    </Card>
  )
}

/** The selected audience's label, after the short `primary` bar. */
function SelectedLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className="h-[3px] w-5 rounded-full bg-primary" />
      {children}
    </span>
  )
}

export function SocialProofWorkplacePortraitStories({
  locale = "en",
  eyebrow,
  heading,
  description,
  items,
  photos,
  index: indexProp,
  defaultIndex = 2,
  onIndexChange,
  className,
  ...props
}: SocialProofWorkplacePortraitStoriesProps) {
  const copy = COPY[locale]
  const list = items ?? copy.items
  const headingId = React.useId()
  const focusSelected = React.useRef(false)
  const { ref, index, go } = useStepper<HTMLDivElement>({
    count: list.length,
    index: indexProp,
    defaultIndex,
    onIndexChange,
    slide: false,
    exit: false,
  })
  // After a key moves the selection, focus follows it to whichever layout is showing.
  React.useEffect(() => {
    if (!focusSelected.current) return
    focusSelected.current = false
    const buttons = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>(`[data-audience="${index}"]`) ?? [])
    buttons.find((button) => button.offsetParent !== null)?.focus()
  }, [index, ref])
  const select = (next: number) => {
    focusSelected.current = true
    go(next)
  }
  const active = list[index]
  if (!active) return null
  const line = eyebrow === undefined ? copy.eyebrow : eyebrow

  const quoteCard = (withPortrait: boolean) => (
    <figure
      key={`story-${index}`}
      data-step-item="fade"
      className={cn(
        "m-0 flex gap-2 rounded-2xl bg-primary p-2 text-primary-foreground",
        withPortrait ? "min-h-[400px] flex-row" : "min-h-[200px] w-full"
      )}
    >
      {withPortrait ? <Portrait src={photos?.[active.photoId]} className="w-[220px] shrink-0" /> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-6 p-4">
        <SocialProofQuote quote={active.quote} className="flex-1 text-xl" />
        <figcaption className="flex flex-col gap-1">
          <cite className="text-base font-semibold not-italic">{active.author.name}</cite>
          <span className="text-sm">
            <Isolated>{active.author.role}</Isolated>
          </span>
        </figcaption>
      </div>
    </figure>
  )

  const benefit = active.benefit ? (
    <p className="text-sm text-muted-foreground">
      <Isolated>{active.benefit}</Isolated>
    </p>
  ) : null

  return (
    <SocialProofSection labelledBy={headingId} className={cn("lg:px-24", className)} contentClassName="max-w-[1248px] gap-12" {...props}>
      <SocialProofHeader headingId={headingId} heading={heading ?? copy.heading} description={description === undefined ? copy.description : description} descriptionSize="base">
        {line ? (
          <p className="order-first text-xs font-medium text-muted-foreground">
            <Isolated>{line}</Isolated>
          </p>
        ) : null}
      </SocialProofHeader>
      <div ref={ref} className="w-full" aria-live="polite">
        {/* Desktop: four columns, the selected one widened into the featured story. */}
        <div role="group" aria-labelledby={headingId} onKeyDown={stepKeys(index, list.length, select)} className="hidden gap-3 [@container(min-width:64rem)]:flex">
          {list.map((item, i) =>
            i === index ? (
              <div key={i} className="flex min-w-0 flex-1 flex-col gap-3">
                {quoteCard(true)}
                <button type="button" data-audience={i} aria-pressed tabIndex={0} className={cn("self-start rounded-sm text-base font-semibold text-foreground", FOCUS_RING)}>
                  <SelectedLabel>
                    <Isolated>{item.label}</Isolated>
                  </SelectedLabel>
                </button>
                {benefit}
              </div>
            ) : (
              <button
                key={i}
                type="button"
                data-audience={i}
                aria-pressed={false}
                tabIndex={-1}
                onClick={() => go(i)}
                className={cn("flex w-[180px] shrink-0 flex-col items-start gap-3 rounded-2xl text-base font-semibold text-foreground", FOCUS_RING)}
              >
                <Portrait src={photos?.[item.photoId]} className="h-[400px] w-full" />
                <Isolated>{item.label}</Isolated>
              </button>
            )
          )}
        </div>
        {/* Tablet and phones: the portraits in a grid, the quote card under them. */}
        <div className="flex flex-col gap-3 [@container(min-width:64rem)]:hidden">
          <div role="group" aria-labelledby={headingId} onKeyDown={stepKeys(index, list.length, select)} className="grid grid-cols-2 gap-3 [@container(min-width:40rem)]:grid-cols-4">
            {list.map((item, i) => (
              <button
                key={i}
                type="button"
                data-audience={i}
                aria-pressed={i === index}
                tabIndex={i === index ? 0 : -1}
                onClick={() => go(i)}
                className={cn("flex min-w-0 flex-col items-start gap-3 rounded-2xl text-base font-semibold text-foreground", FOCUS_RING)}
              >
                <Portrait src={photos?.[item.photoId]} className="h-[200px] w-full [@container(min-width:40rem)]:h-[240px]" />
                {i === index ? (
                  <SelectedLabel>
                    <Isolated>{item.label}</Isolated>
                  </SelectedLabel>
                ) : (
                  <Isolated>{item.label}</Isolated>
                )}
              </button>
            ))}
          </div>
          {quoteCard(false)}
          {benefit}
        </div>
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofWorkplacePortraitStoriesCopy = COPY
