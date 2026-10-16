import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import {
  Alert,
  AlertAction,
  AlertClose,
  AlertDescription,
  AlertTitle,
  type AlertProps,
} from "../../../../packages/fasla-ui/registry/ui/alert"
import { Avatar } from "../../../../packages/fasla-ui/registry/ui/avatar"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const VARIANTS = ["default", "info", "success", "warning", "destructive"] as const
const TYPES = ["outline", "solid", "soft"] as const
const THEMES = ["light", "dark"] as const

type Variant = (typeof VARIANTS)[number]
type AlertType = (typeof TYPES)[number]
/** Figma's `Left Icon` and `Avatar` booleans as one choice of what `icon` gets. */
type Leading = "icon" | "avatar" | "none"

/**
 * The Default story's controls: Alert's two looks, and Figma's six booleans as
 * ways of composing the parts, so the whole set can be walked through here.
 * Behaviour props — `role`, `open`, `defaultOpen`, `onOpenChange`, `label`,
 * `onClick` — change nothing in the preview, so they are on the docs site's
 * Props tables only.
 */
type StoryArgs = {
  variant: Variant
  type: AlertType
  icon: Leading
  title: boolean
  description: boolean
  action: boolean
  close: boolean
  className?: string
}

/** Alert's own props that the table hides: docgen lists them otherwise. */
type Hidden = Pick<AlertProps, "open" | "defaultOpen" | "onOpenChange" | "role" | "children">

const meta: Meta<StoryArgs & Hidden> = {
  title: "UI/Alert",
  component: Alert as unknown as React.ComponentType<StoryArgs & Hidden>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: VARIANTS,
      description: "Figma `Variants`: what the message is about. Each has its own icon and colour.",
      table: { type: { summary: '"default" | "info" | "success" | "warning" | "destructive"' }, defaultValue: { summary: '"default"' } },
    },
    type: {
      control: "inline-radio",
      options: TYPES,
      description: "Figma `Type`: a card with a 1px stroke, a solid fill, or a tint over the card.",
      table: { type: { summary: '"outline" | "solid" | "soft"' }, defaultValue: { summary: '"outline"' } },
    },
    // Controls can't author a ReactNode, so the choice is named here and
    // `Composed` turns it into what the prop takes.
    icon: {
      control: "select",
      options: ["icon", "avatar", "none"],
      description:
        "Figma `Left Icon` and `Avatar`: the variant's icon (`icon`, the default), an Avatar passed to `icon`, or `icon={false}` (`none`).",
      table: { type: { summary: "boolean | ReactNode" }, defaultValue: { summary: "true" } },
    },
    title: { control: "boolean", description: "Figma `Title`: an `AlertTitle`." },
    description: { control: "boolean", description: "Figma `Subtitle`: an `AlertDescription`." },
    action: { control: "boolean", description: "Figma `Show Actions`: an `AlertAction`, Button at xs." },
    close: { control: "boolean", description: "Figma `Close Icon`: an `AlertClose`, Ghost Icon Button at icon-xs." },
    className: {
      control: "text",
      description: "Extra CSS classes, merged onto the root element.",
      table: { type: { summary: "string" } },
    },
    // Behaviour props: they change nothing in the preview. They are on the
    // docs page's Props table.
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    role: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    variant: "default",
    type: "outline",
    icon: "icon",
    title: true,
    description: true,
    action: true,
    close: true,
  },
}

export default meta
type Story = StoryObj<StoryArgs>

const PHOTO = "/samples/avatar-portrait.png"

type Copy = { title: string; description: string; action: string }
type Language = {
  messages: Record<Variant, Copy>
  avatar: Copy
  long: Copy & { more: string }
  closed: string
  reopen: string
}

/** A real message for each variant, in English and in Arabic. */
const COPY: Record<"en" | "ar", Language> = {
  en: {
    messages: {
      default: { title: "New message", description: "You have 12 unread messages in your inbox.", action: "View" },
      info: { title: "Maintenance tonight", description: "The dashboard is offline from 22:00 to 23:00.", action: "Details" },
      success: { title: "Payment received", description: "Your March invoice is paid in full.", action: "Receipt" },
      warning: {
        title: "Storage almost full",
        description: "You have used 90% of your plan. Delete files or upgrade.",
        action: "Upgrade",
      },
      destructive: {
        title: "Changes not saved",
        description: "The connection to the server dropped. Check your connection and try again.",
        action: "Retry",
      },
    },
    avatar: { title: "Layla Haddad replied", description: "“The new layout works. Ship it on Monday.”", action: "Reply" },
    long: {
      title: "Your workspace moves to the new billing plan on 1 April, and some features change",
      description:
        "Projects, members and files carry over as they are. Shared links made before the move keep working for 30 days, then ask viewers to sign in.",
      more: "Read the full list of changes before the move, and tell your team which links to replace.",
      action: "Review",
    },
    closed: "The alert is closed.",
    reopen: "Show it again",
  },
  ar: {
    messages: {
      default: { title: "رسالة جديدة", description: "لديك 12 رسالة غير مقروءة في صندوق الوارد.", action: "عرض" },
      info: { title: "صيانة مجدولة الليلة", description: "تتوقف لوحة التحكم عن العمل من الساعة 22:00 إلى 23:00.", action: "التفاصيل" },
      success: { title: "تم استلام الدفعة", description: "دُفعت فاتورة شهر مارس بالكامل.", action: "الإيصال" },
      warning: {
        title: "مساحة التخزين تكاد تمتلئ",
        description: "استخدمت 90% من مساحة خطتك. احذف بعض الملفات أو رقِّ خطتك.",
        action: "ترقية",
      },
      destructive: {
        title: "تعذّر حفظ التغييرات",
        description: "انقطع الاتصال بالخادم. تحقّق من اتصالك ثم حاول مرة أخرى.",
        action: "إعادة المحاولة",
      },
    },
    avatar: { title: "ردّت ليلى حداد", description: "«التصميم الجديد يعمل جيدًا. لننشره يوم الاثنين.»", action: "ردّ" },
    long: {
      title: "تنتقل مساحة عملك إلى خطة الفوترة الجديدة في الأول من أبريل، وتتغير بعض الميزات",
      description:
        "تنتقل المشاريع والأعضاء والملفات كما هي. وتبقى الروابط المشتركة التي أنشأتها قبل الانتقال صالحة 30 يومًا، ثم تطلب من زائريها تسجيل الدخول.",
      more: "اقرأ القائمة الكاملة للتغييرات قبل الانتقال، وأخبر فريقك بالروابط التي يجب استبدالها.",
      action: "مراجعة",
    },
    closed: "أُغلق التنبيه.",
    reopen: "أظهره مرة أخرى",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => COPY[ctx.globals.direction === "rtl" ? "ar" : "en"]

/** One alert, composed from the parts the way a developer would. */
function Composed({
  variant = "default",
  type = "outline",
  icon: leading = "icon",
  title = true,
  description = true,
  action = true,
  close = true,
  text,
  open,
  onOpenChange,
  className,
}: Partial<StoryArgs> & { text: Copy; open?: boolean; onOpenChange?: (open: boolean) => void; className?: string }) {
  const icon = leading === "avatar" ? <Avatar src={PHOTO} name="" radius="rounded" /> : leading === "icon"
  return (
    <Alert variant={variant} type={type} icon={icon} open={open} onOpenChange={onOpenChange} className={className}>
      {title && <AlertTitle>{text.title}</AlertTitle>}
      {description && <AlertDescription>{text.description}</AlertDescription>}
      {action && <AlertAction>{text.action}</AlertAction>}
      {close && <AlertClose />}
    </Alert>
  )
}

/**
 * Figma's width, 576px, narrowing to fit a phone. Against the viewport, not
 * the parent: the centred layout shrinks to fit its content, so a percentage
 * would never narrow it.
 */
const FIGMA_WIDTH = "w-[min(36rem,calc(100vw-4rem))]"
/** An alert filling its grid column. */
const CELL = "w-full"

/** A caption above a cell: Figma names, so English and left-to-right in both directions. */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["block w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/** A labelled cell: the caption above, the alert under it. */
const Cell = ({ head, children, className }: { head: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <div className={["flex min-w-0 flex-col gap-2", className].join(" ")}>
    <Head>{head}</Head>
    {children}
  </div>
)

/**
 * Gives the story the full width of its canvas or Docs block, so the grids
 * below can fit it, in either direction. 4px of padding keeps the focus ring
 * clear of the edge.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-full p-1">
      <Story />
    </div>
  </div>
)

const matrix: Pick<Story, "decorators" | "parameters"> = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
}

/**
 * Two columns of cells, rows sharing a top edge, as wide as two 464px alerts
 * at most. A column is never narrower than 20rem: where two don't fit, the
 * grid becomes one column.
 */
const GRID =
  "mx-auto grid w-full max-w-[59.5rem] grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-6"
/** The same two columns for the Directions and Light and Dark panels. */
const PANEL_GRID = "mx-auto grid w-full max-w-[61rem] grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-4"

/** The playground: walk Figma's Variants and Type, and its six booleans. */
export const Default: Story = {
  render: (args, ctx) => (
    <Composed
      {...args}
      text={copy(ctx).messages[args.variant]}
      className={[FIGMA_WIDTH, args.className].filter(Boolean).join(" ")}
    />
  ),
}

/** Every Variant of one Type: its icon, and the colours the set binds. */
const typeStory = (type: AlertType): Story => ({
  ...matrix,
  render: (_args, ctx) => (
    <div className={GRID}>
      {VARIANTS.map((variant) => (
        <Cell key={variant} head={variant}>
          <Composed type={type} variant={variant} text={copy(ctx).messages[variant]} className={CELL} />
        </Cell>
      ))}
    </div>
  ),
})

/**
 * Figma `Type=Outline`, the default: the card with a 1px stroke inside its
 * edge, in the variant's colour (`border` on Default). The action is Outline
 * Button.
 */
export const Outline: Story = typeStory("outline")

/**
 * `Type=Solid`: the variant's colour as the fill (`primary` on Default), and
 * the text in `foreground-inverse`. The action is Solid Secondary Button.
 */
export const Solid: Story = typeStory("solid")

/**
 * `Type=Soft`: the variant's 10% tint over the card, and the text in the
 * variant's colour. The action is Solid Primary Button.
 */
export const Soft: Story = typeStory("soft")

/**
 * Figma's booleans: each part can be left out, and the rest close up. The
 * avatar takes the icon's place and sits at the top, 32px.
 */
export const Parts: Story = {
  ...matrix,
  render: (_args, ctx) => {
    const c = copy(ctx)
    const text = c.messages.info
    return (
      <div className={GRID}>
        <Cell head="everything">
          <Composed variant="info" text={text} className={CELL} />
        </Cell>
        <Cell head="Avatar">
          <Composed icon="avatar" text={c.avatar} className={CELL} />
        </Cell>
        <Cell head="no icon">
          <Composed variant="info" icon="none" text={text} className={CELL} />
        </Cell>
        <Cell head="title only">
          <Composed variant="info" description={false} text={text} className={CELL} />
        </Cell>
        <Cell head="description only">
          <Composed variant="info" title={false} text={text} className={CELL} />
        </Cell>
        <Cell head="no action, no close">
          <Composed variant="info" action={false} close={false} text={text} className={CELL} />
        </Cell>
      </div>
    )
  },
}

/** A long title and a description of two paragraphs, at Figma's width and at a phone's. */
function Long({ text: c, className }: { text: Language["long"]; className: string }) {
  return (
    <Alert variant="warning" type="soft" className={className}>
      <AlertTitle>{c.title}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{c.description}</p>
        <p>{c.more}</p>
      </AlertDescription>
      <AlertAction>{c.action}</AlertAction>
      <AlertClose />
    </Alert>
  )
}

/**
 * Long text wraps in its own column: the icon stays on the title's first
 * line, and the action and close button stay at the top.
 */
export const LongText: Story = {
  ...matrix,
  render: (_args, ctx) => (
    <div className="flex w-full flex-wrap items-start justify-center gap-6">
      <Cell head="576px" className="w-full max-w-[36rem]">
        <Long text={copy(ctx).long} className="w-full" />
      </Cell>
      <Cell head="320px" className="w-80 max-w-full">
        <Long text={copy(ctx).long} className="w-full" />
      </Cell>
    </div>
  ),
}

/**
 * Pressing the close button closes the alert and calls `onOpenChange(false)`.
 * Here the alert is controlled through `open`, so it can be shown again.
 * While it is closed, an invisible copy holds its height, so the story keeps
 * its size at every width, in either direction.
 */
export const Dismissible: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { include: ["variant", "type", "className"] } },
  render: function Render({ variant, type, className }, ctx) {
    const [open, setOpen] = React.useState(true)
    const c = copy(ctx)
    return (
      <div className="mx-auto grid w-full max-w-[36rem] place-items-center">
        <Composed
          variant={variant}
          type={type}
          text={c.messages[variant]}
          open={open}
          onOpenChange={setOpen}
          className={["w-full [grid-area:1/1]", className].filter(Boolean).join(" ")}
        />
        {!open && (
          <Composed
            variant={variant}
            type={type}
            text={c.messages[variant]}
            className={["invisible w-full [grid-area:1/1]", className].filter(Boolean).join(" ")}
          />
        )}
        {!open && (
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground [grid-area:1/1]">
            <p>{c.closed}</p>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              {c.reopen}
            </Button>
          </div>
        )}
      </div>
    )
  },
}

const PANELS = [
  { dir: "ltr", lang: "en", title: "LTR" },
  { dir: "rtl", lang: "ar", title: "RTL" },
] as const

/**
 * English and Arabic side by side, whatever the Direction toolbar says. In
 * Arabic the row starts on the right: icon, text, action, close. The text is
 * Cairo on its taller line, and the icon stays centred on the title's first
 * line. Each panel is a subgrid of the same rows, so the two sides share every
 * row's top edge.
 */
export const Directions: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { include: ["type", "className"] } },
  render: ({ type, className }) => (
    <div className={PANEL_GRID}>
      {PANELS.map((panel) => (
        <div
          key={panel.dir}
          dir={panel.dir}
          lang={panel.lang}
          className={[
            "row-span-6 grid min-w-0 grid-rows-subgrid items-start gap-y-4 rounded-lg border p-4",
            panel.dir === "rtl" ? "font-arabic" : "font-sans",
          ].join(" ")}
        >
          <Head>{panel.title}</Head>
          {VARIANTS.map((variant) => (
            <Composed
              key={variant}
              type={type}
              variant={variant}
              text={COPY[panel.lang].messages[variant]}
              className={["w-full", className].filter(Boolean).join(" ")}
            />
          ))}
        </div>
      ))}
    </div>
  ),
}

/**
 * Light and Dark side by side, whatever the theme toolbar says. Language and
 * direction follow the Direction toolbar. Each panel's `light` or `dark`
 * class re-points every token for its subtree, on the Docs page too.
 */
export const LightAndDark: Story = {
  name: "Light and Dark",
  decorators: [framed],
  parameters: { layout: "padded", controls: { include: ["type", "className"] } },
  render: ({ type, className }, ctx) => (
    <div className={PANEL_GRID}>
      {THEMES.map((theme) => (
        <div
          key={theme}
          className={[
            "row-span-6 grid min-w-0 grid-rows-subgrid items-start gap-y-4 rounded-lg border bg-background p-4 text-foreground",
            theme,
          ].join(" ")}
        >
          <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
          {VARIANTS.map((variant) => (
            <Composed
              key={variant}
              type={type}
              variant={variant}
              text={copy(ctx).messages[variant]}
              className={["w-full", className].filter(Boolean).join(" ")}
            />
          ))}
        </div>
      ))}
    </div>
  ),
}
