import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { Dialog as DialogRoot } from "@base-ui/react/dialog"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogContentProps,
  type DialogFooterLayout,
} from "../../../../packages/fasla-ui/registry/ui/dialog"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"
import { Checkbox } from "../../../../packages/fasla-ui/registry/ui/checkbox"
import { Input } from "../../../../packages/fasla-ui/registry/ui/input"
import { Radio } from "../../../../packages/fasla-ui/registry/ui/radio"

/**
 * Figma: "Dialog" (38975:3887), with "Dialog Header" (38975:3913) and
 * "Footer Actions" (38975:3834). Size and the close button are props of
 * `DialogContent`; the Back header type is `onBack` on `DialogHeader`; the
 * footer's layout is `layout` on `DialogFooter`, and its actions are Buttons.
 * Direction is the toolbar. Every story follows the Direction and Theme
 * toolbars, except Light and Dark and LTR and RTL, which show both at once.
 *
 * The dialogs on this page are held open inside their own box so they can be
 * compared side by side. The Interactive story opens a real one over the
 * page.
 */
type HeaderType = "default" | "back"
type Actions = "primary" | "destructive"

type StoryArgs = DialogContentProps & {
  /** Figma's Dialog Header Type: Back adds a back button before the title. */
  headerType: HeaderType
  /** Figma's Description: a line under the title. */
  showDescription: boolean
  /** Figma's Show Footer. */
  showFooter: boolean
  /** Figma's Actions: the main action is Solid Primary or Solid Destructive. */
  actions: Actions
  /** Figma's Horizontal: the actions in a row, or stacked full width. */
  layout: DialogFooterLayout
  /** Figma's Secondary Action: Cancel. */
  secondaryAction: boolean
  /** Figma's 3rd Action: a Ghost action at the start of the row. */
  thirdAction: boolean
  /** The title text. Empty: the sample copy, in the toolbar's language. */
  title?: string
  /** The description text. Empty: the sample copy, in the toolbar's language. */
  description?: string
}

const meta: Meta<StoryArgs> = {
  title: "UI/Dialog",
  component: DialogContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "xl", "2xl"] },
    // Docgen reads no default from the destructured prop, so it is set here.
    showCloseButton: { control: "boolean", table: { defaultValue: { summary: "true" } } },
    headerType: {
      control: "inline-radio",
      options: ["default", "back"],
      description: "Figma's header Type. `back` is `onBack` on `DialogHeader`: a back button before the title.",
      table: { defaultValue: { summary: "default" } },
    },
    showDescription: {
      control: "boolean",
      description: "Whether a `DialogDescription` sits under the title.",
      table: { defaultValue: { summary: "true" } },
    },
    title: {
      control: "text",
      description: "The `DialogTitle` text. Empty: the sample copy, in the toolbar's language.",
    },
    description: {
      control: "text",
      description: "The `DialogDescription` text. Empty: the sample copy, in the toolbar's language.",
    },
    showFooter: {
      control: "boolean",
      description: "Whether a `DialogFooter` closes the dialog.",
      table: { defaultValue: { summary: "true" } },
    },
    actions: {
      control: "inline-radio",
      options: ["primary", "destructive"],
      description: "The main action: a default Button, or `variant=\"destructive\"`.",
      table: { defaultValue: { summary: "primary" } },
    },
    layout: {
      control: "inline-radio",
      options: ["horizontal", "stacked"],
      description: "`layout` on `DialogFooter`: a row at the end, or full-width buttons one under the other.",
      table: { defaultValue: { summary: "horizontal" } },
    },
    secondaryAction: {
      control: "boolean",
      description: "Cancel: an Outline Button in a `DialogClose`.",
      table: { defaultValue: { summary: "true" } },
    },
    thirdAction: {
      control: "boolean",
      description: "A Ghost Button that goes to the start of the row, or under the others when stacked.",
      table: { defaultValue: { summary: "false" } },
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
  args: {
    size: "lg",
    showCloseButton: true,
    headerType: "default",
    showDescription: true,
    showFooter: true,
    actions: "primary",
    layout: "horizontal",
    secondaryAction: true,
    thirdAction: false,
  },
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
    trigger: "Edit profile",
    cancel: "Cancel",
    third: "Save draft",
    profile: {
      title: "Edit profile",
      description: "Make changes to your profile here. Save them when you're done.",
      body: "Your name and photo appear on your comments and in every project you share.",
      action: "Save changes",
      email: "Email address",
      password: "Password",
      confirm: "Confirm password",
      placeholder: "Type here",
      agree: "I agree to the privacy policy and terms",
    },
    danger: {
      title: "Delete this workspace",
      description: "Its projects, files and members are removed for everyone.",
      body: "Type the workspace name below to confirm. Anyone with a link to one of its files will see a page that says it no longer exists.",
      action: "Delete workspace",
    },
    plan: {
      title: "Change your plan",
      description: "The new price starts with your next bill.",
      legend: "Choose a plan",
      action: "Change plan",
      options: [
        { label: "Basic", description: "$20 per month" },
        { label: "Pro", description: "$40 per month" },
        { label: "Advanced", description: "$60 per month" },
      ],
    },
    tour: {
      title: "Welcome to our library",
      description: "Crafting beautiful, modern interfaces, one component at a time.",
      body: "Every component comes in English and Arabic, light and dark, and mirrors on its own in right-to-left pages. The next steps show where to find them and how to add one to your project.",
      skip: "Skip",
      previous: "Previous",
      next: "Next",
    },
    shortcuts: {
      title: "Keyboard shortcuts",
      description: "Work faster without leaving the keyboard.",
      rows: [
        ["Search", "⌘ K"],
        ["New project", "⌘ N"],
        ["Save", "⌘ S"],
        ["Close a dialog", "Esc"],
      ],
    },
    terms: {
      title: "Terms of service",
      description: "Read the terms before you accept them. They take effect today.",
      accept: "Accept",
      decline: "Decline",
      paragraphs: [
        "These terms cover your use of the workspace, the files you keep in it and the people you invite to it. By selecting Accept, you agree to them on behalf of everyone in your organisation.",
        "You own everything you upload. We store it to show it to you and to the people you share it with, and we never sell it or use it to train models without asking first.",
        "You can export your files at any time from the workspace settings. If you close your account, we keep a copy for thirty days, so you can change your mind, and then delete it for good.",
        "We may change these terms when the product changes. We'll tell you by email at least thirty days before a change takes effect, and you can close your account before then if you don't agree.",
        "Billing renews at the start of each cycle. A plan you cancel stays active until the end of the cycle you have already paid for, and we don't refund part of a cycle.",
        "Keep your password to yourself and turn on two-step sign-in. You are responsible for what happens under your account until you tell us it has been compromised.",
        "These terms are governed by the laws of the country where your organisation is registered. If any part of them can't be enforced, the rest still applies.",
      ],
    },
  },
  rtl: {
    trigger: "تعديل الملف الشخصي",
    cancel: "إلغاء",
    third: "حفظ مسودة",
    profile: {
      title: "تعديل الملف الشخصي",
      description: "عدّل بيانات ملفك الشخصي هنا، ثم اختر «حفظ التغييرات» عند الانتهاء.",
      body: "يظهر اسمك وصورتك على تعليقاتك وفي كل مشروع تشاركه.",
      action: "حفظ التغييرات",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirm: "تأكيد كلمة المرور",
      placeholder: "اكتب هنا",
      agree: "أوافق على سياسة الخصوصية والشروط",
    },
    danger: {
      title: "حذف مساحة العمل",
      description: "تُحذف مشاريعها وملفاتها وأعضاؤها لدى الجميع.",
      body: "اكتب اسم مساحة العمل أدناه للتأكيد. ومن يفتح رابطًا لأحد ملفاتها بعد ذلك، سيرى صفحة تخبره أنه لم يعد موجودًا.",
      action: "حذف مساحة العمل",
    },
    plan: {
      title: "تغيير خطتك",
      description: "يبدأ السعر الجديد مع فاتورتك القادمة.",
      legend: "اختر خطة",
      action: "تغيير الخطة",
      options: [
        { label: "أساسية", description: "20 دولارًا شهريًا" },
        { label: "احترافية", description: "40 دولارًا شهريًا" },
        { label: "متقدمة", description: "60 دولارًا شهريًا" },
      ],
    },
    tour: {
      title: "مرحبًا بك في مكتبتنا",
      description: "واجهات جميلة وحديثة، مكوّنًا بعد مكوّن.",
      body: "يأتي كل مكوّن بالعربية والإنجليزية، وبالوضعين الفاتح والداكن، وينعكس وحده في الصفحات العربية. توضّح الخطوات التالية أين تجد المكوّنات وكيف تضيف أحدها إلى مشروعك.",
      skip: "تخطٍّ",
      previous: "السابق",
      next: "التالي",
    },
    shortcuts: {
      title: "اختصارات لوحة المفاتيح",
      description: "أنجز عملك أسرع دون أن تترك لوحة المفاتيح.",
      rows: [
        ["البحث", "⌘ K"],
        ["مشروع جديد", "⌘ N"],
        ["الحفظ", "⌘ S"],
        ["إغلاق النافذة", "Esc"],
      ],
    },
    terms: {
      title: "شروط الخدمة",
      description: "اقرأ الشروط قبل قبولها، فهي تسري من اليوم.",
      accept: "قبول",
      decline: "رفض",
      paragraphs: [
        "تنظّم هذه الشروط استخدامك لمساحة العمل، والملفات التي تحفظها فيها، والأشخاص الذين تدعوهم إليها. وحين تختار «قبول»، فإنك توافق عليها باسم كل من في مؤسستك.",
        "كل ما ترفعه ملك لك. نحفظه لنعرضه لك ولمن تشاركه معهم، ولا نبيعه ولا نستخدمه لتدريب النماذج دون أن نستأذنك أولًا.",
        "يمكنك تصدير ملفاتك في أي وقت من إعدادات مساحة العمل. وإذا أغلقت حسابك، نحتفظ بنسخة منه ثلاثين يومًا حتى تتمكن من التراجع، ثم نحذفها نهائيًا.",
        "قد نغيّر هذه الشروط حين يتغيّر المنتج. وسنخبرك بالبريد الإلكتروني قبل ثلاثين يومًا على الأقل من سريان أي تغيير، ويمكنك إغلاق حسابك قبل ذلك إن لم توافق عليه.",
        "يتجدّد الاشتراك في بداية كل دورة فوترة. وتبقى الخطة التي تلغيها فعّالة حتى نهاية الدورة التي دفعت ثمنها، ولا نردّ ثمن جزء من دورة.",
        "احتفظ بكلمة المرور لنفسك، وفعّل التحقق بخطوتين. وأنت مسؤول عمّا يحدث في حسابك حتى تبلغنا أنه تعرّض للاختراق.",
        "تخضع هذه الشروط لقوانين البلد المسجّلة فيه مؤسستك. وإذا تعذّر تطبيق أي جزء منها، تبقى الأجزاء الأخرى سارية.",
      ],
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
 * The frame round the table stories. It centres the content in either
 * direction, and scrolls it sideways in the story's own direction when it is
 * wider than the canvas (a phone).
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

type HeldProps = DialogContentProps & {
  /**
   * Keep the real height cap and scrolling, measured against the box instead
   * of the window. The box then needs a height of its own (`box`).
   */
  scrolls?: boolean
  /** Classes for the box, such as a fixed height. */
  box?: string
}

/**
 * A dialog held open inside its own box: the real component, so it cannot
 * drift from it. The box is a containing block for the dialog's fixed
 * position (its `transform` makes it one), so the overlay fills the box and
 * the dialog sits in it 16px from each edge, the gutter it keeps from a
 * phone's edge. The box is at least the dialog's own height plus that gutter,
 * measured, so Arabic's taller lines get exactly the room they take. In a
 * grid row the boxes stretch to the tallest, and each dialog is pinned to the
 * top of its box instead of the middle, so every dialog in a row shares a top
 * edge.
 *
 * It is never a scroll container, so scrolling over it scrolls the page —
 * unless `scrolls`, which keeps the dialog's own scrolling inside a box of a
 * set height.
 *
 * Held with Base UI's plain Dialog root, not modal, so several stay open on
 * one page without trapping focus, locking scroll or stealing focus on load.
 * The Interactive story is the real modal.
 */
function Held({ children, className, scrolls = false, box, ...content }: HeldProps) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [height, setHeight] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!cell || scrolls) return
    let observed: Element | null = null
    const resize = new ResizeObserver(([entry]) => {
      const next = Math.ceil(entry!.borderBoxSize[0]!.blockSize) + GUTTER * 2
      setHeight((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    })
    const find = () => {
      const popup = cell.querySelector("[data-slot=dialog-content]")
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
  }, [cell, scrolls])

  return (
    <div
      ref={setCell}
      data-held-dialog
      className={["relative w-full overflow-hidden rounded-lg [transform:translateZ(0)]", box].filter(Boolean).join(" ")}
      style={scrolls ? undefined : { minHeight: height }}
    >
      {cell && (
        <DialogRoot.Root open modal={false} disablePointerDismissal>
          <DialogContent
            container={cell}
            initialFocus={false}
            finalFocus={false}
            // Pinned to the top of its box. Never a scroll container, unless
            // `scrolls`: the real dialog caps its height and scrolls inside,
            // which here would catch the wheel and stop the page scrolling
            // past the preview.
            className={[
              "top-4 translate-y-0",
              scrolls
                ? "max-h-[calc(100%-2rem)]"
                : "max-h-none [&_[data-slot=dialog-scroll]]:overflow-visible",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...content}
          >
            {children}
          </DialogContent>
        </DialogRoot.Root>
      )}
    </div>
  )
}

/** What a story's controls set, when they are filled in. */
type Text = { title?: string; description?: string }

type FooterOptions = {
  actions?: Actions
  layout?: DialogFooterLayout
  secondary?: boolean
  third?: boolean
}

/**
 * Figma's Footer Actions, built from Buttons. In a row the third action comes
 * first, so it goes to the start, then Cancel, then the main action. Stacked,
 * the main action comes first and the third last, top to bottom.
 */
function Actions({
  c,
  action,
  actions = "primary",
  layout = "horizontal",
  secondary = true,
  third = false,
}: FooterOptions & { c: Copy; action: string }) {
  const thirdButton = third && <Button variant="ghost">{c.third}</Button>
  const cancel = secondary && <DialogClose render={<Button variant="outline" />}>{c.cancel}</DialogClose>
  const main = <Button variant={actions === "destructive" ? "destructive" : "default"}>{action}</Button>
  return (
    <DialogFooter layout={layout}>
      {layout === "stacked" ? (
        <>
          {main}
          {cancel}
          {thirdButton}
        </>
      ) : (
        <>
          {thirdButton}
          {cancel}
          {main}
        </>
      )}
    </DialogFooter>
  )
}

/** The profile form, Figma's first example: three fields and a checkbox. */
function ProfileFields({ c }: { c: Copy }) {
  return (
    <div className="grid gap-4">
      <Input label={c.profile.email} type="email" placeholder={c.profile.placeholder} />
      <Input label={c.profile.password} type="password" placeholder={c.profile.placeholder} />
      <Input label={c.profile.confirm} type="password" placeholder={c.profile.placeholder} />
      <Checkbox label={c.profile.agree} />
    </div>
  )
}

/** A short paragraph in the content slot, for the tables. */
const Paragraph = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-muted-foreground">{children}</p>

type SampleOptions = FooterOptions & {
  back?: boolean
  showDescription?: boolean
  showFooter?: boolean
  text?: Text
}

/**
 * One dialog's parts, in Figma's order: header, slot, footer. The copy
 * follows the main action: deleting a workspace when it is destructive,
 * editing a profile otherwise.
 */
function Sample({
  c,
  back = false,
  showDescription = true,
  showFooter = true,
  text = {},
  form = false,
  ...footer
}: SampleOptions & { c: Copy; form?: boolean }) {
  const sample = footer.actions === "destructive" ? c.danger : c.profile
  return (
    <>
      <DialogHeader onBack={back ? () => {} : undefined}>
        <DialogTitle>{text.title || sample.title}</DialogTitle>
        {showDescription && <DialogDescription>{text.description || sample.description}</DialogDescription>}
      </DialogHeader>
      {form ? <ProfileFields c={c} /> : <Paragraph>{sample.body}</Paragraph>}
      {showFooter && <Actions c={c} action={sample.action} {...footer} />}
    </>
  )
}

/** Each Size's box: the dialog's width plus the 16px gutter each side. */
const BOX: Record<NonNullable<DialogContentProps["size"]>, string> = {
  lg: "max-w-[34rem]",
  xl: "max-w-[44rem]",
  "2xl": "max-w-[73.75rem]",
}

/**
 * The playground, held open so every control shows at once. The copy follows
 * the main action: a delete when it is destructive, a profile form otherwise.
 */
export const Default: Story = {
  parameters: { layout: "padded" },
  render: (
    { headerType, showDescription, showFooter, actions, layout, secondaryAction, thirdAction, title, description, ...args },
    ctx
  ) => (
    <div className={["mx-auto w-full", BOX[args.size ?? "lg"]].join(" ")}>
      <Held {...args}>
        <Sample
          c={copy(ctx)}
          back={headerType === "back"}
          showDescription={showDescription}
          showFooter={showFooter}
          actions={actions}
          layout={layout}
          secondary={secondaryAction}
          third={thirdAction}
          text={{ title, description }}
          form={actions !== "destructive"}
        />
      </Held>
    </div>
  ),
}

/**
 * The real modal: press the button to open it over the page. Focus moves to
 * the first field, Tab stays inside, Escape, the ×, Cancel or a press on the
 * overlay closes it, and focus goes back to the button. The controls apply
 * here too.
 */
export const Interactive: Story = {
  render: (
    { headerType, showDescription, showFooter, actions, layout, secondaryAction, thirdAction, title, description, ...args },
    ctx
  ) => {
    const c = copy(ctx)
    return (
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>{c.trigger}</DialogTrigger>
        <DialogContent {...args}>
          <Sample
            c={c}
            back={headerType === "back"}
            showDescription={showDescription}
            showFooter={showFooter}
            actions={actions}
            layout={layout}
            secondary={secondaryAction}
            third={thirdAction}
            text={{ title, description }}
            form={actions !== "destructive"}
          />
        </DialogContent>
      </Dialog>
    )
  },
}

const SIZES = [
  ["lg", "L · 512px"],
  ["xl", "XL · 672px"],
  ["2xl", "2XL · 1148px"],
] as const

/**
 * Figma's three widths: L 512px, XL 672px and 2XL 1148px. Every size has the
 * same parts, padding and gaps; only the width changes. Like a narrow window,
 * a box narrower than 2XL's 1148px (this page, on most screens) holds it 16px
 * from each edge.
 */
export const Sizes: Story = {
  // A fixed table: none of the controls would change it.
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-full grid-cols-[max-content_minmax(0,1fr)] items-stretch gap-x-6 gap-y-4">
        {SIZES.map(([size, label]) => (
          <React.Fragment key={size}>
            <Head>{label}</Head>
            <div className={["grid w-full justify-self-center", BOX[size]].join(" ")}>
              <Held size={size}>
                <Sample c={c} />
              </Held>
            </div>
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Two dialog columns and a label column, sized to fit the Storybook Docs
 * page: the boxes in a row stretch to the same height, so they share a top
 * edge; the labels sit on the middle of their row and never wrap.
 */
const GRID = "grid w-max grid-cols-[max-content_repeat(2,25rem)] items-stretch gap-x-6 gap-y-4"

const HEADER_TYPES = ["default", "back"] as const

const HEADER_ROWS = [
  { label: "title", props: { showDescription: false }, close: true },
  { label: "title + description", props: { showDescription: true }, close: true },
  { label: "no close button", props: { showDescription: true }, close: false },
] as const

/**
 * Figma's Dialog Header: Type Default and Back across the top, Description
 * and Close down the side. The back chevron sits at the start, centred on the
 * title's first line and 4px from it, and the description lines up with the
 * title. The × sits on the same line at the end. Flip the Direction toolbar
 * and both mirror; the chevron points the other way.
 */
export const HeaderTypes: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={GRID}>
        <span />
        {HEADER_TYPES.map((type) => (
          <Head key={type} className="justify-self-center">
            {type}
          </Head>
        ))}
        {HEADER_ROWS.map(({ label, props, close }) => (
          <React.Fragment key={label}>
            <Head>{label}</Head>
            {HEADER_TYPES.map((type) => (
              <Held key={type} showCloseButton={close}>
                <Sample c={c} back={type === "back"} {...props} />
              </Held>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

const LAYOUTS = ["horizontal", "stacked"] as const

const FOOTER_ROWS = [
  { label: "primary", footer: { actions: "primary" } },
  { label: "destructive", footer: { actions: "destructive" } },
  { label: "main action only", footer: { actions: "primary", secondary: false } },
  { label: "third action", footer: { actions: "primary", third: true } },
] as const

/**
 * Figma's Footer Actions: Horizontal across the top; Actions, Secondary
 * Action and 3rd Action down the side. In a row the actions sit at the end,
 * 8px apart, and a third goes to the start. Stacked, each is full width with
 * the main action on top. All of them are Button md.
 */
export const FooterActions: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className={GRID}>
        <span />
        {LAYOUTS.map((layout) => (
          <Head key={layout} className="justify-self-center">
            {layout}
          </Head>
        ))}
        {FOOTER_ROWS.map(({ label, footer }) => (
          <React.Fragment key={label}>
            <Head>{label}</Head>
            {LAYOUTS.map((layout) => (
              <Held key={layout}>
                <Sample c={c} showDescription={false} layout={layout} {...footer} />
              </Held>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/** Figma's Change your plan example: three plans as Radio cards and stacked actions. */
function PlanDialog({ c }: { c: Copy }) {
  const name = React.useId()
  return (
    <>
      <DialogHeader>
        <DialogTitle>{c.plan.title}</DialogTitle>
        <DialogDescription>{c.plan.description}</DialogDescription>
      </DialogHeader>
      <fieldset className="grid gap-3">
        <legend className="mb-3 text-sm font-medium">{c.plan.legend}</legend>
        {c.plan.options.map((option, index) => (
          <Radio
            key={option.label}
            variant="layout"
            name={name}
            label={option.label}
            description={option.description}
            defaultChecked={index === 1}
          />
        ))}
      </fieldset>
      <DialogFooter layout="stacked">
        <Button>{c.plan.action}</Button>
        <DialogClose render={<Button variant="outline" />}>{c.cancel}</DialogClose>
      </DialogFooter>
    </>
  )
}

/** Figma's Welcome example: no close button, and Skip, Previous and Next in the row. */
function TourDialog({ c }: { c: Copy }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{c.tour.title}</DialogTitle>
        <DialogDescription>{c.tour.description}</DialogDescription>
      </DialogHeader>
      <Paragraph>{c.tour.body}</Paragraph>
      <DialogFooter>
        <DialogClose render={<Button variant="ghost" />}>{c.tour.skip}</DialogClose>
        <Button variant="outline">
          <ArrowLeftIcon aria-hidden="true" strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />
          {c.tour.previous}
        </Button>
        <Button>
          {c.tour.next}
          <ArrowRightIcon aria-hidden="true" strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />
        </Button>
      </DialogFooter>
    </>
  )
}

/** Figma's Show Footer off: a dialog to read, closed with the ×. */
function ShortcutsDialog({ c }: { c: Copy }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{c.shortcuts.title}</DialogTitle>
        <DialogDescription>{c.shortcuts.description}</DialogDescription>
      </DialogHeader>
      <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 text-sm">
        {c.shortcuts.rows.map(([action, keys]) => (
          <React.Fragment key={action}>
            <dt>{action}</dt>
            <dd dir="ltr">
              <kbd className="rounded-sm border border-border px-1.5 py-0.5 font-sans text-xs">{keys}</kbd>
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </>
  )
}

/**
 * Figma's examples, filled with real content: a form with one full-width
 * action, plans to choose from, a tour step with a third action and no close
 * button, and a dialog with no footer at all.
 */
export const Examples: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max grid-cols-[repeat(2,25rem)] items-stretch gap-x-6 gap-y-4">
        <Held>
          <DialogHeader>
            <DialogTitle>{c.profile.title}</DialogTitle>
            <DialogDescription>{c.profile.description}</DialogDescription>
          </DialogHeader>
          <ProfileFields c={c} />
          <DialogFooter layout="stacked">
            <Button>{c.profile.action}</Button>
          </DialogFooter>
        </Held>
        <Held>
          <PlanDialog c={c} />
        </Held>
        <Held showCloseButton={false}>
          <TourDialog c={c} />
        </Held>
        <Held>
          <ShortcutsDialog c={c} />
        </Held>
      </div>
    )
  },
}

/**
 * Content taller than the window: the header and the footer stay where they
 * are and only what sits between them scrolls. Here the box stands in for
 * the window, 30rem tall; scroll inside the dialog to read on. Open the
 * Interactive story in a short window to see the real one.
 */
export const LongContent: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="mx-auto w-full max-w-[34rem]">
        <Held scrolls box="h-[30rem]">
          <DialogHeader>
            <DialogTitle>{c.terms.title}</DialogTitle>
            <DialogDescription>{c.terms.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 text-sm">
            {c.terms.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>{c.terms.decline}</DialogClose>
            <Button>{c.terms.accept}</Button>
          </DialogFooter>
        </Held>
      </div>
    )
  },
}

const DIRECTIONS = ["ltr", "rtl"] as const

/**
 * Both directions at once, whatever the toolbar says: each column sets its
 * own `dir`, `lang` and font, and the dialog takes them from where it is
 * written. In RTL the title and the back chevron move to the right and turn
 * round, the × goes to the left, the actions to the left with the third on
 * the right, and Arabic sets on Cairo's taller lines.
 */
export const LtrAndRtl: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className={GRID}>
      <span />
      {DIRECTIONS.map((dir) => (
        <Head key={dir} className="justify-self-center">
          {dir.toUpperCase()}
        </Head>
      ))}
      {HEADER_TYPES.map((type) => (
        <React.Fragment key={type}>
          <Head>{type}</Head>
          {DIRECTIONS.map((dir) => (
            <div key={dir} dir={dir} lang={dir === "rtl" ? "ar" : "en"} className={dir === "rtl" ? "grid font-arabic" : "grid"}>
              <Held>
                <Sample c={COPY[dir]} back={type === "back"} third={type === "back"} />
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
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4">
        {THEMES.map((theme) => (
          <div key={theme} className={[theme, "rounded-lg border bg-background p-6 text-foreground"].join(" ")}>
            <Head className="block pb-4">{theme === "dark" ? "Dark" : "Light"}</Head>
            <div className="grid grid-cols-[repeat(2,25rem)] items-stretch gap-x-6">
              <Held>
                <Sample c={c} back third />
              </Held>
              <Held>
                <Sample c={c} actions="destructive" layout="stacked" />
              </Held>
            </div>
          </div>
        ))}
      </div>
    )
  },
}
