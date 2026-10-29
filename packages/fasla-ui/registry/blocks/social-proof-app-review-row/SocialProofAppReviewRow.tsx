"use client"

import * as React from "react"
import { SocialIcon } from "../../ui/social-icons/social-icons"
import {
  Isolated,
  SocialProofQuote,
  SocialProofSection,
  SocialProofStars,
  SocialProofStepper,
  useStepper,
  useSwipeStep,
  type SocialProofLocale,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=App Review Row.
 *
 * A centred heading over app store reviews three to a set, each set off by a
 * 2px `foreground` line at its start: five `primary` stars, the review, and
 * the store with the reviewer's handle. Previous and next arrows (Icon
 * Button, Ghost xs) sit under the set, at the end.
 *
 * Motion (Figma's ⚡ Motion note): the first set shows on load, and the arrows
 * step through further sets of three when you pass more reviews. Manual only:
 * no autoplay, and paging stops at the first and last set, so previous is
 * disabled on the first set and next on the last. On change the outgoing
 * reviews fade out (fadeIn in reverse, 180ms) and the incoming ones slide up
 * 10px with a fade (slideUp, 180ms), 60ms apart (stagger). Reduced motion:
 * opacity only, 120ms. On phones, swiping the stack also steps through sets.
 * With Figma's three reviews there is one set, so both arrows are disabled.
 *
 * Desktop and Tablet set a set three across; phones stack it.
 */

export interface SocialProofAppReviewRowItem {
  /** Up to 154 characters in English, 136 in Arabic. */
  quote: React.ReactNode
  /** The store, as Figma sets it beside the Apple mark: "App Store" in English, "App Store،" in Arabic. */
  store: string
  /** The reviewer's handle, after the store: "· chicago_pm" in English, "chicago_pm" in Arabic. */
  handle: string
}

export interface SocialProofAppReviewRowCopy {
  heading: React.ReactNode
  /** The reviews, in reading order; the arrows page through them three at a time. */
  items: SocialProofAppReviewRowItem[]
}

/** Figma's copy, English and Arabic. Every reviewer is invented. */
const COPY: Record<SocialProofLocale, SocialProofAppReviewRowCopy> = {
  en: {
    heading: "Rated where it counts",
    items: [
      {
        quote: "“Fasla Studio is flat-out awesome. I recommend it as the primary design tool for any product team. So many great defaults!”",
        store: "App Store",
        handle: "· chicago_pm",
      },
      {
        quote: "“I absolutely love the theming. It's so easy to set up, and my mockups look client-ready every time I export.”",
        store: "App Store",
        handle: "· nawaf.builds",
      },
      {
        quote: "“The best design-system app I've used — better than the two big names combined, and as good as anything enterprise.”",
        store: "App Store",
        handle: "· rx_dev",
      },
    ],
  },
  ar: {
    heading: "تقييمات عالية في متاجر التطبيقات",
    items: [
      {
        quote: "«فاصلة ستوديو رائعة بكل معنى الكلمة. أوصي بها أداةَ تصميم أساسية لكل فريق منتج. إعداداتها الافتراضية ممتازة!»",
        store: "App Store،",
        handle: "chicago_pm",
      },
      {
        quote: "«أحب نظام السمات كثيرًا. إعداده سهل جدًا، وتخرج تصاميمي جاهزة للعميل في كل تصدير.»",
        store: "App Store،",
        handle: "nawaf.builds",
      },
      {
        quote: "«أفضل تطبيق لأنظمة التصميم جرّبته، يتفوق على أشهر تطبيقين معًا، ويضاهي أي حل مؤسسي.»",
        store: "App Store،",
        handle: "rx_dev",
      },
    ],
  },
}

/** Reviews per set, as Figma lays them out. */
const PER_SET = 3

export interface SocialProofAppReviewRowProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<SocialProofAppReviewRowCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** The set shown, from 0, to control the arrows. */
  set?: number
  /** Called when the arrows or a swipe change the set. */
  onSetChange?: (set: number) => void
}

export function SocialProofAppReviewRow({
  locale = "en",
  heading,
  items,
  set: setProp,
  onSetChange,
  className,
  ...props
}: SocialProofAppReviewRowProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const listId = React.useId()
  const list = items ?? copy.items
  const count = Math.max(1, Math.ceil(list.length / PER_SET))
  const { ref: listRef, index: current, go } = useStepper<HTMLUListElement>({ count, index: setProp, onIndexChange: onSetChange, stagger: true })
  const swipe = useSwipeStep((delta) => go(current + delta))
  const shown = list.slice(current * PER_SET, current * PER_SET + PER_SET)

  return (
    <SocialProofSection labelledBy={headingId} className={className} contentClassName="gap-12" {...props}>
      <h2 id={headingId} className="text-center text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl">
        <Isolated>{heading ?? copy.heading}</Isolated>
      </h2>
      <div className="flex w-full flex-col gap-12" {...swipe}>
        <ul
          ref={listRef}
          id={listId}
          aria-live="polite"
          className="grid w-full grid-cols-1 gap-8 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:gap-10"
        >
          {shown.map((item, index) => (
            <li key={current * PER_SET + index} data-step-item="" className="min-w-0 border-s-2 border-foreground ps-5">
              <figure className="m-0 flex flex-col gap-3">
                <SocialProofStars tone="primary" locale={locale} />
                <SocialProofQuote quote={item.quote} className="text-base text-foreground" />
                <figcaption className="flex items-center gap-1.5 text-xs">
                  <SocialIcon platform="apple" className="size-4 shrink-0" />
                  <span className="font-medium text-foreground">{item.store}</span>
                  <span className="text-muted-foreground">{item.handle}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <SocialProofStepper
          index={current}
          count={count}
          onIndexChange={go}
          locale={locale}
          controls={listId}
          className="self-end"
        />
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofAppReviewRowCopy = COPY
