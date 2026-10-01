import type { Meta, StoryObj } from "@storybook/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../packages/fasla-ui/registry/ui/card"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"
import { Input } from "../../../../packages/fasla-ui/registry/ui/input"
import { Select } from "../../../../packages/fasla-ui/registry/ui/select"

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Sample copy, per script: an order and its notifications, as on the docs page.
 * Only the rendered text changes; the Arabic follows design/content/. The form
 * uses the library's own Input and Select, never hand-styled controls.
 */
const COPY = {
  ltr: {
    title: "Your order is on its way",
    description: "Arrives tomorrow before 6 pm.",
    content: "Order 4821 contains three items.",
    action: "Track order",
    simple: "We’ll message you when your order status changes.",
    form: {
      title: "Add a shipping address",
      description: "We deliver to your door within two days.",
      name: "Full name",
      namePlaceholder: "Enter your full name",
      city: "City",
      cityPlaceholder: "Select a city",
      cities: [
        { value: "riyadh", label: "Riyadh" },
        { value: "jeddah", label: "Jeddah" },
        { value: "dammam", label: "Dammam" },
      ],
      cancel: "Cancel",
      save: "Save address",
    },
    notifications: {
      title: "Notifications",
      description: "You have 3 unread messages.",
      items: [
        { title: "Your order has shipped.", time: "5 min ago" },
        { title: "We received your payment.", time: "1 hour ago" },
        { title: "Your subscription renews soon.", time: "2 hours ago" },
      ],
    },
  },
  rtl: {
    title: "طلبك في الطريق",
    description: "يصل غدًا قبل السادسة مساءً.",
    content: "يتضمن الطلب رقم 4821 ثلاثة منتجات.",
    action: "تتبّع الطلب",
    simple: "تصلك رسالة عند تغيّر حالة طلبك.",
    form: {
      title: "أضف عنوان الشحن",
      description: "نوصل الطلب إلى بابك خلال يومين.",
      name: "الاسم الكامل",
      namePlaceholder: "أدخل اسمك الكامل",
      city: "المدينة",
      cityPlaceholder: "اختر مدينة",
      cities: [
        { value: "riyadh", label: "الرياض" },
        { value: "jeddah", label: "جدة" },
        { value: "dammam", label: "الدمام" },
      ],
      cancel: "إلغاء",
      save: "حفظ العنوان",
    },
    notifications: {
      title: "الإشعارات",
      description: "لديك 3 رسائل غير مقروءة.",
      items: [
        { title: "تم شحن طلبك.", time: "قبل 5 دقائق" },
        { title: "استلمنا دفعتك.", time: "قبل ساعة" },
        { title: "يتجدد اشتراكك قريبًا.", time: "قبل ساعتين" },
      ],
    },
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{c.title}</CardTitle>
          <CardDescription>{c.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{c.content}</p>
        </CardContent>
        <CardFooter>
          <Button>{c.action}</Button>
        </CardFooter>
      </Card>
    )
  },
}

export const Simple: Story = {
  render: (_args, ctx) => (
    <Card className="w-[350px] p-6">
      <p>{copy(ctx).simple}</p>
    </Card>
  ),
}

export const WithForm: Story = {
  render: (_args, ctx) => {
    const f = copy(ctx).form
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{f.title}</CardTitle>
          <CardDescription>{f.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  {f.name}
                </label>
                <Input id="name" placeholder={f.namePlaceholder} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="city" className="text-sm font-medium">
                  {f.city}
                </label>
                <Select id="city" options={f.cities} placeholder={f.cityPlaceholder} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">{f.cancel}</Button>
          <Button>{f.save}</Button>
        </CardFooter>
      </Card>
    )
  },
}

export const Notification: Story = {
  render: (_args, ctx) => {
    const n = copy(ctx).notifications
    return (
      <Card className="w-[350px]">
        <CardHeader className="pb-3">
          <CardTitle>{n.title}</CardTitle>
          <CardDescription>{n.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1">
          {n.items.map((notification, i) => (
            // gap, not space-x: space-x is a physical left margin and lands on the
            // wrong side in RTL.
            <div
              key={i}
              className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground"
            >
              <span className="flex h-2 w-2 translate-y-2 rounded-full bg-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  },
}
