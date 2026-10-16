import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { Slider, type SliderProps, type SliderSize } from "../../../../packages/fasla-ui/registry/ui/slider"

/**
 * Figma: Slider (40500:60632). Size is a prop; Empty, Half-Full and Full are
 * values (the minimum, a value between, the maximum); Double slider is a
 * range, an array value with a thumb per entry; Focus is keyboard focus;
 * Direction is the toolbar. Every story follows the Direction and Theme
 * toolbars, except Light and Dark and LTR and RTL, which show both at once.
 */

/**
 * The story args: the component's `size` and `className`, plus three
 * story-only rows that set the value. `value` is the one thumb's value, or
 * the start of a range with `range` on; `rangeEnd` is the range's end.
 */
type StoryArgs = Pick<SliderProps, "aria-label" | "aria-labelledby" | "getAriaLabel" | "getAriaValueText"> & {
  ref?: React.Ref<HTMLDivElement>
  size?: SliderSize
  range?: boolean
  value?: number
  rangeEnd?: number
  className?: string
}

const meta: Meta<StoryArgs> = {
  title: "UI/Slider",
  component: Slider as React.ComponentType<StoryArgs>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Track height: 6, 8 or 12px. The thumb is 16px at every size.",
      table: { defaultValue: { summary: '"md"' } },
    },
    range: {
      control: "boolean",
      description: "Story only: two thumbs, a range. In code, pass an array as `value` or `defaultValue`.",
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Story only: the thumb's value, or the start of the range.",
    },
    rangeEnd: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Story only: the end of the range.",
      if: { arg: "range" },
    },
    className: { control: "text", description: "Extra classes for the root." },
    // Behaviour, not looks: these change nothing in the preview. They are on
    // the docs page's Props table.
    "aria-label": { table: { disable: true } },
    "aria-labelledby": { table: { disable: true } },
    getAriaLabel: { table: { disable: true } },
    getAriaValueText: { table: { disable: true } },
    ref: { table: { disable: true } },
  },
  args: { size: "md", range: false, value: 50, rangeEnd: 80 },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script: only the accessible names, since a slider shows no
 * text of its own. Written from design/content/, not translated.
 */
const COPY = {
  ltr: {
    volume: "Volume",
    price: (i: number): string => (i === 0 ? "Minimum price" : "Maximum price"),
  },
  rtl: {
    volume: "مستوى الصوت",
    price: (i: number): string => (i === 0 ? "أدنى سعر" : "أعلى سعر"),
  },
}

type Copy = (typeof COPY)["ltr"]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const SIZES = ["sm", "md", "lg"] as const
/** Figma's three single-thumb Styles, as the values that draw them. */
const STYLES = [
  { name: "Empty", value: 0 },
  { name: "Half-Full", value: 50 },
  { name: "Full", value: 100 },
] as const
/** Figma's Double slider: the fill between two thumbs. */
const RANGE = [25, 75]
const THEMES = ["light", "dark"] as const

/** Figma's canvas width for a single-thumb slider. The component itself fills its container. */
const CELL = "w-[235px]"

/**
 * A column header: a Figma property value, so English and left-to-right in
 * both directions. It never wraps.
 */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/**
 * A side row label. Left-aligned in its column in both directions: the
 * caption is an English property value. It is as tall as the 16px slider
 * and centred on it, and its space from the first slider is the grid's
 * column gap, the same as between two sliders.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
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

/**
 * Cells forced into Focus. The thumb sets `data-focus-visible` itself while
 * its input shows keyboard focus; this sets the same attribute on the thumbs
 * in `[data-state-cell=focus]` cells, so they draw the component's own ring
 * and the grid cannot drift from it. Tab to any thumb to see the real thing.
 */
function ForceFocus({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    ref.current
      ?.querySelectorAll("[data-state-cell=focus] [data-slot=slider-thumb]")
      .forEach((thumb) => thumb.setAttribute("data-focus-visible", ""))
  })
  return <div ref={ref}>{children}</div>
}

const forcedFocus: Decorator = (Story) => (
  <ForceFocus>
    <Story />
  </ForceFocus>
)

/**
 * The playground: every row on the Controls panel changes it. Drag a thumb,
 * or tab to it and use the arrow keys. A new key per value resets the drag
 * when a control moves.
 */
export const Default: Story = {
  render: ({ size, range, value = 50, rangeEnd = 80, className }, ctx) => {
    const c = copy(ctx)
    return (
      <div className={CELL}>
        {range ? (
          <Slider
            key={`range-${value}-${rangeEnd}`}
            size={size}
            defaultValue={[Math.min(value, rangeEnd), Math.max(value, rangeEnd)]}
            getAriaLabel={c.price}
            className={className}
          />
        ) : (
          <Slider key={`one-${value}`} size={size} defaultValue={value} aria-label={c.volume} className={className} />
        )}
      </div>
    )
  },
}

/**
 * Figma's `Size` axis: 6, 8 and 12px tracks. The thumb is 16px at every
 * size, so every slider is 16px tall and only the track changes. Each row
 * label is centred on its slider.
 */
export const Sizes: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(2,235px)] items-center gap-x-6 gap-y-6">
        <span />
        <Head>Single</Head>
        <Head>Range</Head>
        {SIZES.map((size) => (
          <React.Fragment key={size}>
            <RowHead>{size}</RowHead>
            <Slider size={size} defaultValue={50} aria-label={c.volume} />
            <Slider size={size} defaultValue={RANGE} getAriaLabel={c.price} />
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's single-thumb Styles are values, not a prop: Empty is the minimum,
 * Half-Full a value between, Full the maximum. The thumb stays inside the
 * track at both ends, and the fill runs from the start to the thumb, under
 * it. Shown at every size.
 */
export const Values: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(3,235px)] items-center gap-x-6 gap-y-6">
        <span />
        {STYLES.map((style) => (
          <Head key={style.name}>
            {style.name} · {style.value}
          </Head>
        ))}
        {SIZES.map((size) => (
          <React.Fragment key={size}>
            <RowHead>{size}</RowHead>
            {STYLES.map((style) => (
              <Slider key={style.name} size={size} defaultValue={style.value} aria-label={c.volume} />
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's Double slider: an array value gives a thumb per entry and fills
 * the track between them. Each thumb gets its own name from `getAriaLabel`.
 * Dragging one thumb past the other pushes it along.
 */
export const Range: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const ranges = [
      [0, 40],
      [25, 75],
      [60, 100],
    ]
    return (
      <div className="grid grid-cols-[max-content_repeat(3,235px)] items-center gap-x-6 gap-y-6">
        <span />
        {ranges.map((r) => (
          <Head key={r.join("-")}>
            {r[0]} – {r[1]}
          </Head>
        ))}
        {SIZES.map((size) => (
          <React.Fragment key={size}>
            <RowHead>{size}</RowHead>
            {ranges.map((r) => (
              <Slider key={r.join("-")} size={size} defaultValue={r} getAriaLabel={c.price} />
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's two States. Focus is keyboard focus (`:focus-visible`) on the
 * thumb's range input: a 4px ring in `ring` at 50% around the thumb, in
 * place of its shadow. The Focus column is held in that state; tab to any
 * thumb to see it live. A pointer press draws no ring.
 */
export const States: Story = {
  decorators: [forcedFocus, framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(2,235px)] items-center gap-x-6 gap-y-6">
        <span />
        <Head>Default</Head>
        <Head>Focus</Head>
        {SIZES.map((size) => (
          <React.Fragment key={size}>
            <RowHead>{size}</RowHead>
            <Slider size={size} defaultValue={50} aria-label={c.volume} />
            <div data-state-cell="focus">
              <Slider size={size} defaultValue={50} aria-label={c.volume} />
            </div>
          </React.Fragment>
        ))}
        <RowHead>range</RowHead>
        <Slider defaultValue={RANGE} getAriaLabel={c.price} />
        <div data-state-cell="focus">
          <Slider defaultValue={RANGE} getAriaLabel={c.price} />
        </div>
      </div>
    )
  },
}

/**
 * Light and Dark, one panel each, whatever the theme toolbar says. Each panel
 * sets its own theme: the `light` or `dark` class re-points every token for
 * that subtree. Language and direction follow the toolbar.
 */
export const LightAndDark: Story = {
  decorators: [forcedFocus, framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[theme, "grid grid-cols-[max-content_235px] items-center gap-x-6 gap-y-6 rounded-lg border bg-background p-6 text-foreground"].join(" ")}
          >
            <Head className="col-span-2">{theme === "dark" ? "Dark" : "Light"}</Head>
            {STYLES.map((style) => (
              <React.Fragment key={style.name}>
                <RowHead>{style.name}</RowHead>
                <Slider defaultValue={style.value} aria-label={c.volume} />
              </React.Fragment>
            ))}
            <RowHead>Range</RowHead>
            <Slider defaultValue={RANGE} getAriaLabel={c.price} />
            <RowHead>Focus</RowHead>
            <div data-state-cell="focus">
              <Slider defaultValue={50} aria-label={c.volume} />
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Both directions at once, whatever the toolbar says: each panel sets its
 * own `dir`, `lang` and font. In Arabic the fill starts at the right and
 * grows to the left, the thumb at the minimum sits at the right end, and the
 * left arrow raises the value. A range mirrors the same way.
 */
export const LtrAndRtl: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    // Each panel is a subgrid of the same rows, so the two sides share every
    // row's top edge.
    <div className="grid gap-4 md:grid-cols-2">
      {(["ltr", "rtl"] as const).map((direction) => {
        const c = COPY[direction]
        return (
          <div
            key={direction}
            dir={direction}
            lang={direction === "rtl" ? "ar" : "en"}
            className={[
              "row-span-5 grid grid-cols-[max-content_235px] grid-rows-subgrid items-center gap-x-6 gap-y-6 rounded-lg border p-6",
              direction === "rtl" ? "font-arabic" : "font-sans",
            ].join(" ")}
          >
            <Head className="col-span-2">{direction.toUpperCase()}</Head>
            {STYLES.map((style) => (
              <React.Fragment key={style.name}>
                <RowHead>{style.name}</RowHead>
                <Slider defaultValue={style.value} aria-label={c.volume} />
              </React.Fragment>
            ))}
            <RowHead>Range</RowHead>
            <Slider defaultValue={RANGE} getAriaLabel={c.price} />
          </div>
        )
      })}
    </div>
  ),
}
