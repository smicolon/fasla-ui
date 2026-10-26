import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselProps,
} from "../../../../packages/fasla-ui/registry/ui/carousel"

/**
 * Figma: Carousel (40600:96155), the dot stepper. `No. of items` is how many
 * slides you render, `Active Item` is the active slide, and Direction is the
 * toolbar. Every story follows the Direction and Theme toolbars, except Light
 * and Dark and Directions, which show both at once.
 */

/**
 * The story args: `defaultActiveIndex` and `className`, plus one story-only
 * row, `slides`, that sets how many slides the preview renders.
 */
type StoryArgs = Partial<Pick<CarouselProps, "activeIndex" | "onActiveIndexChange" | "children">> & {
  slides?: number
  defaultActiveIndex?: number
  className?: string
}

const meta: Meta<StoryArgs> = {
  title: "UI/Carousel",
  component: Carousel as unknown as React.ComponentType<StoryArgs>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    slides: {
      control: "inline-radio",
      options: [2, 3, 4],
      description: "Story only: how many slides, Figma's `No. of items`. There is a dot per slide.",
    },
    defaultActiveIndex: {
      control: "inline-radio",
      options: [0, 1, 2, 3],
      description: "The slide to start on, counted from 0: Figma's `Active Item` less one.",
      table: { defaultValue: { summary: "0" } },
    },
    className: { control: "text", description: "Extra classes for the root." },
    // Behaviour, not looks: these change nothing in the preview. They are on
    // the docs page's Props table.
    activeIndex: { table: { disable: true } },
    onActiveIndexChange: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: { slides: 3, defaultActiveIndex: 0 },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script.
 *
 * Only the *rendered values* change — prop names stay English everywhere.
 * The Arabic follows design/content/: a real situation (a photo tour of a
 * city guide), never a placeholder, and it matches the docs site.
 */
const COPY = {
  ltr: {
    gallery: "City guide",
    slides: ["The old town at dawn", "The harbour market", "The corniche at sunset", "The museum quarter"],
    state: "Slide",
  },
  rtl: {
    gallery: "دليل المدينة",
    slides: ["البلدة القديمة عند الفجر", "سوق الميناء", "الكورنيش عند الغروب", "حي المتاحف"],
    state: "الشريحة الحالية",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const THEMES = ["light", "dark"] as const
const ITEM_COUNTS = [2, 3, 4] as const
const ACTIVE_ITEMS = [1, 2, 3, 4] as const

/**
 * A column header: a Figma property value, so English and left-to-right in
 * both directions. It never wraps, and `leading-4` keeps it the same height
 * under an RTL toolbar, where `text-xs` would take Cairo's taller line.
 */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    dir="ltr"
    className={["w-fit whitespace-nowrap font-sans text-xs leading-4 text-muted-foreground", className].join(" ")}
  >
    {children}
  </span>
)

/**
 * A side row label. Left-aligned in its column in both directions, centred
 * on the component it names, and one column gap from it.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="justify-self-start whitespace-nowrap text-left font-sans text-xs leading-4 text-muted-foreground">
    {children}
  </span>
)

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

/** A token-coloured stand-in for slide media — no raw colours, no assets. */
const Slide = ({ caption }: { caption: string }) => (
  <div className="flex h-44 items-end rounded-lg bg-muted p-4">
    <span className="text-sm font-medium text-foreground">{caption}</span>
  </div>
)

const Gallery = ({
  c,
  count = 3,
  ...props
}: { c: Copy; count?: number } & Partial<React.ComponentProps<typeof Carousel>>) => (
  <Carousel aria-label={c.gallery} className="w-80 space-y-4" {...props}>
    <CarouselContent>
      {c.slides.slice(0, count).map((caption) => (
        <CarouselItem key={caption}>
          <Slide caption={caption} />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselDots />
  </Carousel>
)

/**
 * The playground: every row on the Controls panel changes it. Swipe, use a
 * trackpad, press a dot, or tab to the track and use the arrow keys; the
 * pill follows. A new key per value restarts it when a control moves.
 */
export const Default: Story = {
  render: ({ slides = 3, defaultActiveIndex = 0, className }, ctx) => (
    <Gallery
      key={`${slides}-${defaultActiveIndex}`}
      c={copy(ctx)}
      count={slides}
      defaultActiveIndex={defaultActiveIndex}
      className={["w-80 space-y-4", className].join(" ")}
    />
  ),
}

/**
 * Figma's dot stepper, every variant: one row per `No. of items`, one column
 * per `Active Item`. These are dots on their own, with a `count` and an
 * `activeIndex` and no Carousel around them, which is how a gallery uses
 * them. In RTL the first dot is on the right.
 */
export const AllStates: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[max-content_repeat(4,max-content)] items-center justify-items-center gap-x-10 gap-y-6">
      <span />
      {ACTIVE_ITEMS.map((active) => (
        <Head key={active}>Active Item {active}</Head>
      ))}
      {ITEM_COUNTS.map((count) => (
        <React.Fragment key={count}>
          <RowHead>{count} items</RowHead>
          {ACTIVE_ITEMS.map((active) =>
            active <= count ? (
              <CarouselDots key={active} count={count} activeIndex={active - 1} />
            ) : (
              <span key={active} />
            )
          )}
        </React.Fragment>
      ))}
    </div>
  ),
}

/**
 * Default and Focus. Focus is keyboard focus (`:focus-visible`) and draws
 * the Button's ring: 2px of `ring`, 2px clear. On a dot it rings the pill or
 * circle itself, not the larger area you can press; on the track it rings
 * the track. The Focus column is held in that state; tab into a carousel to
 * see it live. A pointer press draws no ring.
 */
export const States: Story = {
  decorators: [framed],
  parameters: {
    layout: "padded",
    controls: { disable: true },
    pseudo: {
      focusVisible: [
        "#carousel-focus-dots [data-slot=carousel-dot]:first-child",
        "#carousel-focus-track [data-slot=carousel-content]",
      ],
    },
  },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(2,max-content)] items-center justify-items-center gap-x-10 gap-y-8">
        <span />
        <Head>Default</Head>
        <Head>Focus</Head>
        <RowHead>Dots</RowHead>
        <CarouselDots count={3} activeIndex={0} />
        <div id="carousel-focus-dots">
          <CarouselDots count={3} activeIndex={0} />
        </div>
        <RowHead>Track</RowHead>
        <Gallery c={c} className="w-64 space-y-4" />
        <div id="carousel-focus-track">
          <Gallery c={c} className="w-64 space-y-4" />
        </div>
      </div>
    )
  },
}

/**
 * Two slides per view (`basis-[calc(50%-8px)]`: half the track, less half
 * the 16px gap). Four slides make three views, so there are three dots: the
 * last view shows the third and fourth slides, and a swipe to the end
 * selects the last dot.
 */
export const SeveralPerView: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Carousel aria-label={c.gallery} className="w-[36rem] space-y-4">
        <CarouselContent>
          {c.slides.map((caption) => (
            <CarouselItem key={caption} className="basis-[calc(50%-8px)]">
              <Slide caption={caption} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    )
  },
}

const StandaloneDemo = ({ c }: { c: Copy }) => {
  const [index, setIndex] = React.useState(0)
  return (
    <div className="flex w-80 flex-col gap-4">
      <Slide caption={c.slides[index]!} />
      <CarouselDots count={c.slides.length} activeIndex={index} onActiveIndexChange={setIndex} />
    </div>
  )
}

/**
 * Dots on their own: `count`, `activeIndex` and `onActiveIndexChange`, and
 * no Carousel. The picture above is plain state, as a gallery block would
 * hold it; press a dot to change it.
 */
export const StandaloneDots: Story = {
  parameters: { controls: { disable: true } },
  render: (_args, ctx) => <StandaloneDemo c={copy(ctx)} />,
}

const ControlledDemo = ({ c }: { c: Copy }) => {
  const [index, setIndex] = React.useState(0)
  return (
    <div className="flex flex-col items-center gap-3">
      <Gallery c={c} activeIndex={index} onActiveIndexChange={setIndex} />
      <p className="text-sm text-muted-foreground">
        {c.state}:{" "}
        {/* Digits are bidi-safe; "2 / 3" reads the same in both directions. */}
        <span className="font-medium text-foreground" dir="ltr">
          {index + 1} / 3
        </span>
      </p>
    </div>
  )
}

/** `activeIndex` with `onActiveIndexChange`: the state lives outside. */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: (_args, ctx) => <ControlledDemo c={copy(ctx)} />,
}

/**
 * Light and Dark, one panel each, whatever the theme toolbar says. Each panel
 * sets its own theme: the `light` or `dark` class re-points every token for
 * that subtree. The dots under the gallery hold Focus on the active pill.
 */
export const LightAndDark: Story = {
  decorators: [framed],
  parameters: {
    layout: "padded",
    controls: { disable: true },
    pseudo: { focusVisible: THEMES.map((theme) => `#carousel-${theme}-focus [data-slot=carousel-dot]:nth-child(2)`) },
  },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[theme, "flex flex-col items-center gap-6 rounded-lg border bg-background p-6 text-foreground"].join(" ")}
          >
            <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
            <Gallery c={c} defaultActiveIndex={1} />
            <div id={`carousel-${theme}-focus`}>
              <CarouselDots count={3} activeIndex={1} />
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Both directions at once, whatever the toolbar says: each panel sets its
 * own `dir`, `lang` and font. In Arabic the first slide and the first dot
 * sit on the right, and the left arrow key moves forward.
 */
export const Directions: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {(["ltr", "rtl"] as const).map((direction) => (
        <div
          key={direction}
          dir={direction}
          lang={direction === "rtl" ? "ar" : "en"}
          className={[
            "flex flex-col items-center gap-6 rounded-lg border p-6",
            direction === "rtl" ? "font-arabic" : "font-sans",
          ].join(" ")}
        >
          <Head>{direction.toUpperCase()}</Head>
          <Gallery c={COPY[direction]} />
        </div>
      ))}
    </div>
  ),
}
