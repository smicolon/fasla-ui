import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "../../../../packages/fasla-ui/registry/ui/textarea"

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Textarea>

/** Sample copy, per script. The Arabic follows design/content/. */
const COPY = {
  ltr: {
    message: "Type your message here...",
    count: "Write something...",
    error: "Error state",
    noResize: "Cannot resize",
    disabled: "Disabled",
  },
  rtl: {
    message: "اكتب رسالتك هنا…",
    count: "اكتب ملاحظاتك عن الطلب…",
    error: "صف المشكلة بالتفصيل",
    noResize: "عنوان الشحن",
    disabled: "الردود مغلقة على هذه التذكرة",
  },
} as const

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: (args, ctx) => <Textarea placeholder={copy(ctx).message} className="w-[300px]" {...args} />,
}

export const WithCharacterCount: Story = {
  render: (args, ctx) => (
    <Textarea placeholder={copy(ctx).count} showCount maxLength={200} className="w-[300px]" {...args} />
  ),
}

export const Error: Story = {
  render: (args, ctx) => <Textarea placeholder={copy(ctx).error} variant="error" className="w-[300px]" {...args} />,
}

export const NoResize: Story = {
  render: (args, ctx) => <Textarea placeholder={copy(ctx).noResize} resize="none" className="w-[300px]" {...args} />,
}

export const Disabled: Story = {
  render: (args, ctx) => <Textarea placeholder={copy(ctx).disabled} disabled className="w-[300px]" {...args} />,
}
