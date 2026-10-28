"use client"

import * as React from "react"
import { Pointer } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Story & Snapshots.
 *
 * A founder's letter over a scatter of polaroids. A header row puts the
 * heading at the start and a small hint at the end; under it a lead line and
 * a long paragraph, held to 760px; then four snapshots, each a `card` frame
 * with a hairline border and a medium shadow around a photo and a caption
 * row (caption at the start, date at the end).
 *
 * Figma lays the snapshots out by hand: four in a row on Desktop, each at
 * its own height (40, 14, 44 and 8px down) and tilt; a 2×2 grid on Tablet
 * and Mobile, the first of each row 20px lower (16 on Mobile). The cards
 * here sit in the same grid with the same drops and tilts, and the photos
 * shrink with them: 240×200 on Desktop, 196×160 on Tablet, 132×110 on Mobile.
 *
 * Figma's motion card makes the polaroids draggable. Yasmin's call is no
 * drag: each polaroid is a button, and pressing it brings it to the front,
 * straightened and lifted 6px, until it is pressed again. On a pointer
 * device hovering or focusing one straightens and lifts it too, with a short
 * ease-out. The hint reads "Select a photo" to match.
 *
 * In Arabic the cards run right to left and every tilt mirrors, as Figma's
 * RTL variants draw them; the photos are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content, and `[@container(min-width:64rem)]:` its Desktop,
 * from 1024px of content. The section's own padding still follows the
 * window, since an element can't query itself.
 */

export interface AboutStorySnapshotsPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutStorySnapshotsItem {
  /** The caption under the photo, at the start of its row. */
  caption: React.ReactNode
  /** The short date at the end of the caption row. */
  date: React.ReactNode
  /** The snapshot's photo. A `muted` placeholder when missing. */
  image?: AboutStorySnapshotsPhoto
}

export interface AboutStorySnapshotsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The small hint at the end of the header row. Hidden when empty. */
  hint: React.ReactNode
  /** The letter's first line, set larger. */
  lead: React.ReactNode
  /** The letter's paragraph. */
  body: React.ReactNode
  /**
   * The snapshots, from the start side. Figma draws four; more continue the
   * pattern of drops and tilts on further rows.
   */
  items: AboutStorySnapshotsItem[]
  /** Shown in place of the snapshots when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutStorySnapshotsCopy> = {
  en: {
    heading: "How we got here",
    hint: "Select a photo",
    lead: "Let me tell you how we got here. Not the polished version — the real one.",
    body: "We were a bunch of friends with a soft spot for good tools — the smell of a new notebook, the click of a tidy commit. We'd each spent years in different corners of tech, and at some point we realized the people we most wanted to build with were already in the room. So we rented two desks, bought one very loud espresso machine, and started shipping.",
    items: [
      { caption: "The first espresso", date: "MAR 2019" },
      { caption: "Launch night", date: "NOV 2021" },
      { caption: "Offsite, somewhere high", date: "JUN 2023" },
      { caption: "Miso, morale officer", date: "ALWAYS" },
    ],
    empty: "No photos yet.",
  },
  ar: {
    heading: "كيف وصلنا إلى هنا",
    hint: "اختر صورة",
    lead: "دعني أخبرك كيف وصلنا إلى هنا. ليست النسخة المصقولة، بل الحقيقية.",
    body: "كنا مجموعة أصدقاء نحب الأدوات الجيدة: رائحة دفتر جديد، ونقرة إيداع مرتّب. أمضى كل منّا سنوات في زوايا مختلفة من التقنية، وفي لحظة ما أدركنا أن الأشخاص الذين نريد البناء معهم كانوا بالفعل في الغرفة. فاستأجرنا مكتبين، واشترينا آلة إسبريسو صاخبة، وبدأنا الإطلاق.",
    items: [
      { caption: "أول إسبريسو", date: "مارس 2019" },
      { caption: "ليلة الإطلاق", date: "نوفمبر 2021" },
      { caption: "رحلة عمل، في مكان مرتفع", date: "يونيو 2023" },
      { caption: "ميسو، مسؤول المعنويات", date: "دائمًا" },
    ],
    empty: "لا توجد صور بعد.",
  },
}

/**
 * Each slot's drop and tilt, in Figma's order, repeating every four cards.
 * Mobile tilts 3°, −3°, −2°, 4°; Tablet and Desktop 4°, −3°, 2°, −5° (CSS
 * degrees, clockwise; Figma stores the opposite sign). RTL mirrors each one.
 * Every class is written out in full, so Tailwind finds it in this file.
 */
const SLOTS = [
  "mt-4 rotate-[3deg] [&:dir(rtl)]:rotate-[-3deg] [@container(min-width:40rem)]:mt-5 [@container(min-width:40rem)]:rotate-[4deg] [@container(min-width:40rem)]:[&:dir(rtl)]:rotate-[-4deg] [@container(min-width:64rem)]:mt-10",
  "rotate-[-3deg] [&:dir(rtl)]:rotate-[3deg] [@container(min-width:64rem)]:mt-[14px]",
  "mt-4 rotate-[-2deg] [&:dir(rtl)]:rotate-[2deg] [@container(min-width:40rem)]:mt-5 [@container(min-width:40rem)]:rotate-[2deg] [@container(min-width:40rem)]:[&:dir(rtl)]:rotate-[-2deg] [@container(min-width:64rem)]:mt-11",
  "rotate-[4deg] [&:dir(rtl)]:rotate-[-4deg] [@container(min-width:40rem)]:rotate-[-5deg] [@container(min-width:40rem)]:[&:dir(rtl)]:rotate-[5deg] [@container(min-width:64rem)]:mt-2",
]

/**
 * Straightened and lifted 6px: on hover (pointer devices only), on keyboard
 * focus, and while the card is the one brought to the front. `!` so it
 * beats the tilt in either direction at every size.
 */
const LIFT = [
  "hover:[@media(pointer:fine)]:z-20 hover:[@media(pointer:fine)]:!rotate-0 hover:[@media(pointer:fine)]:-translate-y-1.5",
  "focus-visible:z-20 focus-visible:!rotate-0 focus-visible:-translate-y-1.5",
  "data-[front=true]:z-10 data-[front=true]:!rotate-0 data-[front=true]:-translate-y-1.5 data-[front=true]:shadow-lg",
].join(" ")

export interface AboutStorySnapshotsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSelect">,
    Partial<AboutStorySnapshotsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Called with a snapshot's index when it is pressed, or `null` when the front one is pressed again and drops back. */
  onSelect?: (index: number | null) => void
}

export function AboutStorySnapshots({
  locale = "en",
  heading,
  hint,
  lead,
  body,
  items,
  empty,
  onSelect,
  className,
  ...props
}: AboutStorySnapshotsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const hintText = hint ?? copy.hint
  const [front, setFront] = React.useState<number | null>(null)

  const select = (index: number) => {
    const next = front === index ? null : index
    setFront(next)
    onSelect?.(next)
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <div className="flex items-start gap-12">
          <h2
            id={headingId}
            className="min-w-0 flex-1 text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
          >
            {heading ?? copy.heading}
          </h2>
          {hintText && list.length > 0 ? (
            <p className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
              <Pointer size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
              {hintText}
            </p>
          ) : null}
        </div>

        <div className="flex max-w-[760px] flex-col gap-4">
          <p className="text-base font-medium text-foreground [@container(min-width:40rem)]:text-lg">{lead ?? copy.lead}</p>
          <p className="text-base text-muted-foreground [@container(min-width:40rem)]:text-lg">{body ?? copy.body}</p>
        </div>

        {list.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ul className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-[52px] pb-4 [@container(min-width:40rem)]:gap-y-11 [@container(min-width:64rem)]:grid-cols-4 [@container(min-width:64rem)]:gap-y-12">
            {list.map((item, index) => (
              <li key={index} className="flex w-full justify-center">
                <button
                  type="button"
                  aria-pressed={front === index}
                  data-front={front === index}
                  onClick={() => select(index)}
                  className={cn(
                    "relative flex w-full max-w-[156px] cursor-pointer flex-col gap-3 rounded-md border border-border bg-card p-3 text-start shadow-md",
                    "[@container(min-width:40rem)]:max-w-[220px] [@container(min-width:64rem)]:max-w-[264px]",
                    "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    SLOTS[index % SLOTS.length],
                    LIFT
                  )}
                >
                  <span className="relative block h-[110px] w-full overflow-hidden rounded-sm bg-muted [@container(min-width:40rem)]:h-40 [@container(min-width:64rem)]:h-[200px]">
                    {item.image ? (
                      <img
                        src={item.image.src}
                        alt={item.image.alt}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : null}
                  </span>
                  <span className="flex w-full items-center gap-2">
                    <span className="min-w-0 flex-1 text-xs font-medium text-foreground [@container(min-width:40rem)]:text-sm">
                      {item.caption}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.date}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutStorySnapshotsCopy = COPY
