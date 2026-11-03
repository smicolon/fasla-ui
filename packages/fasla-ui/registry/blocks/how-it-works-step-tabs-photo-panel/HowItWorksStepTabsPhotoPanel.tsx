"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"
import {
  enter,
  HowItWorksEyebrow,
  HowItWorksFigures,
  HowItWorksImage,
  HowItWorksSection,
  prefersReducedMotion,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Step Tabs + Photo Panel.
 *
 * A centred header (an eyebrow and the heading), the Tabs atom in its Bordered
 * style with four tabs ("01 Align" and so on), and under it one panel in a bordered
 * card: a "STEP 01" line, the title, a paragraph and three ticked points beside a
 * 520 × 380 photo. A tab shows its own panel.
 *
 * Desktop sets the copy at the start and the photo at the end of a 1248px card.
 * Tablet and Mobile put the photo above the copy (340px and 220px tall), and on
 * Mobile the tabs are a strip that scrolls sideways, the active tab scrolled into
 * view. The page's `dir` reverses the tabs (so 01 is at the start) and puts the
 * photo on the other side; the arrow keys follow the reading direction, which the
 * Tabs atom reads from the page.
 *
 * Motion: when the tab changes, the new panel's copy fades in from 8px above
 * (220ms) and its photo fades in over 320ms. The Tabs atom owns the active line,
 * so it moves with the atom's own transition; Figma's card has one shared
 * underline sliding between the tabs and the old copy fading out as the new fades
 * in, and the code does neither (the old panel is replaced at once). Under reduced
 * motion a tab is an instant swap.
 *
 * Content limits: the heading up to 46 characters. A tab's label up to 14, a
 * title up to 40, a paragraph up to 190, and a point up to 48.
 * Figma draws only the first panel; the other three are written for the code.
 */

export interface HowItWorksTabPanel {
  /** Keys the tab and its panel. */
  id: string
  /** The tab, such as "01 Align". */
  label: string
  /** The small line above the title, such as "Step 01". */
  step: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  /** The ticked points. */
  points: React.ReactNode[]
}

export interface HowItWorksStepTabsPhotoPanelCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  /** The tabs and their panels, in order. */
  steps: HowItWorksTabPanel[]
  /** The tab strip's accessible name. */
  tabsLabel: string
}

/** Figma's copy for the first step, English and Arabic, and copy for the other three. */
const COPY: Record<HowItWorksLocale, HowItWorksStepTabsPhotoPanelCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "Pick a step and see what happens inside it",
    tabsLabel: "Steps",
    steps: [
      {
        id: "align",
        label: "01 Align",
        step: "Step 01",
        title: "Get the whole problem onto one wall",
        description: "One session with everyone who has a stake. Constraints, assumptions and open questions all go up where they can be argued with.",
        points: ["Takes about two hours", "Everyone who decides is in the room", "Ends with a written list of what is out of scope"],
      },
      {
        id: "sketch",
        label: "02 Sketch",
        step: "Step 02",
        title: "Draw the whole flow on paper",
        description: "Boxes and arrows, every screen in order, with nothing styled. Paper is quick to draw and quicker to throw away, which is why the structure gets settled here.",
        points: ["Takes about half a day", "Every screen drawn, in order", "Ends with one flow everyone can read"],
      },
      {
        id: "design",
        label: "03 Design",
        step: "Step 03",
        title: "Build the screens with real content",
        description: "Layouts move into the file on a shared grid, with real words and real numbers from the start, so the design is tested against what it will actually hold.",
        points: ["Takes about a week", "Real content, not placeholder text", "Every state drawn, not only the happy one"],
      },
      {
        id: "review",
        label: "04 Review",
        step: "Step 04",
        title: "Walk it through together",
        description: "The whole team goes through the flow on one call, then hands it over with the reasoning written beside each screen. Nothing ships on one person's opinion.",
        points: ["Takes about an hour", "Everyone who decides signs off", "Notes travel with the screens"],
      },
    ],
  },
  ar: {
    eyebrow: "كيف نعمل",
    heading: "اختر خطوة وشاهد ما يحدث داخلها",
    tabsLabel: "الخطوات",
    steps: [
      {
        id: "align",
        label: "01 المواءمة",
        step: "الخطوة 01",
        title: "ضع المشكلة كاملة على حائط واحد",
        description: "جلسة واحدة تحضرها كل الأطراف المعنيّة. المحدّدات والافتراضات والأسئلة المفتوحة تُعلَّق حيث يمكن مناقشتها.",
        points: ["تستغرق نحو ساعتين", "كل من يقرّر موجود في الغرفة", "تنتهي بقائمة مكتوبة بما هو خارج النطاق"],
      },
      {
        id: "sketch",
        label: "02 الرسم",
        step: "الخطوة 02",
        title: "ارسم المسار كاملًا على الورق",
        description: "مربعات وأسهم وكل شاشة بترتيبها، دون أي تنسيق. الورق سريع الرسم وأسرع في التخلّص منه، ولهذا يُحسم الهيكل هنا.",
        points: ["تستغرق نحو نصف يوم", "كل شاشة مرسومة بترتيبها", "تنتهي بمسار واحد يقرؤه الجميع"],
      },
      {
        id: "design",
        label: "03 التصميم",
        step: "الخطوة 03",
        title: "ابنِ الشاشات بمحتوى حقيقي",
        description: "تنتقل التخطيطات إلى الملف على شبكة مشتركة، بكلمات وأرقام حقيقية منذ البداية، فيُختبر التصميم بما سيحمله فعلًا.",
        points: ["تستغرق نحو أسبوع", "محتوى حقيقي لا نص تجريبي", "كل حالة مرسومة لا الحالة المثالية وحدها"],
      },
      {
        id: "review",
        label: "04 المراجعة",
        step: "الخطوة 04",
        title: "استعرضوه معًا",
        description: "يستعرض الفريق كله المسار في مكالمة واحدة، ثم يُسلَّم مع المبرّرات مكتوبة بجانب كل شاشة. لا شيء يُطلق برأي شخص واحد.",
        points: ["تستغرق نحو ساعة", "كل من يقرّر يعتمده", "الملاحظات ترافق الشاشات"],
      },
    ],
  },
}

export interface HowItWorksStepTabsPhotoPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange">, Partial<HowItWorksStepTabsPhotoPanelCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * One photo per tab, in order. A panel without one shows a `muted` box.
   * @default none: `muted` placeholders
   */
  photos?: HowItWorksPhoto[]
  /** The id of the tab to show first. */
  defaultStep?: string
  /** Called with the id of the tab that becomes active. */
  onStepChange?: (id: string) => void
}

export function HowItWorksStepTabsPhotoPanel({ locale = "en", eyebrow, heading, steps, tabsLabel, photos, defaultStep, onStepChange, className, ...props }: HowItWorksStepTabsPhotoPanelProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = steps ?? copy.steps
  const [value, setValue] = React.useState<string>(defaultStep ?? list[0]?.id ?? "")
  const first = React.useRef(true)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  // A tab change after the first render: the new panel's copy and photo fade in.
  React.useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    // The strip keeps the active tab in view, in Mobile's sideways scroll.
    listRef.current?.querySelector<HTMLElement>('[data-active]')?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" })
    if (prefersReducedMotion()) return
    const panel = panelRef.current
    if (!panel || typeof panel.animate !== "function") return
    panel.querySelectorAll<HTMLElement>('[data-reveal="copy"]').forEach((el) => enter(el, [{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "none" }], { duration: 220 }))
    panel.querySelectorAll<HTMLElement>('[data-reveal="photo"]').forEach((el) => enter(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 320 }))
  }, [value])

  return (
    <HowItWorksSection labelledBy={headingId} className={className} contentClassName="gap-8" {...props}>
      <header className="flex w-full flex-col items-center gap-3 text-center">
        <HowItWorksEyebrow>{eyebrow ?? copy.eyebrow}</HowItWorksEyebrow>
        <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
          {heading ?? copy.heading}
        </h2>
      </header>

      <Tabs
        value={value}
        onValueChange={(next) => {
          setValue(String(next))
          onStepChange?.(String(next))
        }}
        className="flex w-full flex-col items-center gap-8"
      >
        <TabsList ref={listRef} variant="bordered" size="md" aria-label={tabsLabel ?? copy.tabsLabel} className="max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((step) => (
            <TabsTrigger key={step.id} value={step.id}>
              <HowItWorksFigures>{step.label}</HowItWorksFigures>
            </TabsTrigger>
          ))}
        </TabsList>

        {list.map((step, index) => (
          <TabsContent key={step.id} value={step.id} className="mt-0 w-full">
            <div ref={step.id === value ? panelRef : undefined} className="flex flex-col gap-6 rounded-[14px] border border-border bg-card p-6 [@container(min-width:40rem)]:p-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-12 [@container(min-width:64rem)]:p-10">
              <div data-reveal="photo" className="relative order-first h-[220px] w-full shrink-0 overflow-hidden rounded-[10px] bg-muted [@container(min-width:40rem)]:h-[340px] [@container(min-width:64rem)]:order-last [@container(min-width:64rem)]:h-[380px] [@container(min-width:64rem)]:w-[520px]">
                <HowItWorksImage photo={photos?.[index]} />
              </div>
              <div data-reveal="copy" className="flex min-w-0 flex-1 flex-col gap-4">
                <HowItWorksEyebrow>
                  <HowItWorksFigures>{step.step}</HowItWorksFigures>
                </HowItWorksEyebrow>
                <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-base text-muted-foreground">{step.description}</p>
                <ul className="flex flex-col gap-2">
                  {step.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <Check size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksStepTabsPhotoPanelCopy = COPY
