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

/**
 * Sample copy, per script: the same store as the docs page. Numbers stay in
 * Western digits in both; the Arabic follows design/content/.
 */
const COPY = {
  ltr: {
    revenue: "Total revenue",
    revenueValue: "SAR 45,231",
    fromLastMonth: "from last month",
    returns: "Return rate",
    vsLastWeek: "vs last week",
    customers: "Total customers",
    orders: "Orders",
    sales: "Items sold",
    active: "Active shoppers",
    fromLastHour: "from last hour",
  },
  rtl: {
    revenue: "إجمالي الإيرادات",
    revenueValue: "45,231 ر.س",
    fromLastMonth: "مقارنة بالشهر الماضي",
    returns: "نسبة المرتجعات",
    vsLastWeek: "مقارنة بالأسبوع الماضي",
    customers: "إجمالي العملاء",
    orders: "الطلبات",
    sales: "المنتجات المبيعة",
    active: "المتسوقون الآن",
    fromLastHour: "مقارنة بالساعة الماضية",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <StatsCard
        {...args}
        title={args.title ?? c.revenue}
        value={args.value ?? c.revenueValue}
        description={args.description ?? c.fromLastMonth}
        icon={<DollarSignIcon size={24} strokeWidth={1.5} />}
        trend={{ value: 20.1, direction: "up" }}
      />
    )
  },
}

export const TrendDown: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <StatsCard {...args} title={args.title ?? c.returns} value={args.value ?? "4.2%"} description={args.description ?? c.vsLastWeek} trend={{ value: -5.2, direction: "down" }} />
    )
  },
}

export const Loading: Story = {
  render: (args, ctx) => <StatsCard {...args} title={args.title ?? copy(ctx).customers} value={args.value ?? "0"} loading icon={<UsersIcon size={24} strokeWidth={1.5} />} />,
}

export const Grid: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <StatsGrid columns={4}>
        <StatsCard title={c.revenue} value={c.revenueValue} icon={<DollarSignIcon size={24} strokeWidth={1.5} />} trend={{ value: 20.1, direction: "up" }} description={c.fromLastMonth} />
        <StatsCard title={c.orders} value="2,350" trend={{ value: 18.1, direction: "up" }} description={c.fromLastMonth} />
        <StatsCard title={c.sales} value="12,234" trend={{ value: 19, direction: "up" }} description={c.fromLastMonth} />
        <StatsCard title={c.active} value="573" icon={<UsersIcon size={24} strokeWidth={1.5} />} trend={{ value: -2.5, direction: "down" }} description={c.fromLastHour} />
      </StatsGrid>
    )
  },
}
