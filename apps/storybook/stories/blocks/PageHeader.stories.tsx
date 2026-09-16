import type { Meta, StoryObj } from "@storybook/react"
import { PageHeader } from "../../../../packages/fasla-ui/registry/blocks/page-header/PageHeader"

const meta: Meta<typeof PageHeader> = {
  title: "Blocks/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof PageHeader>

const Button = ({ variant = "default", children }: { variant?: "default" | "outline"; children: React.ReactNode }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
      variant === "outline"
        ? "border border-input bg-background hover:bg-accent"
        : "bg-primary text-primary-foreground hover:bg-primary/90"
    }`}
  >
    {children}
  </button>
)

const Breadcrumb = () => (
  <div className="flex items-center gap-2">
    <a href="#" className="hover:text-foreground">Home</a>
    <span>/</span>
    <a href="#" className="hover:text-foreground">Projects</a>
    <span>/</span>
    <span className="text-foreground">Current</span>
  </div>
)

export const Default: Story = {
  args: {
    title: "Projects",
    description: "Manage and organize your projects",
  },
}

export const WithActions: Story = {
  args: {
    title: "Team Members",
    description: "Invite and manage your team",
    actions: (
      <>
        <Button variant="outline">Export</Button>
        <Button>Add Member</Button>
      </>
    ),
  },
}

export const WithBreadcrumb: Story = {
  args: {
    title: "Project Settings",
    description: "Configure your project preferences",
    breadcrumb: <Breadcrumb />,
    actions: <Button>Save Changes</Button>,
  },
}

export const TitleOnly: Story = {
  args: {
    title: "Dashboard",
  },
}

export const NoBorder: Story = {
  args: {
    title: "Settings",
    description: "Update your account settings",
    bordered: false,
    actions: <Button variant="outline">Cancel</Button>,
  },
}

export const LongTitle: Story = {
  args: {
    title: "This is a very long page title that might wrap to multiple lines on smaller screens",
    description: "With an equally detailed description explaining what this page does and why it exists in the application",
    actions: <Button>Action</Button>,
  },
}
