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
 * trigger is a plain `<button>` — `TooltipTrigger`'s default element.
 */
const meta: Meta<typeof TooltipContent> = {
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
    arrow: { control: "boolean" },
    description: { control: "text" },
    // Slots and Base UI's own escape hatches, not props a reader drives here.
    icon: { table: { disable: true } },
    collisionAvoidance: { table: { disable: true } },
    avatar: { table: { disable: true } },
    container: { table: { disable: true } },
    style: { table: { disable: true } },
    render: { table: { disable: true } },
  },
  args: { variant: "primary", radius: "standard", side: "top", align: "center", arrow: true },
}

export default meta
type Story = StoryObj<typeof TooltipContent>

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
 * A tooltip held open, for the static grids: the real component, so they
 * cannot drift from it. It holds its side instead of flipping at the window
 * edge, so a short window shows the same grid. `container` keeps it inside a
 * themed panel.
 */
const Open = ({
  label,
  container,
  ...content
}: Partial<TooltipContentProps> & { label: string; container?: HTMLElement | null }) => (
  <Tooltip open>
    <TooltipTrigger className={TRIGGER}>{label}</TooltipTrigger>
    <TooltipContent
      container={container ?? undefined}
      collisionAvoidance={{ side: "none", align: "none" }}
      {...content}
    />
  </Tooltip>
)

const positionProps = (position: (typeof POSITIONS)[number]) =>
  position === "none" ? { side: "top" as const, arrow: false } : { side: position, arrow: true }

/** Hover or focus the button. Every control in the Controls panel drives the tooltip. */
export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <Tooltip>
        <TooltipTrigger className={TRIGGER}>{c.trigger}</TooltipTrigger>
        <TooltipContent {...args}>{c.title}</TooltipContent>
      </Tooltip>
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
      <div className="grid w-max grid-cols-[8rem_repeat(5,14rem)] auto-rows-[7rem] items-center justify-items-center gap-x-10 p-10">
        <span />
        {POSITIONS.map((position) => (
          <Head key={position}>{position[0]!.toUpperCase() + position.slice(1)}</Head>
        ))}
        {VARIANTS.flatMap((variant) =>
          RADII.map((radius) => (
            <React.Fragment key={`${variant}-${radius}`}>
              <Head className="justify-self-start">
                {variant} · {radius}
              </Head>
              {POSITIONS.map((position) => (
                <Open
                  key={position}
                  label={c.trigger}
                  variant={variant}
                  radius={radius}
                  {...positionProps(position)}
                >
                  {c.title}
                </Open>
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
      <div className="grid w-max grid-cols-3 justify-items-center gap-x-44 gap-y-24 px-32 py-16">
        {SIDES.map((side) => (
          <div key={side} className="flex flex-col items-center gap-14">
            <Head>side = {side}</Head>
            <Open label={c.trigger} side={side}>
              {c.title}
            </Open>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Figma's optional slots, in every style: a description (70% of the text
 * colour, `muted-foreground` on Secondary), a 16px icon in the text colour,
 * and a round Avatar at size 12 in a 16px slot, so avatar and icon line up.
 * Both centre on the title's first line.
 */
export const Slots: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max grid-cols-[7rem_repeat(3,18rem)] items-end justify-items-center gap-y-20 p-10 pt-24">
        <span />
        <Head>description</Head>
        <Head>icon + description</Head>
        <Head>avatar + description</Head>
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <Head className="justify-self-start self-center">{variant}</Head>
            <Open label={c.trigger} variant={variant} description={c.description}>
              {c.title}
            </Open>
            <Open
              label={c.trigger}
              variant={variant}
              icon={<Info />}
              description={c.description}
            >
              {c.title}
            </Open>
            <Open
              label={c.trigger}
              variant={variant}
              avatar={{ src: PHOTO, name: "" }}
              description={c.edited}
            >
              {c.name}
            </Open>
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * The cap is on the text, as in Figma: title and description each wrap at
 * 296px. Without an icon the bubble tops out at 320px; with one, at 340. A
 * string with no spaces — a URL — breaks rather than overflowing.
 */
export const LongText: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex w-max flex-col items-center gap-40 px-48 pb-10 pt-40">
        {/* Each label sits on the side its tooltip leaves free. */}
        <div className="flex flex-col items-center gap-3">
          <Open label={c.trigger} description={c.longDescription}>
            {c.longTitle}
          </Open>
          <Head>320px — text only</Head>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Open label={c.trigger} description={c.longDescription} icon={<Info />}>
            {c.longTitle}
          </Open>
          <Head>340px — with an icon</Head>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Head>Rounded, bottom</Head>
          <Open label={c.trigger} variant="secondary" radius="rounded" side="bottom">
            {c.longTitle}
          </Open>
        </div>
        <div className="flex flex-col items-center gap-3 pt-16">
          <Open label={c.trigger} variant="info" description={LONG_URL}>
            {c.title}
          </Open>
          <Head>An unbroken URL</Head>
        </div>
      </div>
    )
  },
}

/**
 * Figma's Rounded radius is `border radius/2xl`, 16px, not a full pill: once
 * the text wraps, a 9999px radius would clip the avatar, icon and text
 * corners. One line still reads as a pill, at 28px (32 in Arabic). Both
 * directions side by side, whatever the toolbar says — each panel sets its
 * own `dir`, `lang` and font, and the tooltip takes them from its trigger.
 */
export const RoundedMultiline: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex w-max flex-wrap items-end justify-center gap-x-24 gap-y-16 px-10 pt-44">
      {(["ltr", "rtl"] as const).map((dir) => {
        const c = COPY[dir]
        return (
          <div
            key={dir}
            dir={dir}
            lang={dir === "rtl" ? "ar" : "en"}
            className={["flex w-[22rem] flex-col items-center gap-24", dir === "rtl" ? "font-arabic" : ""].join(" ")}
          >
            <div className="flex flex-col items-center gap-3">
              <Open
                label={c.trigger}
                radius="rounded"
                icon={<Info />}
                avatar={{ src: PHOTO, name: "" }}
                description={c.longDescription}
              >
                {c.longTitle}
              </Open>
              <Head>{dir === "rtl" ? "RTL" : "LTR"} · rounded · avatar + icon</Head>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Open label={c.trigger} radius="rounded">
                {c.title}
              </Open>
              <Head>{dir === "rtl" ? "RTL" : "LTR"} · rounded · one line</Head>
            </div>
          </div>
        )
      })}
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/** One themed panel, with its own portal container so its tooltips keep its tokens. */
const ThemePanel = ({ theme, c }: { theme: (typeof THEMES)[number]; c: Copy }) => {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  return (
    <div className={[theme, "rounded-lg border bg-background p-6 text-foreground"].join(" ")}>
      <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
      <div ref={setContainer} />
      <div className="grid grid-cols-[repeat(2,18rem)] justify-items-center gap-y-24 pb-4 pt-20">
        {container &&
          VARIANTS.map((variant) => (
            <Open
              key={variant}
              container={container}
              label={c.trigger}
              variant={variant}
              description={variant === "primary" || variant === "secondary" ? c.description : undefined}
            >
              {c.title}
            </Open>
          ))}
      </div>
    </div>
  )
}

/**
 * Light and Dark side by side, whatever the theme toolbar says, as Figma's
 * doc shows each style. Language and direction follow the Direction toolbar.
 */
export const LightAndDark: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max gap-4 xl:grid-cols-2">
        {THEMES.map((theme) => (
          <ThemePanel key={theme} theme={theme} c={c} />
        ))}
      </div>
    )
  },
}
