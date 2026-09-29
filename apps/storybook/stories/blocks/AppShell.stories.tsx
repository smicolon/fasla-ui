import type { Meta, StoryObj } from "@storybook/react"
import { MenuIcon } from "lucide-react"
import { AppShell } from "../../../../packages/fasla-ui/registry/blocks/app-shell/AppShell"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"
import { Avatar } from "../../../../packages/fasla-ui/registry/ui/avatar"

const meta: Meta<typeof AppShell> = {
  title: "Blocks/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof AppShell>

/**
 * Sample copy, per script: the same store dashboard as the docs page. Only the
 * rendered text changes; the Arabic follows design/content/. The header uses
 * the library's own Button and Avatar, never hand-styled controls.
 */
const COPY = {
  ltr: {
    brand: "My store",
    nav: ["Dashboard", "Orders", "Products", "Settings"],
    menu: "Open menu",
    welcome: "Welcome back, Layla",
    person: "Layla Haddad",
    dashboard: "Dashboard",
    cards: [
      { title: "New orders", body: "12 orders are waiting to ship." },
      { title: "Revenue", body: "SAR 48,200 this month." },
      { title: "Returns", body: "3 returns need a decision." },
    ],
    contentOnly: "Content only",
    contentOnlyBody: "This layout shows the header and content area, without a sidebar.",
    noHeader: "No header",
    noHeaderBody: "This layout shows the sidebar and content, without a header.",
    small: "Small sidebar",
    smallBody: 'sidebarWidth="sm" gives a narrower sidebar.',
    large: "Large sidebar",
    largeBody: 'sidebarWidth="lg" gives a wider sidebar.',
  },
  rtl: {
    brand: "متجري",
    nav: ["لوحة التحكم", "الطلبات", "المنتجات", "الإعدادات"],
    menu: "فتح القائمة",
    welcome: "مرحبًا بعودتك يا ليلى",
    person: "ليلى حداد",
    dashboard: "لوحة التحكم",
    cards: [
      { title: "طلبات جديدة", body: "12 طلبًا بانتظار الشحن." },
      { title: "الإيرادات", body: "48,200 ر.س هذا الشهر." },
      { title: "المرتجعات", body: "3 مرتجعات تنتظر قرارك." },
    ],
    contentOnly: "المحتوى وحده",
    contentOnlyBody: "يعرض هذا التخطيط الرأس ومنطقة المحتوى، دون شريط جانبي.",
    noHeader: "دون رأس",
    noHeaderBody: "يعرض هذا التخطيط الشريط الجانبي والمحتوى، دون رأس.",
    small: "شريط جانبي ضيّق",
    smallBody: 'تجعل sidebarWidth="sm" الشريط الجانبي أضيق.',
    large: "شريط جانبي عريض",
    largeBody: 'تجعل sidebarWidth="lg" الشريط الجانبي أعرض.',
  },
}

type StoryCtx = { globals: { direction?: string } }
type Copy = (typeof COPY)["ltr"]
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const SidebarContent = ({ c }: { c: Copy }) => (
  <div className="flex h-full flex-col">
    <div className="flex h-14 items-center border-b px-4">
      <span className="font-semibold">{c.brand}</span>
    </div>
    <nav className="flex-1 space-y-1 p-2">
      {c.nav.map((item) => (
        <a
          key={item}
          href="#"
          className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          {item}
        </a>
      ))}
    </nav>
  </div>
)

const HeaderContent = ({ c }: { c: Copy }) => (
  <div className="flex h-14 items-center justify-between px-4">
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="md:hidden" aria-label={c.menu}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </Button>
      <span className="text-sm text-muted-foreground">{c.welcome}</span>
    </div>
    <Avatar size="32" radius="rounded" name={c.person} />
  </div>
)

export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <AppShell sidebar={<SidebarContent c={c} />} header={<HeaderContent c={c} />} {...args}>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{c.dashboard}</h1>
          <div className="grid gap-4 md:grid-cols-3">
            {c.cards.map((card) => (
              <div key={card.title} className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    )
  },
}

export const WithoutSidebar: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <AppShell header={<HeaderContent c={c} />} {...args}>
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">{c.contentOnly}</h1>
          <p className="mt-4 text-muted-foreground">{c.contentOnlyBody}</p>
        </div>
      </AppShell>
    )
  },
}

export const WithoutHeader: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <AppShell sidebar={<SidebarContent c={c} />} {...args}>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{c.noHeader}</h1>
          <p className="text-muted-foreground">{c.noHeaderBody}</p>
        </div>
      </AppShell>
    )
  },
}

export const SmallSidebar: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <AppShell sidebar={<SidebarContent c={c} />} header={<HeaderContent c={c} />} sidebarWidth="sm" {...args}>
        <h1 className="text-2xl font-bold">{c.small}</h1>
        <p className="mt-4 text-muted-foreground">{c.smallBody}</p>
      </AppShell>
    )
  },
}

export const LargeSidebar: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <AppShell sidebar={<SidebarContent c={c} />} header={<HeaderContent c={c} />} sidebarWidth="lg" {...args}>
        <h1 className="text-2xl font-bold">{c.large}</h1>
        <p className="mt-4 text-muted-foreground">{c.largeBody}</p>
      </AppShell>
    )
  },
}
