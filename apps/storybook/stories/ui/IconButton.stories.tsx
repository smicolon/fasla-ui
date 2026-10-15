import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Button, type ButtonProps } from "../../../../packages/fasla-ui/registry/ui/button"
import { HIDE_REST, Head, ICON_NAMES, ICON_TYPES, StateGrid, StoryIcon, TONES, iconLabel, pseudoFor, type IconName } from "./button-story-kit"

/**
 * Icon Button: Figma's separate set, built as the same `Button` at the `icon-*`
 * sizes — one 16px icon, no label, so it needs an accessible name.
 *
 * `icon` is this page's own control, not a prop: the icon is the button's
 * only child. `aria-label` is the real attribute.
 */
type StoryArgs = ButtonProps & { icon: IconName; "aria-label"?: string }

const meta: Meta<StoryArgs> = {
  title: "UI/Icon Button",
  component: Button,
  parameters: {
    layout: "centered",
    controls: { include: ["tone", "variant", "size", "radius", "loading", "disabled", "icon", "aria-label", "className"] },
  },
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["primary", "secondary", "destructive"],
      table: { type: { summary: '"primary" | "secondary" | "destructive"' } },
    },
    // No Link: an icon on its own does not read as a link.
    variant: {
      control: "select",
      options: ["default", "outline", "ghost", "soft"],
      table: { type: { summary: '"default" | "outline" | "ghost" | "soft"' }, defaultValue: { summary: '"default"' } },
    },
    size: {
      control: "select",
      options: ["icon-xs", "icon-sm", "icon-md", "icon-lg"],
      table: { type: { summary: '"icon-xs" | "icon-sm" | "icon-md" | "icon-lg"' } },
    },
    radius: { control: "inline-radio", options: ["standard", "rounded"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    icon: {
      control: "select",
      options: ICON_NAMES,
      description: "Which lucide icon the button shows.",
      table: { category: "Story" },
    },
    "aria-label": {
      control: "text",
      description:
        "The accessible name a screen reader reads. Empty uses the picked icon's action in the current direction; in development the button warns when it has none.",
      table: { type: { summary: "string" } },
    },
    ...HIDE_REST,
    // HTML's own prop, which docgen leaves out; listed so every UI table has it.
    className: {
      control: "text",
      description: "Extra CSS classes, merged onto the root element.",
      table: { type: { summary: "string" } },
    },
  },
  // In panel order: Storybook lists the controls in the order of these keys.
  args: {
    tone: undefined,
    variant: "default",
    size: "icon-md",
    radius: "standard",
    loading: false,
    disabled: false,
    icon: "plus",
    "aria-label": "",
  },
}

export default meta
type Story = StoryObj<StoryArgs>

/** Sample names, per script, for the icons the stories use. */
const COPY = {
  ltr: { add: "Add", like: "Like", edit: "Edit", loading: "Loading" },
  rtl: { add: "إضافة", like: "إعجاب", edit: "تعديل", loading: "جارٍ التحميل" },
}
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: ({ icon, "aria-label": ariaLabel, ...args }, ctx) => (
    <Button
      {...args}
      aria-label={ariaLabel || iconLabel(icon, ctx.globals.direction)}
      loadingLabel={copy(ctx).loading}
    >
      <StoryIcon name={icon} />
    </Button>
  ),
}

/** Figma's Icon Button set: every Type, Style and State at icon-md. */
export const States: Story = {
  parameters: { pseudo: pseudoFor("ib", ICON_TYPES) },
  render: (_args, ctx) => (
    <StateGrid prefix="ib" types={ICON_TYPES} size="icon-md">
      <StoryIcon name="heart" />
      <span className="sr-only">{copy(ctx).like}</span>
    </StateGrid>
  ),
}

/** icon-xs 26px, icon-sm 32px, icon-md 36px, icon-lg 40px, Standard and Rounded. The icon stays 16px. */
export const Sizes: Story = {
  render: (_args, ctx) => (
    <div className="grid grid-cols-[5rem_repeat(4,max-content)] items-center gap-x-5 gap-y-4">
      <span />
      {(["icon-xs", "icon-sm", "icon-md", "icon-lg"] as const).map((size) => (
        <Head key={size}>{size}</Head>
      ))}
      {(["standard", "rounded"] as const).map((radius) => (
        <React.Fragment key={radius}>
          <Head>{radius}</Head>
          {(["icon-xs", "icon-sm", "icon-md", "icon-lg"] as const).map((size) => (
            <Button key={size} size={size} radius={radius} variant="outline" aria-label={copy(ctx).add}>
              <StoryIcon name="plus" />
            </Button>
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/** Every Type × Style at Enabled, one panel per theme, whatever the toolbar says. */
export const LightAndDark: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => (
    <div className="grid w-max gap-4">
      {THEMES.map((theme) => (
        <div key={theme} className={[theme, "rounded-lg border bg-background p-6 text-foreground"].join(" ")}>
          <Head className="block pb-4">{theme === "dark" ? "Dark" : "Light"}</Head>
          <div className="grid grid-cols-[repeat(4,max-content)] items-center gap-x-5 gap-y-3">
            <span />
            {TONES.map((tone) => (
              <Head key={tone}>{tone}</Head>
            ))}
            {ICON_TYPES.map((t) => (
              <React.Fragment key={t.name}>
                <Head>{t.name}</Head>
                {TONES.map((tone) => (
                  <Button key={tone} variant={t.variant} tone={tone} size="icon-md" aria-label={copy(ctx).edit}>
                    <StoryIcon name="pencil" />
                  </Button>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}
