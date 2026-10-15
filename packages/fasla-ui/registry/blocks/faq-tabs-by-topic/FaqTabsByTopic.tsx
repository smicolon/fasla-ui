"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"

/*
 * Figma: `FAQ` (42359:9029), Type=Tabs by Topic.
 *
 * A centred header, a row of Bordered tabs, one per topic, and under them
 * that topic's questions on the Accordion's Default style. The tabs are the
 * library's: arrow keys move between them and the panel follows.
 *
 * On a narrow screen the tabs keep their size and the row scrolls sideways
 * inside its own box, so the page itself never scrolls.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqTabsByTopicItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqTabsByTopicTopic {
  /** Identifies the topic for `defaultTopic`. */
  value: string
  label: React.ReactNode
  items: FaqTabsByTopicItem[]
}

export interface FaqTabsByTopicCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The tabs. Each topic has a `value`, a `label` and its `items`, the questions its panel shows: `question`, `answer` and an optional `value`. */
  topics: FaqTabsByTopicTopic[]
  /** Shown in place of a topic's questions when it has none. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. Figma shows General; the other topics are written to match. */
const COPY: Record<"en" | "ar", FaqTabsByTopicCopy> = {
  en: {
    heading: "Answers, by topic",
    description: "Pick the area you are asking about — the list below filters to match.",
    topics: [
      {
        value: "general",
        label: "General",
        items: [
          {
            question: "What exactly am I buying?",
            answer:
              "A Figma library licence: 1,600+ components, every marketing and dashboard block, both themes, both directions, and every update we publish while the licence is active.",
          },
          {
            question: "Do you have a free tier?",
            answer: "There is a free preview file with a sample of each family. The full library needs a licence.",
          },
          {
            question: "How many people can use one licence?",
            answer: "One licence covers one editor seat. Viewers and developers inspecting the file are free.",
          },
          {
            question: "Is the roadmap public?",
            answer: "Yes. The roadmap page in the file shows what we are building next, and you can vote on it.",
          },
          {
            question: "Who builds and maintains Fasla?",
            answer: "Smicolon, a design and engineering studio. The same team answers your support requests.",
          },
          {
            question: "How do I reach a human?",
            answer: "Write to support from the help centre. A designer on the team replies within one business day.",
          },
        ],
      },
      {
        value: "licensing",
        label: "Licensing",
        items: [
          {
            question: "Can I use Fasla on client projects?",
            answer: "Yes. A licence covers unlimited client and personal projects.",
          },
          {
            question: "Does the licence expire?",
            answer: "No. You keep the version you have for good; renewing keeps the updates coming.",
          },
          {
            question: "Can I move my licence to another team?",
            answer: "Yes. Ask support and we move it to the Figma team you name, usually the same day.",
          },
          {
            question: "Do you offer education pricing?",
            answer: "Students and teachers get the library free. Apply with your school email address.",
          },
        ],
      },
      {
        value: "theming",
        label: "Theming",
        items: [
          {
            question: "How do I apply my brand colours?",
            answer: "Change the theme variables in the Mode collection. Every component reads them, so the whole library follows.",
          },
          {
            question: "Is dark mode included?",
            answer: "Yes. Every token has a light and a dark value; switch the mode on any frame to preview it.",
          },
          {
            question: "Can I change the radius and type?",
            answer: "Yes. Radius and the type ramp are variables too, so one change reaches every component.",
          },
          {
            question: "Will an update overwrite my theme?",
            answer: "No. Updates change components, not the values you set on your theme variables.",
          },
        ],
      },
      {
        value: "handoff",
        label: "Handoff",
        items: [
          {
            question: "Does Fasla work with Dev Mode?",
            answer: "Yes. Every component carries Code Connect, so developers see the matching code beside the design.",
          },
          {
            question: "Is there a code library?",
            answer: "Yes. The React components install with one command and use the same token names as Figma.",
          },
          {
            question: "How do tokens map to Tailwind?",
            answer: "Each Figma variable has a Tailwind class of the same name, such as bg-background or text-muted-foreground.",
          },
          {
            question: "Can developers inspect RTL layouts?",
            answer: "Yes. Every block has an RTL variant, and the code mirrors it from the page direction alone.",
          },
        ],
      },
    ],
    empty: "No questions in this topic yet.",
  },
  ar: {
    heading: "إجابات حسب الموضوع",
    description: "اختر المجال الذي تسأل عنه، وتُصفّى القائمة أدناه لتطابقه.",
    topics: [
      {
        value: "general",
        label: "عام",
        items: [
          {
            question: "ما الذي أشتريه بالضبط؟",
            answer: (
              <>
                ترخيص مكتبة في Figma: أكثر من <bdi dir="ltr">1,600</bdi> مكوّن، وكل الكتل التسويقية وكتل لوحات التحكّم،
                والوضعان، والاتجاهان، وكل تحديث ننشره طوال سريان الترخيص.
              </>
            ),
          },
          {
            question: "هل لديكم خطة مجانية؟",
            answer: "يوجد ملف معاينة مجاني يضم نماذج من كل عائلة. أما المكتبة الكاملة فتحتاج إلى ترخيص.",
          },
          {
            question: "كم شخصًا يمكنه استخدام ترخيص واحد؟",
            answer: "يغطي الترخيص الواحد مقعد تحرير واحدًا. أما المشاهدون والمطوّرون الذين يعاينون الملف فمجانيون.",
          },
          {
            question: "هل خارطة الطريق علنية؟",
            answer: "نعم. تعرض صفحة خارطة الطريق في الملف ما نبنيه بعد ذلك، ويمكنك التصويت عليه.",
          },
          {
            question: "من يبني فاصلة ويتولّى صيانتها؟",
            answer: "يبنيها فريق Smicolon، وهو استوديو تصميم وهندسة. والفريق نفسه يجيب عن طلبات الدعم.",
          },
          {
            question: "كيف أصل إلى شخص حقيقي؟",
            answer: "راسل الدعم من مركز المساعدة، وسيردّ عليك مصمم من الفريق خلال يوم عمل واحد.",
          },
        ],
      },
      {
        value: "licensing",
        label: "التراخيص",
        items: [
          {
            question: "هل يمكنني استخدام فاصلة في مشاريع العملاء؟",
            answer: "نعم. يغطي الترخيص عددًا غير محدود من مشاريع العملاء والمشاريع الشخصية.",
          },
          {
            question: "هل تنتهي صلاحية الترخيص؟",
            answer: "لا. تحتفظ بالنسخة التي لديك دائمًا، والتجديد يضمن لك وصول التحديثات.",
          },
          {
            question: "هل يمكنني نقل ترخيصي إلى فريق آخر؟",
            answer: "نعم. اطلب ذلك من الدعم وسننقله إلى فريق Figma الذي تحدده، غالبًا في اليوم نفسه.",
          },
          {
            question: "هل لديكم أسعار للتعليم؟",
            answer: "يحصل الطلاب والمعلمون على المكتبة مجانًا. قدّم طلبك ببريدك الإلكتروني المدرسي.",
          },
        ],
      },
      {
        value: "theming",
        label: "السمات",
        items: [
          {
            question: "كيف أطبّق ألوان علامتي التجارية؟",
            answer: "غيّر متغيّرات السمة في مجموعة Mode. تقرؤها كل المكوّنات، فتتبعها المكتبة كلها.",
          },
          {
            question: "هل الوضع الداكن مضمَّن؟",
            answer: "نعم. لكل رمز قيمة فاتحة وأخرى داكنة، وبدّل الوضع على أي إطار لمعاينته.",
          },
          {
            question: "هل يمكنني تغيير نصف القطر والخطوط؟",
            answer: "نعم. نصف القطر وسلّم الخطوط متغيّرات أيضًا، فيصل تغيير واحد إلى كل المكوّنات.",
          },
          {
            question: "هل يستبدل التحديث سمتي؟",
            answer: "لا. تغيّر التحديثات المكوّنات، لا القيم التي ضبطتها على متغيّرات سمتك.",
          },
        ],
      },
      {
        value: "handoff",
        label: "التسليم",
        items: [
          {
            question: "هل تعمل فاصلة مع Dev Mode؟",
            answer: "نعم. يحمل كل مكوّن ربط Code Connect، فيرى المطوّرون الشيفرة المقابلة بجانب التصميم.",
          },
          {
            question: "هل توجد مكتبة شيفرة؟",
            answer: "نعم. تُثبَّت مكوّنات React بأمر واحد، وتستخدم أسماء الرموز نفسها الموجودة في Figma.",
          },
          {
            question: "كيف تقابل الرموز أصناف Tailwind؟",
            answer: "لكل متغيّر في Figma صنف Tailwind بالاسم نفسه، مثل bg-background.",
          },
          {
            question: "هل يمكن للمطوّرين معاينة تخطيطات اتجاه اليمين؟",
            answer: "نعم. لكل كتلة نسخة من اليمين إلى اليسار، وتعكسها الشيفرة من اتجاه الصفحة وحده.",
          },
        ],
      },
    ],
    empty: "لا توجد أسئلة في هذا الموضوع بعد.",
  },
}

export interface FaqTabsByTopicProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqTabsByTopicCopy> {
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

export function FaqTabsByTopic({
  locale = "en",
  heading,
  description,
  topics,
  empty,
  defaultTopic,
  defaultValue = ["0"],
  className,
  ...props
}: FaqTabsByTopicProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = topics ?? copy.topics

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <header className="flex w-full max-w-[760px] flex-col gap-2 text-center">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="w-full max-w-[880px] text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Tabs defaultValue={defaultTopic ?? list[0]?.value} className="flex flex-col items-center gap-12">
            {/* Scrolls on its own when the tabs are wider than the screen. */}
            <div className="max-w-full overflow-x-auto">
              <TabsList variant="bordered" size="sm">
                {list.map((topic) => (
                  <TabsTrigger key={topic.value} value={topic.value}>
                    {topic.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {list.map((topic) => (
              <TabsContent key={topic.value} value={topic.value} className="mt-0 w-full max-w-[880px]">
                {topic.items.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
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
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqTabsByTopicCopy = COPY
