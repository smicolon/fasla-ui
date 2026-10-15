"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { Button } from "../../ui/button/button"

/*
 * Figma: `FAQ` (42359:9029), Type=Category Chip Grid.
 *
 * A heading over a wrapping grid of category chips. Figma draws the chips as
 * its Toggle (Outline, lg, no icon). Fasla's code has no Toggle, so each chip
 * is the library's outline Button with `aria-pressed`, given the Toggle's
 * look from here: a 1px `input` stroke on `background`, `accent` on hover,
 * and while pressed a `ring` stroke with a 3px `ring/50` halo.
 *
 * The first category is pressed at first, as in Figma, and its questions
 * show under the grid. Pressing another chip changes the selection; pressing
 * the pressed one again clears it, leaving the heading and the chips alone.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqCategoryChipGridItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqCategoryChipGridCategory {
  /** Identifies the category for `defaultCategory`. */
  value: string
  label: React.ReactNode
  items: FaqCategoryChipGridItem[]
}

export interface FaqCategoryChipGridCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** Accessible name of the grid of chips. */
  categoriesLabel: string
  /** The chips, in order. Each category has a `value`, a `label` and its `items`, the questions shown while it is pressed: `question`, `answer` and an optional `value`. */
  categories: FaqCategoryChipGridCategory[]
  /** Shown in place of a category's questions when it has none. */
  empty: React.ReactNode
}

type Pair = [React.ReactNode, React.ReactNode]
const category = (value: string, label: string, ...pairs: Pair[]): FaqCategoryChipGridCategory => ({
  value,
  label,
  items: pairs.map(([question, answer]) => ({ question, answer })),
})

/**
 * Figma's copy, English and Arabic. Figma shows Getting started pressed, with
 * the same six questions as Sidebar Nav's Getting started; the other
 * categories' questions are written to match.
 */
const COPY: Record<"en" | "ar", FaqCategoryChipGridCopy> = {
  en: {
    heading: "Q&A",
    categoriesLabel: "Categories",
    categories: [
      category(
        "getting-started",
        "Getting started",
        [
          "How do I enable the library for my team?",
          "From the file, open the Assets panel, choose Libraries, then publish. Anyone in a team with the library enabled sees Fasla components in their Assets panel immediately.",
        ],
        ["Which file should I open first?", "Open the Foundations page. It shows the tokens every component reads, before you place one."],
        ["How is the file organised?", "One page per component family, with atoms first, then blocks, then templates."],
        ["What do the emoji page prefixes mean?", "They show each page’s status: a green dot is ready to use, a yellow one is still in review."],
        ["Where is the changelog?", "On the Changelog page, at the top of the file. Every release lists what was added and fixed."],
        ["How do I report something broken?", "Leave a comment on the component in Figma, or write to support with a link to the frame."]
      ),
      category(
        "components",
        "Components",
        ["How many components are there?", "More than 1,600, in light and dark, LTR and RTL."],
        ["Can I detach a component?", "You can, but you lose updates. Use its properties and slots instead."]
      ),
      category(
        "blocks",
        "Blocks & patterns",
        ["What is a block?", "A ready section of a page, such as a hero or an FAQ, built from the atoms."],
        ["Are blocks responsive?", "Yes. Each has desktop, tablet and mobile variants."]
      ),
      category(
        "tokens",
        "Design tokens",
        ["Where do the tokens live?", "In the Variables panel, grouped into the Mode and Responsive collections."],
        ["Do token names match the code?", "Yes. Each variable has a Tailwind class of the same name."]
      ),
      category(
        "theming",
        "Theming",
        ["How do I apply my brand?", "Change the theme variables; every component follows."],
        ["Can I change the radius?", "Yes. Radius is a variable too."]
      ),
      category(
        "dark-mode",
        "Dark mode",
        ["Is dark mode included?", "Yes. Every token has a dark value."],
        ["How do I preview it?", "Switch the Mode of any frame to Dark."]
      ),
      category(
        "rtl",
        "RTL & Arabic",
        ["How do I switch a block to Arabic?", "Set its Direction property to RTL."],
        ["Which font does Arabic use?", "Cairo, with its own line heights."]
      ),
      category(
        "typography",
        "Typography",
        ["Which fonts does Fasla use?", "Geist for Latin text and Cairo for Arabic."],
        ["Can I swap the font?", "Yes. Change the font variables and every text style follows."]
      ),
      category(
        "responsive",
        "Responsive variants",
        ["Which breakpoints are there?", "Desktop at 1440, tablet at 768 and mobile at 360."],
        ["Do blocks reflow on their own?", "Yes. They use auto layout throughout."]
      ),
      category(
        "handoff",
        "Developer handoff",
        ["Does Fasla work with Dev Mode?", "Yes. Developers see the matching code beside the design."],
        ["Is there a code library?", "Yes. The React components install with one command."]
      ),
      category(
        "code-connect",
        "Code Connect",
        ["Is Code Connect set up?", "Yes, for every component in the library."],
        ["Which framework does it map to?", "React, with the same props the code library uses."]
      ),
      category(
        "licensing",
        "Licensing",
        ["Can I use Fasla on client projects?", "Yes. One licence covers unlimited projects."],
        ["Does the licence expire?", "No. Renewing keeps the updates coming."]
      ),
      category(
        "billing",
        "Billing & invoices",
        ["How do I get an invoice?", "Every payment emails one; past invoices are in your account."],
        ["Which payment methods do you take?", "Cards, and bank transfer on annual plans."]
      ),
      category(
        "seats",
        "Team seats",
        ["What counts as a seat?", "One person with edit access. Viewers are free."],
        ["Can I add seats later?", "Yes, at any time. You pay for the rest of the term only."]
      ),
      category(
        "releases",
        "Releases & changelog",
        ["How often do you release?", "Every month, in the same library."],
        ["Where is the changelog?", "On the Changelog page at the top of the file."]
      ),
      category(
        "requests",
        "Requesting components",
        ["Can I request a component?", "Yes. Post it on the roadmap page and others can vote for it."],
        ["How long does a request take?", "Popular requests usually ship within two releases."]
      ),
      category(
        "accessibility",
        "Accessibility",
        ["Do the colours meet WCAG?", "Text tokens are checked against AA in both modes."],
        ["Are focus states designed?", "Yes. Every interactive component has a Focus state."]
      ),
      category(
        "support",
        "Support",
        ["How do I reach support?", "Write to us from the help centre."],
        ["How fast do you reply?", "Within one business day."]
      ),
    ],
    empty: "No questions in this category yet.",
  },
  ar: {
    heading: "أسئلة وأجوبة",
    categoriesLabel: "الفئات",
    categories: [
      category(
        "getting-started",
        "البداية",
        [
          "كيف أفعّل المكتبة لفريقي؟",
          "من داخل الملف، افتح لوحة Assets واختر Libraries ثم انشر. وسيرى كل من فعّل المكتبة مكوّنات فاصلة في لوحته فورًا.",
        ],
        ["أي ملف ينبغي أن أفتح أولًا؟", "افتح صفحة الأساسيات. تعرض الرموز التي يقرؤها كل مكوّن قبل أن تضع أيًّا منها."],
        ["كيف يُنظَّم الملف؟", "صفحة لكل عائلة مكوّنات: المكوّنات الأساسية أولًا، ثم الكتل، ثم القوالب."],
        ["ماذا تعني رموز الإيموجي في أسماء الصفحات؟", "تبيّن حالة كل صفحة: النقطة الخضراء تعني أنها جاهزة، والصفراء أنها ما زالت قيد المراجعة."],
        ["أين سجلّ التغييرات؟", "في صفحة سجلّ التغييرات أعلى الملف. يذكر كل إصدار ما أُضيف وما أُصلح."],
        ["كيف أبلّغ عن خلل؟", "اترك تعليقًا على المكوّن في Figma، أو راسل الدعم مع رابط الإطار."]
      ),
      category(
        "components",
        "المكوّنات",
        [
          "كم عدد المكوّنات؟",
          <>
            أكثر من <bdi dir="ltr">1,600</bdi> مكوّن، بالوضعين الفاتح والداكن، وبالاتجاهين.
          </>,
        ],
        ["هل يمكنني فصل المكوّن؟", "يمكنك ذلك، لكنك تفقد التحديثات. استخدم خصائصه وفتحاته بدلًا من ذلك."]
      ),
      category(
        "blocks",
        "الكتل والأنماط",
        ["ما الكتلة؟", "قسم جاهز من صفحة، مثل الواجهة الرئيسية أو الأسئلة الشائعة، مبني من المكوّنات الأساسية."],
        ["هل الكتل متجاوبة؟", "نعم. لكل كتلة نسخ لسطح المكتب والجهاز اللوحي والهاتف."]
      ),
      category(
        "tokens",
        "رموز التصميم",
        ["أين توجد الرموز؟", "في لوحة المتغيّرات، موزّعة على مجموعتين: Mode، Responsive."],
        ["هل تطابق أسماء الرموز الشيفرة؟", "نعم. لكل متغيّر صنف Tailwind بالاسم نفسه."]
      ),
      category(
        "theming",
        "السمات",
        ["كيف أطبّق علامتي التجارية؟", "غيّر متغيّرات السمة، فتتبعها كل المكوّنات."],
        ["هل يمكنني تغيير نصف القطر؟", "نعم. نصف القطر متغيّر أيضًا."]
      ),
      category(
        "dark-mode",
        "الوضع الداكن",
        ["هل الوضع الداكن مضمَّن؟", "نعم. لكل رمز قيمة داكنة."],
        ["كيف أعاينه؟", "بدّل وضع أي إطار إلى الداكن."]
      ),
      category(
        "rtl",
        "العربية واتجاه اليمين",
        ["كيف أحوّل كتلة إلى العربية؟", "اضبط خاصية الاتجاه على RTL."],
        ["ما الخط الذي تستخدمه العربية؟", "خط Cairo، بارتفاعات أسطر خاصة به."]
      ),
      category(
        "typography",
        "الخطوط",
        ["ما الخطوط التي تستخدمها فاصلة؟", "خط Geist للنص اللاتيني، وخط Cairo للعربية."],
        ["هل يمكنني تبديل الخط؟", "نعم. غيّر متغيّرات الخط فتتبعها كل أنماط النص."]
      ),
      category(
        "responsive",
        "النسخ المتجاوبة",
        [
          "ما نقاط التوقف المتاحة؟",
          <>
            سطح المكتب عند <bdi dir="ltr">1440</bdi>، والجهاز اللوحي عند <bdi dir="ltr">768</bdi>، والهاتف عند{" "}
            <bdi dir="ltr">360</bdi>.
          </>,
        ],
        ["هل تعيد الكتل ترتيب نفسها تلقائيًا؟", "نعم. تستخدم التخطيط التلقائي في كل أجزائها."]
      ),
      category(
        "handoff",
        "التسليم إلى المطوّرين",
        ["هل تعمل فاصلة مع Dev Mode؟", "نعم. يرى المطوّرون الشيفرة المقابلة بجانب التصميم."],
        ["هل توجد مكتبة شيفرة؟", "نعم. تُثبَّت مكوّنات React بأمر واحد."]
      ),
      category(
        "code-connect",
        "Code Connect",
        ["هل ربط Code Connect جاهز؟", "نعم، لكل مكوّن في المكتبة."],
        ["بأي إطار عمل يرتبط؟", "بمكتبة React، وبالخصائص نفسها التي تستخدمها مكتبة الشيفرة."]
      ),
      category(
        "licensing",
        "التراخيص",
        ["هل يمكنني استخدام فاصلة في مشاريع العملاء؟", "نعم. يغطي الترخيص الواحد عددًا غير محدود من المشاريع."],
        ["هل تنتهي صلاحية الترخيص؟", "لا. والتجديد يضمن لك وصول التحديثات."]
      ),
      category(
        "billing",
        "الفوترة والفواتير",
        ["كيف أحصل على فاتورة؟", "تصلك فاتورة بالبريد مع كل دفعة، وتجد الفواتير السابقة في حسابك."],
        ["ما طرق الدفع المتاحة؟", "البطاقات، والتحويل البنكي في الخطط السنوية."]
      ),
      category(
        "seats",
        "مقاعد الفريق",
        ["ما المقصود بالمقعد؟", "شخص واحد لديه صلاحية التحرير. أما المشاهدون فمجانيون."],
        ["هل يمكنني إضافة مقاعد لاحقًا؟", "نعم، في أي وقت، وتدفع عن المدة المتبقية فقط."]
      ),
      category(
        "releases",
        "الإصدارات وسجلّ التغييرات",
        ["كم مرة تصدرون تحديثًا؟", "كل شهر، في المكتبة نفسها."],
        ["أين سجلّ التغييرات؟", "في صفحة سجلّ التغييرات أعلى الملف."]
      ),
      category(
        "requests",
        "طلب المكوّنات",
        ["هل يمكنني طلب مكوّن؟", "نعم. انشره في صفحة خارطة الطريق ليصوّت له الآخرون."],
        ["كم يستغرق تنفيذ الطلب؟", "تصدر الطلبات الأكثر تصويتًا عادةً خلال إصدارين."]
      ),
      category(
        "accessibility",
        "إمكانية الوصول",
        ["هل تفي الألوان بمعايير WCAG؟", "تُفحص رموز النص وفق مستوى AA في الوضعين."],
        ["هل صُمّمت حالات التركيز؟", "نعم. لكل مكوّن تفاعلي حالة تركيز."]
      ),
      category(
        "support",
        "الدعم",
        ["كيف أتواصل مع الدعم؟", "راسلنا من مركز المساعدة."],
        ["متى تردّون؟", "خلال يوم عمل واحد."]
      ),
    ],
    empty: "لا توجد أسئلة في هذه الفئة بعد.",
  },
}

export interface FaqCategoryChipGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqCategoryChipGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The category pressed at first, by `value`: the first category by default,
   * as in Figma. `null` starts with none pressed and no questions shown.
   * @default the first category
   */
  defaultCategory?: string | null
  /** Called with the pressed category's `value`, or undefined when none is. */
  onCategoryChange?: (value: string | undefined) => void
}

export function FaqCategoryChipGrid({
  locale = "en",
  heading,
  categoriesLabel,
  categories,
  empty,
  defaultCategory,
  onCategoryChange,
  className,
  ...props
}: FaqCategoryChipGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const panelId = React.useId()
  const list = categories ?? copy.categories
  const [selected, setSelected] = React.useState<string | undefined>(
    defaultCategory === null ? undefined : (defaultCategory ?? list[0]?.value)
  )
  const current = list.find((c) => c.value === selected)

  const select = (value: string | undefined) => {
    setSelected(value)
    onCategoryChange?.(value)
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <header className="flex w-full max-w-[900px] flex-col gap-4 text-center">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-5xl">
            {heading ?? copy.heading}
          </h2>
          <div aria-hidden="true" className="h-px bg-border" />
        </header>

        <ul
          aria-label={categoriesLabel ?? copy.categoriesLabel}
          className="flex w-full max-w-[1120px] flex-wrap justify-center gap-3"
        >
          {list.map((c) => {
            const pressed = c.value === selected
            return (
              <li key={c.value}>
                <Button
                  variant="outline"
                  size="lg"
                  aria-pressed={pressed}
                  aria-controls={pressed ? panelId : undefined}
                  onClick={() => select(pressed ? undefined : c.value)}
                  className={cn(
                    "px-2.5 ring-input hover:bg-accent hover:text-accent-foreground active:bg-accent",
                    "aria-pressed:shadow-[0_0_0_3px] aria-pressed:shadow-ring/50 aria-pressed:ring-ring"
                  )}
                >
                  {c.label}
                </Button>
              </li>
            )
          })}
        </ul>

        {current && (
          <div id={panelId} className="w-full max-w-[1120px]">
            {current.items.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
            ) : (
              <Accordion key={current.value} defaultValue={["0"]}>
                {current.items.map((item, index) => (
                  <AccordionItem key={item.value ?? index} value={item.value ?? String(index)}>
                    <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqCategoryChipGridCopy = COPY
