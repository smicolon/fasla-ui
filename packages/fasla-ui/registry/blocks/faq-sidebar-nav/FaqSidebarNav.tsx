"use client"

import * as React from "react"
import { CodeIcon, CreditCardIcon, LanguagesIcon, LayersIcon, PaletteIcon, RefreshCwIcon, RocketIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"

/*
 * Figma: `FAQ` (42359:9029), Type=Sidebar Nav.
 *
 * A list of help topics beside the selected topic's questions. The topics are
 * vertical tabs: the library's Tabs, set vertical, so the arrow keys move up
 * and down the list, Home and End jump to its ends, and the panel follows.
 * Each tab is styled from here to match Figma's Side Bar Inside Item: a 40px
 * row inset 16px from the column, a 6px radius, `sidebar-accent` on hover and
 * `sidebar-primary` while selected.
 *
 * On a phone the list sits above the questions, full width. The topic's
 * name heads its panel; the list's own label names the section.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqSidebarNavItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqSidebarNavTopic {
  /** Identifies the topic for `defaultTopic`. */
  value: string
  /** The tab's label, and the panel's heading. */
  label: React.ReactNode
  /** A 16px icon before the label, usually a lucide icon. */
  icon?: React.ReactNode
  description?: React.ReactNode
  items: FaqSidebarNavItem[]
}

export interface FaqSidebarNavCopy {
  /** The heading over the topics, which names the list. */
  navLabel: React.ReactNode
  /** The topics in the sidebar, each a tab. Each has a `value`, a `label`, an optional `icon` and `description`, and its `items`, the questions its panel shows: `question`, `answer` and an optional `value`. */
  topics: FaqSidebarNavTopic[]
  /** Shown in place of a topic's questions when it has none. */
  empty: React.ReactNode
}

const ICONS = {
  start: <RocketIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />,
  billing: <CreditCardIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />,
  theming: <PaletteIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />,
  rtl: <LanguagesIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />,
  responsive: <LayersIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />,
  handoff: <CodeIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />,
  releases: <RefreshCwIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />,
}

/**
 * Figma's copy, English and Arabic. Figma shows Getting started; the other
 * topics are written to match.
 */
const COPY: Record<"en" | "ar", FaqSidebarNavCopy> = {
  en: {
    navLabel: "Help topics",
    topics: [
      {
        value: "getting-started",
        label: "Getting started",
        icon: ICONS.start,
        description:
          "Everything you need in the first hour: enabling the library, reading the token collections and placing your first block.",
        items: [
          {
            question: "How do I enable the library for my team?",
            answer:
              "From the file, open the Assets panel, choose Libraries, then publish. Anyone in a team with the library enabled sees Fasla components in their Assets panel immediately.",
          },
          {
            question: "Which file should I open first?",
            answer: "Open the Foundations page. It shows the tokens every component reads, before you place one.",
          },
          {
            question: "How is the file organised?",
            answer: "One page per component family, with atoms first, then blocks, then templates.",
          },
          {
            question: "What do the emoji page prefixes mean?",
            answer: "They show each page’s status: a green dot is ready to use, a yellow one is still in review.",
          },
          {
            question: "Where is the changelog?",
            answer: "On the Changelog page, at the top of the file. Every release lists what was added and fixed.",
          },
          {
            question: "How do I report something broken?",
            answer: "Leave a comment on the component in Figma, or write to support with a link to the frame.",
          },
        ],
      },
      {
        value: "licensing",
        label: "Licensing & billing",
        icon: ICONS.billing,
        description: "Seats, invoices and what one licence covers.",
        items: [
          { question: "What counts as a seat?", answer: "One person with edit access to the library. Viewers are free." },
          { question: "How do I get an invoice?", answer: "Every payment emails one. Past invoices are in your account." },
          { question: "Can I change plans later?", answer: "Yes. Upgrades apply at once; we prorate the difference." },
        ],
      },
      {
        value: "theming",
        label: "Theming",
        icon: ICONS.theming,
        description: "Bring your brand to every component through the theme variables.",
        items: [
          { question: "How do I change the colours?", answer: "Edit the theme variables in the Mode collection." },
          { question: "Is dark mode included?", answer: "Yes. Every token has a light and a dark value." },
          { question: "Can I change the radius?", answer: "Yes. Radius is a variable, so one change reaches every component." },
        ],
      },
      {
        value: "rtl",
        label: "RTL & Arabic",
        icon: ICONS.rtl,
        description: "Mirrored layouts, the Arabic type ramp and which icons flip.",
        items: [
          { question: "How do I switch a block to Arabic?", answer: "Set its Direction property to RTL." },
          { question: "Which font does Arabic use?", answer: "Cairo, with its own line heights for every size." },
          { question: "Which icons flip in RTL?", answer: "Only directional ones, such as arrows and chevrons that point the way." },
        ],
      },
      {
        value: "responsive",
        label: "Responsive blocks",
        icon: ICONS.responsive,
        description: "Desktop, tablet and mobile variants for every block.",
        items: [
          { question: "Which breakpoints are there?", answer: "Desktop at 1440, tablet at 768 and mobile at 360." },
          { question: "Do blocks reflow on their own?", answer: "Yes. Each block uses auto layout, so content reflows as it grows." },
          { question: "Can I add my own breakpoint?", answer: "Duplicate the nearest variant and adjust it to your width." },
        ],
      },
      {
        value: "handoff",
        label: "Developer handoff",
        icon: ICONS.handoff,
        description: "From Dev Mode to the code library, with the same names on both sides.",
        items: [
          { question: "Does Fasla support Dev Mode?", answer: "Yes. Every component carries Code Connect." },
          { question: "Is there a code library?", answer: "Yes. The React components install with one command." },
          { question: "Do token names match the code?", answer: "Yes. Each Figma variable has a Tailwind class of the same name." },
        ],
      },
      {
        value: "releases",
        label: "Releases",
        icon: ICONS.releases,
        description: "What changed, what is next and how updates reach you.",
        items: [
          { question: "How often do you release?", answer: "Once a month, with fixes in between when they are urgent." },
          { question: "How do I get an update?", answer: "Accept the library update prompt in Figma." },
          { question: "Will an update break my designs?", answer: "No. Breaking changes are announced a release ahead, with a guide." },
        ],
      },
    ],
    empty: "No questions in this topic yet.",
  },
  ar: {
    navLabel: "مواضيع المساعدة",
    topics: [
      {
        value: "getting-started",
        label: "البداية",
        icon: ICONS.start,
        description: "كل ما تحتاجه في الساعة الأولى: تفعيل المكتبة، وقراءة مجموعات الرموز، ووضع أول كتلة لك.",
        items: [
          {
            question: "كيف أفعّل المكتبة لفريقي؟",
            answer:
              "من داخل الملف، افتح لوحة Assets واختر Libraries ثم انشر. وسيرى كل من فعّل المكتبة مكوّنات فاصلة في لوحته فورًا.",
          },
          {
            question: "أي ملف ينبغي أن أفتح أولًا؟",
            answer: "افتح صفحة الأساسيات. تعرض الرموز التي يقرؤها كل مكوّن قبل أن تضع أيًّا منها.",
          },
          {
            question: "كيف يُنظَّم الملف؟",
            answer: "صفحة لكل عائلة مكوّنات: المكوّنات الأساسية أولًا، ثم الكتل، ثم القوالب.",
          },
          {
            question: "ماذا تعني رموز الإيموجي في أسماء الصفحات؟",
            answer: "تبيّن حالة كل صفحة: النقطة الخضراء تعني أنها جاهزة، والصفراء أنها ما زالت قيد المراجعة.",
          },
          {
            question: "أين سجلّ التغييرات؟",
            answer: "في صفحة سجلّ التغييرات أعلى الملف. يذكر كل إصدار ما أُضيف وما أُصلح.",
          },
          {
            question: "كيف أبلّغ عن خلل؟",
            answer: "اترك تعليقًا على المكوّن في Figma، أو راسل الدعم مع رابط الإطار.",
          },
        ],
      },
      {
        value: "licensing",
        label: "التراخيص والفوترة",
        icon: ICONS.billing,
        description: "المقاعد والفواتير وما يغطيه الترخيص الواحد.",
        items: [
          { question: "ما المقصود بالمقعد؟", answer: "شخص واحد لديه صلاحية التحرير على المكتبة. أما المشاهدون فمجانيون." },
          { question: "كيف أحصل على فاتورة؟", answer: "تصلك فاتورة بالبريد مع كل دفعة، وتجد الفواتير السابقة في حسابك." },
          { question: "هل يمكنني تغيير الخطة لاحقًا؟", answer: "نعم. تسري الترقية فورًا، ونحتسب الفرق حسب المدة." },
        ],
      },
      {
        value: "theming",
        label: "السمات",
        icon: ICONS.theming,
        description: "طبّق علامتك التجارية على كل مكوّن عبر متغيّرات السمة.",
        items: [
          { question: "كيف أغيّر الألوان؟", answer: "عدّل متغيّرات السمة في مجموعة Mode." },
          { question: "هل الوضع الداكن مضمَّن؟", answer: "نعم. لكل رمز قيمة فاتحة وأخرى داكنة." },
          { question: "هل يمكنني تغيير نصف القطر؟", answer: "نعم. نصف القطر متغيّر، فيصل تغيير واحد إلى كل المكوّنات." },
        ],
      },
      {
        value: "rtl",
        label: "العربية واتجاه اليمين",
        icon: ICONS.rtl,
        description: "تخطيطات معكوسة، وسلّم الخطوط العربي، والأيقونات التي تنقلب.",
        items: [
          { question: "كيف أحوّل كتلة إلى العربية؟", answer: "اضبط خاصية الاتجاه على RTL." },
          { question: "ما الخط الذي تستخدمه العربية؟", answer: "خط Cairo، بارتفاعات أسطر خاصة به لكل حجم." },
          { question: "ما الأيقونات التي تنقلب في اتجاه اليمين؟", answer: "الأيقونات الاتجاهية فقط، مثل الأسهم التي تشير إلى وجهة." },
        ],
      },
      {
        value: "responsive",
        label: "الكتل المتجاوبة",
        icon: ICONS.responsive,
        description: "نسخ لسطح المكتب والجهاز اللوحي والهاتف لكل كتلة.",
        items: [
          {
            question: "ما نقاط التوقف المتاحة؟",
            answer: (
              <>
                سطح المكتب عند <bdi dir="ltr">1440</bdi>، والجهاز اللوحي عند <bdi dir="ltr">768</bdi>، والهاتف عند{" "}
                <bdi dir="ltr">360</bdi>.
              </>
            ),
          },
          { question: "هل تعيد الكتل ترتيب نفسها تلقائيًا؟", answer: "نعم. تستخدم كل كتلة التخطيط التلقائي، فيتكيّف المحتوى مع نموّه." },
          { question: "هل يمكنني إضافة نقطة توقف خاصة بي؟", answer: "انسخ أقرب نسخة وعدّلها لتناسب العرض الذي تريده." },
        ],
      },
      {
        value: "handoff",
        label: "التسليم إلى المطوّرين",
        icon: ICONS.handoff,
        description: "من Dev Mode إلى مكتبة الشيفرة، بالأسماء نفسها في الجانبين.",
        items: [
          { question: "هل تدعم فاصلة Dev Mode؟", answer: "نعم. يحمل كل مكوّن ربط Code Connect." },
          { question: "هل توجد مكتبة شيفرة؟", answer: "نعم. تُثبَّت مكوّنات React بأمر واحد." },
          { question: "هل تطابق أسماء الرموز الشيفرة؟", answer: "نعم. لكل متغيّر في Figma صنف Tailwind بالاسم نفسه." },
        ],
      },
      {
        value: "releases",
        label: "الإصدارات",
        icon: ICONS.releases,
        description: "ما الذي تغيّر، وما القادم، وكيف تصلك التحديثات.",
        items: [
          { question: "كم مرة تصدرون تحديثًا؟", answer: "مرة كل شهر، مع إصلاحات عاجلة بينها عند الحاجة." },
          { question: "كيف أحصل على التحديث؟", answer: "اقبل إشعار تحديث المكتبة في Figma." },
          { question: "هل يُفسد التحديث تصاميمي؟", answer: "لا. نعلن التغييرات الجذرية قبل إصدار كامل، مع دليل للانتقال." },
        ],
      },
    ],
    empty: "لا توجد أسئلة في هذا الموضوع بعد.",
  },
}

/**
 * Tabs leaves `orientation` out of its props, as Figma's Tabs are a row.
 * Base UI's root still reads it, so it is passed through as a spread: the
 * list then gets `aria-orientation="vertical"` and the Up and Down keys.
 */
const VERTICAL = { orientation: "vertical" as const }

export interface FaqSidebarNavProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FaqSidebarNavCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The topic shown at first, by `value`. The first topic, by default.
   * @default the first topic
   */
  defaultTopic?: string
  /** The items open at first in each topic, by `value`. The first item, by default. */
  defaultValue?: string[]
}

export function FaqSidebarNav({
  locale = "en",
  navLabel,
  topics,
  empty,
  defaultTopic,
  defaultValue = ["0"],
  className,
  ...props
}: FaqSidebarNavProps) {
  const copy = COPY[locale]
  const labelId = React.useId()
  const list = topics ?? copy.topics

  return (
    <section
      aria-labelledby={labelId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1248px]">
        <Tabs
          {...VERTICAL}
          defaultValue={defaultTopic ?? list[0]?.value}
          className="flex flex-col gap-6 md:flex-row md:items-start md:gap-16"
        >
          <div className="flex w-full shrink-0 flex-col gap-1 pb-2 md:w-[280px]">
            <p id={labelId} className="flex h-6 items-center text-xs font-semibold text-muted-foreground">
              {navLabel ?? copy.navLabel}
            </p>
            <TabsList
              aria-labelledby={labelId}
              className="flex flex-col items-stretch gap-1 rounded-none bg-transparent p-0"
            >
              {list.map((topic) => (
                <TabsTrigger
                  key={topic.value}
                  value={topic.value}
                  className={cn(
                    "mx-4 h-10 justify-start gap-2 rounded-[var(--radius-sm)] px-2 text-start font-normal text-sidebar-foreground",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "data-[active]:bg-sidebar-primary data-[active]:text-sidebar-primary-foreground data-[active]:shadow-none",
                    "[&>span]:truncate"
                  )}
                >
                  {topic.icon}
                  <span>{topic.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {list.map((topic) => (
            <TabsContent key={topic.value} value={topic.value} className="mt-0 flex min-w-0 flex-1 flex-col gap-6">
              <header className="flex max-w-[840px] flex-col gap-2">
                <h2 className="text-2xl font-semibold text-foreground">{topic.label}</h2>
                {topic.description && <p className="text-sm text-muted-foreground">{topic.description}</p>}
              </header>
              {topic.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p>
              ) : (
                <Accordion defaultValue={defaultValue}>
                  {topic.items.map((item, index) => (
                    <AccordionItem key={item.value ?? index} value={item.value ?? String(index)}>
                      <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqSidebarNavCopy = COPY
