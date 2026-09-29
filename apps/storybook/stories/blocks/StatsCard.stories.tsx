import type { Meta, StoryObj } from "@storybook/react"
import { DollarSignIcon, UsersIcon } from "lucide-react"
import { StatsCard, StatsGrid } from "../../../../packages/fasla-ui/registry/blocks/stats-card"

const meta: Meta<typeof StatsCard> = {
  title: "Blocks/StatsCard",
  component: StatsCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof StatsCard>

export const Default: Story = {
  args: {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "from last month",
    icon: <DollarSignIcon size={24} strokeWidth={1.5} />,
    trend: { value: 20.1, direction: "up" },
  },
}

export const TrendDown: Story = {
  args: {
    title: "Bounce Rate",
    value: "42.5%",
    description: "vs last week",
    trend: { value: -5.2, direction: "down" },
  },
}

export const Loading: Story = {
  args: {
    title: "Total Users",
    value: "0",
    loading: true,
    icon: <UsersIcon size={24} strokeWidth={1.5} />,
  },
}

export const Grid: Story = {
  render: () => (
    <StatsGrid columns={4}>
      <StatsCard
        title="Total Revenue"
        value="$45,231.89"
        icon={<DollarSignIcon size={24} strokeWidth={1.5} />}
        trend={{ value: 20.1, direction: "up" }}
        description="from last month"
      />
      <StatsCard
        title="Subscriptions"
        value="+2350"
        trend={{ value: 180.1, direction: "up" }}
        description="from last month"
      />
      <StatsCard
        title="Sales"
        value="+12,234"
        trend={{ value: 19, direction: "up" }}
        description="from last month"
      />
      <StatsCard
        title="Active Users"
        value="+573"
        icon={<UsersIcon size={24} strokeWidth={1.5} />}
        trend={{ value: -2.5, direction: "down" }}
        description="from last hour"
      />
    </StatsGrid>
  ),
}
