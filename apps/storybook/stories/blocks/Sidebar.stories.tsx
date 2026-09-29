import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { HouseIcon, SettingsIcon, UserIcon } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarCollapseButton,
} from "../../../../packages/fasla-ui/registry/blocks/sidebar"

const meta: Meta<typeof Sidebar> = {
  title: "Blocks/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Sidebar>

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

/**
 * Sample copy, per script: the same store as the docs page. Only the rendered
 * text changes; the Arabic follows design/content/. The collapse button's
 * accessible name follows the page's language through its aria-label.
 */
const COPY = {
  ltr: {
    brand: "My store",
    group: "Main",
    items: ["Dashboard", "Customers", "Settings"],
    profile: "Profile",
    content: "Orders",
    hint: "Use the button in the sidebar to collapse it.",
    collapse: "Collapse sidebar",
    expand: "Expand sidebar",
  },
  rtl: {
    brand: "متجري",
    group: "الرئيسية",
    items: ["لوحة التحكم", "العملاء", "الإعدادات"],
    profile: "الملف الشخصي",
    content: "الطلبات",
    hint: "استخدم الزر في الشريط الجانبي لطيّه.",
    collapse: "طيّ الشريط الجانبي",
    expand: "توسيع الشريط الجانبي",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)
const ICONS = [HomeIcon, UserIcon, SettingsIcon]

export const Default: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex h-[500px]">
        <Sidebar>
          <SidebarHeader>
            <span className="font-semibold">{c.brand}</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label={c.group}>
              {c.items.map((item, i) => {
                const Icon = ICONS[i]!
                return (
                  <SidebarItem key={item} icon={<Icon />} active={i === 0}>
                    {item}
                  </SidebarItem>
                )
              })}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={<UserIcon />}>{c.profile}</SidebarItem>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold">{c.content}</h1>
        </main>
      </div>
    )
  },
}

export const Collapsible: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [collapsed, setCollapsed] = useState(false)
    return (
      <div className="flex h-[500px]">
        <Sidebar collapsed={collapsed}>
          <SidebarHeader className="justify-between">
            {!collapsed && <span className="font-semibold">{c.brand}</span>}
            <SidebarCollapseButton
              collapsed={collapsed}
              onCollapsedChange={setCollapsed}
              aria-label={collapsed ? c.expand : c.collapse}
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              {c.items.map((item, i) => {
                const Icon = ICONS[i]!
                return (
                  <SidebarItem key={item} icon={<Icon />} collapsed={collapsed} active={i === 0}>
                    {item}
                  </SidebarItem>
                )
              })}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold">{c.content}</h1>
          <p className="text-muted-foreground">{c.hint}</p>
        </main>
      </div>
    )
  },
}
