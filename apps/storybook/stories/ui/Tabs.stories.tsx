import type { Meta, StoryObj } from "@storybook/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../packages/fasla-ui/registry/ui/tabs"

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Tabs>

/**
 * Sample copy, per script: account settings and orders, as on the docs page.
 * Only the rendered text changes; the Arabic follows design/content/.
 */
const COPY = {
  ltr: {
    tabs: { account: "Account", password: "Password", settings: "Settings" },
    panels: {
      account: "Make changes to your account here.",
      password: "Change your password here.",
      settings: "Manage your settings here.",
    },
    current: "Current orders",
    invoices: "Invoices",
    past: "Past orders",
    currentText: "You have two orders out for delivery.",
    pastText: "Your last order was two weeks ago.",
  },
  rtl: {
    tabs: { account: "الحساب", password: "كلمة المرور", settings: "الإعدادات" },
    panels: {
      account: "عدّل بيانات حسابك من هنا.",
      password: "غيّر كلمة المرور من هنا.",
      settings: "أدِر إعداداتك من هنا.",
    },
    current: "الطلبات الحالية",
    invoices: "الفواتير",
    past: "الطلبات السابقة",
    currentText: "لديك طلبان قيد التوصيل.",
    pastText: "آخر طلب لك كان قبل أسبوعين.",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)
const TABS = ["account", "password", "settings"] as const

export const Default: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
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

export const WithDisabled: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Tabs defaultValue="current" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="current">{c.current}</TabsTrigger>
          <TabsTrigger value="invoices" disabled>
            {c.invoices}
          </TabsTrigger>
          <TabsTrigger value="past">{c.past}</TabsTrigger>
        </TabsList>
        <TabsContent value="current">{c.currentText}</TabsContent>
        <TabsContent value="past">{c.pastText}</TabsContent>
      </Tabs>
    )
  },
}
