import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Form } from "@base-ui/react/form"
import { CheckIcon, EyeIcon, EyeOffIcon, MailIcon, MapPinIcon, SearchIcon, TicketIcon, UserIcon } from "lucide-react"
import { Input, type InputProps } from "../../../../packages/fasla-ui/registry/ui/input"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

/**
 * Figma: "Default Input" (414:12784). Its Size, Radius and State axes are
 * props here; Filled is the difference between a placeholder and a value;
 * Direction is the toolbar. Every story follows the Direction and Theme
 * toolbars, except Light and Dark, which shows both themes at once.
 */
const meta: Meta<InputProps> = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["standard", "rounded"] },
    status: { control: "inline-radio", options: ["default", "success"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    labelEnd: { control: "text" },
    description: { control: "text" },
    descriptionEnd: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    // Slots and Base UI's own escape hatches, not props a reader drives here.
    startIcon: { table: { disable: true } },
    endIcon: { table: { disable: true } },
    style: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: { size: "md", radius: "standard", status: "default", invalid: false, disabled: false },
}

export default meta
type Story = StoryObj<InputProps>

/**
 * Sample copy, per script: a checkout and account form. Only the rendered
 * text changes — prop names stay English everywhere. The Arabic is written
 * from design/content/, not translated.
 */
const COPY = {
  ltr: {
    name: "Full name",
    namePlaceholder: "Layla Haddad",
    nameValue: "Nadia Rahman",
    optional: "Optional",
    nameHelp: "As it appears on your ID.",
    nameCount: "12/40",
    nameOk: "Matches your ID.",
    nameError: "Enter your full name.",
    email: "Email",
    emailPlaceholder: "name@example.com",
    emailValue: "nadia@example.com",
    emailHelp: "We send the receipt here.",
    emailError: "Enter an email address, like name@example.com.",
    search: "Search orders",
    searchPlaceholder: "Order number or product",
    password: "Password",
    passwordHelp: "At least 8 characters.",
    show: "Show password",
    coupon: "Coupon code",
    couponOk: "Coupon applied.",
    couponSaving: "−20%",
    save: "Save",
    address: "Delivery address",
    longLabel: "Name of the person who will collect the order from the pickup point",
    longLabelEnd: "Required for pickup",
    longHelp:
      "We show this name to the courier and on the pickup slip, so use the name on the ID they will check at the counter.",
    longValue: "Building 14, King Fahd Road, Al Olaya District, Riyadh 12211, Saudi Arabia",
    longError: "This address is outside our delivery area. Choose a pickup point or enter another address.",
  },
  rtl: {
    name: "الاسم الكامل",
    namePlaceholder: "ليلى حداد",
    nameValue: "نادية رحمن",
    optional: "اختياري",
    nameHelp: "كما يظهر في بطاقة الهوية.",
    nameCount: "10/40",
    nameOk: "الاسم مطابق للهوية.",
    nameError: "أدخل اسمك الكامل.",
    email: "البريد الإلكتروني",
    emailPlaceholder: "name@example.com",
    emailValue: "nadia@example.com",
    emailHelp: "نرسل إليه إيصال الطلب.",
    emailError: "أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com",
    search: "ابحث في الطلبات",
    searchPlaceholder: "رقم الطلب أو اسم المنتج",
    password: "كلمة المرور",
    passwordHelp: "8 أحرف على الأقل.",
    show: "إظهار كلمة المرور",
    coupon: "رمز الخصم",
    couponOk: "طُبِّق الخصم على طلبك.",
    couponSaving: "خصم 20%",
    save: "حفظ",
    address: "عنوان التوصيل",
    longLabel: "اسم الشخص الذي سيستلم الطلب من نقطة الاستلام",
    longLabelEnd: "مطلوب عند الاستلام",
    longHelp:
      "يظهر هذا الاسم لمندوب التوصيل وعلى إيصال الاستلام، فاكتبه كما هو في الهوية التي ستُعرض عند الاستلام.",
    longValue: "مبنى 14، طريق الملك فهد، حي العليا، الرياض 12211، المملكة العربية السعودية",
    longError: "هذا العنوان خارج نطاق التوصيل. اختر نقطة استلام أو أدخل عنوانًا آخر.",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const SIZES = ["xs", "sm", "md", "lg"] as const
const RADII = ["standard", "rounded"] as const
const STATES = ["default", "focus", "success", "destructive", "disabled"] as const
type State = (typeof STATES)[number]
const FILLS = ["placeholder", "value"] as const

/** The props that put a field in one of Figma's States. Focus is forced by the pseudo-states addon. */
const stateProps = (state: State): Partial<InputProps> =>
  state === "success"
    ? { status: "success" }
    : state === "destructive"
      ? { invalid: true }
      : state === "disabled"
        ? { disabled: true }
        : {}

const title = (s: string) => s[0]!.toUpperCase() + s.slice(1)

/** A caption: Figma property names, so English and left-to-right in both directions. */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/**
 * A row caption that sits on the line of the field's label. It is as tall as
 * the label row — 4px padding round one `text-sm` line, a zero-width strut
 * holding the line height — so it centres on the label in either script.
 */
const LabelLineHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="flex items-center p-1 font-sans text-xs text-muted-foreground">
    <span aria-hidden className="text-sm">
      {"​"}
    </span>
    {children}
  </span>
)

/** Cells forced into Focus: the pseudo-states addon applies the real `:focus-within` to their boxes. */
const FOCUS_CELLS = ["[data-state-cell=focus] [data-slot=input-box]"]

/** The playground: every prop on the Controls panel. */
export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <Input
        {...args}
        className="w-72"
        label={args.label ?? c.name}
        placeholder={args.placeholder ?? c.namePlaceholder}
        description={args.description ?? c.nameHelp}
      />
    )
  },
}

/**
 * Figma's four sizes — 28, 32, 36 and 40px fields — empty and filled. The
 * text is the same at every size (16px below `md`, so iOS does not zoom,
 * and Figma's SM from `md` up); only the height and the icon
 * gap change.
 */
export const Sizes: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max grid-cols-[3rem_repeat(2,18rem)] items-center gap-x-6 gap-y-4">
        <span />
        {FILLS.map((fill) => (
          <Head key={fill}>{title(fill)}</Head>
        ))}
        {SIZES.map((size) => (
          <React.Fragment key={size}>
            <Head>{size}</Head>
            {FILLS.map((fill) => (
              <Input
                key={fill}
                size={size}
                aria-label={c.search}
                startIcon={<SearchIcon />}
                placeholder={c.searchPlaceholder}
                defaultValue={fill === "value" ? "#48213" : undefined}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/** Standard is Figma's `border radius/md` (8px); Rounded is a full pill. */
export const Radius: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max grid-cols-[5rem_repeat(2,18rem)] items-center gap-x-6 gap-y-4">
        <span />
        {FILLS.map((fill) => (
          <Head key={fill}>{title(fill)}</Head>
        ))}
        {RADII.map((radius) => (
          <React.Fragment key={radius}>
            <Head>{title(radius)}</Head>
            {FILLS.map((fill) => (
              <Input
                key={fill}
                radius={radius}
                aria-label={c.email}
                startIcon={<MailIcon />}
                placeholder={c.emailPlaceholder}
                defaultValue={fill === "value" ? c.emailValue : undefined}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's five States, empty and filled, with the label and helper labels on,
 * since Success and Destructive recolour them too. Focus is the real
 * `:focus-within`, forced by the pseudo-states addon. Destructive shows the
 * error message in place of the description.
 */
export const States: Story = {
  parameters: { layout: "padded", pseudo: { focusWithin: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max grid-cols-[6rem_repeat(2,18rem)] items-start gap-x-6 gap-y-5">
        <span />
        {FILLS.map((fill) => (
          <Head key={fill}>{title(fill)}</Head>
        ))}
        {STATES.map((state) => (
          <React.Fragment key={state}>
            <LabelLineHead>{title(state)}</LabelLineHead>
            {FILLS.map((fill) => (
              <div key={fill} data-state-cell={state}>
                <Input
                  {...stateProps(state)}
                  label={c.name}
                  labelEnd={c.optional}
                  description={state === "success" ? c.nameOk : c.nameHelp}
                  descriptionEnd={fill === "value" ? c.nameCount : "0/40"}
                  error={c.nameError}
                  placeholder={c.namePlaceholder}
                  defaultValue={fill === "value" ? c.nameValue : undefined}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Every LTR variant in the Figma set — Size × Filled × State, once per Radius
 * — for the direction on the toolbar. Flip the Direction toolbar for RTL.
 */
export const AllVariants: Story = {
  parameters: { layout: "padded", pseudo: { focusWithin: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-8">
        {RADII.map((radius) => (
          <div key={radius} className="space-y-3">
            <h3 dir="ltr" className="font-sans text-sm font-medium text-foreground">
              Radius = {title(radius)}
            </h3>
            <div className="grid w-max grid-cols-[5.5rem_repeat(5,9.5rem)] items-center gap-x-3 gap-y-3">
              <span />
              {STATES.map((state) => (
                <Head key={state}>{title(state)}</Head>
              ))}
              {SIZES.map((size) =>
                FILLS.map((fill) => (
                  <React.Fragment key={`${size}-${fill}`}>
                    <Head>
                      {size} · {fill}
                    </Head>
                    {STATES.map((state) => (
                      <div key={state} data-state-cell={state}>
                        <Input
                          {...stateProps(state)}
                          size={size}
                          radius={radius}
                          aria-label={c.name}
                          placeholder={c.namePlaceholder}
                          defaultValue={fill === "value" ? c.nameValue : undefined}
                        />
                      </div>
                    ))}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * The show-password toggle: a real button in the end slot. Its name stays
 * "Show password" and `aria-pressed` says whether it is on, so a screen reader
 * hears one control changing state rather than a control that renames itself.
 */
function PasswordField({ c, ...props }: { c: Copy } & Partial<InputProps>) {
  const [visible, setVisible] = React.useState(false)
  return (
    <Input
      label={c.password}
      description={c.passwordHelp}
      type={visible ? "text" : "password"}
      defaultValue="correct-horse"
      endIcon={
        <button
          type="button"
          aria-label={c.show}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          className="-m-1 flex rounded-[var(--radius-sm)] p-1 text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      {...props}
    />
  )
}

/**
 * Each optional part on its own, then all together: the label, the note at
 * the end of the label row, the helper labels at the start and end of the
 * row below, and the icons. Flip the Direction toolbar: everything that sits
 * at a start or an end swaps sides.
 */
export const Parts: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const cells: [string, React.ReactNode][] = [
      ["label", <Input label={c.name} placeholder={c.namePlaceholder} />],
      ["label + labelEnd", <Input label={c.name} labelEnd={c.optional} placeholder={c.namePlaceholder} />],
      ["description", <Input label={c.email} description={c.emailHelp} placeholder={c.emailPlaceholder} />],
      [
        "description + descriptionEnd",
        <Input label={c.name} description={c.nameHelp} descriptionEnd={c.nameCount} defaultValue={c.nameValue} />,
      ],
      [
        "Every part",
        <Input
          label={c.name}
          labelEnd={c.optional}
          description={c.nameHelp}
          descriptionEnd={c.nameCount}
          startIcon={<UserIcon />}
          defaultValue={c.nameValue}
        />,
      ],
      [
        "No label, description only",
        <Input aria-label={c.search} description={c.searchPlaceholder} startIcon={<SearchIcon />} />,
      ],
      ["startIcon", <Input aria-label={c.search} startIcon={<SearchIcon />} placeholder={c.searchPlaceholder} />],
      ["endIcon", <Input aria-label={c.email} endIcon={<MailIcon />} placeholder={c.emailPlaceholder} />],
      [
        "Both icons",
        <Input
          label={c.coupon}
          status="success"
          description={c.couponOk}
          descriptionEnd={c.couponSaving}
          startIcon={<TicketIcon />}
          endIcon={<CheckIcon />}
          defaultValue="AUTUMN20"
        />,
      ],
      ["endIcon as a button", <PasswordField c={c} />],
    ]
    return (
      <div className="grid w-max grid-cols-[repeat(2,20rem)] items-start gap-x-8 gap-y-6">
        {cells.map(([caption, field]) => (
          <div key={caption} className="flex flex-col gap-1.5">
            <Head>{caption}</Head>
            {field}
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Long copy in every part. The label and the helper text wrap; the notes at
 * the ends of the rows wrap within half the row; a value longer than the
 * field ends in an ellipsis until it has focus, then scrolls, as a native
 * input does.
 */
export const LongText: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max grid-cols-[repeat(2,20rem)] items-start gap-x-8 gap-y-6">
        <Input
          label={c.longLabel}
          labelEnd={c.longLabelEnd}
          description={c.longHelp}
          descriptionEnd="0/40"
          placeholder={c.namePlaceholder}
        />
        <Input
          label={c.address}
          startIcon={<MapPinIcon />}
          endIcon={<SearchIcon />}
          defaultValue={c.longValue}
          invalid
          error={c.longError}
        />
      </div>
    )
  },
}

/**
 * Base UI's validation, live. Submit the empty form: the field turns invalid
 * and the error replaces the description. Typing a valid address clears it.
 */
export const Validation: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Form className="flex w-80 flex-col items-start gap-3" onSubmit={(event) => event.preventDefault()}>
        <Input
          name="email"
          type="email"
          required
          label={c.email}
          description={c.emailHelp}
          error={c.emailError}
          placeholder={c.emailPlaceholder}
          startIcon={<MailIcon />}
        />
        <Button type="submit">{c.save}</Button>
      </Form>
    )
  },
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark, one panel each, whatever the theme toolbar says. Each panel
 * sets its own theme: the `light` or `dark` class re-points every token for
 * that subtree. Language and direction follow the Direction toolbar.
 */
export const LightAndDark: Story = {
  parameters: { layout: "padded", pseudo: { focusWithin: FOCUS_CELLS } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid w-max gap-4">
        {THEMES.map((theme) => (
          <div key={theme} className={[theme, "rounded-lg border bg-background p-6 text-foreground"].join(" ")}>
            <Head className="block pb-4">{title(theme)}</Head>
            <div className="grid grid-cols-[repeat(3,15rem)] items-start gap-x-6 gap-y-5">
              {STATES.map((state) => (
                <div key={state} data-state-cell={state} className="flex flex-col gap-1.5">
                  <Head>{title(state)}</Head>
                  <Input
                    {...stateProps(state)}
                    label={c.name}
                    description={state === "success" ? c.nameOk : c.nameHelp}
                    error={c.nameError}
                    startIcon={<UserIcon />}
                    defaultValue={state === "default" ? undefined : c.nameValue}
                    placeholder={c.namePlaceholder}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <Head>Rounded</Head>
                <Input radius="rounded" aria-label={c.search} startIcon={<SearchIcon />} placeholder={c.searchPlaceholder} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  },
}
