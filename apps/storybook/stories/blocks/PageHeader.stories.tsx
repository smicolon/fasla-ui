import type { Meta, StoryObj } from "@storybook/react"
import { PageHeader } from "../../../../packages/fasla-ui/registry/blocks/page-header/PageHeader"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

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

/**
 * Sample copy, per script: the same store as the docs page. Only the rendered
 * text changes; the Arabic follows design/content/. Actions use the library's
 * own Button, never a hand-styled one.
 */
const COPY = {
  ltr: {
    orders: { title: "Orders", description: "Track and manage your store’s orders" },
    products: { title: "Products", description: "Add, edit and price your products" },
    export: "Export",
    addProduct: "Add product",
    settings: { title: "Store settings", description: "Configure your store’s preferences" },
    crumbs: ["Home", "Settings", "Store"],
    breadcrumbLabel: "Breadcrumb",
    saveChanges: "Save changes",
    dashboard: "Dashboard",
    account: { title: "Settings", description: "Update your account settings" },
    cancel: "Cancel",
    long: {
      title: "Shipping rates for orders delivered outside the main cities during public holidays",
      description: "Set a flat rate or a rate per kilogram, and choose the regions each rate applies to before customers reach checkout",
    },
    action: "Add rate",
  },
  rtl: {
    orders: { title: "الطلبات", description: "تابع طلبات متجرك وأدِرها" },
    products: { title: "المنتجات", description: "أضف منتجاتك وعدّلها وسعّرها" },
    export: "تصدير",
    addProduct: "إضافة منتج",
    settings: { title: "إعدادات المتجر", description: "اضبط تفضيلات متجرك" },
    crumbs: ["الرئيسية", "الإعدادات", "المتجر"],
    breadcrumbLabel: "مسار التنقّل",
    saveChanges: "حفظ التغييرات",
    dashboard: "لوحة التحكم",
    account: { title: "الإعدادات", description: "حدّث إعدادات حسابك" },
    cancel: "إلغاء",
    long: {
      title: "أسعار الشحن للطلبات التي تُسلَّم خارج المدن الرئيسية خلال العطلات الرسمية",
      description: "حدّد سعرًا ثابتًا أو سعرًا لكل كيلوغرام، واختر المناطق التي ينطبق عليها كل سعر قبل أن يصل العملاء إلى الدفع",
    },
    action: "إضافة سعر",
  },
}

type StoryCtx = { globals: { direction?: string } }
type Copy = (typeof COPY)["ltr"]
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const Breadcrumb = ({ c }: { c: Copy }) => (
  <div className="flex items-center gap-2">
    <a href="#" className="hover:text-foreground">{c.crumbs[0]}</a>
    <span aria-hidden="true">/</span>
    <a href="#" className="hover:text-foreground">{c.crumbs[1]}</a>
    <span aria-hidden="true">/</span>
    <span className="text-foreground">{c.crumbs[2]}</span>
  </div>
)

export const Default: Story = {
  render: (args, ctx) => (
    <PageHeader {...args} title={copy(ctx).orders.title} description={copy(ctx).orders.description} />
  ),
}

export const WithActions: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <PageHeader
        {...args}
        title={c.products.title}
        description={c.products.description}
        actions={
          <>
            <Button variant="outline">{c.export}</Button>
            <Button>{c.addProduct}</Button>
          </>
        }
      />
    )
  },
}

export const WithBreadcrumb: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <PageHeader
        {...args}
        title={c.settings.title}
        description={c.settings.description}
        breadcrumb={<Breadcrumb c={c} />}
        breadcrumbLabel={c.breadcrumbLabel}
        actions={<Button>{c.saveChanges}</Button>}
      />
    )
  },
}

export const TitleOnly: Story = {
  render: (args, ctx) => <PageHeader {...args} title={copy(ctx).dashboard} />,
}

export const NoBorder: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <PageHeader
        {...args}
        title={c.account.title}
        description={c.account.description}
        bordered={false}
        actions={<Button variant="outline">{c.cancel}</Button>}
      />
    )
  },
}

/** A title and description long enough to wrap. */
export const LongTitle: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <PageHeader {...args} title={c.long.title} description={c.long.description} actions={<Button>{c.action}</Button>} />
    )
  },
}
