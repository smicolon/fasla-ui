import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "../../../../packages/fasla-ui/registry/ui/checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "layout"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    description: { control: "text" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

/**
 * Sample copy, per script.
 *
 * Only the *rendered values* change — prop names stay English everywhere,
 * because they are code identifiers and the argTypes table documents the API,
 * not the sample. The Arabic follows design/content/: real situations, never a
 * placeholder, and it matches the docs site.
 *
 * The long strings deliberately avoid digits, colons and dashes: those are
 * bidi-neutral and get reordered in an RTL run, which would make the sample
 * look broken for reasons that have nothing to do with the component.
 */
const COPY = {
  ltr: {
    terms: "Accept terms and conditions",
    sizes: ["Small", "Medium", "Large"],
    marketing: "Marketing emails",
    marketingDesc: "Receive emails about new products and features",
    security: "Security alerts",
    securityDesc: "Get notified about security updates",
    backup: "Automatic backups",
    selectAll: "Select all files",
    files: ["Annual report", "Invoices", "Contract"],
    disabledUnchecked: "Disabled, unchecked",
    disabledChecked: "Disabled, checked",
    selected: "Files selected",
    long: "Email me a weekly summary of new components and release notes",
    longDesc: "Sent every Monday morning and easy to turn off at any time",
  },
  rtl: {
    terms: "أوافق على الشروط والأحكام",
    sizes: ["صغير", "متوسط", "كبير"],
    marketing: "رسائل العروض",
    marketingDesc: "تصلك رسائل عن المنتجات والميزات الجديدة",
    security: "تنبيهات الأمان",
    securityDesc: "تصلك إشعارات عن تحديثات الأمان",
    backup: "النسخ الاحتياطي التلقائي",
    selectAll: "تحديد كل الملفات",
    files: ["التقرير السنوي", "الفواتير", "العقد"],
    disabledUnchecked: "معطّل وغير محدد",
    disabledChecked: "معطّل ومحدد",
    selected: "عدد الملفات المحددة",
    long: "أرسل لي ملخصًا أسبوعيًا بالمكوّنات الجديدة وملاحظات الإصدار عبر البريد الإلكتروني",
    longDesc: "يصلك كل صباح اثنين ويمكنك إيقافه في أي وقت",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy =>
  ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr

const VARIANTS = ["default", "layout"] as const
const SIZES = ["sm", "md", "lg"] as const

const Head = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="w-fit font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/** Every control in the Controls panel drives this one. */
export const Default: Story = {
  render: (args, ctx) => <Checkbox label={copy(ctx).terms} {...args} />,
}

/** `defaultChecked` — uncontrolled, starting checked. Click it: it still toggles. */
export const Checked: Story = {
  render: (args, ctx) => <Checkbox label={copy(ctx).terms} defaultChecked {...args} />,
}

/** A dash for a partly selected group. Neither glyph mirrors in RTL. */
export const Indeterminate: Story = {
  render: (args, ctx) => <Checkbox label={copy(ctx).selectAll} indeterminate {...args} />,
}

/**
 * Figma's `Type` axis: the box and label on their own, or inside a bordered
 * card that is one click target and fills on hover.
 */
export const Variants: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid max-w-3xl gap-10 md:grid-cols-2">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col items-start gap-4">
            <Head>{variant}</Head>
            <Checkbox variant={variant} label={c.marketing} description={c.marketingDesc} />
            <Checkbox
              variant={variant}
              label={c.security}
              description={c.securityDesc}
              defaultChecked
            />
          </div>
        ))}
      </div>
    )
  },
}

/** sm, md and lg boxes (16, 20 and 24px). The label keeps one size. */
export const Sizes: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col items-start gap-4">
            <Head>{variant}</Head>
            {SIZES.map((size, i) => (
              <Checkbox
                key={size}
                variant={variant}
                size={size}
                label={c.sizes[i]}
                defaultChecked
              />
            ))}
          </div>
        ))}
      </div>
    )
  },
}

/** Disabled dims the whole checkbox, label and description included. */
export const Disabled: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col items-start gap-4">
            <Head>{variant}</Head>
            <Checkbox variant={variant} label={c.disabledUnchecked} disabled />
            <Checkbox variant={variant} label={c.disabledChecked} disabled defaultChecked />
          </div>
        ))}
      </div>
    )
  },
}

const SelectAllDemo = ({ c }: { c: Copy }) => {
  const [selected, setSelected] = React.useState<number[]>([0])
  const all = selected.length === c.files.length
  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        label={c.selectAll}
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onChange={(e) => setSelected(e.target.checked ? c.files.map((_, i) => i) : [])}
      />
      <div className="flex flex-col gap-3 ps-8">
        {c.files.map((file, i) => (
          <Checkbox
            key={file}
            size="sm"
            label={file}
            checked={selected.includes(i)}
            onChange={(e) =>
              setSelected((prev) =>
                e.target.checked ? [...prev, i] : prev.filter((x) => x !== i)
              )
            }
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {c.selected}{" "}
        <span className="font-medium tabular-nums text-foreground">{selected.length}</span>
      </p>
    </div>
  )
}

/**
 * Controlled, with an indeterminate parent: the parent is checked when every
 * child is, indeterminate when some are, and clears or fills them all.
 */
export const SelectAll: Story = {
  render: (_args, ctx) => <SelectAllDemo c={copy(ctx)} />,
}

const STATES = [
  { key: "unchecked", checked: false, indeterminate: false, disabled: false },
  { key: "checked", checked: true, indeterminate: false, disabled: false },
  { key: "indeterminate", checked: false, indeterminate: true, disabled: false },
  { key: "disabled unchecked", checked: false, indeterminate: false, disabled: true },
  { key: "disabled checked", checked: true, indeterminate: false, disabled: true },
] as const
const INTERACTIONS = ["default", "focus"] as const

const cellId = (variant: string, size: string, state: string, interaction: string) =>
  `cb-${variant}-${size}-${state.replace(" ", "-")}-${interaction}`

/** `focusVisible` goes on the `<input>`: the focus ring reads it through `peer`. */
const focusTargets = VARIANTS.flatMap((v) =>
  SIZES.flatMap((s) =>
    STATES.filter((st) => !st.disabled).map((st) => `#${cellId(v, s, st.key, "focus")} input`)
  )
)

/**
 * Every variant in the Figma set, for the direction on the toolbar.
 *
 * Figma's axes are Direction × Type × State × Interaction × Size: 60 variants.
 * Each section here is one Type, with Size down the side and State across the
 * top — Unchecked, Checked, Indeterminate, then Interaction = Disabled with
 * and without a tick. That is 30 cells, every LTR variant; flip the Direction
 * toolbar for the other 30.
 *
 * Figma has no focus variant. The extra Focus row per size shows the code's
 * ring: `storybook-addon-pseudo-states` applies the real `:focus-visible` to
 * each cell's input, so the grid cannot drift from the component. Axis names
 * stay English in both directions — they are Figma property identifiers.
 */
export const AllStates: Story = {
  parameters: {
    layout: "padded",
    pseudo: { focusVisible: focusTargets },
  },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-10">
        {VARIANTS.map((variant) => (
          <div key={variant} className="space-y-3">
            <h3 dir="ltr" className="font-sans text-sm font-medium text-foreground">
              Type = {variant}
            </h3>
            <div className="grid grid-cols-[6rem_repeat(5,max-content)] items-center gap-x-6 gap-y-3">
              <span />
              {STATES.map((st) => (
                <Head key={st.key}>{st.key[0]!.toUpperCase() + st.key.slice(1)}</Head>
              ))}
              {SIZES.flatMap((size) =>
                INTERACTIONS.map((interaction) => (
                  <React.Fragment key={`${size}-${interaction}`}>
                    <Head>
                      {size} · {interaction}
                    </Head>
                    {STATES.map((st) =>
                      interaction === "focus" && st.disabled ? (
                        <span key={st.key} />
                      ) : (
                        <div
                          key={st.key}
                          id={cellId(variant, size, st.key, interaction)}
                          className="flex min-h-9 items-center"
                        >
                          <Checkbox
                            variant={variant}
                            size={size}
                            label={c.backup}
                            defaultChecked={st.checked}
                            indeterminate={st.indeterminate}
                            disabled={st.disabled}
                          />
                        </div>
                      )
                    )}
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

const THEMES = ["light", "dark"] as const

const panelId = (theme: string, variant: string) => `panel-${theme}-${variant}-focus`

/**
 * Light and Dark side by side, whatever the theme toolbar says. Language and
 * direction follow the Direction toolbar, like every other story.
 *
 * Each panel sets its own theme: the `light` or `dark` class re-points every
 * token for that subtree. That holds on the Docs page too, where every story
 * shares one document and the theme toolbar's `dark` sits on its <html>.
 */
export const LightAndDark: Story = {
  parameters: {
    layout: "padded",
    pseudo: {
      focusVisible: THEMES.flatMap((theme) =>
        VARIANTS.map((v) => `#${panelId(theme, v)} input`)
      ),
    },
  },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[
              "space-y-4 rounded-lg border bg-background p-6 text-foreground",
              theme,
            ].join(" ")}
          >
            <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {VARIANTS.map((variant) => (
                <div key={variant} className="flex flex-col items-start gap-4">
                  <Head>{variant}</Head>
                  <Checkbox variant={variant} label={c.backup} />
                  <Checkbox variant={variant} label={c.security} defaultChecked />
                  <Checkbox variant={variant} label={c.selectAll} indeterminate />
                  <div id={panelId(theme, variant)}>
                    <Checkbox variant={variant} label={c.marketing} defaultChecked />
                  </div>
                  <Checkbox variant={variant} label={c.disabledChecked} disabled defaultChecked />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Labels long enough to wrap, at all three sizes and in both variants. The box
 * must sit on the *first* line, not in the middle of the block. Flip the
 * Direction toolbar to check the same in Arabic, where every line is 24px
 * instead of 20px and the box re-centres itself.
 */
export const WrappedLabel: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex w-72 flex-col gap-6">
        {SIZES.map((size) => (
          <Checkbox key={size} size={size} label={c.long} defaultChecked />
        ))}
        <Checkbox label={c.long} description={c.longDesc} />
        <Checkbox variant="layout" label={c.long} description={c.longDesc} />
      </div>
    )
  },
}
