import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "../../../../packages/fasla-ui/registry/ui/carousel"

const meta: Meta<typeof Carousel> = {
  title: "UI/Carousel",
  component: Carousel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    activeIndex: { control: false },
    defaultActiveIndex: { control: "number" },
  },
}

export default meta
type Story = StoryObj<typeof Carousel>

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
const copy = (ctx: StoryCtx): Copy =>
  ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr

const Head = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="w-fit font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/** A side row label: an English Figma name, left-aligned in either direction. */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="justify-self-start whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    {children}
  </span>
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

/** Scroll the track — touch, trackpad or a dot — and the pill follows. */
export const Default: Story = {
  render: (args, ctx) => <Gallery c={copy(ctx)} {...args} />,
}

/** `defaultActiveIndex` — uncontrolled, starting on the third slide. */
export const StartingSlide: Story = {
  render: (args, ctx) => <Gallery c={copy(ctx)} defaultActiveIndex={2} {...args} />,
}

/**
 * Two slides per view (`basis-[calc(50%-8px)]`, half the track less half
 * the 16px gap). Four slides make three views, so there are three dots:
 * the last view shows the third and fourth slides, and a swipe to the end
 * selects the last dot.
 */
export const SeveralPerView: Story = {
  parameters: { controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Carousel aria-label={c.gallery} className="w-[36rem] max-w-full space-y-4">
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

const ITEM_COUNTS = [2, 3, 4] as const
const ACTIVE_ITEMS = [1, 2, 3, 4] as const

/**
 * Figma's dot stepper, every variant: one row per `No. of items`, one column
 * per `Active Item`. These are dots on their own, with a `count` and an
 * `activeIndex` and no Carousel around them, which is how a gallery uses
 * them. The Direction toolbar shows the RTL half: the first dot is on the
 * right.
 */
export const AllStates: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[max-content_repeat(4,max-content)] items-center justify-center justify-items-center gap-x-10 gap-y-6">
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
      <div className="grid grid-cols-[max-content_repeat(2,max-content)] items-center justify-center justify-items-center gap-x-10 gap-y-8">
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
          {index + 1} / {c.slides.slice(0, 3).length}
        </span>
      </p>
    </div>
  )
}

/** `activeIndex` with `onActiveIndexChange`: the state lives outside. */
export const Controlled: Story = {
  render: (_args, ctx) => <ControlledDemo c={copy(ctx)} />,
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark side by side, whatever the theme toolbar says. The dots are
 * `primary` and `muted-foreground`, so each panel's class re-points them on its own.
 */
export const LightAndDark: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[
              "flex flex-col items-center gap-4 rounded-lg border bg-background p-6 text-foreground",
              theme,
            ].join(" ")}
          >
            <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
            <Gallery c={c} defaultActiveIndex={1} />
          </div>
        ))}
      </div>
    )
  },
}
