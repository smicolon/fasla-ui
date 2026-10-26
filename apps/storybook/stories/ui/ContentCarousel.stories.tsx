import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import {
  ContentCarousel,
  ContentCarouselItem,
  type ContentCarouselProps,
} from "../../../../packages/fasla-ui/registry/ui/content-carousel"

/**
 * Figma: Content Carousel (15769:74332). `Type` (Single box, Two boxes,
 * Three boxes) is `itemsPerView`; the arrows are Icon Buttons; Direction is
 * the toolbar. Every story follows the Direction and Theme toolbars, except
 * Light and Dark and Directions, which show both at once.
 */

/**
 * The story args: `itemsPerView`, `defaultActiveIndex` and `className`, plus
 * one story-only row, `cards`, that sets how many cards the preview renders.
 */
type StoryArgs = Partial<
  Pick<ContentCarouselProps, "activeIndex" | "onActiveIndexChange" | "previousLabel" | "nextLabel" | "children">
> & {
  itemsPerView?: 1 | 2 | 3
  cards?: number
  defaultActiveIndex?: number
  className?: string
}

const meta: Meta<StoryArgs> = {
  title: "UI/Content Carousel",
  component: ContentCarousel as unknown as React.ComponentType<StoryArgs>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    itemsPerView: {
      control: "inline-radio",
      options: [1, 2, 3],
      description: "How many cards share the view: Figma's `Type` (Single box, Two boxes, Three boxes).",
      table: { defaultValue: { summary: "1" } },
    },
    cards: {
      control: "inline-radio",
      options: [3, 4],
      description: "Story only: how many cards there are.",
    },
    defaultActiveIndex: {
      control: "inline-radio",
      options: [0, 1, 2, 3],
      description: "The card to start on, counted from 0. Past the last view, it starts on the last view.",
      table: { defaultValue: { summary: "0" } },
    },
    className: { control: "text", description: "Extra classes for the root." },
    // Behaviour, not looks: these change nothing in the preview. They are on
    // the docs page's Props table.
    activeIndex: { table: { disable: true } },
    onActiveIndexChange: { table: { disable: true } },
    previousLabel: { table: { disable: true } },
    nextLabel: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: { itemsPerView: 2, cards: 4, defaultActiveIndex: 0 },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script.
 *
 * Only the *rendered values* change — prop names stay English everywhere.
 * The Arabic follows design/content/: real situations (customer words, a
 * photo tour), never placeholders, and the arrows take the locale's names.
 */
const COPY = {
  ltr: {
    label: "Customer stories",
    galleryLabel: "City guide",
    previous: "Previous",
    next: "Next",
    quotes: [
      { body: "The components dropped into our codebase without a fight, and the defaults already looked designed.", name: "Salma", role: "Frontend lead" },
      { body: "We shipped the Arabic version of our dashboard in a week. The direction handling simply worked.", name: "Omar", role: "Product engineer" },
      { body: "The empty and error states were already thought through, which is usually where libraries leave you alone.", name: "Lina", role: "Design engineer" },
      { body: "Storybook, docs and tokens all agree with each other. That is rarer than it should be.", name: "Karim", role: "Staff engineer" },
    ],
    long: {
      body: "We moved a twelve-year-old admin panel onto the library over one quarter. The forms, the tables and the empty states came across almost unchanged, the Arabic layout needed no second stylesheet, and the review comments were about our product rather than about spacing. The team that maintains it now is half the size it was.",
      name: "Huda",
      role: "Head of engineering",
    },
    photos: ["The old town at dawn", "The harbour market", "The corniche at sunset", "The museum quarter"],
    state: "First visible card",
  },
  rtl: {
    label: "قصص العملاء",
    galleryLabel: "دليل المدينة",
    previous: "السابق",
    next: "التالي",
    quotes: [
      { body: "دخلت المكوّنات في مشروعنا دون عناء، وبدت الإعدادات الافتراضية مصمّمة بعناية منذ البداية.", name: "سلمى", role: "قائدة فريق الواجهات" },
      { body: "أطلقنا النسخة العربية من لوحة التحكم في أسبوع واحد، وعمل تبديل الاتجاه دون أي تدخل.", name: "عمر", role: "مهندس منتج" },
      { body: "حالات الفراغ والخطأ مدروسة سلفًا، وهذا ما تتركه أغلب المكتبات على عاتقك عادةً.", name: "لينا", role: "مهندسة تصميم" },
      { body: "يتطابق Storybook مع التوثيق ومع قيم التصميم، وهذا أندر مما ينبغي.", name: "كريم", role: "مهندس أول" },
    ],
    long: {
      body: "نقلنا لوحة إدارة عمرها اثنا عشر عامًا إلى المكتبة خلال ربع سنة واحد. انتقلت النماذج والجداول وحالات الفراغ كما هي تقريبًا، ولم يحتج التخطيط العربي إلى ملف أنماط ثانٍ، وصارت ملاحظات المراجعة عن منتجنا لا عن المسافات. والفريق الذي يصونها اليوم نصف ما كان عليه.",
      name: "هدى",
      role: "رئيسة الهندسة",
    },
    photos: ["البلدة القديمة عند الفجر", "سوق الميناء", "الكورنيش عند الغروب", "حي المتاحف"],
    state: "أول بطاقة ظاهرة",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type Quote = { body: string; name: string; role: string }
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const THEMES = ["light", "dark"] as const
const ITEMS_PER_VIEW = [1, 2, 3] as const
/** Figma's names for the `Type` axis, by `itemsPerView`. */
const TYPE_NAMES = { 1: "Single box", 2: "Two boxes", 3: "Three boxes" } as const

/** The carousel's width in every story but Default: Figma's Two boxes frame, give or take. */
const WIDTH = "w-[40rem]"

/**
 * A column header: an English name, left-to-right in both directions. It
 * never wraps, and `leading-4` keeps it the same height under an RTL toolbar.
 */
const Head = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="w-fit whitespace-nowrap font-sans text-xs leading-4 text-muted-foreground">
    {children}
  </span>
)

/**
 * A side row label. Left-aligned in its column in both directions, centred
 * on the carousel it names, and one column gap from it.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="whitespace-nowrap text-left font-sans text-xs leading-4 text-muted-foreground">
    {children}
  </span>
)

/** Rows of carousels with a side label each. */
const ROWS = "grid grid-cols-[max-content_max-content] items-center gap-x-10 gap-y-8"

/**
 * The frame round every story but Default. It centres the content in either
 * direction, and scrolls it sideways in the story's own direction when it is
 * wider than the canvas (a phone). 4px of padding keeps a focus ring at the
 * edge clear of the clip.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/** A testimonial slot: text content brings its own padding. */
const QuoteCard = ({ quote }: { quote: Quote }) => (
  <figure className="flex h-full flex-col justify-between gap-4 p-6">
    <blockquote className="text-sm text-foreground">{quote.body}</blockquote>
    {/* Stacked, not "name · role": the middle dot is bidi-neutral and would
        break the direction of an Arabic run. */}
    <figcaption className="text-xs text-muted-foreground">
      <span className="block font-medium text-foreground">{quote.name}</span>
      {quote.role}
    </figcaption>
  </figure>
)

/** An edge-to-edge media slot: zero padding, token-coloured stand-in. */
const Photo = ({ caption }: { caption: string }) => (
  <div className="flex h-full min-h-40 items-end bg-muted p-4">
    <span className="text-sm font-medium text-foreground">{caption}</span>
  </div>
)

const Quotes = ({
  c,
  count = 4,
  quotes = c.quotes,
  ...props
}: { c: Copy; count?: number; quotes?: readonly Quote[] } & Partial<React.ComponentProps<typeof ContentCarousel>>) => (
  <ContentCarousel aria-label={c.label} previousLabel={c.previous} nextLabel={c.next} className={WIDTH} {...props}>
    {quotes.slice(0, count).map((quote) => (
      <ContentCarouselItem key={quote.name}>
        <QuoteCard quote={quote} />
      </ContentCarouselItem>
    ))}
  </ContentCarousel>
)

/**
 * The playground: every row on the Controls panel changes it. Press an
 * arrow, swipe, or tab in and use the arrow keys. A new key per value
 * restarts it when a control moves.
 */
export const Default: Story = {
  parameters: { layout: "padded" },
  render: ({ itemsPerView, cards = 4, defaultActiveIndex = 0, className }, ctx) => (
    <Quotes
      key={`${itemsPerView}-${cards}-${defaultActiveIndex}`}
      c={copy(ctx)}
      count={cards}
      itemsPerView={itemsPerView}
      defaultActiveIndex={defaultActiveIndex}
      className={["mx-auto w-full max-w-[40rem]", className].join(" ")}
    />
  ),
}

/**
 * Figma's `Type` axis, as `itemsPerView`: Single box, Two boxes, Three
 * boxes. The cards split the row evenly, each ceding its share of the 16px
 * gaps, and the arrows advance one card. In RTL the first card is on the
 * right and Next is on the left, pointing left.
 */
export const ItemsPerView: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={ROWS}>
        {ITEMS_PER_VIEW.map((itemsPerView) => (
          <React.Fragment key={itemsPerView}>
            <RowHead>{TYPE_NAMES[itemsPerView]}</RowHead>
            <Quotes c={c} itemsPerView={itemsPerView} />
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * The arrows' states, and Focus. The backward arrow is off on the first
 * card and the forward arrow off on the last view: with three cards
 * two-up, the last view starts at the second card. With every card in
 * view both are off. Figma dims an off arrow to 50%.
 *
 * Focus is keyboard focus (`:focus-visible`). The arrows are Buttons and
 * draw the Button's ring, 2px of `ring` 2px clear; the track draws the
 * same ring. Those rows are held in Focus; tab in to see it live.
 */
export const States: Story = {
  decorators: [framed],
  parameters: {
    layout: "padded",
    controls: { disable: true },
    pseudo: {
      focusVisible: [
        "#content-focus-arrow [data-slot=carousel-next]",
        "#content-focus-track [data-slot=carousel-content]",
      ],
    },
  },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={ROWS}>
        <RowHead>First card</RowHead>
        <Quotes c={c} count={3} itemsPerView={2} />
        <RowHead>Last view</RowHead>
        <Quotes c={c} count={3} itemsPerView={2} defaultActiveIndex={1} />
        <RowHead>Everything in view</RowHead>
        <Quotes c={c} count={3} itemsPerView={3} />
        <RowHead>Focus · arrow</RowHead>
        <div id="content-focus-arrow">
          <Quotes c={c} count={3} itemsPerView={2} />
        </div>
        <RowHead>Focus · track</RowHead>
        <div id="content-focus-track">
          <Quotes c={c} count={3} itemsPerView={2} />
        </div>
      </div>
    )
  },
}

/**
 * Edge-to-edge media: the slot has no padding of its own, so an image (here a
 * token-coloured stand-in) reaches the card's rounded border on every side.
 */
export const MediaSlots: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <ContentCarousel
        aria-label={c.galleryLabel}
        previousLabel={c.previous}
        nextLabel={c.next}
        itemsPerView={3}
        className={WIDTH}
      >
        {c.photos.map((caption) => (
          <ContentCarouselItem key={caption}>
            <Photo caption={caption} />
          </ContentCarouselItem>
        ))}
      </ContentCarousel>
    )
  },
}

/**
 * A long card among short ones. The cards in a view share one height, the
 * tallest, so the row keeps a single bottom edge and the arrows stay
 * centred on it.
 */
export const LongText: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return <Quotes c={c} itemsPerView={2} quotes={[c.quotes[0], c.long, c.quotes[1], c.quotes[2]]} />
  },
}

const ControlledDemo = ({ c }: { c: Copy }) => {
  const [index, setIndex] = React.useState(0)
  return (
    <div className="flex flex-col items-center gap-3">
      <Quotes c={c} itemsPerView={2} activeIndex={index} onActiveIndexChange={setIndex} />
      <p className="text-sm text-muted-foreground">
        {c.state}:{" "}
        {/* Digits are bidi-safe; "2 / 4" reads the same in both directions. */}
        <span className="font-medium text-foreground" dir="ltr">
          {index + 1} / {c.quotes.length}
        </span>
      </p>
    </div>
  )
}

/** `activeIndex` with `onActiveIndexChange`: the state lives outside. */
export const Controlled: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => <ControlledDemo c={copy(ctx)} />,
}

/**
 * Light and Dark, one panel each, whatever the theme toolbar says. Cards are
 * `card` on `border`, arrows the Button's Outline, so each panel's class
 * re-points every token for its subtree.
 */
export const LightAndDark: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[theme, "flex flex-col gap-4 rounded-lg border bg-background p-6 text-foreground"].join(" ")}
          >
            <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
            <Quotes c={c} itemsPerView={2} />
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Both directions at once, whatever the toolbar says: each panel sets its
 * own `dir`, `lang` and font. In Arabic the first card is on the right,
 * Previous is on the right pointing right, and Next on the left pointing
 * left.
 */
export const Directions: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid gap-4">
      {(["ltr", "rtl"] as const).map((direction) => (
        <div
          key={direction}
          dir={direction}
          lang={direction === "rtl" ? "ar" : "en"}
          className={[
            "flex flex-col gap-4 rounded-lg border p-6",
            direction === "rtl" ? "font-arabic" : "font-sans",
          ].join(" ")}
        >
          <Head>{direction.toUpperCase()}</Head>
          <Quotes c={COPY[direction]} itemsPerView={2} />
        </div>
      ))}
    </div>
  ),
}
