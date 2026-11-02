"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Photo Collage.
 *
 * A rounded `secondary` board (14px) holding seven photos scattered at slight
 * angles (-4° to 4°) with a `card` caption card laid over the middle, then
 * three short columns under it. A column is a 16px title over a 14px line.
 *
 * Desktop scatters seven photos across the board, positioned as a share of
 * its size so the scatter scales with the block. In Arabic the positions stay
 * and each tilt turns the other way, as Figma's Arabic variant does. Tablet lays six photos in
 * two columns with the caption below; Mobile lays four in one column.
 * Photos hold still; they never animate.
 *
 * Content limits: the caption's title up to 36 characters and its line up to
 * 130, a column's title up to 26 and its line up to 130. The other limits
 * are in the block's documentation page.
 */

export interface FeaturesCollageColumn {
  /** Keys the column. */
  id: string
  /** The column's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
}

export interface FeaturesPhotoCollageCopy {
  /** The caption card's title. */
  captionTitle: React.ReactNode
  /** The caption card's line. */
  captionDescription: React.ReactNode
  /** The columns under the board, in order. */
  columns: FeaturesCollageColumn[]
}

/**
 * Where each photo sits on the Desktop board (1248 × 520), as a share of the
 * board, and how it is turned (-4° to 4°). Written out as whole classes so
 * Tailwind finds them.
 */
const SCATTER = [
  "[@container(min-width:72rem)]:absolute [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:left-[3.21%] [@container(min-width:72rem)]:top-[11.54%] [@container(min-width:72rem)]:w-[19.23%] [@container(min-width:72rem)]:h-[32.69%] [@container(min-width:72rem)]:rotate-[-4deg] [@container(min-width:72rem)]:rtl:rotate-[4deg]",
  "[@container(min-width:72rem)]:absolute [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:left-[20.03%] [@container(min-width:72rem)]:top-[5.77%] [@container(min-width:72rem)]:w-[16.83%] [@container(min-width:72rem)]:h-[50%] [@container(min-width:72rem)]:rotate-[3deg] [@container(min-width:72rem)]:rtl:rotate-[-3deg]",
  "[@container(min-width:72rem)]:absolute [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:left-[24.04%] [@container(min-width:72rem)]:top-[61.54%] [@container(min-width:72rem)]:w-[18.43%] [@container(min-width:72rem)]:h-[30.77%] [@container(min-width:72rem)]:rotate-[-2deg] [@container(min-width:72rem)]:rtl:rotate-[2deg]",
  "[@container(min-width:72rem)]:absolute [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:left-[38.46%] [@container(min-width:72rem)]:top-[17.31%] [@container(min-width:72rem)]:w-[24.04%] [@container(min-width:72rem)]:h-[38.46%] [@container(min-width:72rem)]:rotate-[2deg] [@container(min-width:72rem)]:rtl:rotate-[-2deg]",
  "[@container(min-width:72rem)]:absolute [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:left-[64.1%] [@container(min-width:72rem)]:top-[7.69%] [@container(min-width:72rem)]:w-[16.83%] [@container(min-width:72rem)]:h-[53.85%] [@container(min-width:72rem)]:rotate-[-3deg] [@container(min-width:72rem)]:rtl:rotate-[3deg]",
  "[@container(min-width:72rem)]:absolute [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:left-[64.9%] [@container(min-width:72rem)]:top-[65.38%] [@container(min-width:72rem)]:w-[20.03%] [@container(min-width:72rem)]:h-[30.77%] [@container(min-width:72rem)]:rotate-[4deg] [@container(min-width:72rem)]:rtl:rotate-[-4deg]",
  "[@container(min-width:72rem)]:absolute [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:left-[83.33%] [@container(min-width:72rem)]:top-[23.08%] [@container(min-width:72rem)]:w-[15.22%] [@container(min-width:72rem)]:h-[48.08%] [@container(min-width:72rem)]:rotate-[2deg] [@container(min-width:72rem)]:rtl:rotate-[-2deg]",
] as const

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesPhotoCollageCopy> = {
  en: {
    captionTitle: "Built by a team that ships on it",
    captionDescription: "Every release is planned, reviewed and shipped inside the product itself — the roadmap you see is the one we work from.",
    columns: [
      { id: "model", title: "One model, many views", description: "Boards, tables, timelines and charts all read the same records — switching view never means migrating data." },
      { id: "teams", title: "Made for real teams", description: "Guests, contractors and part-time reviewers all fit without a licence conversation or a shared login." },
      { id: "leave", title: "Yours to leave with", description: "A complete export of every object, attachment and revision is one click away, on every plan." },
    ],
  },
  ar: {
    captionTitle: "بناه فريق يستخدمه في عمله",
    captionDescription: "كل إصدار يُخطَّط ويُراجَع ويُطلَق داخل المنتج نفسه، وخارطة الطريق التي تراها هي التي نعمل بها.",
    columns: [
      { id: "model", title: "نموذج واحد وعروض متعددة", description: "اللوحات والجداول والجداول الزمنية والرسوم البيانية تقرأ السجلات نفسها، وتبديل العرض لا يعني ترحيل البيانات." },
      { id: "teams", title: "مصمَّم لفرق حقيقية", description: "الضيوف والمتعاقدون والمراجعون بدوام جزئي يتسع لهم الاستفادة من هذه الميزة دون الحاجة إلى محادثة ترخيص أو تسجيل دخول مشترك." },
      { id: "leave", title: "لك أن تأخذها معك", description: "أصبح تصدير كل عنصر ومرفق ومراجعة بالكامل متاحًا بنقرة واحدة، في كل خطة." },
    ],
  },
}

export interface FeaturesPhotoCollageProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesPhotoCollageCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** Up to seven photos, in Figma's order. Placeholders show for any left out; Tablet draws the first six and Mobile the first four. */
  photos?: FeaturesPhoto[]
  /** The section's heading for assistive technology: the caption's title by default. */
  heading?: React.ReactNode
}

export function FeaturesPhotoCollage({ locale = "en", captionTitle, captionDescription, columns, photos, heading, className, ...props }: FeaturesPhotoCollageProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = columns ?? copy.columns
  const caption = (
    <div className="flex flex-col gap-2 rounded-lg bg-card p-6 text-card-foreground shadow-md">
      <h2 id={headingId} className="text-xl font-semibold text-card-foreground">
        {heading ?? captionTitle ?? copy.captionTitle}
      </h2>
      <p className="text-sm text-muted-foreground">{captionDescription ?? copy.captionDescription}</p>
    </div>
  )

  return (
    <FeaturesSection labelledBy={headingId} gap="md" contentClassName="gap-12" className={className} {...props}>
      <div className="contents [@container(min-width:72rem)]:relative [@container(min-width:72rem)]:block">
      <div className="relative rounded-2xl bg-secondary p-4 [@container(min-width:72rem)]:aspect-[1248/520] [@container(min-width:72rem)]:p-0">
        <div className="grid grid-cols-1 gap-4 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:72rem)]:block">
          {SCATTER.map((spot, index) => (
            <FeaturesPhotoSlot
              key={index}
              photo={photos?.[index]}
              className={cn(
                "aspect-[264/180] w-full rounded-lg shadow-md [@container(min-width:48rem)]:aspect-[296/200]",
                index >= 4 && "hidden [@container(min-width:48rem)]:block",
                index >= 6 && "[@container(min-width:48rem)]:hidden [@container(min-width:72rem)]:block",
                spot
              )}
            />
          ))}
        </div>
      </div>
        <div className="[@container(min-width:72rem)]:absolute [@container(min-width:72rem)]:left-[33.17%] [@container(min-width:72rem)]:top-[57.7%] [@container(min-width:72rem)]:z-10 [@container(min-width:72rem)]:w-[33.65%]">
          {caption}
        </div>
      </div>
      {list.length > 0 ? (
        <ul role="list" className="grid grid-cols-1 gap-16 [@container(min-width:48rem)]:grid-cols-3">
          {list.map((column) => (
            <li key={column.id} className="flex min-w-0 flex-col gap-2">
              <h3 className="text-base font-semibold text-foreground">{column.title}</h3>
              <p className="text-sm text-muted-foreground">{column.description}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresPhotoCollageCopy = COPY
