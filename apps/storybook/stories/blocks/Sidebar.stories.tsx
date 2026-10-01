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
const ICONS = [HouseIcon, UserIcon, SettingsIcon]

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
                  <SidebarItem key={item} icon={<Icon size={20} strokeWidth={1.5} />} active={i === 0}>
                    {item}
                  </SidebarItem>
                )
              })}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={<UserIcon size={20} strokeWidth={1.5} />}>{c.profile}</SidebarItem>
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
                  <SidebarItem key={item} icon={<Icon size={20} strokeWidth={1.5} />} collapsed={collapsed} active={i === 0}>
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
