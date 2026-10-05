import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { CreditCard, KeyRound, Settings, User } from "lucide-react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsListProps,
} from "../../../../packages/fasla-ui/registry/ui/tabs"

/**
 * `variant` and `size` live on `TabsList` — one per group, as Figma's doc
 * asks — so the Controls panel drives the list.
 */
const meta: Meta<typeof TabsList> = {
  title: "UI/Tabs",
  component: TabsList,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["lifted", "boxed", "bordered"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  args: { variant: "boxed", size: "md" },
}

export default meta
type Story = StoryObj<typeof TabsList>

/**
 * Sample copy, per script: account settings and orders, as on the docs page.
 * Only the rendered text changes — prop names stay English everywhere. The
 * Arabic follows design/content/ and matches the docs site.
 */
const COPY = {
  ltr: {
    tabs: { account: "Account", password: "Password", billing: "Billing", settings: "Settings" },
    panels: {
      account: "Make changes to your account here.",
      password: "Change your password here.",
      billing: "Review your plan and invoices here.",
      settings: "Manage your settings here.",
    },
    current: "Current orders",
    invoices: "Invoices",
    past: "Past orders",
    currentText: "You have two orders out for delivery.",
    pastText: "Your last order was two weeks ago.",
    many: ["Overview", "Orders", "Customers", "Products", "Reports", "Payouts", "Team", "Logs"],
    active: "Active tab",
  },
  rtl: {
    tabs: { account: "الحساب", password: "كلمة المرور", billing: "الفوترة", settings: "الإعدادات" },
    panels: {
      account: "عدّل بيانات حسابك من هنا.",
      password: "غيّر كلمة المرور من هنا.",
      billing: "راجع باقتك وفواتيرك من هنا.",
      settings: "أدِر إعداداتك من هنا.",
    },
    current: "الطلبات الحالية",
    invoices: "الفواتير",
    past: "الطلبات السابقة",
    currentText: "لديك طلبان قيد التوصيل.",
    pastText: "آخر طلب لك كان قبل أسبوعين.",
    many: ["نظرة عامة", "الطلبات", "العملاء", "المنتجات", "التقارير", "المدفوعات", "الفريق", "السجلات"],
    active: "علامة التبويب النشطة",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy =>
  ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr

const VARIANTS = ["lifted", "boxed", "bordered"] as const
const SIZES = ["sm", "md", "lg"] as const
const TABS = ["account", "password", "billing", "settings"] as const
const ICONS = { account: User, password: KeyRound, billing: CreditCard, settings: Settings }

const Head = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="w-fit font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

const Group = ({
  c,
  icons = false,
  disabled,
  ...listProps
}: Partial<TabsListProps> & { c: Copy; icons?: boolean; disabled?: string }) => (
  <Tabs defaultValue="account">
    <TabsList aria-label={c.tabs.settings} {...listProps}>
      {TABS.map((tab) => {
        const Icon = ICONS[tab]
        return (
          <TabsTrigger key={tab} value={tab} disabled={tab === disabled}>
            {icons && <Icon aria-hidden="true" />}
            {c.tabs[tab]}
          </TabsTrigger>
        )
      })}
    </TabsList>
  </Tabs>
)

/** Every control in the Controls panel drives this one. */
export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <Tabs defaultValue="account" className="w-[420px]">
        <TabsList aria-label={c.tabs.settings} {...args}>
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {c.tabs[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="rounded-md border p-4">
              <h3 className="font-semibold">{c.tabs[tab]}</h3>
              <p className="text-sm text-muted-foreground">{c.panels[tab]}</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    )
  },
}

/**
 * Figma's `Style` axis: Lifted (a raised file-folder tab), Boxed (a filled
 * pill — the "pills" look) and Bordered (an underline).
 */
export const Styles: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex flex-col gap-6">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <Head>{variant}</Head>
            <Group c={c} variant={variant} />
          </div>
        ))}
      </div>
    )
  },
}

/** sm, md and lg: 28, 30 and 32px tall, with 16, 16 and 20px icons. */
export const Sizes: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-3">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-4">
            <Head>{variant}</Head>
            {SIZES.map((size) => (
              <Group key={size} c={c} variant={variant} size={size} />
            ))}
          </div>
        ))}
      </div>
    )
  },
}

/** Figma's `Has Icon`: put an icon before the label; the tab sizes it. */
export const WithIcons: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex flex-col gap-6">
        {VARIANTS.map((variant) => (
          <Group key={variant} c={c} variant={variant} icons />
        ))}
      </div>
    )
  },
}

/** A disabled tab is greyed out and skipped by the arrow keys. */
export const Disabled: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex flex-col gap-6">
        {VARIANTS.map((variant) => (
          <Tabs key={variant} defaultValue="current" className="w-[420px]">
            <TabsList variant={variant} aria-label={c.past}>
              <TabsTrigger value="current">{c.current}</TabsTrigger>
              <TabsTrigger value="invoices" disabled>
                {c.invoices}
              </TabsTrigger>
              <TabsTrigger value="past">{c.past}</TabsTrigger>
            </TabsList>
            <TabsContent value="current">{c.currentText}</TabsContent>
            <TabsContent value="past">{c.pastText}</TabsContent>
          </Tabs>
        ))}
      </div>
    )
  },
}

const ControlledDemo = ({ c }: { c: Copy }) => {
  const [value, setValue] = React.useState<string>("password")
  return (
    <div className="flex flex-col gap-3">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList aria-label={c.tabs.settings}>
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {c.tabs[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="text-sm text-muted-foreground">
        {c.active}:{" "}
        {/* Arabic never goes in a code span: its mono face has no Arabic glyphs. */}
        {c === COPY.rtl ? (
          <span className="font-medium text-foreground">
            {c.tabs[value as (typeof TABS)[number]]}
          </span>
        ) : (
          <code dir="ltr">{value}</code>
        )}
      </p>
    </div>
  )
}

/** `value` with `onValueChange`: the active tab lives outside the tabs. */
export const Controlled: Story = {
  render: (_args, ctx) => <ControlledDemo c={copy(ctx)} />,
}

/** Figma's Tabs Component holds 2 to 8 tabs. Past 8, use a menu instead. */
export const ManyTabs: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex flex-col gap-6">
        {VARIANTS.map((variant) => (
          <Tabs key={variant} defaultValue="0">
            <TabsList variant={variant} size="sm" aria-label={c.many[0]}>
              {c.many.map((label, i) => (
                <TabsTrigger key={label} value={String(i)}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ))}
      </div>
    )
  },
}

const STATES = ["inactive", "hover", "active", "focus", "disabled"] as const

const cellId = (variant: string, size: string, state: string) =>
  `tab-${variant}-${size}-${state}`

const cellsFor = (state: (typeof STATES)[number]) =>
  VARIANTS.flatMap((v) => SIZES.map((s) => `#${cellId(v, s, state)} [role=tab]`))

/**
 * Every variant in the Tab item set, for the direction on the toolbar.
 *
 * Figma's axes are Direction × size × State × Style. Each row here is one
 * Style × size, with State across the top: 45 cells, every LTR variant plus
 * Focus for Lifted and Bordered, which Figma draws for Boxed only. Flip the
 * Direction toolbar for RTL.
 *
 * Hover and Focus render statically: `storybook-addon-pseudo-states` applies
 * the real `:hover` and `:focus-visible` to those cells, so the grid cannot
 * drift from the component. The axis names stay English in both directions —
 * they are Figma property identifiers, not sample copy.
 */
export const AllStates: Story = {
  parameters: {
    layout: "padded",
    pseudo: { hover: cellsFor("hover"), focusVisible: cellsFor("focus") },
  },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-10">
        {VARIANTS.map((variant) => (
          <div key={variant} className="space-y-3">
            <h3 dir="ltr" className="font-sans text-sm font-medium text-foreground">
              Style = {variant}
            </h3>
            <div className="grid grid-cols-[3rem_repeat(5,7rem)] items-center gap-x-6 gap-y-4">
              <span />
              {STATES.map((state) => (
                <Head key={state}>{state[0]!.toUpperCase() + state.slice(1)}</Head>
              ))}
              {SIZES.map((size) => (
                <React.Fragment key={size}>
                  <Head>{size}</Head>
                  {STATES.map((state) => {
                    const isActive = state === "active" || state === "focus"
                    return (
                      <div key={state} id={cellId(variant, size, state)} className="ps-3">
                        <Tabs value={isActive ? "tab" : "other"}>
                          <TabsList variant={variant} size={size} aria-label={c.tabs.account}>
                            <TabsTrigger value="tab" disabled={state === "disabled"}>
                              {c.tabs.account}
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark side by side, whatever the theme toolbar says, as Figma's
 * doc shows each style. Language and direction follow the Direction toolbar.
 *
 * Each panel sets its own theme: the `light` or `dark` class re-points every
 * token for that subtree, on the canvas and on the Docs page alike.
 */
export const LightAndDark: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[
              "space-y-5 rounded-lg border bg-background p-6 text-foreground",
              theme,
            ].join(" ")}
          >
            <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col gap-2">
                <Head>{variant}</Head>
                <Group c={c} variant={variant} disabled="settings" />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
}
