import type { Meta, StoryObj } from "@storybook/react"
import { CheckIcon, MailIcon, SearchIcon, UserIcon } from "lucide-react"
import { Input } from "../../../../packages/fasla-ui/registry/ui/input"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error", "success"],
    },
    inputSize: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** Sample copy, per script. Only placeholders and values change; the Arabic follows design/content/. */
const COPY = {
  ltr: {
    enter: "Enter text...",
    variants: ["Default", "Error state", "Success state"],
    sizes: ["Small", "Default", "Large"],
    search: "Search...",
    email: "Enter email",
    both: "Both icons",
    disabled: "Disabled input",
    value: "Hello World",
    types: ["Text", "Email", "Password", "Number", "Search"],
  },
  rtl: {
    enter: "أدخل اسمك الكامل",
    variants: ["أدخل بريدك الإلكتروني", "رقم الجوّال", "اسم المستخدم"],
    sizes: ["أدخل اسمك", "أدخل اسمك", "أدخل اسمك"],
    search: "ابحث عن منتج…",
    email: "أدخل بريدك الإلكتروني",
    both: "اسم المستخدم",
    disabled: "رقم الحساب",
    value: "مرحبًا بك في فاصلة",
    types: ["الاسم الكامل", "البريد الإلكتروني", "كلمة المرور", "الكمية", "ابحث في الطلبات"],
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: (args, ctx) => <Input placeholder={copy(ctx).enter} {...args} />,
}

export const Variants: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-4 w-64">
      <Input placeholder={copy(ctx).variants[0]} variant="default" />
      <Input placeholder={copy(ctx).variants[1]} variant="error" />
      <Input placeholder={copy(ctx).variants[2]} variant="success" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-4 w-64">
      <Input placeholder={copy(ctx).sizes[0]} inputSize="sm" />
      <Input placeholder={copy(ctx).sizes[1]} inputSize="default" />
      <Input placeholder={copy(ctx).sizes[2]} inputSize="lg" />
    </div>
  ),
}

export const WithIcons: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-4 w-64">
      <Input
        placeholder={copy(ctx).search}
        startIcon={
          <SearchIcon size={16} strokeWidth={1.5} />
        }
      />
      <Input
        placeholder={copy(ctx).email}
        endIcon={
          <MailIcon size={16} strokeWidth={1.5} />
        }
      />
      <Input
        placeholder={copy(ctx).both}
        startIcon={
          <UserIcon size={16} strokeWidth={1.5} />
        }
        endIcon={
          <CheckIcon size={16} strokeWidth={1.5} />
        }
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: (args, ctx) => <Input placeholder={copy(ctx).disabled} disabled {...args} />,
}

export const WithValue: Story = {
  render: (args, ctx) => <Input defaultValue={copy(ctx).value} {...args} />,
}

export const Types: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-4 w-64">
      <Input type="text" placeholder={copy(ctx).types[0]} />
      <Input type="email" placeholder={copy(ctx).types[1]} />
      <Input type="password" placeholder={copy(ctx).types[2]} />
      <Input type="number" placeholder={copy(ctx).types[3]} />
      <Input type="search" placeholder={copy(ctx).types[4]} />
    </div>
  ),
}
