import type { Meta, StoryObj } from "@storybook/react"
import { StatsCard, StatsGrid } from "../../../../packages/fasla-ui/registry/blocks/stats-card"

const meta: Meta<typeof StatsCard> = {
  title: "Blocks/StatsCard",
  component: StatsCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof StatsCard>

const DollarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export const Default: Story = {
  args: {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "from last month",
    icon: <DollarIcon />,
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
    icon: <UsersIcon />,
  },
}

export const Grid: Story = {
  render: () => (
    <StatsGrid columns={4}>
      <StatsCard
        title="Total Revenue"
        value="$45,231.89"
        icon={<DollarIcon />}
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
        icon={<UsersIcon />}
        trend={{ value: -2.5, direction: "down" }}
        description="from last hour"
      />
    </StatsGrid>
  ),
}
