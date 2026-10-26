import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import {
  CalendarIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarSubItem,
  SidebarPlanCard,
  SidebarFooter,
  SidebarProfile,
  type SidebarProps,
} from "../../../../packages/fasla-ui/registry/blocks/sidebar"

/**
 * Figma: "Side Bar" (40503:333), Direction × State × Plan card, and "Side Bar
 * Inside Item" (40492:58601), State × Sub-item × Direction with the Icon,
 * Badge and Have sub-items booleans. Direction is the toolbar. Every story
 * follows the Direction and Theme toolbars, except Light And Dark and LTR And
 * RTL, which show both at once.
 */
type StoryArgs = Pick<SidebarProps, "collapsed" | "className"> & {
  /** Story only: adds the optional plan card (Figma `Plan card`). */
  planCard?: boolean
}

const meta: Meta<StoryArgs> = {
  title: "Blocks/Sidebar",
  component: Sidebar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    collapsed: { control: "boolean", table: { defaultValue: { summary: "false" } } },
    planCard: {
      control: "boolean",
      description: "Adds `SidebarPlanCard` between the content and the footer (Figma `Plan card`, off by default).",
      table: { defaultValue: { summary: "false" } },
    },
    className: { control: "text" },
    // Behaviour: it changes nothing in the preview. It is on the docs page's
    // Props table.
    defaultCollapsed: { table: { disable: true } },
    onCollapsedChange: { table: { disable: true } },
    children: { table: { disable: true } },
  } as Meta<StoryArgs>["argTypes"],
  args: { collapsed: false, planCard: false },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script: a store, as on the docs page. Only the rendered
 * text changes — prop names stay English everywhere. The Arabic is Modern
 * Standard Arabic; the demo person transliterates.
 */
const COPY = {
  ltr: {
    nav: "Main",
    groups: { store: "Store", account: "Account" },
    items: {
      dashboard: "Dashboard",
      orders: "Orders",
      allOrders: "All orders",
      returns: "Returns",
      drafts: "Drafts",
      products: "Products",
      customers: "Customers",
      segments: "Segments",
      reviews: "Reviews",
      messages: "Messages",
      settings: "Settings",
      team: "Team",
      billing: "Billing",
    },
    profile: { name: "Nadia Rahman", description: "Fasla" },
    plan: { title: "Pro plan", description: "3 team members", footer: "Next renewal: 10 Mar" },
    long: {
      group: "Customer accounts and permissions",
      item: "Reports on returns and refunds this quarter",
      subItem: "Refunds waiting for approval from finance",
      name: "Nadia Rahman Al-Hashimi",
      description: "Fasla workspace for the Gulf region",
    },
  },
  rtl: {
    nav: "الرئيسية",
    groups: { store: "المتجر", account: "الحساب" },
    items: {
      dashboard: "لوحة التحكم",
      orders: "الطلبات",
      allOrders: "كل الطلبات",
      returns: "المرتجعات",
      drafts: "المسودات",
      products: "المنتجات",
      customers: "العملاء",
      segments: "الشرائح",
      reviews: "التقييمات",
      messages: "الرسائل",
      settings: "الإعدادات",
      team: "الفريق",
      billing: "الفوترة",
    },
    profile: { name: "نادية رحمن", description: "فاصلة" },
    plan: { title: "الخطة الاحترافية", description: "3 أعضاء في الفريق", footer: "التجديد التالي: 10 مارس" },
    long: {
      group: "حسابات العملاء وصلاحياتهم",
      item: "تقارير المرتجعات والمبالغ المستردّة في هذا الربع",
      subItem: "مبالغ مستردّة بانتظار موافقة قسم المالية",
      name: "نادية رحمن الهاشمي",
      description: "مساحة عمل فاصلة لمنطقة الخليج",
    },
  },
} as const

type Dir = keyof typeof COPY
type Copy = (typeof COPY)[Dir]
type StoryCtx = { globals: { direction?: string } }
const dirOf = (ctx: StoryCtx): Dir => (ctx.globals.direction === "rtl" ? "rtl" : "ltr")

const PHOTO = "/samples/avatar-portrait.png"

/** Lucide icons at Figma's 1.5 stroke; the item sets them at 16px. */
const icon = (Icon: LucideIcon) => <Icon strokeWidth={1.5} />

/**
 * The Fasla lockup at Figma's size — the English one 90px wide, the Arabic one
 * 28px tall — drawn, never re-set: the Arabic lockup in
 * RTL, ink on light and white on dark. With no `theme` it follows the theme
 * toolbar; a Light And Dark panel passes its own.
 */
function Logo({ dir, theme }: { dir: Dir; theme?: "light" | "dark" }) {
  const alt = dir === "rtl" ? "فاصلة" : "Fasla"
  const size = dir === "rtl" ? "h-7 w-auto" : "h-auto w-[90px]"
  const src = (dark: boolean) => `/brand/fasla-lockup-${dir}${dark ? "-onDark" : ""}.svg`
  if (theme) return <img src={src(theme === "dark")} alt={alt} className={size} />
  return (
    <>
      <img src={src(false)} alt={alt} className={`${size} dark:hidden`} />
      <img src={src(true)} alt={alt} className={`hidden ${size} dark:block`} />
    </>
  )
}

const Mark = ({ dir }: { dir: Dir }) => (
  <img src="/brand/fasla-mark.svg" alt={dir === "rtl" ? "فاصلة" : "Fasla"} className="size-7" />
)

type SampleOptions = {
  dir: Dir
  theme?: "light" | "dark"
  plan?: boolean
  long?: boolean
} & Partial<SidebarProps>

/**
 * The sample store, laid out as Figma's Side Bar: two titled groups, the
 * second item a parent open on its selected sub-item, the fourth a closed
 * parent, a badge on the fifth, and the profile at the foot.
 */
function Sample({ dir, theme, plan = false, long = false, ...root }: SampleOptions) {
  const c: Copy = COPY[dir]
  return (
    <Sidebar {...root}>
      <SidebarHeader logo={<Logo dir={dir} theme={theme} />} logoIcon={<Mark dir={dir} />} />
      <SidebarContent aria-label={c.nav}>
        <SidebarGroup label={c.groups.store}>
          <SidebarItem icon={icon(LayoutDashboardIcon)} label={c.items.dashboard} href="#dashboard" />
          <SidebarItem icon={icon(ShoppingCartIcon)} label={c.items.orders}>
            <SidebarSubItem label={c.items.allOrders} href="#orders" selected />
            <SidebarSubItem label={long ? c.long.subItem : c.items.returns} href="#returns" />
            <SidebarSubItem label={c.items.drafts} href="#drafts" />
          </SidebarItem>
          <SidebarItem icon={icon(PackageIcon)} label={long ? c.long.item : c.items.products} href="#products" />
          <SidebarItem icon={icon(UsersIcon)} label={c.items.customers}>
            <SidebarSubItem label={c.items.segments} href="#segments" />
            <SidebarSubItem label={c.items.reviews} href="#reviews" />
          </SidebarItem>
          <SidebarItem icon={icon(MessageSquareIcon)} label={c.items.messages} href="#messages" badge />
        </SidebarGroup>
        <SidebarGroup label={long ? c.long.group : c.groups.account}>
          <SidebarItem icon={icon(SettingsIcon)} label={c.items.settings} href="#settings" />
          <SidebarItem icon={icon(UsersRoundIcon)} label={c.items.team} href="#team" />
          <SidebarItem icon={icon(CreditCardIcon)} label={c.items.billing} href="#billing" />
        </SidebarGroup>
      </SidebarContent>
      {plan && (
        <SidebarPlanCard
          title={c.plan.title}
          description={c.plan.description}
          footer={c.plan.footer}
          footerIcon={icon(CalendarIcon)}
        />
      )}
      <SidebarFooter>
        <SidebarProfile
          name={long ? c.long.name : c.profile.name}
          description={long ? c.long.description : c.profile.description}
          avatar={{ src: PHOTO }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}

/**
 * Heights that fit the whole sample without scrolling, in English and in
 * Arabic, whose Cairo lines are taller. The sidebar fills its container, as
 * it fills a page in an app.
 */
const HEIGHT = { base: "h-[50rem]", plan: "h-[60rem]", long: "h-[54rem]" } as const

/**
 * A label set in the story's own chrome: English, left to right, small and
 * muted, its line pinned at Geist's 16px so an RTL column does not grow it.
 */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    dir="ltr"
    className={["w-fit whitespace-nowrap text-left font-sans text-xs leading-4 text-muted-foreground", className].join(" ")}
  >
    {children}
  </span>
)

/**
 * Centres the story when it fits and scrolls in the story's own direction
 * when it does not, so nothing renders outside the Docs page's container.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/**
 * The playground. The toggle in the header collapses it, and `collapsed`
 * starts it either way; `planCard` adds the optional plan card. Collapsed,
 * point at an icon or tab to it to see its tooltip, and press Orders to
 * expand the sidebar with its sub-items open.
 */
export const Default: Story = {
  render: ({ collapsed, planCard, className }, ctx) => (
    <div className={planCard ? HEIGHT.plan : HEIGHT.base}>
      {/* Keyed on the control, so changing it starts the sidebar over in that state. */}
      <Sample key={String(collapsed)} dir={dirOf(ctx)} defaultCollapsed={collapsed} plan={planCard} className={className} />
    </div>
  ),
}

/**
 * Figma's State axis, side by side: Expanded (256px) and Collapsed (80px,
 * a 64px panel). Collapsed, the titles are dividers, the logo is its icon,
 * only the avatar shows in the footer, and the toggle sits under the header.
 */
export const ExpandedAndCollapsed: Story = {
  decorators: [framed],
  // A fixed pair: none of the controls would change it.
  parameters: { controls: { disable: true } },
  render: (_args, ctx) => (
    <div className="flex items-start gap-8">
      {(["Expanded", "Collapsed"] as const).map((state) => (
        <div key={state} className="flex flex-col items-center gap-2">
          <Head>{state}</Head>
          <div className={HEIGHT.base}>
            <Sample dir={dirOf(ctx)} defaultCollapsed={state === "Collapsed"} />
          </div>
        </div>
      ))}
    </div>
  ),
}

const STATES = ["default", "hover", "selected", "focus"] as const
const STATE_NAMES = { default: "Default", hover: "Hover", selected: "Selected", focus: "Focus" } as const

/** The cells forced into Hover and Focus: the pseudo-states addon applies the real `:hover` and `:focus-visible`. */
const PSEUDO = {
  hover: ["[data-state-cell=hover] a"],
  focusVisible: ["[data-state-cell=focus] a"],
}

/** A 240px strip of the sidebar's own background, as Figma draws the item set. */
const STRIP = "w-60 rounded-[var(--radius-md)] bg-sidebar py-1"

/**
 * Figma's Side Bar Inside Item: the four states, for an item and a sub-item.
 * Hover and Focus are the real pseudo-classes, forced by the pseudo-states
 * addon. Focus is Select's ring: a `ring` border and a 3px halo.
 */
export const ItemStates: Story = {
  decorators: [framed],
  // A fixed table: none of the controls would change it.
  parameters: { controls: { disable: true }, pseudo: PSEUDO },
  render: (_args, ctx) => {
    const c = COPY[dirOf(ctx)]
    return (
      <div className="grid grid-cols-[max-content_15rem_15rem] items-center gap-x-6 gap-y-3">
        <span />
        <Head>Item</Head>
        <Head>Sub-item</Head>
        {STATES.map((state) => (
          <React.Fragment key={state}>
            <Head>{STATE_NAMES[state]}</Head>
            <ul data-state-cell={state} className={STRIP}>
              <SidebarItem
                icon={icon(LayoutDashboardIcon)}
                label={c.items.dashboard}
                href="#dashboard"
                selected={state === "selected"}
              />
            </ul>
            <ul data-state-cell={state} className={STRIP}>
              <SidebarSubItem label={c.items.allOrders} href="#orders" selected={state === "selected"} />
            </ul>
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's item booleans: Icon on and off, Badge (the 8px `destructive` dot at
 * the end of the row), and Have sub-items, closed (chevron to the end edge)
 * and open (chevron up, sub-items under it). Press a parent to open or close
 * it.
 */
export const ItemOptions: Story = {
  decorators: [framed],
  // A fixed table: none of the controls would change it.
  parameters: { controls: { disable: true } },
  render: (_args, ctx) => {
    const c = COPY[dirOf(ctx)]
    const rows: [string, React.ReactNode][] = [
      ["Icon", <SidebarItem key="i" icon={icon(LayoutDashboardIcon)} label={c.items.dashboard} href="#dashboard" />],
      ["No icon", <SidebarItem key="n" label={c.items.dashboard} href="#dashboard" />],
      ["Badge", <SidebarItem key="b" icon={icon(MessageSquareIcon)} label={c.items.messages} href="#messages" badge />],
      [
        "Sub-items, closed",
        <SidebarItem key="c" icon={icon(UsersIcon)} label={c.items.customers}>
          <SidebarSubItem label={c.items.segments} href="#segments" />
          <SidebarSubItem label={c.items.reviews} href="#reviews" />
        </SidebarItem>,
      ],
      [
        "Sub-items, open",
        <SidebarItem key="o" icon={icon(ShoppingCartIcon)} label={c.items.orders} defaultOpen>
          <SidebarSubItem label={c.items.allOrders} href="#orders" selected />
          <SidebarSubItem label={c.items.returns} href="#returns" badge />
          <SidebarSubItem label={c.items.drafts} href="#drafts" />
        </SidebarItem>,
      ],
    ]
    return (
      <div className="grid grid-cols-[max-content_15rem] items-start gap-x-6 gap-y-3">
        {rows.map(([label, item]) => (
          <React.Fragment key={label}>
            <Head className="mt-4">{label}</Head>
            <ul className={STRIP}>{item}</ul>
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's `Plan card=True`: the card at the foot of the body, above the
 * profile. Collapsed, it is hidden.
 */
export const PlanCard: Story = {
  decorators: [framed],
  // A fixed pair: none of the controls would change it.
  parameters: { controls: { disable: true } },
  render: (_args, ctx) => (
    <div className="flex items-start gap-8">
      {(["Expanded", "Collapsed"] as const).map((state) => (
        <div key={state} className="flex flex-col items-center gap-2">
          <Head>{state}</Head>
          <div className={HEIGHT.plan}>
            <Sample dir={dirOf(ctx)} plan defaultCollapsed={state === "Collapsed"} />
          </div>
        </div>
      ))}
    </div>
  ),
}

/**
 * Long text wraps: an item, a sub-item, a section title and the profile's
 * name and line all grow onto more lines, and no word is cut off. Collapsed,
 * the tooltip carries the whole label.
 */
export const LongLabels: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { controls: { disable: true } },
  render: (_args, ctx) => (
    <div className={HEIGHT.long}>
      <Sample dir={dirOf(ctx)} long />
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark, one panel each, whatever the theme toolbar says, expanded
 * and collapsed. Every colour is a `sidebar-*`, `border`, `ring` or `card`
 * token, so the panel follows the theme it sits in.
 */
export const LightAndDark: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { controls: { disable: true } },
  render: (_args, ctx) => (
    <div className="flex items-start gap-4">
      {THEMES.map((theme) => (
        <div key={theme} className={[theme, "rounded-lg border bg-background p-4 text-foreground"].join(" ")}>
          <Head className="block pb-3">{theme === "dark" ? "Dark" : "Light"}</Head>
          <div className={["flex items-start gap-4", HEIGHT.base].join(" ")}>
            <Sample dir={dirOf(ctx)} theme={theme} />
            <Sample dir={dirOf(ctx)} theme={theme} defaultCollapsed />
          </div>
        </div>
      ))}
    </div>
  ),
}

const DIRECTIONS = ["ltr", "rtl"] as const

/**
 * Both directions at once, whatever the toolbar says: one column per
 * direction, each setting its own `dir`, `lang` and font. In RTL every inset
 * mirrors, the sub-item rail moves to the right, and the toggle and the
 * chevrons flip.
 */
export const LtrAndRtl: Story = {
  decorators: [framed],
  // Fixed content: none of the controls would change it.
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-start gap-8">
      {DIRECTIONS.map((dir) => (
        <div
          key={dir}
          dir={dir}
          lang={dir === "rtl" ? "ar" : "en"}
          className={["flex flex-col items-center gap-2", dir === "rtl" ? "font-arabic" : "font-sans"].join(" ")}
        >
          <Head>{dir.toUpperCase()}</Head>
          <div className={["flex items-start gap-4", HEIGHT.base].join(" ")}>
            <Sample dir={dir} />
            <Sample dir={dir} defaultCollapsed />
          </div>
        </div>
      ))}
    </div>
  ),
}
