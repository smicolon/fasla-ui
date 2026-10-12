import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  type TooltipContentProps,
  type TooltipSide,
} from "../../../../packages/fasla-ui/registry/ui/tooltip"

/**
 * The look lives on `TooltipContent`, so the Controls panel drives it. The
 * trigger is a plain `<button>` — `TooltipTrigger`'s default element. `open`
 * is the story's own control, on `Tooltip`, so every change shows at once.
 */
type StoryArgs = TooltipContentProps & { open: boolean }

const meta: Meta<StoryArgs> = {
  title: "UI/Tooltip",
  component: TooltipContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "info", "success", "warning", "destructive"],
    },
    radius: { control: "inline-radio", options: ["standard", "rounded"] },
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right", "inline-start", "inline-end"],
    },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    // Empty unless set, so the component's own default applies: 8 with the
    // arrow, 4 without, 7 on the left or right of a Rounded tooltip.
    sideOffset: {
      control: { type: "number", min: 0, step: 1 },
      table: {
        defaultValue: { summary: "8", detail: "4 without an arrow, 7 on the left or right of a Rounded tooltip" },
      },
    },
    arrow: { control: "boolean" },
    description: { control: "text" },
    open: {
      control: "boolean",
      description: "Keeps the tooltip open. Turn it off to open it by hover or focus.",
      table: { category: "Tooltip" },
    },
    // Slots and Base UI's own escape hatches, not props a reader drives here.
    icon: { table: { disable: true } },
    alignOffset: { table: { disable: true } },
    collisionAvoidance: { table: { disable: true } },
    avatar: { table: { disable: true } },
    container: { table: { disable: true } },
    style: { table: { disable: true } },
    render: { table: { disable: true } },
  },
  args: { open: true, variant: "primary", radius: "standard", side: "top", align: "center", arrow: true },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script: sharing a file. Only the rendered text changes —
 * prop names stay English everywhere.
 */
const COPY = {
  ltr: {
    trigger: "Share",
    title: "Copy link",
    description: "Anyone with the link can view this file.",
    name: "Layla Haddad",
    edited: "Edited 5 minutes ago",
    longTitle:
      "Changes you make here apply to every member of this workspace, including people who join later.",
    longDescription:
      "Members can still override this setting for their own account from their profile page.",
  },
  rtl: {
    trigger: "مشاركة",
    title: "نسخ الرابط",
    description: "يستطيع أي شخص لديه الرابط عرض هذا الملف.",
    name: "ليلى حداد",
    edited: "عُدِّل قبل 5 دقائق",
    longTitle: "تنطبق التغييرات التي تجريها هنا على جميع أعضاء مساحة العمل، بمن فيهم من ينضمون لاحقًا.",
    longDescription: "يظل بإمكان الأعضاء تغيير هذا الإعداد لحساباتهم من صفحة الملف الشخصي.",
  },
} as const

/** An unbroken string longer than the 296px text cap: it breaks instead of overflowing. */
const LONG_URL = "https://fasla.smicolon.com/docs/components/tooltip#accessibility-and-keyboard-support"
const PHOTO = "/samples/avatar-portrait.png"

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const VARIANTS = ["primary", "secondary", "info", "success", "warning", "destructive"] as const
const RADII = ["standard", "rounded"] as const
/** Figma's Position axis. `none` is the arrowless variant, placed on top. */
const POSITIONS = ["top", "bottom", "left", "right", "none"] as const

/** The trigger: a plain button, styled only so it is visible on the canvas. */
const TRIGGER =
  "rounded-[var(--radius-md)] border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/**
 * How far a held tooltip reaches past its trigger on each side, in px, read
 * from where Base UI actually placed it. Readings taken before it is placed
 * (it starts at the page origin) are ignored; after that the numbers are
 * relative to the trigger, so making room for them cannot change them.
 */
function useHeldRoom() {
  const trigger = React.useRef<HTMLButtonElement>(null)
  const [popup, setPopup] = React.useState<HTMLDivElement | null>(null)
  const [room, setRoom] = React.useState({ top: 0, right: 0, bottom: 0, left: 0 })

  React.useLayoutEffect(() => {
    const t = trigger.current
    if (!t || !popup) return
    const measure = () => {
      const a = t.getBoundingClientRect()
      const b = popup.getBoundingClientRect()
      if (!b.width) return
      const gap = Math.max(b.top - a.bottom, a.top - b.bottom, b.left - a.right, a.left - b.right)
      if (gap > 24) return
      const next = {
        top: Math.max(0, Math.ceil(a.top - b.top)),
        right: Math.max(0, Math.ceil(b.right - a.right)),
        bottom: Math.max(0, Math.ceil(b.bottom - a.bottom)),
        left: Math.max(0, Math.ceil(a.left - b.left)),
      }
      setRoom((prev) =>
        prev.top === next.top && prev.right === next.right && prev.bottom === next.bottom && prev.left === next.left
          ? prev
          : next
      )
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(popup)
    resize.observe(t)
    const moves = new MutationObserver(measure)
    if (popup.parentElement) moves.observe(popup.parentElement, { attributes: true, attributeFilter: ["style"] })
    return () => {
      resize.disconnect()
      moves.disconnect()
    }
  }, [popup])

  // Making room moves the trigger, and Base UI does not always notice a move
  // caused by a parent's padding, which would leave the tooltip where it was.
  // A resize event makes it re-place every open tooltip against its trigger.
  React.useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")))
    return () => cancelAnimationFrame(frame)
  }, [room])

  return { trigger, popup: setPopup, room }
}

/**
 * Layout rule for every grid of held tooltips here: cells in a row share a
 * top edge, buttons and captions sit on shared lines, and no tooltip leaves
 * its cell.
 *
 * Each `Held` cell is four rows of its grid — room above, the trigger, room
 * below, the caption — shared through `subgrid`, so each row is as tall as
 * the tallest cell needs and every trigger and caption in a row lines up.
 * The room is measured, not guessed, so a two-line Arabic tooltip gets
 * exactly the space it takes. Put cells in a grid with `gap-y-0`; the caption
 * row carries the space between rows.
 */
const GRID = "grid items-stretch gap-y-0"
const ROW = "row-span-4 grid grid-rows-subgrid"

/**
 * A tooltip held open, for the static grids: the real component, so it
 * cannot drift from it. It renders into its own cell, so it scrolls and
 * clips with the story, and holds its side instead of flipping at the window
 * edge. A themed panel's tokens reach it because the cell is inside it.
 */
const Held = ({
  label,
  caption,
  cellProps,
  ...content
}: Partial<TooltipContentProps> & {
  label: string
  caption?: React.ReactNode
  cellProps?: React.HTMLAttributes<HTMLDivElement>
}) => {
  const [portal, setPortal] = React.useState<HTMLDivElement | null>(null)
  const { trigger, popup, room } = useHeldRoom()
  return (
    <div {...cellProps} className={["relative justify-items-center", ROW, cellProps?.className].join(" ")}>
      <div style={{ height: room.top }} />
      <div style={{ paddingLeft: room.left, paddingRight: room.right }}>
        <Tooltip open>
          <TooltipTrigger ref={trigger} className={TRIGGER}>
            {label}
          </TooltipTrigger>
          {portal && (
            <TooltipContent
              ref={popup}
              container={portal}
              collisionAvoidance={{ side: "none", align: "none" }}
              {...content}
            />
          )}
        </Tooltip>
      </div>
      <div style={{ height: room.bottom }} />
      <div className="pb-8 pt-3">{caption && <Head>{caption}</Head>}</div>
      {/* Out of the grid flow, so it takes no row. */}
      <div ref={setPortal} className="absolute left-0 top-0" />
    </div>
  )
}

/** A row label: four subgrid rows like a cell, the label on the given one. */
const RowLabel = ({ children, on }: { children: React.ReactNode; on: "tooltip" | "trigger" }) => (
  <div className={ROW}>
    <Head
      className={
        on === "tooltip"
          ? // The tooltip's first line: its top plus 6px of padding.
            "row-start-1 self-start pt-1.5"
          : "row-start-2 self-center"
      }
    >
      {children}
    </Head>
  </div>
)

const positionProps = (position: (typeof POSITIONS)[number]) =>
  position === "none" ? { side: "top" as const, arrow: false } : { side: position, arrow: true }

/**
 * Open from the start, so every control shows at once. Turn `open` off to
 * open it by hover or focus instead.
 */
export const Default: Story = {
  render: ({ open, ...args }, ctx) => {
    const c = copy(ctx)
    return (
      // Room on every side, so the tooltip stays inside the story's box
      // whichever side the controls put it on.
      <div className="p-12">
        {/* Remounted when `open` flips, so the tooltip moves cleanly between
            held open and opening on its own. */}
        <Tooltip key={String(open)} open={open ? true : undefined}>
          <TooltipTrigger className={TRIGGER}>{c.trigger}</TooltipTrigger>
          <TooltipContent {...args}>{c.title}</TooltipContent>
        </Tooltip>
      </div>
    )
  },
}

/**
 * Every variant in the Figma set, for the direction on the toolbar: Style ×
 * Radius down the side, Position across the top — 60 cells, one per LTR
 * variant. Flip the Direction toolbar for the 60 RTL ones. `None` has no
 * arrow. The axis names stay English in both directions; they are Figma
 * property identifiers, not sample copy.
 */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={`${GRID} w-max grid-cols-[auto_repeat(5,auto)] gap-x-6`}>
        <span />
        {POSITIONS.map((position) => (
          <Head key={position} className="justify-self-center pb-4">
            {position[0]!.toUpperCase() + position.slice(1)}
          </Head>
        ))}
        {VARIANTS.flatMap((variant) =>
          RADII.map((radius) => (
            <React.Fragment key={`${variant}-${radius}`}>
              <RowLabel on="trigger">
                {variant} · {radius}
              </RowLabel>
              {POSITIONS.map((position) => (
                <Held
                  key={position}
                  label={c.trigger}
                  variant={variant}
                  radius={radius}
                  {...positionProps(position)}
                >
                  {c.title}
                </Held>
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    )
  },
}

const SIDES: TooltipSide[] = ["top", "bottom", "left", "right", "inline-start", "inline-end"]

/**
 * `left` and `right` are physical: they stay put in RTL, as in Figma's RTL
 * variants. `inline-start` and `inline-end` follow the reading direction —
 * flip the Direction toolbar and they swap sides while the physical ones do
 * not. A tooltip with no room on its side flips to the other one.
 */
export const Sides: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={`${GRID} w-max grid-cols-3 gap-x-12`}>
        {SIDES.map((side) => (
          <Held key={side} label={c.trigger} side={side} caption={`side = ${side}`}>
            {c.title}
          </Held>
        ))}
      </div>
    )
  },
}

/**
 * Figma's optional slots, in every style: a description (70% of the text
 * colour, `muted-foreground` on Secondary), a 16px icon in the text colour,
 * and a round Avatar at size 12 in a 16px slot, so avatar and icon line up.
 * Both centre on the title's first line. Each row label sits on the title
 * line of the tooltips it names.
 */
export const Slots: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={`${GRID} w-max grid-cols-[auto_repeat(3,auto)] gap-x-6`}>
        <span />
        <Head className="justify-self-center pb-4">description</Head>
        <Head className="justify-self-center pb-4">icon + description</Head>
        <Head className="justify-self-center pb-4">avatar + description</Head>
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <RowLabel on="tooltip">{variant}</RowLabel>
            <Held label={c.trigger} variant={variant} description={c.description}>
              {c.title}
            </Held>
            <Held label={c.trigger} variant={variant} icon={<Info />} description={c.description}>
              {c.title}
            </Held>
            <Held label={c.trigger} variant={variant} avatar={{ src: PHOTO, name: "" }} description={c.edited}>
              {c.name}
            </Held>
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * The cap is on the text, as in Figma: title and description each wrap at
 * 296px. Without an icon the bubble tops out at 320px; with one, at 340. A
 * string with no spaces — a URL — breaks rather than overflowing. Every
 * tooltip opens on top, so each row's triggers and captions line up with no
 * empty room; Sides shows the other sides.
 */
export const LongText: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={`${GRID} w-max grid-cols-2 gap-x-12`}>
        <Held label={c.trigger} description={c.longDescription} caption="320px — text only">
          {c.longTitle}
        </Held>
        <Held label={c.trigger} description={c.longDescription} icon={<Info />} caption="340px — with an icon">
          {c.longTitle}
        </Held>
        <Held label={c.trigger} variant="secondary" radius="rounded" caption="Rounded">
          {c.longTitle}
        </Held>
        <Held label={c.trigger} variant="info" description={LONG_URL} caption="An unbroken URL">
          {c.title}
        </Held>
      </div>
    )
  },
}

const DIRECTIONS = ["ltr", "rtl"] as const
const directionProps = (dir: (typeof DIRECTIONS)[number]) => ({
  dir,
  lang: dir === "rtl" ? "ar" : "en",
  className: dir === "rtl" ? "font-arabic" : "",
})

/**
 * Figma's Rounded radius is `border radius/2xl`, 16px, not a full pill: once
 * the text wraps, a 9999px radius would clip the avatar, icon and text
 * corners. One line still reads as a pill, at 28px (32 in Arabic). Both
 * directions side by side, whatever the toolbar says — each cell sets its own
 * `dir`, `lang` and font, and the tooltip takes them from its trigger.
 */
export const RoundedMultiline: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className={`${GRID} w-max grid-cols-2 gap-x-12`}>
      {DIRECTIONS.map((dir) => (
        <Held
          key={`${dir}-long`}
          cellProps={directionProps(dir)}
          label={COPY[dir].trigger}
          radius="rounded"
          icon={<Info />}
          avatar={{ src: PHOTO, name: "" }}
          description={COPY[dir].longDescription}
          caption={`${dir.toUpperCase()} · rounded · avatar + icon`}
        >
          {COPY[dir].longTitle}
        </Held>
      ))}
      {DIRECTIONS.map((dir) => (
        <Held
          key={`${dir}-short`}
          cellProps={directionProps(dir)}
          label={COPY[dir].trigger}
          radius="rounded"
          caption={`${dir.toUpperCase()} · rounded · one line`}
        >
          {COPY[dir].title}
        </Held>
      ))}
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/** One themed panel. Its cells, and so its tooltips, sit inside the theme class. */
const ThemePanel = ({ theme, c }: { theme: (typeof THEMES)[number]; c: Copy }) => (
  <div className={[theme, "rounded-lg border bg-background p-6 text-foreground"].join(" ")}>
    <Head className="block pb-4">{theme === "dark" ? "Dark" : "Light"}</Head>
    <div className={`${GRID} grid-cols-3 gap-x-6`}>
      {VARIANTS.map((variant) => (
        <Held
          key={variant}
          label={c.trigger}
          variant={variant}
          description={variant === "primary" || variant === "secondary" ? c.description : undefined}
        >
          {c.title}
        </Held>
      ))}
    </div>
  </div>
)

/**
 * Light and Dark, one panel each, whatever the theme toolbar says, as Figma's
 * doc shows each style. Language and direction follow the Direction toolbar.
 * The panels stack so both fit the Docs page.
 */
export const LightAndDark: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max gap-4">
        {THEMES.map((theme) => (
          <ThemePanel key={theme} theme={theme} c={c} />
        ))}
      </div>
    )
  },
}
