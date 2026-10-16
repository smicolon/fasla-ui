import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import {
  InputNumber,
  type InputNumberProps,
  type InputNumberVariant,
} from "../../../../packages/fasla-ui/registry/ui/input-number"

/**
 * Figma: "Input Number" (39043:1432) and its internal "Input Number Button"
 * (46381:5702). Variant and State are props here; Filled is the difference
 * between a placeholder and a value; Direction is the toolbar. Every story
 * follows the Direction and Theme toolbars, except Directions and Light and
 * Dark, which show both at once.
 *
 * The controls are the props that change the preview. Behaviour props —
 * `min`, `max`, `step`, `value`, `name`, `form`, `id`, the buttons' names and
 * the `aria-*` props — are on the docs site's Props table only.
 */
const meta: Meta<InputNumberProps> = {
  title: "UI/Input Number",
  component: InputNumber,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "vertically-stacked", "horizontally-stacked", "horizontally-stretched", "mini"],
    },
    status: { control: "inline-radio", options: ["default", "success"] },
    invalid: { control: "boolean" },
    disabled: {
      control: "boolean",
      description: "Disables the input and both buttons, and dims the whole field to half opacity.",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    // Behaviour props: they change nothing in the preview.
    incrementLabel: { table: { disable: true } },
    decrementLabel: { table: { disable: true } },
    "aria-label": { table: { disable: true } },
    "aria-labelledby": { table: { disable: true } },
    "aria-describedby": { table: { disable: true } },
    "aria-invalid": { table: { disable: true } },
  },
  args: { variant: "default", status: "default", invalid: false, disabled: false },
}

export default meta
type Story = StoryObj<InputNumberProps>

/**
 * Sample copy, per script: an order and a booking form. Only the rendered
 * text changes; prop names stay English everywhere. The digits are Western in
 * both, as the component draws them.
 */
const COPY = {
  ltr: { quantity: "Quantity", guests: "Guests", nights: "Nights", seats: "Seats" },
  rtl: { quantity: "الكمية", guests: "عدد الضيوف", nights: "عدد الليالي", seats: "عدد المقاعد" },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const VARIANTS: InputNumberVariant[] = [
  "default",
  "vertically-stacked",
  "horizontally-stacked",
  "horizontally-stretched",
  "mini",
]
const STATES = ["default", "focus", "success", "destructive", "disabled"] as const
type State = (typeof STATES)[number]

const title = (s: string) =>
  s
    .split("-")
    .map((word, i) => (i === 0 ? word[0]!.toUpperCase() + word.slice(1) : word))
    .join(" ")

/** The props that put a field in one of Figma's States. Focus is forced by the pseudo-states addon. */
const stateProps = (state: State): Partial<InputNumberProps> =>
  state === "success"
    ? { status: "success" }
    : state === "destructive"
      ? { invalid: true }
      : state === "disabled"
        ? { disabled: true }
        : {}

/** Figma's widths: 288px, and 128px for Mini. */
const width = (variant: InputNumberVariant | undefined) => (variant === "mini" ? "w-32" : "w-72")

/**
 * A caption over a cell or a column: Figma names, so English and
 * left-to-right in both directions. It never wraps.
 */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["block w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/**
 * A side row label, centred on the field's box by the grid's `items-center`
 * (no field in those grids has a label above it). Left-aligned in both
 * directions, a column gap from the field.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/** A labelled cell: the caption above, the field under it. */
const Cell = ({ head, children }: { head: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <Head>{head}</Head>
    {children}
  </div>
)

/**
 * The frame round every story but Default. It centres the content in the
 * canvas in either direction, and scrolls it sideways in the story's own
 * direction when it is wider than the canvas (a phone). 4px of padding keeps
 * a field's focus halo clear of the clip.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/** Cells forced into Focus: the pseudo-states addon applies the real `:focus-within` to their boxes. */
const FOCUS_CELLS = ["[data-state-cell=focus] [data-slot=input-number-box]"]

/** The playground: every prop on the Controls panel. */
export const Default: Story = {
  render: (args, ctx) => (
    <InputNumber
      {...args}
      label={args.label ?? copy(ctx).quantity}
      placeholder={args.placeholder ?? "0"}
      min={0}
      className={[width(args.variant), args.className].filter(Boolean).join(" ")}
    />
  ),
}

/**
 * One Figma Variant: empty and filled, at its minimum and its maximum, and
 * with Figma's optional label. At a limit the matching button is disabled
 * and stays in place. Two columns share each row's bottom edge, so a field
 * with a label lines up with the one beside it.
 */
const variantStory = (variant: InputNumberVariant): Story => ({
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const cells: [string, React.ReactNode][] = [
      ["Empty", <InputNumber variant={variant} aria-label={c.quantity} placeholder="0" min={0} max={10} />],
      ["Filled", <InputNumber variant={variant} aria-label={c.quantity} defaultValue={1} min={0} max={10} />],
      ["At min (0)", <InputNumber variant={variant} aria-label={c.guests} defaultValue={0} min={0} max={10} />],
      ["At max (10)", <InputNumber variant={variant} aria-label={c.guests} defaultValue={10} min={0} max={10} />],
      ["With label", <InputNumber variant={variant} label={c.nights} defaultValue={3} min={1} max={30} />],
      // Mini's value has 40px between its buttons: a longer number needs a wider field.
      [
        variant === "mini" ? "Large value, className w-40" : "Large value",
        <InputNumber
          variant={variant}
          aria-label={c.seats}
          defaultValue={1250}
          min={0}
          className={variant === "mini" ? "w-40" : undefined}
        />,
      ],
    ]
    const column = variant === "mini" ? "10rem" : "18rem"
    return (
      <div
        // A shared bottom edge: "With label" and "Large value" share a row,
        // and the two fields sit on one line. The other rows are the same
        // height either way.
        className="grid items-end gap-x-6 gap-y-5"
        style={{ gridTemplateColumns: `repeat(2, ${column})` }}
      >
        {cells.map(([caption, field]) => (
          <Cell key={caption} head={caption}>
            {field}
          </Cell>
        ))}
      </div>
    )
  },
})

/**
 * Figma `Variant=Default`: the value, then two Icon Buttons (Soft, Primary,
 * xs) 6px apart and 6px in from the border.
 */
export const DefaultVariant: Story = variantStory("default")

/**
 * `Vertically Stacked Buttons`: a 23px column after the value, plus over
 * minus in either direction, each half the field's height. A 1px `input`
 * line divides them from the value and from each other.
 */
export const VerticallyStacked: Story = variantStory("vertically-stacked")

/**
 * `Horizontally Stacked Buttons`: minus, then plus, after the value, each
 * 36px wide with a 1px `input` divider on the side that faces the value.
 */
export const HorizontallyStacked: Story = variantStory("horizontally-stacked")

/**
 * `Horizontally Stretched Buttons`: minus before the value and plus after it,
 * each with its divider on the side that faces the value.
 */
export const HorizontallyStretched: Story = variantStory("horizontally-stretched")

/**
 * `Mini`: 128px wide, an Icon Button on each side of the value, with Input's
 * 12px padding and a 6px gap.
 */
export const Mini: Story = variantStory("mini")

/**
 * Figma's five States, empty and filled, for the variant on the Controls
 * panel. They are Input's: Focus is the real `:focus-within`, forced by the
 * pseudo-states addon; Success and Destructive recolour the border and the
 * focus halo; Disabled dims the whole field to half.
 */
export const States: Story = {
  decorators: [framed],
  parameters: { layout: "padded", pseudo: { focusWithin: FOCUS_CELLS }, controls: { include: ["variant"] } },
  render: ({ variant = "default" }, ctx) => {
    const c = copy(ctx)
    const column = variant === "mini" ? "8rem" : "18rem"
    return (
      <div
        className="grid items-center gap-x-6 gap-y-4"
        style={{ gridTemplateColumns: `max-content repeat(2, ${column})` }}
      >
        <span />
        <Head>Empty</Head>
        <Head>Filled</Head>
        {STATES.map((state) => (
          <React.Fragment key={state}>
            <RowHead>{title(state)}</RowHead>
            {[undefined, 1].map((value) => (
              <div key={String(value)} data-state-cell={state}>
                <InputNumber
                  {...stateProps(state)}
                  variant={variant}
                  aria-label={c.quantity}
                  placeholder="0"
                  defaultValue={value}
                  min={0}
                  max={10}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

const PANELS = [
  { dir: "ltr", lang: "en", title: "LTR", copy: COPY.ltr },
  { dir: "rtl", lang: "ar", title: "RTL", copy: COPY.rtl },
] as const

/**
 * English and Arabic side by side, whatever the Direction toolbar says. In
 * Arabic every row starts on the right: the buttons and their dividers swap
 * sides with nothing but logical properties, and minus and plus trade places.
 * Vertically Stacked keeps plus on top. The digits stay Western. Each panel
 * is a subgrid of the same rows, so the two sides share every row's top edge.
 */
export const Directions: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[repeat(2,20rem)] gap-4">
      {PANELS.map((panel) => (
        <div
          key={panel.dir}
          dir={panel.dir}
          lang={panel.lang}
          className={[
            "row-span-6 grid min-w-0 grid-rows-subgrid items-start gap-y-4 rounded-lg border p-4",
            panel.dir === "rtl" ? "font-arabic" : "font-sans",
          ].join(" ")}
        >
          <Head>{panel.title}</Head>
          {VARIANTS.map((variant) => (
            <Cell key={variant} head={title(variant)}>
              <InputNumber
                variant={variant}
                label={variant === "default" ? panel.copy.quantity : undefined}
                aria-label={variant === "default" ? undefined : panel.copy.quantity}
                defaultValue={-5}
                min={-10}
                max={10}
                className={width(variant)}
              />
            </Cell>
          ))}
        </div>
      ))}
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark side by side, whatever the theme toolbar says, for the
 * variant on the Controls panel. Language and direction follow the Direction
 * toolbar. Each panel's `light` or `dark` class re-points every token for its
 * subtree.
 */
export const LightAndDark: Story = {
  name: "Light and Dark",
  decorators: [framed],
  parameters: { layout: "padded", pseudo: { focusWithin: FOCUS_CELLS }, controls: { include: ["variant"] } },
  render: ({ variant = "default" }, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[repeat(2,20rem)] gap-4">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[
              "row-span-6 grid min-w-0 grid-rows-subgrid items-start gap-y-4 rounded-lg border bg-background p-4 text-foreground",
              theme,
            ].join(" ")}
          >
            <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
            {STATES.map((state) => (
              <Cell key={state} head={title(state)}>
                <div data-state-cell={state}>
                  <InputNumber
                    {...stateProps(state)}
                    variant={variant}
                    aria-label={c.quantity}
                    defaultValue={1}
                    min={0}
                    max={10}
                    className={width(variant)}
                  />
                </div>
              </Cell>
            ))}
          </div>
        ))}
      </div>
    )
  },
}
