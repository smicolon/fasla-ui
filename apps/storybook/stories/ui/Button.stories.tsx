import type { Meta, StoryObj } from "@storybook/react"
import { DownloadIcon, PlusIcon, UploadIcon } from "lucide-react"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Sample copy, per script: the same account actions as the docs page. Only the
 * labels change; the Arabic follows design/content/.
 */
const COPY = {
  ltr: {
    save: "Save changes",
    variants: ["Save changes", "Preview", "Delete account", "Cancel", "Skip", "View details"],
    loading: "Saving…",
    loadingLabel: "Saving",
    disabled: "Save changes",
    upload: "Upload",
    download: "Download",
    add: "Add",
  },
  rtl: {
    save: "حفظ التغييرات",
    variants: ["حفظ التغييرات", "معاينة", "حذف الحساب", "إلغاء", "تخطّي", "عرض التفاصيل"],
    loading: "جارٍ الحفظ…",
    loadingLabel: "جارٍ الحفظ",
    disabled: "حفظ التغييرات",
    upload: "رفع ملف",
    download: "تنزيل",
    add: "إضافة",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)
const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const

export const Default: Story = {
  render: (args, ctx) => <Button {...args}>{args.children ?? copy(ctx).save}</Button>,
}

export const Variants: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-wrap gap-4">
      {VARIANTS.map((variant, i) => (
        <Button key={variant} variant={variant}>
          {copy(ctx).variants[i]}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (_args, ctx) => (
    <div className="flex items-center gap-4">
      <Button size="sm">{copy(ctx).save}</Button>
      <Button size="default">{copy(ctx).save}</Button>
      <Button size="lg">{copy(ctx).save}</Button>
      <Button size="icon" aria-label={copy(ctx).add}>
        <PlusIcon size={16} strokeWidth={1.5} />
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: (args, ctx) => (
    <Button loading loadingLabel={copy(ctx).loadingLabel} {...args}>
      {args.children ?? copy(ctx).loading}
    </Button>
  ),
}

export const Disabled: Story = {
  render: (args, ctx) => (
    <Button disabled {...args}>
      {args.children ?? copy(ctx).disabled}
    </Button>
  ),
}

export const WithIcon: Story = {
  render: (_args, ctx) => (
    <div className="flex gap-4">
      <Button>
        <UploadIcon size={16} strokeWidth={1.5} />
        {copy(ctx).upload}
      </Button>
      <Button variant="outline">
        {copy(ctx).download}
        <DownloadIcon size={16} strokeWidth={1.5} />
      </Button>
    </div>
  ),
}

export const AllVariantsDisabled: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-wrap gap-4">
      {VARIANTS.map((variant, i) => (
        <Button key={variant} variant={variant} disabled>
          {copy(ctx).variants[i]}
        </Button>
      ))}
    </div>
  ),
}
