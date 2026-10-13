import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { DownloadIcon, UploadIcon } from "lucide-react"
import { Button, type ButtonProps } from "../../../../packages/fasla-ui/registry/ui/button"
import { HIDE_REST, Head, ICON_NAMES, StateGrid, StoryIcon, TONES, TYPES, pseudoFor, type IconName } from "./button-story-kit"

/**
 * Button with a text label. Icon Button is the same component at the `icon-*`
 * sizes; it has its own page, "UI/Icon Button".
 *
 * `label`, `iconPosition` and `icon` are this page's own controls, not props:
 * the label is the button's children, and the icon is a child before or after
 * it, in DOM order, so `start` sits on the right in right-to-left.
 */
type StoryArgs = ButtonProps & {
  label?: string
  iconPosition: "none" | "start" | "end"
  icon: IconName
}

const story = { table: { category: "Story" } } as const

const meta: Meta<StoryArgs> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    controls: {
      include: ["tone", "variant", "size", "radius", "loading", "loadingLabel", "disabled", "label", "iconPosition", "icon"],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // Tone first, then variant, as on the docs page. shadcn's `secondary` and
    // `destructive` variants and its `default` size still work, but the
    // controls and table list the Figma names only.
    tone: {
      control: "select",
      options: ["primary", "secondary", "destructive"],
      table: { type: { summary: '"primary" | "secondary" | "destructive"' } },
    },
    variant: {
      control: "select",
      options: ["default", "outline", "ghost", "soft", "link"],
      table: { type: { summary: '"default" | "outline" | "ghost" | "soft" | "link"' }, defaultValue: { summary: '"default"' } },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      table: { type: { summary: '"xs" | "sm" | "md" | "lg"' }, defaultValue: { summary: '"md"' } },
    },
    radius: { control: "inline-radio", options: ["standard", "rounded"] },
    loading: { control: "boolean" },
    loadingLabel: { control: "text" },
    disabled: { control: "boolean" },
    label: {
      control: "text",
      description: "The button's text. Empty shows the sample label for the current direction.",
      ...story,
    },
    iconPosition: {
      control: "inline-radio",
      options: ["none", "start", "end"],
      description: "One icon, before or after the label. `start` is the left in LTR and the right in RTL.",
      ...story,
    },
    icon: {
      control: "select",
      options: ICON_NAMES,
      description: "Which lucide icon shows when `iconPosition` is not `none`.",
      ...story,
    },
    ...HIDE_REST,
  },
  // In panel order: Storybook lists the controls in the order of these keys.
  args: {
    tone: undefined,
    variant: "default",
    size: "md",
    radius: "standard",
    loading: false,
    // Empty: each story falls back to the loading text for its direction.
    loadingLabel: undefined,
    disabled: false,
    label: "",
    iconPosition: "none",
    icon: "plus",
  },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script: the same account actions as the docs page. Only the
 * labels change; the Arabic follows design/content/.
 */
const COPY = {
  ltr: {
    save: "Save changes",
    variants: ["Save changes", "Preview", "Delete account", "Cancel", "Skip", "View details", "Add filter"],
    loading: "Saving…",
    loadingLabel: "Saving",
    upload: "Upload",
    download: "Download",
    add: "Add",
    next: "Next",
    edit: "Edit",
    forgot: "Forgot password?",
    learnMore: "Learn more",
    viewAll: "View all",
    sameScreen: "An action on this page",
    elsewhere: "Goes somewhere else",
  },
  rtl: {
    save: "حفظ التغييرات",
    variants: ["حفظ التغييرات", "معاينة", "حذف الحساب", "إلغاء", "تخطّي", "عرض التفاصيل", "إضافة عامل تصفية"],
    loading: "جارٍ الحفظ…",
    loadingLabel: "جارٍ الحفظ",
    upload: "رفع ملف",
    download: "تنزيل",
    add: "إضافة",
    next: "التالي",
    edit: "تعديل",
    forgot: "نسيت كلمة المرور؟",
    learnMore: "اعرف المزيد",
    viewAll: "عرض الكل",
    sameScreen: "إجراء في هذه الصفحة",
    elsewhere: "انتقال إلى مكان آخر",
  },
}

type Copy = (typeof COPY)["ltr"]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link", "soft"] as const
export const Default: Story = {
  render: ({ label, iconPosition, icon, loadingLabel, ...args }, ctx) => {
    const text = label || copy(ctx).save
    const glyph = iconPosition !== "none" ? <StoryIcon name={icon} /> : null
    return (
      <Button {...args} loadingLabel={loadingLabel || copy(ctx).loadingLabel}>
        {iconPosition === "start" && glyph}
        {text}
        {iconPosition === "end" && glyph}
      </Button>
    )
  },
}

/** shadcn's six variants and Figma's Soft, each in its default tone. */
export const Variants: Story = {
  render: (_args, ctx) => (
    <div className="flex max-w-3xl flex-wrap items-center gap-4">
      {VARIANTS.map((variant, i) => (
        <Button key={variant} variant={variant}>
          {copy(ctx).variants[i]}
        </Button>
      ))}
    </div>
  ),
}

/** Every Type, Style and State of Figma's Button set, at md. */
export const States: Story = {
  parameters: { pseudo: pseudoFor("btn", TYPES) },
  render: (_args, ctx) => (
    <StateGrid prefix="btn" types={TYPES}>
      {copy(ctx).save}
    </StateGrid>
  ),
}

/** xs 26px, sm 32px, md 36px, lg 40px: the label alone, and with a leading icon. Icon-only sizes are on Icon Button. */
export const Sizes: Story = {
  render: (_args, ctx) => (
    <div className="grid grid-cols-[4rem_max-content_max-content] items-center gap-x-6 gap-y-4">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <React.Fragment key={size}>
          <Head>{size}</Head>
          <Button size={size}>{copy(ctx).save}</Button>
          <Button size={size}>
            <StoryIcon name="plus" />
            {copy(ctx).add}
          </Button>
        </React.Fragment>
      ))}
    </div>
  ),
}

/** Figma's Radius: Standard is `border radius/md`, Rounded is a pill. The focus ring follows it. */
export const Radius: Story = {
  parameters: { pseudo: { focusVisible: ["#radius-focus-standard button", "#radius-focus-rounded button"] } },
  render: (_args, ctx) => (
    <div className="grid grid-cols-[5rem_repeat(2,max-content)] items-center gap-x-5 gap-y-4">
      {(["standard", "rounded"] as const).map((radius) => (
        <React.Fragment key={radius}>
          <Head>{radius}</Head>
          <Button radius={radius}>{copy(ctx).save}</Button>
          <span id={`radius-focus-${radius}`} className="inline-flex">
            <Button radius={radius} variant="outline">
              {copy(ctx).save}
            </Button>
          </span>
        </React.Fragment>
      ))}
    </div>
  ),
}

/**
 * Icons sit in DOM order, so they mirror with the page: switch the Direction
 * toolbar to RTL and the trailing arrow moves to the left. Directional glyphs
 * flip themselves with `rtl:-scale-x-100`.
 */
export const WithIcons: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button>
        <UploadIcon strokeWidth={1.5} />
        {copy(ctx).upload}
      </Button>
      <Button variant="outline">
        {copy(ctx).download}
        <DownloadIcon strokeWidth={1.5} />
      </Button>
      <Button variant="soft" tone="secondary">
        {copy(ctx).next}
        <StoryIcon name="arrow-right" />
      </Button>
    </div>
  ),
}

/**
 * Ghost is for actions on the same page; Link takes the reader somewhere else.
 */
export const LinkAndGhost: Story = {
  name: "Link and Ghost",
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-2 items-start gap-x-10 gap-y-3">
        <span className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted-foreground">
          <Head>ghost</Head>
          {c.sameScreen}
        </span>
        <span className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted-foreground">
          <Head>link</Head>
          {c.elsewhere}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost">{c.edit}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="link" asChild>
            <a href="#forgot">{c.forgot}</a>
          </Button>
          <Button variant="link" asChild>
            <a href="#learn-more">{c.learnMore}</a>
          </Button>
          <Button variant="link" asChild>
            <a href="#view-all">{c.viewAll}</a>
          </Button>
        </div>
      </div>
    )
  },
}

export const Loading: Story = {
  // The page's args first, then this story's own loading state, so the
  // default `loading: false` can't switch it off.
  render: ({ label, iconPosition: _position, icon: _icon, loadingLabel, ...args }, ctx) => (
    <div className="flex items-center gap-4">
      <Button {...args} loading loadingLabel={loadingLabel || copy(ctx).loadingLabel}>
        {label || copy(ctx).loading}
      </Button>
      <Button loading loadingLabel={copy(ctx).loadingLabel} size="icon-md" variant="outline" aria-label={copy(ctx).add}>
        <StoryIcon name="plus" />
      </Button>
    </div>
  ),
}

export const AllVariantsDisabled: Story = {
  render: (_args, ctx) => (
    <div className="flex max-w-3xl flex-wrap items-center gap-4">
      {VARIANTS.map((variant, i) => (
        <Button key={variant} variant={variant} disabled>
          {copy(ctx).variants[i]}
        </Button>
      ))}
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark, one panel each, whatever the theme toolbar says, as Figma's
 * doc shows each Type. Each panel is every Type × Style at Enabled. Language
 * and direction follow the Direction toolbar.
 */
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
            {TYPES.map((t) => (
              <React.Fragment key={t.name}>
                <Head>{t.name}</Head>
                {TONES.map((tone) => (
                  <Button key={tone} variant={t.variant} tone={tone}>
                    {copy(ctx).save}
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
