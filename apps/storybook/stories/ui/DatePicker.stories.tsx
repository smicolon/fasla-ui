import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { MapPinIcon } from "lucide-react"
import { DatePicker, type DatePickerProps } from "../../../../packages/fasla-ui/registry/ui/date-picker"
import { Select } from "../../../../packages/fasla-ui/registry/ui/select"
import { cn } from "../../../../packages/fasla-ui/src/lib/utils"

/**
 * Figma: "Date Picker" (15113:5466), opening the Standard Calendar
 * (15117:6294). Size and State are props; Figma's Inactive and Active are
 * the placeholder and a value; Direction is the toolbar. Every story follows
 * the Direction and Theme toolbars, except Light and Dark and Directions,
 * which show both at once.
 *
 * The trigger is Select's, so the Beside a Select story is the check that the
 * two line up. "Today" is pinned to 17 June 2026, so the stories never move.
 */

/** The flat story args: `DatePickerProps` is a union per `mode`, which Storybook's `Meta` cannot take. */
type StoryArgs = Omit<DatePickerProps, "mode" | "value" | "defaultValue" | "onValueChange"> & {
  mode?: "single" | "range"
  // Named only so the Controls table can hide them; each cell passes a value of the right shape.
  value?: unknown
  defaultValue?: unknown
  onValueChange?: unknown
}

const AnyDatePicker = DatePicker as unknown as React.ForwardRefExoticComponent<
  StoryArgs & { defaultValue?: Date | { from?: Date; to?: Date } | null }
>

const meta: Meta<StoryArgs> = {
  title: "UI/Date Picker",
  component: DatePicker as unknown as React.ComponentType<StoryArgs>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    mode: { control: "inline-radio", options: ["single", "range"], description: "One day, or a range from one day to another." },
    disabled: { control: "boolean" },
    label: { control: "text" },
    labelEnd: { control: "text" },
    description: { control: "text" },
    descriptionEnd: { control: "text" },
    placeholder: { control: "text" },
    className: { control: "text" },
    // Behaviour, data and Base UI's escape hatches: they change nothing in
    // the closed preview. They are on the docs page's Props table.
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    numberOfMonths: { table: { disable: true } },
    calendarProps: { table: { disable: true } },
    name: { table: { disable: true } },
    form: { table: { disable: true } },
    id: { table: { disable: true } },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    collisionAvoidance: { table: { disable: true } },
    container: { table: { disable: true } },
    "aria-label": { table: { disable: true } },
    "aria-labelledby": { table: { disable: true } },
  },
  args: { size: "md", mode: "single", disabled: false },
}

export default meta
type Story = StoryObj<StoryArgs>

const TODAY = new Date(2026, 5, 17)
const DAY = new Date(2026, 5, 6)
const RANGE = { from: new Date(2026, 0, 20), to: new Date(2026, 1, 9) }

/** Sample copy, per script. The Arabic is written in Modern Standard Arabic, not translated word for word. */
const COPY = {
  ltr: {
    date: "Delivery date",
    dateHelp: "We deliver between 9am and 5pm.",
    stay: "Stay",
    stayHelp: "Check-in and check-out.",
    optional: "Optional",
    nights: "20 nights",
    city: "City",
    cityHelp: "Where we deliver your order.",
    cities: [
      { value: "riyadh", label: "Riyadh" },
      { value: "jeddah", label: "Jeddah" },
    ],
  },
  rtl: {
    date: "تاريخ التوصيل",
    dateHelp: "نوصل الطلبات بين 9 صباحًا و5 مساءً.",
    stay: "مدة الإقامة",
    stayHelp: "تاريخا الوصول والمغادرة.",
    optional: "اختياري",
    nights: "20 ليلة",
    city: "المدينة",
    cityHelp: "حيث نوصل طلبك.",
    cities: [
      { value: "riyadh", label: "الرياض" },
      { value: "jeddah", label: "جدة" },
    ],
  },
}
type Copy = (typeof COPY)["ltr"]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const SIZES = ["xs", "sm", "md", "lg"] as const
const STATES = ["default", "focus", "disabled"] as const
/** Figma's Inactive and Active, plus a range: the placeholder, one day, and a range. */
const FILLS = ["placeholder", "date", "range"] as const
type Fill = (typeof FILLS)[number]

const fillProps = (fill: Fill): Partial<React.ComponentProps<typeof AnyDatePicker>> =>
  fill === "placeholder" ? {} : fill === "date" ? { defaultValue: DAY } : { mode: "range", defaultValue: RANGE }

const title = (s: string) => s[0]!.toUpperCase() + s.slice(1)
const calendarProps = { today: TODAY }

/** A column header or a caption: Figma names, so English and left-to-right in both directions. It never wraps. */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={cn("w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className)}>
    {children}
  </span>
)

/** A side row label, left-aligned in both directions, one column gap from the first field. */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

const BOX_HEIGHT = { xs: "h-7", sm: "h-8", md: "h-9", lg: "h-10" } as const

/** A side row label centred on a field's box, not on its label or helper text, as on Select. */
const BoxLineHead = ({ children, size = "md" }: { children: React.ReactNode; size?: keyof typeof BOX_HEIGHT }) => (
  <span dir="ltr" className="flex flex-col whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    <span aria-hidden className="p-1 text-sm">
      {"​"}
    </span>
    <span className={cn("flex items-center", BOX_HEIGHT[size])}>{children}</span>
  </span>
)

/** The frame round every story but Default: centred in either direction, scrolling sideways on a phone. */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

const FOCUS_CELLS = ["[data-state-cell=focus] [data-slot=date-picker-trigger]"]

/**
 * A date picker held open, with exactly the room its calendar takes reserved
 * under it: the calendar's own height plus the 4px gap. The calendar renders
 * into this cell, so it scrolls with the story and takes a themed panel's
 * tokens. It never flips above the trigger. The room changes only when it is
 * more than a pixel off.
 */
function HeldOpen(props: React.ComponentProps<typeof AnyDatePicker>) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [room, setRoom] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!cell) return
    let observed: Element | null = null
    const resize = new ResizeObserver(([entry]) => {
      const next = Math.ceil(entry!.borderBoxSize[0]!.blockSize) + 4
      setRoom((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    })
    const find = () => {
      const calendar = cell.querySelector("[data-slot=calendar]")
      if (calendar && calendar !== observed) {
        if (observed) resize.unobserve(observed)
        observed = calendar
        resize.observe(calendar)
      }
    }
    const mutations = new MutationObserver(find)
    mutations.observe(cell, { childList: true, subtree: true })
    find()
    return () => {
      mutations.disconnect()
      resize.disconnect()
    }
  }, [cell])

  // Base UI misses a move caused by a parent's padding; a resize makes it place the calendar again.
  React.useEffect(() => {
    window.dispatchEvent(new Event("resize"))
  }, [room])

  return (
    <div ref={setCell} className="relative" style={{ paddingBottom: room }}>
      {cell && (
        <AnyDatePicker
          defaultOpen
          collisionAvoidance={{ side: "none" }}
          container={cell}
          calendarProps={calendarProps}
          {...props}
        />
      )}
    </div>
  )
}

/** The playground: every row on the Controls panel changes it. */
export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    const range = args.mode === "range"
    // The value props are hidden from Controls; the playground starts empty.
    const { value: _value, defaultValue: _defaultValue, onValueChange: _onValueChange, ...shown } = args
    return (
      <AnyDatePicker
        key={String(args.mode)}
        {...shown}
        className={cn("w-72", args.className)}
        label={args.label ?? (range ? c.stay : c.date)}
        description={args.description ?? (range ? c.stayHelp : c.dateHelp)}
        numberOfMonths={range ? 2 : 1}
        calendarProps={calendarProps}
      />
    )
  },
}

/**
 * Figma's four sizes — 28, 32, 36 and 40px — with the placeholder, one day
 * and a range. As on Select, only the height and the icon↔text gap change:
 * the padding is 12px and the icon 16px at every size.
 */
export const Sizes: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(3,16.5rem)] items-center gap-x-6 gap-y-4">
        <span />
        {FILLS.map((fill) => (
          <Head key={fill}>{title(fill)}</Head>
        ))}
        {SIZES.map((size) => (
          <React.Fragment key={size}>
            <RowHead>{size}</RowHead>
            {FILLS.map((fill) => (
              <AnyDatePicker key={fill} {...fillProps(fill)} size={size} aria-label={fill === "range" ? c.stay : c.date} calendarProps={calendarProps} />
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's three States, with the label and helper text on. Focus is the real
 * `:focus-visible`, forced by the pseudo-states addon; the trigger also shows
 * it while the calendar is open. Disabled dims the whole field.
 */
export const States: Story = {
  decorators: [framed],
  parameters: { layout: "padded", pseudo: { focusVisible: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(3,16.5rem)] items-start gap-x-6 gap-y-5">
        <span />
        {FILLS.map((fill) => (
          <Head key={fill}>{title(fill)}</Head>
        ))}
        {STATES.map((state) => (
          <React.Fragment key={state}>
            <BoxLineHead>{title(state)}</BoxLineHead>
            {FILLS.map((fill) => (
              <div key={fill} data-state-cell={state}>
                <AnyDatePicker
                  {...fillProps(fill)}
                  disabled={state === "disabled"}
                  label={fill === "range" ? c.stay : c.date}
                  labelEnd={c.optional}
                  description={fill === "range" ? c.stayHelp : c.dateHelp}
                  calendarProps={calendarProps}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/** Each optional part on its own, then all together. Flip the Direction toolbar: everything at a start or an end swaps sides. */
export const Parts: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const cells: [string, React.ReactNode][] = [
      ["label", <DatePicker label={c.date} calendarProps={calendarProps} />],
      ["label + labelEnd", <DatePicker label={c.date} labelEnd={c.optional} calendarProps={calendarProps} />],
      ["description", <DatePicker label={c.date} description={c.dateHelp} calendarProps={calendarProps} />],
      [
        "Every part",
        <DatePicker
          mode="range"
          label={c.stay}
          labelEnd={c.optional}
          description={c.stayHelp}
          descriptionEnd={c.nights}
          defaultValue={RANGE}
          calendarProps={calendarProps}
        />,
      ],
    ]
    return (
      <div className="grid grid-cols-[17rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,20rem)]">
        {cells.map(([caption, field]) => (
          <div key={caption} className="flex flex-col gap-1.5">
            <Head>{caption}</Head>
            {field}
          </div>
        ))}
      </div>
    )
  },
}

/**
 * A Date Picker beside a Select of the same size, at every size, with every
 * part on: the label rows, the boxes, the icons, the text and the helper rows
 * line up exactly, because the trigger is Select's. Flip the Direction and
 * Theme toolbars to check RTL and Dark.
 */
export const BesideSelect: Story = {
  name: "Beside a Select",
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(2,18rem)] items-start gap-x-6 gap-y-5">
        <span />
        <Head>Select</Head>
        <Head>Date Picker</Head>
        {SIZES.map((size) => (
          <React.Fragment key={size}>
            <BoxLineHead size={size}>{size}</BoxLineHead>
            <Select
              size={size}
              label={c.city}
              labelEnd={c.optional}
              description={c.cityHelp}
              startIcon={<MapPinIcon />}
              defaultValue="riyadh"
              items={c.cities}
            />
            <DatePicker
              size={size}
              label={c.date}
              labelEnd={c.optional}
              description={c.dateHelp}
              defaultValue={DAY}
              calendarProps={calendarProps}
            />
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * The calendar open under the trigger, 4px below it and lined up with its
 * start edge, the trigger in Focus. Choosing a day closes it; a range closes
 * once both ends are chosen.
 */
export const Open: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid items-start gap-x-8 gap-y-6 lg:grid-cols-[18rem_31rem]">
        <div className="flex flex-col gap-1.5">
          <Head>Single</Head>
          <HeldOpen label={c.date} defaultValue={DAY} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Head>Range · two months</Head>
          <HeldOpen mode="range" label={c.stay} defaultValue={{ from: new Date(2026, 5, 7), to: new Date(2026, 5, 18) }} numberOfMonths={2} className="w-72" />
        </div>
      </div>
    )
  },
}

/** A range in a narrow field: the value stays on one line and ends in an ellipsis. */
export const LongText: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[13rem] items-start gap-6 sm:grid-cols-[repeat(2,13rem)]">
        <DatePicker mode="range" label={c.stay} defaultValue={RANGE} calendarProps={calendarProps} />
        <DatePicker size="xs" mode="range" label={c.stay} description={c.stayHelp} defaultValue={RANGE} calendarProps={calendarProps} />
      </div>
    )
  },
}

/** Every LTR variant in the Figma set — Size × State × Inactive/Active — plus a range, for the direction on the toolbar. */
export const AllVariants: Story = {
  decorators: [framed],
  parameters: { layout: "padded", pseudo: { focusVisible: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max grid-cols-[max-content_repeat(3,15rem)] items-center gap-x-6 gap-y-3">
        <span />
        {STATES.map((state) => (
          <Head key={state}>{title(state)}</Head>
        ))}
        {SIZES.map((size) =>
          FILLS.map((fill) => (
            <React.Fragment key={`${size}-${fill}`}>
              <RowHead>
                {size} · {fill}
              </RowHead>
              {STATES.map((state) => (
                <div key={state} data-state-cell={state}>
                  <AnyDatePicker
                    {...fillProps(fill)}
                    size={size}
                    disabled={state === "disabled"}
                    aria-label={fill === "range" ? c.stay : c.date}
                    calendarProps={calendarProps}
                  />
                </div>
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    )
  },
}

const THEMES = ["light", "dark"] as const

/** Light and Dark, one panel each, whatever the Theme toolbar says. The open calendar renders into its panel to take its tokens. */
export const LightAndDark: Story = {
  decorators: [framed],
  parameters: { layout: "padded", pseudo: { focusVisible: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4">
        {THEMES.map((theme) => (
          <div key={theme} className={cn(theme, "rounded-lg border bg-background p-6 text-foreground")}>
            <Head className="block pb-4">{title(theme)}</Head>
            <div className="grid grid-cols-[15rem] items-start gap-x-6 gap-y-5 sm:grid-cols-[repeat(3,15rem)]">
              <div className="flex flex-col gap-1.5">
                <Head>Default</Head>
                <DatePicker label={c.date} description={c.dateHelp} calendarProps={calendarProps} />
              </div>
              <div data-state-cell="focus" className="flex flex-col gap-1.5">
                <Head>Focus · range</Head>
                <DatePicker mode="range" label={c.stay} description={c.stayHelp} defaultValue={RANGE} calendarProps={calendarProps} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Head>Disabled</Head>
                <DatePicker disabled label={c.date} description={c.dateHelp} defaultValue={DAY} calendarProps={calendarProps} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Head>Open</Head>
                <HeldOpen aria-label={c.date} defaultValue={DAY} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Both directions at once, whatever the toolbar says: each panel sets its own
 * `dir`, `lang` and font. In RTL the icon and the calendar move to the right,
 * the value reads "20 يناير 2026", and the calendar's week starts on Saturday.
 */
export const Directions: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-[17rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,18rem)]">
      {(["ltr", "rtl"] as const).map((direction) => {
        const c = COPY[direction]
        return (
          <div
            key={direction}
            dir={direction}
            lang={direction === "rtl" ? "ar" : "en"}
            className={cn("flex flex-col gap-1.5", direction === "rtl" && "font-arabic")}
          >
            <Head>{direction.toUpperCase()}</Head>
            <HeldOpen label={c.date} defaultValue={DAY} />
            <DatePicker mode="range" label={c.stay} defaultValue={RANGE} calendarProps={calendarProps} />
          </div>
        )
      })}
    </div>
  ),
}
