import type { Meta, StoryObj } from "@storybook/react"
import { FolderOpenIcon, InboxIcon } from "lucide-react"
import {
  EmptyState,
  EmptySearchResults,
  EmptyData,
} from "../../../../packages/fasla-ui/registry/blocks/empty-state"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<typeof EmptyState> = {
  title: "Blocks/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "No items found",
    description: "Get started by creating your first item.",
    icon: (
      <InboxIcon strokeWidth={1.5} />
    ),
  },
}

export const WithActions: Story = {
  args: {
    title: "No projects yet",
    description: "Create your first project to get started.",
    icon: (
      <FolderOpenIcon strokeWidth={1.5} />
    ),
    action: <Button>Create Project</Button>,
    secondaryAction: (
      <Button variant="outline">Import from GitHub</Button>
    ),
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="border rounded-lg">
        <EmptyState
          size="sm"
          title="Small size"
          description="This is the small size variant."
          icon={
            <InboxIcon strokeWidth={1.5} />
          }
        />
      </div>
      <div className="border rounded-lg">
        <EmptyState
          size="default"
          title="Default size"
          description="This is the default size variant."
          icon={
            <InboxIcon strokeWidth={1.5} />
          }
        />
      </div>
      <div className="border rounded-lg">
        <EmptyState
          size="lg"
          title="Large size"
          description="This is the large size variant."
          icon={
            <InboxIcon strokeWidth={1.5} />
          }
        />
      </div>
    </div>
  ),
}

export const SearchResults: Story = {
  render: () => (
    <div className="w-[400px] border rounded-lg">
      <EmptySearchResults query="react hooks" />
    </div>
  ),
}

export const NoData: Story = {
  render: () => (
    <div className="w-[400px] border rounded-lg">
      <EmptyData
        resourceName="projects"
        action={<Button>Create Project</Button>}
      />
    </div>
  ),
}
