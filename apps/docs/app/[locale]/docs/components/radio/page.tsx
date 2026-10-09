"use client"

import { useLocale, useTranslations } from "next-intl"

import { useState } from "react"
import { Radio } from "@fasla-ui/ui/radio"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { PropsTable, type PropRow } from "@/components/props-table"
import { componentRoutes, routeText } from "@/lib/seo-routes"
import type { Locale } from "@/i18n/routing"

const route = componentRoutes.find((candidate) => candidate.path === "/docs/components/radio/")!

/** The literal element name, passed as a value so ICU does not parse it as a tag. */
const INPUT = '<input type="radio">'

export default function RadioPage() {
  const locale = useLocale() as Locale
  const t = useTranslations("docs.sections")
  const r = useTranslations("docs.radio")
  const [plan, setPlan] = useState("standard")

  // Prop and element names are code identifiers, so they stay Latin in both
  // locales; the sentence around them is the locale's. `nowrap` keeps each one
  // a single unit: `aria-describedby` must not break at its hyphen.
  const code = (chunks: React.ReactNode) => (
    <code className="whitespace-nowrap text-sm">{chunks}</code>
  )
  const rich = { code, input: INPUT }

  // One table, in a fixed order: appearance and state first, then text, then
  // the native <input> props a radio group needs, then styling.
  const props: PropRow[] = [
    { prop: "variant", type: '"default" | "layout"', fallback: '"default"', description: r.rich("props.variant", rich) },
    { prop: "size", type: '"sm" | "md" | "lg"', fallback: '"md"', description: r.rich("props.size", rich) },
    { prop: "checked", type: "boolean", fallback: "", description: r.rich("props.checkedProp", rich) },
    { prop: "disabled", type: "boolean", fallback: "false", description: r.rich("props.disabledProp", rich) },
    { prop: "label", type: "string", fallback: "", description: r.rich("props.label", rich) },
    { prop: "description", type: "string", fallback: "", description: r.rich("props.descriptionProp", rich) },
    { prop: "name", type: "string", fallback: "", description: r.rich("props.nameProp", rich) },
    { prop: "value", type: "string", fallback: "", description: r.rich("props.valueProp", rich) },
    { prop: "onChange", type: "(event) => void", fallback: "", description: r.rich("props.onChangeProp", rich) },
    { prop: "className", type: "string", fallback: "", description: r.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{routeText(route, locale).h1}</h1>
        <p className="text-xl text-muted-foreground">{r("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="radio" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex max-w-xs flex-col gap-4">
            <Radio name="preview" value="a" label={r("preview.standard")} defaultChecked />
            <Radio name="preview" value="b" label={r("preview.express")} />
            <Radio name="preview" value="c" label={r("preview.courier")} disabled />
            {/* Long enough to wrap: the control must stay on the first line. */}
            <Radio name="preview" value="d" label={r("preview.long")} />
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{r.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Radio name="v-default" value="a" label={r("variants.defaultA")} defaultChecked />
              <Radio name="v-default" value="b" label={r("variants.defaultB")} />
            </div>
            <div className="flex flex-col gap-2">
              <Radio
                name="v-layout"
                value="a"
                variant="layout"
                label={r("variants.layoutA")}
                description={r("variants.layoutADescription")}
                className="w-full"
                defaultChecked
              />
              <Radio
                name="v-layout"
                value="b"
                variant="layout"
                label={r("variants.layoutB")}
                description={r("variants.layoutBDescription")}
                className="w-full"
              />
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            <Radio name="sizes" value="sm" size="sm" label={r("sizes.sm")} />
            <Radio name="sizes" value="md" size="md" label={r("sizes.md")} defaultChecked />
            <Radio name="sizes" value="lg" size="lg" label={r("sizes.lg")} />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{r("statesBody")}</p>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            <Radio name="states-a" label={r("states.unselected")} />
            <Radio name="states-b" label={r("states.selected")} defaultChecked />
            <Radio name="states-c" label={r("states.disabled")} disabled />
            <Radio name="states-d" label={r("states.disabledSelected")} disabled defaultChecked />
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{r.rich("a11y.nativeInput", rich)}</li>
          <li>{r.rich("a11y.group", rich)}</li>
          <li>{r.rich("a11y.describedBy", rich)}</li>
          <li>{r.rich("a11y.ariaLabel", rich)}</li>
          <li>{r.rich("a11y.direction", rich)}</li>
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
        <UsageExample title={r("usage.commentGroup")}>{`import { Radio } from "@/components/ui/radio"

export function DeliveryOptions() {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-sm font-medium">${r("usage.codeLegend")}</legend>
      <Radio name="delivery" value="standard" label="${r("usage.codeStandard")}" defaultChecked />
      <Radio name="delivery" value="express" label="${r("usage.codeExpress")}" />
    </fieldset>
  )
}`}</UsageExample>
        <UsageExample title={r("usage.commentDescription")}>{`import { Radio } from "@/components/ui/radio"

export function DeliveryOptions() {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-sm font-medium">${r("usage.codeLegend")}</legend>
      <Radio
        name="delivery"
        value="standard"
        label="${r("usage.codeStandard")}"
        description="${r("usage.standardDescription")}"
        defaultChecked
      />
      <Radio
        name="delivery"
        value="courier"
        label="${r("usage.codeCourier")}"
        description="${r("usage.codeCourierDescription")}"
      />
    </fieldset>
  )
}`}</UsageExample>
        <UsageExample title={r("usage.commentLayout")}>{`import { Radio } from "@/components/ui/radio"

export function DeliveryCards() {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-sm font-medium">${r("usage.codeLegend")}</legend>
      <Radio variant="layout" name="delivery" value="standard" label="${r("usage.codeStandard")}" defaultChecked />
      <Radio variant="layout" name="delivery" value="express" label="${r("usage.codeExpress")}" />
    </fieldset>
  )
}`}</UsageExample>
        <UsageExample title={r("usage.commentControlled")}>{`"use client"

import { useState } from "react"
import { Radio } from "@/components/ui/radio"

export function ControlledDeliveryOptions() {
  const [delivery, setDelivery] = useState("standard")

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-sm font-medium">${r("usage.codeLegend")}</legend>
      <Radio
        name="delivery"
        value="standard"
        label="${r("usage.codeStandard")}"
        checked={delivery === "standard"}
        onChange={(e) => setDelivery(e.target.value)}
      />
      <Radio
        name="delivery"
        value="express"
        label="${r("usage.codeExpress")}"
        checked={delivery === "express"}
        onChange={(e) => setDelivery(e.target.value)}
      />
    </fieldset>
  )
}`}</UsageExample>
        <ComponentPreview>
          <div className="flex w-full max-w-sm flex-col gap-2">
            {[
              { value: "standard", label: r("usage.standard"), description: r("usage.standardDescription") },
              { value: "express", label: r("usage.express"), description: r("usage.expressDescription") },
            ].map((option) => (
              <Radio
                key={option.value}
                name="controlled"
                value={option.value}
                variant="layout"
                label={option.label}
                description={option.description}
                className="w-full"
                checked={plan === option.value}
                onChange={(e) => setPlan(e.target.value)}
              />
            ))}
            <p className="text-sm text-muted-foreground">
              {r("usage.selected")} <code className="text-sm">{plan}</code>
            </p>
          </div>
        </ComponentPreview>
      </section>
    </div>
  )
}
