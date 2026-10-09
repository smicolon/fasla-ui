"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import { Switch } from "@fasla-ui/ui/switch"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"
import { localeDirection, type Locale } from "@/i18n/routing"

/** The literal element name, passed as a value so ICU does not parse it as a tag. */
const INPUT = '<input type="checkbox" role="switch">'

const VARIANTS = ["solid", "outline"] as const
const SIZES = ["sm", "md", "lg"] as const

export default function SwitchPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.switch")
  const isRtl = localeDirection[useLocale() as Locale] === "rtl"
  const [enabled, setEnabled] = useState(true)

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; the sentence around them is the locale's. `nowrap` keeps each one
  // a single unit: `aria-describedby` must not break at its hyphen.
  const code = (chunks: React.ReactNode) => (
    <code className="whitespace-nowrap text-sm">{chunks}</code>
  )
  const rich = { code, input: INPUT }

  // One table, in a fixed order: appearance first, then state, then text,
  // then the native <input> props a form needs, then styling.
  const props: PropRow[] = [
    { prop: "variant", type: '"solid" | "outline"', fallback: '"solid"', description: s.rich("props.variant", rich) },
    { prop: "layout", type: '"control-first" | "label-first"', fallback: '"control-first"', description: s.rich("props.layout", rich) },
    { prop: "size", type: '"sm" | "md" | "lg"', fallback: '"md"', description: s.rich("props.size", rich) },
    { prop: "checked", type: "boolean", fallback: "", description: s.rich("props.checked", rich) },
    { prop: "defaultChecked", type: "boolean", fallback: "false", description: s.rich("props.defaultChecked", rich) },
    { prop: "disabled", type: "boolean", fallback: "false", description: s.rich("props.disabled", rich) },
    { prop: "label", type: "string", fallback: "", description: s.rich("props.label", rich) },
    { prop: "description", type: "string", fallback: "", description: s.rich("props.description", rich) },
    { prop: "name", type: "string", fallback: "", description: s.rich("props.name", rich) },
    { prop: "onChange", type: "(event) => void", fallback: "", description: s.rich("props.onChange", rich) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/switch/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="switch" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex max-w-xs flex-col gap-4">
            <Switch label={s("examples.airplane")} />
            <Switch label={s("examples.notifications")} description={s("examples.notificationsDescription")} defaultChecked />
            {/* Long enough to wrap: the track must stay on the first line. */}
            <Switch label={s("examples.long")} defaultChecked />
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{s.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full max-w-md gap-8 sm:grid-cols-2">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col gap-4">
                <code className="w-fit text-sm text-muted-foreground">{variant}</code>
                <Switch variant={variant} label={s("examples.sync")} />
                <Switch variant={variant} label={s("examples.location")} defaultChecked />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{s.rich("sizesBody", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full max-w-md gap-8 sm:grid-cols-2">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col gap-4">
                <code className="w-fit text-sm text-muted-foreground">{variant}</code>
                {SIZES.map((size) => (
                  <Switch
                    key={size}
                    variant={variant}
                    size={size}
                    label={s(`sizes.${size}`)}
                    defaultChecked
                  />
                ))}
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("layoutTitle")}</h2>
        <p className="text-muted-foreground">{s.rich("layoutBody", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <code className="w-fit text-sm text-muted-foreground">control-first</code>
              <Switch label={s("examples.dark")} description={s("examples.darkDescription")} />
              <Switch
                label={s("examples.notifications")}
                description={s("examples.notificationsDescription")}
                defaultChecked
              />
            </div>
            <div className="flex flex-col gap-4">
              <code className="w-fit text-sm text-muted-foreground">label-first</code>
              {/* A settings list: each row fills the card, track at the end. */}
              <div className="divide-y rounded-lg border">
                <Switch
                  layout="label-first"
                  label={s("examples.dark")}
                  description={s("examples.darkDescription")}
                  className="p-4"
                />
                <Switch
                  layout="label-first"
                  label={s("examples.notifications")}
                  description={s("examples.notificationsDescription")}
                  className="p-4"
                  defaultChecked
                />
                <Switch layout="label-first" label={s("examples.airplane")} className="p-4" />
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{s("statesBody")}</p>
        <ComponentPreview>
          <div className="grid w-full max-w-md gap-8 sm:grid-cols-2">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col gap-4">
                <code className="w-fit text-sm text-muted-foreground">{variant}</code>
                <Switch variant={variant} label={s("states.off")} />
                <Switch variant={variant} label={s("states.on")} defaultChecked />
                <Switch variant={variant} label={s("states.disabledOff")} disabled />
                <Switch variant={variant} label={s("states.disabledOn")} disabled defaultChecked />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.nativeInput", rich)}</li>
          <li>{s.rich("a11y.describedBy", rich)}</li>
          <li>{s.rich("a11y.ariaLabel", rich)}</li>
          <li>{s.rich("a11y.direction", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={s("usage.basic")}>{`import { Switch } from "@/components/ui/switch"

export function AirplaneModeSwitch() {
  return <Switch name="airplane" aria-label="${s("examples.airplane")}" />
}`}</UsageExample>
        <UsageExample title={s("usage.withLabel")}>{`import { Switch } from "@/components/ui/switch"

export function AirplaneModeSwitch() {
  return <Switch name="airplane" label="${s("examples.airplane")}" defaultChecked />
}`}</UsageExample>
        <UsageExample title={s("usage.withDescription")}>{`import { Switch } from "@/components/ui/switch"

export function DarkModeSwitch() {
  return (
    <Switch
      name="dark-mode"
      label="${s("examples.dark")}"
      description="${s("examples.darkDescription")}"
    />
  )
}`}</UsageExample>
        <UsageExample title={s("usage.outline")}>{`import { Switch } from "@/components/ui/switch"

export function AutoSyncSwitch() {
  return <Switch name="auto-sync" variant="outline" label="${s("examples.sync")}" />
}`}</UsageExample>
        <UsageExample title={s("usage.labelFirst")}>{`import { Switch } from "@/components/ui/switch"

export function NotificationsSwitch() {
  return <Switch name="notifications" layout="label-first" label="${s("examples.notifications")}" />
}`}</UsageExample>
        <UsageExample title={s("usage.sizes")}>{`import { Switch } from "@/components/ui/switch"

export function SwitchSizes() {
  return (
    <div className="flex flex-col gap-4">
      <Switch size="sm" label="${s("sizes.sm")}" />
      <Switch size="md" label="${s("sizes.md")}" />
      <Switch size="lg" label="${s("sizes.lg")}" />
    </div>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.controlled")}>{`"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export function ControlledNotificationsSwitch() {
  const [enabled, setEnabled] = useState(true)

  return (
    <Switch
      name="notifications"
      label="${s("examples.notifications")}"
      checked={enabled}
      onChange={(e) => setEnabled(e.target.checked)}
    />
  )
}`}</UsageExample>
        <ComponentPreview>
          <div className="flex flex-col gap-3">
            <Switch
              label={s("examples.notifications")}
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <p className="text-sm text-muted-foreground">
              {s("usage.state")}{" "}
              {/* Arabic never goes in a code span: its mono face has no Arabic glyphs. */}
              {isRtl ? (
                <span className="font-medium text-foreground">{s(enabled ? "usage.on" : "usage.off")}</span>
              ) : (
                <code className="text-sm">{s(enabled ? "usage.on" : "usage.off")}</code>
              )}
            </p>
          </div>
        </ComponentPreview>
      </section>
    </div>
  )
}
