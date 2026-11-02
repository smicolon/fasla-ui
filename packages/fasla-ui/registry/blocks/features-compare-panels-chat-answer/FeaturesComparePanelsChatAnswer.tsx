"use client"

import * as React from "react"
import { ArrowRight, BookOpen, ChartLine, File, FileCode, Folder, Link2, Mail, MessageSquare, NotebookText, Receipt, Sparkles } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge, badgeVariants } from "../../ui/badge/badge"
import { FeaturesRule, FeaturesSection, Figures, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Compare Panels + Chat Answer.
 *
 * A two-tone heading (the first sentence in `foreground`, the second in
 * `muted-foreground`) and a 14px line, then a 1px `border` frame holding two
 * panels side by side: Static map on `muted`, with an outline Badge, a red
 * Soft Stale badge and a dashed 41% mark over files that read JAN 2026, and
 * Fasla on an `info` wash, with a Live badge, a floating spark and link
 * button, a 99% mark and files that read JUST NOW. A hairline joins them to
 * a chat module on a neutral wash: a breadcrumb, the user's question, an
 * answer with a Sources row of five chips, and a file card, then a closing
 * line. At Mobile the file ages (JAN 2026, JUST NOW, 3S AGO…) are left out,
 * as Figma's Mobile leaves them out.
 *
 * Each source chip is a button wearing the Badge classes. Pressing one opens
 * that source's file card under the chips (the chip's `aria-expanded` says
 * so); Files is open at first, as Figma draws it. The other four cards are
 * written for the code, since Figma draws one. File names stay Latin in
 * Arabic, as identifiers do.
 *
 * Desktop sets the panels side by side with the chat module under them.
 * Tablet and Mobile stack the panels and shrink the chat card's padding.
 *
 * Content limits: each sentence of the heading up to 45 characters, a panel's
 * title up to 32 and its line up to 40, the answer up to 170. The other
 * limits are in the block's documentation page.
 */

export interface FeaturesComparePanelFile {
  /** The file's name, which stays Latin. */
  name: string
  /** How old it is, such as "JAN 2026" or "3S AGO". */
  age: string
}

export interface FeaturesComparePanelsChatAnswerSource {
  /** Keys the chip. */
  id: "billing" | "chat" | "notes" | "mail" | "files"
  /** The chip's label. */
  label: string
  /** The file card that opens under the chips. */
  file: { name: string; writtenBy: string; when: string }
}

export interface FeaturesComparePanelsChatAnswerCopy {
  /** The heading's first sentence, in `foreground`. An `h2` with the second. */
  heading: React.ReactNode
  /** The heading's second sentence, in `muted-foreground`. */
  headingMuted: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  staticPanel: { badge: string; status: string; title: React.ReactNode; description: React.ReactNode; label: string; figure: string; files: FeaturesComparePanelFile[] }
  livePanel: { badge: string; status: string; title: React.ReactNode; description: React.ReactNode; label: string; figure: string; files: FeaturesComparePanelFile[] }
  chat: {
    breadcrumb: [string, string]
    question: string
    answer: string
    sourcesLabel: string
    sources: FeaturesComparePanelsChatAnswerSource[]
    writtenByLabel: string
    whenLabel: string
  }
  closing: React.ReactNode
}

const FILE_ICONS = [ChartLine, FileCode, BookOpen, File, File]
const SOURCE_ICONS = { billing: Receipt, chat: MessageSquare, notes: NotebookText, mail: Mail, files: Folder } as const
const FADE = ["opacity-100", "opacity-100", "opacity-100", "opacity-[0.55]", "opacity-25"]

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesComparePanelsChatAnswerCopy> = {
  en: {
    heading: "A static map tells you what was true.",
    headingMuted: "Fasla tells you what is true.",
    description: "Your context lives in files the work itself writes to. History is free, updates are instant, and every answer names the file it came from.",
    staticPanel: {
      badge: "Static map",
      status: "Stale",
      title: "A static map is built once.",
      description: "Accurate on the day it shipped.",
      label: "Still current:",
      figure: "41%",
      files: [
        { name: "pipeline-q3.md", age: "JAN 2026" },
        { name: "customer-tiers.yaml", age: "JAN 2026" },
        { name: "objection-playbook.md", age: "JAN 2026" },
        { name: "team-roles.md", age: "JAN 2026" },
        { name: "brand-voice.md", age: "JAN 2026" },
      ],
    },
    livePanel: {
      badge: "Fasla",
      status: "Live",
      title: "Fasla updates dynamically.",
      description: "Updated by the work itself.",
      label: "Still current:",
      figure: "99%",
      files: [
        { name: "pipeline-q3.md", age: "JUST NOW" },
        { name: "customer-tiers.yaml", age: "3S AGO" },
        { name: "objection-playbook.md", age: "6S AGO" },
        { name: "team-roles.md", age: "9S AGO" },
        { name: "brand-voice.md", age: "12S AGO" },
      ],
    },
    chat: {
      breadcrumb: ["Chat", "Weekly planning review"],
      question: "Why did this team miss its target last month?",
      answer: "Three of the last five handoffs landed outside the agreed window. The standard was tightened in April.",
      sourcesLabel: "Sources:",
      writtenByLabel: "LAST WRITTEN BY",
      whenLabel: "WHEN",
      sources: [
        { id: "billing", label: "Billing", file: { name: "/finance/invoices-q3.csv", writtenBy: "FINANCE", when: "28 FEB" } },
        { id: "chat", label: "Chat", file: { name: "/threads/weekly-planning-review.log", writtenBy: "OPS-TEAM", when: "1 MAR" } },
        { id: "notes", label: "Notes", file: { name: "/notes/handoff-retro.md", writtenBy: "PRODUCT", when: "4 MAR" } },
        { id: "mail", label: "Mail", file: { name: "/inbox/handoff-exceptions.eml", writtenBy: "SUPPORT", when: "3 MAR" } },
        { id: "files", label: "Files", file: { name: "/standards/handoff-playbook.md", writtenBy: "OPS-TEAM", when: "2 MAR" } },
      ],
    },
    closing: "Open any file behind that answer and you can see which version was read and who changed it last. Nobody signs off on an answer they cannot check.",
  },
  ar: {
    heading: "الخريطة الثابتة تخبرك بما كان صحيحًا.",
    headingMuted: "وفاصلة تخبرك بما هو صحيح الآن.",
    description: "سياقك محفوظ في ملفات يكتب فيها العمل نفسه. سجل التغييرات مجاني، والتحديثات فورية، وكل إجابة تذكر الملف الذي جاءت منه.",
    staticPanel: {
      badge: "خريطة ثابتة",
      status: "قديمة",
      title: "تُبنى الخريطة الثابتة مرة واحدة.",
      description: "دقيقة يوم إصدارها.",
      label: "ما زالت محدَّثة:",
      figure: "41 بالمئة",
      files: [
        { name: "pipeline-q3.md", age: "يناير 2026" },
        { name: "customer-tiers.yaml", age: "يناير 2026" },
        { name: "objection-playbook.md", age: "يناير 2026" },
        { name: "team-roles.md", age: "يناير 2026" },
        { name: "brand-voice.md", age: "يناير 2026" },
      ],
    },
    livePanel: {
      badge: "فاصلة",
      status: "مباشرة",
      title: "تتحدّث فاصلة تلقائيًا.",
      description: "يحدّثها العمل نفسه.",
      label: "ما زالت محدَّثة:",
      figure: "99 بالمئة",
      files: [
        { name: "pipeline-q3.md", age: "الآن" },
        { name: "customer-tiers.yaml", age: "قبل 3 ث" },
        { name: "objection-playbook.md", age: "قبل 6 ث" },
        { name: "team-roles.md", age: "قبل 9 ث" },
        { name: "brand-voice.md", age: "قبل 12 ث" },
      ],
    },
    chat: {
      breadcrumb: ["المحادثة", "مراجعة التخطيط الأسبوعي"],
      question: "لماذا أخفق هذا الفريق في تحقيق هدفه الشهر الماضي؟",
      answer: "ثلاث من آخر خمس عمليات تسليم جاءت خارج المدة المتفق عليها. وقد شُدِّد المعيار في أبريل.",
      sourcesLabel: "المصادر:",
      writtenByLabel: "آخر تعديل بواسطة",
      whenLabel: "التاريخ",
      sources: [
        { id: "billing", label: "الفوترة", file: { name: "/finance/invoices-q3.csv", writtenBy: "فريق المالية", when: "28 فبراير" } },
        { id: "chat", label: "المحادثة", file: { name: "/threads/weekly-planning-review.log", writtenBy: "فريق العمليات", when: "1 مارس" } },
        { id: "notes", label: "الملاحظات", file: { name: "/notes/handoff-retro.md", writtenBy: "فريق المنتج", when: "4 مارس" } },
        { id: "mail", label: "البريد", file: { name: "/inbox/handoff-exceptions.eml", writtenBy: "فريق الدعم", when: "3 مارس" } },
        { id: "files", label: "الملفات", file: { name: "/standards/handoff-playbook.md", writtenBy: "فريق العمليات", when: "2 مارس" } },
      ],
    },
    closing: "افتح أي ملف وراء تلك الإجابة لترى أي نسخة قُرئت ومن عدّلها آخر مرة. لا أحد يعتمد إجابة لا يستطيع التحقق منها.",
  },
}

export interface FeaturesComparePanelsChatAnswerProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "defaultValue">, Partial<FeaturesComparePanelsChatAnswerCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The `id` of the source whose file card is open. Files by default. */
  defaultSource?: FeaturesComparePanelsChatAnswerSource["id"]
}

function FileRow({ file, index }: { file: FeaturesComparePanelFile; index: number }) {
  const Icon = FILE_ICONS[index % FILE_ICONS.length]!
  return (
    <li className={cn("flex items-center", FADE[index] ?? "opacity-25")}>
      <span className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-2 py-1 text-sm text-foreground">
        <Icon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0 text-muted-foreground" />
        <span className="min-w-0 truncate" dir="ltr">
          {file.name}
        </span>
      </span>
      <span className="hidden shrink-0 ps-0 text-xxs font-medium uppercase text-muted-foreground [@container(min-width:48rem)]:inline">{file.age}</span>
    </li>
  )
}

export function FeaturesComparePanelsChatAnswer({ locale = "en", heading, headingMuted, description, staticPanel, livePanel, chat, closing, defaultSource = "files", className, ...props }: FeaturesComparePanelsChatAnswerProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const panelA = staticPanel ?? copy.staticPanel
  const panelB = livePanel ?? copy.livePanel
  const chatCopy = chat ?? copy.chat
  const [open, setOpen] = React.useState<FeaturesComparePanelsChatAnswerSource["id"]>(defaultSource)
  const openSource = chatCopy.sources.find((source) => source.id === open) ?? chatCopy.sources[0]
  const cardId = React.useId()

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} contentClassName="[@container(min-width:48rem)]:gap-12" {...props}>
      <header className="flex flex-col items-start gap-4">
        <h2 id={headingId} className="max-w-[700px] text-3xl font-medium text-foreground [@container(min-width:48rem)]:leading-[44px] [@container(min-width:48rem)]:rtl:leading-[60px] [@container(min-width:72rem)]:text-4xl">
          {heading ?? copy.heading} <span className="text-muted-foreground">{headingMuted ?? copy.headingMuted}</span>
        </h2>
        <p className="max-w-[600px] text-sm text-muted-foreground">{description ?? copy.description}</p>
      </header>

      <div className="flex flex-col gap-3 border border-border p-3 [@container(min-width:72rem)]:flex-row">
        {[
          { key: "static", panel: panelA, live: false },
          { key: "live", panel: panelB, live: true },
        ].map(({ key, panel, live }) => (
          <section key={key} className={cn("flex min-w-0 flex-1 flex-col gap-2 p-4 [@container(min-width:48rem)]:p-6", live ? "bg-info/20" : "bg-muted")}>
            <div className="flex items-center gap-2">
              <Badge variant="outline" tone="primary" size="sm" radius="standard" icon={live ? <Sparkles strokeWidth={1.5} /> : undefined}>
                {panel.badge}
              </Badge>
              <Badge variant="soft" tone={live ? "success" : "destructive"} size="sm" radius="standard">
                {panel.status}
              </Badge>
            </div>
            <h3 className="text-xl font-medium text-foreground">{panel.title}</h3>
            <p className="text-sm text-muted-foreground">{panel.description}</p>
            <div className="relative flex flex-1 items-center justify-center pt-6 [@container(min-width:48rem)]:pt-8 [@container(min-width:72rem)]:h-[360px] [@container(min-width:72rem)]:flex-none">
              <div className={cn("h-fit w-full max-w-[392px] rounded-3xl p-2 [@container(min-width:48rem)]:p-4", live ? "bg-info/10" : "bg-foreground/10")}>
                <div className="flex flex-col gap-4 rounded-2xl bg-card p-3 text-card-foreground [@container(min-width:48rem)]:p-6">
                  <p className="flex items-center gap-2 whitespace-nowrap text-lg text-foreground">
                    {panel.label}
                    <span className={cn("rounded-[10px] px-3 py-1 text-xl font-medium", live ? "bg-info/30 text-foreground" : "border border-dashed border-muted-foreground text-muted-foreground")}>
                      <Figures>{panel.figure}</Figures>
                    </span>
                  </p>
                  <ul role="list" className="flex flex-col gap-3">
                    {panel.files.map((file, index) => (
                      <FileRow key={file.name} file={file} index={index} />
                    ))}
                  </ul>
                </div>
              </div>
              {live ? (
                <>
                  <span aria-hidden="true" className="absolute end-0 top-[-2px] flex size-16 items-center justify-center rounded-xl bg-card text-foreground shadow-md [@container(min-width:48rem)]:start-[calc(50%+110px)] [@container(min-width:48rem)]:end-auto [@container(min-width:48rem)]:top-[-4px]">
                    <Sparkles size={28} strokeWidth={1.5} absoluteStrokeWidth />
                  </span>
                  <span aria-hidden="true" className="absolute start-[calc(50%+220px)] top-[60px] hidden size-12 items-center justify-center rounded-[10px] bg-card text-info shadow-md [@container(min-width:48rem)]:flex">
                    <Link2 size={22} strokeWidth={1.5} absoluteStrokeWidth />
                  </span>
                </>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <div className="flex justify-center">
        <FeaturesRule className="h-10 w-px" />
      </div>

      <div className="flex flex-col overflow-hidden bg-foreground/10 px-4 pt-4 [@container(min-width:48rem)]:px-10 [@container(min-width:48rem)]:pt-10 [@container(min-width:72rem)]:min-h-[470px]">
        <div className="flex flex-1 flex-col gap-6 rounded-t-xl bg-card p-4 text-card-foreground [@container(min-width:48rem)]:gap-8 [@container(min-width:48rem)]:p-8">
          <p className="flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
            <MessageSquare size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
            {chatCopy.breadcrumb[0]}
            <ArrowRight size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
            {chatCopy.breadcrumb[1]}
          </p>
          <p className="max-w-full self-start rounded-xl bg-muted px-5 py-3 text-sm text-foreground">{chatCopy.question}</p>
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
              <Sparkles size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <p className="max-w-[560px] text-sm font-medium text-foreground">{chatCopy.answer}</p>
              <span className="text-xs text-muted-foreground">{chatCopy.sourcesLabel}</span>
              <div className="flex flex-wrap items-center gap-2">
                {chatCopy.sources.map((source) => {
                  const Icon = SOURCE_ICONS[source.id]
                  const active = source.id === open
                  return (
                    <button
                      key={source.id}
                      type="button"
                      aria-expanded={active}
                      aria-controls={active ? cardId : undefined}
                      onClick={() => setOpen(source.id)}
                      className={cn(
                        badgeVariants({ variant: "soft", tone: "secondary", size: "md", radius: "standard" }),
                        "cursor-pointer hover:ring-1 hover:ring-inset hover:ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      <Icon size={12} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                      {source.label}
                    </button>
                  )
                })}
              </div>
              {openSource ? (
                <div id={cardId} className="flex w-full flex-col gap-2 rounded-[10px] border border-border bg-card p-3 text-card-foreground shadow-md [@container(min-width:72rem)]:w-[300px]">
                  <p className="flex items-center gap-2 text-xs font-medium text-foreground" dir="ltr">
                    <File size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0" />
                    <span className="min-w-0 break-all">{openSource.file.name}</span>
                  </p>
                  <dl className="flex flex-col gap-2 text-xxs font-medium text-muted-foreground">
                    <div className="flex items-start justify-between gap-4">
                      <dt>{chatCopy.writtenByLabel}</dt>
                      <dd className="text-foreground">{openSource.file.writtenBy}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt>{chatCopy.whenLabel}</dt>
                      <dd className="text-foreground">{openSource.file.when}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <p className="text-lg font-medium text-foreground">{closing ?? copy.closing}</p>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresComparePanelsChatAnswerCopy = COPY
