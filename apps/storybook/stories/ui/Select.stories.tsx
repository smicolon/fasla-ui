import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { MapPinIcon, StoreIcon, TruckIcon, UserIcon } from "lucide-react"
import {
  Select,
  SelectItem,
  type SelectDisplay,
  type SelectProps,
} from "../../../../packages/fasla-ui/registry/ui/select"
import { Input } from "../../../../packages/fasla-ui/registry/ui/input"

/**
 * Figma: "Select Input" (3884:6936), "Select Item" (46162:1970) and "Select
 * Menu" (46162:242459). Size, Radius, State and Multi Select are props here;
 * Filled is the difference between the placeholder and a value; Direction is
 * the toolbar. Every story follows the Direction and Theme toolbars, except
 * Light and Dark and LTR and RTL, which show both at once.
 */
/**
 * The story args: `SelectProps` is a union (single or multiple, each with its
 * own value type), which Storybook's `Meta` cannot take, so the Controls see
 * one flat shape.
 */
type StoryArgs = Omit<SelectProps, "multiple" | "display" | "value" | "defaultValue" | "onValueChange"> & {
  multiple?: boolean
  display?: SelectDisplay
  value?: string | string[] | null
  defaultValue?: string | readonly string[] | null
  onValueChange?: (value: string | string[] | null) => void
}

/**
 * Select, typed with the flat args, for the matrices that switch between
 * single and multiple per cell. Each cell's props still form a valid single or
 * multiple select.
 */
const AnySelect = Select as unknown as React.ForwardRefExoticComponent<StoryArgs>

const meta: Meta<StoryArgs> = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["standard", "rounded"] },
    multiple: { control: "boolean" },
    display: { control: "inline-radio", options: ["badges", "text"], if: { arg: "multiple" } },
    disabled: { control: "boolean" },
    label: { control: "text" },
    labelEnd: { control: "text" },
    description: { control: "text" },
    descriptionEnd: { control: "text" },
    placeholder: { control: "text" },
    // Slots, data and Base UI's own escape hatches, not props a reader drives here.
    startIcon: { table: { disable: true } },
    items: { table: { disable: true } },
    children: { table: { disable: true } },
    container: { table: { disable: true } },
    collisionAvoidance: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    // Behaviour, not looks: these change nothing in the preview. They are on
    // the docs page's Props table.
    readOnly: { table: { disable: true } },
    required: { table: { disable: true } },
    name: { table: { disable: true } },
    form: { table: { disable: true } },
    id: { table: { disable: true } },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    modal: { table: { disable: true } },
    "aria-label": { table: { disable: true } },
    "aria-labelledby": { table: { disable: true } },
  },
  args: { size: "md", radius: "standard", multiple: false, display: "badges", disabled: false },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script: choosing where an order is delivered. Only the
 * rendered text changes — prop names stay English everywhere. The Arabic is
 * written from design/content/, not translated.
 */
const COPY = {
  ltr: {
    cities: ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah", "Khobar", "Abha", "Tabuk"],
    city: "City",
    cityPlaceholder: "Select a city",
    cityHelp: "Where we deliver your order.",
    optional: "Optional",
    delivery: "Delivery cities",
    deliveryPlaceholder: "Select cities",
    deliveryHelp: "Choose every city you ship to.",
    chosen: (n: number) => `${n} of 8`,
    branch: "Pickup branch",
    branchPlaceholder: "Select a branch",
    name: "Full name",
    namePlaceholder: "Layla Haddad",
    nameValue: "Nadia Rahman",
    nameHelp: "As it appears on your ID.",
    longLabel: "Pickup point",
    longOptions: [
      "King Khalid International Airport, Terminal 5, arrivals hall pickup counter",
      "Al Olaya District, King Fahd Road, Building 14, ground floor",
      "Riyadh Park Mall, north entrance",
    ],
    longHelp: "Long options wrap in the menu; the trigger ends in an ellipsis.",
  },
  rtl: {
    cities: ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "الخبر", "أبها", "تبوك"],
    city: "المدينة",
    cityPlaceholder: "اختر مدينة",
    cityHelp: "حيث نوصل طلبك.",
    optional: "اختياري",
    delivery: "مدن التوصيل",
    deliveryPlaceholder: "اختر المدن",
    deliveryHelp: "اختر كل مدينة تشحن إليها.",
    chosen: (n: number) => `${n} من 8`,
    branch: "فرع الاستلام",
    branchPlaceholder: "اختر فرعًا",
    name: "الاسم الكامل",
    namePlaceholder: "ليلى حداد",
    nameValue: "نادية رحمن",
    nameHelp: "كما يظهر في بطاقة الهوية.",
    longLabel: "نقطة الاستلام",
    longOptions: [
      "مطار الملك خالد الدولي، الصالة 5، كاونتر الاستلام في صالة القدوم",
      "حي العليا، طريق الملك فهد، مبنى 14، الطابق الأرضي",
      "الرياض بارك، المدخل الشمالي",
    ],
    longHelp: "تلتف الخيارات الطويلة داخل القائمة، وتنتهي القيمة في الحقل بنقاط.",
  },
}

type Copy = (typeof COPY)["ltr"]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

/** The cities as options. Values are Latin identifiers in both scripts; labels are the script's. */
const cityItems = (c: Copy) => c.cities.map((label, i) => ({ value: COPY.ltr.cities[i]!.toLowerCase(), label }))
const [RIYADH, JEDDAH, DAMMAM] = ["riyadh", "jeddah", "dammam"] as const

const SIZES = ["xs", "sm", "md", "lg"] as const
const RADII = ["standard", "rounded"] as const
const STATES = ["default", "focus", "disabled"] as const
type State = (typeof STATES)[number]
/**
 * Figma's Filled and Multi Select axes, as one column each: the placeholder,
 * one value, and two values as badges. Text mode is in Multi Select.
 */
const FILLS = ["placeholder", "value", "badges"] as const
type Fill = (typeof FILLS)[number]

/** The props that put a field in one Filled / Multi Select combination. */
const fillProps = (fill: Fill): Partial<StoryArgs> =>
  fill === "placeholder"
    ? {}
    : fill === "value"
      ? { defaultValue: RIYADH }
      : { multiple: true, defaultValue: [RIYADH, JEDDAH] }

const title = (s: string) => s[0]!.toUpperCase() + s.slice(1)

/**
 * A column header or a caption over a field: Figma property names, so
 * English and left-to-right in both directions. It never wraps.
 */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/**
 * A side row label. Left-aligned in its column in both directions: the
 * caption is an English property name. Its space from the first field is the
 * grid's column gap, the same as between two fields.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/** The trigger's height at each size, for the strip a side label centres in. */
const BOX_HEIGHT = { xs: "h-7", sm: "h-8", md: "h-9", lg: "h-10" } as const

/**
 * A side row label centred on a field's box, not on its label or helper
 * text: a zero-width strut as tall as the label row over a strip as tall as
 * the box (`md` unless `size` says otherwise), as on Input.
 */
const BoxLineHead = ({ children, size = "md" }: { children: React.ReactNode; size?: keyof typeof BOX_HEIGHT }) => (
  <span dir="ltr" className="flex flex-col whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    <span aria-hidden className="p-1 text-sm">
      {"​"}
    </span>
    <span className={["flex items-center", BOX_HEIGHT[size]].join(" ")}>{children}</span>
  </span>
)

/**
 * The frame round every story but Default. It centres the content in either
 * direction, and scrolls it sideways in the story's own direction when it is
 * wider than the canvas (a phone). 4px of padding keeps a focus halo at the
 * edge clear of the clip.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/** Cells forced into Focus: the pseudo-states addon applies the real `:focus-visible` to their triggers. */
const FOCUS_CELLS = ["[data-state-cell=focus] [data-slot=select-trigger]"]

/**
 * A select held open, with exactly the room its menu takes reserved under it.
 * The menu is portalled into this cell, so it scrolls and clips with the
 * story and takes a themed panel's tokens.
 *
 * The room is the list's own height plus the menu's 4px padding and 1px
 * border a side and its 4px gap — never the menu's rendered height. The menu
 * is capped at the room Base UI sees below the trigger, and the story frame
 * clips, so measuring the menu would read back its own cap and never grow.
 * Nor is it worked out from positions. It changes only when it is more than a
 * pixel off. The menu never flips above the trigger, and the page stays live
 * (`modal={false}`), so several can be open at once.
 */
function HeldOpen(props: SelectProps) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [room, setRoom] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!cell) return
    let observed: Element | null = null
    const resize = new ResizeObserver(([entry]) => {
      const next = Math.ceil(entry!.borderBoxSize[0]!.blockSize) + 4 * 2 + 1 * 2 + 4
      setRoom((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    })
    const find = () => {
      const list = cell.querySelector("[data-slot=select-list]")
      if (list && list !== observed) {
        if (observed) resize.unobserve(observed)
        observed = list
        resize.observe(list)
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

  // The trigger has not moved, but Base UI misses a change caused by a
  // parent's padding; a resize makes it measure and place the menu again.
  React.useEffect(() => {
    window.dispatchEvent(new Event("resize"))
  }, [room])

  return (
    <div ref={setCell} className="relative" style={{ paddingBottom: room }}>
      {cell && <Select open modal={false} collisionAvoidance={{ side: "none" }} container={cell} {...props} />}
    </div>
  )
}

/** The playground: every prop on the Controls panel. */
export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    const props: StoryArgs = {
      ...args,
      // The story's width first, so the Controls' classes win.
      className: ["w-72", args.className].filter(Boolean).join(" "),
      label: args.label ?? (args.multiple ? c.delivery : c.city),
      placeholder: args.placeholder ?? (args.multiple ? c.deliveryPlaceholder : c.cityPlaceholder),
      description: args.description ?? (args.multiple ? c.deliveryHelp : c.cityHelp),
      items: cityItems(c),
    }
    // A new key per mode: switching `multiple` swaps the value's shape.
    return <AnySelect key={String(args.multiple)} {...props} />
  },
}

/**
 * Figma's four sizes — 28, 32, 36 and 40px — with the placeholder, one value,
 * and two values as badges. As on Input, only the height and the icon↔text
 * gap change: the padding is 12px and the icons 16px at every size, and the
 * text is 14px (16px below 768px, so iOS does not zoom). The badges are Badge
 * sm at every size.
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
              <AnySelect
                key={fill}
                {...fillProps(fill)}
                size={size}
                aria-label={fill === "badges" ? c.delivery : c.city}
                startIcon={<MapPinIcon />}
                placeholder={c.cityPlaceholder}
                items={cityItems(c)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/** Standard is Figma's `border radius/md` (8px); Rounded is a full pill. */
export const Radius: Story = {
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
        {RADII.map((radius) => (
          <React.Fragment key={radius}>
            <RowHead>{title(radius)}</RowHead>
            {FILLS.map((fill) => (
              <AnySelect
                key={fill}
                {...fillProps(fill)}
                radius={radius}
                aria-label={c.city}
                placeholder={c.cityPlaceholder}
                items={cityItems(c)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's three States, with the label and helper labels on. Focus is the
 * real `:focus-visible`, forced by the pseudo-states addon; the trigger also
 * shows it while its menu is open. Disabled dims the whole field, and its
 * badges lose their remove.
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
        {STATES.map((state: State) => (
          <React.Fragment key={state}>
            <BoxLineHead>{title(state)}</BoxLineHead>
            {FILLS.map((fill) => (
              <div key={fill} data-state-cell={state}>
                <AnySelect
                  {...fillProps(fill)}
                  disabled={state === "disabled"}
                  label={fill === "badges" ? c.delivery : c.city}
                  labelEnd={c.optional}
                  description={c.cityHelp}
                  placeholder={c.cityPlaceholder}
                  items={cityItems(c)}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Multiple select (`multiple`). Badges by default; `display="text"` shows
 * one line of labels that ends in an ellipsis. Badges wrap onto more rows,
 * and the trigger grows to hold them. A badge's × removes that value; from the
 * keyboard, unchoose it in the menu. The menu stays open while you choose.
 */
export const MultiSelect: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const few = [RIYADH, JEDDAH]
    const many = cityItems(c).map((item) => item.value).slice(0, 6)
    const cells: [string, SelectProps][] = [
      ["Badges", { defaultValue: few }],
      ["Text", { defaultValue: few, display: "text" }],
      ["Badges, wrapping", { defaultValue: many }],
      ["Text, overflowing", { defaultValue: many, display: "text" }],
    ].map(([caption, props]) => [
      caption as string,
      { multiple: true, ...(props as object) } as SelectProps,
    ])
    return (
      <div className="grid grid-cols-[17rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,20rem)]">
        {cells.map(([caption, props]) => (
          <div key={caption} className="flex flex-col gap-1.5">
            <Head>{caption}</Head>
            <Select
              {...props}
              label={c.delivery}
              description={c.deliveryHelp}
              descriptionEnd={c.chosen((props.defaultValue as string[]).length)}
              placeholder={c.deliveryPlaceholder}
              startIcon={<TruckIcon />}
              items={cityItems(c)}
            />
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Each optional part on its own, then all together. Flip the Direction
 * toolbar: everything at a start or an end swaps sides.
 */
export const Parts: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const items = cityItems(c)
    const cells: [string, React.ReactNode][] = [
      ["label", <Select label={c.city} placeholder={c.cityPlaceholder} items={items} />],
      ["label + labelEnd", <Select label={c.city} labelEnd={c.optional} placeholder={c.cityPlaceholder} items={items} />],
      ["description", <Select label={c.city} description={c.cityHelp} placeholder={c.cityPlaceholder} items={items} />],
      [
        "description + descriptionEnd",
        <Select
          multiple
          label={c.delivery}
          description={c.deliveryHelp}
          descriptionEnd={c.chosen(2)}
          defaultValue={[RIYADH, JEDDAH]}
          items={items}
        />,
      ],
      ["startIcon", <Select aria-label={c.branch} startIcon={<StoreIcon />} placeholder={c.branchPlaceholder} items={items} />],
      [
        "Every part",
        <Select
          label={c.city}
          labelEnd={c.optional}
          description={c.cityHelp}
          descriptionEnd="1/8"
          startIcon={<MapPinIcon />}
          defaultValue={RIYADH}
          items={items}
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
 * A Select beside an Input of the same size, at every size, with every part
 * on: the label rows, the boxes, the icons, the text and the helper rows line
 * up exactly. Both have the same height, 12px padding, 16px icons, the same
 * gap, border, fill and shadow, and `foreground` text at the same size: 14px,
 * or 16px below 768px. Flip the Direction and Theme toolbars to check RTL and
 * Dark, and narrow the window to check a phone.
 */
export const BesideInput: Story = {
  name: "Beside an Input",
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(2,18rem)] items-start gap-x-6 gap-y-5">
        <span />
        <Head>Input</Head>
        <Head>Select</Head>
        {SIZES.map((size) => (
          <React.Fragment key={size}>
            <BoxLineHead size={size}>{size}</BoxLineHead>
            <Input
              size={size}
              label={c.name}
              labelEnd={c.optional}
              description={c.nameHelp}
              descriptionEnd="12/40"
              startIcon={<UserIcon />}
              defaultValue={c.nameValue}
            />
            <Select
              size={size}
              label={c.city}
              labelEnd={c.optional}
              description={c.cityHelp}
              descriptionEnd="1/8"
              startIcon={<MapPinIcon />}
              defaultValue={RIYADH}
              items={cityItems(c)}
            />
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's open preview: the menu 4px under the trigger, as wide as it, the
 * trigger in Focus. A single select checks one item; a multiple select checks
 * each chosen one. Point at an item, or use the arrow keys, to highlight it.
 */
export const Open: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const items = cityItems(c).slice(0, 4)
    return (
      <div className="grid grid-cols-[17rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,18rem)]">
        <div className="flex flex-col gap-1.5">
          <Head>Single</Head>
          <HeldOpen aria-label={c.city} defaultValue={RIYADH} items={items} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Head>Multiple</Head>
          <HeldOpen multiple aria-label={c.delivery} defaultValue={[RIYADH, DAMMAM]} items={items} />
        </div>
      </div>
    )
  },
}

/**
 * Figma's Select Item states, in a held-open menu. Selected is the check at
 * the end of the row; its slot is always there, so no text moves. Highlighted
 * is drawn here on Jeddah with the same classes Base UI's `data-highlighted`
 * turns on, so it shows without a pointer. Disabled is half opacity and
 * cannot be chosen.
 */
export const ItemStates: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [riyadh, jeddah, dammam, makkah] = cityItems(c)
    return (
      <div className="w-72">
        <HeldOpen aria-label={c.city} defaultValue={RIYADH}>
          <SelectItem value={riyadh!.value}>{riyadh!.label}</SelectItem>
          <SelectItem value={jeddah!.value} className="bg-accent text-accent-foreground">
            {jeddah!.label}
          </SelectItem>
          <SelectItem value={dammam!.value}>{dammam!.label}</SelectItem>
          <SelectItem value={makkah!.value} disabled>
            {makkah!.label}
          </SelectItem>
        </HeldOpen>
      </div>
    )
  },
}

/**
 * Long copy. An option longer than the menu wraps onto more lines inside it;
 * the chosen value ends in an ellipsis in the trigger. The menu is always the
 * trigger's width, and covers the helper row while it is open.
 */
export const LongText: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const items = c.longOptions.map((label, i) => ({ value: `point-${i}`, label }))
    return (
      <div className="grid grid-cols-[17rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,18rem)]">
        <HeldOpen label={c.longLabel} defaultValue="point-0" items={items} />
        <Select
          label={c.longLabel}
          description={c.longHelp}
          startIcon={<MapPinIcon />}
          defaultValue="point-0"
          items={items}
        />
      </div>
    )
  },
}

/**
 * Every LTR variant in the Figma set — Size × Filled × State, single and
 * multiple, once per Radius — for the direction on the toolbar. Flip the
 * Direction toolbar for RTL. Figma's empty multiple select looks the same as
 * the empty single one, so it is the placeholder row.
 */
export const AllVariants: Story = {
  decorators: [framed],
  parameters: { layout: "padded", pseudo: { focusVisible: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-8">
        {RADII.map((radius) => (
          <div key={radius} className="space-y-3">
            <h3 dir="ltr" className="font-sans text-sm font-medium text-foreground">
              Radius = {title(radius)}
            </h3>
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
                        <AnySelect
                          {...fillProps(fill)}
                          size={size}
                          radius={radius}
                          disabled={state === "disabled"}
                          aria-label={fill === "badges" ? c.delivery : c.city}
                          placeholder={c.cityPlaceholder}
                          items={cityItems(c)}
                        />
                      </div>
                    ))}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark, one panel each, whatever the theme toolbar says. Each panel
 * sets its own theme: the `light` or `dark` class re-points every token for
 * that subtree, and the open menu is portalled into the panel to take them.
 */
export const LightAndDark: Story = {
  decorators: [framed],
  parameters: { layout: "padded", pseudo: { focusVisible: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const items = cityItems(c)
    return (
      <div className="grid gap-4">
        {THEMES.map((theme) => (
          <div key={theme} className={[theme, "rounded-lg border bg-background p-6 text-foreground"].join(" ")}>
            <Head className="block pb-4">{title(theme)}</Head>
            <div className="grid grid-cols-[14rem] items-start gap-x-6 gap-y-5 sm:grid-cols-[repeat(3,15rem)]">
              <div className="flex flex-col gap-1.5">
                <Head>Default</Head>
                <Select label={c.city} description={c.cityHelp} startIcon={<MapPinIcon />} placeholder={c.cityPlaceholder} items={items} />
              </div>
              <div data-state-cell="focus" className="flex flex-col gap-1.5">
                <Head>Focus · badges</Head>
                <Select
                  multiple
                  label={c.delivery}
                  description={c.deliveryHelp}
                  defaultValue={[RIYADH, JEDDAH]}
                  items={items}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Head>Disabled</Head>
                <Select disabled label={c.city} description={c.cityHelp} defaultValue={RIYADH} items={items} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Head>Open</Head>
                <HeldOpen aria-label={c.city} defaultValue={RIYADH} items={items.slice(0, 4)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Head>Open · multiple</Head>
                <HeldOpen multiple aria-label={c.delivery} defaultValue={[RIYADH, DAMMAM]} items={items.slice(0, 4)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Head>Rounded · text</Head>
                <Select
                  multiple
                  display="text"
                  radius="rounded"
                  aria-label={c.delivery}
                  defaultValue={[RIYADH, JEDDAH]}
                  items={items}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Figma's open preview in both directions at once, whatever the toolbar says:
 * each panel sets its own `dir`, `lang` and font. In RTL the chevron and the
 * check move to the left, the text to the right, and the menu lines up with
 * the trigger's right edge.
 */
export const LtrAndRtl: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  argTypes: { className: { control: "text" } },
  render: ({ className }) => (
    <div className="grid grid-cols-[17rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,18rem)]">
      {(["ltr", "rtl"] as const).map((direction) => {
        const c = COPY[direction]
        return (
          <div
            key={direction}
            dir={direction}
            lang={direction === "rtl" ? "ar" : "en"}
            className={["flex flex-col gap-1.5", direction === "rtl" ? "font-arabic" : ""].join(" ")}
          >
            <Head>{direction.toUpperCase()}</Head>
            <HeldOpen
              label={c.city}
              startIcon={<MapPinIcon />}
              defaultValue={RIYADH}
              items={cityItems(c).slice(0, 4)}
              className={className}
            />
            <Select
              multiple
              label={c.delivery}
              defaultValue={[RIYADH, JEDDAH, DAMMAM]}
              items={cityItems(c)}
              className={className}
            />
          </div>
        )
      })}
    </div>
  ),
}
