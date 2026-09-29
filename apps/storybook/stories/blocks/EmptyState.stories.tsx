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

function InboxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
      />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
      />
    </svg>
  )
}

/**
 * Sample copy, per script: the same store as the docs page. The presets' own
 * English is replaced through their title and description props. The Arabic
 * follows design/content/.
 */
const COPY = {
  ltr: {
    empty: { title: "No orders yet", description: "Orders appear here once customers buy from your store." },
    actions: { title: "No products yet", description: "Add your first product to start selling.", action: "Add product", secondary: "Import from a spreadsheet" },
    sizes: { title: "No products yet", description: "Add your first product to start selling." },
    search: { query: "linen shirt", title: undefined, description: undefined },
    data: { title: "No orders yet", description: "Get started by creating your first order.", action: "Create order" },
  },
  rtl: {
    empty: { title: "لا توجد طلبات بعد", description: "تظهر الطلبات هنا عندما يشتري العملاء من متجرك." },
    actions: { title: "لا توجد منتجات بعد", description: "أضف منتجك الأول لتبدأ البيع.", action: "إضافة منتج", secondary: "الاستيراد من جدول بيانات" },
    sizes: { title: "لا توجد منتجات بعد", description: "أضف منتجك الأول لتبدأ البيع." },
    search: { query: "قميص كتان", title: "لا توجد نتائج", description: "لم نعثر على نتائج لـ «قميص كتان». جرّب كلمة بحث أخرى." },
    data: { title: "لا توجد طلبات بعد", description: "ابدأ بإنشاء طلبك الأول.", action: "إنشاء طلب" },
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: (args, ctx) => (
    <EmptyState title={copy(ctx).empty.title} description={copy(ctx).empty.description} icon={<InboxIcon />} {...args} />
  ),
}

export const WithActions: Story = {
  render: (args, ctx) => {
    const c = copy(ctx).actions
    return (
      <EmptyState
        {...args}
        title={c.title}
        description={c.description}
        icon={<FolderIcon />}
        action={<Button>{c.action}</Button>}
        secondaryAction={<Button variant="outline">{c.secondary}</Button>}
      />
    )
  },
}

export const Sizes: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx).sizes
    return (
      <div className="flex flex-col gap-8">
        {(["sm", "default", "lg"] as const).map((size) => (
          <div key={size} className="rounded-lg border">
            <EmptyState size={size} title={c.title} description={c.description} icon={<InboxIcon />} />
          </div>
        ))}
      </div>
    )
  },
}

export const SearchResults: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx).search
    return (
      <div className="w-[400px] rounded-lg border">
        <EmptySearchResults query={c.query} title={c.title} description={c.description} />
      </div>
    )
  },
}

export const NoData: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx).data
    return (
      <div className="w-[400px] rounded-lg border">
        <EmptyData title={c.title} description={c.description} action={<Button>{c.action}</Button>} />
      </div>
    )
  },
}
