import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  ContentCarousel,
  ContentCarouselItem,
} from "../../../../packages/fasla-ui/registry/ui/content-carousel"

const meta: Meta<typeof ContentCarousel> = {
  title: "UI/ContentCarousel",
  component: ContentCarousel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    itemsPerView: { control: "inline-radio", options: [1, 2, 3] },
    activeIndex: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof ContentCarousel>

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
    photos: ["البلدة القديمة عند الفجر", "سوق الميناء", "الكورنيش عند الغروب", "حي المتاحف"],
    state: "أول بطاقة ظاهرة",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy =>
  ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr

const Head = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="w-fit font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/** A testimonial slot: text content brings its own padding. */
const Quote = ({ quote }: { quote: Copy["quotes"][number] }) => (
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
  ...props
}: { c: Copy; count?: number } & Partial<React.ComponentProps<typeof ContentCarousel>>) => (
  <ContentCarousel
    aria-label={c.label}
    previousLabel={c.previous}
    nextLabel={c.next}
    className="w-full max-w-2xl"
    {...props}
  >
    {c.quotes.slice(0, count).map((quote) => (
      <ContentCarouselItem key={quote.name}>
        <Quote quote={quote} />
      </ContentCarouselItem>
    ))}
  </ContentCarousel>
)

/** Every control in the Controls panel drives this one. */
export const Default: Story = {
  parameters: { layout: "padded" },
  render: (args, ctx) => <Quotes c={copy(ctx)} {...args} />,
}

const ITEMS_PER_VIEW = [1, 2, 3] as const

/**
 * Figma's `Type` axis: Single box, Two boxes, Three boxes. The cards split
 * the row evenly, each ceding its share of the 16px gaps; the arrows always
 * advance one card. Flip the Direction toolbar for the RTL half of the set.
 */
export const ItemsPerView: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-8">
        {ITEMS_PER_VIEW.map((itemsPerView) => (
          <div key={itemsPerView} className="space-y-3">
            <Head>itemsPerView = {itemsPerView}</Head>
            <Quotes c={c} itemsPerView={itemsPerView} />
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Edge-to-edge media: the slot has no padding of its own, so an image (here a
 * token-coloured stand-in) reaches the card's rounded border on every side.
 */
export const MediaSlots: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <ContentCarousel
        aria-label={c.galleryLabel}
        previousLabel={c.previous}
        nextLabel={c.next}
        itemsPerView={3}
        className="w-full max-w-2xl"
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
 * The ends. The backward arrow is off on the first card, the forward arrow
 * off on the last *page* — with three cards two-up, the last page starts at
 * the second card. Figma draws the off arrow at 50% opacity.
 */
export const DisabledEnds: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <Head>first card</Head>
          <Quotes c={c} count={3} itemsPerView={2} activeIndex={0} />
        </div>
        <div className="space-y-3">
          <Head>last page</Head>
          <Quotes c={c} count={3} itemsPerView={2} activeIndex={1} />
        </div>
        <div className="space-y-3">
          <Head>everything in view</Head>
          <Quotes c={c} count={3} itemsPerView={3} />
        </div>
      </div>
    )
  },
}

const ControlledDemo = ({ c }: { c: Copy }) => {
  const [index, setIndex] = React.useState(0)
  return (
    <div className="flex w-full flex-col items-center gap-3">
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
  parameters: { layout: "padded" },
  render: (_args, ctx) => <ControlledDemo c={copy(ctx)} />,
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark side by side, whatever the theme toolbar says. Cards are
 * `card` on `border`, arrows `background` on `border`, so each panel's class
 * re-points every token for its subtree.
 */
export const LightAndDark: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[
              "flex flex-col items-center gap-4 rounded-lg border bg-background p-6 text-foreground",
              theme,
            ].join(" ")}
          >
            <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
            <Quotes c={c} itemsPerView={2} />
          </div>
        ))}
      </div>
    )
  },
}
