import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Progress } from "../../../../packages/fasla-ui/registry/ui/progress"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    showPercentage: { control: "boolean" },
  },
  args: {
    value: 50,
    size: "md",
    showPercentage: true,
  },
}

export default meta
type Story = StoryObj<typeof Progress>

/**
 * Sample copy, per script.
 *
 * Only the accessible names change: a progress bar has no visible text of its
 * own besides the number, and the number stays in Latin digits in Arabic, as
 * Figma's RTL variants show it. The Arabic follows design/content/: a real
 * situation (uploading a file), never a placeholder, and it matches the docs.
 */
const COPY = {
  ltr: {
    label: "Uploading quarterly report",
    step: "Back",
    next: "Next",
    reset: "Reset",
  },
  rtl: {
    label: "رفع التقرير الربعي",
    step: "رجوع",
    next: "التالي",
    reset: "إعادة الضبط",
  },
} as const

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const SIZES = ["sm", "md", "lg"] as const
/** Figma's doc shows these steps; 33.3 and 62.5 prove any value works. */
const VALUES = [0, 25, 50, 75, 100] as const
const THEMES = ["light", "dark"] as const

const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/** Every control in the Controls panel drives this one. Figma's canvas width is 200px. */
export const Default: Story = {
  render: (args, ctx) => (
    <div className="w-[200px]">
      <Progress aria-label={copy(ctx).label} {...args} />
    </div>
  ),
}

/**
 * Figma's `Size` axis: 6, 8 and 12px tracks with 12, 14 and 16px labels in
 * 32, 38 and 44px columns. Each row label sits on its bar's line.
 */
export const Sizes: Story = {
  render: (_args, ctx) => (
    <div className="grid w-80 grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4">
      {SIZES.map((size) => (
        <React.Fragment key={size}>
          <Head>{size}</Head>
          <Progress size={size} value={50} aria-label={copy(ctx).label} />
        </React.Fragment>
      ))}
    </div>
  ),
}

/**
 * Figma's `Percentage` axis, sampled as its doc does (0, 25, 50, 75, 100) at
 * every size, plus two values between its 5% steps. The indicator is square
 * where it ends mid-track and round only where it meets the track's ends.
 */
export const Values: Story = {
  render: (_args, ctx) => (
    <div className="grid grid-cols-[auto_repeat(3,200px)] items-center gap-x-6 gap-y-4">
      <span />
      {SIZES.map((size) => (
        <Head key={size}>{size}</Head>
      ))}
      {[...VALUES, 33.3, 62.5].map((value) => (
        <React.Fragment key={value}>
          <Head>{value}</Head>
          {SIZES.map((size) => (
            <Progress key={size} size={size} value={value} aria-label={copy(ctx).label} />
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
}

/**
 * Figma's `Show Percentage` toggle. Off, the label and its 8px gap go, and
 * the bar takes the whole width. Screen readers hear the value either way,
 * from the progress bar itself.
 */
export const ShowPercentage: Story = {
  render: (_args, ctx) => (
    <div className="grid grid-cols-[auto_repeat(2,200px)] items-center gap-x-6 gap-y-4">
      <span />
      <Head>showPercentage</Head>
      <Head>{"showPercentage={false}"}</Head>
      {SIZES.map((size) => (
        <React.Fragment key={size}>
          <Head>{size}</Head>
          <Progress size={size} value={60} aria-label={copy(ctx).label} />
          <Progress size={size} value={60} showPercentage={false} aria-label={copy(ctx).label} />
        </React.Fragment>
      ))}
    </div>
  ),
}

const PANELS = [
  { dir: "ltr", lang: "en", title: "LTR", label: COPY.ltr.label },
  { dir: "rtl", lang: "ar", title: "RTL", label: COPY.rtl.label },
] as const

/**
 * English and Arabic side by side, whatever the Direction toolbar says. The
 * bar fills from the inline start (the left, then the right) and the label
 * sits before it, as in Figma's RTL variants. Arabic sets the label in Cairo,
 * whose taller line (20, 24 and 28px) the row centres on.
 */
export const Directions: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {PANELS.map((panel) => (
        <div
          key={panel.dir}
          dir={panel.dir}
          lang={panel.lang}
          className={[
            "flex flex-col gap-4 rounded-lg border p-6",
            panel.dir === "rtl" ? "font-arabic" : "font-sans",
          ].join(" ")}
        >
          <Head>{panel.title}</Head>
          {SIZES.map((size, i) => (
            <Progress key={size} size={size} value={[25, 50, 75][i]} aria-label={panel.label} />
          ))}
          <Progress value={40} showPercentage={false} aria-label={panel.label} />
        </div>
      ))}
    </div>
  ),
}

/**
 * Light and Dark side by side, whatever the theme toolbar says. Language and
 * direction follow the Direction toolbar, like every other story.
 *
 * Each panel sets its own theme: the `light` or `dark` class re-points every
 * token for that subtree, on the Docs page too.
 */
export const LightAndDark: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => (
    <div className="grid gap-4 md:grid-cols-2">
      {THEMES.map((theme) => (
        <div
          key={theme}
          className={["flex flex-col gap-4 rounded-lg border bg-background p-6 text-foreground", theme].join(" ")}
        >
          <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
          {SIZES.map((size, i) => (
            <Progress key={size} size={size} value={[0, 50, 100][i]} aria-label={copy(ctx).label} />
          ))}
          <Progress value={75} showPercentage={false} aria-label={copy(ctx).label} />
        </div>
      ))}
    </div>
  ),
}

/**
 * The value changing. The indicator eases to its new width; with reduced
 * motion turned on, it jumps.
 */
export const Changing: Story = {
  render: function Render(_args, ctx) {
    const c = copy(ctx)
    const [value, setValue] = React.useState(20)
    return (
      <div className="flex w-80 flex-col gap-4">
        <Progress value={value} aria-label={c.label} />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 20))}>
            {c.step}
          </Button>
          <Button size="sm" onClick={() => setValue((v) => Math.min(100, v + 20))}>
            {c.next}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setValue(0)}>
            {c.reset}
          </Button>
        </div>
      </div>
    )
  },
}
