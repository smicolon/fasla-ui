import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { Dialog } from "@base-ui/react/dialog"
import { InfoIcon, LogOutIcon, Trash2Icon, TriangleAlertIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogContentProps,
} from "../../../../packages/fasla-ui/registry/ui/alert-dialog"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"
import { Input } from "../../../../packages/fasla-ui/registry/ui/input"

/**
 * Figma: "Alert Dialog" (15455:53947). Align, Destructive and Icon are props
 * of `AlertDialogContent`; Additional Content is whatever sits between the
 * header and the footer (`additionalContent` here); Direction is the toolbar.
 * Every story follows the Direction and Theme toolbars, except Light and Dark
 * and LTR and RTL, which show both at once.
 *
 * The dialogs on this page are held open inside their own box so they can be
 * compared side by side. The Interactive story opens a real one over the
 * page.
 */
type StoryArgs = AlertDialogContentProps & {
  /** Figma's Additional Content: a field between the text and the actions. */
  additionalContent: boolean
  /** The title text. Empty: the sample copy, in the toolbar's language. */
  title?: string
  /** The description text. Empty: the sample copy, in the toolbar's language. */
  description?: string
}

/**
 * The icon control's choices. `circle-alert` is `icon={true}`, Figma's own
 * icon; the others are icons passed in, as an app would pass its own. Each
 * gets the same 24px cell in the title's colour.
 */
const ICONS = {
  none: false,
  "circle-alert": true,
  info: <InfoIcon strokeWidth={1.5} />,
  "triangle-alert": <TriangleAlertIcon strokeWidth={1.5} />,
  "trash-2": <Trash2Icon strokeWidth={1.5} />,
  // Directional: its arrow points out of the door, so it mirrors in RTL.
  "log-out": <LogOutIcon strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />,
}

const meta: Meta<StoryArgs> = {
  title: "UI/Alert Dialog",
  component: AlertDialogContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    align: { control: "inline-radio", options: ["edge", "center"] },
    destructive: { control: "boolean" },
    // A choice of Lucide icons, mapped to what the prop takes: `true` for
    // Figma's circle-alert, an element for the rest, `false` for none.
    icon: {
      control: "select",
      options: Object.keys(ICONS),
      mapping: ICONS,
      description: "An icon with the title, in its colour: `true` for Figma's circle-alert, or any icon element.",
      table: { type: { summary: "boolean | ReactNode" }, defaultValue: { summary: "false" } },
    },
    title: {
      control: "text",
      description: "The `AlertDialogTitle` text. Empty: the sample copy, in the toolbar's language.",
    },
    description: {
      control: "text",
      description: "The `AlertDialogDescription` text. Empty: the sample copy, in the toolbar's language.",
    },
    additionalContent: {
      control: "boolean",
      description: "Figma's Additional Content: anything between `AlertDialogHeader` and `AlertDialogFooter`. Here, a field.",
      table: { defaultValue: { summary: "false" } },
    },
    className: { control: "text" },
    // Behaviour and Base UI's own escape hatches: they change nothing in the
    // preview. They are on the docs page's Props table.
    container: { table: { disable: true } },
    initialFocus: { table: { disable: true } },
    finalFocus: { table: { disable: true } },
    children: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
  },
  // `icon` holds a key of ICONS; Storybook maps it to the element before render.
  args: { align: "edge", destructive: false, icon: "circle-alert", additionalContent: false },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script. Only the rendered text changes — prop names stay
 * English everywhere. The Arabic is written in Modern Standard Arabic from
 * design/content/, not translated.
 */
const COPY = {
  ltr: {
    trigger: "Delete project",
    cancel: "Cancel",
    safe: {
      title: "Publish these changes?",
      description: "Everyone who visits the site sees the new version straight away. You can edit it again later.",
      action: "Publish",
    },
    danger: {
      title: "Delete this project?",
      description: "The project and all of its files are deleted for everyone on your team. You can't get them back.",
      action: "Delete",
    },
    field: { label: "Type the project name to confirm", placeholder: "Orbit" },
    long: {
      title: "Remove every member who hasn't signed in to this workspace during the last ninety days?",
      description:
        "They lose access to every project, file and comment in the workspace straight away, and any invitations they sent are cancelled. Their work stays where it is, and you can invite any of them again later from the Members page. Billing changes at the start of your next cycle.",
      action: "Remove members",
      cancel: "Keep everyone",
    },
  },
  rtl: {
    trigger: "حذف المشروع",
    cancel: "إلغاء",
    safe: {
      title: "نشر التغييرات الآن؟",
      description: "سيرى كل زوّار الموقع النسخة الجديدة فورًا، ويمكنك تعديلها مرة أخرى لاحقًا.",
      action: "نشر",
    },
    danger: {
      title: "حذف هذا المشروع؟",
      description: "سيُحذف المشروع وجميع ملفاته لكل أعضاء فريقك، ولا يمكن استعادتها بعد ذلك.",
      action: "حذف",
    },
    field: { label: "اكتب اسم المشروع للتأكيد", placeholder: "مدار" },
    long: {
      title: "إزالة كل عضو لم يسجّل الدخول إلى مساحة العمل هذه خلال التسعين يومًا الماضية؟",
      description:
        "سيفقد هؤلاء الأعضاء فورًا الوصول إلى كل المشاريع والملفات والتعليقات في مساحة العمل، وتُلغى الدعوات التي أرسلوها. يبقى عملهم في مكانه، ويمكنك دعوة أي منهم مجددًا من صفحة الأعضاء. يتغيّر مبلغ الاشتراك في بداية دورة الفوترة التالية.",
      action: "إزالة الأعضاء",
      cancel: "إبقاء الجميع",
    },
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

/** A label set in the story's own chrome: English, left to right, small and muted. */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    dir="ltr"
    className={["w-fit self-center whitespace-nowrap text-left font-sans text-xs text-muted-foreground", className].join(" ")}
  >
    {children}
  </span>
)

/**
 * The frame round every story but Default and Interactive. It centres the
 * content in either direction, and scrolls it sideways in the story's own
 * direction when it is wider than the canvas (a phone).
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/** The gap the held dialog keeps from its box on every side: `inset-x-4`, so 16px. */
const GUTTER = 16

/**
 * An alert dialog held open inside its own box: the real component, so it
 * cannot drift from it. The box is a containing block for the dialog's fixed
 * position (its `transform` makes it one), so the overlay fills the box and
 * the dialog sits in it 16px from each edge, the gutter it keeps from a
 * phone's edge. The box is at least the dialog's own height plus that gutter,
 * measured, so a two-line Arabic title gets exactly the room it takes. In a
 * grid row the boxes stretch to the tallest, and each dialog is pinned to the
 * top of its box instead of the middle, so every dialog in a row shares a top
 * edge.
 *
 * It is never a scroll container, so scrolling over it scrolls the page.
 *
 * Held with Base UI's plain Dialog root, not modal, so several stay open on
 * one page without trapping focus, locking scroll or stealing focus on load.
 * Its parts are the same ones Alert Dialog uses; only the role differs
 * (`dialog`). The Interactive story is the real modal.
 */
function Held({ children, className, ...content }: AlertDialogContentProps) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [height, setHeight] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!cell) return
    let observed: Element | null = null
    const resize = new ResizeObserver(([entry]) => {
      const next = Math.ceil(entry!.borderBoxSize[0]!.blockSize) + GUTTER * 2
      setHeight((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    })
    const find = () => {
      const popup = cell.querySelector("[data-slot=alert-dialog-content]")
      if (popup && popup !== observed) {
        if (observed) resize.unobserve(observed)
        observed = popup
        resize.observe(popup)
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

  return (
    <div
      ref={setCell}
      data-held-dialog
      className="relative w-full overflow-hidden rounded-lg [transform:translateZ(0)]"
      style={{ minHeight: height }}
    >
      {cell && (
        <Dialog.Root open modal={false} disablePointerDismissal>
          <AlertDialogContent
            container={cell}
            initialFocus={false}
            finalFocus={false}
            // Pinned to the top of its box, and never a scroll container: the
            // real dialog caps its height and scrolls inside, which here would
            // catch the wheel and stop the page scrolling past the preview.
            className={["top-4 translate-y-0 max-h-none overflow-visible overscroll-auto", className]
              .filter(Boolean)
              .join(" ")}
            {...content}
          >
            {children}
          </AlertDialogContent>
        </Dialog.Root>
      )}
    </div>
  )
}

type Tone = "safe" | "danger" | "long"

/** The text a story's controls set, when they are filled in. */
type Text = { title?: string; description?: string }

/** The parts inside the content, in Figma's order: text, the optional slot, actions. */
function Body({ c, tone, field = false, text: own = {} }: { c: Copy; tone: Tone; field?: boolean; text?: Text }) {
  const text = c[tone]
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{own.title || text.title}</AlertDialogTitle>
        <AlertDialogDescription>{own.description || text.description}</AlertDialogDescription>
      </AlertDialogHeader>
      {field && <Input label={c.field.label} placeholder={c.field.placeholder} />}
      <AlertDialogFooter>
        <AlertDialogCancel>{"cancel" in text ? text.cancel : c.cancel}</AlertDialogCancel>
        <AlertDialogAction>{text.action}</AlertDialogAction>
      </AlertDialogFooter>
    </>
  )
}

/**
 * The playground, held open so every control shows at once. The copy follows
 * `destructive`: a delete when it is on, a publish when it is off.
 */
export const Default: Story = {
  parameters: { layout: "padded" },
  render: ({ additionalContent, title, description, ...args }, ctx) => (
    <div className="mx-auto w-full max-w-[34rem]">
      <Held {...args}>
        <Body
          c={copy(ctx)}
          tone={args.destructive ? "danger" : "safe"}
          field={additionalContent}
          text={{ title, description }}
        />
      </Held>
    </div>
  ),
}

/**
 * The real modal: press the button to open it over the page. Focus moves to
 * Cancel, Tab stays inside, Escape or either button closes it and focus goes
 * back to the button. A press on the overlay does nothing. The controls apply
 * here too.
 */
export const Interactive: Story = {
  render: ({ additionalContent, title, description, ...args }, ctx) => {
    const c = copy(ctx)
    return (
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" tone="destructive" />}>{c.trigger}</AlertDialogTrigger>
        <AlertDialogContent {...args}>
          <Body c={c} tone={args.destructive ? "danger" : "safe"} field={additionalContent} text={{ title, description }} />
        </AlertDialogContent>
      </AlertDialog>
    )
  },
}

const ALIGNS = ["edge", "center"] as const
const DESTRUCTIVE = [false, true] as const

/**
 * Two dialog columns and a label column, sized to fit the Storybook Docs
 * page: the boxes in a row stretch to the same height, so they share a top
 * edge; the labels sit on the middle of their row and never wrap.
 */
const GRID = "grid w-max grid-cols-[max-content_repeat(2,25rem)] items-stretch gap-x-6 gap-y-4"

/** Align × Destructive, one table per Icon setting. */
function Matrix({ c, icon, text }: { c: Copy; icon: AlertDialogContentProps["icon"]; text?: Text }) {
  return (
    <div className={GRID}>
      <span />
      {DESTRUCTIVE.map((destructive) => (
        <Head key={String(destructive)} className="justify-self-center">
          destructive = {String(destructive)}
        </Head>
      ))}
      {ALIGNS.map((align) => (
        <React.Fragment key={align}>
          <Head>{align}</Head>
          {DESTRUCTIVE.map((destructive) => (
            <Held key={String(destructive)} align={align} destructive={destructive} icon={icon}>
              <Body c={c} tone={destructive ? "danger" : "safe"} text={text} />
            </Held>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}

/**
 * Figma's eight variants for the direction on the toolbar: Align down the
 * side, Destructive across the top. Flip the Direction toolbar for the RTL
 * four: the text moves to the right and the actions to the left, with Cancel
 * still first in reading order.
 */
export const AllVariants: Story = {
  decorators: [framed],
  // A fixed table: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => <Matrix c={copy(ctx)} icon={false} />,
}

/**
 * Figma's Icon: circle-alert, 24px, in the title's colour. In `edge` it sits
 * beside the title, centred on its first line (a cell one line tall: 28px in
 * English, 32 in Arabic), and the description lines up with the title, not
 * the icon. In `center` it is centred above the title. 16px away
 * either way.
 */
export const WithIcon: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  // The table varies align and destructive itself, so only the icon and the
  // text are controls here.
  argTypes: {
    align: { table: { disable: true } },
    destructive: { table: { disable: true } },
    additionalContent: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: ({ icon, title, description }, ctx) => <Matrix c={copy(ctx)} icon={icon} text={{ title, description }} />,
}

/**
 * Figma's Additional Content: anything between the header and the footer
 * sits 16px from both, as wide as the text: with an icon in `edge` it lines
 * up with the title, not the icon. Here, a field that asks for the
 * project's name.
 */
export const AdditionalContent: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={GRID}>
        <span />
        {ALIGNS.map((align) => (
          <Head key={align} className="justify-self-center">
            {align}
          </Head>
        ))}
        <Head>destructive</Head>
        {ALIGNS.map((align) => (
          <Held key={align} align={align} destructive icon>
            <Body c={c} tone="danger" field />
          </Held>
        ))}
      </div>
    )
  },
}

/**
 * A long title and a long description wrap inside the 512px box; the text
 * and the actions keep their alignment. Longer button labels stay on one
 * line each, and wrap to a second row only when the pair no longer fits.
 */
export const LongText: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={GRID}>
        <span />
        {ALIGNS.map((align) => (
          <Head key={align} className="justify-self-center">
            {align}
          </Head>
        ))}
        <Head>long text</Head>
        {ALIGNS.map((align) => (
          <Held key={align} align={align} destructive icon>
            <Body c={c} tone="long" />
          </Held>
        ))}
      </div>
    )
  },
}

const DIRECTIONS = ["ltr", "rtl"] as const

/**
 * Both directions at once, whatever the toolbar says: each column sets its
 * own `dir`, `lang` and font, and the dialog takes them from where it is
 * written. In RTL the icon and the text move to the right, the actions to the
 * left, and Arabic sets on Cairo's taller lines (32px for the title, 24 for
 * the description).
 */
export const LtrAndRtl: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className={GRID}>
      <span />
      {DIRECTIONS.map((dir) => (
        <Head key={dir} className="justify-self-center">
          {dir.toUpperCase()}
        </Head>
      ))}
      {ALIGNS.map((align) => (
        <React.Fragment key={align}>
          <Head>{align}</Head>
          {DIRECTIONS.map((dir) => (
            <div key={dir} dir={dir} lang={dir === "rtl" ? "ar" : "en"} className={dir === "rtl" ? "grid font-arabic" : "grid"}>
              <Held align={align} destructive icon>
                <Body c={COPY[dir]} tone="danger" />
              </Held>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark, one panel each, whatever the theme toolbar says. Each panel
 * sets its own theme class, and the held dialogs render inside it, so the
 * overlay shows the token at 60% in Light and 80% in Dark.
 */
export const LightAndDark: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4">
        {THEMES.map((theme) => (
          <div key={theme} className={[theme, "rounded-lg border bg-background p-6 text-foreground"].join(" ")}>
            <Head className="block pb-4">{theme === "dark" ? "Dark" : "Light"}</Head>
            <div className="grid grid-cols-[repeat(2,25rem)] items-stretch gap-x-6">
              <Held icon>
                <Body c={c} tone="safe" />
              </Held>
              <Held align="center" destructive icon>
                <Body c={c} tone="danger" />
              </Held>
            </div>
          </div>
        ))}
      </div>
    )
  },
}
