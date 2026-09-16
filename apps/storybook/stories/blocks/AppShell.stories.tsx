import type { Meta, StoryObj } from "@storybook/react"
import { AppShell } from "../../../../packages/fasla-ui/registry/blocks/app-shell/AppShell"

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

const SidebarContent = () => (
  <div className="flex h-full flex-col">
    <div className="flex h-14 items-center border-b px-4">
      <span className="font-semibold">My App</span>
    </div>
    <nav className="flex-1 space-y-1 p-2">
      {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
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

const HeaderContent = () => (
  <div className="flex h-14 items-center justify-between px-4">
    <div className="flex items-center gap-4">
      <button className="md:hidden rounded-md p-2 hover:bg-accent">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
      <span className="text-sm text-muted-foreground">Welcome back!</span>
    </div>
    <div className="flex items-center gap-2">
      <button className="rounded-full h-8 w-8 bg-primary text-primary-foreground text-sm font-medium">
        JD
      </button>
    </div>
  </div>
)

export const Default: Story = {
  args: {
    sidebar: <SidebarContent />,
    header: <HeaderContent />,
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Card {i}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Some content for this card.
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
}

export const WithoutSidebar: Story = {
  args: {
    header: <HeaderContent />,
    children: (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold">Content Only</h1>
        <p className="mt-4 text-muted-foreground">
          This layout shows just the header and content area without a sidebar.
        </p>
      </div>
    ),
  },
}

export const WithoutHeader: Story = {
  args: {
    sidebar: <SidebarContent />,
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">No Header Layout</h1>
        <p className="text-muted-foreground">
          This layout shows sidebar and content without a header.
        </p>
      </div>
    ),
  },
}

export const SmallSidebar: Story = {
  args: {
    sidebar: <SidebarContent />,
    header: <HeaderContent />,
    sidebarWidth: "sm",
    children: (
      <div>
        <h1 className="text-2xl font-bold">Small Sidebar</h1>
        <p className="mt-4 text-muted-foreground">
          Using sidebarWidth="sm" for a narrower sidebar.
        </p>
      </div>
    ),
  },
}

export const LargeSidebar: Story = {
  args: {
    sidebar: <SidebarContent />,
    header: <HeaderContent />,
    sidebarWidth: "lg",
    children: (
      <div>
        <h1 className="text-2xl font-bold">Large Sidebar</h1>
        <p className="mt-4 text-muted-foreground">
          Using sidebarWidth="lg" for a wider sidebar.
        </p>
      </div>
    ),
  },
}
