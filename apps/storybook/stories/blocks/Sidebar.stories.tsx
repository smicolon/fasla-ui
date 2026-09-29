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

export const Default: Story = {
  render: () => (
    <div className="flex h-[500px]">
      <Sidebar>
        <SidebarHeader>
          <span className="font-semibold">My App</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Main">
            <SidebarItem icon={<HouseIcon size={20} strokeWidth={1.5} />} active>Dashboard</SidebarItem>
            <SidebarItem icon={<UserIcon size={20} strokeWidth={1.5} />}>Users</SidebarItem>
            <SidebarItem icon={<SettingsIcon size={20} strokeWidth={1.5} />}>Settings</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem icon={<UserIcon size={20} strokeWidth={1.5} />}>Profile</SidebarItem>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Content</h1>
      </main>
    </div>
  ),
}

export const Collapsible: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false)
    return (
      <div className="flex h-[500px]">
        <Sidebar collapsed={collapsed}>
          <SidebarHeader className="justify-between">
            {!collapsed && <span className="font-semibold">My App</span>}
            <SidebarCollapseButton collapsed={collapsed} onCollapsedChange={setCollapsed} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={<HouseIcon size={20} strokeWidth={1.5} />} collapsed={collapsed} active>Dashboard</SidebarItem>
              <SidebarItem icon={<UserIcon size={20} strokeWidth={1.5} />} collapsed={collapsed}>Users</SidebarItem>
              <SidebarItem icon={<SettingsIcon size={20} strokeWidth={1.5} />} collapsed={collapsed}>Settings</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold">Content</h1>
          <p className="text-muted-foreground">Click the collapse button in the sidebar</p>
        </main>
      </div>
    )
  },
}
