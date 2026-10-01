import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  StatusIndicator,
  STATUS_LABELS,
  type StatusIndicatorProps,
} from "../../../../packages/fasla-ui/registry/ui/status-indicator"

const meta: Meta<typeof StatusIndicator> = {
  title: "UI/Status Indicator",
  component: StatusIndicator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    status: "online",
    size: "8",
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["online", "away", "busy", "offline"],
      description: "Figma `Type`.",
    },
    size: {
      control: "inline-radio",
      options: ["8", "4"],
      description: "Figma `Size`, in px. `4` is the dot on the 12px avatar.",
    },
    label: {
      control: "text",
      description:
        "Not visible. The accessible name, read by screen readers. Defaults to the status in the page's language — switch the Direction toolbar to hear the Arabic.",
    },
  },
}

export default meta
type Story = StoryObj<typeof StatusIndicator>

const STATUSES = ["online", "away", "busy", "offline"] as const
const SIZES = ["8", "4"] as const

type StoryCtx = { globals: { direction?: string } }
const labels = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? STATUS_LABELS.ar : STATUS_LABELS.en)

const COPY = {
  ltr: { person: "Layla Haddad", role: "Product designer" },
  rtl: { person: "ليلى حداد", role: "مصمّمة منتجات" },
} as const
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {}

/**
 * Every Figma variant: Type × Size. Each dot is centred under its heading;
 * the grid mirrors itself under `dir="rtl"`.
 */
export const Statuses: Story = {
  render: (_, ctx) => (
    <div className="grid grid-cols-[auto_repeat(4,minmax(3.5rem,auto))] items-center gap-x-3 gap-y-4 sm:grid-cols-[auto_repeat(4,minmax(4.5rem,auto))] sm:gap-x-6">
      <span />
      {STATUSES.map((s) => (
        <span key={s} className="justify-self-center text-xs text-muted-foreground">
          {labels(ctx)[s]}
        </span>
      ))}
      {SIZES.map((size) => (
        <React.Fragment key={size}>
          <span className="text-xs text-muted-foreground">
            {size}px
          </span>
          {STATUSES.map((s) => (
            <StatusIndicator key={s} status={s} size={size} className="justify-self-center" />
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
}

/**
 * Beside a name. The dot's name is plain text, so it is read in DOM order —
 * here "Online, Layla Hassan" — and `dir="rtl"` mirrors the row with no extra class.
 */
export const BesideAName: Story = {
  render: (args: StatusIndicatorProps, ctx) => (
    <div className="flex items-center gap-2">
      <StatusIndicator {...args} />
      <span className="text-sm font-medium">{copy(ctx).person}</span>
      <span className="text-sm text-muted-foreground">{copy(ctx).role}</span>
    </div>
  ),
}
