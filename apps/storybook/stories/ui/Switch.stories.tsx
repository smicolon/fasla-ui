import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "../../../../packages/fasla-ui/registry/ui/switch"

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline"] },
    layout: { control: "inline-radio", options: ["control-first", "label-first"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

/**
 * Sample copy, per script.
 *
 * Only the *rendered values* change — prop names stay English everywhere,
 * because they are code identifiers and the argTypes table documents the API,
 * not the sample. The Arabic follows design/content/: a real situation (a
 * settings screen), never a placeholder, and it matches the docs site.
 *
 * The long strings deliberately avoid digits, colons and dashes: those are
 * bidi-neutral and get reordered in an RTL run, which would make the sample
 * look broken for reasons that have nothing to do with the component.
 */
const COPY = {
  ltr: {
    label: "Airplane mode",
    sizes: ["Small", "Medium", "Large"],
    sync: "Auto-sync",
    location: "Location services",
    dark: "Dark mode",
    darkDesc: "Toggle dark mode on or off",
    notifications: "Notifications",
    notificationsDesc: "Receive push notifications",
    disabledOff: "Disabled, off",
    disabledOn: "Disabled, on",
    checked: "checked",
    longLabel: "Download updates over mobile data when Wi-Fi is unavailable",
    longDesc: "Large updates may use a lot of data on a limited plan",
  },
  rtl: {
    label: "وضع الطيران",
    sizes: ["صغير", "متوسط", "كبير"],
    sync: "المزامنة التلقائية",
    location: "خدمات الموقع",
    dark: "الوضع الداكن",
    darkDesc: "شغّل الوضع الداكن أو أوقفه",
    notifications: "الإشعارات",
    notificationsDesc: "تصلك الإشعارات الفورية",
    disabledOff: "معطّل ومتوقف",
    disabledOn: "معطّل وقيد التشغيل",
    checked: "الحالة الحالية",
    longLabel: "تنزيل التحديثات تلقائيًا عبر بيانات الجوّال عند غياب شبكة Wi-Fi",
    longDesc: "قد تستهلك التحديثات الكبيرة جزءًا كبيرًا من باقة البيانات",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy =>
  ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr

const VARIANTS = ["solid", "outline"] as const
const LAYOUTS = ["control-first", "label-first"] as const
const SIZES = ["sm", "md", "lg"] as const

const Head = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/** Every control in the Controls panel drives this one. */
export const Default: Story = {
  render: (args, ctx) => <Switch label={copy(ctx).label} {...args} />,
}

/** `defaultChecked` — uncontrolled, starting on. Click it: it still toggles. */
export const Checked: Story = {
  render: (args, ctx) => <Switch label={copy(ctx).label} defaultChecked {...args} />,
}

/** Figma's `Style` axis: a filled track, or an outlined one with a filled thumb. */
export const Variants: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-4">
            <Head>{variant}</Head>
            <Switch variant={variant} label={c.sync} />
            <Switch variant={variant} label={c.location} defaultChecked />
          </div>
        ))}
      </div>
    )
  },
}

/** sm, md and lg tracks (32, 40 and 48px wide). The label keeps one size. */
export const Sizes: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-4">
            <Head>{variant}</Head>
            {SIZES.map((size, i) => (
              <Switch
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

/**
 * Figma's `Type` axis. `control-first` puts the track before the label and
 * indents the description under it; `label-first` fills its row and puts the
 * track at the end, which is what a settings list wants.
 */
export const Layouts: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid max-w-3xl gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Head>control-first</Head>
          <Switch label={c.dark} description={c.darkDesc} />
          <Switch label={c.notifications} description={c.notificationsDesc} defaultChecked />
        </div>
        <div className="flex flex-col gap-4">
          <Head>label-first</Head>
          <div className="divide-y rounded-lg border">
            <Switch layout="label-first" label={c.dark} description={c.darkDesc} className="p-4" />
            <Switch
              layout="label-first"
              label={c.notifications}
              description={c.notificationsDesc}
              className="p-4"
              defaultChecked
            />
            <Switch layout="label-first" label={c.label} className="p-4" />
          </div>
        </div>
      </div>
    )
  },
}

/** Disabled dims the whole switch, label and description included. */
export const Disabled: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-4">
            <Head>{variant}</Head>
            <Switch variant={variant} label={c.disabledOff} disabled />
            <Switch variant={variant} label={c.disabledOn} disabled defaultChecked />
          </div>
        ))}
      </div>
    )
  },
}

const ControlledDemo = ({ c }: { c: Copy }) => {
  const [enabled, setEnabled] = React.useState(true)
  return (
    <div className="flex flex-col gap-3">
      <Switch
        label={c.notifications}
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
      />
      <p className="text-sm text-muted-foreground">
        {c.checked}: <code dir="ltr">{String(enabled)}</code>
      </p>
    </div>
  )
}

/** `checked` with `onChange`: the state lives outside the switch. */
export const Controlled: Story = {
  render: (_args, ctx) => <ControlledDemo c={copy(ctx)} />,
}

const INTERACTIONS = ["enabled", "focus", "disabled"] as const
const CHECKED = [false, true] as const

const cellId = (
  variant: string,
  layout: string,
  size: string,
  checked: boolean,
  interaction: string
) => `sw-${variant}-${layout}-${size}-${checked ? "on" : "off"}-${interaction}`

/** `focusVisible` goes on the `<input>`: the focus ring reads it through `peer`. */
const focusTargets = VARIANTS.flatMap((v) =>
  LAYOUTS.flatMap((l) =>
    SIZES.flatMap((s) => CHECKED.map((c) => `#${cellId(v, l, s, c, "focus")} input`))
  )
)

/**
 * Every variant in the Figma set, for the direction on the toolbar.
 *
 * Figma's axes are Direction × Type × State/ON × Sizes × Style: 144 variants.
 * Each section here is one Style × Type, with Sizes × ON down the side and the
 * three interaction states — Enabled, Focus, Disabled — across the top. That is
 * 72 cells, every LTR variant; flip the Direction toolbar for the other 72.
 * (Figma's `State=Checked` / `Unchecked` are the Enabled column, on and off.)
 *
 * Focus renders statically: `storybook-addon-pseudo-states` applies the real
 * `:focus-visible` to each Focus cell's input, so the grid cannot drift from
 * the component. The axis names stay English in both directions — they are
 * Figma property identifiers, not sample copy.
 */
export const AllStates: Story = {
  parameters: {
    layout: "padded",
    pseudo: { focusVisible: focusTargets },
  },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const section = (
      variant: (typeof VARIANTS)[number],
      layout: (typeof LAYOUTS)[number]
    ) => (
      <div key={`${variant}-${layout}`} className="space-y-3">
        <h3 dir="ltr" className="font-sans text-sm font-medium text-foreground">
          Style = {variant} · Type = {layout}
        </h3>
        <div className="grid grid-cols-[5.5rem_repeat(3,11rem)] items-center gap-x-6 gap-y-3">
          <span />
          {INTERACTIONS.map((interaction) => (
            <Head key={interaction}>
              {interaction[0]!.toUpperCase() + interaction.slice(1)}
            </Head>
          ))}
          {SIZES.flatMap((size) =>
            CHECKED.map((checked) => (
              <React.Fragment key={`${size}-${checked}`}>
                <Head>
                  {size} · {checked ? "on" : "off"}
                </Head>
                {INTERACTIONS.map((interaction) => (
                  <div
                    key={interaction}
                    id={cellId(variant, layout, size, checked, interaction)}
                    className="flex min-h-9 items-center"
                  >
                    <Switch
                      variant={variant}
                      layout={layout}
                      size={size}
                      label={c.sync}
                      defaultChecked={checked}
                      disabled={interaction === "disabled"}
                    />
                  </div>
                ))}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    )

    return (
      <div className="space-y-10">
        {VARIANTS.flatMap((variant) => LAYOUTS.map((layout) => section(variant, layout)))}
      </div>
    )
  },
}

const PANELS = [
  { theme: "light", dir: "ltr" },
  { theme: "light", dir: "rtl" },
  { theme: "dark", dir: "ltr" },
  { theme: "dark", dir: "rtl" },
] as const

const panelId = (theme: string, dir: string, variant: string) =>
  `panel-${theme}-${dir}-${variant}-focus`

/**
 * Light and Dark, LTR and RTL, side by side — whatever the toolbars say.
 *
 * Each panel sets its own `dir`, `lang` and font exactly as the direction
 * decorator does, so the Arabic panels get Cairo and the Arabic leading. The
 * Dark panels carry the `dark` class, which re-points every token for that
 * subtree. The page itself is pinned to Light, or a Light panel inside a dark
 * page would inherit the dark tokens.
 */
export const ThemesAndDirections: Story = {
  parameters: {
    layout: "padded",
    themes: { themeOverride: "light" },
    pseudo: {
      focusVisible: PANELS.flatMap((p) =>
        VARIANTS.map((v) => `#${panelId(p.theme, p.dir, v)} input`)
      ),
    },
  },
  render: () => (
    <div className="grid gap-4 lg:grid-cols-2">
      {PANELS.map(({ theme, dir }) => {
        const c = dir === "rtl" ? COPY.rtl : COPY.ltr
        return (
          <div
            key={`${theme}-${dir}`}
            dir={dir}
            lang={dir === "rtl" ? "ar" : "en"}
            className={[
              "space-y-4 rounded-lg border bg-background p-6 text-foreground",
              dir === "rtl" ? "font-arabic" : "font-sans",
              theme === "dark" ? "dark" : "",
            ].join(" ")}
          >
            <Head>
              {theme === "dark" ? "Dark" : "Light"} · {dir.toUpperCase()}
            </Head>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {VARIANTS.map((variant) => (
                <div key={variant} className="flex flex-col gap-4">
                  <Head>{variant}</Head>
                  <Switch variant={variant} label={c.sync} />
                  <Switch variant={variant} label={c.location} defaultChecked />
                  <div id={panelId(theme, dir, variant)}>
                    <Switch variant={variant} label={c.notifications} defaultChecked />
                  </div>
                  <Switch variant={variant} label={c.disabledOn} disabled defaultChecked />
                  <Switch
                    variant={variant}
                    layout="label-first"
                    label={c.dark}
                    description={c.darkDesc}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  ),
}

/**
 * Labels long enough to wrap, at all three sizes and in both layouts. The track
 * must sit on the *first* line, not in the middle of the block. Flip the
 * Direction toolbar to check the same in Arabic, where every line is 24px
 * instead of 20px and the track re-centres itself.
 */
export const WrappedLabel: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex w-72 flex-col gap-6">
        {SIZES.map((size) => (
          <Switch key={size} size={size} label={c.longLabel} defaultChecked />
        ))}
        <Switch label={c.longLabel} description={c.longDesc} />
        <Switch layout="label-first" label={c.longLabel} description={c.longDesc} />
      </div>
    )
  },
}
