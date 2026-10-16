import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { Dialog } from "@base-ui/react/dialog"
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetContentProps,
  type SheetSide,
} from "../../../../packages/fasla-ui/registry/ui/sheet"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"
import { Input } from "../../../../packages/fasla-ui/registry/ui/input"

/**
 * Figma: "Sheet" (15043:262710). Side is a prop of `SheetContent`; Direction
 * is the toolbar. Every story follows the Direction and Theme toolbars,
 * except Light and Dark and LTR and RTL, which show both at once.
 *
 * The sheets on this page are held open inside their own box so they can be
 * compared side by side. The Interactive story opens a real one over the
 * page.
 */
type StoryArgs = SheetContentProps & {
  /** The title text. Empty: the sample copy, in the toolbar's language. */
  title?: string
  /** The description text. Empty: the sample copy, in the toolbar's language. */
  description?: string
}

const SIDES = ["end", "start", "top", "bottom"] as const satisfies readonly SheetSide[]

const meta: Meta<StoryArgs> = {
  title: "UI/Sheet",
  component: SheetContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    side: { control: "inline-radio", options: SIDES },
    showCloseButton: { control: "boolean", table: { defaultValue: { summary: "true" } } },
    title: {
      control: "text",
      description: "The `SheetTitle` text. Empty: the sample copy, in the toolbar's language.",
    },
    description: {
      control: "text",
      description: "The `SheetDescription` text. Empty: the sample copy, in the toolbar's language.",
    },
    className: { control: "text" },
    // Behaviour and Base UI's own escape hatches: they change nothing in the
    // preview. They are on the docs page's Props table.
    closeLabel: { table: { disable: true } },
    container: { table: { disable: true } },
    initialFocus: { table: { disable: true } },
    finalFocus: { table: { disable: true } },
    children: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
  },
  args: { side: "end", showCloseButton: true },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script. Only the rendered text changes — prop names stay
 * English everywhere. The Arabic is Figma's own RTL copy, in Modern Standard
 * Arabic; the demo person transliterates.
 */
const COPY = {
  ltr: {
    trigger: "Edit profile",
    title: "Edit profile",
    description: "Make changes to your profile here. Click save when you're done.",
    name: { label: "Name", value: "Nadia Rahman" },
    username: { label: "Username", value: "nadia.rahman" },
    save: "Save changes",
    cancel: "Cancel",
    long: {
      title: "Review the notification settings for every workspace you belong to before the weekly summary goes out",
      description: "Changes apply from the next summary. You can come back to this at any time.",
    },
    more: {
      label: "About",
      text: "Product designer on the payments team, working across web and mobile. Previously led the design system at a logistics start-up, and before that ran a small studio for six years. Writes about interface type, right-to-left layout and the craft of design reviews. Based in Amman, working with teams in Riyadh, Cairo and Dubai.",
    },
  },
  rtl: {
    trigger: "تعديل الملف الشخصي",
    title: "تعديل الملف الشخصي",
    description: "قم بإجراء تغييرات على ملفك الشخصي هنا. انقر حفظ عند الانتهاء.",
    name: { label: "الاسم", value: "نادية رحمن" },
    username: { label: "اسم المستخدم", value: "nadia.rahman" },
    save: "حفظ التغييرات",
    cancel: "إلغاء",
    long: {
      title: "راجع إعدادات الإشعارات في كل مساحة عمل تنتمي إليها قبل إرسال الملخّص الأسبوعي",
      description: "تُطبَّق التغييرات بدءًا من الملخّص التالي، ويمكنك العودة إليها في أي وقت.",
    },
    more: {
      label: "نبذة",
      text: "مصمّمة منتجات في فريق المدفوعات، تعمل على الويب والهاتف. قادت سابقًا نظام التصميم في شركة ناشئة للخدمات اللوجستية، وأدارت قبل ذلك استوديو صغيرًا لست سنوات. تكتب عن خطوط الواجهات وتخطيط الواجهات من اليمين إلى اليسار وأصول مراجعة التصميم. تقيم في عمّان، وتعمل مع فرق في الرياض والقاهرة ودبي.",
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

/**
 * A sheet held open inside its own box: the real component, so it cannot
 * drift from it. The box is a containing block for the sheet's fixed
 * position (its `transform` makes it one), so the overlay fills the box and
 * the sheet slides from the box's edge as it would from the window's: Start
 * and End take its full height, Top and Bottom its full width.
 *
 * Held with Base UI's plain Dialog root, not modal, so several stay open on
 * one page without trapping focus, locking scroll or stealing focus on load.
 * The Interactive story is the real modal.
 */
function Held({
  children,
  className,
  box = "h-[32rem]",
  ...content
}: SheetContentProps & { box?: string }) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  return (
    <div
      ref={setCell}
      data-held-sheet
      className={["relative w-full overflow-hidden rounded-lg border [transform:translateZ(0)]", box].join(" ")}
    >
      {cell && (
        <Dialog.Root open modal={false} disablePointerDismissal>
          <SheetContent container={cell} initialFocus={false} finalFocus={false} className={className} {...content}>
            {children}
          </SheetContent>
        </Dialog.Root>
      )}
    </div>
  )
}

/** The text a story's controls set, when they are filled in. */
type Text = { title?: string; description?: string }

/**
 * The parts inside the sheet, in Figma's order: the header, the content
 * area (16px from the sheet's edges, as Figma's Body), then the footer with
 * the main action first.
 */
function Body({ c, text = {}, long = false }: { c: Copy; text?: Text; long?: boolean }) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>{text.title || c.title}</SheetTitle>
        <SheetDescription>{text.description || c.description}</SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 px-4">
        <Input label={c.name.label} defaultValue={c.name.value} />
        <Input label={c.username.label} defaultValue={c.username.value} />
        {long && (
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">{c.more.label}</h3>
            <p>{c.more.text}</p>
            <p>{c.more.text}</p>
            <p>{c.more.text}</p>
          </div>
        )}
      </div>
      <SheetFooter>
        <Button>{c.save}</Button>
        <SheetClose render={<Button variant="outline" tone="primary" />}>{c.cancel}</SheetClose>
      </SheetFooter>
    </>
  )
}

/** The playground, held open so every control shows at once. */
export const Default: Story = {
  parameters: { layout: "padded" },
  render: ({ title, description, ...args }, ctx) => (
    <div className="mx-auto w-full max-w-[56rem]">
      <Held {...args}>
        <Body c={copy(ctx)} text={{ title, description }} />
      </Held>
    </div>
  ),
}

/**
 * The real modal: press the button to open it over the page. It slides in
 * from its side (End: the right in English, the left in Arabic), focus moves
 * to the first field, Tab stays inside, and Escape, the ×, Cancel or a press
 * on the overlay closes it, with focus going back to the button. The
 * controls apply here too.
 */
export const Interactive: Story = {
  render: ({ title, description, ...args }, ctx) => {
    const c = copy(ctx)
    return (
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>{c.trigger}</SheetTrigger>
        <SheetContent {...args}>
          <Body c={c} text={{ title, description }} />
        </SheetContent>
      </Sheet>
    )
  },
}

/**
 * Two held sheets per row, sized to fit the Storybook Docs page; each one's
 * caption sits above it, and the boxes in a row share a top edge.
 */
const PAIRS = "grid w-max grid-cols-[repeat(2,27.25rem)] gap-x-6 gap-y-2"

/**
 * Figma's four sides for the direction on the toolbar. End and Start are
 * 384px wide and as tall as the box; Top and Bottom are as wide as the box
 * and as tall as their content. Flip the Direction toolbar and End moves to
 * the left, Start to the right.
 */
export const AllSides: Story = {
  decorators: [framed],
  // A fixed table: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={PAIRS}>
        {[SIDES.slice(0, 2), SIDES.slice(2)].map((row) => (
          <React.Fragment key={row.join()}>
            {row.map((side) => (
              <Head key={side} className="justify-self-center">
                side = {side}
              </Head>
            ))}
            {row.map((side) => (
              <Held key={side} side={side}>
                <Body c={c} />
              </Held>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * A long title wraps inside the header's 48px end padding, so it never runs
 * under the close button, which stays on the title's first line. The
 * description and everything under it move down to make room.
 */
export const LongTitle: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={PAIRS}>
        {(["end", "top"] as const).map((side) => (
          <Head key={side} className="justify-self-center">
            side = {side}
          </Head>
        ))}
        {(["end", "top"] as const).map((side) => (
          <Held key={side} side={side} box="h-[36rem]">
            <Body c={c} text={c.long} />
          </Held>
        ))}
      </div>
    )
  },
}

/**
 * More content than fits: the header and the footer stay where they are and
 * only the content between them scrolls. Top and Bottom stop 48px short of
 * the box and scroll the same way.
 */
export const ScrollingBody: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={PAIRS}>
        {(["end", "bottom"] as const).map((side) => (
          <Head key={side} className="justify-self-center">
            side = {side}
          </Head>
        ))}
        {(["end", "bottom"] as const).map((side) => (
          <Held key={side} side={side}>
            <Body c={c} long />
          </Held>
        ))}
      </div>
    )
  },
}

const DIRECTIONS = ["ltr", "rtl"] as const

/**
 * Both directions at once, whatever the toolbar says: each column sets its
 * own `dir`, `lang` and font, and the sheet takes them from where it is
 * written. End is on the right in LTR and on the left in RTL, Start the
 * other way round; the close button follows the end edge, and Arabic sets on
 * Cairo's taller lines (40px for the title).
 */
export const LtrAndRtl: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid w-max grid-cols-[max-content_repeat(2,27.25rem)] gap-x-6 gap-y-4">
      <span />
      {DIRECTIONS.map((dir) => (
        <Head key={dir} className="justify-self-center">
          {dir.toUpperCase()}
        </Head>
      ))}
      {SIDES.map((side) => (
        <React.Fragment key={side}>
          <Head>{side}</Head>
          {DIRECTIONS.map((dir) => (
            <div key={dir} dir={dir} lang={dir === "rtl" ? "ar" : "en"} className={dir === "rtl" ? "grid font-arabic" : "grid"}>
              <Held side={side}>
                <Body c={COPY[dir]} />
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
 * sets its own theme class, and the held sheets render inside it, so the
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
            <div className="grid grid-cols-[repeat(2,27.25rem)] gap-x-6">
              <Held side="end">
                <Body c={c} />
              </Held>
              <Held side="bottom">
                <Body c={c} />
              </Held>
            </div>
          </div>
        ))}
      </div>
    )
  },
}
