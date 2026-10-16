"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"

import { InputNumber, type InputNumberVariant } from "@fasla-ui/ui/input-number"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const VARIANTS: InputNumberVariant[] = [
  "default",
  "vertically-stacked",
  "horizontally-stacked",
  "horizontally-stretched",
  "mini",
]
/** The message key for each variant: the variant's name in the reader's language. */
const VARIANT_KEYS: Record<InputNumberVariant, string> = {
  default: "default",
  "vertically-stacked": "verticallyStacked",
  "horizontally-stacked": "horizontallyStacked",
  "horizontally-stretched": "horizontallyStretched",
  mini: "mini",
}

/** A grid of fields that shares a top edge per row, two columns from `sm` up. */
const GRID = "grid w-full items-start gap-x-6 gap-y-5 sm:grid-cols-2"
/**
 * The same grid aligned to a shared bottom edge, for a row that mixes a field
 * with a label and one without: the two fields then sit on one line.
 */
const GRID_BOTTOM = "grid w-full items-end gap-x-6 gap-y-5 sm:grid-cols-2"

export default function InputNumberPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.inputNumber")
  const locale = useLocale()

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  const props: PropRow[] = [
    {
      prop: "variant",
      type: '"default" | "vertically-stacked" | "horizontally-stacked" | "horizontally-stretched" | "mini"',
      fallback: '"default"',
      description: s.rich("props.variant", rich),
    },
    { prop: "value", type: "number | null", fallback: "", description: s.rich("props.value", rich) },
    { prop: "defaultValue", type: "number", fallback: "", description: s.rich("props.defaultValue", rich) },
    { prop: "onValueChange", type: "(value, details) => void", fallback: "", description: s.rich("props.onValueChange", rich) },
    { prop: "min", type: "number", fallback: "", description: s.rich("props.min", rich) },
    { prop: "max", type: "number", fallback: "", description: s.rich("props.max", rich) },
    { prop: "step", type: 'number | "any"', fallback: "1", description: s.rich("props.step", rich) },
    { prop: "format", type: "Intl.NumberFormatOptions", fallback: "", description: s.rich("props.format", rich) },
    { prop: "locale", type: "Intl.LocalesArgument", fallback: "", description: s.rich("props.locale", rich) },
    { prop: "placeholder", type: "string", fallback: "", description: s.rich("props.placeholder", rich) },
    { prop: "label", type: "ReactNode", fallback: "", description: s.rich("props.label", rich) },
    { prop: "aria-label", type: "string", fallback: "", description: s.rich("props.ariaLabel", rich) },
    { prop: "aria-labelledby", type: "string", fallback: "", description: s.rich("props.ariaLabelledby", rich) },
    { prop: "incrementLabel", type: "string", fallback: "", description: s.rich("props.incrementLabel", rich) },
    { prop: "decrementLabel", type: "string", fallback: "", description: s.rich("props.decrementLabel", rich) },
    { prop: "status", type: '"default" | "success"', fallback: '"default"', description: s.rich("props.status", rich) },
    { prop: "invalid", type: "boolean", fallback: "false", description: s.rich("props.invalid", rich) },
    { prop: "disabled", type: "boolean", fallback: "false", description: s.rich("props.disabled", rich) },
    { prop: "readOnly", type: "boolean", fallback: "false", description: s.rich("props.readOnly", rich) },
    { prop: "required", type: "boolean", fallback: "false", description: s.rich("props.required", rich) },
    { prop: "name", type: "string", fallback: "", description: s.rich("props.name", rich) },
    { prop: "form", type: "string", fallback: "", description: s.rich("props.form", rich) },
    { prop: "id", type: "string", fallback: "", description: s.rich("props.id", rich) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", rich) },
  ]
  const propTables = [{ part: "InputNumber", rows: props }]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/input-number/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="input-number" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <InputNumber className="max-w-xs" label={s("quantity")} defaultValue={1} min={1} max={10} />
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{s.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            {VARIANTS.map((variant) => (
              <InputNumber
                key={variant}
                variant={variant}
                label={s(`variants.${VARIANT_KEYS[variant]}`)}
                defaultValue={2}
                min={0}
                max={10}
              />
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{s.rich("statesBody", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <InputNumber label={s("states.enabled")} placeholder="0" min={0} />
            <InputNumber status="success" label={s("states.success")} defaultValue={4} min={0} />
            <InputNumber invalid label={s("states.invalid")} defaultValue={12} min={0} />
            <InputNumber disabled label={s("states.disabled")} defaultValue={4} min={0} />
          </div>
        </ComponentPreview>
      </section>

      {/* Limits and steps */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("limits.title")}</h2>
        <p className="text-muted-foreground">{s.rich("limits.body", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <InputNumber label={s("limits.guests")} defaultValue={1} min={1} max={8} />
            <InputNumber variant="horizontally-stretched" label={s("limits.nights")} defaultValue={30} min={1} max={30} />
            <InputNumber variant="horizontally-stacked" label={s("limits.weight")} defaultValue={2.5} min={0} step={0.5} />
            <InputNumber variant="vertically-stacked" label={s("limits.seats")} defaultValue={20} min={0} step={10} />
          </div>
        </ComponentPreview>
      </section>

      {/* Digits and formatting */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("format.title")}</h2>
        <p className="text-muted-foreground">{s.rich("format.body", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <InputNumber
              label={s("format.price")}
              locale={locale}
              format={{ style: "currency", currency: "SAR" }}
              defaultValue={1250}
              min={0}
              step={50}
            />
            <InputNumber
              label={s("format.discount")}
              locale={locale}
              format={{ style: "percent" }}
              defaultValue={0.15}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Label */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("label.title")}</h2>
        <p className="text-muted-foreground">{s.rich("label.body", rich)}</p>
        <ComponentPreview>
          <div className={GRID_BOTTOM}>
            <InputNumber label={s("quantity")} defaultValue={1} min={1} />
            <InputNumber variant="mini" aria-label={s("quantity")} defaultValue={1} min={1} />
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.roles", rich)}</li>
          <li>{s.rich("a11y.keyboard", rich)}</li>
          <li>{s.rich("a11y.buttons", rich)}</li>
          <li>{s.rich("a11y.touch", rich)}</li>
          <li>{s.rich("a11y.label", rich)}</li>
          <li>{s.rich("a11y.direction", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        {propTables.map(({ part, rows }) => (
          <div key={part} className="space-y-3">
            <h3 className="text-lg font-semibold">
              <code dir="ltr">{part}</code>
            </h3>
            <PropsTable rows={rows} />
          </div>
        ))}
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={s("usage.basic")}>{`import { InputNumber } from "@/components/ui/input-number"

export function QuantityField() {
  return <InputNumber name="quantity" label="${s("quantity")}" defaultValue={1} min={1} max={10} />
}`}</UsageExample>
        <UsageExample title={s("usage.controlled")}>{`"use client"

import * as React from "react"
import { InputNumber } from "@/components/ui/input-number"

export function GuestsField() {
  const [guests, setGuests] = React.useState<number | null>(2)
  return (
    <InputNumber
      variant="horizontally-stretched"
      label="${s("limits.guests")}"
      value={guests}
      onValueChange={setGuests}
      min={1}
      max={8}
    />
  )
}`}</UsageExample>
        <UsageExample title={s("usage.format")}>{`import { InputNumber } from "@/components/ui/input-number"

export function PriceField() {
  return (
    <InputNumber
      name="price"
      label="${s("format.price")}"
      format={{ style: "currency", currency: "SAR" }}
      defaultValue={1250}
      min={0}
      step={50}
    />
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
