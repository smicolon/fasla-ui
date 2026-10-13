import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ArrowRightIcon, DownloadIcon, HeartIcon, PlusIcon, UploadIcon, XIcon } from "lucide-react"
import { Button, type ButtonProps } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Tone first, then variant, as on the docs page. shadcn's `secondary` and
    // `destructive` variants and its `default` and `icon` sizes still work,
    // but the controls and table list the Figma names only.
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
      options: ["xs", "sm", "md", "lg", "icon-xs", "icon-sm", "icon-md", "icon-lg"],
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg" | "icon-xs" | "icon-sm" | "icon-md" | "icon-lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
    radius: {
      control: "inline-radio",
      options: ["standard", "rounded"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof meta>

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
    like: "Like",
    close: "Close",
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
    like: "إعجاب",
    close: "إغلاق",
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
const TONES = ["primary", "secondary", "destructive"] as const
const STATES = ["Enabled", "Hover", "Clicked", "Focus", "Disabled"] as const

/** Figma's five Types, each reached through one shadcn variant plus `tone`. */
const TYPES = [
  { name: "Solid", variant: "default" },
  { name: "Soft", variant: "soft" },
  { name: "Outline", variant: "outline" },
  { name: "Ghost", variant: "ghost" },
  { name: "Link", variant: "link" },
] as const

/** A row or column label: always Latin, always on the line of what it names. */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit font-sans text-xs text-muted-foreground", className].filter(Boolean).join(" ")}>
    {children}
  </span>
)

const cell = (prefix: string, type: string, tone: string, state: string) =>
  `${prefix}-${type}-${tone}-${state}`.toLowerCase()

/** Pseudo-state targets for one grid: every Hover, Clicked and Focus cell's button. */
const pseudoFor = (prefix: string, types: readonly { name: string }[]) => {
  const ids = (state: string) =>
    types.flatMap((t) => TONES.map((tone) => `#${cell(prefix, t.name, tone, state)} button`))
  return { hover: ids("Hover"), active: ids("Clicked"), focusVisible: ids("Focus") }
}

/**
 * Figma's Type × Style × State grid: every row a Type in one tone, every
 * column a state. Hover, Clicked and Focus are the real `:hover`, `:active`
 * and `:focus-visible` rules, forced by `storybook-addon-pseudo-states`.
 */
const StateGrid = ({
  prefix,
  types,
  size,
  children,
}: {
  prefix: string
  types: readonly { name: string; variant: ButtonProps["variant"] }[]
  size?: ButtonProps["size"]
  children: React.ReactNode
}) => (
  <div className="grid grid-cols-[repeat(6,max-content)] items-center gap-x-5 gap-y-3">
    <span />
    {STATES.map((s) => (
      <Head key={s}>{s}</Head>
    ))}
    {types.map((t) =>
      TONES.map((tone) => (
        <React.Fragment key={`${t.name}-${tone}`}>
          <Head>
            {t.name} / {tone}
          </Head>
          {STATES.map((state) => (
            <span key={state} id={cell(prefix, t.name, tone, state)} className="inline-flex">
              <Button variant={t.variant} tone={tone} size={size} disabled={state === "Disabled"}>
                {children}
              </Button>
            </span>
          ))}
        </React.Fragment>
      ))
    )}
  </div>
)

export const Default: Story = {
  render: (args, ctx) => {
    const isIcon = args.size?.startsWith("icon")
    return isIcon ? (
      <Button {...args} aria-label={copy(ctx).add}>
        <PlusIcon strokeWidth={1.5} />
      </Button>
    ) : (
      <Button {...args}>{args.children ?? copy(ctx).save}</Button>
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

/** Figma's Icon Button set: the same states, square, with no Link Type. */
export const IconButtonStates: Story = {
  name: "Icon Button States",
  parameters: { pseudo: pseudoFor("ib", TYPES.slice(0, 4)) },
  render: (_args, ctx) => (
    <StateGrid prefix="ib" types={TYPES.slice(0, 4)} size="icon-md">
      <HeartIcon strokeWidth={1.5} />
      <span className="sr-only">{copy(ctx).like}</span>
    </StateGrid>
  ),
}

/** xs 26px, sm 32px, md 36px, lg 40px, and the icon sizes beside them. */
export const Sizes: Story = {
  render: (_args, ctx) => (
    <div className="grid grid-cols-[4rem_max-content_max-content] items-center gap-x-6 gap-y-4">
      {(
        [
          ["xs", "icon-xs"],
          ["sm", "icon-sm"],
          ["md", "icon-md"],
          ["lg", "icon-lg"],
        ] as const
      ).map(([size, icon]) => (
        <React.Fragment key={size}>
          <Head>{size}</Head>
          <Button size={size}>
            <PlusIcon strokeWidth={1.5} />
            {copy(ctx).add}
          </Button>
          <Button size={icon} aria-label={copy(ctx).add}>
            <PlusIcon strokeWidth={1.5} />
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
    <div className="grid grid-cols-[5rem_repeat(3,max-content)] items-center gap-x-5 gap-y-4">
      {(["standard", "rounded"] as const).map((radius) => (
        <React.Fragment key={radius}>
          <Head>{radius}</Head>
          <Button radius={radius}>{copy(ctx).save}</Button>
          <span id={`radius-focus-${radius}`} className="inline-flex">
            <Button radius={radius} variant="outline">
              {copy(ctx).save}
            </Button>
          </span>
          <Button radius={radius} size="icon-md" variant="soft" aria-label={copy(ctx).add}>
            <PlusIcon strokeWidth={1.5} />
          </Button>
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
        <ArrowRightIcon className="rtl:-scale-x-100" strokeWidth={1.5} />
      </Button>
    </div>
  ),
}

/**
 * Ghost is for actions on the same page; Link takes the reader somewhere else.
 * A link inside a sentence stays a plain text link, not a Button.
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
          <Button variant="ghost" size="icon-md" aria-label={c.close}>
            <XIcon strokeWidth={1.5} />
          </Button>
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
  render: (args, ctx) => (
    <div className="flex items-center gap-4">
      <Button loading loadingLabel={copy(ctx).loadingLabel} {...args}>
        {args.children ?? copy(ctx).loading}
      </Button>
      <Button loading loadingLabel={copy(ctx).loadingLabel} size="icon-md" variant="outline" aria-label={copy(ctx).add}>
        <PlusIcon strokeWidth={1.5} />
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
 * doc shows each Type. Each panel is every Type × Style at Enabled, plus the
 * Icon Button. Language and direction follow the Direction toolbar.
 */
export const LightAndDark: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => (
    <div className="grid w-max gap-4">
      {THEMES.map((theme) => (
        <div key={theme} className={[theme, "rounded-lg border bg-background p-6 text-foreground"].join(" ")}>
          <Head className="block pb-4">{theme === "dark" ? "Dark" : "Light"}</Head>
          <div className="grid grid-cols-[repeat(5,max-content)] items-center gap-x-5 gap-y-3">
            <span />
            {TONES.map((tone) => (
              <Head key={tone}>{tone}</Head>
            ))}
            <Head>icon</Head>
            {TYPES.map((t) => (
              <React.Fragment key={t.name}>
                <Head>{t.name}</Head>
                {TONES.map((tone) => (
                  <Button key={tone} variant={t.variant} tone={tone}>
                    {copy(ctx).save}
                  </Button>
                ))}
                {t.name === "Link" ? (
                  <span />
                ) : (
                  <Button variant={t.variant} size="icon-md" aria-label={copy(ctx).like}>
                    <HeartIcon strokeWidth={1.5} />
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}
