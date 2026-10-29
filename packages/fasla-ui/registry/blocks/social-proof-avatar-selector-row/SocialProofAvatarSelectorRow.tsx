"use client"

import * as React from "react"
import { Quote } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  Isolated,
  SocialProofPhoto,
  SocialProofQuote,
  SocialProofSection,
  stepKeys,
  useStepper,
  type SocialProofLocale,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Avatar-Selector Row.
 *
 * A quote centred over a row of five portrait tiles: the company in XS Bold,
 * the name and the short role under each portrait. The selected tile is the
 * quote's author: its portrait carries a 2px `info` ring, its company turns
 * `info` with a short `info` underline. The other tiles keep their portraits
 * dimmed to 55% and their names and roles at full contrast. Two quote marks
 * frame the quote from Tablet up.
 *
 * The portraits are 120px on Desktop, 104 on Tablet and 88 on phones, where
 * the tiles wrap three and two. They are photo slots, not the Avatar atom,
 * which stops at 32px.
 *
 * Motion (Figma's ⚡ Motion note): selecting a portrait, by click, tap or the
 * arrow keys within the row, makes it the active tile. Manual only: no
 * auto-cycling, no timer. On select the quote fades in (fadeIn, 180ms) and
 * the tile takes the active style in 120ms. Reduced motion: opacity only,
 * 120ms. In RTL the first portrait is on the right.
 *
 * Figma shows Khalid Saad's quote. The other four are quotes the same people
 * give elsewhere in the set: Sami Naji's from Highlighted-Phrase Spotlight,
 * Hani Jaber's from Giant Quote Duo, Yousef Amin's from Staggered Columns and
 * Adel Qasim's from Benefit-Title Cards.
 */

export interface SocialProofAvatarSelectorRowItem {
  /** The key in `photos` for the portrait. */
  id: string
  /** The company, above the name. Up to 20 characters. */
  company: React.ReactNode
  /** Up to 19 characters. */
  name: string
  /** The short role under the name. */
  role: React.ReactNode
  /** Up to 164 characters in English, 133 in Arabic. */
  quote: React.ReactNode
}

export interface SocialProofAvatarSelectorRowCopy {
  /** The line above the quote. Up to 41 characters in English, 31 in Arabic. */
  eyebrow: React.ReactNode
  /** Names the row of portraits for assistive tech. */
  label: string
  /** The people, in reading order. */
  items: SocialProofAvatarSelectorRowItem[]
}

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofAvatarSelectorRowCopy> = {
  en: {
    eyebrow: "TRUSTED BY THE BEST PRODUCT TEAMS",
    label: "Choose a customer",
    items: [
      {
        id: "sami-naji",
        company: "NIMBUS LABS",
        name: "Sami Naji",
        role: "Product Lead",
        quote: "“We didn't buy a component library. We bought back two design days a week — and every release finally feels finished.”",
      },
      {
        id: "khalid-saad",
        company: "ATLAS FREIGHT",
        name: "Khalid Saad",
        role: "Frontend Lead",
        quote: "“Perfect solution for our design needs — Fasla just works exactly how you'd want it to.”",
      },
      {
        id: "hani-jaber",
        company: "CLEARFEN",
        name: "Hani Jaber",
        role: "Staff Engineer",
        quote: "“You just have to build one screen with it. You'll feel it immediately.”",
      },
      {
        id: "yousef-amin",
        company: "HALCYON GAMES",
        name: "Yousef Amin",
        role: "Co-founder",
        quote: "“Our game dashboards finally match our brand. Players noticed before the press did.”",
      },
      {
        id: "adel-qasim",
        company: "FORMA STUDIO",
        name: "Adel Qasim",
        role: "Head of Design",
        quote: "“We cut a third of our custom CSS. The UI feels lighter to use and to maintain.”",
      },
    ],
  },
  ar: {
    eyebrow: "تثق بها أفضل فرق المنتجات",
    label: "اختر أحد العملاء",
    items: [
      {
        id: "sami-naji",
        company: "نيمبوس لابس",
        name: "سامي ناجي",
        role: "قائد المنتج",
        quote: "«لم نشترِ مكتبة مكوّنات، بل استعدنا يومين من التصميم كل أسبوع، وصار كل إصدار يبدو مكتملًا أخيرًا.»",
      },
      {
        id: "khalid-saad",
        company: "أطلس فريت",
        name: "خالد سعد",
        role: "قائد الواجهات الأمامية",
        quote: "«الحل الأمثل لاحتياجاتنا في التصميم: فاصلة تعمل تمامًا كما نريد.»",
      },
      {
        id: "hani-jaber",
        company: "كليرفين",
        name: "هاني جابر",
        role: "مهندس أول",
        quote: "«يكفي أن تبني شاشة واحدة بها. ستشعر بالفرق فورًا.»",
      },
      {
        id: "yousef-amin",
        company: "هالسيون غيمز",
        name: "يوسف أمين",
        role: "شريك مؤسس",
        quote: "«صارت لوحات ألعابنا تشبه علامتنا أخيرًا، ولاحظ اللاعبون ذلك قبل الصحافة.»",
      },
      {
        id: "adel-qasim",
        company: "فورما ستوديو",
        name: "عادل قاسم",
        role: "رئيس التصميم",
        quote: "«حذفنا ثلث شيفرة CSS المخصصة، فصارت الواجهة أخف في الاستخدام والصيانة.»",
      },
    ],
  },
}

export interface SocialProofAvatarSelectorRowProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofAvatarSelectorRowCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Portrait photos by person id. Without them the portraits show their `muted` ground. */
  photos?: SocialProofPhotos
  /** The selected person, from 0, to control the row. */
  index?: number
  /**
   * The person selected first: Khalid Saad, as Figma shows.
   * @default 1
   */
  defaultIndex?: number
  /** Called when a portrait is selected. */
  onIndexChange?: (index: number) => void
}

export function SocialProofAvatarSelectorRow({
  locale = "en",
  eyebrow,
  label,
  items,
  photos,
  index: indexProp,
  defaultIndex = 1,
  onIndexChange,
  className,
  ...props
}: SocialProofAvatarSelectorRowProps) {
  const copy = COPY[locale]
  const list = items ?? copy.items
  const line = eyebrow === undefined ? copy.eyebrow : eyebrow
  const baseId = React.useId()
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([])
  const { ref, index, go } = useStepper<HTMLDivElement>({
    count: list.length,
    index: indexProp,
    defaultIndex,
    onIndexChange,
    slide: false,
    exit: false,
  })
  const select = (next: number) => {
    go(next)
    tabs.current[next]?.focus()
  }
  const active = list[index]
  if (!active) return null

  return (
    <SocialProofSection aria-label={label ?? copy.label} className={cn("lg:px-24", className)} contentClassName="max-w-[1248px] gap-12" {...props}>
      <div
        ref={ref}
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${index}`}
        className="relative flex w-full max-w-[900px] flex-col items-center gap-4 text-center"
      >
        <Quote aria-hidden size={28} strokeWidth={1.5} className="absolute start-0 top-0 hidden rotate-180 text-muted-foreground [@container(min-width:40rem)]:block [@container(min-width:64rem)]:-start-[60px]" />
        <Quote aria-hidden size={28} strokeWidth={1.5} className="absolute end-0 bottom-0 hidden text-muted-foreground [@container(min-width:40rem)]:block [@container(min-width:64rem)]:-end-[60px]" />
        {line ? (
          <p className="text-xs font-medium text-muted-foreground">
            <Isolated>{line}</Isolated>
          </p>
        ) : null}
        <figure key={index} data-step-item="fade" className="m-0">
          <SocialProofQuote quote={active.quote} className="text-xl font-medium text-foreground [@container(min-width:40rem)]:text-2xl" />
          <figcaption className="sr-only">
            <cite>{active.name}</cite>, <Isolated>{active.role}</Isolated>
          </figcaption>
        </figure>
      </div>
      <div
        role="tablist"
        aria-label={label ?? copy.label}
        onKeyDown={stepKeys(index, list.length, select)}
        className="flex flex-wrap items-start justify-center gap-4 [@container(min-width:40rem)]:flex-nowrap [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:gap-8"
      >
        {list.map((item, i) => {
          const selected = i === index
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => go(i)}
              className="group flex w-[88px] flex-col items-center gap-2.5 rounded-lg text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [@container(min-width:40rem)]:w-[104px] [@container(min-width:64rem)]:w-[120px]"
            >
              <span className="relative block size-[88px] [@container(min-width:40rem)]:size-[104px] [@container(min-width:64rem)]:size-[120px]">
                <SocialProofPhoto
                  src={photos?.[item.id]}
                  className={cn("size-full rounded-lg transition-opacity duration-[120ms] motion-reduce:transition-none", !selected && "opacity-55")}
                />
                {selected ? <span aria-hidden className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-inset ring-info" /> : null}
              </span>
              <span className={cn("text-xs font-bold transition-colors duration-[120ms] motion-reduce:transition-none", selected ? "text-info" : "text-foreground")}>
                <Isolated>{item.company}</Isolated>
              </span>
              {selected ? <span aria-hidden className="h-[3px] w-8 rounded-full bg-info" /> : null}
              <span className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  <Isolated>{item.role}</Isolated>
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofAvatarSelectorRowCopy = COPY
