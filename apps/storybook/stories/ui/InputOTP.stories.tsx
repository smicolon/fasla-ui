import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  type InputOTPProps,
} from "../../../../packages/fasla-ui/registry/ui/input-otp"

/**
 * Figma: OTP Input (40465:54984) and its slot, Otp Input Item (15097:22526).
 * Figma's `Type` axis is a way of composing the parts, not a prop, mirrored
 * here so the set can be walked through: Simple, Digits only, With
 * Separator and With Spacing, with Figma's own names. The slot's states are
 * real states: Active is focus, Destructive is `aria-invalid`, Disabled is
 * `disabled`. Direction is the toolbar. Every story follows the Direction
 * and Theme toolbars, except Light And Dark and LTR And RTL, which show both
 * at once.
 */

/** Figma's `Type` values, in its order and with its names. */
const TYPES = ["Simple", "Digits only", "With Separator", "With Spacing"] as const
type OtpType = (typeof TYPES)[number]
const THEMES = ["light", "dark"] as const

/**
 * The Default story's controls. `type` and `value` are story-only: the type
 * is how the parts are composed, and the value is the field's starting
 * code. `invalid` is `aria-invalid` on `InputOTP`.
 */
type StoryArgs = {
  type: OtpType
  value: string
  invalid: boolean
  disabled: boolean
  containerClassName?: string
  className?: string
}

/**
 * Props docgen finds on `InputOTP` that only change behaviour, removed from
 * the table below. Some are input-otp's own.
 */
type Hidden = Pick<
  React.ComponentProps<typeof InputOTP>,
  | "maxLength"
  | "defaultValue"
  | "onChange"
  | "onComplete"
  | "pattern"
  | "pasteTransformer"
  | "pushPasswordManagerStrategy"
  | "textAlign"
  | "noScriptCSSFallback"
  | "nonce"
  | "render"
>

const meta: Meta<StoryArgs & Hidden> = {
  title: "UI/OTP Input",
  component: InputOTP as unknown as React.ComponentType<StoryArgs & Hidden>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: TYPES,
      description:
        "Story only: Figma `Type`. Simple is two `InputOTPGroup`s of three slots with an `InputOTPSeparator` between; Digits only is one group of six; With Separator is three groups of two; With Spacing is six groups of one.",
      table: { defaultValue: { summary: '"Simple"' } },
    },
    value: {
      control: "text",
      description: "Story only: the code the field starts with (`defaultValue`). Up to six digits.",
    },
    invalid: {
      control: "boolean",
      description: "`aria-invalid` on `InputOTP`: every slot's border turns `destructive`.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the field and dims it to 50%.",
    },
    containerClassName: {
      control: "text",
      description: "Extra classes for the row that holds the groups and separators.",
      table: { type: { summary: "string" } },
    },
    className: {
      control: "text",
      description: "Extra classes for the hidden `<input>` that lies over the slots.",
      table: { type: { summary: "string" } },
    },
    // Behaviour, not looks: these change nothing in the preview. The ones a
    // reader needs are on the docs page's Props table; the rest are
    // input-otp's own escape hatches.
    maxLength: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onComplete: { table: { disable: true } },
    pattern: { table: { disable: true } },
    pasteTransformer: { table: { disable: true } },
    pushPasswordManagerStrategy: { table: { disable: true } },
    textAlign: { table: { disable: true } },
    noScriptCSSFallback: { table: { disable: true } },
    nonce: { table: { disable: true } },
    render: { table: { disable: true } },
  },
  args: { type: "Simple", value: "", invalid: false, disabled: false },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script: the field's accessible name, and a code that
 * fills four of the six slots. Digits stay Western in Arabic.
 */
const COPY = {
  ltr: { label: "Verification code" },
  rtl: { label: "رمز التحقق" },
}

type Copy = (typeof COPY)["ltr"]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

/** The slots of one group, from `from`, `count` of them. */
const slots = (from: number, count: number) =>
  Array.from({ length: count }, (_, i) => <InputOTPSlot key={from + i} index={from + i} />)

/** The parts of each Figma Type, composed as a developer would. */
function Parts({ type }: { type: OtpType }) {
  switch (type) {
    case "Simple":
      return (
        <>
          <InputOTPGroup>{slots(0, 3)}</InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>{slots(3, 3)}</InputOTPGroup>
        </>
      )
    case "Digits only":
      return <InputOTPGroup>{slots(0, 6)}</InputOTPGroup>
    case "With Separator":
      return (
        <>
          <InputOTPGroup>{slots(0, 2)}</InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>{slots(2, 2)}</InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>{slots(4, 2)}</InputOTPGroup>
        </>
      )
    case "With Spacing":
      return (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <InputOTPGroup key={i}>{slots(i, 1)}</InputOTPGroup>
          ))}
        </>
      )
  }
}

/**
 * One six-digit field in any Figma Type. Simple sets Figma's 6px gap; the
 * other types keep the component's 8px.
 */
function Code({
  type = "Simple",
  containerClassName,
  ...props
}: { type?: OtpType } & Omit<InputOTPProps, "maxLength" | "children" | "render">) {
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      containerClassName={[type === "Simple" ? "gap-1.5" : "", containerClassName ?? ""].join(" ")}
      {...props}
    >
      <Parts type={type} />
    </InputOTP>
  )
}

/**
 * A column header or panel title: a Figma property value, so English and
 * left-to-right in both directions. It never wraps.
 */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/**
 * A side row label: left-aligned in both directions, never wrapped, centred
 * on its 36px field, and a full column gap from it.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/**
 * The frame round every story but Default. It centres the content in either
 * direction, and scrolls it sideways in the story's own direction when it is
 * wider than the canvas (a phone). 4px of padding keeps the 3px Active ring
 * at the edge clear of the clip.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/**
 * Cells held in Active. A slot is Active while the field has focus and it
 * is the slot the next character goes into; only one field on a page can
 * have focus. So this sets the slot's own `data-active` attribute on the
 * slot named by the cell's `data-hold-active` index, and the slot draws the
 * component's own ring. Click into any field to see the real thing.
 */
function HoldActive({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>("[data-hold-active]").forEach((cell) => {
      const index = Number(cell.dataset.holdActive)
      cell.querySelectorAll("[data-slot=input-otp-slot]")[index]?.setAttribute("data-active", "")
    })
  })
  return <div ref={ref}>{children}</div>
}

const heldActive: Decorator = (Story) => (
  <HoldActive>
    <Story />
  </HoldActive>
)

/**
 * The playground: every row on the Controls panel changes it. Click into it
 * and type, paste a code, or move between the slots with the arrow keys. A
 * new key per value restarts the field when the value control changes.
 */
export const Default: Story = {
  render: ({ type, value, invalid, disabled, containerClassName, className }, ctx) => (
    <Code
      key={value}
      type={type}
      defaultValue={value.slice(0, 6)}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      aria-label={copy(ctx).label}
      containerClassName={containerClassName}
      className={className}
    />
  ),
}

/**
 * Figma's four Types, with its names. Simple and With Separator split the
 * code with a 24px separator; Digits only joins all six slots; With Spacing
 * gives every slot its own border and corners. Only the ends of a group are
 * rounded.
 */
export const Types: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_max-content] items-center gap-x-6 gap-y-6">
        {TYPES.map((type) => (
          <React.Fragment key={type}>
            <RowHead>{type}</RowHead>
            <Code type={type} aria-label={c.label} />
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/** Figma's Otp Input Item states, as rows. */
const STATES = [
  { name: "Default", invalid: false, active: false, disabled: false },
  { name: "Active", invalid: false, active: true, disabled: false },
  { name: "Destructive Default", invalid: true, active: false, disabled: false },
  { name: "Destructive Active", invalid: true, active: true, disabled: false },
  { name: "Disabled", invalid: false, active: false, disabled: true },
] as const

/**
 * Figma's slot states, empty and filled. Active is the slot the next
 * character goes into, while the field has focus: the first slot of an
 * empty code, the last of a full one. It draws a 3px `ring` outside the
 * slot's border. Destructive (`aria-invalid`) turns the borders
 * `destructive` and the ring `destructive` at 20%. Disabled dims the whole
 * field to 50%. The Active rows are held; click into any field to see it
 * live.
 */
export const States: Story = {
  decorators: [heldActive, framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_repeat(2,max-content)] items-center gap-x-6 gap-y-6">
        <span />
        <Head>Empty</Head>
        <Head>Filled</Head>
        {STATES.map((state) => (
          <React.Fragment key={state.name}>
            <RowHead>{state.name}</RowHead>
            {(["", "123456"] as const).map((value, i) => (
              <div key={value} data-hold-active={state.active ? (i === 0 ? 0 : 5) : undefined}>
                <Code
                  defaultValue={value}
                  aria-invalid={state.invalid || undefined}
                  disabled={state.disabled}
                  aria-label={c.label}
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
 * Light and Dark, one panel each, whatever the theme toolbar says: every
 * Type with its first slot Active, as Figma's doc shows them. Each panel's
 * `light` or `dark` class re-points every token for its subtree. Language
 * and direction follow the toolbar.
 */
export const LightAndDark: Story = {
  decorators: [heldActive, framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[
              theme,
              "grid grid-cols-[max-content_max-content] items-center gap-x-6 gap-y-6 rounded-lg border bg-background p-6 text-foreground",
            ].join(" ")}
          >
            <Head className="col-span-2">{theme === "dark" ? "Dark" : "Light"}</Head>
            {TYPES.map((type) => (
              <React.Fragment key={type}>
                <RowHead>{type}</RowHead>
                <div data-hold-active={0}>
                  <Code type={type} aria-label={c.label} />
                </div>
              </React.Fragment>
            ))}
            <RowHead>Destructive</RowHead>
            <div data-hold-active={4}>
              <Code defaultValue="1234" aria-invalid aria-label={c.label} />
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Both directions at once, whatever the toolbar says: each panel sets its
 * own `dir`, `lang` and font. Each field holds the same four digits. In
 * Arabic the first slot is on the right, so the code fills from the right,
 * the group ends round on the opposite sides, and the left arrow moves to
 * the next slot. The digits stay Western.
 */
export const LtrAndRtl: Story = {
  decorators: [heldActive, framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    // Each panel is a subgrid of the same rows, so the two sides share every
    // row's top edge.
    <div className="grid gap-4 md:grid-cols-2">
      {(["ltr", "rtl"] as const).map((direction) => (
        <div
          key={direction}
          dir={direction}
          lang={direction === "rtl" ? "ar" : "en"}
          className={[
            "row-span-5 grid grid-cols-[max-content_max-content] grid-rows-subgrid items-center gap-x-6 gap-y-6 rounded-lg border p-6",
            direction === "rtl" ? "font-arabic" : "font-sans",
          ].join(" ")}
        >
          <Head className="col-span-2">{direction.toUpperCase()}</Head>
          {TYPES.map((type) => (
            <React.Fragment key={type}>
              <RowHead>{type}</RowHead>
              <div data-hold-active={4}>
                <Code type={type} defaultValue="1234" aria-label={COPY[direction].label} />
              </div>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  ),
}
