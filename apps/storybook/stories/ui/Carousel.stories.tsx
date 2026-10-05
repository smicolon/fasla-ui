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

const ITEM_COUNTS = [2, 3, 4] as const

/**
 * Figma's dot stepper itself: one row per `No. of items` (2, 3, 4), one cell
 * per `Active Item`. The track is collapsed so only the indicator shows, as
 * in the Figma set; flip the Direction toolbar for the RTL half.
 */
export const AllStates: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-8">
        {ITEM_COUNTS.map((count) => (
          <div key={count} className="space-y-3">
            <h3 dir="ltr" className="font-sans text-sm font-medium text-foreground">
              No. of items = {count}
            </h3>
            <div className="flex items-center gap-10">
              {Array.from({ length: count }, (_, active) => (
                <div key={active} className="flex flex-col items-center gap-2">
                  <Head>Active Item = {active + 1}</Head>
                  <Carousel aria-label={`${c.gallery} ${count}-${active + 1}`} activeIndex={active}>
                    <CarouselContent className="h-0 gap-0 overflow-hidden" aria-hidden="true">
                      {Array.from({ length: count }, (_, i) => (
                        <CarouselItem key={i} />
                      ))}
                    </CarouselContent>
                    <CarouselDots />
                  </Carousel>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
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
 * `primary` on `muted`, so each panel's class re-points them on its own.
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
