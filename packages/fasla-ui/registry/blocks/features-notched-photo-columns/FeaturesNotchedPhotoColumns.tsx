"use client"

import * as React from "react"
import { Archive, Bell, Database, FileText, Layers, Mail, MessageSquare, NotebookText, RefreshCw } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Notched Photo Columns.
 *
 * A two-tone heading (the first sentence in `foreground`, the second in
 * `muted-foreground`), then three columns in one 1px `border` frame. A column
 * is a photo with a corner notch cut from its top end, a numbered tag in the
 * top start corner, then a body: an 18px two-line title, a 14px line and
 * three outline Badges (Primary, small, standard radius) each with a mark.
 *
 * The photo is dimmed by a `background-inverse` scrim, 380px tall on
 * Desktop, 300px on Tablet and 240px on Mobile. Desktop sets the three
 * columns across; Tablet and Mobile stack them. A photo grows 3% on hover.
 *
 * Content limits: the heading up to 60 characters, a column's tag up to 22,
 * its two title lines up to 28 each and its line up to 130. The other limits
 * are in the block's documentation page.
 */

export interface FeaturesNotchedColumn {
  /** Keys the column. */
  id: string
  /** The number in the tag, such as "01". */
  number: React.ReactNode
  /** The words after the number on the photo. */
  tag: React.ReactNode
  /** The two lines of the title. */
  title: [React.ReactNode, React.ReactNode]
  /** One line under the title. */
  description: React.ReactNode
  /** The Badges, each a label and a Lucide mark. */
  chips: { id: string; label: string; icon: React.ElementType }[]
  /** The column's photo. */
  image?: FeaturesPhoto
}

export interface FeaturesNotchedPhotoColumnsCopy {
  /** The heading's first sentence, in `foreground`. An `h2` with the second. */
  heading: React.ReactNode
  /** The heading's second sentence, in `muted-foreground`. */
  headingMuted: React.ReactNode
  /** The columns, in order. */
  columns: FeaturesNotchedColumn[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesNotchedPhotoColumnsCopy> = {
  en: {
    heading: "Your records are already in order.",
    headingMuted: "Your answers are not.",
    columns: [
      {
        id: "records",
        number: "01",
        tag: "Your records.",
        title: ["Organised in tidy folders.", "Missing the full picture."],
        description: "Files are easy to store and hard to connect. Most of what a team knows was never written down in one place.",
        chips: [
          { id: "records", label: "Records", icon: Database },
          { id: "reports", label: "Reports", icon: FileText },
          { id: "archive", label: "Archive", icon: Archive },
        ],
      },
      {
        id: "seat",
        number: "02",
        tag: "A seat for everyone.",
        title: ["Everyone has access.", "Nobody shares context."],
        description: "The right tool reached every desk first. What it could not give anyone was a common memory of the work.",
        chips: [
          { id: "chat", label: "Chat", icon: MessageSquare },
          { id: "notes", label: "Notes", icon: NotebookText },
          { id: "mail", label: "Mail", icon: Mail },
        ],
      },
      {
        id: "summary",
        number: "03",
        tag: "A living summary.",
        title: ["Written once.", "Fresh every morning."],
        description: "It reads from live files and writes back as work happens, so the summary never waits for someone to rebuild it.",
        chips: [
          { id: "alerts", label: "Alerts", icon: Bell },
          { id: "digests", label: "Digests", icon: Layers },
          { id: "sync", label: "Sync", icon: RefreshCw },
        ],
      },
    ],
  },
  ar: {
    heading: "سجلاتك مرتبة بالفعل.",
    headingMuted: "أما إجاباتك فلا.",
    columns: [
      {
        id: "records",
        number: "01",
        tag: "سجلاتك.",
        title: ["منظَّمة في مجلدات مرتبة.", "تفتقر إلى الصورة الكاملة."],
        description: "من السهل تخزين الملفات ومن الصعب ربطها. معظم ما يعرفه الفريق لم يُدوَّن يومًا في مكان واحد.",
        chips: [
          { id: "records", label: "السجلات", icon: Database },
          { id: "reports", label: "التقارير", icon: FileText },
          { id: "archive", label: "الأرشيف", icon: Archive },
        ],
      },
      {
        id: "seat",
        number: "02",
        tag: "مقعد للجميع.",
        title: ["الجميع يملك صلاحية الوصول.", "ولا أحد يشارك السياق."],
        description: "وصلت الأداة المناسبة إلى كل مكتب أولًا. أما ما عجزت عن منحه لأحد فهو ذاكرة مشتركة للعمل.",
        chips: [
          { id: "chat", label: "المحادثة", icon: MessageSquare },
          { id: "notes", label: "الملاحظات", icon: NotebookText },
          { id: "mail", label: "البريد", icon: Mail },
        ],
      },
      {
        id: "summary",
        number: "03",
        tag: "ملخص حيّ.",
        title: ["تُكتب مرة واحدة.", "وتتجدد كل صباح."],
        description: "تقرأ من الملفات الحية وتكتب فيها فور حدوث العمل، فلا ينتظر الملخص أحدًا ليعيد بناءه.",
        chips: [
          { id: "alerts", label: "التنبيهات", icon: Bell },
          { id: "digests", label: "الملخصات", icon: Layers },
          { id: "sync", label: "المزامنة", icon: RefreshCw },
        ],
      },
    ],
  },
}

export interface FeaturesNotchedPhotoColumnsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesNotchedPhotoColumnsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
}

/**
 * The photo with its top end cut away: 70px across and 52px down, a slanted
 * edge for the first 50px. The cut is at the top end, so it mirrors in Arabic.
 */
const NOTCH =
  "[clip-path:polygon(0_0,calc(100%_-_70px)_0,calc(100%_-_20px)_52px,100%_52px,100%_100%,0_100%)] rtl:[clip-path:polygon(100%_0,70px_0,20px_52px,0_52px,0_100%,100%_100%)]"

export function FeaturesNotchedPhotoColumns({ locale = "en", heading, headingMuted, columns, className, ...props }: FeaturesNotchedPhotoColumnsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = columns ?? copy.columns

  return (
    <FeaturesSection labelledBy={headingId} gap="md" contentClassName="[@container(min-width:48rem)]:gap-12" className={className} {...props}>
      <h2 id={headingId} className="max-w-[640px] text-3xl font-medium leading-10 text-foreground [@container(min-width:48rem)]:leading-[44px] [@container(min-width:72rem)]:text-4xl [@container(min-width:72rem)]:leading-[44px]">
        {heading ?? copy.heading} <span className="text-muted-foreground">{headingMuted ?? copy.headingMuted}</span>
      </h2>
      {list.length > 0 ? (
        <ul role="list" className="grid grid-cols-1 overflow-hidden rounded-lg border border-border [@container(min-width:72rem)]:grid-cols-3">
          {list.map((column) => (
            <li key={column.id} className="group flex min-w-0 flex-col border-border [&:not(:first-child)]:border-t [@container(min-width:72rem)]:[&:not(:first-child)]:border-s [@container(min-width:72rem)]:[&:not(:first-child)]:border-t-0">
              <FeaturesPhotoSlot
                photo={column.image}
                className={`relative isolate h-60 bg-background-inverse [@container(min-width:48rem)]:h-[300px] [@container(min-width:72rem)]:h-[380px] ${NOTCH}`}
                imageClassName="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
              >
                <div aria-hidden="true" className="absolute inset-0 bg-background-inverse/[0.35]" />
                <p className="absolute start-6 top-5 flex items-center gap-2 text-sm font-medium text-foreground-inverse">
                  <span className="rounded-sm border border-foreground-inverse px-1 py-0.5 text-[10px] leading-[14px]">{column.number}</span>
                  {column.tag}
                </p>
              </FeaturesPhotoSlot>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="text-lg font-medium text-foreground">
                  {column.title[0]}
                  <br />
                  {column.title[1]}
                </h3>
                <p className="text-sm text-muted-foreground">{column.description}</p>
                <ul role="list" className="mt-auto flex flex-wrap gap-2">
                  {column.chips.map((chip) => {
                    const Icon = chip.icon
                    return (
                      <li key={chip.id} className="flex">
                        <Badge variant="outline" tone="primary" size="sm" radius="standard" icon={<Icon strokeWidth={1.5} />}>
                          {chip.label}
                        </Badge>
                      </li>
                    )
                  })}
                </ul>
              </div>
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
export const featuresNotchedPhotoColumnsCopy = COPY
