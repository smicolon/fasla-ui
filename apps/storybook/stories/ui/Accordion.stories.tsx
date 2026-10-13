import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Bell, CreditCard, LockKeyhole, UserRound } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
} from "../../../../packages/fasla-ui/registry/ui/accordion"
import { Avatar } from "../../../../packages/fasla-ui/registry/ui/avatar/avatar"

/**
 * `variant` and `indicator` live on `Accordion`, so every item in a group
 * matches, as Figma's doc asks. Avatar, Icons and Multi-level are not props:
 * they are compositions, shown in their own stories below.
 */
const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "split", "outline", "table"] },
    indicator: { control: "inline-radio", options: ["chevron", "plus"] },
    multiple: { control: "boolean" },
    // Controlled state and Base UI's own escape hatches, not props a reader
    // needs from the explorer. Disabled has no Figma treatment yet.
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    disabled: { table: { disable: true } },
    render: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: { variant: "default", indicator: "chevron", multiple: false },
}

export default meta
type Story = StoryObj<typeof Accordion>

/**
 * Sample copy, per script: an online shop's delivery questions. Only the
 * rendered text changes; prop names stay English. The Arabic is written in
 * Modern Standard Arabic and matches the docs site.
 */
const COPY = {
  ltr: {
    faq: [
      {
        q: "How long does delivery take?",
        a: "Orders arrive in 2 to 4 working days. You get a tracking link as soon as the parcel leaves our warehouse.",
      },
      {
        q: "Can I change my order after paying?",
        a: "Yes, within an hour of paying. Open the order from your account and choose Edit order.",
      },
      {
        q: "What is your returns policy?",
        a: "Return any unused item within 30 days and we refund the full amount.",
      },
      {
        q: "Do you ship outside the country?",
        a: "We ship to every Gulf country. Shipping costs show at checkout.",
      },
    ],
    long: {
      q: "Can I combine a gift card, a discount code and store credit on the same order, and what happens to whatever is left on the gift card afterwards?",
      a: "Yes. Apply them at checkout in any order and we take store credit first, then the gift card. Anything left on the gift card stays on it for its full validity, and you can see the balance under Wallet in your account at any time.",
    },
    people: [
      { name: "Layla Haddad", photo: true, role: "Handles billing and invoices. Replies within one working day." },
      { name: "Omar Khalil", role: "Looks after deliveries and returns, from courier issues to refunds." },
      { name: "Sara Mansour", role: "Answers product questions before you buy." },
      { name: "Yousef Nasser", role: "Runs business accounts and orders in bulk." },
    ],
    settings: [
      { icon: UserRound, title: "Account", body: "Change your name, email address and the language the store shows you." },
      { icon: Bell, title: "Notifications", body: "Choose which order updates reach you by email and which by text message." },
      { icon: LockKeyhole, title: "Privacy and security", body: "Turn on two-step sign-in and review the devices signed in to your account." },
      { icon: CreditCard, title: "Payment methods", body: "Add a card, remove an old one or pick the card you pay with by default." },
    ],
    nested: {
      title: "Account settings",
      body: "Everything about how you sign in and what we know about you.",
      children: [
        { q: "Profile", a: "Your name, photo and the address we deliver to." },
        { q: "Sign-in and security", a: "Your password, two-step sign-in and active sessions." },
      ],
      rest: [
        { q: "Orders", a: "Track, change or cancel an order." },
        { q: "Payments", a: "Your saved cards and gift card balance." },
        { q: "Help", a: "Talk to our support team." },
      ],
    },
    label: "Delivery questions",
  },
  rtl: {
    faq: [
      {
        q: "كم يستغرق التوصيل؟",
        a: "يصل طلبك خلال 2 إلى 4 أيام عمل، وتصلك رسالة فيها رابط التتبّع فور خروج الشحنة من مستودعنا.",
      },
      {
        q: "هل يمكنني تعديل طلبي بعد الدفع؟",
        a: "نعم، خلال ساعة من الدفع. افتح الطلب من حسابك واختر تعديل الطلب.",
      },
      {
        q: "ما سياسة الإرجاع؟",
        a: "أعِد أي منتج لم تستخدمه خلال 30 يومًا، ونرد إليك المبلغ كاملًا.",
      },
      {
        q: "هل تشحنون إلى خارج البلاد؟",
        a: "نشحن إلى جميع دول الخليج، وتظهر تكلفة الشحن عند إتمام الطلب.",
      },
    ],
    long: {
      q: "هل يمكنني الجمع بين بطاقة هدية ورمز خصم ورصيد المتجر في الطلب نفسه، وماذا يحدث لما يتبقى في بطاقة الهدية بعد ذلك؟",
      a: "نعم. أضفها عند إتمام الطلب بأي ترتيب، ونخصم من رصيد المتجر أولًا ثم من بطاقة الهدية. يبقى ما تبقى في البطاقة صالحًا حتى نهاية مدتها، ويمكنك متابعة الرصيد من المحفظة في حسابك متى شئت.",
    },
    people: [
      { name: "ليلى حداد", photo: true, role: "تتولى الفواتير والمدفوعات، وترد خلال يوم عمل واحد." },
      { name: "عمر خليل", role: "يتابع التوصيل والإرجاع، من مشكلات شركة الشحن إلى استرداد المبالغ." },
      { name: "سارة منصور", role: "تجيب عن أسئلتك حول المنتجات قبل الشراء." },
      { name: "يوسف ناصر", role: "يدير حسابات الشركات والطلبات بالجملة." },
    ],
    settings: [
      { icon: UserRound, title: "الحساب", body: "غيّر اسمك وبريدك الإلكتروني واللغة التي يظهر بها المتجر." },
      { icon: Bell, title: "الإشعارات", body: "اختر تحديثات الطلب التي تصلك بالبريد وتلك التي تصلك برسالة نصية." },
      { icon: LockKeyhole, title: "الخصوصية والأمان", body: "فعّل التحقق بخطوتين، وراجع الأجهزة المسجَّل دخولها إلى حسابك." },
      { icon: CreditCard, title: "طرق الدفع", body: "أضف بطاقة، أو احذف بطاقة قديمة، أو اختر البطاقة التي تدفع بها عادةً." },
    ],
    nested: {
      title: "إعدادات الحساب",
      body: "كل ما يخص تسجيل دخولك والبيانات التي نحفظها عنك.",
      children: [
        { q: "الملف الشخصي", a: "اسمك وصورتك وعنوان التوصيل." },
        { q: "تسجيل الدخول والأمان", a: "كلمة المرور والتحقق بخطوتين والجلسات النشطة." },
      ],
      rest: [
        { q: "الطلبات", a: "تتبّع طلبًا أو عدّله أو ألغِه." },
        { q: "المدفوعات", a: "بطاقاتك المحفوظة ورصيد بطاقات الهدايا." },
        { q: "المساعدة", a: "تواصل مع فريق الدعم." },
      ],
    },
    label: "أسئلة التوصيل",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const PHOTO = "/samples/avatar-portrait.png"
const INDICATORS = ["chevron", "plus"] as const
const VARIANTS = ["default", "split", "outline", "table"] as const

/** A caption: Figma property names stay English and left-to-right in both directions. */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["block w-fit font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/** The four delivery questions, the first open unless told otherwise. */
const Faq = ({
  c,
  open = ["0"],
  ...props
}: Partial<AccordionProps> & { c: Copy; open?: string[] }) => (
  <Accordion defaultValue={open} {...props}>
    {c.faq.map((item, i) => (
      <AccordionItem key={item.q} value={String(i)}>
        <AccordionTrigger>{item.q}</AccordionTrigger>
        <AccordionContent>{item.a}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
)

/**
 * Chevron and plus side by side, each under its caption. The two columns
 * share a top edge and stack below 640px.
 */
const Indicators = ({ c, args }: { c: Copy; args: Partial<AccordionProps> }) => (
  <div className="mx-auto grid max-w-[880px] items-start gap-x-10 gap-y-8 sm:grid-cols-2">
    {INDICATORS.map((indicator) => (
      <div key={indicator} className="flex min-w-0 flex-col gap-3">
        <Head>indicator = {indicator}</Head>
        <Faq c={c} {...args} indicator={indicator} />
      </div>
    ))}
  </div>
)

/** Figma `Variants=Default`: a divider under every item but the last. */
export const Default: Story = {
  args: { variant: "default" },
  render: (args, ctx) => <Indicators c={copy(ctx)} args={args} />,
}

/** Figma `Variants=Split`: each item a card with `shadow-md`, 8px apart. */
export const Split: Story = {
  args: { variant: "split" },
  render: (args, ctx) => <Indicators c={copy(ctx)} args={args} />,
}

/** Figma `Variants=Outline`: a border round each item, 8px apart, 16px rows. */
export const Outline: Story = {
  args: { variant: "outline" },
  render: (args, ctx) => <Indicators c={copy(ctx)} args={args} />,
}

/** Figma `Variants=Table Accordion`: one 10px-radius box round the whole group. */
export const Table: Story = {
  args: { variant: "table" },
  render: (args, ctx) => <Indicators c={copy(ctx)} args={args} />,
}

/** Every control drives this one. Turn on `multiple` to keep several items open. */
export const Playground: Story = {
  render: (args, ctx) => (
    <div className="mx-auto w-full max-w-[420px]">
      <Faq c={copy(ctx)} {...args} />
    </div>
  ),
}

/**
 * A title that wraps over several lines, with a long answer. The indicator
 * stays centred on the title block, at the inline end. Default and Table side
 * by side.
 */
export const LongTitle: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="mx-auto grid max-w-[880px] items-start gap-x-10 gap-y-8 sm:grid-cols-2">
        {(["default", "table"] as const).map((variant) => (
          <div key={variant} className="flex min-w-0 flex-col gap-3">
            <Head>variant = {variant}</Head>
            <Accordion {...args} variant={variant} defaultValue={["long"]}>
              <AccordionItem value="long">
                <AccordionTrigger>{c.long.q}</AccordionTrigger>
                <AccordionContent>{c.long.a}</AccordionContent>
              </AccordionItem>
              {c.faq.slice(0, 2).map((item, i) => (
                <AccordionItem key={item.q} value={String(i)}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Figma `Variants=Avatar`, composed: our Avatar before the name, inside the
 * trigger. The body is indented by the avatar and the 12px gap (`ps-11`) so
 * it lines up under the name. Hover underlines the name, never the initials.
 * The first avatar has a photo; the rest fall back to initials. Avatar size
 * 32 with no status indicator, as in Figma.
 */
export const WithAvatar: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="mx-auto w-full max-w-[420px]">
        <Accordion {...args} defaultValue={["0"]}>
          {c.people.map((person, i) => (
            <AccordionItem key={person.name} value={String(i)}>
              <AccordionTrigger>
                {/* The name beside it labels the row, so the avatar is hidden
                    from assistive tech rather than read twice. */}
                <Avatar name={person.name} src={"photo" in person ? PHOTO : undefined} aria-hidden="true" />
                <span>{person.name}</span>
              </AccordionTrigger>
              <AccordionContent className="ps-11">{person.role}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  },
}

/**
 * Figma `Variants=Icons`, composed: a 16px Lucide icon before the title, at
 * Figma's 1px stroke (`strokeWidth={1.5}`). The trigger sizes it and keeps it
 * out of the hover underline; mark it `aria-hidden`, the title names the row.
 */
export const WithIcons: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="mx-auto w-full max-w-[420px]">
        <Accordion {...args} defaultValue={["0"]}>
          {c.settings.map(({ icon: Icon, title, body }, i) => (
            <AccordionItem key={title} value={String(i)}>
              <AccordionTrigger>
                <Icon aria-hidden="true" strokeWidth={1.5} />
                {title}
              </AccordionTrigger>
              <AccordionContent>{body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  },
}

/**
 * Figma `Variants=Multi-level`, composed: a second Accordion inside the first
 * item's content. The nested group runs edge to edge in the Table box
 * (`-mx-5`) and indents its rows to 40px (`px-10`), so the two levels read
 * apart; its top border continues the dividers.
 */
export const MultiLevel: Story = {
  args: { variant: "table" },
  render: (args, ctx) => {
    const c = copy(ctx).nested
    return (
      <div className="mx-auto w-full max-w-[420px]">
        <Accordion {...args} defaultValue={["parent"]}>
          <AccordionItem value="parent">
            <AccordionTrigger>{c.title}</AccordionTrigger>
            <AccordionContent className="-mx-5 pb-0">
              <p className="px-5 pb-4">{c.body}</p>
              <Accordion indicator={args.indicator} defaultValue={["0"]} className="border-t border-border">
                {c.children.map((child, i) => (
                  <AccordionItem key={child.q} value={String(i)} className="px-10">
                    <AccordionTrigger>{child.q}</AccordionTrigger>
                    <AccordionContent>{child.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
          {c.rest.map((item, i) => (
            <AccordionItem key={item.q} value={`rest-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  },
}

const STATES = ["Default", "Hover", "Focus"] as const
const OPENED = ["Closed", "Open"] as const
const cellId = (state: string, opened: string) => `accordion-${state}-${opened}`.toLowerCase()
const cellsFor = (state: (typeof STATES)[number]) =>
  OPENED.map((opened) => `#${cellId(state, opened)} [data-slot=accordion-trigger]`)

/**
 * Figma's `Accordion Item` set: State across the top, Opened down the side.
 * Hover underlines the title; Focus draws a 2px `ring` that stays inside the
 * row's top and bottom edges and reaches 6px past each side.
 *
 * Hover and Focus render statically: `storybook-addon-pseudo-states` applies
 * the real `:hover` and `:focus-visible` to those cells, so the grid cannot
 * drift from the component. Each row label sits on its trigger's line.
 */
export const States: Story = {
  parameters: {
    pseudo: { hover: cellsFor("Hover"), focusVisible: cellsFor("Focus") },
  },
  render: (args, ctx) => {
    const c = copy(ctx)
    const item = c.faq[0]
    return (
      <div className="mx-auto grid max-w-[920px] grid-cols-[auto_repeat(3,minmax(0,1fr))] items-start gap-x-8 gap-y-6">
        <span />
        {STATES.map((state) => (
          <Head key={state}>{state}</Head>
        ))}
        {OPENED.map((opened) => (
          <React.Fragment key={opened}>
            {/* The trigger's own height, so the label sits on its line. */}
            <Head className="flex h-11 items-center rtl:h-12">{opened}</Head>
            {STATES.map((state) => (
              <div key={state} id={cellId(state, opened)} className="min-w-0">
                <Accordion {...args} value={opened === "Open" ? ["0"] : []}>
                  <AccordionItem value="0">
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * English and Arabic side by side, whatever the Direction toolbar says. The
 * indicator moves to the inline end without being mirrored, and Arabic rows
 * take Cairo's taller 24px line, so they are 4px taller.
 */
export const BothDirections: Story = {
  args: { variant: "table" },
  render: (args) => (
    <div className="mx-auto grid max-w-[880px] items-start gap-x-10 gap-y-8 sm:grid-cols-2">
      {(["ltr", "rtl"] as const).map((dir) => (
        <div key={dir} className="flex min-w-0 flex-col gap-3">
          <Head>{dir === "rtl" ? "RTL" : "LTR"}</Head>
          <div dir={dir} lang={dir === "rtl" ? "ar" : "en"} className={dir === "rtl" ? "font-arabic" : "font-sans"}>
            <Faq c={COPY[dir]} {...args} />
          </div>
        </div>
      ))}
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark side by side, whatever the theme toolbar says, as Figma's
 * doc shows every variant. One row per variant; language and direction follow
 * the Direction toolbar. Each panel's `light` or `dark` class re-points every
 * token for its subtree.
 */
export const LightAndDark: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="mx-auto flex max-w-[920px] flex-col gap-6">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-3">
            <Head>variant = {variant}</Head>
            <div className="grid items-start gap-4 sm:grid-cols-2">
              {THEMES.map((theme) => (
                <div
                  key={theme}
                  className={["rounded-lg border bg-background p-5 text-foreground", theme].join(" ")}
                >
                  <Faq c={c} {...args} variant={variant} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}
