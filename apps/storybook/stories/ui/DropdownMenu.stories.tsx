import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import {
  CircleHelpIcon,
  DollarSignIcon,
  PencilLineIcon,
  ReceiptIcon,
  SettingsIcon,
  ShareIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  type DropdownMenuContentProps,
} from "../../../../packages/fasla-ui/registry/ui/dropdown-menu"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"
import { Avatar } from "../../../../packages/fasla-ui/registry/ui/avatar"
import { cn } from "../../../../packages/fasla-ui/src/lib/utils"

/**
 * Figma: "Dropdown" (3969:51446), with "Dropdown Item" (46229:3337),
 * "Dropdown Label" and "Dropdown Separator" on the same page. The set's
 * Variants are compositions of the parts, so each core one is a story here,
 * under a short name: Basic Dropdown is Basic, Avatar Heading is With Avatar,
 * Dropdown Item with icon is With Icons, Mini icon is Icon Actions,
 * DropdownItem with Switch is With Switches, Dropdown Checkboxes is
 * Checkboxes and Dropdown Radio Group is Radio Group. Chat list, Contact List
 * and Today's meetings are block-like examples and come later. Every story
 * follows the Direction and Theme toolbars, except Light And Dark and
 * Directions, which show both at once.
 *
 * The look lives on `DropdownMenuContent`, so the Controls panel drives it.
 * `open` is the story's own control, so every change shows at once.
 */
type StoryArgs = DropdownMenuContentProps & { open: boolean }

const meta: Meta<StoryArgs> = {
  title: "UI/Dropdown Menu",
  component: DropdownMenuContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    // Above or below: the two sides this preview makes room for. Every side,
    // with the logical `inline-start` and `inline-end`, is on the docs page.
    side: { control: "inline-radio", options: ["bottom", "top"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    // Docgen reads this default as 0; the component's is 4.
    sideOffset: { control: { type: "number", min: 0, step: 1 }, table: { defaultValue: { summary: "4" } } },
    className: { control: "text" },
    // The story's own control, in the same table as the rest.
    open: {
      control: "boolean",
      description: "Keeps the menu open. Turn it off to open it with the button.",
    },
    // Base UI's own escape hatches, not props a reader drives here. They are
    // on the docs page's Props table.
    alignOffset: { table: { disable: true } },
    collisionAvoidance: { table: { disable: true } },
    container: { table: { disable: true } },
    children: { table: { disable: true } },
    style: { table: { disable: true } },
    render: { table: { disable: true } },
    finalFocus: { table: { disable: true } },
  },
  args: { open: true, side: "bottom", align: "start", sideOffset: 4, className: "w-[282px]" },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script: Figma's own, from the LTR and RTL variants. Only
 * the rendered text changes — prop names stay English everywhere.
 */
const COPY = {
  ltr: {
    open: "Open menu",
    myAccount: "My account",
    profile: "Profile",
    billing: "Billing",
    inviteUsers: "Invite users",
    email: "Email",
    message: "Message",
    github: "GitHub",
    support: "Support",
    api: "API",
    name: "Phillip George",
    userProfile: "User Profile",
    settings: "Settings",
    billingPlans: "Billing Plans",
    pricing: "Pricing",
    faq: "FAQ",
    edit: "Edit",
    share: "Share",
    delete: "Delete",
    appsNotification: "Apps notification",
    apps: ["Google", "X", "Linkedin", "Dribbble", "Figma"],
    statusBar: "Status bar",
    panelPosition: "Panel Position",
    top: "Top",
    bottom: "Bottom",
    right: "Right",
    stateDefault: "Default",
    stateHighlighted: "Highlighted",
    stateDisabled: "Disabled",
    stateDestructive: "Destructive",
  },
  rtl: {
    open: "فتح القائمة",
    myAccount: "حسابي",
    profile: "الملف الشخصي",
    billing: "الفوترة",
    inviteUsers: "دعوة المستخدمين",
    email: "البريد الإلكتروني",
    message: "رسالة",
    github: "جيت هاب",
    support: "الدعم",
    api: "واجهة البرمجة",
    name: "فيليب جورج",
    userProfile: "ملف المستخدم",
    settings: "الإعدادات",
    billingPlans: "خطط الفوترة",
    pricing: "الأسعار",
    faq: "الأسئلة الشائعة",
    edit: "تعديل",
    share: "مشاركة",
    delete: "حذف",
    appsNotification: "إشعارات التطبيقات",
    apps: ["جوجل", "إكس", "لينكد إن", "دريبل", "فيجما"],
    statusBar: "شريط الحالة",
    panelPosition: "موضع اللوحة",
    top: "أعلى",
    bottom: "أسفل",
    right: "يمين",
    stateDefault: "افتراضي",
    stateHighlighted: "مُبرَز",
    stateDisabled: "معطّل",
    stateDestructive: "إجراء حذف",
  },
}

type Copy = (typeof COPY)["ltr"]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const EMAIL = "phillip@example.com"
const PHOTO = "/samples/avatar-portrait.png"
const DIRECTIONS = ["ltr", "rtl"] as const
const THEMES = ["light", "dark"] as const
const title = (s: string) => s[0]!.toUpperCase() + s.slice(1)

/**
 * Figma draws one row of most variants in its Hover state. Here it is drawn
 * with the same classes Base UI's `data-highlighted` turns on, so it shows
 * without a pointer; the pointer and the arrow keys still highlight any row.
 */
const FIGMA_HOVER = "bg-accent text-accent-foreground"

/** A column header: English and left-to-right in both directions. It never wraps. */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={cn("w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className)}>
    {children}
  </span>
)

/**
 * The frame round every story but Default. It centres the content in either
 * direction, and scrolls it sideways in the story's own direction when it is
 * wider than the canvas (a phone). 4px of padding keeps a focus halo at the
 * edge clear of the clip.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

const JUSTIFY = { start: "justify-start", center: "justify-center", end: "justify-end" } as const

type HeldProps = Pick<DropdownMenuContentProps, "side" | "align" | "sideOffset" | "className"> & {
  trigger: React.ReactNode
  children: React.ReactNode
}

/**
 * A menu held open under (or over) its trigger, with exactly the room it takes
 * reserved in its cell. The menu is portalled into the cell, so it scrolls and
 * clips with the story and takes a themed panel's tokens.
 *
 * The room is worked out from the menu's own size, never from positions: its
 * content height (`scrollHeight`, which its window-height cap does not
 * shorten) plus its 1px borders and the offset, and its width. The cell is at
 * least as wide as the menu, and the trigger sits at the cell's start, centre
 * or end to match `align`, so the menu never hangs out of the cell. The room
 * changes only when it is more than a pixel off. The menu never flips, and the
 * page stays live (`modal={false}`), so several can be open at once.
 */
function Held({ trigger, side = "bottom", align = "start", sideOffset = 4, className, children }: HeldProps) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [room, setRoom] = React.useState({ block: 0, inline: 0 })

  React.useLayoutEffect(() => {
    if (!cell) return
    let observed: HTMLElement | null = null
    const measure = () => {
      if (!observed) return
      const next = { block: Math.ceil(observed.scrollHeight + 2) + sideOffset, inline: Math.ceil(observed.offsetWidth) }
      setRoom((prev) =>
        Math.abs(prev.block - next.block) > 1 || Math.abs(prev.inline - next.inline) > 1 ? next : prev
      )
    }
    const resize = new ResizeObserver(measure)
    const find = () => {
      const popup = cell.querySelector<HTMLElement>("[data-slot=dropdown-menu-content]")
      if (popup && popup !== observed) {
        if (observed) resize.unobserve(observed)
        observed = popup
        resize.observe(popup)
        measure()
      }
    }
    const mutations = new MutationObserver(find)
    mutations.observe(cell, { childList: true, subtree: true })
    find()
    return () => {
      mutations.disconnect()
      resize.disconnect()
    }
  }, [cell, sideOffset])

  // The trigger has not moved, but Base UI misses a change caused by a
  // parent's padding; a resize makes it measure and place the menu again.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")))
    return () => cancelAnimationFrame(frame)
  }, [room])

  return (
    <div
      ref={setCell}
      className={cn("relative flex", side === "top" ? "items-end" : "items-start", JUSTIFY[align])}
      style={{ [side === "top" ? "paddingTop" : "paddingBottom"]: room.block, minWidth: room.inline }}
    >
      {cell && (
        <DropdownMenu open modal={false}>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>{trigger}</DropdownMenuTrigger>
          <DropdownMenuContent
            container={cell}
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionAvoidance={{ side: "none", align: "none" }}
            // `w-max` first: a menu with no width of its own lays out at its
            // rows' width, not squeezed into the cell before the room is set.
            className={cn("w-max", className)}
          >
            {children}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

/** Figma's Basic Dropdown rows, shared by the playground, Basic and the both-at-once stories. */
const basicRows = (c: Copy, { shortcuts = false } = {}) => (
  <>
    <DropdownMenuLabel>{c.myAccount}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      {c.profile}
      {shortcuts && <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>}
    </DropdownMenuItem>
    <DropdownMenuItem className={FIGMA_HOVER}>
      {c.billing}
      {shortcuts && <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>}
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{c.inviteUsers}</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>{c.email}</DropdownMenuItem>
        <DropdownMenuItem>{c.message}</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuItem>{c.github}</DropdownMenuItem>
    <DropdownMenuItem>{c.support}</DropdownMenuItem>
    <DropdownMenuItem disabled>{c.api}</DropdownMenuItem>
  </>
)

/** Figma's Mini icon rows: two actions and a destructive one. */
const iconActionRows = (c: Copy) => (
  <>
    <DropdownMenuItem icon={<PencilLineIcon strokeWidth={1.5} />}>{c.edit}</DropdownMenuItem>
    <DropdownMenuItem icon={<ShareIcon strokeWidth={1.5} />}>{c.share}</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" icon={<Trash2Icon strokeWidth={1.5} />}>
      {c.delete}
    </DropdownMenuItem>
  </>
)

/** Figma's DropdownItem with Switch rows. */
const switchRows = (c: Copy) => (
  <DropdownMenuGroup>
    <DropdownMenuLabel>{c.appsNotification}</DropdownMenuLabel>
    {c.apps.map((app, i) => (
      <DropdownMenuCheckboxItem key={app} indicator="switch" defaultChecked={i === 0 || i === 4}>
        {app}
      </DropdownMenuCheckboxItem>
    ))}
  </DropdownMenuGroup>
)

/** Figma's Dropdown Radio Group rows. */
const radioRows = (c: Copy) => (
  <DropdownMenuRadioGroup defaultValue="top">
    <DropdownMenuLabel>{c.panelPosition}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuRadioItem value="top">{c.top}</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="bottom">{c.bottom}</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="right" className={FIGMA_HOVER}>
      {c.right}
    </DropdownMenuRadioItem>
  </DropdownMenuRadioGroup>
)

/**
 * The playground: Figma's Basic Dropdown, in the toolbars' direction and
 * theme. The Controls panel drives the menu's side, alignment, offset and
 * classes. Turn `open` off to open it with the button.
 */
export const Default: Story = {
  render: ({ open, side, align, sideOffset, className }, ctx) => {
    const c = copy(ctx)
    if (!open) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>{c.open}</DropdownMenuTrigger>
          <DropdownMenuContent side={side} align={align} sideOffset={sideOffset} className={className}>
            {basicRows(c)}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    return (
      // A new key per side: the room moves from one edge of the cell to the other.
      <Held key={side} trigger={c.open} side={side} align={align} sideOffset={sideOffset} className={className}>
        {basicRows(c)}
      </Held>
    )
  },
}

/**
 * Figma's Basic Dropdown: a label, separators, rows, a submenu and a disabled
 * row. Point at Invite users, or move to it and press the arrow that points
 * into it, to open its submenu; its chevron points to the side it opens on.
 */
export const Basic: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => (
    <Held trigger={copy(ctx).open} className="w-[282px]">
      {basicRows(copy(ctx))}
    </Held>
  ),
}

/**
 * Figma's Avatar Heading: the label holds our Avatar at size 32, Rounded,
 * with a name and an email.
 */
export const WithAvatar: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Held trigger={c.open} className="w-[282px]">
        <DropdownMenuLabel className="py-1.5 font-normal">
          {/* Decorative: the name is printed beside it. An empty name gives the image an empty alt, as in Tooltip. */}
          <Avatar src={PHOTO} name="" size="32" radius="rounded" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-semibold">{c.name}</span>
            <span className="truncate text-xs text-muted-foreground">{EMAIL}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{c.profile}</DropdownMenuItem>
        <DropdownMenuItem className={FIGMA_HOVER}>{c.billing}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>{c.inviteUsers}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>{c.email}</DropdownMenuItem>
            <DropdownMenuItem>{c.message}</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>{c.github}</DropdownMenuItem>
        <DropdownMenuItem>{c.support}</DropdownMenuItem>
        <DropdownMenuItem disabled>{c.api}</DropdownMenuItem>
      </Held>
    )
  },
}

/** Figma's Dropdown Item with icon: a 16px icon before each row's text, in `foreground`. */
export const WithIcons: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Held trigger={c.open} className="w-[297px]">
        <DropdownMenuLabel>{c.userProfile}</DropdownMenuLabel>
        <DropdownMenuItem icon={<UserIcon strokeWidth={1.5} />}>{c.profile}</DropdownMenuItem>
        <DropdownMenuItem icon={<SettingsIcon strokeWidth={1.5} />} className={FIGMA_HOVER}>
          {c.settings}
        </DropdownMenuItem>
        <DropdownMenuItem icon={<ReceiptIcon strokeWidth={1.5} />}>{c.billingPlans}</DropdownMenuItem>
        <DropdownMenuItem icon={<DollarSignIcon strokeWidth={1.5} />}>{c.pricing}</DropdownMenuItem>
        <DropdownMenuItem icon={<CircleHelpIcon strokeWidth={1.5} />}>{c.faq}</DropdownMenuItem>
      </Held>
    )
  },
}

/**
 * Figma's Mini icon: a short menu of actions, the last one destructive. A
 * destructive row's text and icon are both `destructive`, as Figma draws
 * them.
 */
export const IconActions: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => (
    <Held trigger={copy(ctx).open} className="w-[134px]">
      {iconActionRows(copy(ctx))}
    </Held>
  ),
}

/**
 * Figma's DropdownItem with Switch: checkbox rows with `indicator="switch"`.
 * Our Switch sits at the end of the row, Solid when on and Outline when off,
 * as Figma pairs them. Press a row to toggle it; the menu stays open. Figma
 * puts a logo from its Social Icons set before each name; they are left out
 * until the code has those icons.
 */
export const WithSwitches: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => (
    <Held trigger={copy(ctx).open} className="w-[297px]">
      {switchRows(copy(ctx))}
    </Held>
  ),
}

/**
 * Figma's Dropdown Checkboxes: a check before the text of each row that is
 * on. Its 16px slot is always there, so no text moves. Press a row to toggle
 * it; the menu stays open.
 */
export const Checkboxes: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Held trigger={c.open} className="w-[282px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{c.myAccount}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem defaultChecked>{c.statusBar}</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem disabled>{c.api}</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem className={FIGMA_HOVER}>{c.inviteUsers}</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </Held>
    )
  },
}

/**
 * Figma's Dropdown Radio Group: one choice of several, shown by Figma's dot
 * before the chosen row's text. Press a row to choose it; the menu stays
 * open.
 */
export const RadioGroup: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => (
    <Held trigger={copy(ctx).open} className="w-[282px]">
      {radioRows(copy(ctx))}
    </Held>
  ),
}

/**
 * Figma's Dropdown Item states, each row named after its state: default;
 * highlighted, drawn with the classes Base UI's `data-highlighted` turns on so
 * it shows without a pointer; disabled, at half opacity and not pressable but
 * still reachable with the arrow keys; and destructive, whose text and icon are
 * `destructive`. Point at a row, or use the arrow keys, to highlight it.
 */
export const States: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Held trigger={c.open} className="w-[240px]">
        <DropdownMenuItem icon={<UserIcon strokeWidth={1.5} />}>{c.stateDefault}</DropdownMenuItem>
        <DropdownMenuItem icon={<UserIcon strokeWidth={1.5} />} className={FIGMA_HOVER}>
          {c.stateHighlighted}
        </DropdownMenuItem>
        <DropdownMenuItem icon={<UserIcon strokeWidth={1.5} />} disabled>
          {c.stateDisabled}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" icon={<Trash2Icon strokeWidth={1.5} />}>
          {c.stateDestructive}
        </DropdownMenuItem>
      </Held>
    )
  },
}

/**
 * Light and Dark, one panel each, whatever the theme toolbar says. Each panel
 * sets its own theme: the `light` or `dark` class re-points every token for
 * that subtree, and the open menus are portalled into the panel to take them.
 * The direction follows the toolbar.
 */
export const LightAndDark: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4">
        {THEMES.map((theme) => (
          <div key={theme} className={cn(theme, "rounded-lg border bg-background p-6 text-foreground")}>
            <Head className="block pb-4">{title(theme)}</Head>
            <div className="grid grid-cols-[17.625rem] items-start gap-x-6 gap-y-5 sm:grid-cols-[repeat(2,17.625rem)]">
              <Held trigger={c.open} className="w-[282px]">
                {basicRows(c)}
              </Held>
              <Held trigger={c.open} className="w-[282px]">
                {switchRows(c)}
              </Held>
              <Held trigger={c.open} className="w-[282px]">
                {iconActionRows(c)}
              </Held>
              <Held trigger={c.open} className="w-[282px]">
                {radioRows(c)}
              </Held>
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * LTR and RTL at once, whatever the toolbar says: each panel sets its own
 * `dir`, `lang` and font. In RTL the menu lines up with the trigger's right
 * edge, the text and icons start on the right, the shortcuts and the submenu
 * chevron sit at the left end and the chevron points left, toward the side
 * the submenu opens on. The theme follows the toolbar.
 */
export const Directions: Story = {
  decorators: [framed],
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-[17.625rem] items-start gap-x-8 gap-y-6 sm:grid-cols-[repeat(2,17.625rem)]">
      {DIRECTIONS.map((direction) => {
        const c = COPY[direction]
        return (
          <div
            key={direction}
            dir={direction}
            lang={direction === "rtl" ? "ar" : "en"}
            className={cn("flex flex-col gap-1.5", direction === "rtl" ? "font-arabic" : "font-sans")}
          >
            <Head>{direction.toUpperCase()}</Head>
            <Held trigger={c.open} className="w-[282px]">
              {basicRows(c, { shortcuts: true })}
            </Held>
          </div>
        )
      })}
    </div>
  ),
}
